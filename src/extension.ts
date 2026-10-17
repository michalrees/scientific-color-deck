import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';
import { randomBytes } from 'crypto';

const MAX_IMAGE_BYTES = 15 * 1024 * 1024;

export function activate(context: vscode.ExtensionContext): void {
  let panel: vscode.WebviewPanel | undefined;
  let ready = false;
  let pendingSelection: string | undefined;
  let openingImage = false;
  let savingImage = false;
  const show = (selection?: string): void => {
    if (selection !== undefined) { pendingSelection = selection; }
    if (panel) {
      panel.reveal(vscode.ViewColumn.Beside);
      if (ready && pendingSelection !== undefined) {
        void panel.webview.postMessage({ type: 'lookup', value: pendingSelection });
        pendingSelection = undefined;
      }
      return;
    }
    const media = vscode.Uri.joinPath(context.extensionUri, 'media');
    const created = vscode.window.createWebviewPanel('scientificColorDeck', '科研色卡 · Color Deck', vscode.ViewColumn.Beside,
      { enableScripts: true, localResourceRoots: [media], retainContextWhenHidden: true });
    panel = created;
    ready = false;
    const nonce = randomBytes(24).toString('base64');
    const resource = (file: string) => created.webview.asWebviewUri(vscode.Uri.joinPath(media, file)).toString();
    let html = fs.readFileSync(path.join(context.extensionPath, 'media', 'index.html'), 'utf8');
    html = html.replace(/__CSP__/g, created.webview.cspSource).replace(/__NONCE__/g, nonce)
      .replace(/__STYLE__/g, resource('style.css')).replace(/__CORE__/g, resource('color-core.js'))
      .replace(/__APP__/g, resource('app.js')).replace(/__PERSONAL__/g, resource('personal-library.js')).replace(/__GALLERY__/g, resource('chart-gallery.js')).replace(/__OPEN__/g, resource('open-palettes.js')).replace(/__NAMES__/g, resource('named-colors.js')).replace(/__ORIGIN_LIBRARY__/g, resource('origin-library.js')).replace(/__ORIGIN_CHARTS__/g, resource('origin-charts.js'));
    created.webview.html = html;
    const messages = created.webview.onDidReceiveMessage(async (message: unknown) => {
      if (!message || typeof message !== 'object') { return; }
      const msg = message as { type?: string; text?: string; data?: string };
      try {
        if (msg.type === 'ready') {
          ready = true;
          if (pendingSelection !== undefined) {
            await created.webview.postMessage({ type: 'lookup', value: pendingSelection });
            pendingSelection = undefined;
          }
        } else if (msg.type === 'copy' && typeof msg.text === 'string' && msg.text.length <= 100_000) {
          await vscode.env.clipboard.writeText(msg.text);
          await created.webview.postMessage({ type: 'status', text: '已复制到剪贴板' });
        } else if (msg.type === 'openImage' && !openingImage) {
          openingImage = true;
          try {
            const selected = await vscode.window.showOpenDialog({ canSelectMany: false, openLabel: '打开并取色',
              filters: { '图片': ['png', 'jpg', 'jpeg', 'webp', 'gif', 'bmp'] } });
            if (!selected?.[0]) { return; }
            const uri = selected[0];
            const info = await vscode.workspace.fs.stat(uri);
            if (info.size > MAX_IMAGE_BYTES) { throw new Error('图片超过 15 MB，请先缩小文件。'); }
            const bytes = await vscode.workspace.fs.readFile(uri);
            if (bytes.byteLength > MAX_IMAGE_BYTES) { throw new Error('图片超过 15 MB。'); }
            const mime: Record<string, string> = { '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg',
              '.webp': 'image/webp', '.gif': 'image/gif', '.bmp': 'image/bmp' };
            const type = mime[path.extname(uri.path).toLowerCase()];
            if (!type) { throw new Error('暂不支持此图片格式，请使用 PNG、JPEG、WebP、GIF 或 BMP。'); }
            await created.webview.postMessage({ type: 'image', name: path.basename(uri.path),
              data: `data:${type};base64,${Buffer.from(bytes).toString('base64')}` });
          } finally { openingImage = false; }
        } else if (msg.type === 'saveImage' && !savingImage && typeof msg.data === 'string') {
          if (!/^data:image\/png;base64,[A-Za-z0-9+/=]+$/.test(msg.data) || msg.data.length > 24 * 1024 * 1024) {
            throw new Error('导出图片数据无效或过大。');
          }
          savingImage = true;
          try {
            const target = await vscode.window.showSaveDialog({ filters: { 'PNG 图片': ['png'] }, saveLabel: '保存模拟预览' });
            if (!target) { return; }
            await vscode.workspace.fs.writeFile(target, Buffer.from(msg.data.split(',')[1], 'base64'));
            await created.webview.postMessage({ type: 'status', text: '模拟预览已保存' });
          } finally { savingImage = false; }
        }
      } catch (err) {
        const text = err instanceof Error ? err.message : String(err);
        void vscode.window.showErrorMessage('Scientific Color Deck：' + text);
        await created.webview.postMessage({ type: 'status', text });
      }
    });
    created.onDidDispose(() => { messages.dispose(); if (panel === created) { panel = undefined; ready = false; } });
  };
  context.subscriptions.push(
    vscode.commands.registerCommand('scientificColorDeck.open', () => show()),
    vscode.commands.registerCommand('scientificColorDeck.lookupSelection', () => {
      const editor = vscode.window.activeTextEditor;
      const selected = editor?.document.getText(editor.selection).trim();
      if (!selected || selected.length > 256) {
        void vscode.window.showInformationMessage('先在编辑器中选中一个颜色代码，例如 #4477AA 或 rgb(68,119,170)。');
        return;
      }
      show(selected);
    }),
    { dispose: () => panel?.dispose() }
  );
}
