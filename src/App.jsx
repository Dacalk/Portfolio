import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Achievements from './components/Achievements';
import AchievementsPage from './components/AchievementsPage';
import About from './components/About';
import Experience from './components/Experience';
import Projects from './components/Projects';
import Contact from './components/Contact';
import Footer from './components/Footer';
import Services from './components/Services';
import Marquee from './components/Marquee';
import Education from './components/Education';

export default function App() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [preloaderActive, setPreloaderActive] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState('home');

  useEffect(() => {
    // Simulating static backend fetch call
    fetch('/portfolio.json')
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to fetch portfolio data');
        }
        return response.json();
      })
      .then((jsonData) => {
        setData(jsonData);
        // Artificial delay of 1.5s to let the progress bar fill completely
        setTimeout(() => {
          setLoading(false); // starts main page entrance animations & starts preloader fade-out
          setTimeout(() => {
            setPreloaderActive(false); // unmount preloader after fade-out transition finishes
          }, 600);
        }, 1500);
      })
      .catch((err) => {
        console.error(err);
        setError(err.message);
        setLoading(false);
        setPreloaderActive(false);
      });
  }, []);

  // Hash-based simple router for separate achievements/news page
  useEffect(() => {
    const handleHashChange = () => {
      if (window.location.hash === '#all-achievements') {
        setCurrentPage('achievements');
        window.scrollTo({ top: 0, behavior: 'instant' });
      } else {
        setCurrentPage('home');
      }
    };

    handleHashChange(); // Check hash on load
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  useEffect(() => {
    if (loading || currentPage !== 'home') return;

    const observerOptions = {
      root: null,
      rootMargin: '0px',
      threshold: 0.12,
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    const timeoutId = setTimeout(() => {
      const revealElements = document.querySelectorAll('.reveal');
      revealElements.forEach((el) => observer.observe(el));
    }, 150);

    return () => {
      clearTimeout(timeoutId);
      const revealElements = document.querySelectorAll('.reveal');
      revealElements.forEach((el) => observer.unobserve(el));
    };
  }, [loading, currentPage]);

  if (error) {
    return (
      <div className="error-fallback">
        <h2>Something went wrong</h2>
        <p>{error}</p>
        <button className="btn btn-primary" onClick={() => window.location.reload()}>
          Retry
        </button>
      </div>
    );
  }

  if (!data) {
    return (
      <div id="preloader">
        <div className="progress-container">
          <div className="progress-bar-fill"></div>
        </div>
      </div>
    );
  }

  return (
    <div className={`app-wrapper ${!loading ? 'page-loaded' : ''}`}>
      {preloaderActive && (
        <div id="preloader" className={!loading ? 'fade-out' : ''}>
          <div className="progress-container">
            <div className="progress-bar-fill"></div>
          </div>
        </div>
      )}
      <Navbar profile={data.profile} />
      
      {currentPage === 'home' ? (
        <main className="over-hidden">
          <Hero profile={data.profile} />
          <Marquee />
          <About profile={data.profile} experienceCards={data.experienceCards} />
          <Services services={data.services} />
          <Experience skills={data.skills} />
          <Education />
          <Projects projects={data.projects} />
          <Achievements achievements={data.achievements} onSeeMore={() => window.location.hash = '#all-achievements'} />
          <Contact contact={data.contact} />
        </main>
      ) : (
        <main className="over-hidden achievements-page-wrapper">
          <AchievementsPage achievements={data.achievements} onBack={() => window.location.hash = '#achievements'} />
        </main>
      )}

      <Footer name={data.profile.name} />
    </div>
  );
}
