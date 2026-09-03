import { NextResponse } from "next/server";
import { z } from "zod";
import { connectMongo, hasMongoUri } from "@/lib/mongodb";
import { PatientModel } from "@/lib/models";

const schema = z.object({
  fullName: z.string().min(2),
  mobileNumber: z.string().regex(/^(\+?88)?01[3-9]\d{8}$/)
});

export async function POST(request: Request) {
  const parsed = schema.safeParse(await request.json());

  if (!parsed.success) {
    return NextResponse.json({ error: "Enter a valid name and Bangladeshi mobile number" }, { status: 422 });
  }

  if (hasMongoUri()) {
    await connectMongo();
    await PatientModel.findOneAndUpdate(
      { mobileNumber: parsed.data.mobileNumber },
      parsed.data,
      { upsert: true, new: true, runValidators: true, setDefaultsOnInsert: true }
    );
  }

  const response = NextResponse.json({ ok: true });
  response.cookies.set("patient_session", Buffer.from(JSON.stringify(parsed.data)).toString("base64url"), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 30
  });

  return response;
}
