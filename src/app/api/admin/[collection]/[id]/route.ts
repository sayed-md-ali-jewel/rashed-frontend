import { NextResponse } from "next/server";
import { isValidObjectId } from "mongoose";
import { getAdminCollection } from "@/lib/admin-models";
import { apiError } from "@/lib/api-response";
import { connectMongo, hasMongoUri } from "@/lib/mongodb";
import {
  deleteStrapiAdminRecord,
  hasStrapiConfig,
  updateStrapiAdminRecord
} from "@/lib/strapi";

type RouteContext = {
  params: Promise<{
    collection: string;
    id: string;
  }>;
};

export async function GET(_request: Request, { params }: RouteContext) {
  const { collection, id } = await params;
  const config = getAdminCollection(collection);
  if (!config) {
    return NextResponse.json({ error: "Unknown collection" }, { status: 404 });
  }

  if (!hasMongoUri() || !isValidObjectId(id)) {
    return NextResponse.json({ error: "Record not found" }, { status: 404 });
  }

  await connectMongo();

  const data = await config.model.findById(id).lean();
  if (!data) {
    return NextResponse.json({ error: "Record not found" }, { status: 404 });
  }

  return NextResponse.json({ data });
}

export async function PATCH(request: Request, { params }: RouteContext) {
  const { collection, id } = await params;
  const payload = await request.json();

  if (hasStrapiConfig()) {
    try {
      const data = await updateStrapiAdminRecord(collection, id, payload);
      return NextResponse.json({ data });
    } catch (error) {
      if (!hasMongoUri() || !isValidObjectId(id)) {
        return NextResponse.json(
          { error: error instanceof Error ? error.message : "Failed to update record in Strapi" },
          { status: 422 }
        );
      }
    }
  }

  const config = getAdminCollection(collection);
  if (!config) {
    return NextResponse.json({ error: "Unknown collection" }, { status: 404 });
  }

  if (!hasMongoUri() || !isValidObjectId(id)) {
    return NextResponse.json({ error: "Invalid record ID" }, { status: 400 });
  }

  await connectMongo();

  try {
    const data = await config.model.findByIdAndUpdate(id, payload, {
      new: true,
      runValidators: true
    });

    if (!data) {
      return NextResponse.json({ error: "Record not found" }, { status: 404 });
    }

    return NextResponse.json({ data });
  } catch (error) {
    return apiError(error);
  }
}

export async function DELETE(_request: Request, { params }: RouteContext) {
  const { collection, id } = await params;

  if (hasStrapiConfig()) {
    try {
      await deleteStrapiAdminRecord(collection, id);
      return NextResponse.json({ deleted: true });
    } catch (error) {
      if (!hasMongoUri() || !isValidObjectId(id)) {
        return NextResponse.json(
          { error: error instanceof Error ? error.message : "Failed to delete record in Strapi" },
          { status: 422 }
        );
      }
    }
  }

  const config = getAdminCollection(collection);
  if (!config) {
    return NextResponse.json({ error: "Unknown collection" }, { status: 404 });
  }

  if (!hasMongoUri() || !isValidObjectId(id)) {
    return NextResponse.json({ error: "Invalid record ID" }, { status: 400 });
  }

  await connectMongo();

  const data = await config.model.findByIdAndDelete(id);
  if (!data) {
    return NextResponse.json({ error: "Record not found" }, { status: 404 });
  }

  return NextResponse.json({ deleted: true });
}
