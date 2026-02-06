import { Code2, Zap, Star, Rocket, Shield, Trophy } from "lucide-react";

const FloatingElements = () => {
  const elements = [
    { Icon: Code2, className: "top-1/4 left-[10%] animate-[float_6s_ease-in-out_infinite]", delay: "0s", color: "text-primary" },
    { Icon: Zap, className: "top-1/3 right-[15%] animate-[float_5s_ease-in-out_infinite]", delay: "1s", color: "text-accent" },
    { Icon: Star, className: "bottom-1/4 left-[20%] animate-[float_7s_ease-in-out_infinite]", delay: "2s", color: "text-secondary" },
    { Icon: Rocket, className: "top-1/2 right-[10%] animate-[float_6s_ease-in-out_infinite]", delay: "0.5s", color: "text-primary" },
    { Icon: Shield, className: "bottom-1/3 right-[25%] animate-[float_5.5s_ease-in-out_infinite]", delay: "1.5s", color: "text-accent" },
    { Icon: Trophy, className: "top-[15%] left-[30%] animate-[float_6.5s_ease-in-out_infinite]", delay: "2.5s", color: "text-secondary" },
  ];

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {elements.map((element, i) => (
        <div
          key={i}
          className={`absolute ${element.className} opacity-10`}
          style={{ animationDelay: element.delay }}
        >
          <element.Icon className={`h-8 w-8 ${element.color}`} />
        </div>
      ))}
    </div>
  );
};

export default FloatingElements;
