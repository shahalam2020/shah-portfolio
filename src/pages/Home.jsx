import Hero from '../sections/Hero';
import About from '../sections/About';
import Skills from '../sections/Skills';
import Projects from '../sections/Projects';
import Experience from '../sections/Experience';
import Services from '../sections/Services';
import GitHubActivity from '../sections/GitHubActivity';
import Resume from '../sections/Resume';
import Contact from '../sections/Contact';
import useSEO from '../hooks/useSEO';

export default function Home() {
  useSEO({ path: '/' });
  return (
    <>
      <Hero />
      <About />
      <Skills />
      <Projects />
      <Experience />
      <Services />
      <GitHubActivity />
      <Resume />
      <Contact />
    </>
  );
}
