import { motion } from 'framer-motion';
import SectionHeading from '../components/SectionHeading';
import TiltCard from '../components/TiltCard';
import { services } from '../data/services';
import { lucideIcons } from '../utils/iconMap';
import { staggerContainer, staggerItem } from '../utils/motion';

export default function Services() {
  return (
    <section id="services" aria-labelledby="services-title" className="section">
      <div className="container-x">
        <SectionHeading
          id="services-title"
          eyebrow="What I do"
          title="Everything a product needs, from one developer."
          subtitle="Pick a single piece or hand me the whole stack."
        />
        <motion.ul
          variants={staggerContainer(0.07)}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.1 }}
          className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4"
        >
          {services.map((s) => {
            const Icon = lucideIcons[s.icon];
            return (
              <motion.li key={s.n} variants={staggerItem}>
                <TiltCard className="card beam group h-full p-6" max={7}>
                  <div className="flex items-center justify-between">
                    <span className="grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 text-primary-ink transition duration-500 group-hover:scale-110 group-hover:rotate-6">
                      <Icon size={22} aria-hidden="true" />
                    </span>
                    <span className="font-mono text-sm text-muted">{s.n}</span>
                  </div>
                  <h3 className="mt-6 text-lg font-semibold leading-snug">{s.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted">{s.text}</p>
                </TiltCard>
              </motion.li>
            );
          })}
        </motion.ul>
      </div>
    </section>
  );
}
