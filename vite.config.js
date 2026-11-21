import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
export default defineConfig({plugins:[react()],server:{port:5173,strictPort:true,proxy:{'/api':{target:'https://api.ghazatech.com',changeOrigin:true},'/media':{target:'https://api.ghazatech.com',changeOrigin:true},'/admin':{target:'https://api.ghazatech.com',changeOrigin:true}}}});
