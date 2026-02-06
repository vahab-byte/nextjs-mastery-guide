import { useEffect, useState } from "react";

const ScrollProgress = () => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPosition = window.scrollY;
      const progressPercent = (scrollPosition / totalHeight) * 100;
      setProgress(progressPercent);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="fixed top-0 left-0 right-0 z-[100] h-1 bg-border/30">
      <div
        className="h-full bg-gradient-to-r from-primary via-secondary to-accent transition-all duration-150 ease-out"
        style={{ width: `${progress}%` }}
      />
      {/* Glow effect */}
      <div
        className="absolute top-0 h-1 w-20 blur-sm bg-primary/50 transition-all duration-150"
        style={{ left: `calc(${progress}% - 40px)` }}
      />
    </div>
  );
};

export default ScrollProgress;
