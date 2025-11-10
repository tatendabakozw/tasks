// tailwind.config.js
module.exports = {
  darkMode: 'class',
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx}',
    './src/components/**/*.{js,ts,jsx,tsx}',
    './src/layouts/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        // Custom colors for specific use cases
        'zim-green': {
          50: '#E6F0E6',
          100: '#C2D9C2',
          200: '#99C299',
          300: '#69A369',
          400: '#3D8C3D',
          500: '#006400',
          600: '#005500',
          700: '#004700',
          800: '#003600',
          900: '#002500',
          950: '#001400',
        },
        'zim-gold': {
          50: '#FFFBE5',
          100: '#FFF7B8',
          200: '#FFEF8A',
          300: '#FFE65C',
          400: '#FFD72A',
          500: '#FFD700',
          600: '#D9BC08',
          700: '#B69E07',
          800: '#938006',
          900: '#726204',
          950: '#473A03',
        },
        'zim-red': {
          50: '#FEF0F0',
          100: '#FDD2D2',
          200: '#FCA4A4',
          300: '#FB7676',
          400: '#F94343',
          500: '#D62828',
          600: '#B22020',
          700: '#8E1717',
          800: '#6C1010',
          900: '#4A0C0C',
          950: '#2A0606',
        },
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'], // default UI font
        // heading: ['Poppins', 'sans-serif'], // for titles, logo text
        accent: ['Raleway', 'sans-serif'], // optional tagline/CTA font
        mainheading: 'var(--font-mainheading)',
        heading: 'var(--font-heading)',
        subheading: 'var(--font-subheading)',
        paragraph: 'var(--font-paragraph)',
        badge: 'var(--font-badge)',
        buttons: 'var(--font-buttons)',
        fun: ['Montserrat', 'sans-serif'],
      },
    },
  },
  plugins: [],
};