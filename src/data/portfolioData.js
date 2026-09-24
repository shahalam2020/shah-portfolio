import loopbookLogo from "../assets/loopbook-logo.png";
import remindeme from "../assets/remindeme-logo.png";

export const skills = [
  ["React", "Frontend"],
  ["JavaScript", "Frontend"],
  ["Tailwind CSS", "Frontend"],
  ["Lucide React", "Frontend"],
  [".NET Core", "Backend"],
  ["ASP.NET Web API", "Backend"],
  ["C#", "Backend"],
  ["MySQL", "Database"],
  ["Entity Framework", "Database"],
  ["JWT", "Authentication"],
  ["Firebase", "Authentication"],
  ["Capacitor", "Android"],
  ["Git & GitHub", "Tools"],
  ["Postman", "Tools"],
  ["Scalar", "Tools"],
];

export const projects = [
  {
    title: "LoopBook",
  
    description:
      "LoopBook is a production-ready Android expense sharing application, live on the Google Play Store. Built with React, ASP.NET Core, and Capacitor, it features Google Sign-In, role-based access control, Firebase push notifications, trip and group management, shared expense tracking, automatic balance calculation, and payment settlement, allowing users to easily manage and split expenses with friends and groups.",
    tags: ["React", "ASP.NET Core", "MySQL","Capacitor","Firebase","Google Auth","JWT"],
    github: "#",
    live: "https://play.google.com/store/apps/details?id=in.codersacademy.loopbook",
    logo: loopbookLogo,
  },
  {
    title: "Reminder App",
   
    description:
      "Smart reminder experience with categories, priorities, recurring reminders and notification-ready architecture.",
    tags: ["React", "ASP.NET Core", "MySQL","Capacitor","Firebase","Google Auth","JWT"],
    github: "#",
    live: "#",
    logo: remindeme,
  },
  {
    title: "Book Management",
    
    description:
      "A full-stack Book Management System built with React and ASP.NET Core Web API. The application uses JWT authentication and role-based authorization (Admin & Student). Administrators can manage students and books, assign books through an allotment module, while students can securely log in and view their allotted books from a personalized dashboard..",
    tags: ["React", "ASP.NET", "MySQL"],
    github: "#",
    live: "#",
  },
];

export const stats = [
   ["15+", "Skills"],
  ["4+", "Projects / Builds"],
   ["1", "Play-Store-App"],
  ["∞", "Curiosity"],
 
 
 
];