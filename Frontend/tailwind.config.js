/** @type {import('tailwindcss').Config} */
export default {
  // This tells Tailwind exactly where to look for your CSS classes
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  // This loads the DaisyUI plugin properly
  plugins: [require("daisyui")],
  
  // This configures DaisyUI to use your specific themes
  daisyui: {
    themes: ["light", "dark"], // Includes both themes
    darkTheme: "dark",         // Sets the default dark theme
    base: true,                // Applies background color and foreground color for root
    styled: true,              // Includes daisyUI colors and design decisions
    utils: true,               // Adds responsive and modifier utility classes
  },
}