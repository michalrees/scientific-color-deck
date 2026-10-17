'use strict';
const assert = require('assert/strict');
const fs = require('fs');
const path = require('path');
const vm = require('vm');
const C = require('../media/color-core');
const pass = name => console.log('  ✓ ' + name);
const color = value => C.hex(C.parseColor(value), C.parseColor(value).a < 1);
assert.equal(color('#abc'), '#AABBCC');
assert.equal(color('"#1234"'), '#11223344');
assert.equal(color('4477aa'), '#4477AA');
assert.equal(color('rgb(100% 0% 0%)'), '#FF0000');
assert.equal(color('rgba(0, 128, 255, 0.5)'), '#0080FF80');
assert.equal(color('hsl(120 100% 50% / 25%)'), '#00FF0040');
assert.equal(color('hsl(0.5turn,100%,50%)'), '#00FFFF');
assert.equal(color('hsl(-120,100%,50%)'), '#0000FF');
assert.equal(color('transparent'), '#00000000');
for (const input of ['#xyz', 'rgb(999,0,0)', 'rgba(0,0,0,2)', 'hsl(0,101%,50%)', 'url(test)', '<script>']) assert.throws(() => C.parseColor(input));
const names = require('../media/named-colors');
assert.equal(Object.keys(names).length,156);
for(const [name,hex] of Object.entries(names)) assert.equal(color(name),hex);
assert.equal(color('c'),'#00BFBF'); assert.equal(color('g'),'#008000');
assert.equal(color('cornflowerblue'),'#6495ED');
pass('HEX / RGB / HSL / alpha 转换与无效值校验');
assert.equal(C.contrast(C.parseColor('#000'), C.parseColor('#fff')), 21);
assert.equal(C.contrast(C.parseColor('#fff'), C.parseColor('#fff')), 1);
assert.equal(C.hex(C.composite(C.parseColor('#FF000080'))), '#FF7F7F');
assert(Math.abs(C.contrast(C.parseColor('#f00'), C.parseColor('#fff')) - 3.99847677) < 0.00001);
pass('WCAG 对比度参考值与透明度合成');
assert.equal(C.hex(C.simulate(C.parseColor('#f00'), 'deutan')), '#A39000');
assert.equal(C.hex(C.simulate(C.parseColor('#f00'), 'tritan')), '#FF000F');
for (const mode of ['normal', 'protan', 'deutan', 'tritan', 'gray']) {
  assert.equal(C.hex(C.simulate(C.parseColor('#fff'), mode)), '#FFFFFF');
  assert.equal(C.hex(C.simulate(C.parseColor('#000'), mode)), '#000000');
}
const gray = C.simulate(C.parseColor('#4477aa'), 'gray'); assert.equal(gray.r, gray.g); assert.equal(gray.g, gray.b);
const simulated = C.simulatePixels(new Uint8ClampedArray([255, 0, 0, 255, 255, 0, 0, 0]), 'deutan');
assert.deepEqual([...simulated], [163, 144, 0, 255, 255, 255, 255, 255]);
pass('线性 sRGB 模拟参考值、灰度与透明像素');
const pixels = new Uint8ClampedArray([255,0,0,255,255,0,0,255,0,0,255,255,255,255,255,0]);
const dominant = C.dominantColors(pixels, 4);
assert.equal(dominant.length, 2); assert.equal(C.hex(dominant[0].color), '#FF0000');
assert(Math.abs(dominant[0].share - 2/3) < 0.00001);
assert.deepEqual(C.dominantColors(new Uint8ClampedArray(4)), []);
assert.deepEqual(C.dominantColors(pixels, 2), C.dominantColors(pixels, 2));
pass('主色聚类的占比、透明像素和确定性');
for (const palette of C.palettes) {
  assert.equal(new Set(palette.colors).size, palette.colors.length);
  for (const code of palette.colors) assert.equal(color(code), code);
  for (const format of ['python', 'r', 'matlab', 'css', 'json']) {
    const output = C.exportPalette(palette.colors, format); assert(output.length > 10);
    if (format === 'json') assert.deepEqual(JSON.parse(output), palette.colors);
    else if (format !== 'matlab') assert(output.includes(palette.colors[0]));
  }
}
pass('所有预置颜色有效且五种代码导出正常');
const html = fs.readFileSync(path.join(__dirname, '../media/index.html'), 'utf8');
const app = fs.readFileSync(path.join(__dirname, '../media/app.js'), 'utf8');
new vm.Script(app);
for (const match of app.matchAll(/\$\('([^']+)'\)/g)) assert(html.includes(`id="${match[1]}"`), `missing ${match[1]}`);
assert(!/https?:\/\//.test(html)); assert(!/\bfetch\(/.test(app));
assert(html.includes("connect-src 'none'")); assert(!app.includes('innerHTML'));
pass('前端脚本语法、DOM 引用、CSP 与本地处理约束');

(async () => {
  const commands = new Map(), clipboard = [], notices = [], sent = [];
  let messageHandler, selected = '', openImage, savedBytes;
  const extensionRoot = path.join(__dirname, '..');
  const vscode = {
    ViewColumn: { Beside: 2 }, Uri: { joinPath: (root, ...parts) => ({ fsPath: path.join(root.fsPath, ...parts), path: path.join(root.fsPath, ...parts) }) },
    commands: { registerCommand: (name, fn) => { commands.set(name, fn); return { dispose() {} }; } },
    env: { clipboard: { writeText: async text => clipboard.push(text) } },
    workspace: { fs: { stat: async () => ({ size: 20 }), readFile: async () => Buffer.from('image'), writeFile: async (_uri, bytes) => { savedBytes = bytes; } } },
    window: { activeTextEditor: { selection: {}, document: { getText: () => selected } },
      showInformationMessage: async text => notices.push(text), showErrorMessage: async text => notices.push(text),
      showOpenDialog: async () => openImage,
      showSaveDialog: async () => ({ path: '/tmp/mock-output.png' }),
      createWebviewPanel: () => ({ webview: { cspSource: 'vscode-webview:', asWebviewUri: uri => ({ toString: () => 'vscode-webview:' + uri.fsPath }),
        postMessage: async data => { sent.push(data); return true; }, onDidReceiveMessage: fn => { messageHandler = fn; return { dispose() {} }; } },
        onDidDispose() {}, reveal() {}, dispose() {} }) }
  };
  const sandbox = { exports: {}, require: name => name === 'vscode' ? vscode : require(name), Buffer, console };
  vm.runInNewContext(fs.readFileSync(path.join(extensionRoot, 'out/extension.js'), 'utf8'), sandbox);
  sandbox.exports.activate({ extensionUri: { fsPath: extensionRoot }, extensionPath: extensionRoot, subscriptions: [] });
  selected = '#4477AA'; commands.get('scientificColorDeck.lookupSelection')();
  await messageHandler({ type: 'ready' }); assert.equal(sent.at(-1).value, selected);
  await messageHandler({ type: 'copy', text: '#4477AA' }); assert.equal(clipboard[0], '#4477AA');
  await messageHandler({ type: 'copy', text: 'x'.repeat(100_001) }); assert.equal(clipboard.length, 1);
  openImage = [{ path: '/tmp/photo.png' }]; await messageHandler({ type: 'openImage' }); assert(sent.at(-1).data.startsWith('data:image/png;base64,'));
  await messageHandler({ type: 'saveImage', data: 'data:image/png;base64,aGVsbG8=' }); assert.equal(savedBytes.toString(), 'hello');
  await messageHandler({ type: 'saveImage', data: '<script>' }); assert(notices.some(n => n.includes('无效')));
  pass('扩展消息桥：选中色值、复制、打开及保存图片与边界校验');
  console.log('全部通过');
})().catch(err => { console.error(err); process.exitCode = 1; });

// Personal provenance and full thumbnail coverage.
const L = require('../media/personal-library');
const G = require('../media/chart-gallery');
assert.equal(L.summary.markdownImages, 44);
assert.equal(L.palettes.length, 32);
assert.equal(new Set(L.palettes.map(p => p.id)).size, L.palettes.length);
assert.equal(new Set(C.palettes.map(p => p.id)).size, C.palettes.length);
assert.equal(C.palettes.length, 100);
assert.equal(L.palettes.filter(p => p.origin === 'markdown').length, 24);
assert.equal(L.palettes.filter(p => p.origin === 'nature').length, 8);
assert.equal(L.charts.filter(c => c.sources.includes('markdown')).length, 31);
assert.equal(L.charts.filter(c => c.sources.includes('nature')).length, 41);
assert.equal(new Set(L.charts.flatMap(c => c.markdownImages)).size, 44);
assert.equal(new Set(L.palettes.flatMap(p => p.imageRefs || [])).size, 44);
assert(L.palettes.find(p => p.id === 'personal-coast-five').approximateIndices.includes(3));
assert(L.palettes.find(p => p.id === 'personal-navy-sand').issues.length);
const operations = [];
const context = new Proxy({ createRadialGradient: () => ({ addColorStop() {} }) }, {
  get: (object, name) => name in object ? object[name] : (...args) => operations.push([name, args]),
  set: (object, key, value) => { object[key] = value; return true; }
});
for (const chart of L.charts) {
  operations.length = 0;
  assert(G.draw({ width: 640, height: 400, getContext: () => context }, chart.id, L.palettes[0].colors), chart.id);
  assert(operations.some(([name]) => ['arc', 'stroke', 'fill', 'fillText'].includes(name)), chart.id + ' should draw content beyond the background');
}
pass('Personal 32组/60图种、44张来源覆盖、冲突标注及全部绘图分支');
new vm.Script(fs.readFileSync(path.join(__dirname, '../media/personal-library.js'), 'utf8'));
new vm.Script(fs.readFileSync(path.join(__dirname, '../media/chart-gallery.js'), 'utf8'));
assert(html.includes('__PERSONAL__') && html.includes('__GALLERY__'));
pass('图鉴资源脚本语法与 Webview 模板引用');

const O = require('../media/open-palettes');
assert.equal(O.palettes.length, 62);
assert.equal(new Set(O.palettes.map(p => p.colors.join(','))).size, 62);
for (const palette of O.palettes) {
 assert(palette.source.startsWith('https://'));
 assert(palette.license && palette.sourceVersion);
 assert(!palette.id.endsWith('_r'));
 const code = C.exportPalette(palette.colors, 'python', { type: palette.type });
 assert(code.includes(palette.type === 'qualitative' ? 'cycler' : 'ListedColormap'));
}
assert.deepEqual(O.palettes.find(p=>p.id==='open-category10').colors.slice(0,3), ['#1F77B4','#FF7F0E','#2CA02C']);
assert.equal(O.palettes.find(p=>p.id==='mpl-viridis').colors[0], '#440154');
assert.equal(O.palettes.find(p=>p.id==='mpl-viridis').colors.at(-1), '#FDE725');
assert.equal(O.palettes.find(p=>p.id==='mpl-hsv').sampling.endpoint, false);
assert(C.exportPalette(['#000000','#FFFFFF'],'matlab',{type:'sequential'}).includes('colormap(colors)'));
pass('100组总数、62组不重复开源方案、原始参考色、来源许可证和色图导出');

// Every Origin record must have a real renderer, finite geometry and traceable metadata.
const OL=require('../media/origin-library');
assert.equal(OL.sections.length,20);assert.equal(OL.charts.length,217);
assert.equal(new Set(OL.charts.map(c=>c.id)).size,217);
assert.equal(new Set(OL.sections.flatMap(s=>s.entries)).size,217);
for(const c of OL.charts){
 assert(c.source.startsWith(OL.source+'#'));assert(c.name&&c.englishName&&c.description&&c.dataHint);
 operations.length=0;
 assert(G.draw({width:720,height:480,getContext:()=>context},c.id,['#4477AA','#EE6677','#228833']),c.id);
 const geometry=operations.filter(([name])=>['lineTo','arc','ellipse','fillRect','bezierCurveTo'].includes(name));
 assert(geometry.length>2,c.id+' cannot be just a title');
 for(const [name,args] of geometry)for(const arg of args)if(typeof arg==='number')assert(Number.isFinite(arg),c.id+': '+name);
}
for(const file of ['origin-library.js','origin-charts.js'])new vm.Script(fs.readFileSync(path.join(__dirname,'../media',file),'utf8'));
assert(html.includes('__ORIGIN_LIBRARY__')&&html.includes('__ORIGIN_CHARTS__'));
pass('Origin 20分类/217图种变体、全部原创绘图分支、有限几何及来源记录');
