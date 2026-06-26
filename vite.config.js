import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import fs from 'fs'
import path from 'path'

function dictionarySaverPlugin() {
  return {
    name: 'dictionary-saver-plugin',
    configureServer(server) {
      server.middlewares.use('/api/save-dictionary', (req, res) => {
        if (req.method === 'POST') {
          let body = '';
          req.on('data', chunk => { body += chunk.toString(); });
          req.on('end', () => {
            try {
              const data = JSON.parse(body);
              if (data.id && data.name !== undefined) {
                const filename = data.type === 'coin' ? 'coinsDictionary.json' : 'consumablesDictionary.json';
                const dictPath = path.resolve(process.cwd(), 'src/data/' + filename);
                let currentDict = {};
                if (fs.existsSync(dictPath)) {
                  currentDict = JSON.parse(fs.readFileSync(dictPath, 'utf-8'));
                }
                const entry = { name: data.name };
                if (data.color) {
                  entry.color = data.color;
                } else if (currentDict[data.id]?.color) {
                  entry.color = currentDict[data.id].color;
                }
                currentDict[data.id] = entry;
                fs.writeFileSync(dictPath, JSON.stringify(currentDict, null, 2), 'utf-8');

                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({ success: true }));
              } else {
                res.statusCode = 400;
                res.end(JSON.stringify({ error: 'Missing id or name' }));
              }
            } catch (err) {
              res.statusCode = 500;
              res.end(JSON.stringify({ error: err.message }));
            }
          });
        }
      });
    }
  };
}

// https://vite.dev/config/
export default defineConfig({
  base: './',
  plugins: [react(), dictionarySaverPlugin()],
  server: {
    port: 3000
  }
})
