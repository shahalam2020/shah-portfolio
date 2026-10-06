
export const skillCategories = [
  { id: 'Frontend', blurb: 'Interfaces that are fast, accessible and a pleasure to use.' },
  { id: 'Backend', blurb: 'Clean, secure APIs and real-time services on .NET.' },
  { id: 'Database', blurb: 'Relational data modelling, queries and migrations.' },
  { id: 'Mobile', blurb: 'Web skills shipped as installable Android apps.' },
  { id: 'Tools', blurb: 'The workflow that keeps shipping predictable.' },
];

export const skills = [
  // ── Frontend ──
  { name: 'HTML5', category: 'Frontend', icon: { si: 'siHtml5' }, level: 4, description: 'Semantic, accessible markup that search engines and screen readers love.', officialUrl: 'https://developer.mozilla.org/docs/Web/HTML' },
  { name: 'CSS3', category: 'Frontend', icon: { si: 'siCss3' }, level: 4, description: 'Grid, flexbox, custom properties and polished responsive layouts.', officialUrl: 'https://developer.mozilla.org/docs/Web/CSS' },
  { name: 'JavaScript', category: 'Frontend', icon: { si: 'siJavascript' }, level: 4, description: 'Modern ES2020+ for async flows, state and clean application logic.', officialUrl: 'https://developer.mozilla.org/docs/Web/JavaScript' },
  { name: 'React.js', category: 'Frontend', icon: { si: 'siReact' }, level: 4, description: 'Component-driven UIs with hooks, routing and code splitting.', officialUrl: 'https://react.dev' },
  { name: 'Tailwind CSS', category: 'Frontend', icon: { si: 'siTailwindcss' }, level: 4, description: 'Design-token driven styling with dark mode and fast iteration.', officialUrl: 'https://tailwindcss.com' },
  { name: 'Axios', category: 'Frontend', icon: { si: 'siAxios' }, level: 4, description: 'Typed service layers, interceptors and consistent error handling.', officialUrl: 'https://axios-http.com' },
  { name: 'Framer Motion', category: 'Frontend', icon: { si: 'siFramer' }, level: 3, description: 'Spring-based micro-interactions and layout animations.', officialUrl: 'https://www.framer.com/motion' },
  { name: 'Lucide React', category: 'Frontend', icon: { si: 'siLucide' }, level: 3, description: 'Crisp, consistent iconography across every screen.', officialUrl: 'https://lucide.dev' },
  { name: 'Material UI', category: 'Frontend', icon: { si: 'siMui' }, level: 2, description: 'Production-ready component primitives when speed matters.', officialUrl: 'https://mui.com' },
  { name: 'Redux', category: 'Frontend', icon: { si: 'siRedux' }, level: 3, description: 'Predictable global state with Redux Toolkit slices.', officialUrl: 'https://redux-toolkit.js.org' },

  // ── Backend ──
  { name: 'C#', category: 'Backend', icon: { mark: 'C#', color: '#9B4F96' }, level: 3, description: 'Strongly-typed, readable server code with modern language features.', officialUrl: 'https://learn.microsoft.com/dotnet/csharp' },
  { name: 'ASP.NET Core Web API', category: 'Backend', icon: { si: 'siDotnet' }, level: 3, description: 'Layered REST APIs with controllers, middleware and validation.', officialUrl: 'https://learn.microsoft.com/aspnet/core' },
  { name: 'REST API', category: 'Backend', icon: { lucide: 'Network', color: '#38bdf8' }, level: 4, description: 'Resource-oriented endpoints with clear contracts and status codes.' },
  { name: 'Dependency Injection', category: 'Backend', icon: { lucide: 'Boxes', color: '#a78bfa' }, level: 3, description: 'Loosely coupled services, repositories and testable layers.', officialUrl: 'https://learn.microsoft.com/dotnet/core/extensions/dependency-injection' },
  { name: 'LINQ', category: 'Backend', icon: { lucide: 'ListFilter', color: '#34d399' }, level: 3, description: 'Expressive querying over collections and Entity Framework sets.', officialUrl: 'https://learn.microsoft.com/dotnet/csharp/linq' },
  { name: 'Entity Framework', category: 'Backend', icon: { mark: 'EF', color: '#8b7cf6' }, level: 3, description: 'Code-first models, migrations and concurrency handling.', officialUrl: 'https://learn.microsoft.com/ef/core' },
  { name: 'JWT Authentication', category: 'Backend', icon: { si: 'siJsonwebtokens' }, level: 3, description: 'Stateless auth with signed tokens, expiry and refresh flows.', officialUrl: 'https://jwt.io' },
  { name: 'Google OAuth', category: 'Backend', icon: { si: 'siGoogle' }, level: 3, description: 'One-tap Google sign-in verified on the server.', officialUrl: 'https://developers.google.com/identity' },
  { name: 'Role-Based Access Control', category: 'Backend', icon: { lucide: 'ShieldCheck', color: '#2dd4bf' }, level: 3, description: 'Policies and roles that keep admin features locked down.' },
  //{ name: 'SignalR', category: 'Backend', icon: { mark: 'SR', color: '#8b7cf6' }, level: 2, description: 'Real-time updates over WebSockets with automatic fallbacks.', officialUrl: 'https://learn.microsoft.com/aspnet/core/signalr' },

  // ── Database ──
  { name: 'MySQL', category: 'Database', icon: { si: 'siMysql' }, level: 3, description: 'Schemas, indexes and Pomelo-powered EF Core access.', officialUrl: 'https://www.mysql.com' },
  //{ name: 'SQL Server', category: 'Database', icon: { lucide: 'Database', color: '#e5484d' }, level: 3, description: 'T-SQL, migrations and resilient connections with retry policies.', officialUrl: 'https://www.microsoft.com/sql-server' },

  // ── Mobile ──
  { name: 'Ionic', category: 'Mobile', icon: { si: 'siIonic' }, level: 3, description: 'Cross-platform UI that feels native on Android.', officialUrl: 'https://ionicframework.com' },
  { name: 'Capacitor', category: 'Mobile', icon: { si: 'siCapacitor' }, level: 3, description: 'Wrap a web app into an Android build with native plugins.', officialUrl: 'https://capacitorjs.com' },

  // ── Tools ──
  { name: 'Git', category: 'Tools', icon: { si: 'siGit' }, level: 4, description: 'Branching, rebasing and clean, reviewable history.', officialUrl: 'https://git-scm.com' },
  { name: 'GitHub', category: 'Tools', icon: { si: 'siGithub' }, level: 4, description: 'Repos, pull requests and CI for every project.', officialUrl: 'https://github.com' },
  { name: 'Visual Studio', category: 'Tools', icon: { mark: 'VS', color: '#7c4dcc' }, level: 3, description: 'Debugging and publishing .NET solutions end to end.', officialUrl: 'https://visualstudio.microsoft.com' },
  { name: 'VS Code', category: 'Tools', icon: { lucide: 'Code2', color: '#2f9bf0' }, level: 4, description: 'My daily editor for everything on the frontend.', officialUrl: 'https://code.visualstudio.com' },
  { name: 'Postman', category: 'Tools', icon: { si: 'siPostman' }, level: 4, description: 'Collections and environments for testing every endpoint.', officialUrl: 'https://www.postman.com' },
  { name: 'Firebase Console', category: 'Tools', icon: { si: 'siFirebase' }, level: 3, description: 'Auth, Firestore, storage and push notifications.', officialUrl: 'https://firebase.google.com' },
  { name: 'Scalar', category: 'Tools', icon: { si: 'siScalar' }, level: 2, description: 'Beautiful interactive API reference for ASP.NET Core.', officialUrl: 'https://scalar.com' },
];

export const levelLabels = { 1: 'Learning', 2: 'Familiar', 3: 'Comfortable', 4: 'Daily driver' };

// Order shown in the infinite marquee (names must match `name` above or be plain text)
export const marqueeTech = [
  'React.js', 'JavaScript', 'ASP.NET Core Web API', 'C#', 'SQL Server', 'MySQL', 'Entity Framework',
  'JWT Authentication', 'SignalR', 'Tailwind CSS', 'Redux', 'GitHub', 'Framer Motion', 'Ionic', 'Capacitor', 'Firebase Console',
];
