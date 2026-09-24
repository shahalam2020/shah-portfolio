import { useEffect, useRef, useState } from "react";
import { skillGroups } from "../data/Skillgroups"; // file: src/data/skillGroups.js

function SkillGroup({ group, groupIndex }) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  const GroupIcon = group.icon;

  useEffect(() => {
    const node = ref.current;
    if (!node) return undefined;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2, rootMargin: "0px 0px -60px 0px" }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`skill-panel${visible ? " is-visible" : ""}`}
      style={{ transitionDelay: `${groupIndex * 70}ms` }}
    >
      <div className="skill-panel-head">
        <span className="skill-panel-icon">
          <GroupIcon size={16} />
        </span>
        <h3>{group.category}</h3>
      </div>

      <div className="skill-chip-grid">
        {group.items.map((item, i) => {
          const ItemIcon = item.icon;
          return (
            <div
              className="skill-chip"
              key={item.name}
              style={{
                "--chip-color": item.color,
                transitionDelay: visible ? `${i * 45}ms` : "0ms",
              }}
            >
              <span className="skill-chip-icon">
                <ItemIcon size={15} />
              </span>
              <span>{item.name}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function Skills() {
  return (
    <section className="section skills-section" id="skills">
      <div className="container skills-layout">
        <div className="skills-intro">
          <div className="section-label">03 — Expertise</div>
          <h2 className="skills-heading">
            Tools for turning ideas into real products.
          </h2>
          <p>
            A focused set of technologies and tools I use to build modern web
            applications, integrate secure APIs, and ship cross-platform
            products.
          </p>
        </div>

        <div className="skills-panels">
          {skillGroups.map((group, i) => (
            <SkillGroup group={group} groupIndex={i} key={group.category} />
          ))}
        </div>
      </div>
    </section>
  );
}