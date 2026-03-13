import { MongoClient } from "mongodb";
import dns from "dns";
import { config } from "dotenv";
config({ path: ".env.local" });

dns.setServers(["8.8.8.8", "8.8.4.4", "1.1.1.1"]);

const uri = process.env.MONGODB_URI;
if (!uri) {
  console.error("Set MONGODB_URI in .env.local first");
  process.exit(1);
}

async function seed() {
  const client = new MongoClient(uri);
  await client.connect();
  const db = client.db("photography-gallery");

  // Settings
  await db.collection("settings").updateOne(
    { _type: "settings" },
    {
      $setOnInsert: {
        _type: "settings",
        companyName: "Let the Light In",
        logo: "/images/general/logo-green.webp",
        logoDark: "/images/general/logo.png",
        websiteUrl: "https://example.com",
        email: "hello@lensandlight.com",
        phone: "+1 (555) 123-4567",
        social: {
          facebook: "https://facebook.com",
          instagram: "https://instagram.com",
          linkedin: "https://linkedin.com",
          pinterest: "https://pinterest.com",
        },
        adminPassword: "admin123",
      },
    },
    { upsert: true }
  );
  console.log("Settings seeded");

  // Categories
  const catCount = await db.collection("categories").countDocuments();
  if (catCount === 0) {
    await db.collection("categories").insertMany([
      {
        name: "Corporate Photography",
        slug: "corporate-photography",
        password: "corporate2024",
        description: "Professional corporate photography capturing the essence of your brand, team, and business environment.",
        bannerImage: "/images/general/corporate-photography.webp",
        createdAt: new Date(),
      },
      {
        name: "Event Photography",
        slug: "event-photography",
        password: "event2024",
        description: "Stunning event photography that preserves the energy, emotions, and memorable moments of your special occasions.",
        bannerImage: "/images/general/wedding-photography.webp",
        createdAt: new Date(),
      },
      {
        name: "Birthday Photography",
        slug: "birthday-photography",
        password: "birthday2024",
        description: "Joyful birthday photography that captures the laughter, celebrations, and cherished moments of your special day.",
        bannerImage: "/images/general/birthday-photography.webp",
        createdAt: new Date(),
      },
    ]);
    console.log("Categories seeded");
  } else {
    console.log("Categories already exist, skipping");
  }

  // Slider
  const sliderCount = await db.collection("slider").countDocuments();
  if (sliderCount === 0) {
    await db.collection("slider").insertMany([
      { src: "/images/general/corporate-photography.webp", category: "Corporate Photography", createdAt: new Date() },
      { src: "/images/general/wedding-photography.webp", category: "Wedding Photography", createdAt: new Date() },
      { src: "/images/general/birthday-photography.webp", category: "Birthday Photography", createdAt: new Date() },
      { src: "/images/general/pre-wedding-photography.webp", category: "Pre-Wedding Photography", createdAt: new Date() },
      { src: "/images/general/family-photography.webp", category: "Family Photography", createdAt: new Date() },
      { src: "/images/general/matternity-photography.webp", category: "Maternity Photography", createdAt: new Date() },
    ]);
    console.log("Slider seeded");
  } else {
    console.log("Slider already exists, skipping");
  }

  await client.close();
  console.log("Done!");
}

seed().catch(console.error);
