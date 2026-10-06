export const projectCategories = ['All', 'Frontend', 'Full Stack', 'Backend', 'Mobile', 'API'];

/* ---------- real images ---------- */

const shot = (folder, file, caption) => ({
  src: `/screenshots/${folder}/${file}`,
  caption,
});
const bookShots = [
  shot('bookmanagment', 'bookmanagment.png', 'Login'),
  shot('bookmanagment', 'studentmanegment.png', 'Book list'),
  shot('bookmanagment', 'usermanagment.png', 'User management'),
  shot('bookmanagment', 'alltotment.png', 'All allotments'),
];

const loopbookShots = [
  shot('loopbook', 'groups.png', 'Groups overview'),
  shot('loopbook', 'group-detail.png', 'Group detail and balances'),
  shot('loopbook', 'transactions.png', 'All transactions'),
  shot('loopbook', 'profile.png', 'User profile'),
];

const remindmeShots = [
  shot('remindme', 'calendar.png', 'Calendar'),
  shot('remindme', 'create-reminder.png', 'Create reminder'),
  shot('remindme', 'notes.png', 'Notes'),
  shot('remindme', 'settings.png', 'Settings'),
];

// Salesman App abhi coming soon hai, screenshots nahi hain.
// Jab ready ho: public/screenshots/salesman folder banao aur yahan add karo.
const salesmanShots = [];

/* ---------- projects ---------- */
/* Order: 1. Book Management  2. RemindMe  3. LoopBook  4. Salesman App */

export const projects = [
  /* ===== 1. Book Management System ===== */
  {
    id: 'book-management',
    slug: 'book-management',
    title: 'Book Management System',
    tagline: 'A tidy catalogue for books, authors and categories.',
    category: 'Full Stack',
    categories: ['Full Stack', 'Backend', 'API'],
    year: '2025',
    role: 'Full Stack Developer',
    status: 'Completed',
    comingSoon: false,
    description:
      'A CRUD-driven library catalogue with search, filtering and role-based access, built with React and an ASP.NET Core Web API.',
    image: '/logos/book-management.png',
    accent: ['#f59e0b', '#a78bfa'],
    technologies: ['React', 'Tailwind CSS', 'Axios', 'ASP.NET Core', 'SQL Server', 'Entity Framework', 'JWT'],
    features: [
      'Create, edit and delete books with validation',
      'Search and filter by title, author or category',
      'Role-based access for admins and readers',
      'Paged API responses with LINQ filtering',
      'Responsive card and table layouts',
    ],
    screenshots: bookShots,
    details: {
      overview:
        'A classic full stack exercise done properly: layered API, validated forms, authentication and a responsive UI that scales from phones to desktops.',
      problem:
        'Small libraries often track books in spreadsheets, which makes searching, ownership and permissions hard to manage.',
      solution:
        'A web app that centralises the catalogue with fast search and clear permissions, backed by a relational database.',
      architecture: {
        summary: 'Classic three-tier architecture: React UI, ASP.NET Core API, SQL Server.',
        layers: [
          { label: 'Client', items: ['React', 'Tailwind CSS', 'Axios'] },
          { label: 'API', items: ['ASP.NET Core', 'JWT', 'Validation'] },
          { label: 'Data', items: ['Entity Framework', 'SQL Server'] },
        ],
      },
      frontend: 'React components for list, detail and form views with client-side validation and loading/error states.',
      backend: 'Controllers delegate to services and repositories registered through dependency injection.',
      database: 'Normalised tables for books, authors and categories with foreign keys and indexes on search fields.',
      authentication: 'JWT bearer authentication with admin and reader roles enforced by authorization policies.',
      api: {
        summary: 'REST endpoints with paging and filtering via LINQ.',
        endpoints: [
          { method: 'GET', path: '/api/books', desc: 'Search, filter and page books' },
          { method: 'POST', path: '/api/books', desc: 'Create a book (admin)' },
          { method: 'PUT', path: '/api/books/{id}', desc: 'Update a book (admin)' },
          { method: 'DELETE', path: '/api/books/{id}', desc: 'Delete a book (admin)' },
        ],
      },
      challenges: [
        { title: 'Keeping filters fast', text: 'Moving filtering into the database with LINQ and indexing the search columns kept responses quick as data grew.' },
      ],
      learned: [
        'Thin controllers and focused services make features easy to extend.',
        'Consistent error shapes make the frontend far simpler.',
      ],
    },
  },

  /* ===== 2. RemindMe ===== */
  {
    id: 'remindme',
    slug: 'remindme',
    title: 'RemindMe',
    tagline: 'A reminder app that actually nudges you.',
    category: 'Full Stack',
    categories: ['Frontend', 'Mobile'],
    year: '2026',
    role: 'Full Stack Developer',
    status: 'Active development',
    comingSoon: false,
    description:
      'A glassmorphic productivity app with a custom calendar, quick-add reminders and Firebase push notifications, backed by an ASP.NET Core API.',
    image: '/logos/remindme.png',
    accent: ['#a78bfa', '#38bdf8'],
    technologies: ['React', 'Tailwind CSS', 'ASP.NET Core', 'SQL Server', 'Entity Framework', 'Firebase Cloud Messaging', 'Capacitor'],
    features: [
      'Custom calendar with reminders per day',
      'Create, edit, complete and delete reminders from polished modals',
      'Push notifications through Firebase Cloud Messaging',
      'Formik + Yup validation with clear error messages',
      'Repository-pattern API with paging',
      'Android wrapper built with Capacitor',
    ],
    screenshots: remindmeShots,
    details: {
      overview:
        'RemindMe pairs a modern React interface with a dependable ASP.NET Core backend. It is my main playground for full stack patterns: repository layer, validation, push notifications and mobile packaging.',
      problem:
        'Most reminder apps are either too basic to organize a busy week or too heavy to open for a quick note, and they rarely notify you reliably.',
      solution:
        'A lightweight dashboard-style UI with fast creation, a calendar for planning and background push notifications delivered by Firebase.',
      architecture: {
        summary: 'Frontend and API communicate over HTTPS. The API persists data through a repository layer and sends pushes via the Firebase Admin SDK.',
        layers: [
          { label: 'Client', items: ['React 18', 'Vite', 'Tailwind CSS'] },
          { label: 'API', items: ['ASP.NET Core', 'Controllers', 'Services'] },
          { label: 'Domain', items: ['Repositories', 'View models', 'Dependency Injection'] },
          { label: 'Data & push', items: ['SQL Server', 'Firebase Admin SDK'] },
        ],
      },
      frontend:
        'React + Vite with a useReminders hook that maps UI fields to API fields, a custom calendar component, CRUD modals and Axios for transport. The UI moved from custom CSS to Tailwind for consistency.',
      backend:
        'ASP.NET Core with the repository pattern: models, view models and repositories live in separate projects. Notification logic sits behind an INotificationService abstraction.',
      database:
        'Started on MySQL (Pomelo) and moved to SQL Server with EF Core; retry-on-failure was added for transient connection errors.',
      authentication:
        'The current build focuses on core flows; device tokens are stored per device to target push notifications precisely.',
      api: {
        summary: 'Action-style routes under api/Reminder with paged listing.',
        endpoints: [
          { method: 'GET', path: '/api/Reminder/GetAll', desc: 'Paged list of reminders' },
          { method: 'POST', path: '/api/Reminder/Create', desc: 'Create a reminder' },
          { method: 'PUT', path: '/api/Reminder/Update', desc: 'Update a reminder' },
          { method: 'DELETE', path: '/api/Reminder/Delete', desc: 'Delete by id' },
        ],
      },
      challenges: [
        { title: 'CORS and HTTPS', text: 'Duplicate UseCors calls, HTTP→HTTPS redirects and a missing .env file caused confusing failures. A single ordered middleware pipeline fixed it.' },
        { title: 'Push notifications end to end', text: 'Service worker, permission flow and token generation had to line up with the backend device-token endpoint before pushes arrived.' },
        { title: 'Android build tooling', text: 'Gradle and AAPT2 crashes on Windows led me to exclude build folders from antivirus scanning and disable the AAPT2 daemon mode.' },
      ],
      learned: [
        'Map UI and API field names explicitly in one place.',
        'Abstract notification providers so the rest of the API stays clean.',
        'Native builds are as much about environment hygiene as code.',
      ],
    },
  },

  /* ===== 3. LoopBook ===== */
  {
    id: 'loopbook',
    slug: 'loopbook',
    title: 'LoopBook',
    tagline: 'Split group expenses without the awkward maths.',
    category: 'Full Stack',
    categories: ['Full Stack', 'Frontend', 'Mobile'],
    year: '2026',
    role: 'Full Stack Developer',
    status: 'Active development',
    comingSoon: false,
    description:
      'A group expense-splitting app for friends, trips and flatmates — real-time balances, a clean admin panel and an installable Android build.',
    image: '/logos/loopbook.png',
    accent: ['#22d3ee', '#6366f1'],
    technologies: ['React', 'Vite', 'Tailwind CSS', 'Framer Motion', 'Firebase', 'Capacitor', 'ASP.NET Core'],
    features: [
      'Create groups, add expenses and see who owes whom at a glance',
      'Admin panel with Recharts analytics and the “Loop Ring” radial visualization',
      'Light / System / Dark theme with a splash screen that follows the OS',
      'Searchable Help & Support with an FAQ accordion',
      'Timezone-safe (IST) date labels and sortable transaction lists',
      'Android build through Capacitor with Play Store assets',
    ],
    screenshots: loopbookShots,
    details: {
      overview:
        'LoopBook is one of the products I work on at Cubic Eight. It turns the messy “who paid for what” conversation into a clear, trustworthy ledger shared by everyone in a group, on web and Android.',
      problem:
        'Splitting costs in group chats leads to forgotten payments, unclear balances and awkward follow-ups — and spreadsheets are too heavy for a quick dinner or a weekend trip.',
      solution:
        'A fast, mobile-first interface where adding an expense takes seconds. Balances are recalculated instantly, history is easy to audit and an admin panel gives the team visibility into how the product is used.',
      architecture: {
        summary: 'A React client talks to an ASP.NET Core API; Firebase handles sign-in, and Capacitor packages the same code for Android.',
        layers: [
          { label: 'Client', items: ['React + Vite', 'Tailwind CSS', 'Framer Motion'] },
          { label: 'Native shell', items: ['Capacitor', 'Android'] },
          { label: 'Services', items: ['ASP.NET Core API', 'Firebase'] },
          { label: 'Data', items: ['Relational DB', 'Entity Framework'] },
        ],
      },
      frontend:
        'React + Vite with React Router v6, Tailwind CSS and Framer Motion. A custom ThemeContext exposes an isDark flag with explicit light/dark class pairs, a three-way toggle and system detection. Reusable avatar components fall back gracefully when an image is missing.',
      backend:
        'ASP.NET Core API with Entity Framework Core. Concurrency conflicts are handled explicitly so two people editing the same group never overwrite each other silently.',
      database:
        'Relational model for users, groups, expenses and settlements, managed through EF Core migrations.',
      authentication:
        'Google sign-in through Firebase on the web and a Capacitor Google Auth plugin on Android; protected routes keep the app and admin panel behind authentication.',
      api: {
        summary: 'REST endpoints grouped by resource, consumed through an Axios service layer with shared interceptors.',
        endpoints: [
          { method: 'GET', path: '/api/groups', desc: 'List the signed-in user’s groups' },
          { method: 'POST', path: '/api/expenses', desc: 'Add an expense and split rules' },
          { method: 'GET', path: '/api/groups/{id}/balances', desc: 'Calculate who owes whom' },
          { method: 'GET', path: '/api/admin/stats', desc: 'Usage analytics for the admin panel' },
        ],
      },
      challenges: [
        { title: 'Dependency conflicts on Capacitor 8', text: 'A Google Auth plugin lagged behind the Capacitor major version. I resolved the peer-dependency conflict deliberately with --legacy-peer-deps and verified the native build.' },
        { title: 'Dates that stay correct', text: 'Expenses logged late at night were landing on the wrong day. Moving label formatting to an explicit Asia/Kolkata timezone fixed it everywhere.' },
        { title: 'Concurrent edits', text: 'Early on, simultaneous updates triggered EF Core concurrency exceptions. Handling them gracefully turned a crash into a friendly refresh prompt.' },
      ],
      learned: [
        'Design tokens and a single theme provider save hours when a product needs three themes.',
        'Plan for native packaging early — plugin compatibility is a real constraint.',
        'Small, well-named hooks keep admin-panel API code readable.',
      ],
    },
  },

  /* ===== 4. Salesman App ===== */
  {
    id: 'salesman-app',
    slug: 'salesman-app',
    title: 'Salesman App',
    tagline: 'Orders, visits and payments for a wholesale medical shop.',
    category: 'Mobile',
    categories: ['Mobile', 'Frontend'],
    year: '2026',
    role: 'Frontend Developer',
    status: 'Coming soon',
    comingSoon: true,
    description:
      'A lightweight, offline-first app that helps a field salesman note orders per party, plan visits and track cash versus online payments. Everything is stored on the phone — no server needed.',
    image: '',
    accent: ['#34d399', '#22d3ee'],
    technologies: ['Ionic', 'Capacitor', 'SQLite'],
    features: [
      'Per-party order notes — no heavy product master required',
      'Visit reminders so no party is forgotten',
      'Cash vs online payment tracking',
      'Promised-payment dates with follow-up reminders',
      'Reports, backup and export',
      'Works fully offline with on-device SQLite',
    ],
    screenshots: salesmanShots,
    details: {
      overview:
        'Built for a real wholesale medical business, this app replaces paper notes and memory with a fast, focused tool a salesman can use in the field. It is coming soon.',
      problem:
        'Orders were written by hand, visit schedules lived in someone’s head, and promised payments were forgotten — all costing time and money.',
      solution:
        'A deliberately small app: choose a party, jot the order, record the payment and set the next visit. It stays out of the way and works without any connection.',
      architecture: {
        summary: 'A frontend-only app: Ionic + Capacitor on the phone, with all data stored locally in SQLite. No backend or server.',
        layers: [
          { label: 'Client', items: ['Ionic', 'Capacitor'] },
          { label: 'Local data', items: ['SQLite on device'] },
          { label: 'Utilities', items: ['Local reminders', 'Backup & export'] },
        ],
      },
      frontend: 'A mobile-first interface tuned for one-handed use, big tap targets and minimal typing.',
      backend: 'No backend. All logic and data live on the device.',
      database: 'On-device SQLite for parties, orders and payments, with export for backup.',
      authentication: 'No server login. Data stays on the phone.',
      api: {
        summary: 'No API. The app does not talk to a server.',
        endpoints: [],
      },
      challenges: [
        { title: 'Scope discipline', text: 'The real need was “less”, not “more”. Dropping the product master kept the app fast and easy to adopt.' },
        { title: 'Everything on the device', text: 'Keeping all data in local SQLite shaped the data model from day one and keeps the app working with zero connectivity.' },
      ],
      learned: [
        'Talk to the people who will use it daily before designing features.',
        'A small feature set that fits a workflow beats a big one that does not.',
      ],
    },
  },
];