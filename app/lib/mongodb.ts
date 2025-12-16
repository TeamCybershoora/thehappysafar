import { MongoClient, type Db } from "mongodb";

const rawUri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB ?? "the-happy-safar";

if (!rawUri) {
  throw new Error("Missing MONGODB_URI in environment.");
}

const uri: string = rawUri;

let cachedClient: MongoClient | null = null;
let cachedDb: Db | null = null;

export async function getDb() {
  if (cachedDb && cachedClient) {
    return cachedDb;
  }

  const client = cachedClient ?? new MongoClient(uri);
  await client.connect();

  cachedClient = client;
  cachedDb = client.db(dbName);
  return cachedDb;
}
