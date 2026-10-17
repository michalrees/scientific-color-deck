// Development-only browser preview. Never packaged; no files or images leave localhost.
'use strict';
const http = require('http');
const fs = require('fs');
const path = require('path');
const media = path.join(__dirname, '../media');
http.createServer((request, response) => {
  const name = new URL(request.url, 'http://localhost').pathname;
  if (name === '/' || name === '/index.html') {
    let html = fs.readFileSync(path.join(media, 'index.html'), 'utf8');
    html = html.replace(/__CSP__/g, "'self'").replace(/__NONCE__/g, 'preview').replace(/__STYLE__/g, '/style.css').replace(/__CORE__/g, '/color-core.js').replace(/__APP__/g, '/app.js').replace(/__PERSONAL__/g, '/personal-library.js').replace(/__GALLERY__/g, '/chart-gallery.js').replace(/__OPEN__/g, '/open-palettes.js').replace(/__NAMES__/g, '/named-colors.js').replace(/__ORIGIN_LIBRARY__/g, '/origin-library.js').replace(/__ORIGIN_CHARTS__/g, '/origin-charts.js');
    html = html.replace('<script nonce="preview" src="/color-core.js">', `<script nonce="preview">window.acquireVsCodeApi=()=>({getState:()=>JSON.parse(sessionStorage.getItem('deck')||'{}'),setState:s=>sessionStorage.setItem('deck',JSON.stringify(s)),postMessage:m=>{if(m.type==='copy'){navigator.clipboard.writeText(m.text);window.postMessage({type:'status',text:'已复制'},'*');}if(m.type==='openImage'){const input=document.createElement('input');input.type='file';input.accept='image/*';input.style.display='none';document.body.appendChild(input);input.onchange=()=>{const f=input.files[0];if(!f)return;const reader=new FileReader();reader.onload=()=>window.postMessage({type:'image',name:f.name,data:reader.result},'*');reader.readAsDataURL(f);};input.click();}}});</script><script nonce="preview" src="/color-core.js">`);
    response.setHeader('Content-Type', 'text/html; charset=utf-8'); response.end(html); return;
  }
  const file = { '/style.css': 'style.css', '/color-core.js': 'color-core.js', '/app.js': 'app.js', '/personal-library.js':'personal-library.js', '/chart-gallery.js':'chart-gallery.js', '/open-palettes.js':'open-palettes.js', '/named-colors.js':'named-colors.js', '/origin-library.js':'origin-library.js', '/origin-charts.js':'origin-charts.js' }[name];
  if (!file) { response.writeHead(404); response.end(); return; }
  response.setHeader('Content-Type', file.endsWith('.css') ? 'text/css' : 'text/javascript'); response.end(fs.readFileSync(path.join(media, file)));
}).listen(8766, '127.0.0.1', () => console.log('Preview: http://127.0.0.1:8766'));
