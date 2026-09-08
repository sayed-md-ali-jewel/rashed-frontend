import { NextResponse } from "next/server";
import { isValidObjectId } from "mongoose";
import { getAdminCollection } from "@/lib/admin-models";
import { apiError } from "@/lib/api-response";
import { connectMongo, hasMongoUri } from "@/lib/mongodb";
import { ScheduleService } from "@/lib/services/schedule.service";
import { AppointmentService } from "@/lib/services/appointment.service";

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

  if (!hasMongoUri()) {
    return NextResponse.json({ error: "MONGODB_URI is not configured" }, { status: 503 });
  }

  await connectMongo();

  let data = null;
  if (isValidObjectId(id)) {
    data = await config.model.findById(id).lean();
  } else if ("slug" in config.model.schema.paths) {
    data = await config.model.findOne({ slug: id }).lean();
  }

  if (!data) {
    return NextResponse.json({ error: "Record not found" }, { status: 404 });
  }

  return NextResponse.json({ data });
}

export async function PATCH(request: Request, { params }: RouteContext) {
  const { collection, id } = await params;
  const config = getAdminCollection(collection);

  if (!config) {
    return NextResponse.json({ error: "Unknown collection" }, { status: 404 });
  }

  if (!hasMongoUri()) {
    return NextResponse.json({ error: "MONGODB_URI is not configured" }, { status: 503 });
  }

  await connectMongo();
  const payload = await request.json();

  try {
    if (collection === "schedules") {
      const data = await ScheduleService.upsertSchedule(payload, id);
      if (!data) return NextResponse.json({ error: "Record not found" }, { status: 404 });
      return NextResponse.json({ data });
    }

    if (collection === "appointments" && payload.status) {
      const data = await AppointmentService.updateStatus(id, payload.status, {
        notes: payload.notes,
        patientMessage: payload.patientMessage,
        paymentStatus: payload.paymentStatus
      });
      return NextResponse.json({ data });
    }

    const query = isValidObjectId(id) ? { _id: id } : { slug: id };
    const data = await config.model.findOneAndUpdate(query, payload, {
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
  const config = getAdminCollection(collection);

  if (!config) {
    return NextResponse.json({ error: "Unknown collection" }, { status: 404 });
  }

  if (!hasMongoUri()) {
    return NextResponse.json({ error: "MONGODB_URI is not configured" }, { status: 503 });
  }

  await connectMongo();

  const query = isValidObjectId(id) ? { _id: id } : { slug: id };
  const data = await config.model.findOneAndDelete(query);

  if (!data) {
    return NextResponse.json({ error: "Record not found" }, { status: 404 });
  }

  return NextResponse.json({ deleted: true });
}
