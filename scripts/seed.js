const mongoose = require("mongoose");

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error("MONGODB_URI is not configured");
}

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
    mapUrl: String,
    latitude: Number,
    longitude: Number
  },
  { _id: false }
);

const Doctor = mongoose.models.Doctor ?? mongoose.model("Doctor", new mongoose.Schema({}, { strict: false, timestamps: true }));
const Schedule = mongoose.models.Schedule ?? mongoose.model("Schedule", new mongoose.Schema({
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true, index: true },
  hospital: { type: hospitalSchema, required: true },
  startsAt: { type: Date, required: true },
  endsAt: { type: Date, required: true },
  slotDurationMinutes: Number,
  fee: Number,
  scheduleStatus: String,
  seo: seoSchema
}, { timestamps: true }));
const Testimonial = mongoose.models.Testimonial ?? mongoose.model("Testimonial", new mongoose.Schema({}, { strict: false, timestamps: true }));
const GalleryItem = mongoose.models.GalleryItem ?? mongoose.model("GalleryItem", new mongoose.Schema({}, { strict: false, timestamps: true }));
const WebsiteSetting = mongoose.models.WebsiteSetting ?? mongoose.model("WebsiteSetting", new mongoose.Schema({}, { strict: false, timestamps: true }));

async function main() {
  await mongoose.connect(MONGODB_URI);

  await Doctor.findOneAndUpdate(
    {},
    {
      name: "Dr. Md. Rashedul Alam",
      title: "Consultant Medicine Specialist",
      biography: "A patient-focused clinician providing evidence-based care across internal medicine, chronic disease management, preventive health, and diagnostic consultations.",
      heroBadge: "Board Certified Physician",
      heroIntro: "Compassionate healthcare focused on your wellness. Specializing in internal medicine with a holistic approach to patient care.",
      heroCareTitle: "Patient-Centered Care",
      heroCareDescription: "Personalized treatment plans for every patient.",
      heroStats: [
        { value: "5000+", label: "Patients Served" },
        { value: "15+", label: "Years Experience" },
        { value: "98%", label: "Success Rate" },
        { value: "24/7", label: "Emergency Care" }
      ],
      aboutHeading: "A Personal Approach to Medicine",
      aboutBio: [
        "I believe that exceptional healthcare begins with truly listening to patients.",
        "My practice focuses on preventive care, chronic disease management, and evidence-based medicine.",
        "I support patients with practical follow-up plans and clear communication."
      ],
      aboutImageUrl: "https://images.unsplash.com/photo-1584467735871-8f8eafa7f867?auto=format&fit=crop&w=1200&q=80",
      expertiseCards: [
        { title: "Education", items: ["MBBS - Dhaka Medical College", "FCPS Medicine - BCPS", "MD Internal Medicine - BSMMU"] },
        { title: "Experience", items: ["15+ years in Internal Medicine", "Former registrar at a tertiary hospital", "Clinical professor and mentor"] }
      ],
      medicalServices: [
        { title: "Preventive Care", description: "Health screenings, vaccinations, and lifestyle counseling.", items: ["Annual exams", "Risk assessment", "Wellness counseling"] },
        { title: "Chronic Disease Management", description: "Care for diabetes, hypertension, heart disease, and respiratory disorders.", items: ["Diabetes care", "Hypertension management", "Asthma care"] }
      ],
      consultationFee: 1000,
      phone: "+8801700000000",
      whatsapp: "+8801700000000",
      address: "Dhaka, Bangladesh",
      image: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=1200&q=80",
      qualifications: ["MBBS", "FCPS Medicine", "MD Internal Medicine"],
      specialisations: ["Diabetes", "Hypertension", "Respiratory Medicine", "Preventive Care"],
      experience: ["15+ years clinical experience", "Former registrar at a tertiary hospital"],
      awards: ["Best Clinical Service Award 2022", "Community Health Excellence 2023"],
      services: ["General consultation", "Follow-up care", "Health screening", "Medical reports review"],
      seo: {
        seoTitle: "Dr. Md. Rashedul Alam | Medicine Specialist in Dhaka",
        metaDescription: "Book appointments with Dr. Md. Rashedul Alam, a consultant medicine specialist in Dhaka.",
        focusKeyword: "medicine specialist Dhaka"
      }
    },
    { upsert: true, returnDocument: "after" }
  );

  const schedules = [
    {
      title: "City Care Hospital Consultation",
      slug: "city-care-hospital-july-30",
      hospital: {
        name: "City Care Hospital",
        address: "House 12, Road 8, Dhanmondi, Dhaka",
        phone: "+8801700000000",
        mapUrl: "https://www.google.com/maps?q=Dhanmondi+Dhaka&output=embed",
        latitude: 23.7465,
        longitude: 90.376
      },
      startsAt: new Date("2026-08-10T10:00:00+06:00"),
      endsAt: new Date("2026-08-10T13:00:00+06:00"),
      slotDurationMinutes: 10,
      fee: 1000,
      scheduleStatus: "scheduled",
      seo: {
        seoTitle: "City Care Hospital Appointment | Dr. Md. Rashedul Alam",
        metaDescription: "Book an upcoming appointment schedule at City Care Hospital."
      }
    },
    {
      title: "Green Life Clinic Consultation",
      slug: "green-life-clinic-august-12",
      hospital: {
        name: "Green Life Clinic",
        address: "Mirpur 10, Dhaka",
        phone: "+8801711111111",
        mapUrl: "https://www.google.com/maps?q=Mirpur+10+Dhaka&output=embed",
        latitude: 23.8067,
        longitude: 90.3686
      },
      startsAt: new Date("2026-08-12T17:00:00+06:00"),
      endsAt: new Date("2026-08-12T20:00:00+06:00"),
      slotDurationMinutes: 15,
      fee: 900,
      scheduleStatus: "scheduled",
      seo: {
        seoTitle: "Green Life Clinic Appointment | Dr. Md. Rashedul Alam",
        metaDescription: "Book an upcoming appointment schedule at Green Life Clinic."
      }
    }
  ];

  for (const schedule of schedules) {
    await Schedule.findOneAndUpdate({ slug: schedule.slug }, schedule, { upsert: true, returnDocument: "after" });
  }

  await Testimonial.deleteMany({});
  await Testimonial.insertMany([
    { name: "Mahmud H.", quote: "The consultation was calm, clear, and very practical.", rating: 5 },
    { name: "Nusrat J.", quote: "Booking was simple and the queue number made the visit easier.", rating: 5 },
    { name: "Rafiq A.", quote: "The follow-up plan was easy to understand and follow.", rating: 5 }
  ]);

  await GalleryItem.deleteMany({});
  await GalleryItem.insertMany([
    { title: "Consultation Room", image: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=900&q=80", alt: "Modern clinic consultation room" },
    { title: "Patient Care", image: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=900&q=80", alt: "Doctor reviewing patient notes" }
  ]);

  await WebsiteSetting.findOneAndUpdate(
    {},
    {
      siteName: "Dr. Md. Rashedul Alam",
      contactPhone: "+8801700000000",
      contactAddress: "Dhaka, Bangladesh",
      defaultSeo: {
        seoTitle: "Dr. Md. Rashedul Alam | Doctor Appointment",
        metaDescription: "Doctor portfolio and appointment booking system."
      }
    },
    { upsert: true, returnDocument: "after" }
  );

  await mongoose.disconnect();
  console.log("MongoDB seed complete.");
}

main().catch(async (error) => {
  console.error(error);
  await mongoose.disconnect();
  process.exit(1);
});
