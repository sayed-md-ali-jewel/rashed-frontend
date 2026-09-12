import type { BlogPost, Doctor, GalleryItem, Hospital, Schedule, Testimonial, WebsiteSetting } from "./types";

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
  enablePatientChat: true,
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
  enablePatientChat: true,
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

export const mockBlogPosts: BlogPost[] = [
  {
    id: "blog-post-1",
    title: "Non-Surgical Interventions for Chronic Lower Back Pain: A Modern Clinical Protocol",
    slug: "non-surgical-interventions-chronic-back-pain",
    excerpt: "Discover evidence-based non-surgical strategies, rehabilitation protocols, and targeted interventional pain management for persistent lumbar spinal discomfort.",
    category: "Spine & Pain Medicine",
    tags: ["Lumbar Spine", "Pain Management", "Rehabilitation", "Non-Surgical"],
    author: "Dr. Md. Rashedul Alam",
    authorRole: "Physical Medicine & Rehabilitation Specialist",
    authorAvatar: "/placeholder.svg",
    coverImage: "/placeholder.svg",
    status: "published",
    publishedAt: "2026-03-10T10:00:00.000Z",
    readingTimeMinutes: 6,
    views: 1420,
    seo: {
      seoTitle: "Non-Surgical Lower Back Pain Management | Dr. Md. Rashedul Alam",
      metaDescription: "Evidence-based non-surgical protocols and physical medicine solutions for chronic lower back pain and lumbar disc issues.",
      focusKeyword: "Lower Back Pain",
      canonicalUrl: "https://rashedulalam.com/blog/non-surgical-interventions-chronic-back-pain",
      ogTitle: "Non-Surgical Interventions for Chronic Lower Back Pain",
      ogDescription: "A comprehensive clinical protocol by Dr. Md. Rashedul Alam detailing non-surgical spine care.",
      metaRobots: "index, follow"
    },
    contentBlocks: [
      {
        id: "b1",
        type: "paragraph",
        content: "Chronic lower back pain is one of the leading causes of global disability, impacting mobility, work productivity, and overall vitality. While many patients fear that spinal surgery is their only recourse, modern Physical Medicine and Rehabilitation (PMR) offers robust, non-operative pathways that restore biomechanical function and relieve neuropathic distress.",
        order: 0
      },
      {
        id: "b2",
        type: "note",
        content: "Early diagnostic assessment prevents structural degeneration. Conservative interventional management within the first 6–12 weeks of persistent symptoms yields the highest recovery rate.",
        data: { variant: "info", title: "Clinical Key Insight" },
        order: 1
      },
      {
        id: "b3",
        type: "h2",
        content: "Understanding the Etiology of Chronic Lumbar Pain",
        anchorId: "understanding-the-etiology-of-chronic-lumbar-pain",
        order: 2
      },
      {
        id: "b4",
        type: "paragraph",
        content: "The lumbar spine is a complex architectural matrix composed of vertebrae, intervertebral discs, facet joints, ligaments, and stabilizing muscle groups. Identifying the precise pain generator is essential before formulating a rehabilitation regimen.",
        order: 3
      },
      {
        id: "b5",
        type: "h3",
        content: "Common Mechanical and Neuropathic Drivers",
        anchorId: "common-mechanical-and-neuropathic-drivers",
        order: 4
      },
      {
        id: "b6",
        type: "unordered_list",
        content: "",
        data: {
          items: [
            "Lumbar disc herniation causing nerve root impingement (Sciatica)",
            "Facet joint arthropathy secondary to age-related degenerative changes",
            "Myofascial pain syndrome and chronic paraspinal muscle spasms",
            "Sacroiliac joint dysfunction and pelvic misalignment"
          ]
        },
        order: 5
      },
      {
        id: "b7",
        type: "quote",
        content: "Effective spinal rehabilitation is not merely about suppressing pain; it is about retraining neuromuscular pathways and restoring functional kinetic chain stability.",
        data: {
          author: "Dr. Md. Rashedul Alam",
          citation: "Clinical Protocol Manual, 2026",
          style: "modern"
        },
        order: 6
      },
      {
        id: "b8",
        type: "h2",
        content: "Multimodal Non-Surgical Treatment Modalities",
        anchorId: "multimodal-non-surgical-treatment-modalities",
        order: 7
      },
      {
        id: "b9",
        type: "paragraph",
        content: "A tiered conservative intervention framework combines targeted pharmacological relief, image-guided procedures, and customized biomechanical exercise therapy.",
        order: 8
      },
      {
        id: "b10",
        type: "table",
        content: "",
        data: {
          headers: ["Phase", "Clinical Objective", "Primary Modality", "Expected Timeline"],
          rows: [
            ["Phase 1: Acute Relief", "Reduce nerve inflammation & spasm", "Targeted Injections / Medications", "1 - 2 Weeks"],
            ["Phase 2: Mobility Restoration", "Restore lumbar range of motion", "Therapeutic Ultrasound / Gentle Mobilization", "2 - 4 Weeks"],
            ["Phase 3: Core Stabilization", "Rebuild kinetic spinal stability", "McKenzie Protocol / Core Conditioning", "4 - 8 Weeks"],
            ["Phase 4: Functional Maintenance", "Prevent recurrence & optimize posture", "Ergonomic Coaching & Home Regimen", "Ongoing"]
          ]
        },
        order: 9
      },
      {
        id: "b11",
        type: "h3",
        content: "Targeted Interventional Procedures",
        anchorId: "targeted-interventional-procedures",
        order: 10
      },
      {
        id: "b12",
        type: "paragraph",
        content: "For patients suffering from acute radiculopathy or persistent facet pain, ultrasound or fluoroscopy-guided precision injections deliver anti-inflammatory agents directly to the pathological site, enabling immediate pain relief and facilitating faster physical therapy.",
        order: 11
      },
      {
        id: "b13",
        type: "before_after",
        content: "",
        data: {
          title: "Posture and Spinal Alignment Transformation",
          beforeLabel: "Compromised Lumbar Lordosis",
          afterLabel: "Corrected Biomechanical Posture",
          beforeDescription: "Slouched workstation posture causing anterior disc compression and paraspinal fatigue.",
          afterDescription: "Ergonomically supported posture with balanced kinetic alignment and relaxed shoulder girdle."
        },
        order: 12
      },
      {
        id: "b14",
        type: "h2",
        content: "Frequently Asked Patient Questions",
        anchorId: "frequently-asked-patient-questions",
        order: 13
      },
      {
        id: "b15",
        type: "faq",
        content: "",
        data: {
          faqs: [
            {
              question: "When should I consider surgery for lower back pain?",
              answer: "Surgery is generally reserved for severe 'red flag' cases, such as progressive neurological deficits (foot drop, severe muscle weakness) or cauda equina syndrome with bowel/bladder dysfunction. Over 90% of uncomplicated cases resolve with conservative care."
            },
            {
              question: "Is bed rest recommended during acute back pain flare-ups?",
              answer: "Strict bed rest exceeding 24–48 hours is discouraged as it leads to muscle deconditioning and joint stiffness. Gentle walking and guided mobility exercises are proven to accelerate recovery."
            },
            {
              question: "How long does spinal rehabilitation take?",
              answer: "Most patients experience significant functional improvement within 4 to 6 weeks of consistent multimodal therapy and active adherence to home rehabilitation guidelines."
            }
          ]
        },
        order: 14
      },
      {
        id: "b16",
        type: "cta",
        content: "",
        data: {
          title: "Suffering from Persistent Spine or Nerve Pain?",
          description: "Schedule a comprehensive clinical consultation with Dr. Md. Rashedul Alam to develop your personalized non-surgical treatment plan.",
          buttonText: "Book an Appointment",
          buttonUrl: "/#schedules",
          secondaryButtonText: "Call Clinic",
          secondaryButtonUrl: "tel:+8801700000000"
        },
        order: 15
      }
    ]
  },
  {
    id: "blog-post-2",
    title: "Platelet-Rich Plasma (PRP) Therapy in Knee Osteoarthritis: Clinical Evidence & Recovery Timelines",
    slug: "prp-therapy-knee-osteoarthritis-guide",
    excerpt: "An in-depth exploration of autologous regenerative therapy, cartilage preservation protocols, and post-injection rehabilitation for degenerative joint disease.",
    category: "Regenerative Medicine",
    tags: ["PRP Therapy", "Osteoarthritis", "Joint Health", "Regenerative Care"],
    author: "Dr. Md. Rashedul Alam",
    authorRole: "Physical Medicine & Rehabilitation Specialist",
    authorAvatar: "/placeholder.svg",
    coverImage: "/placeholder.svg",
    status: "published",
    publishedAt: "2026-03-05T09:00:00.000Z",
    readingTimeMinutes: 5,
    views: 980,
    seo: {
      seoTitle: "PRP Therapy for Knee Osteoarthritis | Dr. Md. Rashedul Alam",
      metaDescription: "Comprehensive guide to PRP regenerative therapy for knee osteoarthritis: indications, procedure steps, and recovery timeline.",
      focusKeyword: "PRP Therapy Knee",
      canonicalUrl: "https://rashedulalam.com/blog/prp-therapy-knee-osteoarthritis-guide",
      metaRobots: "index, follow"
    },
    contentBlocks: [
      {
        id: "p2-b1",
        type: "paragraph",
        content: "Knee osteoarthritis (OA) affects millions globally, leading to chronic joint effusion, cartilage breakdown, and reduced ambulatory range. Platelet-Rich Plasma (PRP) therapy has emerged as a groundbreaking biological intervention that harnesses the body's own growth factors to modulate intra-articular inflammation and promote tissue repair.",
        order: 0
      },
      {
        id: "p2-b2",
        type: "h2",
        content: "Mechanism of Action in Articular Cartilage",
        anchorId: "mechanism-of-action-in-articular-cartilage",
        order: 1
      },
      {
        id: "p2-b3",
        type: "paragraph",
        content: "Platelets contain alpha granules rich in transforming growth factor-beta (TGF-β), platelet-derived growth factor (PDGF), and vascular endothelial growth factor (VEGF). When injected into the synovial cavity, these bioactive proteins inhibit pro-inflammatory cytokines and stimulate chondrocyte metabolism.",
        order: 2
      },
      {
        id: "p2-b4",
        type: "note",
        content: "PRP therapy is most effective in Grade I to Grade III Kellgren-Lawrence osteoarthritis. For end-stage bone-on-bone arthritis (Grade IV), multidisciplinary surgical evaluation is recommended.",
        data: { variant: "warning", title: "Patient Selection Criteria" },
        order: 3
      },
      {
        id: "p2-b5",
        type: "h2",
        content: "What to Expect During and After the Procedure",
        anchorId: "what-to-expect-during-and-after-the-procedure",
        order: 4
      },
      {
        id: "p2-b6",
        type: "ordered_list",
        content: "",
        data: {
          items: [
            "Venous blood collection (approx. 20–30 ml) in specialized sterile tubes",
            "Centrifugation at calibrated speeds to isolate leukocyte-rich or leukocyte-poor plasma",
            "Ultrasound-guided intra-articular injection into the knee joint capsule under sterile conditions",
            "Post-injection rest for 24–48 hours followed by structured isometric rehabilitation"
          ]
        },
        order: 5
      },
      {
        id: "p2-b7",
        type: "cta",
        content: "",
        data: {
          title: "Explore Regenerative Treatment for Joint Pain",
          description: "Consult with Dr. Md. Rashedul Alam to evaluate if PRP therapy is suitable for your joint condition.",
          buttonText: "Schedule an Assessment",
          buttonUrl: "/#schedules"
        },
        order: 6
      }
    ]
  },
  {
    id: "blog-post-3",
    title: "Post-Stroke Motor Rehabilitation: Neuroplasticity & Modern Recovery Strategies",
    slug: "post-stroke-motor-rehabilitation-guide",
    excerpt: "How targeted neuro-rehabilitation and repetitive task-oriented training maximize neuroplasticity and functional independence following cerebrovascular accidents.",
    category: "Neuro-Rehabilitation",
    tags: ["Stroke Rehab", "Neuroplasticity", "Motor Recovery", "Physical Therapy"],
    author: "Dr. Md. Rashedul Alam",
    authorRole: "Physical Medicine & Rehabilitation Specialist",
    authorAvatar: "/placeholder.svg",
    coverImage: "/placeholder.svg",
    status: "published",
    publishedAt: "2026-02-20T14:30:00.000Z",
    readingTimeMinutes: 7,
    views: 1850,
    seo: {
      seoTitle: "Post-Stroke Motor Rehabilitation Guide | Dr. Md. Rashedul Alam",
      metaDescription: "Comprehensive neuro-rehabilitation protocols to stimulate neuroplasticity and restore motor function after a stroke.",
      focusKeyword: "Stroke Rehabilitation",
      canonicalUrl: "https://rashedulalam.com/blog/post-stroke-motor-rehabilitation-guide",
      metaRobots: "index, follow"
    },
    contentBlocks: [
      {
        id: "p3-b1",
        type: "paragraph",
        content: "Following an ischemic or hemorrhagic stroke, motor impairment often challenges a patient's self-reliance. Neuroplasticity—the central nervous system's capacity to reorganize its neural connections in response to repetitive task-oriented stimulation—is the biological cornerstone of stroke recovery.",
        order: 0
      },
      {
        id: "p3-b2",
        type: "h2",
        content: "The Critical Time Window for Neuroplasticity",
        anchorId: "the-critical-time-window-for-neuroplasticity",
        order: 1
      },
      {
        id: "p3-b3",
        type: "paragraph",
        content: "The initial 3 to 6 months post-stroke represent the period of greatest brain plasticity. Early, intense, and structured rehabilitation under the guidance of a physiatrist yields the most dramatic functional gains.",
        order: 2
      },
      {
        id: "p3-b4",
        type: "h2",
        content: "Key Pillars of Comprehensive Neuro-Rehabilitation",
        anchorId: "key-pillars-of-comprehensive-neuro-rehabilitation",
        order: 3
      },
      {
        id: "p3-b5",
        type: "unordered_list",
        content: "",
        data: {
          items: [
            "Constraint-Induced Movement Therapy (CIMT) for upper extremity paresis",
            "Body-weight supported treadmill training for balance and gait re-education",
            "Functional Electrical Stimulation (FES) for foot drop and muscle activation",
            "Spasticity management via botulinum toxin injections and orthotic bracing"
          ]
        },
        order: 4
      },
      {
        id: "p3-b6",
        type: "cta",
        content: "",
        data: {
          title: "Expert Neuro-Rehabilitation Consultations",
          description: "Connect with our clinical team for a comprehensive stroke rehabilitation evaluation.",
          buttonText: "Request Consultation",
          buttonUrl: "/#schedules"
        },
        order: 5
      }
    ]
  }
];

