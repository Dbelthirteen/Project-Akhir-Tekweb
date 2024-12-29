/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}", // Scan file React untuk Tailwind
  ],
  theme: {
    extend: {
      fontFamily: {
        custom: ["'YourFontName'", "sans-serif"], // Ganti 'YourFontName' sesuai font yang digunakan
        logo: ["Caveat", "cursive"], // Font untuk logo
        sans: ["Poppins", "sans-serif"], // Font lainnya
      },
      colors: {
        primary: "#7DA6C1", // Warna latar belakang biru
        button: "#4A90E2", // Warna tombol biru
        textPrimary: "#333333", // Warna teks utama
        textSecondary: "#7A7A7A", // Warna teks sekunder
        primary: "#8EBCE4", // Warna biru utama
        secondary: "#D9E8F6", // Warna biru muda untuk background
        textPrimary: "#2D3748", // Warna teks utama
      },
    },
  },
  plugins: [],
};