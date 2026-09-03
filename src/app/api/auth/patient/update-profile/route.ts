import { NextResponse } from "next/server";
import { z } from "zod";
import { connectMongo, hasMongoUri } from "@/lib/mongodb";
import { PatientModel, AppointmentModel } from "@/lib/models";

const schema = z.object({
  fullName: z.string().min(2),
  mobileNumber: z.string().regex(/^(\+?88)?01[3-9]\d{8}$/),
  oldMobileNumber: z.string().optional(),
  address: z.string().optional().or(z.literal(""))
});

export async function POST(request: Request) {
  const parsed = schema.safeParse(await request.json());

  if (!parsed.success) {
    return NextResponse.json({ error: "Enter a valid name and Bangladeshi mobile number (01XXXXXXXXX)" }, { status: 422 });
  }

  const { fullName, mobileNumber, oldMobileNumber, address } = parsed.data;

  if (hasMongoUri()) {
    try {
      await connectMongo();
      const searchNumber = oldMobileNumber || mobileNumber;
      const patient = await PatientModel.findOneAndUpdate(
        { mobileNumber: searchNumber },
        { fullName, mobileNumber, address },
        { upsert: true, new: true, runValidators: true }
      );

      if (oldMobileNumber && oldMobileNumber !== mobileNumber) {
        await AppointmentModel.updateMany(
          { mobileNumber: oldMobileNumber },
          { mobileNumber, patientName: fullName }
        );
      }
    } catch (e) {
      console.error("Failed to update patient profile in mongo:", e);
    }
  }

  const sessionData = {
    fullName,
    mobileNumber,
    address: address || ""
  };

  const response = NextResponse.json({ ok: true, patient: sessionData });
  response.cookies.set("patient_session", Buffer.from(JSON.stringify(sessionData)).toString("base64url"), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 30
  });

  return response;
}
