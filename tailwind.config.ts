import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/layouts/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Muddy brownish-gray palette (zinc-ish)
        gray: {
          50: '#faf9f7',   // Warm off-white
          100: '#f5f3f0',  // Light clay
          200: '#e8e6e1',  // Soft stone
          300: '#d6d3ce',  // Muted beige-gray
          400: '#a8a29e',  // Warm gray
          500: '#78716c',  // Muddy brown-gray
          600: '#57534e',  // Darker muddy tone
          700: '#44403c',  // Deep brown-gray
          800: '#292524',  // Dark muddy
          900: '#1c1917',  // Very dark brown-gray
          950: '#0c0a09',  // Almost black with brown tint
        },
        zinc: {
          50: '#fafaf9',   // Warm off-white
          100: '#f4f4f3',  // Light muddy
          200: '#e7e5e4',  // Soft brownish-gray
          300: '#d4d4d2',  // Muted clay-gray
          400: '#a1a1aa',  // Warm zinc
          500: '#71717a',  // Muddy zinc
          600: '#52525b',  // Darker muddy zinc
          700: '#3f3f46',  // Deep muddy zinc
          800: '#27272a',  // Dark brownish-zinc
          900: '#18181b',  // Very dark muddy zinc
          950: '#09090b',  // Almost black with warm tint
        },
        // Primary Color: Blue, for main elements and professional states
        'zim-green': {
          50: '#EFF6FF',
          100: '#DBEAFE',
          200: '#BFDBFE',
          300: '#93C5FD',
          400: '#60A5FA',
          500: '#3B82F6', // Professional blue (like LinkedIn)
          600: '#2563EB',
          700: '#1D4ED8',
          800: '#1E40AF',
          900: '#1E3A8A',
          950: '#172554',
        },

        // Accent Color: Yellow/Amber, for highlights and success states
        'zim-gold': {
          50: '#FFFBEB',
          100: '#FEF3C7',
          200: '#FDE68A',
          300: '#FCD34D',
          400: '#FBBF24',
          500: '#F59E0B', // Professional amber/yellow
          600: '#D97706',
          700: '#B45309',
          800: '#92400E',
          900: '#78350F',
          950: '#451A03',
        },

        // Secondary/Alert Color: Red, for alerts and important states
        'zim-red': {
          50: '#FEF0F0',
          100: '#FDD2D2',
          200: '#FCA4A4',
          300: '#FB7676',
          400: '#F94343',
          500: '#D62828', // The primary red
          600: '#B22020',
          700: '#8E1717',
          800: '#6C1010',
          900: '#4A0C0C',
          950: '#2A0606',
        },

        // Grayscale Palette: Muddy brownish-gray for backgrounds, text, and borders
        'zim-gray': {
          50: '#faf9f7',   // Warm off-white
          100: '#f5f3f0',  // Light clay
          200: '#e8e6e1',  // Soft stone
          300: '#d6d3ce',  // Muted beige-gray
          400: '#a8a29e',  // Warm gray
          500: '#78716c',  // Muddy brown-gray
          600: '#57534e',  // Darker muddy tone
          700: '#44403c',  // Deep brown-gray
          800: '#292524',  // Dark muddy
          900: '#1c1917',  // Very dark brown-gray
          950: '#0c0a09',  // Almost black with brown tint
        },
        
        'zim-cream': {
          50: '#F8FAFC', // Professional light background
          100: '#F1F5F9', // Light gray-blue background
          200: '#E2E8F0',
          300: '#CBD5E1',
          400: '#94A3B8',
          500: '#64748B',
          600: '#475569',
          700: '#334155',
          800: '#1E293B',
          900: '#0F172A',
          950: '#020617',
        },  

        // Pure black and white for specific use cases
        'zim-black': '#000000',
        'zim-white': '#FFFFFF',
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

export default config;