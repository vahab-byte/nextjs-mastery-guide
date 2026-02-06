import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const ScrollToTop = () => {
    const { pathname } = useLocation();

    useEffect(() => {
        // Scroll to top immediately when route changes
        window.scrollTo({ top: 0, left: 0, behavior: "instant" });

        // Also scroll after a small delay to handle async content loading
        const timeoutId = setTimeout(() => {
            window.scrollTo({ top: 0, left: 0, behavior: "instant" });
        }, 50);

        return () => clearTimeout(timeoutId);
    }, [pathname]);

    return null;
};

export default ScrollToTop;
