export type Language = "en" | "bn";

export type LocalizedString = string | { en?: string; bn?: string };

// Comprehensive English & Bangla Dictionary
export const translations = {
  en: {
    // Header & Navigation
    "nav.home": "Home",
    "nav.schedules": "Schedules",
    "nav.about": "About",
    "nav.services": "Services",
    "nav.reviews": "Reviews",
    "nav.contact": "Contact",
    "nav.patientPortal": "Patient Portal",
    "nav.bookAppointment": "Book Appointment",
    "nav.specialistPhysician": "Specialist Physician",
    "nav.openNav": "Open navigation",
    "nav.closeNav": "Close navigation",

    // Hero Section
    "hero.badge": "Certified Medical Specialist",
    "hero.primaryCta": "Book Consultation",
    "hero.secondaryCta": "Learn More",
    "hero.careTitle": "Patient-Centric Care",
    "hero.careDescription": "Compassionate diagnosis, personalized care plans, and advanced treatments.",
    "hero.stat.patientsServed": "Patients Served",
    "hero.stat.yearsExperience": "Years Experience",
    "hero.stat.successRate": "Success Rate",
    "hero.stat.emergencyCare": "Emergency Care",

    // Chambers Section
    "chambers.badge": "Consultation Chambers",
    "chambers.title": "Chamber List",
    "chambers.description": "Choose your preferred hospital or clinic chamber location. View consulting days, visiting hours, and book appointments easily.",
    "chambers.fee": "Fee",
    "chambers.tag": "Chamber",
    "chambers.visitingDays": "Visiting Days",
    "chambers.visitingHours": "Visiting Hours",
    "chambers.viewOnMap": "View on Map",
    "chambers.bookAppointment": "Book Appointment",

    // Days of week
    "day.Saturday": "Sat",
    "day.Sunday": "Sun",
    "day.Monday": "Mon",
    "day.Tuesday": "Tue",
    "day.Wednesday": "Wed",
    "day.Thursday": "Thu",
    "day.Friday": "Fri",
    "day.full.Saturday": "Saturday",
    "day.full.Sunday": "Sunday",
    "day.full.Monday": "Monday",
    "day.full.Tuesday": "Tuesday",
    "day.full.Wednesday": "Wednesday",
    "day.full.Thursday": "Thursday",
    "day.full.Friday": "Friday",

    // Schedule List Section
    "schedule.badge": "Available Sessions",
    "schedule.title": "Consultation Schedules",
    "schedule.description": "View upcoming chamber timings, locations, and book your verified serial slot directly.",
    "schedule.emptyTitle": "No active schedules",
    "schedule.emptyDescription": "Check back soon for new consultation chamber timings.",
    "schedule.slotsAvailable": "{count} Slots Available",
    "schedule.sessionFull": "Session Full",
    "schedule.openForVisit": "Open for Visit",
    "schedule.sessionDate": "Session Date",
    "schedule.consultationFee": "Consultation Fee",
    "schedule.slotInterval": "{mins}m intervals",
    "schedule.slotIntervalMinutes": "{mins} minutes",
    "schedule.availableOfTotal": "{available} of {total} available",
    "schedule.openQueue": "Open queue",
    "schedule.selectSlot": "Select Slot",

    // Profile & Medical Services
    "profile.servicesBadge": "Clinical Expertise",
    "profile.servicesTitle": "Specialized Medical Services",
    "profile.servicesDescription": "Comprehensive treatments and consultations delivered with modern healthcare standards.",
    "profile.doctorBadge": "Doctor Profile",
    "profile.doctorTitle": "Dedicated to Excellence in Patient Care",
    "profile.designation": "Designation",
    "profile.specialization": "Specialization",
    "profile.bmdcReg": "BMDC Registration",
    "profile.clinicalPractice": "Clinical Practice",
    "profile.chamberFee": "Chamber Fee",
    "profile.onlineFee": "Online Fee",
    "profile.yearsPlus": "{years}+ years",

    // Qualifications & Credentials Blocks
    "profile.qualifications": "Qualifications",
    "profile.specialisations": "Specialisations",
    "profile.languages": "Languages Spoken",
    "profile.certifications": "Certifications",
    "profile.hospitalAffiliations": "Hospital Affiliations",
    "profile.experience": "Professional Experience",
    "profile.awards": "Honors & Awards",

    // Testimonials & Reviews
    "reviews.badge": "Verified Feedback",
    "reviews.title": "What Patients Say",
    "reviews.subtitle": "Read genuine feedback from verified consultations",
    "reviews.verifiedPatient": "Verified Patient",
    "reviews.prev": "Previous",
    "reviews.next": "Next",

    // Gallery
    "gallery.badge": "Clinical Gallery",
    "gallery.title": "Chamber & Practice Gallery",
    "gallery.description": "Glimpse of state-of-the-art diagnostic facilities and chambers.",
    "gallery.photo": "Photo",
    "gallery.photos": "Photos",
    "gallery.practiceFacility": "Practice Facility",
    "gallery.viewAllPhotos": "View All {count} Photos",
    "gallery.photoCountOf": "Photo {current} of {total}",
    "gallery.noPhoto": "No photo available",
    "gallery.close": "Close gallery",

    // Contact & Chambers Section
    "contact.badge": "Chamber Information",
    "contact.title": "Hospital Chambers & Contact Info",
    "contact.description": "Visit during scheduled hours or call directly for emergency assistance.",

    // Footer
    "footer.consultantSpecialist": "Consultant & Specialist",
    "footer.quickNav": "Quick Navigation",
    "footer.contactChambers": "Contact & Chambers",
    "footer.bookOnline": "Book Appointment Online",
    "footer.rightsReserved": "© {year} {siteName}. All rights reserved.",
    "footer.designedWith": "Designed with modern medical standards.",
    "footer.home": "Home",
    "footer.schedules": "Consultation Schedules",
    "footer.about": "About Doctor",
    "footer.services": "Medical Services",
    "footer.reviews": "Patient Reviews",
    "footer.gallery": "Chamber Gallery",

    // Schedule Page & Social Share
    "schedulePage.breadcrumbsSchedules": "Schedules",
    "schedulePage.chamberDetailsBadge": "Chamber Details",
    "schedulePage.sessionStarts": "Session Starts",
    "schedulePage.slotInterval": "Slot Interval",
    "schedulePage.consultationFee": "Consultation Fee",
    "schedulePage.shareSchedule": "Share Schedule Link",
    "share.copyLink": "Copy Link",
    "share.linkCopied": "Link Copied!",
    "share.shareOn": "Share on {channel}",

    // Appointment Booking Form
    "booking.formBadge": "Instant Serial Booking",
    "booking.formTitle": "Book Your Serial Slot",
    "booking.formDescription": "Select your preferred slot and enter patient details.",
    "booking.patientName": "Patient Name",
    "booking.patientNamePlaceholder": "Enter full name",
    "booking.address": "Address",
    "booking.addressOptional": "(optional)",
    "booking.addressPlaceholder": "Patient village / area",
    "booking.mobileNumber": "Mobile Number",
    "booking.mobilePlaceholder": "01XXXXXXXXX",
    "booking.consultationSlot": "Consultation Slot",
    "booking.availableCount": "{count} available",
    "booking.chooseSlotPlaceholder": "Choose an available slot",
    "booking.selectTimeSlot": "Select Time Slot",
    "booking.slotsAvailableHeader": "{count} Available",
    "booking.slotsBookedHeader": "{count} Booked",
    "booking.noSlots": "No slots available for this session.",
    "booking.available": "Available",
    "booking.booked": "Booked",
    "booking.submitButton": "Confirm & Book Slot",
    "booking.processing": "Processing Booking...",
    "booking.validationError": "Please fill in all fields correctly.",
    "booking.successMessage": "Appointment requested successfully! Your serial queue number is {queueNumber}.",
    "booking.serverError": "Failed to connect to booking server. Please try again.",

    // Patient Portal
    "portal.badge": "Patient Portal",
    "portal.welcome": "Welcome, {name}",
    "portal.mobileRegistered": "Mobile registered",
    "portal.identityBadge": "Patient Identity",
    "portal.changeNumber": "Change Number",
    "portal.profileDetailsDesc": "Your verified profile details for serial bookings & prescriptions.",
    "portal.registeredName": "Registered Name",
    "portal.notProvided": "Not provided",
    "portal.smsTip": "Tip: All queue notifications and appointment serial numbers are sent to this mobile number.",
    "portal.scheduleVisitBadge": "Schedule a Visit",
    "portal.bookNewConsultation": "Book New Consultation",
    "portal.bookNewDesc": "Select an upcoming chamber schedule to book your doctor visit queue serial with instant confirmation.",
    "portal.autoPopulatedTitle": "Auto-populated Booking",
    "portal.autoPopulatedDesc": "Your profile information is automatically filled in for quick 1-click slot reservation.",
    "portal.browseSchedules": "Browse Available Schedules",
    "portal.tabAppointments": "Appointment History",
    "portal.tabRecords": "Medical Records",
    "portal.tabPayments": "Payment Records",
    "portal.noAppointments": "No appointments found",
    "portal.noAppointmentsDesc": "Book your first doctor consultation to track serial queue and status here.",
    "portal.bookFirstAppt": "Book an Appointment",
    "portal.queueNumber": "Queue #{number}",
    "portal.slot": "Slot:",
    "portal.noRecords": "No medical records yet",
    "portal.noRecordsDesc": "Prescriptions, diagnoses, and doctor visit summaries will appear here.",
    "portal.diagnosis": "Diagnosis:",
    "portal.notes": "Notes:",
    "portal.noPayments": "No payment records found",
    "portal.noPaymentsDesc": "Invoices and payment receipts will appear here after booking.",
    "portal.method": "Method:",
    "portal.cash": "Cash",
    "portal.showingPagination": "Showing {start} - {end} of {total} entries",
    "portal.prev": "Prev",
    "portal.next": "Next",
    "portal.editModalTitle": "Change Mobile Number",
    "portal.cancel": "Cancel",
    "portal.saveChanges": "Save Changes",
    "portal.saving": "Saving...",
    "portal.profileUpdated": "Mobile number and profile updated successfully!",

    // Auth & Login Cards
    "auth.patientBadge": "Patient Portal Access",
    "auth.patientLoginTitle": "Patient Login",
    "auth.patientSubtitle": "Login with only your name and mobile number.",
    "auth.patientDesc": "No email or password required. Instantly check your queue serial status, view doctor visit records, and manage your consultation appointments.",
    "auth.patientSignInTitle": "Patient Sign In",
    "auth.patientSignInDesc": "Enter your full name and mobile number to access your portal.",
    "auth.adminSignInTitle": "Admin Sign In",
    "auth.adminSignInDesc": "Enter your secure admin username and PIN.",
    "auth.username": "Username",
    "auth.pin": "PIN",
    "auth.loginButtonPatient": "Login to Patient Portal",
    "auth.loginButtonAdmin": "Access Admin Panel",
    "auth.signingIn": "Signing in...",
    "auth.logout": "Logout",

    // Appointments Page
    "appointmentsPage.badge": "Available Sessions",
    "appointmentsPage.title": "Doctor Consultation Chambers",
    "appointmentsPage.description": "Browse all upcoming consultation sessions across clinics and select your convenient serial slot.",

    // 404 Page
    "notFound.title": "Page not found",
    "notFound.description": "The page may have moved or the schedule is no longer available.",
    "notFound.button": "View appointments",

    // Floating Button
    "floating.book": "Book Appointment",

    // Chat & Messaging
    "chat.withDoctor": "Chat with Doctor",
    "chat.directConsult": "Direct Doctor Consultation",
    "chat.waitingApproval": "Waiting for doctor's approval",
    "chat.requestSent": "Message request sent to doctor",
    "chat.approved": "Your request has been approved. You can now chat in real time.",
    "chat.rejected": "Your message request was declined.",
    "chat.typeMessage": "Type a message...",
    "chat.online": "Online",
    "chat.offline": "Offline",
    "chat.typingDoctor": "Doctor is typing...",
    "chat.typingPatient": "Patient is typing...",
    "chat.sendRequest": "Send Message Request",
    "chat.sending": "Sending...",
    "chat.closeChat": "Close Chat",
    "chat.lockedNotice": "Messaging locked until doctor approves your request."
  },

  bn: {
    // Header & Navigation
    "nav.home": "হোম",
    "nav.schedules": "শিডিউল",
    "nav.about": "পরিচিতি",
    "nav.services": "সেবাসমূহ",
    "nav.reviews": "মতামত",
    "nav.contact": "যোগাযোগ",
    "nav.patientPortal": "পেশেন্ট পোর্টাল",
    "nav.bookAppointment": "অ্যাপয়েন্টমেন্ট বুকিং",
    "nav.specialistPhysician": "বিশেষজ্ঞ চিকিৎসক",
    "nav.openNav": "মেনু খুলুন",
    "nav.closeNav": "মেনু বন্ধ করুন",

    // Hero Section
    "hero.badge": "বোর্ড সার্টিফাইড বিশেষজ্ঞ চিকিৎসক",
    "hero.primaryCta": "পরামর্শের জন্য বুক করুন",
    "hero.secondaryCta": "আরও জানুন",
    "hero.careTitle": "রোগীকেন্দ্রিক যত্ন ও চিকিৎসা",
    "hero.careDescription": "সঠিক রোগ নির্ণয়, ব্যক্তিগত চিকিৎসা পরিকল্পনা এবং আধুনিক সেবা।",
    "hero.stat.patientsServed": "রোগী সেবা গ্রহণ করেছেন",
    "hero.stat.yearsExperience": "বছরের অভিজ্ঞতা",
    "hero.stat.successRate": "সফলতার হার",
    "hero.stat.emergencyCare": "জরুরি সেবা",

    // Chambers Section
    "chambers.badge": "পরামর্শ চেম্বারসমূহ",
    "chambers.title": "চেম্বারের তালিকা",
    "chambers.description": "আপনার সুবিধাজনক হাসপাতাল বা ক্লিনিক চেম্বার বেছে নিন। পরামর্শের দিন, সময় দেখুন এবং সহজে অ্যাপয়েন্টমেন্ট বুক করুন।",
    "chambers.fee": "ফি",
    "chambers.tag": "চেম্বার",
    "chambers.visitingDays": "রোগী দেখার দিন",
    "chambers.visitingHours": "রোগী দেখার সময়",
    "chambers.viewOnMap": "ম্যাপে দেখুন",
    "chambers.bookAppointment": "অ্যাপয়েন্টমেন্ট নিন",

    // Days of week
    "day.Saturday": "শনি",
    "day.Sunday": "রবি",
    "day.Monday": "সোম",
    "day.Tuesday": "মঙ্গল",
    "day.Wednesday": "বুধ",
    "day.Thursday": "বৃহস্পতি",
    "day.Friday": "শুক্র",
    "day.full.Saturday": "শনিবার",
    "day.full.Sunday": "রবিবার",
    "day.full.Monday": "সোমবার",
    "day.full.Tuesday": "মঙ্গলবার",
    "day.full.Wednesday": "বুধবার",
    "day.full.Thursday": "বৃহস্পতিবার",
    "day.full.Friday": "শুক্রবার",

    // Schedule List Section
    "schedule.badge": "উপলব্ধ সেশনসমূহ",
    "schedule.title": "পরামর্শের শিডিউল",
    "schedule.description": "আসন্ন চেম্বার সময়সূচি, অবস্থান দেখুন এবং সরাসরি আপনার ভেরিফাইড সিরিয়াল স্লট বুক করুন।",
    "schedule.emptyTitle": "কোনো সক্রিয় শিডিউল পাওয়া যায়নি",
    "schedule.emptyDescription": "নতুন চেম্বার শিডিউল প্রকাশিত হলে এখানে দেখা যাবে।",
    "schedule.slotsAvailable": "{count}টি স্লট খালি আছে",
    "schedule.sessionFull": "সেশন পূর্ণ",
    "schedule.openForVisit": "সরাসরি উপস্থিতির জন্য উন্মুক্ত",
    "schedule.sessionDate": "সেশনের তারিখ",
    "schedule.consultationFee": "পরামর্শ ফি",
    "schedule.slotInterval": "{mins} মি. ব্যবধান",
    "schedule.slotIntervalMinutes": "{mins} মিনিট",
    "schedule.availableOfTotal": "{total}টির মধ্যে {available}টি খালি",
    "schedule.openQueue": "উন্মুক্ত সিরিয়াল",
    "schedule.selectSlot": "স্লট নির্বাচন করুন",

    // Profile & Medical Services
    "profile.servicesBadge": "ক্লিনিক্যাল দক্ষতা",
    "profile.servicesTitle": "বিশেষায়িত চিকিৎসা সেবাসমূহ",
    "profile.servicesDescription": "আধুনিক স্বাস্থ্যসেবা মান ও সতর্কতার সাথে সমন্বিত চিকিৎসা এবং স্বাস্থ্য পরামর্শ।",
    "profile.doctorBadge": "চিকিৎসক পরিচিতি",
    "profile.doctorTitle": "রোগী সেবায় উৎসর্গীকৃত আধুনিক চিকিৎসা",
    "profile.designation": "পদবী",
    "profile.specialization": "বিশেষত্ব",
    "profile.bmdcReg": "বিএমডিসি রেজিস্ট্রেশন",
    "profile.clinicalPractice": "ক্লিনিক্যাল অভিজ্ঞতা",
    "profile.chamberFee": "চেম্বার ফি",
    "profile.onlineFee": "অনলাইন ফি",
    "profile.yearsPlus": "{years}+ বছর",

    // Qualifications & Credentials Blocks
    "profile.qualifications": "শিক্ষাগত যোগ্যতা",
    "profile.specialisations": "বিশেষ দক্ষতাসমূহ",
    "profile.languages": "কথোপকথনের ভাষা",
    "profile.certifications": "সার্টিফিকেশন ও প্রশিক্ষণ",
    "profile.hospitalAffiliations": "হাসপাতাল সংযুক্তি",
    "profile.experience": "পেশাদার অভিজ্ঞতা",
    "profile.awards": "সম্মাননা ও পুরস্কার",

    // Testimonials & Reviews
    "reviews.badge": "ভেরিফাইড মতামত",
    "reviews.title": "রোগীদের অনুভূতি ও মতামত",
    "reviews.subtitle": "ভেরিফাইড পরামর্শ গ্রহণকারী রোগীদের বাস্তব প্রতিক্রিয়া পড়ুন",
    "reviews.verifiedPatient": "ভেরিফাইড রোগী",
    "reviews.prev": "পূর্ববর্তী",
    "reviews.next": "পরবর্তী",

    // Gallery
    "gallery.badge": "ক্লিনিক্যাল গ্যালারি",
    "gallery.title": "চেম্বার ও ক্লিনিক গ্যালারি",
    "gallery.description": "উন্নত রোগ নির্ণয় সুবিধা এবং আধুনিক চেম্বার পরিবেশের এক ঝলক।",
    "gallery.photo": "ছবি",
    "gallery.photos": "ছবি",
    "gallery.practiceFacility": "চিকিৎসা সুবিধা",
    "gallery.viewAllPhotos": "সকল {count}টি ছবি দেখুন",
    "gallery.photoCountOf": "ছবি {current} / {total}",
    "gallery.noPhoto": "কোনো ছবি পাওয়া যায়নি",
    "gallery.close": "গ্যালারি বন্ধ করুন",

    // Contact & Chambers Section
    "contact.badge": "চেম্বার তথ্য",
    "contact.title": "হাসপাতাল চেম্বার ও যোগাযোগের ঠিকানা",
    "contact.description": "নির্ধারিত সময়ে চেম্বারে সরাসরি আসুন অথবা জরুরি প্রয়োজনে যোগাযোগ করুন।",

    // Footer
    "footer.consultantSpecialist": "কনসালট্যান্ট ও মেডিসিন বিশেষজ্ঞ",
    "footer.quickNav": "দ্রুত নেভিগেশন",
    "footer.contactChambers": "যোগাযোগ ও চেম্বার",
    "footer.bookOnline": "অনলাইনে অ্যাপয়েন্টমেন্ট নিন",
    "footer.rightsReserved": "© {year} {siteName}। সর্বস্বত্ব সংরক্ষিত।",
    "footer.designedWith": "আধুনিক চিকিৎসা ও নিরাপত্তা মান অনুসারে নির্মিত।",
    "footer.home": "হোম",
    "footer.schedules": "পরামর্শ শিডিউল",
    "footer.about": "চিকিৎসক পরিচিতি",
    "footer.services": "চিকিৎসা সেবা",
    "footer.reviews": "রোগীদের রিভিউ",
    "footer.gallery": "চেম্বার গ্যালারি",

    // Schedule Page & Social Share
    "schedulePage.breadcrumbsSchedules": "শিডিউল",
    "schedulePage.chamberDetailsBadge": "চেম্বারের বিবরণ",
    "schedulePage.sessionStarts": "সেশন শুরু",
    "schedulePage.slotInterval": "স্লটের ব্যবধান",
    "schedulePage.consultationFee": "পরামর্শ ফি",
    "schedulePage.shareSchedule": "শিডিউল লিংক শেয়ার করুন",
    "share.copyLink": "লিংক কপি করুন",
    "share.linkCopied": "লিংক কপি হয়েছে!",
    "share.shareOn": "{channel}-এ শেয়ার করুন",

    // Appointment Booking Form
    "booking.formBadge": "দ্রুত সিরিয়াল বুকিং",
    "booking.formTitle": "আপনার সিরিয়াল স্লট বুক করুন",
    "booking.formDescription": "পছন্দের স্লট বেছে নিন এবং রোগীর তথ্য পূরণ করুন।",
    "booking.patientName": "রোগীর পূর্ণ নাম",
    "booking.patientNamePlaceholder": "রোগীর পুরো নাম লিখুন",
    "booking.address": "ঠিকানা",
    "booking.addressOptional": "(ঐচ্ছিক)",
    "booking.addressPlaceholder": "রোগীর এলাকা / গ্রাম",
    "booking.mobileNumber": "মোবাইল নম্বর",
    "booking.mobilePlaceholder": "০১৮XXXXXXXX",
    "booking.consultationSlot": "পরামর্শ স্লট",
    "booking.availableCount": "{count}টি খালি",
    "booking.chooseSlotPlaceholder": "একটি খালি স্লট নির্বাচন করুন",
    "booking.selectTimeSlot": "সময় স্লট নির্বাচন করুন",
    "booking.slotsAvailableHeader": "{count}টি উপলব্ধ",
    "booking.slotsBookedHeader": "{count}টি বুকড",
    "booking.noSlots": "এই সেশনে কোনো খালি স্লট নেই।",
    "booking.available": "খালি আছে",
    "booking.booked": "বুকড",
    "booking.submitButton": "নিশ্চিত করুন ও সিরিয়াল নিন",
    "booking.processing": "বুকিং প্রক্রিয়াধীন...",
    "booking.validationError": "অনুগ্রহ করে সব তথ্য সঠিকভাবে পূরণ করুন।",
    "booking.successMessage": "অ্যাপয়েন্টমেন্ট সফলভাবে গ্রহণ করা হয়েছে! আপনার সিরিয়াল নম্বর: {queueNumber}",
    "booking.serverError": "বুকিং সার্ভারে সংযোগ স্থাপন করা যায়নি। পুনরায় চেষ্টা করুন।",

    // Patient Portal
    "portal.badge": "পেশেন্ট পোর্টাল",
    "portal.welcome": "স্বাগতম, {name}",
    "portal.mobileRegistered": "নিবন্ধিত মোবাইল",
    "portal.identityBadge": "রোগীর পরিচিতি",
    "portal.changeNumber": "নম্বর পরিবর্তন",
    "portal.profileDetailsDesc": "সিরিয়াল বুকিং ও প্রেসক্রিপশনের জন্য আপনার ভেরিফাইড প্রোফাইল তথ্য।",
    "portal.registeredName": "নিবন্ধিত নাম",
    "portal.notProvided": "দেওয়া হয়নি",
    "portal.smsTip": "পরামর্শ: সিরিয়াল নম্বর ও সকল নোটিফিকেশন এই মোবাইল নম্বরে পাঠানো হবে।",
    "portal.scheduleVisitBadge": "সাক্ষাৎসূচি নির্ধারণ",
    "portal.bookNewConsultation": "নতুন অ্যাপয়েন্টমেন্ট বুক করুন",
    "portal.bookNewDesc": "আসন্ন চেম্বার শিডিউল বেছে নিয়ে সরাসরি চিকিৎসকের সাথে সাক্ষাতের সিরিয়াল বুক করুন।",
    "portal.autoPopulatedTitle": "স্বয়ংক্রিয় তথ্য পূরণ",
    "portal.autoPopulatedDesc": "দ্রুত ১-ক্লিকে বুকিংয়ের জন্য আপনার পূর্বের তথ্য স্বয়ংক্রিয়ভাবে যুক্ত থাকবে।",
    "portal.browseSchedules": "উপলব্ধ শিডিউলসমূহ দেখুন",
    "portal.tabAppointments": "অ্যাপয়েন্টমেন্টের ইতিহাস",
    "portal.tabRecords": "মেডিকেল রেকর্ডস",
    "portal.tabPayments": "পেমেন্ট রেকর্ডস",
    "portal.noAppointments": "কোনো অ্যাপয়েন্টমেন্ট পাওয়া যায়নি",
    "portal.noAppointmentsDesc": "সিরিয়াল ও স্ট্যাটাস ট্র্যাক করতে প্রথম পরামর্শ বুক করুন।",
    "portal.bookFirstAppt": "অ্যাপয়েন্টমেন্ট বুক করুন",
    "portal.queueNumber": "সিরিয়াল #{number}",
    "portal.slot": "স্লট:",
    "portal.noRecords": "এখনো কোনো মেডিকেল রেকর্ড নেই",
    "portal.noRecordsDesc": "প্রেসক্রিপশন, রোগ নির্ণয় এবং পরিদর্শনের সারাংশ এখানে দেখা যাবে।",
    "portal.diagnosis": "রোগ নির্ণয়:",
    "portal.notes": "চিকিৎসকের মন্তব্য:",
    "portal.noPayments": "কোনো পেমেন্ট রেকর্ড নেই",
    "portal.noPaymentsDesc": "বুকিংয়ের চালান ও রসিদ এখানে সংরক্ষিত থাকবে।",
    "portal.method": "পদ্ধতি:",
    "portal.cash": "ক্যাশ / নগদ",
    "portal.showingPagination": "মোট {total}টির মধ্যে {start} - {end} দেখানো হচ্ছে",
    "portal.prev": "পূর্ববর্তী",
    "portal.next": "পরবর্তী",
    "portal.editModalTitle": "মোবাইল নম্বর পরিবর্তন",
    "portal.cancel": "বাতিল",
    "portal.saveChanges": "পরিবর্তন সংরক্ষণ করুন",
    "portal.saving": "সংরক্ষণ হচ্ছে...",
    "portal.profileUpdated": "মোবাইল নম্বর ও প্রোফাইল সফলভাবে আপডেট করা হয়েছে!",

    // Auth & Login Cards
    "auth.patientBadge": "পেশেন্ট পোর্টাল এক্সেস",
    "auth.patientLoginTitle": "পেশেন্ট লগইন",
    "auth.patientSubtitle": "শুধুমাত্র আপনার নাম ও মোবাইল নম্বর দিয়ে লগইন করুন।",
    "auth.patientDesc": "কোনো ইমেইল বা পাসওয়ার্ড প্রয়োজন নেই। তাৎক্ষণিকভাবে আপনার সিরিয়াল স্ট্যাটাস, প্রেসক্রিপশন ও পূর্বের ভিজিট রেকর্ড দেখুন।",
    "auth.patientSignInTitle": "পেশেন্ট সাইন ইন",
    "auth.patientSignInDesc": "আপনার পোর্টাল দেখতে নাম ও মোবাইল নম্বর প্রদান করুন।",
    "auth.adminSignInTitle": "অ্যাডমিন সাইন ইন",
    "auth.adminSignInDesc": "আপনার অ্যাডমিন ইউজারনেম এবং পিন নম্বর লিখুন।",
    "auth.username": "ইউজারনেম",
    "auth.pin": "পিন",
    "auth.loginButtonPatient": "পেশেন্ট পোর্টালে প্রবেশ করুন",
    "auth.loginButtonAdmin": "অ্যাডমিন প্যানেলে প্রবেশ করুন",
    "auth.signingIn": "লগইন হচ্ছে...",
    "auth.logout": "লগআউট",

    // Appointments Page
    "appointmentsPage.badge": "উপলব্ধ সেশনসমূহ",
    "appointmentsPage.title": "ডাক্তার পরামর্শ চেম্বারসমূহ",
    "appointmentsPage.description": "বিভিন্ন ক্লিনিক ও হাসপাতালে আসন্ন পরামর্শ সেশনসমূহ দেখুন এবং সুবিধাজনক সিরিয়াল স্লট বুক করুন।",

    // 404 Page
    "notFound.title": "পৃষ্ঠাটি পাওয়া যায়নি",
    "notFound.description": "পৃষ্ঠাটি সরানো হয়েছে বা শিডিউলটি বর্তমানে উপলব্ধ নেই।",
    "notFound.button": "অ্যাপয়েন্টমেন্ট দেখুন",

    // Floating Button
    "floating.book": "অ্যাপয়েন্টমেন্ট বুকিং",

    // Chat & Messaging
    "chat.withDoctor": "ডাক্তারের সাথে চ্যাট করুন",
    "chat.directConsult": "সরাসরি ডাক্তার পরামর্শ",
    "chat.waitingApproval": "ডাক্তারের অনুমোদনের অপেক্ষায় রয়েছে",
    "chat.requestSent": "ডাক্তারের কাছে বার্তার অনুরোধ পাঠানো হয়েছে",
    "chat.approved": "আপনার বার্তার অনুরোধ অনুমোদিত হয়েছে। এখন আপনি সরাসরি চ্যাট করতে পারেন।",
    "chat.rejected": "আপনার বার্তার অনুরোধটি গৃহীত হয়নি।",
    "chat.typeMessage": "একটি বার্তা লিখুন...",
    "chat.online": "অনলাইন",
    "chat.offline": "অফলাইন",
    "chat.typingDoctor": "ডাক্তার টাইপ করছেন...",
    "chat.typingPatient": "রোগী টাইপ করছেন...",
    "chat.sendRequest": "অনুরোধ পাঠান",
    "chat.sending": "পাঠানো হচ্ছে...",
    "chat.closeChat": "চ্যাট বন্ধ করুন",
    "chat.lockedNotice": "ডাক্তার অনুমোদন করলেই সরাসরি রিয়েল-টাইম চ্যাট চালু হবে।"
  }
} as const;

export type TranslationKey = keyof typeof translations.en;

// Convert English digits to Bengali digits
export function toBengaliNumerals(val: string | number): string {
  const bnDigits = ["০", "১", "২", "৩", "৪", "৫", "৬", "৭", "৮", "৯"];
  return String(val).replace(/\d/g, (d) => bnDigits[parseInt(d, 10)] ?? d);
}

// Format numbers conditionally based on language
export function formatLocalizedNumber(num: number | string, lang: Language): string {
  if (lang === "bn") {
    return toBengaliNumerals(num);
  }
  return String(num);
}

// Localized currency formatter
export function formatLocalizedCurrency(amount: number | string, lang: Language): string {
  const num = typeof amount === "string" ? parseFloat(amount) || 0 : amount;
  if (lang === "bn") {
    return `৳${toBengaliNumerals(num)}`;
  }
  return `৳${num.toLocaleString("en-US")}`;
}

// Helper to translate CMS objects with { en, bn } or string fallback
export function resolveCMS<T>(
  field: { en?: T; bn?: T } | T | undefined | null,
  lang: Language,
  fallback?: T
): T {
  if (!field) return fallback as T;
  if (typeof field === "object" && field !== null && ("en" in field || "bn" in field)) {
    const localized = (field as { en?: T; bn?: T })[lang];
    if (localized !== undefined && localized !== null && localized !== "") {
      return localized;
    }
    return ((field as { en?: T; bn?: T }).en ?? fallback) as T;
  }
  return field as T;
}

// Localized time slot string converter
export function formatLocalizedTime(timeStr: string, lang: Language): string {
  if (!timeStr) return "";
  if (lang === "bn") {
    let result = timeStr
      .replace(/AM/gi, "সকাল")
      .replace(/PM/gi, "বিকাল/সন্ধ্যা")
      .replace(/Saturday/gi, "শনিবার")
      .replace(/Sunday/gi, "রবিবার")
      .replace(/Monday/gi, "সোমবার")
      .replace(/Tuesday/gi, "মঙ্গলবার")
      .replace(/Wednesday/gi, "বুধবার")
      .replace(/Thursday/gi, "বৃহস্পতিবার")
      .replace(/Friday/gi, "শুক্রবার")
      .replace(/January/gi, "জানুয়ারি")
      .replace(/February/gi, "ফেব্রুয়ারি")
      .replace(/March/gi, "মার্চ")
      .replace(/April/gi, "এপ্রিল")
      .replace(/May/gi, "মে")
      .replace(/June/gi, "জুন")
      .replace(/July/gi, "জুলাই")
      .replace(/August/gi, "আগস্ট")
      .replace(/September/gi, "সেপ্টেম্বর")
      .replace(/October/gi, "অক্টোবর")
      .replace(/November/gi, "নভেম্বর")
      .replace(/December/gi, "ডিসেম্বর");
    return toBengaliNumerals(result);
  }
  return timeStr;
}

// Fallback dictionary for dynamic content items (e.g. Doctor specialties, services, categories)
export const dynamicTranslations: Record<string, string> = {
  // Doctor Designation, Specialty & Titles
  "Dr. Rashed": "ডাঃ রাশেদ",
  "Dr Rashed": "ডাঃ রাশেদ",
  "dr. rashed": "ডাঃ রাশেদ",
  "dr rashed": "ডাঃ রাশেদ",
  "DR. RASHED": "ডাঃ রাশেদ",
  "DR RASHED": "ডাঃ রাশেদ",
  "Dr. Md. Rashedul Alam": "ডাঃ মোঃ রাশেদুল আলম",
  "Dr. Rashedul Alam": "ডাঃ রাশেদুল আলম",
  "Dr Rashedul Alam": "ডাঃ রাশেদুল আলম",
  "Dr Md Rashedul Alam": "ডাঃ মোঃ রাশেদুল আলম",
  "Dr. Md. Rashed": "ডাঃ মোঃ রাশেদ",
  "Dr Md Rashed": "ডাঃ মোঃ রাশেদ",
  "Senior Consultant": "সিনিয়র কনসালট্যান্ট",
  "Internal Medicine": "ইন্টারনাল মেডিসিন (মেডিসিন বিশেষজ্ঞ)",
  "Consultant Medicine Specialist": "কনসালট্যান্ট মেডিসিন বিশেষজ্ঞ",
  "Specialist Physician": "বিশেষজ্ঞ চিকিৎসক",
  "A Personal Approach to Medicine": "রোগীকেন্দ্রিক আধুনিক চিকিৎসা সেবা",
  "Board Certified Physician": "বোর্ড সার্টিফাইড বিশেষজ্ঞ চিকিৎসক",
  "Board Certified - Internal Medicine": "বোর্ড সার্টিফাইড - ইন্টারনাল মেডিসিন",
  "Board Certification - Internal Medicine": "বোর্ড সার্টিফিকেশন - ইন্টারনাল মেডিসিন",
  "Advanced Cardiac Life Support (ACLS)": "অ্যাডভান্সড কার্ডিয়াক লাইফ সাপোর্ট (এসিএলএস)",
  "Advanced Cardiac Life Support": "অ্যাডভান্সড কার্ডিয়াক লাইফ সাপোর্ট",
  "Diabetes Care Certification": "ডায়াবেটিস কেয়ার সার্টিফিকেশন",
  "Diabetes Management": "ডায়াবেটিস ব্যবস্থাপনা",

  // Biography & Intros
  "Compassionate healthcare focused on your wellness. Specializing in internal medicine with a holistic approach to patient care.":
    "আপনার সামগ্রিক সুস্থতায় নিবেদিত সহানুভূতিশীল চিকিৎসা সেবা। ইন্টারনাল মেডিসিন ও সামগ্রিক সুস্থতা নিশ্চিতকরণে বিশেষায়িত পরামর্শ।",
  "A patient-focused clinician providing evidence-based care across internal medicine, chronic disease management, preventive health, and diagnostic consultations.":
    "ইন্টারনাল মেডিসিন, দীর্ঘমেয়াদী রোগ ব্যবস্থাপনা, প্রতিরোধমূলক স্বাস্থ্যসেবা এবং সঠিক রোগ নির্ণয়ে অভিজ্ঞ ও রোগীকেন্দ্রিক একজন নিবেদিত বিশেষজ্ঞ চিকিৎসক।",
  "I believe that exceptional healthcare begins with truly listening to patients. Each person has a unique story, and understanding that story is essential to providing effective treatment.":
    "আমি বিশ্বাস করি প্রতিটি রোগীর কথা মনোযোগ দিয়ে শোনাই চমৎকার চিকিৎসার মূল ভিত্তি। প্রতিটি মানুষের স্বাস্থ্য সমস্যা অনন্য, এবং তা গভীরভাবে বুঝেই সঠিক চিকিৎসা প্রদান সম্ভব।",
  "My practice focuses on preventive care, chronic disease management, and helping patients achieve optimal health through evidence-based medicine combined with a holistic perspective.":
    "আমার চিকিৎসার মূল লক্ষ্য হলো প্রতিরোধমূলক সেবা, দীর্ঘস্থায়ী রোগ নিরাময় এবং প্রমাণিত চিকিৎসা বিজ্ঞানের সমন্বয়ে রোগীদের সর্বোত্তম স্বাস্থ্য নিশ্চিত করা।",
  "Outside of medicine, I am passionate about medical education, community health initiatives, and staying active through hiking and yoga, practices I often recommend to my patients.":
    "চিকিৎসা সেবার পাশাপাশি আমি চিকিৎসা শিক্ষা ও সামাজিক স্বাস্থ্য সচেতনতামূলক কার্যক্রমে সক্রিয়ভাবে যুক্ত থাকি।",
  "Dedicated to excellence in clinical healthcare, preventive care, and patient-first medical practice.":
    "ক্লিনিক্যাল স্বাস্থ্যসেবা, প্রতিরোধমূলক যত্ন এবং রোগীকেন্দ্রিক আধুনিক চিকিৎসা সেবায় নিবেদিতপ্রাণ।",

  // Credentials & Headings
  "Qualifications": "শিক্ষাগত যোগ্যতা",
  "Specialisations": "বিশেষ দক্ষতাসমূহ",
  "Languages Spoken": "কথোপকথনের ভাষা",
  "Certifications": "সার্টিফিকেশন",
  "Hospital Affiliations": "হাসপাতাল সংযুক্তি",
  "Professional Experience": "পেশাদার অভিজ্ঞতা",
  "Honors & Awards": "সম্মাননা ও পুরস্কার",

  // Qualifications & Credentials List
  "MBBS": "এমবিবিএস",
  "FCPS Medicine": "এফসিপিএস (মেডিসিন)",
  "MD Internal Medicine": "এমডি (ইন্টারনাল মেডিসিন)",
  "MBBS (DMC)": "এমবিবিএস (ডিএমসি)",
  "FCPS (Medicine)": "এফসিপিএস (মেডিসিন)",
  "MD (Internal Medicine)": "এমডি (ইন্টারনাল মেডিসিন)",
  "MBBS - Dhaka Medical College": "এমবিবিএস - ঢাকা মেডিকেল কলেজ",
  "FCPS Medicine - BCPS": "এফসিপিএস (মেডিসিন) - বিসিপিএস",
  "MD Internal Medicine - BSMMU": "এমডি (ইন্টারনাল মেডিসিন) - বিএসএমএমইউ",
  "15+ years in Internal Medicine": "১৫+ বছর ইন্টারনাল মেডিসিনে অভিজ্ঞতা",
  "15+ years in Internal Medicine clinical practice": "১৫+ বছর ইন্টারনাল মেডিসিনে ক্লিনিক্যাল অভিজ্ঞতা",
  "15+ years clinical experience": "১৫+ বছরের ক্লিনিক্যাল অভিজ্ঞতা",
  "15+ Years Clinical Practice": "১৫+ বছরের ক্লিনিক্যাল অভিজ্ঞতা",
  "Former registrar at a tertiary hospital": "সাবেক রেজিস্ট্রার, টারশিয়ারি হাসপাতাল",
  "Former Registrar at a Tertiary Hospital": "সাবেক রেজিস্ট্রার, টারশিয়ারি হাসপাতাল",
  "Former Registrar - Tertiary Hospital": "সাবেক রেজিস্ট্রার, টারশিয়ারি হাসপাতাল",
  "Clinical professor and mentor": "ক্লিনিক্যাল অধ্যাপক ও পরামর্শদাতা",
  "Clinical Professor and Mentor": "ক্লিনিক্যাল অধ্যাপক ও পরামর্শদাতা",
  "Professor of Medicine": "মেডিসিন বিভাগের অধ্যাপক",
  "50+ peer-reviewed articles": "৫০+ আন্তর্জাতিক গবেষণা প্রবন্ধ",
  "50+ Articles in peer-reviewed clinical journals": "৫০+ আন্তর্জাতিক গবেষণা প্রবন্ধ",
  "Author of modern healthcare guides": "আধুনিক স্বাস্থ্য নির্দেশিকার লেখক",
  "Author of patient education guides": "রোগী স্বাস্থ্য নির্দেশিকার লেখক",
  "Regular speaker at medical conferences": "চিকিৎসা সম্মেলনের নিয়মিত বক্তা",
  "Keynote Speaker at National Medical Conferences": "জাতীয় চিকিৎসা সম্মেলনের প্রধান বক্তা",
  "Best Clinical Service Award 2022": "সেরা ক্লিনিক্যাল সার্ভিস অ্যাওয়ার্ড ২০২২",
  "Community Health Excellence 2023": "কমিউনিটি হেলথ এক্সিলেন্স অ্যাওয়ার্ড ২০২৩",
  "Diabetes": "ডায়াবেটিস",
  "Hypertension": "উচ্চ রক্তচাপ",
  "Respiratory Medicine": "শ্বাসতন্ত্রের রোগ",
  "Bangla": "বাংলা",
  "English": "ইংরেজি",
  "Hindi": "হিন্দি",

  // Expertise Categories
  "Education": "শিক্ষাগত যোগ্যতা",
  "Experience": "ক্লিনিক্যাল অভিজ্ঞতা",
  "Publications": "গবেষণা ও প্রকাশনা",

  // Medical Services Titles & Names
  "Medical Services": "বিশেষায়িত চিকিৎসা সেবাসমূহ",
  "Medical services": "বিশেষায়িত চিকিৎসা সেবাসমূহ",
  "Medical Service": "চিকিৎসা সেবা",
  "Medical service": "চিকিৎসা সেবা",
  "Specialized Medical Services": "বিশেষায়িত চিকিৎসা সেবাসমূহ",
  "Specialized medical services": "বিশেষায়িত চিকিৎসা সেবাসমূহ",
  "Clinical Expertise": "ক্লিনিক্যাল দক্ষতা",
  "Clinical expertise": "ক্লিনিক্যাল দক্ষতা",
  "General Medicine Consultation": "জেনারেল মেডিসিন কনসালটেশন",
  "Diabetes & Endocrine Care": "ডায়াবেটিস ও হরমোনজনিত সেবা",
  "Hypertension & Cardiovascular Health": "উচ্চ রক্তচাপ ও হৃদরোগ স্বাস্থ্য",
  "Respiratory Disease Management": "শ্বাসতন্ত্রের রোগ ব্যবস্থাপনা",
  "Preventive Care": "প্রতিরোধমূলক স্বাস্থ্যসেবা",
  "Chronic Disease Management": "দীর্ঘমেয়াদী রোগ ব্যবস্থাপনা",
  "Acute Care": "জরুরি ও তাৎক্ষণিক চিকিৎসা",
  "Acute Care & Diagnostics": "জরুরি সেবা ও রোগ নির্ণয়",
  "Diagnostic Services": "রোগ নির্ণয় ও ডায়াগনস্টিক",
  "Geriatric Care": "প্রবীণদের স্বাস্থ্যসেবা",
  "Medication Management": "ওষুধ সমন্বয় ও পর্যালোচনা",
  "Telemedicine": "টেলিমেডিসিন সেবা",
  "Specialized Referrals": "বিশেষজ্ঞ পরামর্শ রেফারেল",
  "Clinical Service": "ক্লিনিক্যাল সেবা",
  "General Consultation": "সাধারণ স্বাস্থ্য পরামর্শ",
  "General consultation": "সাধারণ স্বাস্থ্য পরামর্শ",
  "Follow-up Care": "ফলো-আপ সেবা",
  "Follow-up care": "ফলো-আপ সেবা",
  "Health Screening": "স্বাস্থ্য স্ক্রীনিং",
  "Health screening": "স্বাস্থ্য স্ক্রীনিং",
  "Medical Reports Review": "মেডিকেল রিপোর্ট পর্যালোচনা",
  "Medical reports review": "মেডিকেল রিপোর্ট পর্যালোচনা",

  // Medical Services Descriptions & Subtitles
  "From preventive care to chronic disease management, I offer a full spectrum of internal medicine services to meet your healthcare needs at every stage of life.":
    "প্রতিরোধমূলক যত্ন থেকে শুরু করে দীর্ঘস্থায়ী রোগ ব্যবস্থাপনা পর্যন্ত, জীবনের প্রতিটি ধাপে আপনার স্বাস্থ্যসেবার প্রয়োজন মেটাতে আমি আধুনিক ও সমন্বিত ইন্টারনাল মেডিসিন সেবা প্রদান করি।",
  "From preventive care to chronic disease management, I offer a full spectrum of internal medicine services to meet your healthcare needs at every stage of life":
    "প্রতিরোধমূলক যত্ন থেকে শুরু করে দীর্ঘস্থায়ী রোগ ব্যবস্থাপনা পর্যন্ত, জীবনের প্রতিটি ধাপে আপনার স্বাস্থ্যসেবার প্রয়োজন মেটাতে আমি আধুনিক ও সমন্বিত ইন্টারনাল মেডিসিন সেবা প্রদান করি।",
  "Comprehensive treatments and consultations delivered with modern healthcare standards.":
    "আধুনিক স্বাস্থ্যসেবা মান ও সতর্কতার সাথে সমন্বিত চিকিৎসা এবং স্বাস্থ্য পরামর্শ।",
  "Comprehensive treatments and consultations delivered with modern healthcare standards":
    "আধুনিক স্বাস্থ্যসেবা মান ও সতর্কতার সাথে সমন্বিত চিকিৎসা এবং স্বাস্থ্য পরামর্শ।",
  "Comprehensive health evaluation and evidence-based diagnostic assessment.":
    "পূর্ণাঙ্গ স্বাস্থ্য মূল্যায়ন এবং সঠিক রোগ নির্ণয় বিশ্লেষণ।",
  "Personalized glycemic control, HbA1c monitoring, and dietary planning.":
    "রক্তের শর্করা নিয়ন্ত্রণ, এইচবিএওয়ানসি পর্যবেক্ষণ ও খাদ্যাভ্যাস পরিকল্পনা।",
  "Long-term blood pressure control and cardiovascular risk prevention.":
    "দীর্ঘমেয়াদী রক্তচাপ নিয়ন্ত্রণ ও হৃদরোগ ঝুঁকি প্রতিরোধ।",
  "Treatment for asthma, COPD, bronchitis, and persistent respiratory symptoms.":
    "অ্যাজমা, সিওপিডি, ব্রঙ্কাইটিস ও দীর্ঘস্থায়ী কাশির আধুনিক চিকিৎসা।",
  "Comprehensive health screenings, vaccinations, and lifestyle counseling to keep you healthy and prevent disease before it starts.":
    "রোগ শুরুর আগেই তা প্রতিরোধের জন্য পূর্ণাঙ্গ স্বাস্থ্য পরীক্ষা, টিকাদান ও জীবনযাত্রার পরামর্শ।",
  "Health screenings, vaccinations, and lifestyle counseling.":
    "পূর্ণাঙ্গ স্বাস্থ্য পরীক্ষা, টিকাদান ও জীবনযাত্রার পরামর্শ।",
  "Expert care for long-term conditions including diabetes, hypertension, heart disease, and respiratory disorders.":
    "ডায়াবেটিস, উচ্চ রক্তচাপ, হৃদরোগ ও শ্বাসতন্ত্রের দীর্ঘমেয়াদী রোগের অভিজ্ঞ চিকিৎসাসেবা।",
  "Care for diabetes, hypertension, heart disease, and respiratory disorders.":
    "ডায়াবেটিস, উচ্চ রক্তচাপ, হৃদরোগ ও শ্বাসতন্ত্রের দীর্ঘমেয়াদী রোগের চিকিৎসাসেবা।",
  "Same-day appointments for sudden illnesses, infections, minor injuries, and urgent medical concerns.":
    "হঠাৎ অসুস্থতা, ইনফেকশন এবং জরুরি শারীরিক সমস্যার দ্রুত সমাধান।",
  "Timely diagnosis and fast access for sudden illness or urgent concerns.":
    "হঠাৎ অসুস্থতা বা জরুরি শারীরিক সমস্যার দ্রুত ও সঠিক রোগ নির্ণয়।",
  "On-site laboratory testing, imaging coordination, and comprehensive diagnostic evaluations.":
    "ল্যাবরেটরি টেস্ট, আধুনিক ইমেজিং এবং সঠিক রোগ নির্ণয় বিশ্লেষণ।",
  "Specialized care for older adults focusing on independence, multiple conditions, and quality of life.":
    "বয়োজ্যেষ্ঠদের দীর্ঘস্থায়ী সমস্যা ও জীবনযাত্রার মানোন্নয়নে বিশেষ যত্ন।",
  "Careful oversight of medications to ensure safety, effectiveness, and fewer side effects or interactions.":
    "ওষুধের সঠিক মাত্রা ও পার্শ্বপ্রতিক্রিয়া এড়াতে নিবিড় তদারকি।",
  "Convenient virtual appointments for follow-ups, medication reviews, and minor health concerns from home.":
    "বাসা থেকেই ফলো-আপ এবং স্বাস্থ্য পরামর্শের সহজ ব্যবস্থা।",
  "Coordinated care with trusted specialists to support complex conditions and advanced treatment plans.":
    "জটিল রোগের জন্য অভিজ্ঞ বিশেষজ্ঞ চিকিৎসকদের সাথে সমন্বিত সেবা।",
  "Comprehensive clinical care and diagnostic consultations.":
    "সমন্বিত ক্লিনিক্যাল সেবা ও সঠিক রোগ নির্ণয় পরামর্শ।",
  "Comprehensive clinical care.":
    "সমন্বিত ক্লিনিক্যাল স্বাস্থ্যসেবা।",

  // Website Settings & CMS Content Headings
  "Doctor Profile": "চিকিৎসক পরিচিতি",
  "Dedicated to Excellence in Patient Care": "রোগী সেবায় উৎসর্গীকৃত আধুনিক চিকিৎসা",
  "Live availability": "লাইভ শিডিউল প্রাপ্যতা",
  "Live Availability": "লাইভ শিডিউল প্রাপ্যতা",
  "Upcoming Schedules": "আসন্ন শিডিউলসমূহ",
  "Upcoming schedules": "আসন্ন শিডিউলসমূহ",
  "Book from automatically generated slots and receive a queue number.":
    "স্বয়ংক্রিয় স্লট থেকে বুক করুন এবং তাৎক্ষণিক সিরিয়াল নম্বর সংগ্রহ করুন।",
  "No upcoming schedules": "কোনো সক্রিয় শিডিউল পাওয়া যায়নি",
  "New consultation dates will appear here as soon as they are published.":
    "নতুন চেম্বার শিডিউল প্রকাশিত হলে এখানে দেখা যাবে।",
  "Book slot": "স্লট নির্বাচন করুন",
  "Book Slot": "স্লট নির্বাচন করুন",
  "Appointments": "অ্যাপয়েন্টমেন্ট",
  "Choose a hospital schedule and reserve a queue number.":
    "হাসপাতাল শিডিউল নির্বাচন করুন এবং সিরিয়াল নম্বর নিশ্চিত করুন।",
  "Slots are generated from backend-managed consultation duration settings and checked before confirmation.":
    "স্লটসমূহ সময় অনুযায়ী সাজানো এবং নিশ্চিতকরণের পূর্বে যাচাইকৃত।",
  "Clinical profile": "ক্লিনিক্যাল প্রোফাইল",
  "Clinical Profile": "ক্লিনিক্যাল প্রোফাইল",
  "Expertise at a glance": "এক নজরে বিশেষজ্ঞ পরিচিতি",
  "Expertise at a Glance": "এক নজরে বিশেষজ্ঞ পরিচিতি",
  "Patient voices": "রোগীদের অনুভূতি ও মতামত",
  "Patient Voices": "রোগীদের অনুভূতি ও মতামত",
  "Clinic gallery": "চেম্বার গ্যালারি",
  "Clinic Gallery": "চেম্বার গ্যালারি",
  "Gallery": "চেম্বার ও ক্লিনিক গ্যালারি",
  "A quick look at the care environment, consultation setup, and patient support spaces.":
    "চেম্বার পরিবেশ, পরামর্শক কক্ষ এবং রোগী সহায়ক কাঠামোর এক ঝলক।",
  "Need clinic information?": "হাসপাতাল চেম্বার ও যোগাযোগের ঠিকানা",
  "Upcoming consultation": "আসন্ন পরামর্শ",
  "Share this schedule": "এই শিডিউলটি শেয়ার করুন",
  "Appointment request": "অ্যাপয়েন্টমেন্টের আবেদন",
  "Choose your slot": "আপনার স্লট বেছে নিন",
  "Queue number is assigned automatically after a valid slot is selected.":
    "সঠিক স্লট নির্বাচনের পর স্বয়ংক্রিয়ভাবে সিরিয়াল নম্বর বরাদ্দ করা হবে।",
  "Full name": "পুরো নাম",
  "Patient full name": "রোগীর পুরো নাম",
  "Patient address (optional)": "রোগীর ঠিকানা (ঐচ্ছিক)",
  "Appointment slot": "অ্যাপয়েন্টমেন্ট স্লট",
  "Choose an available slot": "উপলব্ধ একটি স্লট নির্বাচন করুন",
  "Request appointment": "অ্যাপয়েন্টমেন্ট অনুরোধ করুন",
  "Please enter your full name, valid mobile number, and select an appointment slot.":
    "অনুগ্রহ করে আপনার পুরো নাম, সঠিক মোবাইল নম্বর এবং একটি স্লট নির্বাচন করুন।",

  // Medical Services Bullet Items & Checklists
  "Health Risk Assessments": "স্বাস্থ্য ঝুঁকি মূল্যায়ন",
  "Annual Physical Exams": "বার্ষিক শারীরিক পরীক্ষা",
  "Wellness Counseling": "স্বাস্থ্য ও সুস্থতা বিষয়ক কাউন্সেলিং",
  "Prescription Review": "প্রেসক্রিপশন পর্যালোচনা",
  "Prescription Reviews": "প্রেসক্রিপশন পর্যালোচনা",
  "Glucose Monitoring": "গ্লুকোজ ও ব্লাড সুগার মনিটরিং",
  "HbA1c Target Setting": "এইচবিএওয়ানসি লক্ষ্যমাত্রা নির্ধারণ",
  "Dietary Guidance": "খাদ্যাভ্যাস ও পুষ্টি পরামর্শ",
  "Insulin Dose Adjustments": "ইনসুলিনের ডোজ সমন্বয়",
  "BP Monitoring": "রক্তচাপ পর্যবেক্ষণ",
  "EKG Test Review": "ইসিজি টেস্ট ও রিপোর্ট পর্যালোচনা",
  "Lipid Management": "কোলেস্টেরল ও লিপিড ব্যবস্থাপনা",
  "Cardiovascular Risk Reduction": "হৃদরোগের ঝুঁকি হ্রাস",
  "Asthma & COPD Review": "অ্যাজমা ও সিওপিডি পর্যালোচনা",
  "Inhaler Technique Check": "ইনহেলার ব্যবহারের সঠিক নিয়ম পরীক্ষা",
  "Spirometry Review": "স্পাইরোমেট্রি টেস্ট পর্যালোচনা",
  "Allergy Management": "অ্যালার্জি ব্যবস্থাপনা",
  "Same-Day Consultations": "জরুরি দিনের পরামর্শ",
  "Infection Treatment": "সংক্রমণ ও জ্বরজনিত চিকিৎসা",
  "Lab & EKG Test Review": "ল্যাব টেস্ট ও ইসিজি রিপোর্ট পর্যালোচনা",
  "Diagnostic Coordination": "ডায়াগনস্টিক টেস্ট সমন্বয়",
  "Diabetes Care & Glucose Monitoring": "ডায়াবেটিস নিয়ন্ত্রণ ও গ্লুকোজ পর্যবেক্ষণ",
  "Vaccination Guidance": "টিকা গ্রহণ সংক্রান্ত পরামর্শ",
  "Vaccination Programs": "টিকা কার্যক্রম ও পরামর্শ",
  "Professional Care": "পেশাদার চিকিৎসা সেবা",
  "Personalized Diagnostic Assessment": "রোগীকেন্দ্রিক ডায়াগনস্টিক মূল্যায়ন",
  "Continuous Follow-up Support": "ধারাবাহিক ফলো-আপ সহায়তা",
  "Personalized Care": "রোগীকেন্দ্রিক বিশেষ যত্ন",
  "Diagnostic Assessment": "সঠিক রোগ নির্ণয় মূল্যায়ন",
  "Diabetes Care": "ডায়াবেটিস নিয়ন্ত্রণ ও যত্ন",
  "Hypertension Management": "উচ্চ রক্তচাপ নিয়ন্ত্রণ",
  "Asthma & COPD": "অ্যাজমা ও সিওপিডি চিকিৎসা",
  "Heart Disease Monitoring": "হৃদরোগ পর্যবেক্ষণ ও পরামর্শ",
  "Same-Day Appointments": "জরুরি দিনের পরামর্শ",
  "Minor Injury Care": "জরুরি প্রাথমিক সেবা",
  "Urgent Consultations": "তাৎক্ষণিক পরামর্শ",
  "Blood Work": "রক্ত পরীক্ষা ও রিপোর্ট পর্যালোচনা",
  "EKG Testing": "ইসিজি পরীক্ষা",
  "Imaging Referrals": "ইমেজিং ও আল্ট্রাসনোগ্রাম",
  "Health Screenings": "পূর্ণাঙ্গ স্বাস্থ্য স্ক্রীনিং",
  "Senior Wellness": "প্রবীণ স্বাস্থ্য পরিচর্যা",
  "Medication Review": "ওষুধ সমন্বয় ও পরীক্ষা",
  "Mobility Support": "গতিশীলতা ও ফিটনেস সহায়তা",
  "Memory Screening": "স্মৃতিশক্তি পরীক্ষা",
  "Dose Adjustments": "ডোজ সমন্বয়",
  "Interaction Checks": "ওষুধের প্রতিক্রিয়া পর্যবেক্ষণ",
  "Long-term Planning": "দীর্ঘমেয়াদী চিকিৎসা পরিকল্পনা",
  "Video Consultations": "ভিডিও কনসালটেশন",
  "Follow-up Visits": "ফলো-আপ পরিদর্শন",
  "Report Review": "রিপোর্ট পর্যালোচনা",
  "Care Guidance": "স্বাস্থ্য নির্দেশনা",
  "Specialist Coordination": "বিশেষজ্ঞদের সাথে সমন্বয়",
  "Referral Letters": "রেফারেল ও পরামর্শপত্র",
  "Care Planning": "উন্নত সেবা পরিকল্পনা",
  "Progress Follow-up": "অগ্রগতি মূল্যায়ন",

  // Hospital Names & Addresses
  "City Care Hospital": "সিটি কেয়ার হাসপাতাল",
  "Green Life Clinic": "গ্রিন লাইফ ক্লিনিক",
  "Central Health Clinic": "সেন্ট্রাল হেলথ ক্লিনিক",
  "House 12, Road 8, Dhanmondi, Dhaka": "বাড়ি ১২, রোড ৮, ধানমন্ডি, ঢাকা",
  "Mirpur 10, Dhaka": "মিরপুর ১০, ঢাকা",
  "Banani, Dhaka": "বনানী, ঢাকা",
  "Dhaka, Bangladesh": "ঢাকা, বাংলাদেশ",
  "Main Hospital": "মূল হাসপাতাল",
  "Specialist Clinic": "স্পেশালিস্ট ক্লিনিক",
  "Diagnostic Chamber": "ডায়াগনস্টিক চেম্বার",
  "Chamber": "চেম্বার",
  "Medical Chamber": "মেডিকেল চেম্বার",

  // Testimonials
  "Mahmud H.": "মাহমুদ এইচ.",
  "Nusrat J.": "নুসরাত জে.",
  "Rafiq A.": "রফিক এ.",
  "The consultation was calm, clear, and very practical.": "পরামর্শটি অত্যন্ত আন্তরিক, স্পষ্ট ও কার্যকর ছিল।",
  "Booking was simple and the queue number made the visit easier.": "সিরিয়াল বুকিং খুব সহজ ছিল এবং সিরিয়াল নম্বরের কারণে সময় বেঁচেছে।",
  "The follow-up plan was easy to understand and follow.": "পরবর্তী ফলো-আপ পরিকল্পনাটি সহজে বোঝা ও অনুসরণ করা সম্ভব হয়েছে।",

  // Gallery descriptions
  "City Care Hospital Chamber": "সিটি কেয়ার হাসপাতাল চেম্বার",
  "Green Life Clinic & Diagnostic": "গ্রিন লাইফ ক্লিনিক ও ডায়াগনস্টিক",
  "Central Health Chamber & Lab": "সেন্ট্রাল হেলথ চেম্বার ও ল্যাব",
  "Fully equipped executive consultation chamber with private examination suite and vitals monitoring station.":
    "সম্পূর্ণ সজ্জিত পরামর্শক চেম্বার ও আধুনিক পর্যবেক্ষণ ইউনিট।",
  "Modern outpatient clinic featuring digital diagnostic support, patient waiting lounge, and ECG suite.":
    "ডিজিটাল ডায়াগনস্টিক সাপোর্ট, অপেক্ষা লাউঞ্জ ও ইসিজি সুবিধা সংবলিত আধুনিক চেম্বার।",
  "Evening chamber setup with on-site sample collection, ultrasonic imaging, and dedicated patient care lounge.":
    "অন-সাইট স্যাম্পল কালেকশন ও আল্ট্রাসাউন্ড সম্বলিত সান্ধ্যকালীন পরামর্শ চেম্বার।",

  // Buttons, CTAs & Action Triggers
  "Book Appointment": "অ্যাপয়েন্টমেন্ট নিন",
  "Book Consultation": "পরামর্শের জন্য বুক করুন",
  "Book Online": "অনলাইনে বুক করুন",
  "Book Appointment Online": "অনলাইনে অ্যাপয়েন্টমেন্ট নিন",
  "Book an Appointment": "অ্যাপয়েন্টমেন্ট বুক করুন",
  "Book Your First Appointment": "প্রথম অ্যাপয়েন্টমেন্ট বুক করুন",
  "Book First Appt": "অ্যাপয়েন্টমেন্ট বুক করুন",
  "Book Now": "এখনই বুক করুন",
  "Select Slot": "স্লট নির্বাচন করুন",
  "Choose Slot": "স্লট বেছে নিন",
  "Explore Services": "সেবাসমূহ দেখুন",
  "View on Map": "ম্যাপে দেখুন",
  "Patient Portal": "পেশেন্ট পোর্টাল",
  "Browse Available Schedules": "উপলব্ধ শিডিউলসমূহ দেখুন",
  "Browse Schedules": "শিডিউলসমূহ দেখুন",
  "Browse Schedules & Book": "শিডিউল দেখুন ও বুক করুন",
  "Change Number": "নম্বর পরিবর্তন",
  "Save Changes": "পরিবর্তন সংরক্ষণ করুন",
  "Saving...": "সংরক্ষণ হচ্ছে...",
  "Cancel": "বাতিল",
  "Confirm & Book Slot": "নিশ্চিত করুন ও সিরিয়াল নিন",
  "Processing Booking...": "বুকিং প্রক্রিয়াধীন...",
  "Login to Patient Portal": "পেশেন্ট পোর্টালে প্রবেশ করুন",
  "Access Admin Panel": "অ্যাডমিন প্যানেলে প্রবেশ করুন",
  "Signing in...": "লগইন হচ্ছে...",
  "Logout": "লগআউট",
  "View appointments": "অ্যাপয়েন্টমেন্ট দেখুন",
  "Return to Home": "হোমে ফিরে যান",
  "Back to Home": "হোমে ফিরে যান",
  "Close": "বন্ধ করুন",
  "Submit": "জমা দিন",
  "OK": "ঠিক আছে",
  "Yes": "হ্যাঁ",
  "No": "না",
  "Edit": "সম্পাদনা",
  "Delete": "মুছুন",
  "Update": "আপডেট",
  "Search": "অনুসন্ধান",
  "Filter": "ফিল্টার",
  "Learn More": "আরও জানুন",
  "Learn more": "আরও জানুন",
  "learn more": "আরও জানুন",
  "LEARN MORE": "আরও জানুন",
  "Read More": "আরও পড়ুন",
  "Read more": "আরও পড়ুন",
  "Explore More": "আরও দেখুন",
  "Explore more": "আরও দেখুন",
  "Share": "শেয়ার করুন",
  "Copy Link": "লিংক কপি করুন",
  "Link Copied!": "লিংক কপি হয়েছে!"
};

// Comprehensive Location, Administrative, Address & Healthcare Vocabulary
export const locationAndHospitalVocabulary: Record<string, string> = {
  // Testing / placeholder words
  "test": "টেস্ট",
  "tests": "টেস্ট",
  "testing": "টেস্টিং",
  "demo": "ডেমো",
  "sample": "নমুনা",
  "example": "উদাহরণ",
  "physical exam": "শারীরিক পরীক্ষা",
  "physical examination": "শারীরিক পরীক্ষা",

  // Directional & Modifiers
  "north": "উত্তর",
  "south": "দক্ষিণ",
  "east": "পূর্ব",
  "west": "পশ্চিম",
  "central": "সেন্ট্রাল",
  "old": "পুরান",
  "new": "নতুন",
  "greater": "বৃহত্তর",
  "upper": "উচ্চ",
  "lower": "নিম্ন",
  "main": "প্রধান",
  "special": "বিশেষ",
  "specialized": "বিশেষায়িত",
  "general": "জেনারেল",

  // Upazilas, Thanas, Areas & Locations (Bangladesh)
  "padua": "পদুয়া",
  "paduah": "পদুয়া",
  "north padua": "উত্তর পদুয়া",
  "south padua": "দক্ষিণ পদুয়া",
  "east padua": "পূর্ব পদুয়া",
  "west padua": "পশ্চিম পদুয়া",
  "lohagara": "লোহাগাড়া",
  "chittagong": "চট্টগ্রাম",
  "chattogram": "চট্টগ্রাম",
  "ctg": "চট্টগ্রাম",
  "dhaka": "ঢাকা",
  "dhanmondi": "ধানমন্ডি",
  "mirpur": "মিরপুর",
  "banani": "বনানী",
  "gulshan": "গুলশান",
  "uttara": "উত্তরা",
  "motijheel": "মতিঝিল",
  "mohakhali": "মহাখালী",
  "badda": "বাড্ডা",
  "rampura": "রামপুরা",
  "khilgaon": "খিলগাঁও",
  "shantinagar": "শান্তিনগর",
  "malibagh": "মালিবাগ",
  "moghbazar": "মগবাজার",
  "kakrail": "কাকরাইল",
  "farmgate": "ফার্মগেট",
  "panthapath": "পান্থপথ",
  "green road": "গ্রীন রোড",
  "elephant road": "এলিফ্যান্ট রোড",
  "new market": "নিউ মার্কেট",
  "lalbagh": "লালবাগ",
  "old dhaka": "পুরান ঢাকা",
  "sadarghat": "সদরঘাট",
  "jatrabari": "যাত্রাবাড়ী",
  "sayedabad": "সায়েদাবাদ",
  "wari": "ওয়ারী",
  "sutrapur": "সূত্রাপুর",
  "mohammadpur": "মোহাম্মদপুর",
  "shyamoli": "শ্যামলী",
  "kalyanpur": "কল্যাণপুর",
  "gabtoli": "গাবতলী",
  "pallabi": "পল্লবী",
  "cantonment": "সেনানিবাস",
  "bashundhara": "বসুন্ধরা",
  "baridhara": "বারিধারা",
  "nikunja": "নিকুঞ্জ",
  "khilkhet": "খিলক্ষেত",
  "airport": "বিমানবন্দর",
  "savar": "সাভার",
  "gazipur": "গাজীপুর",
  "narayanganj": "নারায়ণগঞ্জ",
  "munshiganj": "মুন্সীগঞ্জ",
  "narsingdi": "নরসিংদী",
  "manikganj": "মানিকগঞ্জ",
  "tangail": "টাঙ্গাইল",
  "kishoreganj": "কিশোরগঞ্জ",
  "faridpur": "ফরিদপুর",
  "gopalganj": "গোপালগঞ্জ",
  "madaripur": "মাদারীপুর",
  "rajbari": "রাজবাড়ী",
  "shariatpur": "শরীয়তপুর",
  "sylhet": "সিলেট",
  "moulvibazar": "মৌলভীবাজার",
  "habiganj": "হবিগঞ্জ",
  "sunamganj": "সুনামগঞ্জ",
  "rajshahi": "রাজশাহী",
  "bogura": "বগুড়া",
  "bogra": "বগুড়া",
  "pabna": "পাবনা",
  "sirajganj": "সিরাজগঞ্জ",
  "naogaon": "নওগাঁ",
  "natore": "নাটোর",
  "chapainawabganj": "চাঁপাইনবাবগঞ্জ",
  "joypurhat": "জয়পুরহাট",
  "khulna": "খুলনা",
  "jashore": "যশোর",
  "jessore": "যশোর",
  "kushtia": "কুষ্টিয়া",
  "jhenaidah": "ঝিনাইদহ",
  "satkhira": "সাতক্ষীরা",
  "bagerhat": "বাগেরহাট",
  "chuadanga": "চুয়াডাঙ্গা",
  "meherpur": "মেহেরপুর",
  "magura": "মাগুরা",
  "narail": "নড়াইল",
  "barishal": "বরিশাল",
  "barisal": "বরিশাল",
  "patuakhali": "পটুয়াখালী",
  "bhola": "ভোলা",
  "pirojpur": "পিরোজপুর",
  "barguna": "বরগুনা",
  "jhalokati": "ঝালকাঠি",
  "rangpur": "রংপুর",
  "dinajpur": "দিনাজপুর",
  "gaibandha": "গাইবান্ধা",
  "kurigram": "কুড়িগ্রাম",
  "lalmonirhat": "লালমনিরহাট",
  "nilphamari": "নীলফামারী",
  "panchagarh": "পঞ্চগড়",
  "thakurgaon": "ঠাকুরগাঁও",
  "mymensingh": "ময়মনসিংহ",
  "jamalpur": "জামালপুর",
  "netrokona": "নেত্রকোণা",
  "sherpur": "শেরপুর",
  "cox's bazar": "কক্সবাজার",
  "coxs bazar": "কক্সবাজার",
  "coxsbazar": "কক্সবাজার",
  "cumilla": "কুমিল্লা",
  "comilla": "কুমিল্লা",
  "feni": "ফেনী",
  "brahmanbaria": "ব্রাহ্মণবাড়িয়া",
  "noakhali": "নোয়াখালী",
  "lakshmipur": "লক্ষ্মীপুর",
  "chandpur": "চাঁদপুর",
  "rangamati": "রাঙ্গামাটি",
  "khagrachhari": "খাগড়াছড়ি",
  "bandarban": "বান্দরবান",
  "hathazari": "হাটহাজারী",
  "patiya": "পটিয়া",
  "boalkhali": "বোয়ালখালী",
  "anwara": "আনোয়ারা",
  "chandanaish": "চন্দনাইশ",
  "satkania": "সাতকানিয়া",
  "banshkhali": "বাঁশখালী",
  "raozan": "রাউজান",
  "rangunia": "রাঙ্গুনিয়া",
  "mirsharai": "মীরসরাই",
  "sitakunda": "সীতাকুণ্ড",
  "sandwip": "সন্দ্বীপ",
  "karnaphuli": "কর্ণফুলী",
  "agrabad": "আগ্রাবাদ",
  "gec": "জিইসি",
  "nasirabad": "নাসিরাবাদ",
  "chawkbazar": "চকবাজার",
  "panchlaish": "পাঁচলাইশ",
  "halishahar": "হালিশহর",
  "khulshi": "খুলশী",
  "kotwali": "কোতোয়ালী",
  "bayezid": "বায়েজিদ",
  "muradpur": "মুরাদপুর",
  "bahaddarhat": "বহদ্দারহাট",
  "lalkhan bazar": "লালখান বাজার",
  "tigerpass": "টাইগারপাস",
  "anderkilla": "আন্দরকিল্লা",
  "dewanhat": "দেওয়ানহাট",
  "pahartali": "পাহাড়তলী",
  "patenga": "পতেঙ্গা",
  "sadar": "সদর",
  "bangladesh": "বাংলাদেশ",

  // Address Terms
  "house": "বাড়ি",
  "road": "রোড",
  "rd": "রোড",
  "block": "ব্লক",
  "sector": "সেক্টর",
  "sec": "সেক্টর",
  "lane": "লেন",
  "avenue": "এভিনিউ",
  "ave": "এভিনিউ",
  "floor": "তলা",
  "level": "লেভেল",
  "room": "রুম",
  "suite": "স্যুট",
  "building": "বিল্ডিং",
  "tower": "টাওয়ার",
  "plaza": "প্লাজা",
  "center": "সেন্টার",
  "centre": "সেন্টার",
  "complex": "কমপ্লেক্স",
  "market": "মার্কেট",
  "point": "পয়েন্ট",
  "gate": "গেট",
  "mor": "মোড়",
  "chowrasta": "চৌরাস্তা",
  "stand": "স্ট্যান্ড",
  "station": "স্টেশন",
  "bazar": "বাজার",
  "bazaar": "বাজার",
  "para": "পাড়া",
  "gram": "গ্রাম",
  "union": "ইউনিয়ন",
  "upazila": "উপজেলা",
  "zilla": "জেলা",
  "district": "জেলা",
  "city": "সিটি",
  "town": "শহর",
  "village": "গ্রাম",
  "highway": "হাইওয়ে",
  "main road": "প্রধান সড়ক",
  "bypass": "বাইপাস",
  "bridge": "ব্রিজ",
  "ghat": "ঘাট",

  // Medical, Hospital & Healthcare terms
  "hospital": "হাসপাতাল",
  "clinic": "ক্লিনিক",
  "medical": "মেডিকেল",
  "care": "কেয়ার",
  "health": "স্বাস্থ্য",
  "healthcare": "স্বাস্থ্যসেবা",
  "chamber": "চেম্বার",
  "chambers": "চেম্বারসমূহ",
  "diagnostic": "ডায়াগনস্টিক",
  "consultation": "পরামর্শ",
  "doctor": "ডাক্তার",
  "doctors": "ডক্টরস",
  "doctor's": "ডক্টরস",
  "patient": "রোগী",
  "patients": "রোগী",
  "service": "সেবা",
  "services": "সেবাসমূহ",
  "college": "কলেজ",
  "institute": "ইনস্টিটিউট",
  "institution": "প্রতিষ্ঠান",
  "university": "বিশ্ববিদ্যালয়",
  "trust": "ট্রাস্ট",
  "foundation": "ফাউন্ডেশন",
  "laboratory": "ল্যাবরেটরি",
  "laboratories": "ল্যাবরেটরিজ",
  "lab": "ল্যাব",
  "pharmacy": "ফার্মেসি",
  "square": "স্কয়ার",
  "evercare": "এভারকেয়ার",
  "united": "ইউনাইটেড",
  "apollo": "অ্যাপোলো",
  "labaid": "ল্যাবএইড",
  "popular": "পপুলার",
  "ibn sina": "ইবনে সিনা",
  "green life": "গ্রিন লাইফ",
  "city care": "সিটি কেয়ার",
  "central health": "সেন্ট্রাল হেলথ",
  "national": "ন্যাশনাল",
  "metropolitan": "মেট্রোপলিটন",
  "imperial": "ইম্পেরিয়াল",
  "parkview": "পার্কভিউ",
  "chevron": "শেভরণ",
  "cscr": "সিএসসিআর",
  "epic": "এপিক",
  "medinova": "মেডিনোভা",
  "medix": "মেডিক্স",
  "birdem": "বারডেম",
  "bsmmu": "বিএসএমএমইউ",
  "dmc": "ডিএমসি",
  "cmch": "সিএমসিএইচ",
  "dr. rashed": "ডাঃ রাশেদ",
  "dr rashed": "ডাঃ রাশেদ",
  "dr. rashedul alam": "ডাঃ রাশেদুল আলম",
  "dr rashedul alam": "ডাঃ রাশেদুল আলম",
  "rashed": "রাশেদ",
  "rashedul": "রাশেদুল"
};

export function transliterateEnglishWordToBengali(word: string): string {
  if (!word || typeof word !== "string") return "";
  const lower = word.toLowerCase().trim();
  if (locationAndHospitalVocabulary[lower]) {
    return locationAndHospitalVocabulary[lower];
  }
  if (dynamicTranslations[word.trim()]) {
    return dynamicTranslations[word.trim()];
  }

  const directMaps: Record<string, string> = {
    test: "টেস্ট",
    tests: "টেস্ট",
    testing: "টেস্টিং",
    sample: "নমুনা",
    demo: "ডেমো",
    rashed: "রাশেদ",
    "dr. rashed": "ডাঃ রাশেদ",
    "dr rashed": "ডাঃ রাশেদ",
    apex: "এপেক্স",
    alpha: "আলফা",
    delta: "ডেল্টা",
    prime: "প্রাইম",
    max: "ম্যাক্স",
    optima: "অপটিমা",
    cure: "কিউর",
    heal: "হিল",
    med: "মেড",
    meds: "মেডস",
    plus: "প্লাস",
    pro: "প্রো",
    life: "লাইফ",
    care: "কেয়ার",
    aid: "এইড",
    hope: "হোপ",
    trust: "ট্রাস্ট",
    sun: "সান",
    moon: "মুন",
    star: "স্টার"
  };

  if (directMaps[lower]) {
    return directMaps[lower];
  }

  let result = "";
  let i = 0;
  const len = lower.length;

  while (i < len) {
    const two = lower.substring(i, i + 2);
    const three = lower.substring(i, i + 3);

    if (three === "sch") { result += "স্ক"; i += 3; continue; }
    if (two === "ch") { result += "চ"; i += 2; continue; }
    if (two === "sh") { result += "শ"; i += 2; continue; }
    if (two === "th") { result += "থ"; i += 2; continue; }
    if (two === "ph") { result += "ফ"; i += 2; continue; }
    if (two === "kh") { result += "খ"; i += 2; continue; }
    if (two === "gh") { result += "ঘ"; i += 2; continue; }
    if (two === "bh") { result += "ভ"; i += 2; continue; }
    if (two === "dh") { result += "ধ"; i += 2; continue; }
    if (two === "jh") { result += "ঝ"; i += 2; continue; }
    if (two === "ng") { result += "ং"; i += 2; continue; }
    if (two === "st") { result += "স্ট"; i += 2; continue; }
    if (two === "sp") { result += "স্প"; i += 2; continue; }
    if (two === "sk") { result += "স্ক"; i += 2; continue; }
    if (two === "sc") { result += "স্ক"; i += 2; continue; }
    if (two === "tr") { result += "ট্র"; i += 2; continue; }
    if (two === "dr") { result += "ড্র"; i += 2; continue; }
    if (two === "pr") { result += "প্র"; i += 2; continue; }
    if (two === "br") { result += "ব্র"; i += 2; continue; }
    if (two === "kr" || two === "cr") { result += "ক্র"; i += 2; continue; }
    if (two === "gr") { result += "গ্র"; i += 2; continue; }
    if (two === "fr") { result += "ফ্র"; i += 2; continue; }
    if (two === "pl") { result += "প্ল"; i += 2; continue; }
    if (two === "bl") { result += "ব্ল"; i += 2; continue; }
    if (two === "cl" || two === "kl") { result += "ক্ল"; i += 2; continue; }
    if (two === "fl") { result += "ফ্ল"; i += 2; continue; }
    if (two === "gl") { result += "গ্ল"; i += 2; continue; }
    if (two === "sl") { result += "স্ল"; i += 2; continue; }
    if (two === "sm") { result += "স্ম"; i += 2; continue; }
    if (two === "sn") { result += "স্ন"; i += 2; continue; }
    if (two === "nt") { result += "ন্ট"; i += 2; continue; }
    if (two === "nd") { result += "ন্ড"; i += 2; continue; }
    if (two === "mp") { result += "ম্প"; i += 2; continue; }
    if (two === "mb") { result += "ম্ব"; i += 2; continue; }
    if (two === "lt") { result += "ল্ট"; i += 2; continue; }
    if (two === "ld") { result += "ল্ড"; i += 2; continue; }
    if (two === "rt") { result += "র্ট"; i += 2; continue; }
    if (two === "rd") { result += "র্ড"; i += 2; continue; }
    if (two === "rk") { result += "র্ক"; i += 2; continue; }
    if (two === "rn") { result += "র্ন"; i += 2; continue; }
    if (two === "rm") { result += "র্ম"; i += 2; continue; }
    if (two === "rp") { result += "র্প"; i += 2; continue; }
    if (two === "rs") { result += "র্স"; i += 2; continue; }

    if (two === "ee" || two === "ea") {
      result += result.length === 0 ? "ঈ" : "ী";
      i += 2;
      continue;
    }
    if (two === "oo" || two === "ou") {
      result += result.length === 0 ? "উ" : "ু";
      i += 2;
      continue;
    }
    if (two === "ai" || two === "ay") {
      result += result.length === 0 ? "আই" : "ায়";
      i += 2;
      continue;
    }
    if (two === "oi" || two === "oy") {
      result += result.length === 0 ? "অয়" : "য়";
      i += 2;
      continue;
    }

    const char = lower[i];
    const isFirst = result.length === 0;

    switch (char) {
      case "a":
        result += isFirst ? "আ" : "া";
        break;
      case "b":
        result += "ব";
        break;
      case "c":
        result += i + 1 < len && ["e", "i", "y"].includes(lower[i + 1]) ? "স" : "ক";
        break;
      case "d":
        result += "ড";
        break;
      case "e":
        result += isFirst ? "এ" : "ে";
        break;
      case "f":
        result += "ফ";
        break;
      case "g":
        result += i + 1 < len && ["e", "i"].includes(lower[i + 1]) ? "জ" : "গ";
        break;
      case "h":
        result += "হ";
        break;
      case "i":
        result += isFirst ? "ই" : "ি";
        break;
      case "j":
        result += "জ";
        break;
      case "k":
        result += "ক";
        break;
      case "l":
        result += "ল";
        break;
      case "m":
        result += "ম";
        break;
      case "n":
        result += "ন";
        break;
      case "o":
        result += isFirst ? "ও" : "ো";
        break;
      case "p":
        result += "প";
        break;
      case "q":
        result += "ক";
        break;
      case "r":
        result += "র";
        break;
      case "s":
        result += "স";
        break;
      case "t":
        result += "ট";
        break;
      case "u":
        result += isFirst ? "উ" : "ু";
        break;
      case "v":
        result += "ভ";
        break;
      case "w":
        result += isFirst ? "ওয়" : "ও";
        break;
      case "x":
        result += "ক্স";
        break;
      case "y":
        result += isFirst ? "ই" : "য়";
        break;
      case "z":
        result += "জ";
        break;
      default:
        result += char;
    }
    i++;
  }

  return result;
}

function translateAddressSegment(segment: string): string {
  const clean = segment.replace(/[.]+$/, "").trim();
  if (!clean) return "";

  const lower = clean.toLowerCase();
  if (dynamicTranslations[clean]) return dynamicTranslations[clean];
  if (locationAndHospitalVocabulary[lower]) return locationAndHospitalVocabulary[lower];

  const tokens = clean.split(/(\s+|[-/])/);
  const translatedTokens = tokens.map((token) => {
    if (!token || /^\s+$/.test(token) || token === "-" || token === "/") {
      return token;
    }

    if (/^\d+$/.test(token)) {
      return toBengaliNumerals(token);
    }

    const tokenLower = token.toLowerCase();
    if (locationAndHospitalVocabulary[tokenLower]) {
      return locationAndHospitalVocabulary[tokenLower];
    }
    if (dynamicTranslations[token]) {
      return dynamicTranslations[token];
    }

    if (/^[A-Za-z]+$/.test(token)) {
      return transliterateEnglishWordToBengali(token);
    }

    return token;
  });

  return translatedTokens.join("");
}

export function translateAddressOrPhrase(phrase: string): string {
  if (!phrase || typeof phrase !== "string") return "";
  const trimmed = phrase.trim();
  if (!trimmed) return "";

  if (dynamicTranslations[trimmed]) {
    return dynamicTranslations[trimmed];
  }
  const lower = trimmed.toLowerCase();
  if (locationAndHospitalVocabulary[lower]) {
    return locationAndHospitalVocabulary[lower];
  }

  if (trimmed.includes(",") || trimmed.includes(";") || trimmed.includes("\n")) {
    const delimiter = trimmed.includes(",") ? "," : trimmed.includes(";") ? ";" : "\n";
    const parts = trimmed.split(delimiter);
    const translatedParts = parts
      .map((part) => {
        const cleanPart = part.trim();
        if (!cleanPart) return "";
        return translateAddressSegment(cleanPart);
      })
      .filter(Boolean);

    return translatedParts.join(delimiter === "\n" ? "\n" : ", ");
  }

  return translateAddressSegment(trimmed);
}

export function translateDynamicString(text: string, lang: Language): string {
  if (lang === "en" || !text || typeof text !== "string") return text;
  const trimmed = text.trim();
  if (!trimmed) return text;

  // If already contains Bengali characters, return as-is
  if (/[\u0980-\u09FF]/.test(trimmed)) {
    return text;
  }

  // Preserve URLs and email addresses
  if (/^(?:https?:\/\/|www\.)/i.test(trimmed) || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
    return text;
  }

  // 1. Direct match in dynamicTranslations
  if (dynamicTranslations[trimmed]) {
    return dynamicTranslations[trimmed];
  }

  // 2. Case-insensitive / normalized lookup in dynamicTranslations
  const lower = trimmed.toLowerCase();
  for (const [k, v] of Object.entries(dynamicTranslations)) {
    if (k.toLowerCase() === lower) {
      return v;
    }
  }

  // 3. Fallback search against translations.en -> translations.bn
  for (const [key, enVal] of Object.entries(translations.en)) {
    if (typeof enVal === "string" && enVal.trim().toLowerCase() === lower) {
      const bnVal = (translations.bn as Record<string, string>)[key];
      if (bnVal) return bnVal;
    }
  }

  // 4. Punctuation-stripped matching (e.g. trailing period, exclamation, question mark)
  const stripped = lower.replace(/[.:!?।]+$/, "").trim();
  for (const [k, v] of Object.entries(dynamicTranslations)) {
    if (k.toLowerCase().replace(/[.:!?।]+$/, "").trim() === stripped) {
      return v;
    }
  }
  for (const [key, enVal] of Object.entries(translations.en)) {
    if (typeof enVal === "string" && enVal.toLowerCase().replace(/[.:!?।]+$/, "").trim() === stripped) {
      const bnVal = (translations.bn as Record<string, string>)[key];
      if (bnVal) return bnVal;
    }
  }

  // 5. Dynamic patterns: "Consultation Fee: ৳1000" / "Fee: ৳1000"
  if (/^consultation\s*fee:\s*(?:৳|\$|tk\.?|bdt)?\s*(\d+)/i.test(trimmed)) {
    const match = trimmed.match(/^consultation\s*fee:\s*(?:৳|\$|tk\.?|bdt)?\s*(\d+)/i);
    if (match) {
      return `পরামর্শ ফি: ৳${toBengaliNumerals(match[1])}`;
    }
  }

  if (/^fee:\s*(?:৳|\$|tk\.?|bdt)?\s*(\d+)/i.test(trimmed)) {
    const match = trimmed.match(/^fee:\s*(?:৳|\$|tk\.?|bdt)?\s*(\d+)/i);
    if (match) {
      return `ফি: ৳${toBengaliNumerals(match[1])}`;
    }
  }

  // 6. Dynamic Compound Location, Address & Hospital Name translation & transliteration
  const translatedPhrase = translateAddressOrPhrase(trimmed);
  if (translatedPhrase && translatedPhrase !== trimmed) {
    return translatedPhrase;
  }

  return text;
}
