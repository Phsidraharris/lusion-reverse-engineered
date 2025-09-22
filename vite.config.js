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
    base: "/lusion-reverse-engineered/",
    build: {
        rollupOptions: {
            output: {
                manualChunks: {
                    // Separate Three.js and its dependencies into their own chunk
                    'threejs': ['three'],
                    // Separate Framer Motion into its own chunk
                    'framer-motion': ['framer-motion'],
                    // Group animation components together
                    'animations': [
                        './src/components/ParticleField.jsx',
                        './src/components/MorphingBlob.jsx',
                        './src/components/FloatingElements.jsx',
                        './src/components/AnimatedBackground.jsx',
                        './src/components/GlareCard.jsx'
                    ],
                    // Group React utilities
                    'react-vendor': ['react', 'react-dom', 'react-router-dom'],
                }
            }
        },
        // Increase chunk size warning limit to 1000 KB since we're splitting chunks
        chunkSizeWarningLimit: 1000
    }
});