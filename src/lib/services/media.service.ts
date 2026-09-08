import fs from "fs/promises";
import path from "path";
import { connectMongo } from "@/lib/mongodb";
import { MediaModel } from "@/lib/models";

export class MediaService {
  private static uploadDir = path.join(process.cwd(), "public", "uploads");

  /**
   * Save uploaded file to public/uploads and index in MongoDB.
   */
  static async uploadFile(file: File, title?: string, alt?: string) {
    await connectMongo();
    await fs.mkdir(this.uploadDir, { recursive: true });

    const buffer = Buffer.from(await file.arrayBuffer());
    const ext = path.extname(file.name) || ".jpg";
    const cleanBaseName = path.basename(file.name, ext).replace(/[^a-zA-Z0-9_-]/g, "_");
    const uniqueFilename = `${cleanBaseName}_${Date.now()}${ext}`;
    const filePath = path.join(this.uploadDir, uniqueFilename);

    await fs.writeFile(filePath, buffer);

    const publicUrl = `/uploads/${uniqueFilename}`;

    const mediaDoc = await MediaModel.create({
      title: title || file.name,
      url: publicUrl,
      alt: alt || title || file.name,
      mimeType: file.type || "image/jpeg",
      sizeBytes: buffer.length,
      folder: "uploads"
    });

    return mediaDoc;
  }

  /**
   * Delete media asset from filesystem and database.
   */
  static async deleteMedia(id: string) {
    await connectMongo();
    const media = await MediaModel.findById(id);
    if (!media) {
      throw new Error("Media not found");
    }

    if (media.url && media.url.startsWith("/uploads/")) {
      const filename = path.basename(media.url);
      const filePath = path.join(this.uploadDir, filename);
      try {
        await fs.unlink(filePath);
      } catch {
        // File may not exist on disk, ignore
      }
    }

    await MediaModel.findByIdAndDelete(id);
    return { deleted: true };
  }

  /**
   * List all media assets.
   */
  static async listMedia() {
    await connectMongo();
    return MediaModel.find().sort({ createdAt: -1 }).lean();
  }
}
