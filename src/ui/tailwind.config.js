export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        accent: "#007aff", // iOS mavi
        background: "#f5f5f7",
      },
      borderRadius: {
        xl: "1.25rem"
      },
      boxShadow: {
        soft: "0 4px 10px rgba(0,0,0,0.08)"
      }
    }
  },
  plugins: [],
}
