/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './*.html',
    './about/**/*.html',
    './demo/**/*.html',
    './localbiz/**/*.html',
    './localfaith/**/*.html',
    './localgovy/**/*.html',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        serif: ['Fraunces', 'Georgia', 'serif'],
      },
      colors: {
        paper: '#F6F3EC',
        surface: '#FFFFFF',
        ink: '#16201B',
        sub: '#48514A',
        brand: '#123B2C',
        brand2: '#1E5A42',
        gold: '#B4832E',
        gold2: '#CFA24B',
        line: '#E7E0D2',
      },
      boxShadow: {
        card: '0 1px 2px rgba(20,32,27,0.04), 0 12px 32px -12px rgba(20,32,27,0.18)',
        soft: '0 1px 2px rgba(20,32,27,0.05), 0 20px 50px -20px rgba(20,32,27,0.22)',
      },
    },
  },
  plugins: [],
};
