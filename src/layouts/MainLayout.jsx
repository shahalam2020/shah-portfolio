import { useLocation, useOutlet } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ScrollToTop from '../components/ScrollToTop';
import ScrollProgress from '../components/ScrollProgress';
import AmbientBackground from '../components/AmbientBackground';
import PageTransition from '../components/PageTransition';

export default function MainLayout() {
  const location = useLocation();
  const outlet = useOutlet();
  return (
    <>
      <a href="#main" className="sr-only z-[100] rounded-xl bg-primary px-4 py-2 font-semibold text-bg focus:not-sr-only focus:fixed focus:left-4 focus:top-4">
        Skip to content
      </a>
      <AmbientBackground />
      <ScrollProgress />
      <Navbar />
      <ScrollToTop />
      <main id="main">
        <AnimatePresence mode="wait" initial={false}>
          <PageTransition key={location.pathname}>
            {outlet}
          </PageTransition>
        </AnimatePresence>
      </main>
      <Footer />
    </>
  );
}
