/* global ColorCore, PersonalLibrary, ChartGallery, acquireVsCodeApi */
'use strict';
const C = ColorCore;
const L = PersonalLibrary;
const ORIGIN = OriginLibrary;
const ALL_CHARTS = L.charts.concat(ORIGIN.charts);
let galleryPage = 0;
const GALLERY_PAGE_SIZE = 36;
let paletteCollection = 'Open-source';
const vscode = acquireVsCodeApi();
const $ = id => document.getElementById(id);
const saved = vscode.getState() || {};
let current = C.parseColor('#4477AA');
let palette = C.palettes.find(p => p.id === saved.palette) || C.palettes.find(p => p.id === 'mpl-viridis');
let extracted = [];
let originalImage = null;
let imageName = '';
let imageVersion = 0;
let simulationVersion = 0;
let simulationReady = false;
function status(text) { $('status').textContent = text; }
function copy(text) { vscode.postMessage({ type: 'copy', text }); }
function persist() {
  vscode.setState({ tab: document.querySelector('.tab.active')?.dataset.tab || 'lookup', color: $('color-input').value,
    palette: palette.id, format: $('export-format').value, mode: $('vision-mode').value,
    compareA: $('compare-a').value, compareB: $('compare-b').value, foreground: $('foreground').value, background: $('background').value });
}
  function renderGallery() {
  const term = $('chart-search').value.trim().toLowerCase();
  const family = $('chart-family').value;
  const charts = ALL_CHARTS.filter(c => (family === 'all' || c.family === family) && (c.name + ' ' + (c.englishName||'') + ' ' + c.family + ' ' + c.description).toLowerCase().includes(term));
  $('chart-grid').replaceChildren();
  $('chart-count').textContent = `显示 ${charts.length} / ${ALL_CHARTS.length} 条图种/变体`;
  $('chart-current-palette').textContent = '缩略图使用当前配色：' + palette.name + '（可在“科研配色”中切换）';
  galleryPage=Math.min(galleryPage,Math.max(0,Math.ceil(charts.length/GALLERY_PAGE_SIZE)-1));
  $('chart-page').textContent=`第 ${galleryPage+1} / ${Math.max(1,Math.ceil(charts.length/GALLERY_PAGE_SIZE))} 页`;
  $('chart-prev').disabled=galleryPage===0; $('chart-next').disabled=(galleryPage+1)*GALLERY_PAGE_SIZE>=charts.length;
  for (const chart of charts.slice(galleryPage*GALLERY_PAGE_SIZE,(galleryPage+1)*GALLERY_PAGE_SIZE)) {
    const card = document.createElement('button'); card.className = 'chart-card';
    const canvas = document.createElement('canvas'); canvas.width = 640; canvas.height = 400; canvas.setAttribute('aria-label', chart.name + '示意图');
    ChartGallery.draw(canvas, chart.id, palette.colors);
    const heading = document.createElement('h3'); heading.textContent = chart.name + (chart.englishName?' · '+chart.englishName:'');
    const tags = document.createElement('small'); tags.textContent = chart.family;
    const description = document.createElement('p'); description.textContent = chart.description;
    card.append(canvas, heading, tags, description);
    card.addEventListener('click', () => {
      $('chart-detail-title').textContent = chart.name;
      ChartGallery.draw($('chart-detail-canvas'), chart.id, palette.colors);
      $('chart-detail-description').textContent = chart.description + (chart.dataHint?' '+chart.dataHint:'');
      $('chart-detail-source').textContent = (chart.source?'Origin 来源：'+chart.source+'。 ':'') + (chart.markdownImages.length ? 'Author 参考截图编号：' + chart.markdownImages.join(', ') + '。 ' : '') + (chart.natureReferences.length ? 'nature-figure：' + chart.natureReferences.join('；') : '');
      $('copy-chart-source').disabled=!chart.source; $('copy-chart-source').onclick=()=>copy(chart.source);
      $('save-chart-preview').onclick=()=>vscode.postMessage({type:'saveImage',data:$('chart-detail-canvas').toDataURL('image/png')});
      $('chart-detail').showModal();
    });
    $('chart-grid').append(card);
  }
}
document.querySelectorAll('.collection').forEach(button => button.addEventListener('click', () => {
  paletteCollection = button.dataset.collection;
  document.querySelectorAll('.collection').forEach(b => b.classList.toggle('active', b === button));
  $('palette-origin').value = 'all';
  renderCards(document.querySelector('.filter.active')?.dataset.filter || 'all');
}));
$('palette-search').addEventListener('input', () => renderCards(document.querySelector('.filter.active')?.dataset.filter || 'all'));
$('palette-origin').addEventListener('change', () => renderCards(document.querySelector('.filter.active')?.dataset.filter || 'all'));
$('chart-search').addEventListener('input', () => {galleryPage=0;renderGallery();});
$('chart-family').addEventListener('change', () => {galleryPage=0;renderGallery();});
$('chart-prev').addEventListener('click',()=>{galleryPage--;renderGallery();});
$('chart-next').addEventListener('click',()=>{galleryPage++;renderGallery();});
$('close-chart-detail').addEventListener('click', () => $('chart-detail').close());
$('copy-chart-index').addEventListener('click', () => copy(JSON.stringify(ALL_CHARTS.map(c => ({ name:c.name, type:c.id, family:c.family, description:c.description })), null, 2)));
for (const family of new Set(ALL_CHARTS.map(c => c.family))) { const option=document.createElement('option'); option.value=family; option.textContent=family; $('chart-family').append(option); }
const summary = L.summary;
$('personal-summary').textContent = `共 ${C.palettes.length} 组配色 · 开源 62 / Personal 32 / 内置 6 · 图表图鉴 ${ALL_CHARTS.length} 条图种/变体`;
$('gallery-summary').textContent = `共 ${ALL_CHARTS.length} 条图种与结构变体，按分组统一浏览。支持中英文搜索、当前配色重绘、放大和保存。`;


function tab(name) {
  if (!['lookup', 'compare', 'palettes', 'accessibility', 'gallery'].includes(name)) name = 'lookup';
  document.querySelectorAll('.page').forEach(el => { el.hidden = el.id !== name; });
document.querySelectorAll('.tab').forEach(el => {
    el.classList.toggle('active', el.dataset.tab === name);
    el.setAttribute('aria-selected', String(el.dataset.tab === name));
  });
  if (name === 'gallery') renderGallery();
  persist();
}
function showColor(input) {
  try {
    current = C.parseColor(input);
    const base = C.hex(current), full = C.hex(current, current.a < 1), hsl = C.hsl(current);
    $('lookup-error').textContent = '';
    const displayed = C.composite(current);
    $('hero-color').style.backgroundColor = C.hex(displayed);
    $('hero-color').style.color = C.contrast(C.parseColor('#000'), displayed) > C.contrast(C.parseColor('#FFF'), displayed) ? '#000' : '#FFF';
    $('hero-label').textContent = full;
    $('color-values').replaceChildren();
    const values = [['HEX', full], ['RGB', current.a < 1 ? `rgba(${current.r}, ${current.g}, ${current.b}, ${Number(current.a.toFixed(3))})` : `rgb(${current.r}, ${current.g}, ${current.b})`],
      ['HSL', `hsl(${Math.round(hsl.h)} ${hsl.s.toFixed(1)}% ${hsl.l.toFixed(1)}%${current.a < 1 ? ' / ' + current.a.toFixed(3) : ''})`],
      ['ALPHA', `${(current.a * 100).toFixed(1)}% · 预览使用白底`]];
    for (const [label, value] of values) {
      const row = document.createElement('div'); row.className = 'value-row';
      const name = document.createElement('small'); name.textContent = label;
      const code = document.createElement('code'); code.textContent = value;
      const button = document.createElement('button'); button.textContent = '复制'; button.addEventListener('click', () => copy(value));
      row.append(name, code, button); $('color-values').append(row);
    }
    status('颜色已解析：' + base); persist();
  } catch (err) { $('lookup-error').textContent = err.message; status('颜色格式无效'); }
}
function swatches(container, colors, simulated = false) {
  container.replaceChildren();
  colors.forEach((code, index) => {
    const color = simulated ? C.hex(C.simulate(C.parseColor(code), $('vision-mode').value)) : code;
    const button = document.createElement('button'); button.className = 'swatch'; button.title = `第 ${index + 1} 色 ${color}，点击复制`;
    const chip = document.createElement('span'); chip.className = 'chip'; chip.style.backgroundColor = color;
    const label = document.createElement('code'); label.textContent = color;
    button.append(chip, label); button.addEventListener('click', () => copy(color)); container.append(button);
  });
}
function renderCards(filter = 'all') {
  $('palette-grid').replaceChildren();
  const origin = $('palette-origin').value;
  const term = $('palette-search').value.trim().toLowerCase();
  const selected = C.palettes.filter(p => (paletteCollection === 'all' || p.collection === paletteCollection) && (origin === 'all' || p.origin === origin) && (filter === 'all' || p.type === filter) && (p.name + ' ' + p.colors.join(' ')).toLowerCase().includes(term));
  $('palette-count').textContent = `显示 ${selected.length} / 全部 ${C.palettes.length} 组 · 当前分类：${paletteCollection === 'all' ? '全部' : paletteCollection}`;
  for (const p of selected) {
    const card = document.createElement('button'); card.className = 'palette-card'; card.classList.toggle('selected', p.id === palette.id);
    const heading = document.createElement('h3'); heading.textContent = p.name;
    const count = document.createElement('small'); count.textContent = p.colors.length + ' 色'; heading.append(count);
    const strip = document.createElement('div'); strip.className = 'card-strip';
    p.colors.forEach(code => { const chip = document.createElement('span'); chip.style.backgroundColor = code; strip.append(chip); });
    const note = document.createElement('p'); note.textContent = p.note;
    const source = document.createElement('small'); source.className = 'palette-origin'; source.textContent = p.collection + ' · ' + (p.family || (p.origin === 'nature' ? 'nature-figure' : p.origin === 'markdown' ? '个人截图' : '内置')) + (p.approximateIndices ? ' · 含近似色号' : '');
    card.append(heading, strip, note, source); card.addEventListener('click', () => { palette = p; renderPalette(); });
    $('palette-grid').append(card);
  }
}
function renderPalette() {
  $('selected-palette').textContent = palette.name;
  $('palette-note').textContent = palette.note + (palette.attribution ? ' 来源：' + palette.attribution : '') + (palette.source && palette.origin === 'builtin' ? ' 来源：Paul Tol, Colour Schemes, issue 3.2。' : '');
  $('palette-license').textContent = palette.license ? `来源：${palette.family} · 版本：${palette.sourceVersion} · 许可证：${palette.license}` : '';
  $('copy-source').disabled = !palette.source;
  swatches($('selected-swatches'), palette.colors);
  $('palette-code').textContent = C.exportPalette(palette.colors, $('export-format').value, { type: palette.type });
  renderCards(document.querySelector('.filter.active')?.dataset.filter || 'all');
  renderVision(false);
  if (!$('gallery').hidden) renderGallery();
  persist();
}
function renderVision(includeImage = true) {
  swatches($('original-swatches'), palette.colors);
  swatches($('simulated-swatches'), palette.colors, true);
  $('simulation-title').textContent = $('vision-mode').selectedOptions[0].textContent;
  if (includeImage) void simulateImage();
  persist();
}
async function simulateImage() {
  const version = ++simulationVersion;
  simulationReady = false; $('save-simulation').disabled = true;
  if (!originalImage) return;
  const source = $('original-preview'), target = $('simulated-preview');
  const scale = Math.min(1, 1000 / Math.max(originalImage.width, originalImage.height));
  source.width = Math.max(1, Math.round(originalImage.width * scale)); source.height = Math.max(1, Math.round(originalImage.height * scale));
  const ctx = source.getContext('2d', { willReadFrequently: true });
  ctx.fillStyle = '#FFFFFF'; ctx.fillRect(0, 0, source.width, source.height); ctx.drawImage(originalImage, 0, 0, source.width, source.height);
  target.width = source.width; target.height = source.height;
  const mode = $('vision-mode').value, output = target.getContext('2d');
  $('simulation-info').textContent = `${imageName} · 原图 ${originalImage.width}×${originalImage.height} · 预览 ${source.width}×${source.height}，白底合成`;
  status('正在生成色觉预览…');
  // Process in strips and yield so controls remain responsive; abandon stale requests.
  for (let y = 0; y < source.height; y += 24) {
    if (version !== simulationVersion) return;
    const height = Math.min(24, source.height - y), chunk = ctx.getImageData(0, y, source.width, height);
    chunk.data.set(C.simulatePixels(chunk.data, mode)); output.putImageData(chunk, 0, y);
    await new Promise(resolve => setTimeout(resolve, 0));
  }
  if (version !== simulationVersion) return;
  document.querySelectorAll('.no-image').forEach(el => { el.hidden = true; });
  source.hidden = false; target.hidden = false;
  simulationReady = true; $('save-simulation').disabled = false; status('色觉预览已更新');
}
async function loadImage(data, name) {
  const version = ++imageVersion;
  ++simulationVersion;
  status('正在读取图片…');
  const image = new Image();
  try {
    await new Promise((resolve, reject) => { image.onload = resolve; image.onerror = () => reject(Error('无法解码图片，请尝试 PNG 或 JPEG。')); image.src = data; });
    if (version !== imageVersion) return;
    if (!image.naturalWidth || image.naturalWidth * image.naturalHeight > 20_000_000) throw Error('图片超过 2000 万像素，请先缩小。');
    const canvas = document.createElement('canvas'); canvas.width = image.naturalWidth; canvas.height = image.naturalHeight;
    const context = canvas.getContext('2d', { willReadFrequently: true });
    context.fillStyle = '#FFF'; context.fillRect(0, 0, canvas.width, canvas.height); context.drawImage(image, 0, 0);
    originalImage = canvas; imageName = name;
    const preview = $('image-canvas'), scale = Math.min(1, 1000 / Math.max(canvas.width, canvas.height));
    preview.width = Math.max(1, Math.round(canvas.width * scale)); preview.height = Math.max(1, Math.round(canvas.height * scale));
    preview.getContext('2d').drawImage(canvas, 0, 0, preview.width, preview.height);
    preview.hidden = false; $('image-empty').hidden = true;
    $('image-info').textContent = `${name} · ${canvas.width}×${canvas.height}`;
    $('extract').disabled = false;
    $('picked-pixel').textContent = '点击图片取色（按原图像素读取），或聚焦图片后按 Enter 取中心点。';
    extracted = []; $('image-colors').replaceChildren(); $('use-extracted').disabled = true;
    await simulateImage();
  } catch (err) { if (version === imageVersion) status(err.message); }
}
function pickPixel(x, y) {
  if (!originalImage) return;
  x = Math.max(0, Math.min(originalImage.width - 1, x)); y = Math.max(0, Math.min(originalImage.height - 1, y));
  const [r, g, b] = originalImage.getContext('2d').getImageData(x, y, 1, 1).data;
  const code = C.hex({ r, g, b }); $('color-input').value = code; showColor(code);
  $('picked-pixel').textContent = `像素 (${x}, ${y}) → ${code}，按白底显示。`;
}
async function extractColors() {
  if (!originalImage) return;
  const source = originalImage, version = imageVersion;
  $('extract').disabled = true; status('正在提取近似主色…');
  await new Promise(resolve => setTimeout(resolve, 20));
  try {
    const sample = document.createElement('canvas'), scale = Math.min(1, 256 / Math.max(source.width, source.height));
    sample.width = Math.max(1, Math.round(source.width * scale)); sample.height = Math.max(1, Math.round(source.height * scale));
    const context = sample.getContext('2d'); context.drawImage(source, 0, 0, sample.width, sample.height);
    const result = C.dominantColors(context.getImageData(0, 0, sample.width, sample.height).data, Number($('color-count').value));
    if (version !== imageVersion) return;
    extracted = result.map(item => C.hex(item.color)); $('image-colors').replaceChildren();
    result.forEach(item => {
      const code = C.hex(item.color), button = document.createElement('button'); button.className = 'mini-color';
      button.style.backgroundColor = code; button.title = `${code} · 近似占比 ${(item.share * 100).toFixed(1)}%`;
      button.setAttribute('aria-label', button.title);
      button.addEventListener('click', () => { $('color-input').value = code; showColor(code); }); $('image-colors').append(button);
    });
    $('use-extracted').disabled = !extracted.length;
    status('主色提取完成：聚类中心为近似颜色，精确色值请点击原图取样');
  } catch (err) { status(err.message); }
  finally { $('extract').disabled = !originalImage; }
}
function checkContrast() {
  try {
    const foreground = C.parseColor($('foreground').value), background = C.parseColor($('background').value);
    const ratio = C.contrast(foreground, background);
    $('contrast-error').textContent = '';
    $('contrast-ratio').textContent = ratio.toFixed(2) + ' : 1';
    $('contrast-verdict').textContent = `普通文字 AA：${ratio >= 4.5 ? '通过' : '未通过'} · 大号文字 AA：${ratio >= 3 ? '通过' : '未通过'}`;
    const bg = C.composite(background), fg = C.composite(foreground, bg);
    $('contrast-sample').style.color = C.hex(fg); $('contrast-sample').style.backgroundColor = C.hex(bg); persist();
  } catch (err) { $('contrast-error').textContent = err.message; $('contrast-ratio').textContent = '—'; $('contrast-verdict').textContent = ''; }
}
document.querySelectorAll('.tab').forEach(el => el.addEventListener('click', () => tab(el.dataset.tab)));
document.querySelectorAll('.filter').forEach(el => el.addEventListener('click', () => {
  document.querySelectorAll('.filter').forEach(button => button.classList.toggle('active', button === el)); renderCards(el.dataset.filter);
}));
$('lookup-form').addEventListener('submit', event => { event.preventDefault(); showColor($('color-input').value); });
$('open-image').addEventListener('click', () => vscode.postMessage({ type: 'openImage' }));
$('open-simulation-image').addEventListener('click', () => vscode.postMessage({ type: 'openImage' }));
$('image-canvas').addEventListener('click', event => {
  if (!originalImage) return;
  const bounds = $('image-canvas').getBoundingClientRect();
  pickPixel(Math.floor((event.clientX - bounds.left) / bounds.width * originalImage.width), Math.floor((event.clientY - bounds.top) / bounds.height * originalImage.height));
});
$('image-canvas').addEventListener('keydown', event => { if (originalImage && event.key === 'Enter') { event.preventDefault(); pickPixel(Math.floor(originalImage.width / 2), Math.floor(originalImage.height / 2)); } });
$('extract').addEventListener('click', extractColors);
$('use-extracted').addEventListener('click', () => {
  if (!extracted.length) return;
  palette = { id: 'image-extracted', name: '图片提取配色', type: 'qualitative', note: '由当前图片近似聚类得到，尚未验证可辨识性。', colors: extracted.slice(), source: null };
  renderPalette(); tab('palettes');
});
$('export-format').addEventListener('change', renderPalette);
$('copy-source').addEventListener('click', () => { if (palette.source) copy(palette.source); });
$('copy-code').addEventListener('click', () => copy($('palette-code').textContent));
$('check-palette').addEventListener('click', () => { tab('accessibility'); renderVision(); });
$('vision-mode').addEventListener('change', () => renderVision());
$('check-contrast').addEventListener('click', checkContrast);
$('save-simulation').addEventListener('click', () => {
  if (!simulationReady) return;
  vscode.postMessage({ type: 'saveImage', data: $('simulated-preview').toDataURL('image/png') });
});
window.addEventListener('message', event => {
  const msg = event.data;
  if (!msg || typeof msg !== 'object') return;
  if (msg.type === 'lookup' && typeof msg.value === 'string') { $('color-input').value = msg.value; tab('lookup'); showColor(msg.value); }
  else if (msg.type === 'image' && typeof msg.data === 'string') void loadImage(msg.data, msg.name || '图片');
  else if (msg.type === 'status') status(String(msg.text || ''));
});
if (typeof saved.color === 'string') $('color-input').value = saved.color;
if (['python', 'r', 'matlab', 'css', 'json'].includes(saved.format)) $('export-format').value = saved.format;
if (['normal', 'protan', 'deutan', 'tritan', 'gray'].includes(saved.mode)) $('vision-mode').value = saved.mode;
if (typeof saved.foreground === 'string') $('foreground').value = saved.foreground;
if (typeof saved.background === 'string') $('background').value = saved.background;
showColor($('color-input').value); renderPalette(); checkContrast(); tab(saved.tab || 'lookup');
vscode.postMessage({ type: 'ready' });

function renderComparison() {
  const inputs = ['compare-a','compare-b'];
  const parsed = inputs.map(id => { try { const c=C.parseColor($(id).value); $(id).removeAttribute('aria-invalid'); return c; } catch(e) { $(id).setAttribute('aria-invalid','true'); return e; } });
  const errors = parsed.map((c,i)=>c instanceof Error ? `${i?'B':'A'}：${c.message}` : '').filter(Boolean);
  $('compare-error').textContent=errors.join('；');
  $('compare-results').replaceChildren();
  if(errors.length) return;
  parsed.forEach((c,i)=>{
    const card=document.createElement('article'); card.className='compare-card';
    const swatch=document.createElement('div'); swatch.className='compare-swatch'; swatch.style.background=C.hex(C.composite(c));
    const title=document.createElement('h3'); title.textContent='颜色 '+(i?'B':'A');
    const value=document.createElement('p'); value.textContent=C.hex(c,c.a<1)+` · rgb(${c.r}, ${c.g}, ${c.b}) · 透明度 ${Math.round(c.a*100)}%`;
    const button=document.createElement('button'); button.textContent='复制色号'; button.addEventListener('click',()=>copy(C.hex(c,c.a<1)));
    card.append(swatch,title,value,button); $('compare-results').append(card);
  });
  persist();
}
$('compare-form').addEventListener('submit',e=>{e.preventDefault();renderComparison();});
$('swap-colors').addEventListener('click',()=>{const a=$('compare-a').value;$('compare-a').value=$('compare-b').value;$('compare-b').value=a;renderComparison();});
function renderNamedColors(){
 const term=$('named-search').value.trim().toLowerCase();
 const entries=Object.entries(NamedColors).filter(([name,hex])=>(name+' '+hex).toLowerCase().includes(term));
 $('named-count').textContent=`${entries.length} / ${Object.keys(NamedColors).length} 个名称（含别名）`;
 $('named-rows').replaceChildren();
 for(const [name,hex] of entries){
  const row=document.createElement('tr'); const swatchCell=document.createElement('td'); const swatch=document.createElement('span');swatch.className='named-swatch';swatch.style.background=hex;swatch.setAttribute('aria-label',name+' '+hex);swatchCell.append(swatch);
  const nameCell=document.createElement('td');nameCell.textContent=name;
  const codeCell=document.createElement('td');const button=document.createElement('button');button.textContent=hex;button.setAttribute('aria-label','复制 '+name+' '+hex);button.addEventListener('click',()=>copy(hex));const c=C.parseColor(hex);const rgb=document.createElement('small');rgb.textContent=`rgb(${c.r}, ${c.g}, ${c.b})`;codeCell.append(button,rgb);
  const actions=document.createElement('td');for(const side of ['a','b']){const b=document.createElement('button');b.textContent='填入 '+side.toUpperCase();b.setAttribute('aria-label',name+' 填入 '+side.toUpperCase());b.addEventListener('click',()=>{$('compare-'+side).value=hex;renderComparison();status(name+' 已填入 '+side.toUpperCase());});actions.append(b);}
  row.append(swatchCell,nameCell,codeCell,actions);$('named-rows').append(row);
 }
}
$('named-search').addEventListener('input',renderNamedColors);
$('compare-a').value=saved.compareA||'#4477AA';$('compare-b').value=saved.compareB||'#66CCEE';
renderComparison();renderNamedColors();
