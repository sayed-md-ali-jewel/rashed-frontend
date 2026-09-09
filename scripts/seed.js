const mongoose = require("mongoose");

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/doctor_portfolio";

const seoSchema = new mongoose.Schema(
  {
    seoTitle: String,
    metaDescription: String,
    focusKeyword: String,
    canonicalUrl: String,
    ogTitle: String,
    ogDescription: String,
    ogImage: String,
    twitterTitle: String,
    twitterDescription: String,
    twitterImage: String,
    noIndex: Boolean,
    schema: mongoose.Schema.Types.Mixed
  },
  { _id: false }
);

const hospitalSchema = new mongoose.Schema(
  {
    name: String,
    address: String,
    phone: String,
    googleMapsUrl: String,
    embeddedMapUrl: String,
    mapUrl: String,
    latitude: Number,
    longitude: Number,
    consultationFee: Number,
    active: Boolean
  },
  { _id: false }
);

const AdminUser = mongoose.models.AdminUser ?? mongoose.model("AdminUser", new mongoose.Schema({}, { strict: false, timestamps: true }));
const Doctor = mongoose.models.Doctor ?? mongoose.model("Doctor", new mongoose.Schema({}, { strict: false, timestamps: true }));
const Hospital = mongoose.models.Hospital ?? mongoose.model("Hospital", new mongoose.Schema({}, { strict: false, timestamps: true }));
const Schedule = mongoose.models.Schedule ?? mongoose.model("Schedule", new mongoose.Schema({
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true, index: true },
  hospitalId: { type: mongoose.Schema.Types.ObjectId, ref: "Hospital" },
  hospital: { type: hospitalSchema, required: true },
  startsAt: { type: Date, required: true },
  endsAt: { type: Date, required: true },
  slotDurationMinutes: Number,
  fee: Number,
  maxAppointments: Number,
  scheduleStatus: String,
  seo: seoSchema
}, { timestamps: true }));
const Patient = mongoose.models.Patient ?? mongoose.model("Patient", new mongoose.Schema({}, { strict: false, timestamps: true }));
const Appointment = mongoose.models.Appointment ?? mongoose.model("Appointment", new mongoose.Schema({}, { strict: false, timestamps: true }));
const Payment = mongoose.models.Payment ?? mongoose.model("Payment", new mongoose.Schema({}, { strict: false, timestamps: true }));
const Income = mongoose.models.Income ?? mongoose.model("Income", new mongoose.Schema({}, { strict: false, timestamps: true }));
const Expense = mongoose.models.Expense ?? mongoose.model("Expense", new mongoose.Schema({}, { strict: false, timestamps: true }));
const Testimonial = mongoose.models.Testimonial ?? mongoose.model("Testimonial", new mongoose.Schema({}, { strict: false, timestamps: true }));
const GalleryItem = mongoose.models.GalleryItem ?? mongoose.model("GalleryItem", new mongoose.Schema({}, { strict: false, timestamps: true }));
const Service = mongoose.models.Service ?? mongoose.model("Service", new mongoose.Schema({}, { strict: false, timestamps: true }));
const Faq = mongoose.models.Faq ?? mongoose.model("Faq", new mongoose.Schema({}, { strict: false, timestamps: true }));
const WebsiteSetting = mongoose.models.WebsiteSetting ?? mongoose.model("WebsiteSetting", new mongoose.Schema({}, { strict: false, timestamps: true }));

async function main() {
  console.log("Connecting to MongoDB at:", MONGODB_URI);
  await mongoose.connect(MONGODB_URI);

  // 1. Admin User
  await AdminUser.findOneAndUpdate(
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
    { upsert: true, returnDocument: "after" }
  );

  // 2. Doctor Profile
  await Doctor.findOneAndUpdate(
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
      biography: "A patient-focused clinician providing evidence-based care across internal medicine, chronic disease management, preventive health, and diagnostic consultations.",
      heroBadge: "Board Certified Physician",
      heroIntro: "Compassionate healthcare focused on your wellness. Specializing in internal medicine with a holistic approach to patient care.",
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
    { upsert: true, returnDocument: "after" }
  );

  // 3. Website Settings
  await WebsiteSetting.findOneAndUpdate(
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
    { upsert: true, returnDocument: "after" }
  );

  // 4. Hospitals
  const hospitals = [
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
  for (const h of hospitals) {
    const doc = await Hospital.findOneAndUpdate({ name: h.name }, h, { upsert: true, returnDocument: "after" });
    hospitalDocs.push(doc);
  }

  // 5. Schedules
  const now = new Date();
  const future1 = new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000);
  future1.setHours(10, 0, 0, 0);
  const future1End = new Date(future1.getTime() + 3 * 60 * 60 * 1000);

  const future2 = new Date(now.getTime() + 4 * 24 * 60 * 60 * 1000);
  future2.setHours(17, 0, 0, 0);
  const future2End = new Date(future2.getTime() + 3 * 60 * 60 * 1000);

  const future3 = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
  future3.setHours(9, 30, 0, 0);
  const future3End = new Date(future3.getTime() + 3 * 60 * 60 * 1000);

  const schedules = [
    {
      title: "City Care Hospital Consultation",
      slug: "city-care-hospital-consultation",
      hospitalId: hospitalDocs[0]._id,
      hospital: hospitalDocs[0],
      startsAt: future1,
      endsAt: future1End,
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
      startsAt: future2,
      endsAt: future2End,
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
      startsAt: future3,
      endsAt: future3End,
      slotDurationMinutes: 10,
      fee: 1000,
      maxAppointments: 18,
      scheduleStatus: "scheduled"
    }
  ];

  for (const s of schedules) {
    await Schedule.findOneAndUpdate({ slug: s.slug }, s, { upsert: true, returnDocument: "after" });
  }

  // 6. Testimonials
  await Testimonial.deleteMany({});
  await Testimonial.insertMany([
    { name: "Mahmud H.", quote: "The consultation was calm, clear, and very practical. Highly recommend Dr. Rashed.", rating: 5, designation: "Diabetes Patient" },
    { name: "Nusrat J.", quote: "Booking online was simple and the queue number made our hospital visit completely hassle-free.", rating: 5, designation: "Hypertension Patient" },
    { name: "Rafiq A.", quote: "The personalized follow-up care plan helped me recover quickly from persistent chest congestion.", rating: 5, designation: "General Patient" },
    { name: "Shireen K.", quote: "Compassionate physician who explains clinical findings clearly without rushing.", rating: 5, designation: "Preventive Checkup" }
  ]);

  // 7. Gallery
  await GalleryItem.deleteMany({});
  await GalleryItem.insertMany([
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
  await Faq.deleteMany({});
  await Faq.insertMany([
    { question: "How can I book an appointment?", answer: "Choose your preferred hospital schedule, select an available slot, enter your name and phone number, and submit to receive an instant queue number.", category: "booking", order: 1 },
    { question: "What should I bring to my first visit?", answer: "Please bring any previous medical prescriptions, lab reports, imaging scans, and a list of your current medications.", category: "consultation", order: 2 },
    { question: "Is online consultation available?", answer: "Yes, video consultations are available for follow-up reviews and medication management.", category: "consultation", order: 3 },
    { question: "Can I reschedule my appointment?", answer: "Yes, you can contact the clinic hotline or log in to the patient portal with your mobile number to view and manage your booking.", category: "booking", order: 4 }
  ]);

  // 9. Services
  await Service.deleteMany({});
  await Service.insertMany([
    { name: "General Medicine Consultation", description: "Comprehensive health evaluation and evidence-based diagnostic assessment.", fee: 1000, icon: "Stethoscope", active: true, order: 1 },
    { name: "Diabetes & Endocrine Care", description: "Personalized glycemic control, HbA1c monitoring, and dietary planning.", fee: 1000, icon: "Activity", active: true, order: 2 },
    { name: "Hypertension & Cardiovascular Health", description: "Long-term blood pressure control and cardiovascular risk prevention.", fee: 1000, icon: "Heart", active: true, order: 3 },
    { name: "Respiratory Disease Management", description: "Treatment for asthma, COPD, bronchitis, and persistent respiratory symptoms.", fee: 1000, icon: "Wind", active: true, order: 4 }
  ]);

  // 10. Incomes & Expenses
  await Income.deleteMany({});
  await Income.insertMany([
    { title: "City Care Consultations (15 Patients)", amount: 15000, incomeDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), category: "consultation", paymentMethod: "cash" },
    { title: "Green Life Consultations (10 Patients)", amount: 9000, incomeDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), category: "consultation", paymentMethod: "bkash" },
    { title: "Online Medical Reports Review", amount: 2400, incomeDate: new Date(), category: "procedure", paymentMethod: "nagad" }
  ]);

  await Expense.deleteMany({});
  await Expense.insertMany([
    { title: "Clinic Chamber Monthly Utility", amount: 3500, expenseDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), category: "utility", notes: "Electricity & Internet" },
    { title: "Medical Diagnostic Supplies", amount: 4800, expenseDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), category: "medicine", notes: "Stethoscopes, BP cuffs & disposable sheets" }
  ]);

  // 11. Sample Patient & Appointment
  const patient = await Patient.findOneAndUpdate(
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
    { upsert: true, returnDocument: "after" }
  );

  const sched = await Schedule.findOne({ scheduleStatus: "scheduled" }).lean();
  if (sched) {
    const slotTime = new Date(sched.startsAt);
    await Appointment.findOneAndUpdate(
      { scheduleId: String(sched._id), slotStart: slotTime },
      {
        patientId: patient._id,
        patientName: patient.fullName,
        mobileNumber: patient.mobileNumber,
        hospitalName: sched.hospital?.name || "City Care Hospital",
        scheduleId: String(sched._id),
        scheduleObjectId: sched._id,
        slotStart: slotTime,
        slotEnd: new Date(slotTime.getTime() + (sched.slotDurationMinutes || 10) * 60 * 1000),
        queueNumber: 1,
        status: "pending",
        appointmentStatus: "pending",
        paymentStatus: "pending",
        reason: "Regular diabetic checkup and prescription renewal"
      },
      { upsert: true, returnDocument: "after" }
    );
  }

  await mongoose.disconnect();
  console.log("✅ MongoDB Seed complete! All collections initialized successfully.");
}

main().catch(async (error) => {
  console.error("❌ Seed failed:", error);
  await mongoose.disconnect();
  process.exit(1);
});
