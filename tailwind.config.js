// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      backgroundImage: {
        // Mudamos de "to top" para "to bottom"
        'onepiece-fade-bottom': `linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,0.95) 40%, rgba(10,5,15,0.9) 60%, rgba(26,12,32,0.1) 85%, rgba(0,0,0,0) 100%)`,
      },
    },
  },
}