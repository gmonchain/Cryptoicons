/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './hooks/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}', // Dành cho App Router nếu bạn muốn dùng sau này
    './src/**/*.{js,ts,jsx,tsx,mdx}', // Để quét các tệp đã di chuyển từ src
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
