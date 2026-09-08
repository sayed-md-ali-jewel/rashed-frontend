import { NextResponse } from "next/server";
import { MediaService } from "@/lib/services/media.service";
import { hasMongoUri } from "@/lib/mongodb";

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  if (!hasMongoUri()) {
    return NextResponse.json({ error: "MONGODB_URI is not configured" }, { status: 503 });
  }

  try {
    await MediaService.deleteMedia(id);
    return NextResponse.json({ deleted: true });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to delete media" },
      { status: 500 }
    );
  }
}
