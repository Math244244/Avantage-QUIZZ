/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./*.html",
    "./js/**/*.js"
  ],
  theme: {
    extend: {
      colors: {
        // Couleurs Avantage Plus
        'ap-red': {
          'primary': '#C41E3A',
          'dark': '#8B1429',
          'light': '#E63946',
          'bg': '#DC1F32',
          '50': '#FFF4F5',
          '100': '#FFE5E8',
          '200': '#FFCCD1',
        },
        'ap-gold': {
          DEFAULT: '#FFD700',
          'dark': '#FFA500',
          'light': '#FFF4CC',
        },
        'ap-gray': {
          '50': '#F8F9FA',
          '100': '#F1F3F5',
          '200': '#E9ECEF',
          '300': '#DEE2E6',
          '400': '#CED4DA',
          '500': '#ADB5BD',
          '600': '#6C757D',
          '700': '#495057',
          '800': '#343A40',
          '900': '#212529',
        },
        // Couleurs fonctionnelles
        'ap-success': '#28A745',
        'ap-info': '#17A2B8',
        'ap-warning': '#FFC107',
      },
      backgroundImage: {
        'ap-gradient-primary': 'linear-gradient(135deg, #C41E3A 0%, #8B1429 100%)',
        'ap-gradient-sidebar': 'linear-gradient(180deg, #8B1429 0%, #C41E3A 100%)',
        'ap-gradient-card': 'linear-gradient(to bottom, #FFFFFF 0%, #FFF4F5 100%)',
        'ap-gradient-gold': 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)',
        'ap-gradient-active': 'linear-gradient(to right, #E63946 0%, #C41E3A 100%)',
        'ap-gradient-success': 'linear-gradient(135deg, #28A745 0%, #FFD700 100%)',
      },
      boxShadow: {
        'ap-sm': '0 2px 4px rgba(196, 30, 58, 0.08)',
        'ap-md': '0 4px 12px rgba(196, 30, 58, 0.12)',
        'ap-lg': '0 8px 30px rgba(196, 30, 58, 0.15)',
        'ap-xl': '0 12px 40px rgba(196, 30, 58, 0.2)',
        'ap-hover': '0 10px 30px rgba(196, 30, 58, 0.25)',
        'ap-gold': '0 4px 20px rgba(255, 215, 0, 0.3)',
      },
      fontFamily: {
        'sans': ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      fontSize: {
        'display': '3.5rem',
      },
    },
  },
  plugins: [],
}
