/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all of your component files.
  darkMode: 'class',
  content: ['./app/**/*.{js,jsx,ts,tsx}', './components/**/*.{ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        border: '#232A34',
        input: '#232A34',
        ring: '#CBD5E1',
        background: '#020303',
        foreground: '#F3F8FD',
        primary: {
          DEFAULT: '#F3F8FD',
          foreground: '#191D24',
        },
        secondary: {
          DEFAULT: '#232A34',
          foreground: '#F3F8FD',
        },
        destructive: {
          DEFAULT: '#7D1A1A',
          foreground: '#F3F8FD',
        },
        muted: {
          DEFAULT: '#232A34',
          foreground: '#94A3B8',
        },
        accent: {
          DEFAULT: '#232A34',
          foreground: '#F3F8FD',
        },
        popover: {
          DEFAULT: '#090B11',
          foreground: '#F3F8FD',
        },
        card: {
          DEFAULT: '#090B11',
          foreground: '#F3F8FD',
        },
      },
    },
  },
  plugins: [
    ({ addBase }) =>
      addBase({
        ':root': {
          '--radius': '0.5',
        },
      }),
  ],
}
