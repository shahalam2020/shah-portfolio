import { CheckCircle2 } from "lucide-react";

export default function About() {
  return (
    <section id="about" className="section container">
      <div className="section-label">01 — About</div>
      <div className="about-grid">
        <div>
          <h2>
            Turning ideas into <span>useful products.</span>
          </h2>
        </div>
        <div>
          <p>
           I'm Shah Alam, a Full Stack Developer specializing in React, ASP.NET Core, MySQL, and Android app development with Capacitor. I build secure, scalable, and user-focused applications that deliver real-world business solutions.

My expertise includes RESTful APIs, JWT Authentication, Role-Based Authorization, Firebase Push Notifications, Google Authentication, and responsive UI development. I enjoy transforming ideas into production-ready web and mobile applications with clean architecture and modern development practices.
          </p>
          <div className="mini-points">
            <div>
              <CheckCircle2 /> Component-based UI
            </div>
            <div>
              <CheckCircle2 /> REST API development
            </div>
            <div>
              <CheckCircle2 /> Database-driven systems
            </div>
            <div>
              <CheckCircle2 /> Authentication & CRUD
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
