import {sveltekit} from '@sveltejs/kit/vite';
import path from "path";


/** @type {import('vite').UserConfig} */
const config = {
    // base: "r2wx/front",
    server: {
        port: 5000,
    },
    plugins: [sveltekit()],
    optimizeDeps: {
        exclude: ['date-picker-svelte'] // <--- Add this line
    },
    ssr: {
        noExternal: ['chart.js'],
    },
    resolve: {
        alias: {
            $lit: path.resolve('./src/lit'),
            $store: path.resolve('./src/store'),
            $var: path.resolve('./src/var'),
            $type: path.resolve('./src/type'),
        }
    },
};

export default config;
