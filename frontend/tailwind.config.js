/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
    //   fontFamily: {
    //     'blood-cursive': ['"Rubik Glitch"', '"Kaushan Script"', 'cursive'], // Glitchy + cursive
    //   },
    //   animation: {
    //     'flicker': 'flicker 3s infinite alternate',
    //     'blood-drip': 'bloodDrip 2s infinite',
    //   },
    //   keyframes: {
    //     flicker: {
    //       '0%, 100%': { opacity: '1' },
    //       '50%': { opacity: '0.7' },
    //     },
    //     float: {
    //       '0%, 100%': { transform: 'translateY(0)' },
    //       '50%': { transform: 'translateY(-10px)' },
    //     },
    //     bloodDrip: {
    //       '0%': { transform: 'translateY(-5px)', opacity: '0' },
    //       '50%': { opacity: '0.7' },
    //       '100%': { transform: 'translateY(5px)', opacity: '0' },
    //     },
    //   },
    //   boxShadow: {
    //     'katana': '0 0 10px #ff0000, 0 0 20px #ff0000, 0 0 30px #ff0000',
    //   },
    },
  },
  plugins: [
    // require('tailwindcss-textshadow')
  ],
}

