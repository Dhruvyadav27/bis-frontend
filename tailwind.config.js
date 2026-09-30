/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#0c447c',
          50: '#eaf1f7',
          100: '#cddfec',
          600: '#0c447c',
          700: '#0a3865',
          800: '#082c4f',
        },
        accent: {
          DEFAULT: '#0F6E56',
          50: '#e7f4f0',
          100: '#c7e6dc',
          600: '#0F6E56',
          700: '#0c5a46',
        },
        surface: '#f4f7f9',
      },
      fontFamily: {
        sans: ['"Inter"', '"Noto Sans Devanagari"', '"Noto Sans Bengali"', '"Noto Sans Gujarati"', '"Noto Sans Kannada"', '"Noto Sans Malayalam"', '"Noto Sans Oriya"', '"Noto Sans Gurmukhi"', '"Noto Sans Tamil"', '"Noto Sans Telugu"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        poppins: ['"Poppins"', '"Noto Sans Devanagari"', '"Noto Sans Bengali"', '"Noto Sans Gujarati"', '"Noto Sans Kannada"', '"Noto Sans Malayalam"', '"Noto Sans Oriya"', '"Noto Sans Gurmukhi"', '"Noto Sans Tamil"', '"Noto Sans Telugu"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        card: '12px',
        control: '8px',
      },
      backgroundImage: {
        'hero-gradient': 'linear-gradient(135deg, #eaf1f7 0%, #e7f4f0 100%)',
      },
    },
  },
  plugins: [],
}
