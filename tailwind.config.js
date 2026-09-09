/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        obsidian: {
          950: '#060608',
          900: '#0c0c0f',
          850: '#111117',
          800: '#171720',
          700: '#232330',
          600: '#343446',
        },
        gold: {
          100: '#fcf8e3',
          200: '#f7edb3',
          300: '#eedf80',
          400: '#e1cb4e',
          500: '#d4af37', // Classic metallic gold
          600: '#b89224',
          700: '#94701a',
          800: '#755416',
          900: '#5c4113',
        },
        amberGlow: {
          500: '#e07a2a',
          600: '#c25e16',
        }
      },
      fontFamily: {
        serif: ['"Cinzel"', '"Playfair Display"', 'serif'],
        sans: ['"Montserrat"', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        'gold-gradient': 'linear-gradient(135deg, #f7edb3 0%, #d4af37 50%, #94701a 100%)',
        'silver-gradient': 'linear-gradient(135deg, #ffffff 0%, #cbd5e1 50%, #64748b 100%)',
        'dark-glass': 'linear-gradient(135deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.01) 100%)',
      },
      boxShadow: {
        'luxury': '0 20px 50px rgba(0, 0, 0, 0.8), 0 0 20px rgba(212, 175, 55, 0.15)',
        'luxury-hover': '0 25px 60px rgba(0, 0, 0, 0.9), 0 0 35px rgba(212, 175, 55, 0.35)',
        'gold-sm': '0 0 15px rgba(212, 175, 55, 0.25)',
      },
    },
  },
  plugins: [],
}
