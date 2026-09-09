import { NextResponse } from "next/server";
import fs from "fs/promises";
import { existsSync } from "fs";
import path from "path";

// MIME types mapping
const MIME_TYPES: Record<string, string> = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
  ".gif": "image/gif",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
  ".avif": "image/avif",
  ".bmp": "image/bmp",
  ".tiff": "image/tiff",
  ".tif": "image/tiff",
  ".pdf": "application/pdf",
  ".mp4": "video/mp4",
  ".webm": "video/webm",
  ".mp3": "audio/mpeg",
  ".wav": "audio/wav",
  ".txt": "text/plain; charset=utf-8",
  ".json": "application/json; charset=utf-8"
};

function getMimeType(filename: string): string {
  const ext = path.extname(filename).toLowerCase();
  return MIME_TYPES[ext] || "application/octet-stream";
}

function resolveUploadPath(pathSegments: string[]): string | null {
  // Prevent directory traversal attacks
  const sanitizedSegments = pathSegments
    .map((seg) => seg.replace(/[^a-zA-Z0-9._-]/g, ""))
    .filter(Boolean);

  if (
    sanitizedSegments.length === 0 ||
    sanitizedSegments.some((s) => s.includes(".."))
  ) {
    return null;
  }

  const relativeSubPath = path.join(...sanitizedSegments);

  // Search candidate root directories where uploads might be located in dev or production
  const candidateDirs = [
    path.join(process.cwd(), "public", "uploads"),
    path.join(process.cwd(), "public", "public", "uploads"),
    path.join(process.cwd(), "uploads"),
    path.resolve(process.cwd(), "public/uploads"),
    path.resolve(process.cwd(), "public/public/uploads"),
    path.resolve(process.cwd(), "..", "public", "uploads"),
    path.resolve(process.cwd(), "..", "public", "public", "uploads"),
    path.resolve(process.cwd(), "..", "uploads"),
    path.resolve(process.cwd(), "..", "public_html", "uploads"),
    path.resolve(__dirname, "..", "..", "..", "public", "uploads"),
    path.resolve(__dirname, "..", "..", "..", "public", "public", "uploads"),
    path.resolve(__dirname, "..", "..", "..", "..", "public", "uploads"),
    path.resolve(__dirname, "..", "..", "..", "..", "public", "public", "uploads"),
    path.resolve(__dirname, "public", "uploads"),
    path.resolve(__dirname, "public", "public", "uploads")
  ];

  for (const dir of candidateDirs) {
    const fullPath = path.join(dir, relativeSubPath);
    if (existsSync(fullPath)) {
      return fullPath;
    }
  }

  return null;
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ path: string[] }> }
) {
  try {
    const { path: pathSegments } = await params;
    if (!pathSegments || pathSegments.length === 0) {
      return NextResponse.json({ error: "File not specified" }, { status: 400 });
    }

    const filePath = resolveUploadPath(pathSegments);
    if (!filePath) {
      return NextResponse.json({ error: "File not found" }, { status: 404 });
    }

    const stat = await fs.stat(filePath);
    if (stat.isDirectory()) {
      return NextResponse.json({ error: "Path is a directory" }, { status: 400 });
    }

    const mimeType = getMimeType(filePath);
    const etag = `W/"${stat.size}-${stat.mtimeMs}"`;

    // Check If-None-Match for 304 caching
    const ifNoneMatch = request.headers.get("if-none-match");
    if (ifNoneMatch && ifNoneMatch === etag) {
      return new NextResponse(null, {
        status: 304,
        headers: {
          ETag: etag,
          "Cache-Control": "public, max-age=31536000, immutable"
        }
      });
    }

    const fileBuffer = await fs.readFile(filePath);

    return new NextResponse(fileBuffer, {
      status: 200,
      headers: {
        "Content-Type": mimeType,
        "Content-Length": stat.size.toString(),
        "Cache-Control": "public, max-age=31536000, immutable",
        ETag: etag,
        "Last-Modified": stat.mtime.toUTCString(),
        "Accept-Ranges": "bytes"
      }
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function HEAD(
  _request: Request,
  { params }: { params: Promise<{ path: string[] }> }
) {
  try {
    const { path: pathSegments } = await params;
    if (!pathSegments || pathSegments.length === 0) {
      return new NextResponse(null, { status: 400 });
    }

    const filePath = resolveUploadPath(pathSegments);
    if (!filePath) {
      return new NextResponse(null, { status: 404 });
    }

    const stat = await fs.stat(filePath);
    if (stat.isDirectory()) {
      return new NextResponse(null, { status: 400 });
    }

    const mimeType = getMimeType(filePath);
    const etag = `W/"${stat.size}-${stat.mtimeMs}"`;

    return new NextResponse(null, {
      status: 200,
      headers: {
        "Content-Type": mimeType,
        "Content-Length": stat.size.toString(),
        "Cache-Control": "public, max-age=31536000, immutable",
        ETag: etag,
        "Last-Modified": stat.mtime.toUTCString(),
        "Accept-Ranges": "bytes"
      }
    });
  } catch {
    return new NextResponse(null, { status: 500 });
  }
}
