import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

type MongooseCache = {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
};

const globalForMongoose = globalThis as typeof globalThis & {
  mongooseCache?: MongooseCache;
};

const cache = globalForMongoose.mongooseCache ?? { conn: null, promise: null };
globalForMongoose.mongooseCache = cache;

export function hasMongoUri() {
  return Boolean(MONGODB_URI);
}

export async function connectMongo() {
  if (!MONGODB_URI) {
    throw new Error("MONGODB_URI is not configured");
  }

  if (cache.conn) {
    return cache.conn;
  }

  cache.promise ??= mongoose.connect(MONGODB_URI, {
    bufferCommands: false
  });

  cache.conn = await cache.promise;
  return cache.conn;
}
