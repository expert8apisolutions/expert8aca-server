"use strict";
"use client";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ThemeSwitcher = void 0;
const react_1 = require("react");
const next_themes_1 = require("next-themes");
const bi_1 = require("react-icons/bi");
const ThemeSwitcher = () => {
    const [mounted, setMounted] = (0, react_1.useState)(false);
    const { theme, setTheme } = (0, next_themes_1.useTheme)();
    (0, react_1.useEffect)(() => {
        setTheme('light');
        setMounted(true);
    }, []);
    if (!mounted) {
        return null;
    }
    return (<div className="flex items-center justify-center mx-4">
      {theme === "light" ? (<bi_1.BiMoon className="cursor-pointer" fill="black" size={25} onClick={() => setTheme("dark")}/>) : (<bi_1.BiSun size={25} className="cursor-pointer text-white" onClick={() => setTheme("light")}/>)}
    </div>);
};
exports.ThemeSwitcher = ThemeSwitcher;
