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
        'ap-accent': {
          DEFAULT: '#2D3748',
          'medium': '#4A5568',
          'light': '#718096',
          'pale': '#E2E8F0',
        },
        'ap-silver': {
          DEFAULT: '#C0C7D0',
          'dark': '#A0AEC0',
          'light': '#E2E8F0',
        },
        'ap-platinum': '#F7FAFC',
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
        'ap-gradient-card': 'linear-gradient(to bottom, #FFFFFF 0%, #F7FAFC 100%)',
        'ap-gradient-accent': 'linear-gradient(135deg, #2D3748 0%, #1A202C 100%)',
        'ap-gradient-accent-soft': 'linear-gradient(135deg, #4A5568 0%, #2D3748 100%)',
        'ap-gradient-silver': 'linear-gradient(135deg, #E2E8F0 0%, #C0C7D0 100%)',
        'ap-gradient-silver-shine': 'linear-gradient(135deg, #F7FAFC 0%, #E2E8F0 50%, #C0C7D0 100%)',
        'ap-gradient-active': 'linear-gradient(to right, #E63946 0%, #C41E3A 100%)',
        'ap-gradient-success': 'linear-gradient(135deg, #28A745 0%, #4A5568 100%)',
      },
      boxShadow: {
        'ap-sm': '0 2px 4px rgba(196, 30, 58, 0.08)',
        'ap-md': '0 4px 12px rgba(196, 30, 58, 0.12)',
        'ap-lg': '0 8px 30px rgba(196, 30, 58, 0.15)',
        'ap-xl': '0 12px 40px rgba(196, 30, 58, 0.2)',
        'ap-hover': '0 10px 30px rgba(196, 30, 58, 0.25)',
        'ap-silver': '0 4px 15px rgba(192, 199, 208, 0.3)',
        'ap-silver-lg': '0 8px 25px rgba(192, 199, 208, 0.4)',
        'ap-accent': '0 4px 15px rgba(45, 55, 72, 0.15)',
        'ap-accent-lg': '0 8px 25px rgba(45, 55, 72, 0.2)',
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
