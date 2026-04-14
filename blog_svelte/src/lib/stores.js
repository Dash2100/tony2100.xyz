import { writable } from 'svelte/store';

/** @type {import('svelte/store').Writable<(() => void) | null>} */
export const homeClickCallback = writable(null);
