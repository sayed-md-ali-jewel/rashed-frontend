import fs from "fs/promises";
import path from "path";
import { connectMongo } from "@/lib/mongodb";
import { MediaModel } from "@/lib/models";

export class MediaService {
  private static getUploadDir() {
    return path.join(process.cwd(), "public", "uploads");
  }

  private static getCandidateDirs() {
    return [
      path.join(process.cwd(), "public", "uploads"),
      path.join(process.cwd(), "public", "public", "uploads"),
      path.join(process.cwd(), "uploads"),
      path.resolve(process.cwd(), "public/uploads"),
      path.resolve(process.cwd(), "public/public/uploads"),
      path.resolve(process.cwd(), "..", "public", "uploads"),
      path.resolve(process.cwd(), "..", "public", "public", "uploads"),
      path.resolve(process.cwd(), "..", "uploads"),
      path.resolve(process.cwd(), "..", "public_html", "uploads"),
      path.resolve(process.cwd(), "..", "..", "public_html", "uploads"),
      path.resolve(__dirname, "..", "..", "..", "public", "uploads"),
      path.resolve(__dirname, "..", "..", "..", "public", "public", "uploads"),
      path.resolve(__dirname, "..", "..", "..", "..", "public", "uploads"),
      path.resolve(__dirname, "..", "..", "..", "..", "public", "public", "uploads"),
      path.resolve(__dirname, "public", "uploads"),
      path.resolve(__dirname, "public", "public", "uploads")
    ];
  }

  /**
   * Save uploaded file to public/uploads and index in MongoDB.
   */
  static async uploadFile(file: File, title?: string, alt?: string) {
    await connectMongo();
    const primaryUploadDir = this.getUploadDir();
    await fs.mkdir(primaryUploadDir, { recursive: true });

    const buffer = Buffer.from(await file.arrayBuffer());
    const ext = path.extname(file.name) || ".jpg";
    const cleanBaseName = path.basename(file.name, ext).replace(/[^a-zA-Z0-9_-]/g, "_");
    const uniqueFilename = `${cleanBaseName}_${Date.now()}${ext}`;
    const filePath = path.join(primaryUploadDir, uniqueFilename);

    await fs.writeFile(filePath, buffer);

    // Also mirror to existing secondary upload directories if present (e.g. cPanel nested public/public/uploads)
    const secondaryDirs = [
      path.join(process.cwd(), "public", "public", "uploads"),
      path.join(process.cwd(), "uploads"),
      path.resolve(process.cwd(), "..", "public", "uploads"),
      path.resolve(process.cwd(), "..", "public_html", "uploads")
    ];
    for (const secDir of secondaryDirs) {
      try {
        const stats = await fs.stat(secDir);
        if (stats.isDirectory()) {
          await fs.writeFile(path.join(secDir, uniqueFilename), buffer);
        }
      } catch {
        // Ignore if directory doesn't exist
      }
    }

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

    if (media.url) {
      try {
        const rawPath = media.url.startsWith("http")
          ? new URL(media.url).pathname
          : media.url;
        const filename = path.basename(rawPath);

        if (filename) {
          const candidateDirs = this.getCandidateDirs();
          for (const dir of candidateDirs) {
            const filePath = path.join(dir, filename);
            try {
              await fs.unlink(filePath);
            } catch {
              // Ignore if file doesn't exist in this directory
            }
          }
        }
      } catch {
        // Ignore URL parsing or deletion error
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
    const list = await MediaModel.find().sort({ createdAt: -1 }).lean();
    return list.map((item: any) => {
      let url = String(item.url || "");
      const idx = url.indexOf("/uploads/");
      if (idx !== -1) {
        url = url.slice(idx);
      } else if (url && !url.startsWith("http") && !url.startsWith("/")) {
        url = `/${url}`;
      }
      return { ...item, url };
    });
  }
}
