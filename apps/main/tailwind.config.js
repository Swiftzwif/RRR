/** @type {import('tailwindcss').Config} */
import sharedConfig from '@trajectory/theme/tailwind.config.js';

export default {
  ...sharedConfig,
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}"],
};
