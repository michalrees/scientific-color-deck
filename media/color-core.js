/* Shared pure color calculations. See THIRD-PARTY-NOTICES.md for matrix attribution. */
(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.ColorCore = factory();
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';
  const clamp = (n, lo = 0, hi = 1) => Math.max(lo, Math.min(hi, n));
  const byte = n => Math.round(clamp(n, 0, 255));
  function hex(c, alpha = false) {
    return '#' + [c.r, c.g, c.b].concat(alpha ? [Math.round((c.a ?? 1) * 255)] : [])
      .map(n => byte(n).toString(16).padStart(2, '0')).join('').toUpperCase();
  }
  function hsl(c) {
    const r = c.r / 255, g = c.g / 255, b = c.b / 255;
    const max = Math.max(r, g, b), min = Math.min(r, g, b), d = max - min;
    let h = 0;
    const l = (max + min) / 2;
    if (d) {
      if (max === r) h = ((g - b) / d) % 6;
      else if (max === g) h = (b - r) / d + 2;
      else h = (r - g) / d + 4;
      h = (h * 60 + 360) % 360;
    }
    return { h, s: d ? d / (1 - Math.abs(2 * l - 1)) * 100 : 0, l: l * 100 };
  }
  function fromHsl(h, s, l, a = 1) {
    h = (h % 360 + 360) % 360 / 60; s /= 100; l /= 100;
    const c = (1 - Math.abs(2 * l - 1)) * s, x = c * (1 - Math.abs(h % 2 - 1)), m = l - c / 2;
    const rgb = h < 1 ? [c, x, 0] : h < 2 ? [x, c, 0] : h < 3 ? [0, c, x] : h < 4 ? [0, x, c] : h < 5 ? [x, 0, c] : [c, 0, x];
    return { r: byte((rgb[0] + m) * 255), g: byte((rgb[1] + m) * 255), b: byte((rgb[2] + m) * 255), a };
  }
  const number = /^[+-]?(?:\d+\.?\d*|\.\d+)(?:e[+-]?\d+)?$/i;
  function numeric(text, percentScale) {
    const percent = text.endsWith('%'), raw = percent ? text.slice(0, -1) : text;
    if (!number.test(raw)) throw Error('颜色分量必须是数字');
    const value = Number(raw) * (percent ? percentScale / 100 : 1);
    if (!Number.isFinite(value)) throw Error('颜色分量无效');
    return value;
  }
  function parseColor(input) {
    let text = String(input).trim().replace(/^(['"])(.*)\1$/, '$2').trim();
    const basic = { ...(typeof module === 'object' && module.exports ? require('./named-colors.js') : globalThis.NamedColors), transparent: '#00000000' };
    text = basic[text.toLowerCase()] || text;
    if (/^#?(?:[\da-f]{3}|[\da-f]{4}|[\da-f]{6}|[\da-f]{8})$/i.test(text)) {
      let raw = text.replace('#', '');
      if (raw.length <= 4) raw = raw.split('').map(c => c + c).join('');
      return { r: parseInt(raw.slice(0, 2), 16), g: parseInt(raw.slice(2, 4), 16), b: parseInt(raw.slice(4, 6), 16), a: raw.length === 8 ? parseInt(raw.slice(6), 16) / 255 : 1 };
    }
    const match = /^(rgba?|hsla?)\((.*)\)$/i.exec(text);
    if (!match) throw Error('支持 HEX、rgb()/rgba()、hsl()/hsla()，例如 #4477AA');
    const body = match[2].trim();
    if ((body.includes(',') && body.includes('/')) || body.split('/').length > 2) throw Error('颜色分隔符格式不正确');
    const parts = body.includes(',') ? body.split(',').map(s => s.trim()) : body.replace('/', ' / ').split(/\s+/).filter(s => s !== '/');
    if (parts.length !== 3 && parts.length !== 4) throw Error('需要三个颜色分量，可选一个透明度');
    const a = parts.length === 4 ? numeric(parts[3], 1) : 1;
    if (a < 0 || a > 1) throw Error('透明度应为 0–1 或 0%–100%');
    if (match[1].toLowerCase().startsWith('rgb')) {
      const rgb = parts.slice(0, 3).map(p => numeric(p, 255));
      if (rgb.some(v => v < 0 || v > 255)) throw Error('RGB 应为 0–255 或 0%–100%');
      return { r: byte(rgb[0]), g: byte(rgb[1]), b: byte(rgb[2]), a };
    }
    const hue = parts[0].match(/^([+-]?(?:\d+\.?\d*|\.\d+))(deg|rad|turn|grad)?$/i);
    if (!hue || !parts[1].endsWith('%') || !parts[2].endsWith('%')) throw Error('HSL 格式示例：hsl(210, 43%, 47%)');
    const factors = { deg: 1, rad: 180 / Math.PI, turn: 360, grad: 0.9 };
    const h = Number(hue[1]) * (factors[hue[2]?.toLowerCase()] || 1), s = numeric(parts[1], 100), l = numeric(parts[2], 100);
    if (!Number.isFinite(h) || s < 0 || s > 100 || l < 0 || l > 100) throw Error('HSL 的饱和度和亮度应为 0%–100%');
    return fromHsl(h, s, l, a);
  }
  const linear = v => { v /= 255; return v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; };
  const encoded = v => byte(255 * (v <= 0.0031308 ? 12.92 * v : 1.055 * Math.pow(v, 1 / 2.4) - 0.055));
  function composite(c, background = { r: 255, g: 255, b: 255 }) {
    const a = c.a ?? 1;
    return { r: byte(c.r * a + background.r * (1 - a)), g: byte(c.g * a + background.g * (1 - a)), b: byte(c.b * a + background.b * (1 - a)), a: 1 };
  }
  function luminance(c) { return 0.2126 * linear(c.r) + 0.7152 * linear(c.g) + 0.0722 * linear(c.b); }
  function contrast(fg, bg) {
    const background = composite(bg), foreground = composite(fg, background);
    const a = luminance(foreground), b = luminance(background);
    return (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
  }
  // Machado et al. full-severity matrices, applied to linear-light sRGB, then clipped and re-encoded.
  const matrices = {
    protan: [[0.152286, 1.052583, -0.204868], [0.114503, 0.786281, 0.099216], [-0.003882, -0.048116, 1.051998]],
    deutan: [[0.367322, 0.860646, -0.227968], [0.280085, 0.672501, 0.047413], [-0.011820, 0.042940, 0.968881]],
    tritan: [[1.255528, -0.076749, -0.178779], [-0.078411, 0.930809, 0.147602], [0.004733, 0.691367, 0.303900]]
  };
  function simulate(c, mode) {
    if (mode === 'normal') return { ...c };
    const rgb = [linear(c.r), linear(c.g), linear(c.b)];
    let transformed;
    if (mode === 'gray') { const l = luminance(c); transformed = [l, l, l]; }
    else {
      const matrix = matrices[mode];
      if (!matrix) throw Error('未知模拟模式');
      transformed = matrix.map(row => row.reduce((sum, x, i) => sum + x * rgb[i], 0));
    }
    return { r: encoded(clamp(transformed[0])), g: encoded(clamp(transformed[1])), b: encoded(clamp(transformed[2])), a: c.a ?? 1 };
  }
  function simulatePixels(pixels, mode) {
    const result = new Uint8ClampedArray(pixels.length);
    for (let i = 0; i < pixels.length; i += 4) {
      const color = simulate(composite({ r: pixels[i], g: pixels[i + 1], b: pixels[i + 2], a: pixels[i + 3] / 255 }), mode);
      result[i] = color.r; result[i + 1] = color.g; result[i + 2] = color.b; result[i + 3] = 255;
    }
    return result;
  }
  // Dominant colors use deterministic weighted k-means over a 5-bit RGB histogram.
  function dominantColors(pixels, count = 6) {
    count = Math.max(1, Math.min(12, Math.round(count)));
    const bins = new Map();
    for (let i = 0; i < pixels.length; i += 4) {
      if (pixels[i + 3] === 0) continue;
      const c = composite({ r: pixels[i], g: pixels[i + 1], b: pixels[i + 2], a: pixels[i + 3] / 255 });
      const key = (c.r >> 3) * 1024 + (c.g >> 3) * 32 + (c.b >> 3);
      const bin = bins.get(key) || { r: 0, g: 0, b: 0, n: 0 };
      bin.r += c.r; bin.g += c.g; bin.b += c.b; bin.n++; bins.set(key, bin);
    }
    const points = [...bins.values()].map(b => ({ r: b.r / b.n, g: b.g / b.n, b: b.b / b.n, n: b.n })).sort((a, b) => b.n - a.n);
    if (!points.length) return [];
    const distance = (a, b) => (a.r - b.r) ** 2 + (a.g - b.g) ** 2 + (a.b - b.b) ** 2;
    const centers = [{ ...points[0] }];
    while (centers.length < Math.min(count, points.length)) {
      let best = null, score = -1;
      for (const p of points) {
        const value = Math.min(...centers.map(c => distance(c, p))) * Math.sqrt(p.n);
        if (value > score) { score = value; best = p; }
      }
      if (score <= 0) break;
      centers.push({ ...best });
    }
    let sums;
    for (let iteration = 0; iteration < 12; iteration++) {
      sums = centers.map(() => ({ r: 0, g: 0, b: 0, n: 0 }));
      for (const p of points) {
        let nearest = 0;
        for (let j = 1; j < centers.length; j++) if (distance(p, centers[j]) < distance(p, centers[nearest])) nearest = j;
        const sum = sums[nearest]; sum.r += p.r * p.n; sum.g += p.g * p.n; sum.b += p.b * p.n; sum.n += p.n;
      }
      sums.forEach((sum, i) => { if (sum.n) centers[i] = { r: sum.r / sum.n, g: sum.g / sum.n, b: sum.b / sum.n }; });
    }
    const total = sums.reduce((sum, b) => sum + b.n, 0);
    return centers.map((c, i) => ({ color: { r: byte(c.r), g: byte(c.g), b: byte(c.b), a: 1 }, share: sums[i].n / total }))
      .filter(c => c.share > 0).sort((a, b) => b.share - a.share);
  }
  const tolSource = 'https://sronpersonalpages.nl/~pault/data/colourschemes.pdf';
  const builtins = [
    {"id": "reference-red-blue", "name": "参考图 1 · 红蓝对照", "type": "diverging", "note": "按参考图从左到右保留 8 色。可用作红蓝离散对照，未经感知均匀性或色觉可辨识性验证。", "colors": ["#8B001A", "#FF0022", "#FF8866", "#FFDDC1", "#A6E0EB", "#37C0DF", "#1696C9", "#0B5AA7"], "source": null, "attribution": "用户提供参考图 1，按标注色号整理；原作者及使用许可未核实。"},
    {"id": "reference-blue-orange-red", "name": "参考图 2 · 蓝橙红", "type": "diverging", "note": "按参考图从左到右保留 6 色。适合尝试双向对照，未经感知均匀性或色觉可辨识性验证。", "colors": ["#2267B0", "#6BAED6", "#C6E0EF", "#F8E1D5", "#F1996B", "#B7182B"], "source": null, "attribution": "用户提供参考图 2，按标注色号整理；原作者及使用许可未核实。"},
    {"id": "reference-muted-blue-red", "name": "参考图 3 · 雾蓝酒红", "type": "qualitative", "note": "按参考图从左到右保留 5 色。浅色在白底上对比度较低，绘制细线时请结合线型和标记。", "colors": ["#33395B", "#5D74A2", "#C4D8F2", "#F2E8E3", "#8E2D30"], "source": null, "attribution": "用户提供参考图 3，按标注色号整理；原作者及使用许可未核实。"},
    { id: 'tol-bright', name: 'Tol · Bright', type: 'qualitative', note: '7 色分类方案，适合多组折线和散点；灰色也可用于对照。', colors: ['#4477AA', '#EE6677', '#228833', '#CCBB44', '#66CCEE', '#AA3377', '#BBBBBB'], source: tolSource },
    { id: 'tol-vibrant', name: 'Tol · Vibrant', type: 'qualitative', note: '7 色分类方案，色彩较鲜明，适合分组比较。', colors: ['#0077BB', '#33BBEE', '#009988', '#EE7733', '#CC3311', '#EE3377', '#BBBBBB'], source: tolSource },
    { id: 'tol-muted', name: 'Tol · Muted', type: 'qualitative', note: '9 色分类方案，较柔和。仍需结合线型和点形区分多组数据。', colors: ['#332288', '#88CCEE', '#44AA99', '#117733', '#999933', '#DDCC77', '#CC6677', '#882255', '#AA4499'], source: tolSource },
    { id: 'tol-contrast', name: 'Tol · High Contrast', type: 'qualitative', note: '3 个数据色；适合少量分组和灰度打印。', colors: ['#004488', '#DDAA33', '#BB5566'], source: tolSource },
    { id: 'ocean', name: 'Ocean · 自制顺序色阶', type: 'sequential', note: '自制离散示例，由浅到深表达大小；未经感知均匀性验证。', colors: ['#EAF4F8', '#C8E4ED', '#91C6DB', '#559FC0', '#29749F', '#104B78', '#082A4A'], source: null },
    { id: 'balance', name: 'Balance · 自制发散色阶', type: 'diverging', note: '自制离散示例，中点浅色表示零或基准，两端表示偏离方向。', colors: ['#2B6085', '#659DBB', '#B4D2E0', '#F5F2EB', '#E6C69E', '#C68B57', '#8B4C2B'], source: null }
  ];
  const library = typeof module === 'object' && module.exports ? require('./personal-library.js') : globalThis.PersonalLibrary;
  const openLibrary = typeof module === 'object' && module.exports ? require('./open-palettes.js') : globalThis.OpenPalettes;
  const palettes = [...builtins.filter(p => !p.id.startsWith('reference-')).map(p => ({ ...p, collection: 'Built-in', origin: 'builtin' })), ...library.palettes, ...openLibrary.palettes];
  function exportPalette(colors, format, options = {}) {
    const safe = colors.map(c => hex(parseColor(c)));
    const quoted = safe.map(c => `"${c}"`).join(', ');
    const isMap = options.type && options.type !== 'qualitative';
    if (isMap && format === 'python') return `from matplotlib.colors import ListedColormap\n\ncolors = [${quoted}]\ncmap = ListedColormap(colors, name="custom_palette")\n# For continuous-valued data: plt.imshow(data, cmap=cmap)\n# Diverging data: set an explicit center (e.g. TwoSlopeNorm(vcenter=0)).\n`;
    if (isMap && format === 'r') return `colors <- c(${quoted})\n# ggplot2 continuous values:\n# + scale_color_gradientn(colours = colors)\n# + scale_fill_gradientn(colours = colors)\n# Diverging values require an explicit midpoint / rescaling.\n`;
    switch (format) {
      case 'python': return `import matplotlib.pyplot as plt\nfrom cycler import cycler\n\ncolors = [${quoted}]\nplt.rcParams["axes.prop_cycle"] = cycler(color=colors)\n`;
      case 'r': return `colors <- c(${quoted})\n# ggplot2:\n# + scale_color_manual(values = colors)\n# + scale_fill_manual(values = colors)\n`;
      case 'matlab': return `colors = [\n${safe.map(c => { const p = parseColor(c); return `    ${[p.r, p.g, p.b].join(' ')};`; }).join('\n')}\n] / 255;\n${isMap ? 'colormap(colors);' : 'colororder(colors);'}\n`;
      case 'css': return `:root {\n${safe.map((c, i) => `  --color-${i + 1}: ${c};`).join('\n')}\n}\n`;
      case 'json': return JSON.stringify(safe, null, 2);
      default: throw Error('未知导出格式');
    }
  }
  return { parseColor, hex, hsl, fromHsl, composite, contrast, luminance, simulate, simulatePixels, dominantColors, palettes, exportPalette };
});
