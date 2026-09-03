import { NextResponse } from "next/server";
import { getAdminCollection } from "@/lib/admin-models";
import { apiError } from "@/lib/api-response";
import { connectMongo, hasMongoUri } from "@/lib/mongodb";
import {
  createStrapiAdminRecord,
  getStrapiAdminCollection,
  hasStrapiConfig
} from "@/lib/strapi";

export async function GET(_request: Request, { params }: { params: Promise<{ collection: string }> }) {
  const { collection } = await params;

  if (hasStrapiConfig()) {
    try {
      const data = await getStrapiAdminCollection(collection);
      return NextResponse.json({ data });
    } catch {
      // fallback to mongo
    }
  }

  const config = getAdminCollection(collection);
  if (!config) {
    return NextResponse.json({ error: "Unknown collection" }, { status: 404 });
  }

  if (!hasMongoUri()) {
    return NextResponse.json({ error: "MONGODB_URI is not configured" }, { status: 503 });
  }

  await connectMongo();

  if (config.single) {
    const data = await config.model.findOne().sort(config.defaultSort).lean();
    return NextResponse.json({ data });
  }

  const data = await config.model.find().sort(config.defaultSort).limit(100).lean();
  return NextResponse.json({ data });
}

export async function POST(request: Request, { params }: { params: Promise<{ collection: string }> }) {
  const { collection } = await params;
  const payload = await request.json();

  if (hasStrapiConfig()) {
    try {
      const data = await createStrapiAdminRecord(collection, payload);
      return NextResponse.json({ data }, { status: 201 });
    } catch (error) {
      if (!hasMongoUri()) {
        return NextResponse.json(
          { error: error instanceof Error ? error.message : "Failed to create record in Strapi" },
          { status: 422 }
        );
      }
    }
  }

  const config = getAdminCollection(collection);
  if (!config) {
    return NextResponse.json({ error: "Unknown collection" }, { status: 404 });
  }

  if (!hasMongoUri()) {
    return NextResponse.json({ error: "MONGODB_URI is not configured" }, { status: 503 });
  }

  await connectMongo();

  try {
    if (config.single) {
      const data = await config.model.findOneAndUpdate({}, payload, {
        new: true,
        upsert: true,
        runValidators: true,
        setDefaultsOnInsert: true
      });
      return NextResponse.json({ data }, { status: 201 });
    }

    const data = await config.model.create(payload);
    return NextResponse.json({ data }, { status: 201 });
  } catch (error) {
    return apiError(error);
  }
}
