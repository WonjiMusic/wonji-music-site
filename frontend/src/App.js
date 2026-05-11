import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, useLocation, Navigate } from "react-router-dom";
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
