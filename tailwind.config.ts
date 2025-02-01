import type { Config } from 'tailwindcss'

const config = {
  darkMode: ['class'],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  prefix: '',
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px',
      },
    },
    extend: {
      fontFamily: {
        archivo: ['var(--font-archivo)'],
        inter: ['var(--font-inter)'],
      },
      colors: {
        primary: {
          DEFAULT: '#5538CE',
          black: '#101010',
          outline: '#909090',
          grey: '#202020',
          darkGrey: '#1C1C1C',
        },
        sp: {
          purple: {
            DEFAULT: '#5538CE',
            dark: '#3B2A8A',
            veryDark: '#131133',
          },
        },
        stakingModal: '#202020',
        stakingModalOutline: '#424242',
        placeholderGray: '#909090',
      },
      keyframes: {
        'accordion-down': {
          from: {
            height: '0',
          },
          to: {
            height: 'var(--radix-accordion-content-height)',
          },
        },
        'accordion-up': {
          from: {
            height: 'var(--radix-accordion-content-height)',
          },
          to: {
            height: '0',
          },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
} satisfies Config

export default config
