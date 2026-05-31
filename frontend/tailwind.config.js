export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        gold:  { DEFAULT:'#C9963A', light:'#E8B86D', dark:'#A87828', glow:'#F0D080' },
        night: { DEFAULT:'#0E0A06', 2:'#16100A', 3:'#1E1610' },
        cream: { DEFAULT:'#F5EDD6', muted:'#D4C4A0' },
        choco: { DEFAULT:'#3D2314', light:'#5C3520', dark:'#2A1809' },
        blush: '#F9E4D4',
        warm:  '#FFFAF6',
      },
      fontFamily: {
        cormorant: ['"Cormorant Garamond"','serif'],
        poppins:   ['Poppins','sans-serif'],
      },
      boxShadow: {
        soft:  '0 4px 24px rgba(14,10,6,0.30)',
        card:  '0 8px 40px rgba(14,10,6,0.45)',
        gold:  '0 0 40px rgba(201,150,58,0.45)',
        glow:  '0 0 80px rgba(201,150,58,0.25)',
      },
      backdropBlur: { xs:'4px', sm:'8px', DEFAULT:'16px', lg:'24px', xl:'40px' },
      animation: {
        'float':     'float 6s ease-in-out infinite',
        'float-slow':'float 9s ease-in-out infinite',
        'pulse-gold':'pulse-gold 3s ease-in-out infinite',
        'grain':     'grain .5s steps(2) infinite',
        'slide-up':  'slideUp 0.7s cubic-bezier(0.22,1,0.36,1) both',
        'fade-in':   'fadeIn 0.5s ease both',
      },
      keyframes: {
        float:      { '0%,100%':{transform:'translateY(0)'}, '50%':{transform:'translateY(-18px)'} },
        'pulse-gold':{ '0%,100%':{opacity:'0.6'}, '50%':{opacity:'1'} },
        slideUp:    { from:{opacity:'0',transform:'translateY(30px)'}, to:{opacity:'1',transform:'translateY(0)'} },
        fadeIn:     { from:{opacity:'0'}, to:{opacity:'1'} },
      },
    },
  },
  plugins: [],
}
