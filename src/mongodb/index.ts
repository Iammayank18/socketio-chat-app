import { MongoClient, Db, Collection } from "mongodb";

const uri = process.env.MONGODB_URI as string;
const options = {};

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

if (!process.env.MONGODB_URI) {
  throw new Error("Add MONGODB_URI to .env.local");
}

if (process.env.NODE_ENV === "development") {
  if (!(global as any)._mongoClientPromise) {
    client = new MongoClient(uri, options);
    (global as any)._mongoClientPromise = client.connect();
  }
  clientPromise = (global as any)._mongoClientPromise;
} else {
  client = new MongoClient(uri, options);
  clientPromise = client.connect();
}

export async function getDB(): Promise<{
  db: Db;
  getCollection: <T>(name: string) => Collection<T>;
}> {
  const client = await clientPromise;
  const db = client.db(process.env.MONGODB_DB); // Change this to your database name

  function getCollection<T>(name: string): Collection<T> {
    return db.collection<T>(name);
  }

  return { db, getCollection };
}

export default clientPromise;
