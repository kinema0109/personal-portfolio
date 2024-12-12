import Navbar from "./components/Navbar"
import LocomotiveScroll from 'locomotive-scroll';
import { Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage";
import ProjectPage from "./pages/ProjectPage";
import BlogPage from "./pages/BlogPage";
import { AboutsPage } from "./pages/AboutPage";
import { ContactPage } from "./pages/ContactPage";
import ProjectDetails from "./pages/ProjectDetails";
import BlogDetails from "./pages/BlogDetails";
import { ResumeActions } from "./components/common/ResumeActions";
import { useEffect, useState } from "react";
import HobbyPage from "./pages/HobbyPage";
export default function App() {

  useEffect(() => {
    const scroll = new LocomotiveScroll({
      el: document.querySelector("[data-scroll-container]"),
      smooth: true,
    });

    return () => scroll.destroy();
  }, []);
  const [activeSection, setActiveSection] = useState('');
  return (
    <>
      <Navbar activeSection={activeSection} />
      <Routes>
        <Route path="/" element={<HomePage setActiveSection={setActiveSection} />} />
        <Route path="/projects" element={<ProjectPage />} />
        <Route path="/projects/:slug" element={<ProjectDetails />} />
        {/* <Route path="/blogs" element={<BlogPage />} /> */}
        {/* <Route path="/blogs/:slug" element={<BlogDetails />} /> */}
        <Route path="/about" element={<AboutsPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/hobby" emement={<HobbyPage />} />
      </Routes>
      {/* <ResumeActions /> */}
    </>
  )
}