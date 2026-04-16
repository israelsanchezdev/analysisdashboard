/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        surface: {
          900: '#0d1117',
          800: '#161b22',
          700: '#21262d',
          600: '#30363d',
          500: '#484f58',
        },
        accent: {
          DEFAULT: '#58a6ff',
          hover: '#79b8ff',
        },
        danger: '#f85149',
        warning: '#e3b341',
        success: '#3fb950',
      },
    },
  },
  plugins: [],
}
