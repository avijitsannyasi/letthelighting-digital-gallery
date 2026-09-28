import { MongoClient } from "mongodb";

// Cache the connection promise across hot reloads (dev) and warm invocations (prod).
const cache = global._mongoClientCache || (global._mongoClientCache = { promise: null });

function getClientPromise() {
  if (cache.promise) return cache.promise;

  const uri = process.env.MONGODB_URI;

  if (!uri) {
    throw new Error("Please add MONGODB_URI to .env.local");
  }

  cache.promise = new MongoClient(uri).connect().catch((err) => {
    // Drop the failed promise so the next request retries instead of reusing the rejection.
    cache.promise = null;
    throw err;
  });

  return cache.promise;
}

export default getClientPromise;

export async function getDb() {
  const client = await getClientPromise();
  return client.db("photography-gallery");
}
