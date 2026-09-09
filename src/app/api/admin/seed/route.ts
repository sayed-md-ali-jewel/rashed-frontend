import { NextResponse } from "next/server";
import { connectMongo, hasMongoUri } from "@/lib/mongodb";
import {
  AdminUserModel,
  AppointmentModel,
  AwardModel,
  BlogPostModel,
  DoctorModel,
  ExpenseModel,
  FaqModel,
  GalleryItemModel,
  HospitalModel,
  IncomeModel,
  PageModel,
  PatientModel,
  PaymentModel,
  QualificationModel,
  ScheduleModel,
  SeoSettingModel,
  ServiceModel,
  SpecialisationModel,
  TestimonialModel,
  WebsiteSettingModel
} from "@/lib/models";

export async function POST() {
  if (!hasMongoUri()) {
    return NextResponse.json({ error: "MONGODB_URI is not configured" }, { status: 503 });
  }

  try {
    await connectMongo();

    // 1. Admin User
    await AdminUserModel.findOneAndUpdate(
      { username: "admin" },
      {
        username: "admin",
        name: "Dr. Rashed Super Admin",
        email: "admin@doctorcare.test",
        pin: "123456",
        role: "super_admin",
        permissions: ["all"],
        active: true
      },
      { upsert: true, new: true }
    );

    // 2. Doctor Profile
    await DoctorModel.findOneAndUpdate(
      {},
      {
        name: "Dr. Md. Rashedul Alam",
        title: "Consultant Medicine Specialist",
        designation: "Senior Consultant",
        specialization: "Internal Medicine",
        medicalRegistrationNumber: "BMDC A-123456",
        yearsOfExperience: 15,
        onlineConsultationFee: 800,
        consultationFee: 1000,
        phone: "+8801700000000",
        whatsapp: "+8801700000000",
        address: "Dhaka, Bangladesh",
        image: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=1200&q=80",
        biography:
          "A patient-focused clinician providing evidence-based care across internal medicine, chronic disease management, preventive health, and diagnostic consultations.",
        heroBadge: "Board Certified Physician",
        heroIntro:
          "Compassionate healthcare focused on your wellness. Specializing in internal medicine with a holistic approach to patient care.",
        heroCareTitle: "Patient-Centered Care",
        heroCareDescription: "Personalized treatment plans for every patient.",
        heroStats: [
          { label: "Patients Served", value: "5000+" },
          { label: "Years Experience", value: "15+" },
          { label: "Success Rate", value: "98%" },
          { label: "Emergency Care", value: "24/7" }
        ],
        aboutHeading: "A Personal Approach to Medicine",
        aboutBio: [
          "I believe that exceptional healthcare begins with truly listening to patients. Each person has a unique story, and understanding that story is essential to providing effective treatment.",
          "My practice focuses on preventive care, chronic disease management, and helping patients achieve optimal health through evidence-based medicine combined with a holistic perspective.",
          "I support patients with practical follow-up plans, continuous monitoring, and clear communication."
        ],
        aboutImageUrl: "https://images.unsplash.com/photo-1584467735871-8f8eafa7f867?auto=format&fit=crop&w=1200&q=80",
        languages: ["Bangla", "English", "Hindi"],
        certifications: [
          "Board Certification - Internal Medicine",
          "Advanced Cardiac Life Support (ACLS)",
          "Diabetes Care Certification"
        ],
        hospitalAffiliations: ["City Care Hospital", "Green Life Clinic", "Central Health Clinic"],
        expertiseCards: [
          {
            title: "Education",
            items: ["MBBS - Dhaka Medical College", "FCPS Medicine - BCPS", "MD Internal Medicine - BSMMU"]
          },
          {
            title: "Experience",
            items: [
              "15+ years in Internal Medicine clinical practice",
              "Former Registrar at a Tertiary Hospital",
              "Clinical Professor and Mentor"
            ]
          },
          {
            title: "Publications",
            items: [
              "50+ Articles in peer-reviewed clinical journals",
              "Author of patient education guides",
              "Keynote Speaker at National Medical Conferences"
            ]
          }
        ],
        medicalServices: [
          {
            title: "Preventive Care",
            description: "Health screenings, vaccinations, and lifestyle counseling.",
            items: ["Annual Physical Exams", "Health Risk Assessments", "Vaccination Guidance", "Wellness Counseling"]
          },
          {
            title: "Chronic Disease Management",
            description: "Care for diabetes, hypertension, heart disease, and respiratory disorders.",
            items: ["Diabetes Care & Glucose Monitoring", "Hypertension Management", "Asthma & COPD Review", "Cardiovascular Risk Reduction"]
          },
          {
            title: "Acute Care & Diagnostics",
            description: "Timely diagnosis and fast access for sudden illness or urgent concerns.",
            items: ["Same-Day Consultations", "Infection Treatment", "Lab & EKG Test Review", "Diagnostic Coordination"]
          }
        ],
        qualifications: ["MBBS (DMC)", "FCPS (Medicine)", "MD (Internal Medicine)"],
        specialisations: ["Diabetes Management", "Hypertension", "Respiratory Medicine", "Preventive Care"],
        experience: ["15+ Years Clinical Practice", "Former Registrar - Tertiary Hospital", "Professor of Medicine"],
        awards: ["Best Clinical Service Award 2022", "Community Health Excellence 2023"],
        services: ["General Consultation", "Follow-up Care", "Health Screening", "Medical Reports Review"],
        socialLinks: {
          facebook: "https://facebook.com/doctorcare",
          linkedin: "https://linkedin.com/in/doctorcare",
          x: "https://x.com/doctorcare",
          youtube: "https://youtube.com/@doctorcare"
        },
        seo: {
          seoTitle: "Dr. Md. Rashedul Alam | Medicine Specialist in Dhaka",
          metaDescription: "Book appointments with Dr. Md. Rashedul Alam, a consultant medicine specialist in Dhaka.",
          focusKeyword: "medicine specialist Dhaka"
        }
      },
      { upsert: true, new: true }
    );

    // 3. Website Settings
    await WebsiteSettingModel.findOneAndUpdate(
      {},
      {
        siteName: "Dr. Rashed",
        contactPhone: "+8801700000000",
        contactEmail: "appointments@doctorcare.test",
        contactAddress: "Dhaka, Bangladesh",
        footerDescription: "A modern doctor portfolio and appointment management system.",
        facebookUrl: "https://facebook.com/doctorcare",
        linkedinUrl: "https://linkedin.com/in/doctorcare",
        xUrl: "https://x.com/doctorcare",
        youtubeUrl: "https://youtube.com/@doctorcare",
        telegramUrl: "https://t.me/doctorcare",
        heroPrimaryCta: "Book Appointment",
        heroSecondaryCta: "Learn More",
        scheduleBadge: "Live availability",
        scheduleTitle: "Upcoming Schedules",
        scheduleDescription: "Book from automatically generated slots and receive a queue number.",
        defaultSeo: {
          seoTitle: "Dr. Md. Rashedul Alam | Doctor Portfolio & Appointments",
          metaDescription: "Doctor portfolio, schedules, booking, clinic accounting, and SEO management."
        }
      },
      { upsert: true, new: true }
    );

    // 4. Hospitals
    const hospitalsData = [
      {
        name: "City Care Hospital",
        address: "House 12, Road 8, Dhanmondi, Dhaka",
        phone: "+8801700000000",
        googleMapsUrl: "https://www.google.com/maps?q=Dhanmondi+Dhaka",
        embeddedMapUrl: "https://www.google.com/maps?q=Dhanmondi+Dhaka&output=embed",
        mapUrl: "https://www.google.com/maps?q=Dhanmondi+Dhaka&output=embed",
        latitude: 23.7465,
        longitude: 90.376,
        consultationFee: 1000,
        active: true
      },
      {
        name: "Green Life Clinic",
        address: "Mirpur 10, Dhaka",
        phone: "+8801711111111",
        googleMapsUrl: "https://www.google.com/maps?q=Mirpur+10+Dhaka",
        embeddedMapUrl: "https://www.google.com/maps?q=Mirpur+10+Dhaka&output=embed",
        mapUrl: "https://www.google.com/maps?q=Mirpur+10+Dhaka&output=embed",
        latitude: 23.8067,
        longitude: 90.3686,
        consultationFee: 900,
        active: true
      },
      {
        name: "Central Health Clinic",
        address: "Banani, Dhaka",
        phone: "+8801722222222",
        googleMapsUrl: "https://www.google.com/maps?q=Banani+Dhaka",
        embeddedMapUrl: "https://www.google.com/maps?q=Banani+Dhaka&output=embed",
        mapUrl: "https://www.google.com/maps?q=Banani+Dhaka&output=embed",
        latitude: 23.7937,
        longitude: 90.4066,
        consultationFee: 1000,
        active: true
      }
    ];

    const hospitalDocs = [];
    for (const h of hospitalsData) {
      const doc = await HospitalModel.findOneAndUpdate({ name: h.name }, h, { upsert: true, new: true });
      hospitalDocs.push(doc);
    }

    // 5. Schedules (Generate future dates so booking slots are active)
    const now = new Date();
    const futureDate1 = new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000);
    futureDate1.setHours(10, 0, 0, 0);
    const futureDate1End = new Date(futureDate1.getTime() + 3 * 60 * 60 * 1000);

    const futureDate2 = new Date(now.getTime() + 4 * 24 * 60 * 60 * 1000);
    futureDate2.setHours(17, 0, 0, 0);
    const futureDate2End = new Date(futureDate2.getTime() + 3 * 60 * 60 * 1000);

    const futureDate3 = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
    futureDate3.setHours(9, 30, 0, 0);
    const futureDate3End = new Date(futureDate3.getTime() + 3 * 60 * 60 * 1000);

    const schedulesData = [
      {
        title: "City Care Hospital Consultation",
        slug: "city-care-hospital-consultation",
        hospitalId: hospitalDocs[0]._id,
        hospital: hospitalDocs[0],
        startsAt: futureDate1,
        endsAt: futureDate1End,
        slotDurationMinutes: 10,
        fee: 1000,
        maxAppointments: 18,
        scheduleStatus: "scheduled"
      },
      {
        title: "Green Life Clinic Consultation",
        slug: "green-life-clinic-consultation",
        hospitalId: hospitalDocs[1]._id,
        hospital: hospitalDocs[1],
        startsAt: futureDate2,
        endsAt: futureDate2End,
        slotDurationMinutes: 15,
        fee: 900,
        maxAppointments: 12,
        scheduleStatus: "scheduled"
      },
      {
        title: "Central Health Clinic Consultation",
        slug: "central-health-clinic-consultation",
        hospitalId: hospitalDocs[2]._id,
        hospital: hospitalDocs[2],
        startsAt: futureDate3,
        endsAt: futureDate3End,
        slotDurationMinutes: 10,
        fee: 1000,
        maxAppointments: 18,
        scheduleStatus: "scheduled"
      }
    ];

    for (const s of schedulesData) {
      await ScheduleModel.findOneAndUpdate({ slug: s.slug }, s, { upsert: true, new: true });
    }

    // 6. Testimonials
    await TestimonialModel.deleteMany({});
    await TestimonialModel.insertMany([
      { name: "Mahmud H.", quote: "The consultation was calm, clear, and very practical. Highly recommend Dr. Rashed.", rating: 5, designation: "Diabetes Patient" },
      { name: "Nusrat J.", quote: "Booking online was simple and the queue number made our hospital visit completely hassle-free.", rating: 5, designation: "Hypertension Patient" },
      { name: "Rafiq A.", quote: "The personalized follow-up care plan helped me recover quickly from persistent chest congestion.", rating: 5, designation: "General Patient" },
      { name: "Shireen K.", quote: "Compassionate physician who explains clinical findings clearly without rushing.", rating: 5, designation: "Preventive Checkup" }
    ]);

    // 7. Gallery
    await GalleryItemModel.deleteMany({});
    await GalleryItemModel.insertMany([
      {
        title: "City Care Hospital Chamber",
        category: "Main Hospital",
        description: "Fully equipped executive consultation chamber with private examination suite and vitals monitoring station.",
        image: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=1200&q=80",
        images: [
          "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=1200&q=80",
          "https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=1200&q=80",
          "https://images.unsplash.com/photo-1505751172876-fa1923c5c528?auto=format&fit=crop&w=1200&q=80",
          "https://images.unsplash.com/photo-1582719471384-894fbb16e074?auto=format&fit=crop&w=1200&q=80"
        ],
        alt: "City Care Hospital executive consultation suite",
        active: true
      },
      {
        title: "Green Life Clinic & Diagnostic",
        category: "Specialist Clinic",
        description: "Modern outpatient clinic featuring digital diagnostic support, patient waiting lounge, and ECG suite.",
        image: "https://images.unsplash.com/photo-1584515933487-779824d29309?auto=format&fit=crop&w=1200&q=80",
        images: [
          "https://images.unsplash.com/photo-1584515933487-779824d29309?auto=format&fit=crop&w=1200&q=80",
          "https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=1200&q=80",
          "https://images.unsplash.com/photo-1538108149393-fbbd81895907?auto=format&fit=crop&w=1200&q=80"
        ],
        alt: "Green Life Clinic & Diagnostic center",
        active: true
      },
      {
        title: "Central Health Chamber & Lab",
        category: "Diagnostic Chamber",
        description: "Evening chamber setup with on-site sample collection, ultrasonic imaging, and dedicated patient care lounge.",
        image: "https://images.unsplash.com/photo-1504813184591-01572f98c85f?auto=format&fit=crop&w=1200&q=80",
        images: [
          "https://images.unsplash.com/photo-1504813184591-01572f98c85f?auto=format&fit=crop&w=1200&q=80",
          "https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=1200&q=80",
          "https://images.unsplash.com/photo-1512678080530-7760d81faba6?auto=format&fit=crop&w=1200&q=80"
        ],
        alt: "Central Health Chamber and diagnostic lab",
        active: true
      }
    ]);

    // 8. FAQs
    await FaqModel.deleteMany({});
    await FaqModel.insertMany([
      { question: "How can I book an appointment?", answer: "Choose your preferred hospital schedule, select an available slot, enter your name and phone number, and submit to receive an instant queue number.", category: "booking", order: 1 },
      { question: "What should I bring to my first visit?", answer: "Please bring any previous medical prescriptions, lab reports, imaging scans, and a list of your current medications.", category: "consultation", order: 2 },
      { question: "Is online consultation available?", answer: "Yes, video consultations are available for follow-up reviews and medication management.", category: "consultation", order: 3 },
      { question: "Can I reschedule my appointment?", answer: "Yes, you can contact the clinic hotline or log in to the patient portal with your mobile number to view and manage your booking.", category: "booking", order: 4 }
    ]);

    // 9. Services
    await ServiceModel.deleteMany({});
    await ServiceModel.insertMany([
      {
        name: "General Medicine Consultation",
        description: "Comprehensive health evaluation and evidence-based diagnostic assessment.",
        fee: 1000,
        icon: "Stethoscope",
        items: ["Health Risk Assessments", "Annual Physical Exams", "Wellness Counseling", "Prescription Review"],
        active: true,
        order: 1
      },
      {
        name: "Diabetes & Endocrine Care",
        description: "Personalized glycemic control, HbA1c monitoring, and dietary planning.",
        fee: 1000,
        icon: "Activity",
        items: ["Glucose Monitoring", "HbA1c Target Setting", "Dietary Guidance", "Insulin Dose Adjustments"],
        active: true,
        order: 2
      },
      {
        name: "Hypertension & Cardiovascular Health",
        description: "Long-term blood pressure control and cardiovascular risk prevention.",
        fee: 1000,
        icon: "HeartPulse",
        items: ["BP Monitoring", "EKG Test Review", "Lipid Management", "Cardiovascular Risk Reduction"],
        active: true,
        order: 3
      },
      {
        name: "Respiratory Disease Management",
        description: "Treatment for asthma, COPD, bronchitis, and persistent respiratory symptoms.",
        fee: 1000,
        icon: "ShieldCheck",
        items: ["Asthma & COPD Review", "Inhaler Technique Check", "Spirometry Review", "Allergy Management"],
        active: true,
        order: 4
      }
    ]);

    // 10. Sample Incomes & Expenses
    await IncomeModel.deleteMany({});
    await IncomeModel.insertMany([
      { title: "City Care Consultations (15 Patients)", amount: 15000, incomeDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), category: "consultation", paymentMethod: "cash" },
      { title: "Green Life Consultations (10 Patients)", amount: 9000, incomeDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), category: "consultation", paymentMethod: "bkash" },
      { title: "Online Medical Reports Review", amount: 2400, incomeDate: new Date(), category: "procedure", paymentMethod: "nagad" }
    ]);

    await ExpenseModel.deleteMany({});
    await ExpenseModel.insertMany([
      { title: "Clinic Chamber Monthly Utility", amount: 3500, expenseDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), category: "utility", notes: "Electricity & Internet" },
      { title: "Medical Diagnostic Supplies", amount: 4800, expenseDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), category: "medicine", notes: "Stethoscopes, BP cuffs & disposable sheets" }
    ]);

    // 11. Sample Patients & Appointments
    const samplePatient = await PatientModel.findOneAndUpdate(
      { mobileNumber: "01712345678" },
      {
        fullName: "Kamal Hossain",
        mobileNumber: "01712345678",
        email: "kamal@example.com",
        age: 45,
        gender: "male",
        address: "Dhanmondi, Dhaka",
        medicalHistory: "Type 2 Diabetes, Mild Hypertension"
      },
      { upsert: true, new: true }
    );

    const firstSchedule = await ScheduleModel.findOne({ scheduleStatus: "scheduled" }).lean();
    if (firstSchedule) {
      const slotTime = new Date(firstSchedule.startsAt);
      await AppointmentModel.findOneAndUpdate(
        { scheduleId: String(firstSchedule._id), slotStart: slotTime },
        {
          patientId: samplePatient._id,
          patientName: samplePatient.fullName,
          mobileNumber: samplePatient.mobileNumber,
          hospitalName: firstSchedule.hospital?.name || "City Care Hospital",
          scheduleId: String(firstSchedule._id),
          scheduleObjectId: firstSchedule._id,
          slotStart: slotTime,
          slotEnd: new Date(slotTime.getTime() + (firstSchedule.slotDurationMinutes || 10) * 60 * 1000),
          queueNumber: 1,
          status: "pending",
          appointmentStatus: "pending",
          paymentStatus: "pending",
          reason: "Regular diabetic checkup and prescription renewal"
        },
        { upsert: true, new: true }
      );
    }

    return NextResponse.json({ success: true, message: "Database seeded successfully!" });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to seed database" },
      { status: 500 }
    );
  }
}
