/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Enhanced Sky-Inspired Base Colors with better contrast
        sky: {
          50: "#F0F9FF",   // Lightest - for subtle backgrounds
          100: "#E0F2FE",  // Very light - for card backgrounds
          200: "#BAE6FD",  // Light - for borders and dividers
          300: "#7DD3FC",  // Medium light - for secondary text
          400: "#38BDF8",  // Medium - for accents
          500: "#0EA5E9",  // Primary - for main actions
          600: "#0284C7",  // Primary dark - for hover states
          700: "#0369A1",  // Dark - for headings
          800: "#075985",  // Darker - for strong contrast
          900: "#0C4A6E",  // Darkest - for maximum contrast
        },
        // Enhanced Gold Colors with better contrast ratios
        gold: {
          50: "#FFFBEB",   // Lightest - for subtle backgrounds
          100: "#FEF3C7",  // Very light - for card backgrounds
          200: "#FDE68A",  // Light - for borders
          300: "#FCD34D",  // Medium light - for secondary text
          400: "#F59E0B",  // Medium - for accents
          500: "#D97706",  // Primary - for main actions
          600: "#B45309",  // Primary dark - for hover states
          700: "#92400E",  // Dark - for headings
          800: "#78350F",  // Darker - for strong contrast
          900: "#451A03",  // Darkest - for maximum contrast
        },
        // Enhanced gradient colors with better contrast
        gradient: {
          blue: "#0EA5E9",
          purple: "#8B5CF6",
          orange: "#F59E0B",
          green: "#10B981",
          indigo: "#6366F1",
          rose: "#F43F5E",
        },
        // Enhanced trajectory colors
        trajectory: {
          black: "#000000",
          "black-soft": "#0A0A0A",
          "black-card": "#111111",
          "black-deep": "#1A1A1A",
        },
        // Sunset/orange colors for CTAs and gradients
        sunset: {
          DEFAULT: "#F97316", // Orange-500
          light: "#FB923C",   // Orange-400
          dark: "#EA580C",    // Orange-600
        },
        // Enhanced status colors with better contrast
        success: "#059669",  // Darker green for better contrast
        warn: "#D97706",     // Darker orange for better contrast
        danger: "#DC2626",   // Darker red for better contrast
        info: "#0284C7",     // Sky blue for info
      },
      fontFamily: {
        display: ["var(--font-display)", "ui-sans-serif", "system-ui"],
        body: ["var(--font-body)", "ui-sans-serif", "system-ui"],
      },
      boxShadow: {
        soft: "0 10px 30px -10px rgba(0,0,0,.4)",
        strata: "0 4px 20px -4px rgba(56, 189, 248, 0.15)",
        glow: "0 0 20px rgba(14, 165, 233, 0.3)",
        "glow-orange": "0 0 20px rgba(245, 158, 11, 0.3)",
      },
      borderRadius: {
        xl2: "1.25rem",
      },
      animation: {
        "strata-float": "strata-float 6s ease-in-out infinite",
        "meter-fill": "meter-fill 1.2s cubic-bezier(.22,.61,.36,1) forwards",
        "fade-slide-up": "fade-slide-up 0.45s cubic-bezier(.22,.61,.36,1) forwards",
        stagger: "stagger 0.2s ease-out forwards",
        "fade-in": "fade-in 0.5s ease-out",
        "float": "float 3s ease-in-out infinite",
        "pulse-slow": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
      },
      keyframes: {
        "strata-float": {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-8px)" },
        },
        "meter-fill": {
          "0%": { width: "0%" },
          "100%": { width: "var(--fill-width)" },
        },
        "fade-slide-up": {
          "0%": { opacity: "0", transform: "translateY(12px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        stagger: {
          "0%": { opacity: "0", transform: "translateY(8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "fade-in": {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" },
        },
      },
    },
  },
  plugins: [],
};
