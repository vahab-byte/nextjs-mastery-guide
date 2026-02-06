import { useEffect, useState, useCallback } from "react";

const AnimatedCursor = () => {
  const [position, setPosition] = useState({ x: -100, y: -100 });
  const [dotPosition, setDotPosition] = useState({ x: -100, y: -100 });
  const [isPointer, setIsPointer] = useState(false);
  const [isClicking, setIsClicking] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [hue, setHue] = useState(0);

  // Color rotation for rainbow effect
  useEffect(() => {
    const interval = setInterval(() => {
      setHue(prev => (prev + 1) % 360);
    }, 50);
    return () => clearInterval(interval);
  }, []);

  const onMouseMove = useCallback((e: MouseEvent) => {
    setPosition({ x: e.clientX, y: e.clientY });
    setIsVisible(true);

    const target = e.target as HTMLElement;
    const isClickable =
      target.tagName === "BUTTON" ||
      target.tagName === "A" ||
      !!target.closest("button") ||
      !!target.closest("a") ||
      !!target.closest("[role='button']") ||
      getComputedStyle(target).cursor === "pointer";
    setIsPointer(isClickable);
  }, []);

  const onMouseDown = useCallback(() => {
    setIsClicking(true);
  }, []);

  const onMouseUp = useCallback(() => {
    setIsClicking(false);
  }, []);

  const onMouseLeave = useCallback(() => {
    setIsVisible(false);
  }, []);

  const onMouseEnter = useCallback(() => {
    setIsVisible(true);
  }, []);

  // Smooth dot following with spring effect
  useEffect(() => {
    let animationFrame: number;
    const animate = () => {
      setDotPosition(prev => ({
        x: prev.x + (position.x - prev.x) * 0.15,
        y: prev.y + (position.y - prev.y) * 0.15,
      }));
      animationFrame = requestAnimationFrame(animate);
    };
    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [position]);

  useEffect(() => {
    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mousedown", onMouseDown);
    document.addEventListener("mouseup", onMouseUp);
    document.addEventListener("mouseleave", onMouseLeave);
    document.addEventListener("mouseenter", onMouseEnter);

    document.body.style.cursor = "none";
    const style = document.createElement("style");
    style.id = "cursor-hide";
    style.textContent = "*, *::before, *::after { cursor: none !important; }";
    document.head.appendChild(style);

    return () => {
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mousedown", onMouseDown);
      document.removeEventListener("mouseup", onMouseUp);
      document.removeEventListener("mouseleave", onMouseLeave);
      document.removeEventListener("mouseenter", onMouseEnter);
      document.body.style.cursor = "auto";
      document.getElementById("cursor-hide")?.remove();
    };
  }, [onMouseMove, onMouseDown, onMouseUp, onMouseLeave, onMouseEnter]);

  // Don't show on mobile/touch devices
  if (typeof window !== "undefined" && window.matchMedia("(pointer: coarse)").matches) {
    return null;
  }

  return (
    <>
      {/* Main cursor dot - follows mouse instantly */}
      <div
        className="pointer-events-none fixed z-[9999] mix-blend-difference"
        style={{
          left: position.x,
          top: position.y,
          transform: "translate(-50%, -50%)",
          opacity: isVisible ? 1 : 0,
          transition: "opacity 0.3s ease, transform 0.1s ease",
          willChange: "transform, opacity",
        }}
      >
        <div
          className="rounded-full bg-white"
          style={{
            width: isClicking ? "6px" : isPointer ? "6px" : "8px",
            height: isClicking ? "6px" : isPointer ? "6px" : "8px",
            transition: "width 0.2s ease, height 0.2s ease",
            willChange: "width, height",
          }}
        />
      </div>

      {/* Outer ring - follows with spring delay */}
      <div
        className="pointer-events-none fixed z-[9998]"
        style={{
          left: dotPosition.x,
          top: dotPosition.y,
          transform: "translate(-50%, -50%)",
          opacity: isVisible ? 1 : 0,
          transition: "opacity 0.3s ease",
          willChange: "transform, opacity",
        }}
      >
        <div
          className="rounded-full"
          style={{
            width: isPointer ? "50px" : isClicking ? "28px" : "36px",
            height: isPointer ? "50px" : isClicking ? "28px" : "36px",
            border: `2px solid`,
            borderColor: `hsl(${hue}, 80%, 60%)`,
            backgroundColor: isPointer ? `hsla(${hue}, 80%, 60%, 0.1)` : "transparent",
            transition: "width 0.3s cubic-bezier(0.4, 0, 0.2, 1), height 0.3s cubic-bezier(0.4, 0, 0.2, 1), border-color 0.1s ease, background-color 0.3s ease",
            boxShadow: isPointer
              ? `0 0 20px hsla(${hue}, 80%, 60%, 0.4), 0 0 40px hsla(${hue}, 80%, 60%, 0.2)`
              : `0 0 10px hsla(${hue}, 80%, 60%, 0.3)`,
          }}
        />
      </div>

      {/* Hover glow effect */}
      {isPointer && isVisible && (
        <div
          className="pointer-events-none fixed z-[9996] rounded-full blur-xl"
          style={{
            left: dotPosition.x,
            top: dotPosition.y,
            transform: "translate(-50%, -50%)",
            width: "70px",
            height: "70px",
            backgroundColor: `hsla(${hue}, 80%, 60%, 0.25)`,
            animation: "cursorPulse 1.5s ease-in-out infinite",
            willChange: "transform, opacity",
          }}
        />
      )}

      {/* Click ripple effect */}
      {isClicking && (
        <div
          className="pointer-events-none fixed z-[9995]"
          style={{
            left: position.x,
            top: position.y,
            transform: "translate(-50%, -50%)",
            willChange: "transform, opacity",
          }}
        >
          <div
            className="rounded-full"
            style={{
              width: "60px",
              height: "60px",
              border: `2px solid hsla(${hue}, 80%, 60%, 0.6)`,
              animation: "cursorRipple 0.6s ease-out forwards",
            }}
          />
        </div>
      )}

      {/* Decorative spinning dots on hover */}
      {isPointer && isVisible && (
        <>
          {[0, 1, 2, 3].map((i) => (
            <div
              key={i}
              className="pointer-events-none fixed z-[9997]"
              style={{
                left: dotPosition.x,
                top: dotPosition.y,
                transform: "translate(-50%, -50%)",
                animation: `cursorOrbit 2s linear infinite`,
                animationDelay: `${i * 0.5}s`,
              }}
            >
              <div
                className="rounded-full"
                style={{
                  width: "4px",
                  height: "4px",
                  backgroundColor: `hsl(${(hue + i * 90) % 360}, 80%, 60%)`,
                  transform: "translateX(30px)",
                  boxShadow: `0 0 8px hsla(${(hue + i * 90) % 360}, 80%, 60%, 0.8)`,
                }}
              />
            </div>
          ))}
        </>
      )}

      <style>{`
        @keyframes cursorPulse {
          0%, 100% {
            opacity: 0.25;
            transform: translate(-50%, -50%) scale(1);
          }
          50% {
            opacity: 0.4;
            transform: translate(-50%, -50%) scale(1.15);
          }
        }

        @keyframes cursorRipple {
          0% {
            opacity: 1;
            transform: scale(0.5);
          }
          100% {
            opacity: 0;
            transform: scale(1.5);
          }
        }

        @keyframes cursorOrbit {
          from {
            transform: translate(-50%, -50%) rotate(0deg);
          }
          to {
            transform: translate(-50%, -50%) rotate(360deg);
          }
        }
      `}</style>
    </>
  );
};

export default AnimatedCursor;
