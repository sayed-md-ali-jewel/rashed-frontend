const { createServer } = require('http');
const next = require('next');
const fs = require('fs');
const path = require('path');

const dev = process.env.NODE_ENV !== 'production';
if (!process.env.NODE_ENV) {
  process.env.NODE_ENV = 'development';
}
if (!process.env.NEXT_PUBLIC_SITE_URL && process.env.NODE_ENV === 'production') {
  process.env.NEXT_PUBLIC_SITE_URL = 'https://drrashed.bd';
}

const hostname = process.env.HOSTNAME || '0.0.0.0';
const port = parseInt(process.env.PORT || '3000', 10);

const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

const MIME_TYPES = {
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.webp': 'image/webp',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.avif': 'image/avif',
  '.bmp': 'image/bmp',
  '.pdf': 'application/pdf',
  '.mp4': 'video/mp4'
};

function tryServeUpload(req, res) {
  if (!req.url || !req.url.startsWith('/uploads/')) return false;

  const urlPath = req.url.split('?')[0];
  let rawFilename = urlPath.slice('/uploads/'.length);
  if (!rawFilename || rawFilename.includes('..')) return false;

  let decodedFilename = rawFilename;
  try {
    decodedFilename = decodeURIComponent(rawFilename);
  } catch (e) {
    // Keep raw
  }

  if (decodedFilename.includes('..') || decodedFilename.includes('\\')) return false;

  const filenameVariants = new Set([
    rawFilename,
    decodedFilename,
    path.basename(rawFilename),
    path.basename(decodedFilename),
    path.basename(decodedFilename).replace(/ /g, '_'),
    path.basename(decodedFilename).replace(/_/g, ' ')
  ]);

  const candidateDirs = [
    path.join(process.cwd(), 'public', 'uploads'),
    path.join(process.cwd(), 'public', 'public', 'uploads'),
    path.join(process.cwd(), 'uploads'),
    path.resolve(process.cwd(), '..', 'public', 'uploads'),
    path.resolve(process.cwd(), '..', 'public', 'public', 'uploads'),
    path.resolve(process.cwd(), '..', 'uploads'),
    path.resolve(process.cwd(), '..', 'public_html', 'uploads'),
    path.resolve(process.cwd(), '..', '..', 'public_html', 'uploads')
  ];

  for (const dir of candidateDirs) {
    for (const filename of filenameVariants) {
      const filePath = path.join(dir, filename);
      if (fs.existsSync(filePath)) {
        try {
          const stat = fs.statSync(filePath);
          if (stat.isFile()) {
            const ext = path.extname(filename).toLowerCase();
            const contentType = MIME_TYPES[ext] || 'application/octet-stream';
            res.writeHead(200, {
              'Content-Type': contentType,
              'Content-Length': stat.size,
              'Cache-Control': 'public, max-age=31536000, immutable',
              'Accept-Ranges': 'bytes'
            });
            fs.createReadStream(filePath).pipe(res);
            return true;
          }
        } catch {
          // Fall back to Next.js route handler
        }
      }
    }
  }
  return false;
}

const { Server: SocketIOServer } = require('socket.io');

app.prepare().then(() => {
  const server = createServer((req, res) => {
    // Attempt direct upload serving
    if (tryServeUpload(req, res)) {
      return;
    }

    const isNextStaticAsset = req.url?.startsWith('/_next/static/');
    const acceptsHtml = req.headers.accept?.includes('text/html');

    if (acceptsHtml && !isNextStaticAsset) {
      res.setHeader('Cache-Control', 'no-store, max-age=0, must-revalidate');
    }

    handle(req, res);
  });

  // Attach Socket.IO server for real-time doctor-patient messaging
  const io = new SocketIOServer(server, {
    path: '/api/socket/io',
    cors: {
      origin: '*',
      methods: ['GET', 'POST']
    },
    pingTimeout: 20000,
    pingInterval: 10000
  });

  global._socketIo = io;
  global._onlineUsers = global._onlineUsers || new Map();

  io.on('connection', (socket) => {
    socket.on('user:join', (data) => {
      if (!data) return;
      const userKey = data.role === 'doctor' ? 'doctor' : (data.phone || data.userId || socket.id);
      global._onlineUsers.set(userKey, {
        role: data.role,
        lastSeen: new Date(),
        socketId: socket.id
      });
      if (data.role === 'doctor') {
        socket.join('room_doctor');
      } else {
        socket.join(`room_patient_${userKey}`);
        if (data.phone && String(data.phone) !== String(userKey)) {
          socket.join(`room_patient_${data.phone}`);
        }
      }
      io.emit('user:online', { userKey, role: data.role, lastSeen: new Date().toISOString() });
    });

    socket.on('conversation:join', (conversationId) => {
      if (!conversationId) return;
      socket.join(`room_conv_${String(conversationId)}`);
    });

    socket.on('conversation:leave', (conversationId) => {
      if (!conversationId) return;
      socket.leave(`room_conv_${String(conversationId)}`);
    });

    socket.on('typing:start', (data) => {
      if (!data?.conversationId) return;
      const convId = String(data.conversationId);
      socket.to(`room_conv_${convId}`).emit('typing:start', data);
      if (data.senderType === 'patient') {
        socket.to('room_doctor').emit('typing:start', data);
      }
    });

    socket.on('typing:stop', (data) => {
      if (!data?.conversationId) return;
      const convId = String(data.conversationId);
      socket.to(`room_conv_${convId}`).emit('typing:stop', data);
      if (data.senderType === 'patient') {
        socket.to('room_doctor').emit('typing:stop', data);
      }
    });

    socket.on('message:read', (data) => {
      if (!data?.conversationId) return;
      io.to(`room_conv_${data.conversationId}`).emit('message:read', {
        ...data,
        readAt: new Date().toISOString()
      });
    });

    socket.on('disconnect', () => {
      if (!global._onlineUsers) return;
      for (const [key, val] of global._onlineUsers.entries()) {
        if (val.socketId === socket.id) {
          const lastSeen = new Date();
          global._onlineUsers.delete(key);
          io.emit('user:offline', { userKey: key, role: val.role, lastSeen: lastSeen.toISOString() });
          break;
        }
      }
    });
  });

  server.listen(port, (err) => {
    if (err) throw err;
    console.log(`Server running on port ${port}`);
  });
}).catch((err) => {
  console.error('Error starting server:', err);
  process.exit(1);
});
