/** biome-ignore-all assist/source/organizeImports: <explanation> */
import { defineConfig } from "vite";
import { fileURLToPath, URL } from "node:url";
import vueJsx from "@vitejs/plugin-vue-jsx";
import vue from "@vitejs/plugin-vue";

// https://vite.dev/config/
export default defineConfig({
	plugins: [
		vue(),
		vueJsx(),
		// vueDevTools(),
	],
	server: {
		host: "0.0.0.0",
		allowedHosts: true,
		proxy: {
			"/api": "http://localhost:3000",
		},
	},

	resolve: {
		alias: {
			"@": fileURLToPath(new URL("./src", import.meta.url)),
		},
	},
});
