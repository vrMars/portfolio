import React, { useState, createContext } from 'react';
import { Navbar } from './components/Navbar';
import { Header } from './components/Header';
import { About } from './components/About';
import { Projects } from './components/Projects';
import { Photography } from './components/Photography';
import { Blog } from './components/Blog';
import { Resume } from './components/Resume';
import { Footer } from './components/Footer';
import { BackgroundManager } from './components/BackgroundManager';
import { ScrollToTopButton } from './components/ScrollToTopButton';

// Create a context to provide the setActiveSection function down the component tree
// without prop drilling.
export const ActiveSectionContext = createContext<(id: string) => void>(() => {});

function App() {
  const [activeSection, setActiveSection] = useState('header');

  return (
    <div className="bg-transparent">
      <BackgroundManager activeSection={activeSection} />
      <Navbar />
      <ActiveSectionContext.Provider value={setActiveSection}>
        <main>
          <Header />
          <About />
          <Projects />
          <Photography />
          <Blog />
          <Resume />
        </main>
      </ActiveSectionContext.Provider>
      <Footer />
      <ScrollToTopButton />
    </div>
  );
}

export default App;