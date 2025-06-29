"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config = {
    content: [
        "./node_modules/flowbite-react/**/*.js",
        './pages/**/*.{js,ts,jsx,tsx,mdx}',
        './components/**/*.{js,ts,jsx,tsx,mdx}',
        './app/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    darkMode: ["class"],
    theme: {
        extend: {
            fontFamily: {
                Poppins: ["var(--font-Poppins)"],
                Josefin: ["var(--font-Josefin)"],
            },
            backgroundImage: {
                'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
                'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
            },
            screens: {
                "1000px": "1000px",
                "1100px": "1100px",
                "1200px": "1200px",
                "1300px": "1300px",
                "1500px": "1500px",
                "800px": "800px",
                "400px": "400px",
            }
        },
    },
    plugins: [
        require("flowbite/plugin")
    ],
};
exports.default = config;
