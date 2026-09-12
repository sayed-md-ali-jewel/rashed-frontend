import { NextResponse } from "next/server";
import { getAdminCollection } from "@/lib/admin-models";
import { apiError } from "@/lib/api-response";
import { connectMongo, hasMongoUri } from "@/lib/mongodb";
import { ScheduleService } from "@/lib/services/schedule.service";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ collection: string }> }
) {
  const { collection } = await params;
  const config = getAdminCollection(collection);

  if (!config) {
    return NextResponse.json({ error: "Unknown collection" }, { status: 404 });
  }

  if (!hasMongoUri()) {
    return NextResponse.json({ data: config.single ? {} : [], pagination: { page: 1, limit: 100, total: 0, totalPages: 0 } });
  }

  try {
    await connectMongo();

    // If single type (e.g. doctor, website-setting)
    if (config.single) {
      const data = await config.model.findOne().sort(config.defaultSort).lean();
      return NextResponse.json({ data: data || {} });
    }

    // Parse query params for search, filtering, sorting, pagination
    const url = new URL(request.url);
    const q = url.searchParams.get("q")?.trim() || "";
    const page = Math.max(1, Number(url.searchParams.get("page")) || 1);
    const limit = Math.min(200, Math.max(1, Number(url.searchParams.get("limit")) || 100));
    const sortBy = url.searchParams.get("sortBy");
    const order = url.searchParams.get("order") === "asc" ? 1 : -1;

    const filterQuery: Record<string, any> = {};

    // Status filter
    const status = url.searchParams.get("status");
    if (status && status !== "all") {
      if (collection === "appointments") {
        filterQuery.status = status;
      } else if (collection === "schedules") {
        filterQuery.scheduleStatus = status;
      } else if (collection === "hospitals" || collection === "services" || collection === "testimonials" || collection === "faqs") {
        filterQuery.active = status === "active";
      } else {
        filterQuery.status = status;
      }
    }

    // Hospital filter
    const hospital = url.searchParams.get("hospital");
    if (hospital && hospital !== "all") {
      if (collection === "appointments") {
        filterQuery.hospitalName = hospital;
      } else if (collection === "schedules") {
        filterQuery.$or = [
          { "hospital.name": hospital },
          { hospitalId: hospital }
        ];
      }
    }

    // Category filter
    const category = url.searchParams.get("category");
    if (category && category !== "all") {
      filterQuery.category = category;
    }

    // Search query across searchFields
    if (q && config.searchFields && config.searchFields.length > 0) {
      const searchRegex = { $regex: q, $options: "i" };
      const orConditions = config.searchFields.map((field) => ({
        [field]: searchRegex
      }));
      filterQuery.$and = filterQuery.$and || [];
      filterQuery.$and.push({ $or: orConditions });
    }

    const sortOptions: Record<string, 1 | -1> = sortBy
      ? { [sortBy]: order }
      : config.defaultSort;

    const skip = (page - 1) * limit;

    const [data, totalCount] = await Promise.all([
      config.model.find(filterQuery).sort(sortOptions).skip(skip).limit(limit).lean(),
      config.model.countDocuments(filterQuery)
    ]);

    return NextResponse.json({
      data,
      pagination: {
        page,
        limit,
        total: totalCount,
        totalPages: Math.ceil(totalCount / limit)
      }
    });
  } catch {
    return NextResponse.json({
      data: config.single ? {} : [],
      pagination: { page: 1, limit: 100, total: 0, totalPages: 0 }
    });
  }
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ collection: string }> }
) {
  const { collection } = await params;
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
    if (config.single) {
      const data = await config.model.findOneAndUpdate({}, payload, {
        new: true,
        upsert: true,
        runValidators: true,
        setDefaultsOnInsert: true
      });
      return NextResponse.json({ data }, { status: 200 });
    }

    if (
      collection === "schedule-rules" ||
      collection === "chamber-schedule-rules" ||
      collection === "hospital-schedules"
    ) {
      const data = await ScheduleService.upsertScheduleRule(payload);
      return NextResponse.json({ data }, { status: 201 });
    }

    if (collection === "schedules") {
      const data = await ScheduleService.upsertSchedule(payload);
      return NextResponse.json({ data }, { status: 201 });
    }

    const data = await config.model.create(payload);
    return NextResponse.json({ data }, { status: 201 });
  } catch (error) {
    return apiError(error);
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ collection: string }> }
) {
  const { collection } = await params;
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
    if (config.single) {
      const data = await config.model.findOneAndUpdate({}, { $set: payload }, {
        new: true,
        upsert: true,
        runValidators: true,
        setDefaultsOnInsert: true
      });
      return NextResponse.json({ data }, { status: 200 });
    }

    return NextResponse.json({ error: "PATCH requires an ID for multi-item collections" }, { status: 400 });
  } catch (error) {
    return apiError(error);
  }
}

export async function PUT(
  request: Request,
  context: { params: Promise<{ collection: string }> }
) {
  return PATCH(request, context);
}

