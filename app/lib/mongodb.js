import { MongoClient } from "mongodb";
import dns from "dns";

// Fix for routers/networks where SRV lookups fail with default DNS
dns.setServers(["8.8.8.8", "8.8.4.4", "1.1.1.1"]);

const uri = process.env.MONGODB_URI;

let client;
let clientPromise;

if (!uri) {
  throw new Error("Please add MONGODB_URI to .env.local");
}

if (process.env.NODE_ENV === "development") {
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri);
    global._mongoClientPromise = client.connect();
  }
  clientPromise = global._mongoClientPromise;
} else {
  client = new MongoClient(uri);
  clientPromise = client.connect();
}

export default clientPromise;

export async function getDb() {
  const client = await clientPromise;
  return client.db("photography-gallery");
}
