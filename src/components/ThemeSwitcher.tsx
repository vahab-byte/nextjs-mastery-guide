import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Palette, Moon, Sun, Monitor, Check } from "lucide-react";

interface ColorTheme {
    id: string;
    name: string;
    color: string;
}

const colorThemes: ColorTheme[] = [
    { id: "purple", name: "Purple", color: "hsl(263, 70%, 50%)" },
    { id: "blue", name: "Blue Ocean", color: "hsl(210, 100%, 50%)" },
    { id: "green", name: "Forest", color: "hsl(142, 70%, 45%)" },
    { id: "rose", name: "Rose Pink", color: "hsl(340, 82%, 52%)" },
    { id: "orange", name: "Sunset", color: "hsl(25, 95%, 53%)" },
    { id: "cyber", name: "Cyber Neon", color: "hsl(280, 100%, 60%)" },
    { id: "midnight", name: "Midnight", color: "hsl(230, 80%, 55%)" },
    { id: "custom", name: "Custom", color: "linear-gradient(45deg, red, orange, yellow, green, blue, indigo, violet)" },
];

// Helper to convert Hex to HSL
const hexToHSL = (hex: string) => {
    let r = "0", g = "0", b = "0";
    if (hex.length === 4) {
        r = "0x" + hex[1] + hex[1];
        g = "0x" + hex[2] + hex[2];
        b = "0x" + hex[3] + hex[3];
    } else if (hex.length === 7) {
        r = "0x" + hex[1] + hex[2];
        g = "0x" + hex[3] + hex[4];
        b = "0x" + hex[5] + hex[6];
    }

    // Cast to number using unary plus operator which parses hex strings with 0x prefix
    const rNum = +r / 255;
    const gNum = +g / 255;
    const bNum = +b / 255;

    // Validate numbers
    if (isNaN(rNum) || isNaN(gNum) || isNaN(bNum)) {
        return "263 70% 50%"; // Fallback to purple
    }

    // Validate numbers
    if (isNaN(rNum) || isNaN(gNum) || isNaN(bNum)) {
        return "263 70% 50%"; // Fallback to purple
    }

    let cmin = Math.min(rNum, gNum, bNum),
        cmax = Math.max(rNum, gNum, bNum),
        delta = cmax - cmin,
        h = 0,
        s = 0,
        l = 0;

    if (delta === 0) h = 0;
    else if (cmax === rNum) h = ((gNum - bNum) / delta) % 6;
    else if (cmax === gNum) h = (bNum - rNum) / delta + 2;
    else h = (rNum - gNum) / delta + 4;

    h = Math.round(h * 60);
    if (h < 0) h += 360;

    l = (cmax + cmin) / 2;
    s = delta === 0 ? 0 : delta / (1 - Math.abs(2 * l - 1));
    s = +(s * 100).toFixed(1);
    l = +(l * 100).toFixed(1);

    // Final NaN check
    if (isNaN(h) || isNaN(s) || isNaN(l)) return "263 70% 50%";

    // Final NaN check
    if (isNaN(h) || isNaN(s) || isNaN(l)) return "263 70% 50%";

    return `${h} ${s}% ${l}%`;
};

const ThemeSwitcher = () => {
    const { theme, setTheme } = useTheme();
    const [colorTheme, setColorTheme] = useState("purple");
    const [customColor, setCustomColor] = useState("#8b5cf6"); // Default custom
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        // Load saved settings
        const savedTheme = localStorage.getItem("color-theme");
        const savedCustomColor = localStorage.getItem("custom-color-hex");

        if (savedCustomColor) setCustomColor(savedCustomColor);

        if (savedTheme) {
            setColorTheme(savedTheme);
            if (savedTheme === "custom" && savedCustomColor) {
                applyCustomTheme(savedCustomColor);
            } else if (savedTheme !== "purple") {
                document.documentElement.setAttribute("data-theme", savedTheme);
            }
        }
    }, []);

    const applyCustomTheme = (hex: string) => {
        const hsl = hexToHSL(hex);
        const root = document.documentElement;

        root.setAttribute("data-theme", "custom");
        root.style.setProperty("--primary", hsl);
        root.style.setProperty("--primary-foreground", "0 0% 100%"); // Keep white text
        root.style.setProperty("--ring", hsl);
        // Approximation for glow (ligher/more saturated)
        root.style.setProperty("--primary-glow", hsl.replace(/(\d+)%$/, "65%"));
    };

    const handleColorChange = (themeId: string) => {
        setColorTheme(themeId);
        localStorage.setItem("color-theme", themeId);

        const root = document.documentElement;

        if (themeId === "custom") {
            applyCustomTheme(customColor);
        } else {
            // Reset inline styles
            root.style.removeProperty("--primary");
            root.style.removeProperty("--primary-foreground");
            root.style.removeProperty("--ring");
            root.style.removeProperty("--primary-glow");

            if (themeId === "purple") {
                root.removeAttribute("data-theme");
            } else {
                root.setAttribute("data-theme", themeId);
            }
        }
    };

    const handleCustomColorInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        const hex = e.target.value;
        setCustomColor(hex);
        localStorage.setItem("custom-color-hex", hex);
        if (colorTheme === "custom") {
            applyCustomTheme(hex);
        }
    };

    if (!mounted) return null;

    const currentColorObj = colorThemes.find(t => t.id === colorTheme);

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="relative">
                    <Palette className="h-5 w-5" />
                    <span
                        className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-background"
                        style={{
                            background: colorTheme === 'custom' ? customColor : currentColorObj?.color
                        }}
                    />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-64">
                <DropdownMenuLabel className="flex items-center gap-2">
                    <Palette className="h-4 w-4" /> Appearance
                </DropdownMenuLabel>
                <DropdownMenuSeparator />

                {/* Light/Dark Mode */}
                <DropdownMenuLabel className="text-xs text-muted-foreground font-normal">
                    Mode
                </DropdownMenuLabel>
                <div className="grid grid-cols-3 gap-1 p-1">
                    <Button
                        variant={theme === "light" ? "secondary" : "ghost"}
                        size="sm"
                        onClick={() => setTheme("light")}
                        className="flex flex-col h-auto py-2"
                    >
                        <Sun className="h-4 w-4 mb-1" />
                        <span className="text-xs">Light</span>
                    </Button>
                    <Button
                        variant={theme === "dark" ? "secondary" : "ghost"}
                        size="sm"
                        onClick={() => setTheme("dark")}
                        className="flex flex-col h-auto py-2"
                    >
                        <Moon className="h-4 w-4 mb-1" />
                        <span className="text-xs">Dark</span>
                    </Button>
                    <Button
                        variant={theme === "system" ? "secondary" : "ghost"}
                        size="sm"
                        onClick={() => setTheme("system")}
                        className="flex flex-col h-auto py-2"
                    >
                        <Monitor className="h-4 w-4 mb-1" />
                        <span className="text-xs">Auto</span>
                    </Button>
                </div>

                <DropdownMenuSeparator />

                {/* Color Themes */}
                <DropdownMenuLabel className="text-xs text-muted-foreground font-normal">
                    Color Theme
                </DropdownMenuLabel>
                <div className="grid grid-cols-4 gap-2 p-2">
                    {colorThemes.map((t) => {
                        if (t.id === 'custom') {
                            return (
                                <div
                                    key={t.id}
                                    className="group relative flex flex-col items-center gap-1 cursor-pointer"
                                    title={t.name}
                                    onClick={() => handleColorChange('custom')}
                                >
                                    <div
                                        className={`w-8 h-8 rounded-full transition-all border-2 overflow-hidden flex items-center justify-center relative ${colorTheme === t.id
                                            ? "border-foreground scale-110"
                                            : "border-transparent hover:scale-105"
                                            }`}
                                        style={{ background: t.color }}
                                    >
                                        <input
                                            type="color"
                                            value={customColor}
                                            onChange={handleCustomColorInput}
                                            className="opacity-0 absolute inset-0 w-full h-full cursor-pointer z-10"
                                            onClick={(e) => {
                                                // Ensure the color picker opens
                                                e.stopPropagation();
                                                handleColorChange('custom');
                                            }}
                                        />
                                        {colorTheme === t.id && (
                                            <Check className="h-4 w-4 text-white drop-shadow-md pointer-events-none" />
                                        )}
                                    </div>
                                    <span className="text-[10px] text-muted-foreground group-hover:text-foreground truncate w-full text-center">
                                        {t.name.split(" ")[0]}
                                    </span>
                                </div>
                            );
                        }

                        return (
                            <button
                                key={t.id}
                                onClick={() => handleColorChange(t.id)}
                                className="group relative flex flex-col items-center gap-1"
                                title={t.name}
                            >
                                <div
                                    className={`w-8 h-8 rounded-full transition-all border-2 overflow-hidden flex items-center justify-center ${colorTheme === t.id
                                        ? "border-foreground scale-110"
                                        : "border-transparent hover:scale-105"
                                        }`}
                                    style={{ background: t.color }}
                                >
                                    {colorTheme === t.id && (
                                        <Check className="h-4 w-4 text-white drop-shadow-md" />
                                    )}
                                </div>
                                <span className="text-[10px] text-muted-foreground group-hover:text-foreground truncate w-full text-center">
                                    {t.name.split(" ")[0]}
                                </span>
                            </button>
                        );
                    })}
                </div>
            </DropdownMenuContent>
        </DropdownMenu>
    );
};

export default ThemeSwitcher;
