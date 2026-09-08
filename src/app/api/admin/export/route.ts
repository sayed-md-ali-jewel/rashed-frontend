import { NextResponse } from "next/server";
import { connectMongo, hasMongoUri } from "@/lib/mongodb";
import {
  AppointmentModel,
  ExpenseModel,
  IncomeModel,
  PatientModel,
  PaymentModel
} from "@/lib/models";

export async function GET(request: Request) {
  if (!hasMongoUri()) {
    return NextResponse.json({ error: "MONGODB_URI is not configured" }, { status: 503 });
  }

  const url = new URL(request.url);
  const type = url.searchParams.get("type") || "appointments";
  const format = url.searchParams.get("format") || "json";

  await connectMongo();

  let records: any[] = [];
  let filename = `${type}_export_${Date.now()}`;

  if (type === "appointments") {
    records = await AppointmentModel.find().sort({ slotStart: -1 }).lean();
  } else if (type === "patients") {
    records = await PatientModel.find().sort({ createdAt: -1 }).lean();
  } else if (type === "payments") {
    records = await PaymentModel.find().sort({ paymentDate: -1 }).lean();
  } else if (type === "incomes") {
    records = await IncomeModel.find().sort({ incomeDate: -1 }).lean();
  } else if (type === "expenses") {
    records = await ExpenseModel.find().sort({ expenseDate: -1 }).lean();
  }

  if (format === "csv") {
    if (records.length === 0) {
      return new NextResponse("", {
        headers: {
          "Content-Type": "text/csv",
          "Content-Disposition": `attachment; filename="${filename}.csv"`
        }
      });
    }

    const headers = Object.keys(records[0]).filter((k) => !k.startsWith("__") && typeof records[0][k] !== "object");
    const csvRows = [
      headers.join(","),
      ...records.map((r) =>
        headers
          .map((h) => {
            const val = r[h] !== undefined && r[h] !== null ? String(r[h]).replace(/"/g, '""') : "";
            return `"${val}"`;
          })
          .join(",")
      )
    ];

    return new NextResponse(csvRows.join("\n"), {
      headers: {
        "Content-Type": "text/csv",
        "Content-Disposition": `attachment; filename="${filename}.csv"`
      }
    });
  }

  return NextResponse.json({ data: records });
}
