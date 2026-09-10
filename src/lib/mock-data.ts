import type { Doctor, GalleryItem, Hospital, Schedule, Testimonial, WebsiteSetting } from "./types";

export const doctor: Doctor = {
  name: "Dr. Md. Rashedul Alam",
  title: "Consultant Medicine Specialist",
  designation: "Senior Consultant",
  specialization: "Internal Medicine",
  medicalRegistrationNumber: "BMDC A-123456",
  yearsOfExperience: 15,
  onlineConsultationFee: 800,
  languages: ["Bangla", "English", "Hindi"],
  certifications: ["Board Certified - Internal Medicine", "Advanced Cardiac Life Support", "Diabetes Care Certification"],
  hospitalAffiliations: ["City Care Hospital", "Green Life Clinic"],
  contactInformation: "+8801700000000, appointments@drrashed.com",
  socialLinks: {
    facebook: "",
    linkedin: "",
    x: "",
    youtube: ""
  },
  biography:
    "A patient-focused clinician providing evidence-based care across internal medicine, chronic disease management, preventive health, and diagnostic consultations.",
  heroBadge: "Board Certified Physician",
  heroIntro:
    "Compassionate healthcare focused on your wellness. Specializing in internal medicine with a holistic approach to patient care.",
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
    "I believe that exceptional healthcare begins with truly listening to patients. Each person has a unique story, and understanding that story is essential to providing effective treatment.",
    "My practice focuses on preventive care, chronic disease management, and helping patients achieve optimal health through evidence-based medicine combined with a holistic perspective.",
    "Outside of medicine, I am passionate about medical education, community health initiatives, and staying active through hiking and yoga, practices I often recommend to my patients."
  ],
  aboutImageUrl: "/placeholder.svg",
  expertiseCards: [
    { title: "Education", items: ["MBBS - Dhaka Medical College", "FCPS Medicine - BCPS", "MD Internal Medicine - BSMMU"] },
    { title: "Experience", items: ["15+ years in Internal Medicine", "Former registrar at a tertiary hospital", "Clinical professor and mentor"] },
    { title: "Certifications", items: ["Board Certified - Internal Medicine", "Advanced Cardiac Life Support", "Diabetes care certification"] },
    { title: "Publications", items: ["50+ peer-reviewed articles", "Author of modern healthcare guides", "Regular speaker at medical conferences"] }
  ],
  medicalServices: [
    {
      title: "Preventive Care",
      description: "Comprehensive health screenings, vaccinations, and lifestyle counseling to keep you healthy and prevent disease before it starts.",
      items: ["Annual Physical Exams", "Health Risk Assessments", "Vaccination Programs", "Wellness Counseling"]
    },
    {
      title: "Chronic Disease Management",
      description: "Expert care for long-term conditions including diabetes, hypertension, heart disease, and respiratory disorders.",
      items: ["Diabetes Care", "Hypertension Management", "Asthma & COPD", "Heart Disease Monitoring"]
    },
    {
      title: "Acute Care",
      description: "Same-day appointments for sudden illnesses, infections, minor injuries, and urgent medical concerns.",
      items: ["Same-Day Appointments", "Infection Treatment", "Minor Injury Care", "Urgent Consultations"]
    },
    {
      title: "Diagnostic Services",
      description: "On-site laboratory testing, imaging coordination, and comprehensive diagnostic evaluations.",
      items: ["Blood Work", "EKG Testing", "Imaging Referrals", "Health Screenings"]
    },
    {
      title: "Geriatric Care",
      description: "Specialized care for older adults focusing on independence, multiple conditions, and quality of life.",
      items: ["Senior Wellness", "Medication Review", "Mobility Support", "Memory Screening"]
    },
    {
      title: "Medication Management",
      description: "Careful oversight of medications to ensure safety, effectiveness, and fewer side effects or interactions.",
      items: ["Prescription Reviews", "Dose Adjustments", "Interaction Checks", "Long-term Planning"]
    },
    {
      title: "Telemedicine",
      description: "Convenient virtual appointments for follow-ups, medication reviews, and minor health concerns from home.",
      items: ["Video Consultations", "Follow-up Visits", "Report Review", "Care Guidance"]
    },
    {
      title: "Specialized Referrals",
      description: "Coordinated care with trusted specialists to support complex conditions and advanced treatment plans.",
      items: ["Specialist Coordination", "Referral Letters", "Care Planning", "Progress Follow-up"]
    }
  ],
  consultationFee: 1000,
  phone: "+8801700000000",
  whatsapp: "+8801700000000",
  address: "Dhaka, Bangladesh",
  image: "/placeholder.svg",
  qualifications: ["MBBS", "FCPS Medicine", "MD Internal Medicine"],
  specialisations: ["Diabetes", "Hypertension", "Respiratory Medicine", "Preventive Care"],
  experience: ["15+ years clinical experience", "Former registrar at a tertiary hospital"],
  awards: ["Best Clinical Service Award 2022", "Community Health Excellence 2023"],
  services: ["General consultation", "Follow-up care", "Health screening", "Medical reports review"],
  seo: {
    seoTitle: "Dr. Md. Rashedul Alam | Medicine Specialist in Dhaka",
    metaDescription:
      "Book appointments with Dr. Md. Rashedul Alam, a consultant medicine specialist in Dhaka.",
    focusKeyword: "medicine specialist Dhaka",
    schema: {
      "@context": "https://schema.org",
      "@type": "Physician",
      name: "Dr. Md. Rashedul Alam",
      medicalSpecialty: "Internal Medicine"
    }
  }
};

export const mockHospitals: Hospital[] = [
  {
    id: "hosp-1",
    _id: "hosp-1",
    name: "City Care Hospital",
    address: "House 12, Road 8, Dhanmondi, Dhaka",
    phone: "+8801700000000",
    mapUrl: "https://www.google.com/maps?q=Dhanmondi+Dhaka&output=embed",
    latitude: 23.7465,
    longitude: 90.376,
    consultationFee: 1000,
    image: "/placeholder.svg",
    visitingDays: ["Saturday", "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday"],
    visitingHours: "05:00 PM - 09:00 PM",
    active: true
  },
  {
    id: "hosp-2",
    _id: "hosp-2",
    name: "Green Life Clinic",
    address: "Mirpur 10, Dhaka",
    phone: "+8801711111111",
    mapUrl: "https://www.google.com/maps?q=Mirpur+10+Dhaka&output=embed",
    latitude: 23.8067,
    longitude: 90.3686,
    consultationFee: 900,
    image: "/placeholder.svg",
    visitingDays: ["Saturday", "Sunday", "Monday", "Tuesday", "Wednesday"],
    visitingHours: "06:00 PM - 09:30 PM",
    active: true
  },
  {
    id: "hosp-3",
    _id: "hosp-3",
    name: "Central Health Clinic",
    address: "Banani, Dhaka",
    phone: "+8801722222222",
    mapUrl: "https://www.google.com/maps?q=Banani+Dhaka&output=embed",
    latitude: 23.7937,
    longitude: 90.4066,
    consultationFee: 1000,
    image: "/placeholder.svg",
    visitingDays: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
    visitingHours: "09:30 AM - 01:00 PM",
    active: true
  }
];

export const schedules: Schedule[] = [
  {
    id: "sch-1",
    title: "City Care Hospital - July 30",
    slug: "city-care-hospital-july-30",
    hospital: mockHospitals[0],
    startsAt: "2026-07-30T10:00:00+06:00",
    endsAt: "2026-07-30T13:00:00+06:00",
    slotDurationMinutes: 10,
    fee: 1000,
    bookedSlots: ["2026-07-30T04:20:00.000Z"],
    seo: {
      seoTitle: "City Care Hospital Appointment | Dr. Md. Rashedul Alam",
      metaDescription: "Book an upcoming appointment schedule at City Care Hospital."
    }
  },
  {
    id: "sch-2",
    title: "Green Life Clinic - August 01",
    slug: "green-life-clinic-august-01",
    hospital: mockHospitals[1],
    startsAt: "2026-08-01T17:00:00+06:00",
    endsAt: "2026-08-01T20:00:00+06:00",
    slotDurationMinutes: 15,
    fee: 900,
    bookedSlots: [],
    seo: {
      seoTitle: "Green Life Clinic Appointment | Dr. Md. Rashedul Alam",
      metaDescription: "Book an upcoming appointment schedule at Green Life Clinic."
    }
  },
  {
    id: "sch-3",
    title: "Central Health Clinic - August 05",
    slug: "central-health-clinic-august-05",
    hospital: mockHospitals[2],
    startsAt: "2026-08-05T09:30:00+06:00",
    endsAt: "2026-08-05T12:30:00+06:00",
    slotDurationMinutes: 10,
    fee: 1000,
    bookedSlots: [],
    seo: {
      seoTitle: "Central Health Clinic Appointment | Dr. Md. Rashedul Alam",
      metaDescription: "Book an upcoming appointment schedule at Central Health Clinic."
    }
  }
];

export const testimonials: Testimonial[] = [
  {
    name: "Mahmud H.",
    quote: "The consultation was calm, clear, and very practical.",
    rating: 5
  },
  {
    name: "Nusrat J.",
    quote: "Booking was simple and the queue number made the visit easier.",
    rating: 5
  },
  {
    name: "Rafiq A.",
    quote: "The follow-up plan was easy to understand and follow.",
    rating: 5
  }
];

export const gallery: GalleryItem[] = [
  {
    title: "City Care Hospital Chamber",
    category: "Main Hospital",
    description: "Fully equipped executive consultation chamber with private examination suite and vitals monitoring station.",
    image: "/placeholder.svg",
    images: [
      "/placeholder.svg"
    ],
    alt: "City Care Hospital executive consultation suite"
  },
  {
    title: "Green Life Clinic & Diagnostic",
    category: "Specialist Clinic",
    description: "Modern outpatient clinic featuring digital diagnostic support, patient waiting lounge, and ECG suite.",
    image: "/placeholder.svg",
    images: [
      "/placeholder.svg"
    ],
    alt: "Green Life Clinic & Diagnostic center"
  },
  {
    title: "Central Health Chamber & Lab",
    category: "Diagnostic Chamber",
    description: "Evening chamber setup with on-site sample collection, ultrasonic imaging, and dedicated patient care lounge.",
    image: "/placeholder.svg",
    images: [
      "/placeholder.svg"
    ],
    alt: "Central Health Chamber and diagnostic lab"
  }
];

export const websiteSetting: WebsiteSetting = {
  siteName: "Dr. Rashed",
  siteUrl: "https://drrashed.bd",
  footerDescription: "A modern doctor portfolio and appointment experience with scheduling, accounting, and SEO tools.",
  contactPhone: "+8801700000000",
  contactEmail: "appointments@drrashed.com",
  contactAddress: "Dhaka, Bangladesh",
  facebookUrl: "",
  linkedinUrl: "",
  xUrl: "",
  youtubeUrl: "",
  telegramUrl: "",
  googleSearchConsoleVerification: "",
  googleAnalyticsId: "",
  googleTagManagerId: "",
  bingVerification: "",
  yandexVerification: "",
  facebookDomainVerification: "",
  customHeadScript: "",
  allowIndexing: true,
  robotsTxtCustom: "",
  sitemapEnabled: true,
  disallowedPaths: ["/admin", "/api"],
  defaultSeo: {
    seoTitle: "Doctor Portfolio & Appointment System",
    metaDescription: "Doctor portfolio, schedules, booking, clinic accounting, and SEO management."
  },
  content: {
    heroPrimaryCta: "Book Appointment",
    heroSecondaryCta: "Learn More",
    scheduleBadge: "Live availability",
    scheduleTitle: "Upcoming Schedules",
    scheduleDescription: "Book from automatically generated slots and receive a queue number.",
    scheduleEmptyTitle: "No upcoming schedules",
    scheduleEmptyDescription: "New consultation dates will appear here as soon as they are published.",
    scheduleBookButton: "Book slot",
    appointmentsBadge: "Appointments",
    appointmentsTitle: "Choose a hospital schedule and reserve a queue number.",
    appointmentsDescription: "Slots are generated from backend-managed consultation duration settings and checked before confirmation.",
    servicesTitle: "Medical Services",
    servicesDescription: "From preventive care to chronic disease management, I offer a full spectrum of internal medicine services to meet your healthcare needs at every stage of life.",
    profileBadge: "Clinical profile",
    profileTitle: "Expertise at a glance",
    testimonialsBadge: "Patient voices",
    testimonialsTitle: "Testimonials",
    galleryBadge: "Clinic gallery",
    galleryTitle: "Gallery",
    galleryDescription: "A quick look at the care environment, consultation setup, and patient support spaces.",
    contactBadge: "Contact",
    contactTitle: "Need clinic information?",
    scheduleDetailBadge: "Upcoming consultation",
    shareScheduleLabel: "Share this schedule",
    appointmentFormBadge: "Appointment request",
    appointmentFormTitle: "Choose your slot",
    appointmentFormDescription: "Queue number is assigned automatically after a valid slot is selected.",
    patientNameLabel: "Full name",
    patientNamePlaceholder: "Patient full name",
    patientAddressLabel: "Address",
    patientAddressPlaceholder: "Patient address (optional)",
    patientMobileLabel: "Mobile number",
    patientMobilePlaceholder: "01XXXXXXXXX",
    patientSlotLabel: "Appointment slot",
    patientSlotPlaceholder: "Choose an available slot",
    appointmentSubmitButton: "Request appointment",
    appointmentValidationMessage: "Please enter your full name, valid mobile number, and select an appointment slot.",
    appointmentSuccessMessage: "Appointment requested. Queue number: {queueNumber}",
    appointmentApprovedMessage: "Dear {patientName}, your appointment{dateText} has been approved.{queueText} Thank you.",
    appointmentCancelledMessage: "Dear {patientName}, your appointment{dateText} has been cancelled. Please contact the clinic if you need a new booking."
  }
};
