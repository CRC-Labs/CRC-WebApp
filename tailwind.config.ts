export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx}",
    "./src/features/**/*.{js,ts,jsx,tsx}",
    "./src/utils/**/*.{js,ts,jsx,tsx}",
    "./src/types/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    screens: {
      xs: "var(--screen-xs)",
      sm: "var(--screen-sm)"
    },
    fontFamily: {
      sans: ["Inter", "sans-serif"]
    },
    extend: {
      backgroundColor: {
        body: "var(--color-body)"
      },
      // width: {
      //   99: "var(--width-main)"
      // },
      animation: {
        'drawer-right': 'drawer-right 0.3s',
        'text': 'text 5s ease-in-out infinite alternate' // Changed this line
      },
      keyframes: {
        text: {
          '0%, 100%': { 
            'background-size': '200% 200%',
            'background-position': 'left center' 
          },
          '50%': { 
            'background-size': '200% 200%',
            'background-position': 'right center' 
          }
        }
      }
    }
  },
  plugins: [
    require("@tailwindcss/typography")
  ]
}
