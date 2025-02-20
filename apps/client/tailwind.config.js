/** @type {import('tailwindcss').Config} */
import typography from '@tailwindcss/typography';
import scrollbarHide from 'tailwind-scrollbar-hide';

export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Pretendard', 'sans-serif'],
        header: ['ADLaM Display', 'sans-serif'],
      },
      keyframes: {
        fadeIn: {
          '0%': {
            transform: 'translateX(-100%)',
          },
          '100%': {
            transform: 'translateX(0)',
          },
        },
        fadeOut: {
          '0%': {
            transform: 'translateX(0)',
            height: 'auto',
            opacity: 1,
          },
          '100%': {
            transform: 'translateX(-100%)',
            height: 0,
            opacity: 0,
          },
        },
        modalOpen: {
          '0%': {
            transform: 'scale(0.5)',
            opacity: 0,
          },
          '100%': {
            transform: 'scale(1)',
            opacity: 1,
          },
        },
        modalClose: {
          '0%': {
            transform: 'scale(1)',
            opacity: 1,
          },
          '100%': {
            transform: 'scale(0.5)',
            opacity: 0,
          },
        },
      },
      animation: {
        fadeIn: 'fadeIn 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55)',
        fadeOut: 'fadeOut 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55)',
        modalOpen: 'modalOpen 0.15s ease-out',
        modalClose: 'modalClose 0.15s ease-in',
      },
    },
  },
  plugins: [typography, scrollbarHide],
};
