import { NextResponse } from "next/server";
import { connectMongo, hasMongoUri } from "@/lib/mongodb";
import {
  AppointmentModel,
  DoctorModel,
  HospitalModel,
  NotificationModel,
  PatientModel,
  ScheduleModel
} from "@/lib/models";
import { FinanceService } from "@/lib/services/finance.service";

export async function GET() {
  const fallback = {
    appointments: { total: 0, pending: 0, approved: 0, cancelled: 0, completed: 0 },
    patientsCount: 0,
    hospitalsCount: 0,
    schedulesCount: 0,
    finance: { totalIncome: 0, totalExpenses: 0, netProfit: 0, monthlyStats: [] },
    todayAppointments: [],
    recentNotifications: []
  };

  if (!hasMongoUri()) {
    return NextResponse.json(fallback);
  }

  try {
    await connectMongo();

    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    const todayEnd = new Date();
    todayEnd.setHours(23, 59, 59, 999);

    const [
      appointments,
      patientsCount,
      hospitalsCount,
      schedulesCount,
      financeSummary,
      todayAppointments,
      recentNotifications
    ] = await Promise.all([
      AppointmentModel.find().lean().catch(() => []),
      PatientModel.countDocuments().catch(() => 0),
      HospitalModel.countDocuments({ active: true }).catch(() => 0),
      ScheduleModel.countDocuments({ scheduleStatus: { $ne: "cancelled" } }).catch(() => 0),
      FinanceService.getFinancialSummary().catch(() => fallback.finance),
      AppointmentModel.find({
        slotStart: { $gte: todayStart, $lte: todayEnd }
      })
        .sort({ slotStart: 1 })
        .lean()
        .catch(() => []),
      NotificationModel.find().sort({ sentAt: -1 }).limit(10).lean().catch(() => [])
    ]);

    const appointmentStats = {
      total: appointments.length,
      pending: appointments.filter((a) => a.status === "pending").length,
      approved: appointments.filter((a) => a.status === "approved").length,
      cancelled: appointments.filter((a) => a.status === "cancelled").length,
      completed: appointments.filter((a) => a.status === "completed").length
    };

    return NextResponse.json({
      appointments: appointmentStats,
      patientsCount,
      hospitalsCount,
      schedulesCount,
      finance: financeSummary,
      todayAppointments,
      recentNotifications
    });
  } catch (error) {
    return NextResponse.json(fallback);
  }
}
