import {
  Atom,
  ArrowLeftRight,
  BellRing,
  Braces,
  Cpu,
  Database,
  Flame,
  GitBranch,
  KeyRound,
  Layers,
  Network,
  Orbit,
  Send,
  Server,
  Shapes,
  ShieldCheck,
  Smartphone,
  Sparkles,
  Table2,
  Wind,
  Wrench,
  FileCode,
} from "lucide-react";

/**
 * Skills.jsx ka data. Shape:
 * { category, icon, items: [{ name, icon, color }] }
 * `color` chip ka hover glow aur icon ka rang set karta hai.
 */
export const skillGroups = [
  {
    category: "Frontend",
    icon: Layers,
    items: [
      { name: "React", icon: Atom, color: "#24a7ff" },
      { name: "JavaScript", icon: Braces, color: "#fbbf24" },
      { name: "Tailwind CSS", icon: Wind, color: "#2dd4bf" },
      { name: "Lucide React", icon: Shapes, color: "#f472b6" },
      { name: "Framer Motion", icon: Sparkles, color: "#e879f9" },
    ],
  },
  {
    category: "Backend",
    icon: Server,
    items: [
      { name: ".NET Core", icon: Cpu, color: "#7c5cff" },
      { name: "ASP.NET Web API", icon: Network, color: "#8b7dff" },
      { name: "C#", icon: FileCode, color: "#a78bfa" },
    ],
  },
  {
    category: "Database",
    icon: Database,
    items: [
      { name: "MySQL", icon: Database, color: "#38bdf8" },
      { name: "Entity Framework", icon: Table2, color: "#60a5fa" },
    ],
  },
  {
    category: "Authentication",
    icon: ShieldCheck,
    items: [
      { name: "JWT", icon: KeyRound, color: "#34d399" },
      { name: "Firebase", icon: Flame, color: "#ff7a3d" },
      { name: "Authentication-Roll-Base-access", icon: KeyRound, color: "#ff0a0a" },
    ],
  },
  {
    category: "Android",
    icon: Smartphone,
    items: [
      { name: "Ionic", icon: Orbit, color: "#3880ff" },
      { name: "Capacitor", icon: Smartphone, color: "#4ade80" },
    ],
  },
  {
    category: "Tools",
    icon: Wrench,
    items: [
      { name: "Git", icon: GitBranch, color: "#ff0a0a" },
      { name: "GitHub", icon: GitBranch, color: "#e5e7eb" },
      { name: "Postman", icon: Send, color: "#ff7a3d" },
      { name: "Scalar", icon: Network, color: "#c084fc" },
      { name: "Axios", icon: ArrowLeftRight, color: "#6366f1" },
      { name: "Firebase Cloud Messaging", icon: BellRing, color: "#ffca28" },
    ],
  },
];