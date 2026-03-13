import { getDb } from "./mongodb";

export async function getCategories() {
  const db = await getDb();
  const categories = await db.collection("categories").find({}).toArray();
  return categories.map(({ _id, ...rest }) => ({ id: _id.toString(), ...rest }));
}

export async function getGalleryImages(slug) {
  const db = await getDb();
  const images = await db.collection("galleries").find({ slug }).sort({ order: 1 }).toArray();
  return images.map(({ _id, slug: _slug, order, ...rest }) => ({ id: _id.toString(), ...rest }));
}

export async function getSliderImages() {
  const db = await getDb();
  const slides = await db.collection("slider").find({}).toArray();
  return slides.map(({ _id, ...rest }) => ({ id: _id.toString(), ...rest }));
}

export async function getSiteConfig() {
  const db = await getDb();
  const settings = await db.collection("settings").findOne({ _type: "settings" });
  if (!settings) return {};
  const { _id, _type, adminPassword, ...config } = settings;
  return config;
}
