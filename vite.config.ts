import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [tailwindcss()],
  build: {
    rolldownOptions: {
      input: {
        main: "index.html",
        listing: "listing/index.html",
        createListing: "listing/create/index.html",
        register: "register/index.html",
        login: "login/index.html",
        profile: "profile/index.html",
        editListing: "listing/edit/index.html",
      },
    },
  },
});
