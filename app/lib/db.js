import { getDb } from "./mongodb";

// Settings
export async function getSettings() {
  const db = await getDb();
  const settings = await db.collection("settings").findOne({ _type: "settings" });
  if (!settings) return {};
  const { _id, _type, ...rest } = settings;
  return rest;
}

export async function updateSettings(data) {
  const db = await getDb();
  const current = await getSettings();
  const updated = { ...current, ...data };
  await db.collection("settings").updateOne(
    { _type: "settings" },
    { $set: { ...updated, _type: "settings" } },
    { upsert: true }
  );
  return updated;
}

// Categories
export async function getCategories() {
  const db = await getDb();
  const categories = await db.collection("categories").find({}).toArray();
  return categories.map(({ _id, ...rest }) => ({ id: _id.toString(), ...rest }));
}

export async function saveCategories(categories) {
  const db = await getDb();
  const col = db.collection("categories");
  await col.deleteMany({});
  if (categories.length > 0) {
    await col.insertMany(categories.map(({ id, ...rest }) => rest));
  }
}

export async function addCategory(category) {
  const db = await getDb();
  const { id, ...rest } = category;
  const result = await db.collection("categories").insertOne(rest);
  return { id: result.insertedId.toString(), ...rest };
}

export async function updateCategory(id, data) {
  const db = await getDb();
  const { ObjectId } = await import("mongodb");
  const { id: _id, ...updateData } = data;
  await db.collection("categories").updateOne(
    { _id: new ObjectId(id) },
    { $set: updateData }
  );
  const updated = await db.collection("categories").findOne({ _id: new ObjectId(id) });
  if (!updated) return null;
  const { _id: docId, ...rest } = updated;
  return { id: docId.toString(), ...rest };
}

export async function deleteCategory(id) {
  const db = await getDb();
  const { ObjectId } = await import("mongodb");
  const category = await db.collection("categories").findOne({ _id: new ObjectId(id) });
  if (category) {
    await db.collection("galleries").deleteMany({ slug: category.slug });
  }
  await db.collection("categories").deleteOne({ _id: new ObjectId(id) });
  return category;
}

// Slider
export async function getSlider() {
  const db = await getDb();
  const slides = await db.collection("slider").find({}).toArray();
  return slides.map(({ _id, ...rest }) => ({ id: _id.toString(), ...rest }));
}

export async function saveSlider(slides) {
  const db = await getDb();
  const col = db.collection("slider");
  await col.deleteMany({});
  if (slides.length > 0) {
    await col.insertMany(slides.map(({ id, ...rest }) => rest));
  }
}

export async function addSlide(slide) {
  const db = await getDb();
  const { id, ...rest } = slide;
  const result = await db.collection("slider").insertOne(rest);
  return { id: result.insertedId.toString(), ...rest };
}

export async function deleteSlide(id) {
  const db = await getDb();
  const { ObjectId } = await import("mongodb");
  await db.collection("slider").deleteOne({ _id: new ObjectId(id) });
}

// Gallery images per category
export async function getGalleryImages(slug) {
  const db = await getDb();
  const images = await db.collection("galleries").find({ slug }).sort({ order: 1 }).toArray();
  return images.map(({ _id, slug: _slug, order, ...rest }) => ({ id: _id.toString(), ...rest }));
}

export async function saveGalleryImages(slug, images) {
  const db = await getDb();
  const col = db.collection("galleries");
  await col.deleteMany({ slug });
  if (images.length > 0) {
    await col.insertMany(
      images.map((img, index) => {
        const { id, ...rest } = img;
        return { ...rest, slug, order: index };
      })
    );
  }
}

export async function addGalleryImage(slug, image) {
  const db = await getDb();
  const count = await db.collection("galleries").countDocuments({ slug });
  const { id, ...rest } = image;
  const result = await db.collection("galleries").insertOne({ ...rest, slug, order: count });
  return { id: result.insertedId.toString(), ...rest };
}

export async function deleteGalleryImage(slug, imageId) {
  const db = await getDb();
  const { ObjectId } = await import("mongodb");
  await db.collection("galleries").deleteOne({ _id: new ObjectId(imageId) });
}

export async function deleteGalleryFile(slug) {
  const db = await getDb();
  await db.collection("galleries").deleteMany({ slug });
}
