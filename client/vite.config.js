/* eslint-disable no-undef */
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import path from "path";

// https://vitejs.dev/config/
export default ({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  return defineConfig({
    plugins: [react()],
    server: {
      host: env.HOST,
      port: env.PORT,
      origin: env.CLIENT_DOMAIN,
    },
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src/"),
        components: `${path.resolve(__dirname, "./src/components/")}`,
        public: `${path.resolve(__dirname, "./public/")}`,
        pages: path.resolve(__dirname, "./src/pages"),
        assets: path.resolve(__dirname, "./src/assets"),
        api: path.resolve(__dirname, "./src/api"),
        reducers: path.resolve(__dirname, "./src/reducers"),
        utils: path.resolve(__dirname, "./src/utils"),
      },
    },
  });
};
