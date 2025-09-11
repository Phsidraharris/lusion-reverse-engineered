import { defineConfig } from "vite";
import glsl from 'vite-plugin-glsl';
import wasm from "vite-plugin-wasm";
import react from '@vitejs/plugin-react';


export default defineConfig({
    plugins: [
        react(),
        wasm(),
        glsl(),
    ],
    assetsInclude: ['**/*.hdr', '**/*.glb'],
    base: "/lusion-reverse-engineered/"
});