// <CHANGE> MongoDB connection via Mongoose with global cache
import mongoose from "mongoose"

const MONGODB_URI = process.env.MONGODB_URI
if (!MONGODB_URI) {
  throw new Error("MONGODB_URI is not set in Project Settings")
}

type GlobalWithMongoose = typeof globalThis & {
  mongooseConn?: { conn: typeof mongoose | null; promise: Promise<typeof mongoose> | null }
}

const g = global as GlobalWithMongoose
if (!g.mongooseConn) {
  g.mongooseConn = { conn: null, promise: null }
}

export async function dbConnect() {
  if (g.mongooseConn!.conn) return g.mongooseConn!.conn
  if (!g.mongooseConn!.promise) {
    g.mongooseConn!.promise = mongoose.connect(MONGODB_URI, {
      dbName: "notes",
    })
  }
  g.mongooseConn!.conn = await g.mongooseConn!.promise
  return g.mongooseConn!.conn
}
