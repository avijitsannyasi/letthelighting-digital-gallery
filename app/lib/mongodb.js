import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI;

let clientPromise;

function getClientPromise() {
  if (clientPromise) return clientPromise;

  if (!uri) {
    throw new Error("Please add MONGODB_URI to .env.local");
  }

  if (process.env.NODE_ENV === "development") {
    if (!global._mongoClientPromise) {
      global._mongoClientPromise = new MongoClient(uri).connect();
    }
    clientPromise = global._mongoClientPromise;
  } else {
    clientPromise = new MongoClient(uri).connect();
  }

  return clientPromise;
}

export default getClientPromise;

export async function getDb() {
  const client = await getClientPromise();
  return client.db("photography-gallery");
}
