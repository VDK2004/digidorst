/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#7A4E3F',
          light: '#7D5344',
          dark: '#5C442F',
        },
        secondary: {
          DEFAULT: '#E8D78F',
          light: '#E6D58C',
          dark: '#978E64',
        },
      },
    },
  },
  plugins: [],
};