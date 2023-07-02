/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./views/**/*.ejs",
    "./public/*.{html,js,css}",
    "./views/*.ejs",
    "./views/layouts/*.ejs",
    "./views/partials/*.ejs",
  ],
  theme: {
    extend: {
      colors: {
        "regal-blue": "#197278",
      },
    },
  },
  plugins: [],
};
