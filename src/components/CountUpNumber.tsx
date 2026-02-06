import { useEffect, useState, useRef } from "react";

interface CountUpNumberProps {
  value: string;
  duration?: number;
}

const CountUpNumber = ({ value, duration = 2000 }: CountUpNumberProps) => {
  const [displayValue, setDisplayValue] = useState("0");
  const elementRef = useRef<HTMLSpanElement>(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true;
          animateValue();
        }
      },
      { threshold: 0.1 }
    );

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const animateValue = () => {
    // Extract number and suffix from value (e.g., "50,000+" -> 50000, "+")
    const numericString = value.replace(/[^0-9.]/g, "");
    const targetNum = parseFloat(numericString);
    const suffix = value.replace(/[0-9.,]/g, "");
    const hasCommas = value.includes(",");
    
    if (isNaN(targetNum)) {
      setDisplayValue(value);
      return;
    }

    const startTime = performance.now();
    const isDecimal = value.includes(".");

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Easing function - ease out cubic
      const easeOut = 1 - Math.pow(1 - progress, 3);
      
      const currentValue = targetNum * easeOut;
      
      let formatted: string;
      if (isDecimal) {
        formatted = currentValue.toFixed(1);
      } else if (hasCommas) {
        formatted = Math.floor(currentValue).toLocaleString();
      } else {
        formatted = Math.floor(currentValue).toString();
      }
      
      setDisplayValue(formatted + suffix);

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  };

  return <span ref={elementRef}>{displayValue}</span>;
};

export default CountUpNumber;
