const config = {
  plugins: {
    "@tailwindcss/postcss": {},
  },
  theme: {
    extend: {
      screens: {
        print: { raw: "print" },
      },
    },
  },
};

export default config;
