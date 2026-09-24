import { stats } from "../data/portfolioData";

export default function Stats() {
  return (
    <section className="stats container">
      {stats.map(([n, t]) => (
        <div className="stat" key={t}>
          <b>{n}</b>
          <span>{t}</span>
        </div>
      ))}
    </section>
  );
}
