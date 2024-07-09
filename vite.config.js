import { defineConfig } from 'vite';

export default defineConfig({
  base: "/mole-game/",
  build: {
    rollupOptions: {
      input: {
        main: 'index.html',
        game: 'game.html'
      }
    }
  }
});