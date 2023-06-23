/** @type {import('tailwindcss').Config} */
import withMT from "@material-tailwind/react/utils/withMT";
// export default {
//   content: [],
//   theme: {
//     extend: {},
//   },
//   plugins: [],
// }


export default withMT({
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        blue: {
          50: "#E6F4F8",
          100: "#D9ECF0",
          200: "#96C8D1",
          300: "#5FA6B3",
          400: "#338594",
          500: "#126675",
          600: "#065866",
          700: "#054652",
          800: "#04353D",
          900: "#022329",
        },
        green: {
          50: "#ecfdf5",
          100: "#d1fae5",
          200: "#a7f3d0",
          300: "#6ee7b7",
          400: "#34d399",
          500: "#10b981",
          600: "#059669",
          700: "#047857",
          800: "#065f46",
          900: "#064e3b",
          950: "#022c22",
        },
        red: {
          50: "#ffebee",
          100: "#ffcdd2",
          200: "#ef9a9a",
          300: "#e57373",
          400: "#ef5350",
          500: "#f44336",
          600: "#e53935",
          700: "#d32f2f",
          800: "#c62828",
          900: "#b71c1c",
        }
      },
    },
  },
  plugins: [],
});

