import { useEffect, useState } from "react";
import "@/App.css";
import LeftNav from "./components/LeftNav";
import Hero from "./components/Hero";
import MusicPlayer from "./components/MusicPlayer";

function App() {
    const [active, setActive] = useState("work");

    useEffect(() => {
        // Track active section based on hash or scroll (single-page site, mostly hero)
        const onHash = () => setActive((window.location.hash || "#work").slice(1));
        window.addEventListener("hashchange", onHash);
        return () => window.removeEventListener("hashchange", onHash);
    }, []);

    return (
        <div className="App relative" data-testid="app-root">
            <LeftNav activeSection={active} />
            <main className="relative z-10">
                <Hero />
            </main>
            <MusicPlayer />
        </div>
    );
}

export default App;
