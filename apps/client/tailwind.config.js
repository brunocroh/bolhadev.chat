/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all of your component files.
  darkMode: 'class',
  content: ['./app/**/*.{js,jsx,ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        border: 'var(--border)',
        input: 'var(--input)',
        ring: 'var(--ring)',
        background: 'var(--background)',
        foreground: 'var(--foreground)',
        primary: {
          DEFAULT: 'var(--primary)',
          foreground: 'var(--primary-foreground)',
        },
        secondary: {
          DEFAULT: 'var(--secondary)',
          foreground: 'var(--secondary-foreground)',
        },
        destructive: {
          DEFAULT: 'var(--destructive)',
          foreground: 'var(--destructive-foreground)',
        },
        muted: {
          DEFAULT: 'var(--muted)',
          foreground: 'var(--muted-foreground)',
        },
        accent: {
          DEFAULT: 'var(--accent)',
          foreground: 'var(--accent-foreground)',
        },
        popover: {
          DEFAULT: 'var(--popover)',
          foreground: 'var(--popover-foreground)',
        },
        card: {
          DEFAULT: 'var(--card)',
          foreground: 'var(--card-foreground)',
        },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
    },
  },
  plugins: [
    ({ addBase }) =>
      addBase({
        ':root': {
          '--background': '#FFFFFF',
          '--foreground': '#020817',
          '--card': '#FFFFFF',
          '--card-foreground': '#020817',
          '--popover': '#FFFFFF',
          '--popover-foreground': '#020817',
          '--primary': '#1A1D2B',
          '--primary-foreground': '#F2F6FB',
          '--secondary': '#F3F5F7',
          '--secondary-foreground': '#1A1D2B',
          '--muted': '#F3F5F7',
          '--muted-foreground': '#6B7280',
          '--accent': '#F3F5F7',
          '--accent-foreground': '#1A1D2B',
          '--destructive': '#EF4444',
          '--destructive-foreground': '#F2F6FB',
          '--border': '#E5E7EB',
          '--input': '#E5E7EB',
          '--ring': '#020817',
        },
      }),
  ],
}
