import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, useLocation, Navigate, Link } from "react-router-dom";
import "@/App.css";
import LeftNav from "./components/LeftNav";
import Hero from "./components/Hero";
import MusicPlayer from "./components/MusicPlayer";
import SectionPage from "./pages/SectionPage";
import ServicePage from "./pages/ServicePage";
import ContactPage from "./pages/ContactPage";

function Shell() {
    const location = useLocation();
    const [active, setActive] = useState("work");

    useEffect(() => {
        // Derive active section from path. / -> none, /services/... -> gear, /<slug> -> slug
        const path = location.pathname;
        if (path === "/" || path === "") {
            setActive("");
        } else if (path.startsWith("/services")) {
            setActive("gear");
        } else {
            setActive(path.replace(/^\//, "").split("/")[0]);
        }
        window.scrollTo(0, 0);
    }, [location]);

    return (
        <div className="App relative" data-testid="app-root">
            {/* Global top-left logo (clickable home link) — same row as availability badge */}
            <Link
                to="/"
                data-testid="nav-logo"
                aria-label="Home"
                className="fixed top-5 left-5 md:left-7 z-40 select-none nav-logo-link"
            >
                <img
                    src="/logo.png"
                    alt="Wonji"
                    width="104"
                    height="60"
                    className="logo-img"
                    draggable="false"
                />
            </Link>
            <LeftNav activeSection={active} />
            <main className="relative z-10">
                <Routes>
                    <Route path="/" element={<Hero />} />
                    <Route path="/work" element={<Navigate to="/music" replace />} />
                    <Route path="/contact" element={<ContactPage />} />
                    <Route path="/:slug" element={<SectionPage />} />
                    <Route path="/services/:slug" element={<ServicePage />} />
                </Routes>
            </main>
            <MusicPlayer />
        </div>
    );
}

function App() {
    return (
        <BrowserRouter>
            <Shell />
        </BrowserRouter>
    );
}

export default App;
