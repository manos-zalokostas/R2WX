// import {sveltePreprocess} from 'svelte-preprocess';
import adapter from '@sveltejs/adapter-node';
import 'dotenv/config';


/** @type {import('@sveltejs/kit').Config} */
const config = {
    // preprocess: sveltePreprocess(),
    kit: {
        adapter: adapter(),
        paths: {
            base: process.env.PUBLIC_BASEPATH
        }
    }
};

export default config;