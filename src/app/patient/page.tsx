import { cookies } from "next/headers";
import { Phone } from "lucide-react";
import { LogoutButton } from "@/components/auth/logout-button";
import {
  PatientPortalView,
  type PatientAppointment,
  type PatientMedicalRecord,
  type PatientPayment,
  type PatientSession
} from "@/components/patient/patient-portal-view";
import { AppointmentModel, MedicalRecordModel, PatientModel, PaymentModel } from "@/lib/models";
import { connectMongo, hasMongoUri } from "@/lib/mongodb";

function parsePatientSession(value?: string): PatientSession {
  if (!value) return { fullName: "Patient", mobileNumber: "", address: "" };

  try {
    return JSON.parse(Buffer.from(value, "base64url").toString("utf8")) as PatientSession;
  } catch {
    return { fullName: "Patient", mobileNumber: "", address: "" };
  }
}

export const dynamic = "force-dynamic";

export default async function PatientPortalPage() {
  const cookieStore = await cookies();
  const patient = parsePatientSession(cookieStore.get("patient_session")?.value);
  const { appointments, records, payments } = await getPatientPortalData(patient.mobileNumber);

  return (
    <main className="min-h-screen bg-cream py-10 lg:py-16">
      <div className="mx-auto max-w-[1340px] px-4 sm:px-6">
        <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end mb-8">
          <div>
            <div className="inline-flex items-center gap-1.5 rounded-full border border-line bg-white px-3.5 py-1 text-xs font-semibold text-ink shadow-sm mb-3">
              <span className="grid size-3.5 place-items-center rounded-full bg-blue text-[8px] text-white">✓</span>
              Patient Portal
            </div>
            <h1 className="text-3xl font-extrabold leading-tight text-ink sm:text-4xl">
              Welcome, {patient.fullName}
            </h1>
            <p className="mt-1.5 flex items-center gap-2 text-sm text-muted">
              <Phone className="h-4 w-4 text-blue" />
              <span>{patient.mobileNumber || "Mobile registered"}</span>
            </p>
          </div>
          <LogoutButton mode="patient" />
        </div>

        <PatientPortalView
          initialPatient={patient}
          appointments={appointments}
          records={records}
          payments={payments}
        />
      </div>
    </main>
  );
}

async function getPatientPortalData(mobileNumber: string): Promise<{
  appointments: PatientAppointment[];
  records: PatientMedicalRecord[];
  payments: PatientPayment[];
}> {
  if (!mobileNumber || !hasMongoUri()) {
    return { appointments: [], records: [], payments: [] };
  }

  try {
    await connectMongo();

    const patient = await PatientModel.findOne({ mobileNumber }).select("_id").lean<{ _id: string } | null>();
    const appointmentsRaw = await AppointmentModel.find({ mobileNumber })
      .sort({ createdAt: -1 })
      .lean<any[]>();

    const appointments: PatientAppointment[] = appointmentsRaw.map((a) => ({
      _id: String(a._id),
      status: a.appointmentStatus || a.status || "pending",
      slotStart: a.slotStart ? new Date(a.slotStart).toISOString() : undefined,
      slotEnd: a.slotEnd ? new Date(a.slotEnd).toISOString() : undefined,
      queueNumber: a.queueNumber,
      hospitalName: a.hospitalName,
      patientMessage: a.reason || a.notes,
      fee: a.fee
    }));

    if (!patient) {
      return { appointments, records: [], payments: [] };
    }

    const [recordsRaw, paymentsRaw] = await Promise.all([
      MedicalRecordModel.find({ patientId: patient._id }).sort({ visitDate: -1 }).lean<any[]>(),
      PaymentModel.find({ patientId: patient._id }).sort({ createdAt: -1 }).lean<any[]>()
    ]);

    const records: PatientMedicalRecord[] = recordsRaw.map((r) => ({
      _id: String(r._id),
      visitDate: r.visitDate ? new Date(r.visitDate).toISOString() : undefined,
      hospitalName: r.hospitalName,
      symptoms: r.symptoms,
      diagnosis: r.diagnosis,
      prescription: r.prescription,
      doctorNotes: r.doctorNotes,
      followUpDate: r.followUpDate ? new Date(r.followUpDate).toISOString() : undefined
    }));

    const payments: PatientPayment[] = paymentsRaw.map((p) => ({
      _id: String(p._id),
      hospitalName: p.hospitalName,
      totalAmount: p.totalAmount,
      paymentMethod: p.paymentMethod,
      paymentDate: p.createdAt ? new Date(p.createdAt).toISOString() : undefined,
      status: p.status
    }));

    return { appointments, records, payments };
  } catch {
    return { appointments: [], records: [], payments: [] };
  }
}
