import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import fs from 'fs'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    {
      name: 'portfolio-api-middleware',
      configureServer(server) {
        server.middlewares.use((req, res, next) => {
          if (req.method === 'POST' && req.url.startsWith('/api/save-portfolio')) {
            let body = '';
            req.on('data', chunk => {
              body += chunk.toString();
            });
            req.on('end', () => {
              try {
                if (!body.trim()) {
                  res.writeHead(400, { 'Content-Type': 'application/json' });
                  res.end(JSON.stringify({ success: false, error: 'Empty body' }));
                  return;
                }
                const filePath = path.resolve(__dirname, 'public/portfolio.json');
                fs.writeFileSync(filePath, body, 'utf8');
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ success: true, message: 'Saved successfully' }));
              } catch (err) {
                console.error('Save error:', err);
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ success: false, error: err.message }));
              }
            });
            req.resume(); // Ensure request stream flows
          } else if (req.method === 'POST' && req.url.startsWith('/api/upload-image')) {
            const urlParams = new URLSearchParams(req.url.split('?')[1]);
            const filename = urlParams.get('filename') || `upload_${Date.now()}.png`;
            
            const uploadDir = path.resolve(__dirname, 'public/assets/uploads');
            if (!fs.existsSync(uploadDir)) {
              fs.mkdirSync(uploadDir, { recursive: true });
            }
            
            const filePath = path.join(uploadDir, filename);
            const writeStream = fs.createWriteStream(filePath);
            req.pipe(writeStream);
            
            req.on('end', () => {
              res.writeHead(200, { 'Content-Type': 'application/json' });
              res.end(JSON.stringify({ success: true, url: `/assets/uploads/${filename}` }));
            });
            
            req.on('error', (err) => {
              console.error('Upload error:', err);
              res.writeHead(500, { 'Content-Type': 'application/json' });
              res.end(JSON.stringify({ success: false, error: err.message }));
            });
            
            req.resume();
          } else {
            next();
          }
        });
      }
    }
  ],
  base: process.env.VITE_BASE_PATH || '/'
})
