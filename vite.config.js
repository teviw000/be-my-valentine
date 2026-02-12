import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// IMPORTANT: replace REPO_NAME with your GitHub repo name
export default defineConfig({
  plugins: [react()],
  base: "/be-my-valentine/",
});
