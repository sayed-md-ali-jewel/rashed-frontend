import { NextResponse } from "next/server";
import { MediaService } from "@/lib/services/media.service";
import { hasMongoUri } from "@/lib/mongodb";

export async function GET() {
  if (!hasMongoUri()) {
    return NextResponse.json({ data: [] });
  }

  try {
    const data = await MediaService.listMedia();
    return NextResponse.json({ data });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to fetch media" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  if (!hasMongoUri()) {
    return NextResponse.json({ error: "MONGODB_URI is not configured" }, { status: 503 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const title = (formData.get("title") as string) || undefined;
    const alt = (formData.get("alt") as string) || undefined;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const mediaDoc = await MediaService.uploadFile(file, title, alt);
    return NextResponse.json({ data: mediaDoc }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to upload file" },
      { status: 500 }
    );
  }
}
