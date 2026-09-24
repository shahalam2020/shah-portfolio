export const projects = [
  {
    slug: "loopbook",
    index: 0,
    status: "Full Stack",
    title: "LoopBook",
    subtitle: "Group Expenses, Made Simple",
    description:
      "Split expenses, track spends, and settle up effortlessly within groups — all members in one place.",

    logo: "/logos/loopbook.png",

    live:
      "https://play.google.com/store/apps/details?id=in.codersacademy.loopbook",

    // Real app screenshots — files: public/screenshots/loopbook/
    screenshots: [
      {
        src: "/screenshots/loopbook/groups.png",
        title: "Groups",
        caption: "All your groups in one list, with search and quick filters.",
      },
      {
        src: "/screenshots/loopbook/group-detail.png",
        title: "Group balance",
        caption: "Net balance, total debit and credit for a single group.",
      },
      {
        src: "/screenshots/loopbook/transactions.png",
        title: "All transactions",
        caption: "Every credit and debit, grouped by date.",
      },
      {
        src: "/screenshots/loopbook/profile.png",
        title: "Profile",
        caption: "Account details, display mode and support in one place.",
      },
    ],

    tags: ["React.js", "Vite", "Tailwind CSS", "Framer Motion", "ASP.NET Core", "Firebase", "Capacitor"],
    features: [
      "Create & Manage Groups",
      "Add Expenses",
      "Track Balances",
      "Settle Up",
      "All Transactions",
      "Smart Reports",
    ],
    overview:
      "LoopBook is a group expense-splitting app that lets friends, roommates, and travel groups add expenses, track who paid what, and settle balances instantly — with real-time sync and clear per-member summaries. Built with a React + Vite frontend, ASP.NET Core backend, and wrapped as a native Android app via Capacitor.",
    problem:
      "Splitting group expenses manually (spreadsheets, chat threads, mental math) leads to confusion over who owes whom, missed payments, and no clear record of group spending over time.",
    solution:
      "LoopBook lets users create groups, log expenses with splits, and automatically calculates who owes what. Real-time balance tracking, credit/debit clarity, and one-tap settle-up remove the guesswork from splitting bills — with an admin panel featuring radial 'Loop Ring' visualizations for spend insights.",
    keyFeatures: [
      { title: "Create Groups", description: "Add and manage groups with ease for trips, roommates, or events." },
      { title: "Add Expenses", description: "Log expenses with split and real-time updates for every member." },
      { title: "Track Balances", description: "Real-time balance and transaction tracking for the whole group." },
      { title: "Settle Easily", description: "Settle up payments and clear balances in a couple of taps." },
      { title: "All Transactions", description: "See every credit and debit in one place, filtered by member or date." },
    ],
    techStack: {
      Frontend: "React + Vite",
      Styling: "Tailwind CSS",
      Animations: "Framer Motion",
      Backend: "ASP.NET Core",
      Cloud: "Firebase",
      Mobile: "Capacitor",
    },
    architectureTitle: "Real-Time Sync",
    architectureNote:
      "Group balances and transactions sync live across all members' devices, so any expense added or payment settled reflects instantly for everyone in the group. An admin panel provides Recharts-based visualizations with dual light/dark theming.",
    platforms: ["Android"],
    platformNote: "Built as a responsive web app and packaged for Android via Capacitor.",
  },

  {
    slug: "remindme",
    index: 1,
    status: "Full Stack",
    title: "RemindMe",
    subtitle: "Never Miss a Task Again",
    description:
      "A full-stack reminder app with a custom calendar, real-time push notifications, and a native Android app.",

    logo: "/logos/remindme.png",

    // Real app screenshots — files: public/screenshots/remindme/
    screenshots: [
     
      {
        src: "/screenshots/remindme/calendar.png",
        title: "Calendar",
        caption: "Month view with festivals and a quick add for any selected day.",
      },
      {
        src: "/screenshots/remindme/create-reminder.png",
        title: "Create reminder",
        caption: "Title, description, repeat and category in one clean popup.",
      },
      {
        src: "/screenshots/remindme/notes.png",
        title: "Notes",
        caption: "Pin, archive and search notes, organised with tags.",
      },
      {
        src: "/screenshots/remindme/settings.png",
        title: "Settings",
        caption: "Light, dark or system theme, plus notification and vibration controls.",
      },
    ],

    tags: ["React 18", "Vite", "Tailwind CSS", "ASP.NET Core", "SQL Server", "Firebase Cloud Messaging", "Capacitor"],
    features: [
      "Custom Calendar",
      "CRUD Reminders",
      "Category Tagging",
      "Push Notifications",
      "Device Token Management",
      "Android App",
    ],
    overview:
      "RemindMe is a full-stack reminder and task management app with a glassmorphism-styled React frontend and an ASP.NET Core backend. It supports creating, editing, and completing reminders with categories, dates, and times, and delivers real-time push notifications via Firebase Cloud Messaging across web and Android.",
    problem:
      "Manually tracking reminders without real-time alerts leads to missed tasks — most simple note or to-do apps don't sync reminders with push notifications across devices reliably.",
    solution:
      "RemindMe provides a custom calendar-based reminder system with full CRUD, category tagging, and Firebase Cloud Messaging push notifications that alert users in real time — wrapped as a native Android app via Capacitor for on-the-go access.",
    keyFeatures: [
      { title: "Custom Calendar", description: "Glassmorphism-styled calendar to visually browse and manage reminders." },
      { title: "CRUD Reminders", description: "Create, edit, and delete reminders with dates, times, and categories." },
      { title: "Category Tagging", description: "Organize reminders by category for quick filtering and clarity." },
      { title: "Push Notifications", description: "Firebase Cloud Messaging delivers real-time reminder alerts to web and Android." },
      { title: "Device Token Management", description: "Backend tracks device tokens to deliver targeted push notifications." },
      { title: "Android App", description: "Wrapped as a native Android app using Capacitor." },
    ],
    techStack: {
      Frontend: "React 18 + Vite",
      Styling: "Tailwind CSS",
      Backend: "ASP.NET Core",
      Database: "SQL Server",
      Notifications: "Firebase Cloud Messaging",
      Mobile: "Ionic + Capacitor",
    },
    architectureTitle: "Push Notification Architecture",
    architectureNote:
      "A FirebaseNotificationService on the backend (built on the FirebaseAdmin SDK) sends targeted push notifications by device token, while the frontend registers for FCM via a service worker and hooks — so reminders are delivered instantly even when the app isn't open.",
    platforms: ["Web", "Android"],
    platformNote: "Packaged as a native Android app using Capacitor.",
  },

  {
    slug: "book-management",
    index: 2,
    status: "Full Stack",
    title: "Book Management System",
    subtitle: "Books, Students, and Allotments in One Place",
    description:
      "A full-stack library management app with role-based logins, book allotment and return tracking, and a dashboard for the whole collection.",

    logo: "/logos/book-management.png",
    screenshots: [
     
      {
        src: "/screenshots/bookmanagment/alltotment.png",
        title: "Calendar",
        caption: "Month view with festivals and a quick add for any selected day.",
      },
      {
        src: "/screenshots/bookmanagment/bookmanagment.png",
        title: "Create reminder",
        caption: "Title, description, repeat and category in one clean popup.",
      },
      {
        src: "/screenshots/bookmanagment/studentmanegment.png",
        title: "Notes",
        caption: "Pin, archive and search notes, organised with tags.",
      },
      {
        src: "/screenshots/bookmanagment/usermanagment.png",
        title: "Settings",
        caption: "Light, dark or system theme, plus notification and vibration controls.",
      },
    ],

    

    tags: ["React.js", "Vite", "Tailwind CSS", "ASP.NET Core", "Entity Framework Core", "MySQL", "JWT"],
    features: [
      "Role-Based Login",
      "Manage Books",
      "Manage Students",
      "Allotment & Returns",
      "Issued/Available Tracking",
      "Dashboard",
    ],
    overview:
      "Book Management System is a full-stack web app for running a library end to end — managing the book catalog, student records, and who currently holds which book. Built with a React + Vite frontend and an ASP.NET Core Web API backend, with MySQL and Entity Framework Core handling the data layer.",
    problem:
      "Tracking a library's books, students, and who has borrowed what by hand (registers or spreadsheets) makes it easy to lose track of issued copies, overdue returns, and available stock.",
    solution:
      "The system centralizes books, students, and allotments behind role-based Admin and Student logins. Admins can add, update, delete, and search books, manage students, and record allotments and returns, while a dashboard surfaces issued vs. available copies at a glance — all backed by a JWT-secured REST API.",
    keyFeatures: [
      { title: "Role-Based Access", description: "Separate Admin and Student logins, each scoped to what they're allowed to do." },
      { title: "Book Catalog", description: "Add, update, delete, and search books in the collection." },
      { title: "Student Management", description: "Keep student records tied to the books they've borrowed." },
      { title: "Allotment & Returns", description: "Issue books to students and record returns, with status tracked automatically." },
      { title: "Issued/Available Tracking", description: "See at a glance which copies are out and which are on the shelf." },
      { title: "Dashboard", description: "A summary view of books and students for quick admin oversight." },
    ],
    techStack: {
      Frontend: "React + Vite",
      Styling: "Tailwind CSS",
      Backend: "ASP.NET Core Web API",
      Database: "MySQL",
      ORM: "Entity Framework Core",
      Auth: "JWT",
    },
    architectureTitle: "Role-Based REST API",
    architectureNote:
      "A RESTful ASP.NET Core Web API backed by Entity Framework Core and MySQL handles books, students, and allotments, with JWT authentication gating Admin vs. Student access to each endpoint.",
    platforms: ["Web"],
    platformNote: "Built and used as a responsive web app.",
  },
];