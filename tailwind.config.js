/** @type {import('tailwindcss').Config} */
const { defineConfig } = require('tailwindcss')

module.exports = defineConfig({
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    // 在这里直接定义或扩展主题
  },
  plugins: [],
})