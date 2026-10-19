# Scientific Color Deck · 科研色卡

为 VS Code 科研绘图提供颜色查询、图片取色、配色预置与色觉缺陷预览。当前版本：**0.5.3**。

## 开始使用

VS Code 启动后，底部状态栏会显示 **科研绘图**。点击即可打开科研色卡；右键状态栏，在菜单中勾选或取消“科研绘图”可显示/隐藏这个入口。

在 VS Code 扩展商店搜索 **Scientific Color Deck**（Publisher：`YuHaoran251`），或搜索 `@id:YuHaoran251.scientific-color-deck` 安装。也支持本地 VSIX 安装。安装后在命令面板执行 **Scientific Color Deck: 打开科研色卡**。

也可以在编辑器里选中 `#4477AA`、`rgb(68,119,170)` 等色值，然后执行 **Scientific Color Deck: 查看选中颜色**。

## 1. 色值查询与图片取色

- 支持带或不带 `#` 的 3/4/6/8 位 HEX，以及 RGB / RGBA / HSL / HSLA。RGB 支持百分比；HSL 支持 deg、rad、turn、grad。
- 支持 148 个 CSS4 命名色、8 个 Matplotlib 简称，以及 transparent。
- 显示色块及 HEX、RGB、HSL、透明度，分别复制。
- 打开 PNG、JPEG、WebP、GIF、BMP，点击预览读取对应原图像素。聚焦图片后按 Enter 可读取中心点。
- 支持提取 4/6/8/10 个近似主色，并将它们转为配色代码。聚类基于最长边 256 像素的采样和确定性加权 k-means；主色是近似中心，精确色值应使用点取样。
- 图片限 15 MB、2000 万像素。图片经浏览器解码为 sRGB 像素，透明区域按白底合成；GIF 仅取静态帧。照片色值受光线、白平衡、压缩和色彩管理影响，不等于实物的绝对色值。
- 图片通过 VS Code 本地文件接口读取，在 Webview 内计算；不上传，无远程请求。

## 比颜色与命名色表

导航顺序：查颜色 → 比颜色 → 科研配色 → 图表图鉴 → 色觉检查。

在“比颜色”输入颜色 A / B，点击比较即可并排查看大色块、HEX、RGB 和透明度，也可交换两色。输入无效时显示具体错误并清除旧结果；透明色统一按白底显示。

下方提供 Matplotlib 颜色对照表：148 个 CSS4 命名色 + 8 个单字母简称，共 156 个名称（包含同色别名，不计入 100 组配色）。支持名称/HEX 搜索、复制色号和填入 A / B。查颜色同样支持这些名称。Matplotlib 简称 c/m/y 等与 CSS 的 cyan/magenta/yellow 色值不同，按 Matplotlib 原值保留。

## 2. 科研配色与代码

现有 **100 组配色：开源 62 组 + Personal 32 组 + 内置 6 组**。新增 ColorBrewer / D3 37 组、Matplotlib 25 组，覆盖分类、顺序、发散、循环和其他色图。支持按来源、类型、名称及色号筛选；每组显示来源、许可证及采样说明。完整新增清单见 `OPEN-PALETTES.md`。连续色图导出为 Python ListedColormap、R gradientn 或 MATLAB colormap，分类色仍导出为离散色循环。下表为最初预置；完整 Personal 清单见 `PERSONAL-CATALOG.md`：

| 配色 | 颜色数 | 说明 |
|---|---:|---|
| 参考图 1 · 红蓝对照 | 8 | 用户截图，保持标注顺序 |
| 参考图 2 · 蓝橙红 | 6 | 用户截图，保持标注顺序 |
| 参考图 3 · 雾蓝酒红 | 5 | 用户截图，保持标注顺序 |
| Tol Bright | 7 | 分组折线、散点 |
| Tol Vibrant | 7 | 鲜明的分组对比 |
| Tol Muted | 9 | 多类别；不包含原方案的缺失值浅灰 |
| Tol High Contrast | 3 | 少量分组、灰度打印；仅含三个数据色 |
| Ocean | 7 | 本项目自制顺序离散示例 |
| Balance | 7 | 本项目自制发散离散示例 |

四组 Tol 方案来源于 [Paul Tol, Colour Schemes, issue 3.2](https://sronpersonalpages.nl/~pault/data/colourschemes.pdf)。自制方案未经感知均匀性或色觉可辨识性认证。

可复制单色和 Python / Matplotlib、R / ggplot2、MATLAB、CSS、JSON 代码。顺序和发散预置导出的是离散色列表，不会自动创建连续色图；例如热图中可自行使用 Matplotlib 的 `ListedColormap(colors)`。

## 3. 色觉检查与对比度

- 对当前配色和图片比较原始颜色、红色觉缺陷（Protan）、绿色觉缺陷（Deutan）、蓝黄色觉缺陷（Tritan）和灰度效果。
- 色觉缺陷模拟采用 Machado 模型的完整程度（severity 1.0）矩阵，在线性 sRGB 中计算后裁剪并重新编码。矩阵来源和许可见 `THIRD-PARTY-NOTICES.md`。不提供轻重程度调节，不宣称与 Color Oracle / Coblis 的算法或结果完全相同。
- 图片模拟预览最长边 1000 像素，白底合成，可保存当前模拟结果为 PNG。导出的是该缩小预览，不是原始分辨率。
- 对比度采用 [WCAG 相对亮度算法](https://www.w3.org/WAI/WCAG21/Understanding/contrast-minimum.html)：普通文字 AA 4.5:1、大号文字 AA 3:1，以未四舍五入的比值判断。
- 色觉模拟供图表设计检查，不诊断个人色觉。文字对比度不是数据系列的可辨识性评分；应同时使用标记、线型和直接标签。

## 本地开发

```bash
npm ci
npm run check
```

在 VS Code 中打开文件夹后按 F5，启动扩展开发宿主。在新窗口命令面板打开科研色卡。开发配置位于 `.vscode/launch.json`。

纯浏览器 UI 预览（只监听 localhost，提供开发用文件选择和剪贴板适配）：

```bash
node tools/preview.js
# http://127.0.0.1:8765
```

浏览器预览不替代 VS Code 的真实扩展宿主验收；安装包的打开与保存图片功能由 VS Code API 完成。

检查包含颜色格式转换、透明度、WCAG 参考值、模拟参考向量、聚类占比、代码导出、前端 DOM 引用和消息桥。实际浏览器预览还验证了查询、图片取色/聚类、配色切换与 R 代码输出、色觉预览和对比度。

## 项目结构

- `src/extension.ts`：命令、Webview、剪贴板与图片读写。
- `media/color-core.js`：Node / Webview 共用的纯颜色算法、预置和导出。
- `media/app.js`：交互与本地 Canvas 处理。
- `media/index.html`、`media/style.css`：界面与主题适配。
- `tools/check.js`：不依赖真实 VS Code 的回归检查。

## 初版边界

关闭色卡页会释放图片；重新打开保留部分查询设置，但不持久保存图片或提取配色。不提供 OCR 读取照片中的文字色号、实时屏幕取色、CMYK / ICC 印刷色校准、科研数据绘制、全分辨率批量模拟或个人色觉测试。

三张参考图的 HEX、RGB 与可复制 Python 列表见 `REFERENCE-PALETTES.md`，结构化数据见 `reference-palettes.json`。参考图原作者及使用许可未核实；原图未随插件打包。

## Personal 分类与图表图鉴（0.2.0）

Personal 汇总此前三张配色图、个人 Markdown 的 44 张截图，以及 nature-figure 的配色和图种。默认在“科研配色”中显示，支持按来源、类别、名称和色值查找。

| 资料 | 配色组数 | 图形/图像面板种类 |
|---|---:|---:|
| Markdown（含此前三张） | 24，新增21组，重复截图合并 | 31 |
| nature-figure | 6套语义色表 + 2套默认循环 | 41（本次整理收录） |
| Personal 合计 | 32 | 合并去重60类 |

上游另外提供10个 atlas 家族、160个演示面板和5个可读取 CSV 的验证模板。160个面板包含重复图种，不能按160种图统计；skill本身也没有固定的能力上限。完整统计规则、截图编号映射、源文件位置和锁定提交见 `PERSONAL-CATALOG.md` 与 `personal-library.json`。

**图表图鉴**按钮集中展示60类原创缩略图，可按来源、分组和关键词过滤，点击放大，并使用当前选择的配色重绘。图形是演示用 Canvas 几何示意，不是真实数据、实验图像或统计结果，也不是60个生产绘图模板。

色号校核发现的差异已写在相应配色说明中：其中一组第4色的 RGB 标签错误重复，第4色暂用截图中心取样近似值；另有 HEX/RGB 标签冲突和标签/色块观感不一致。近似色号不应当作可靠原始色号。

已下载的上游完整仓库保存在 `sources/nature-skills`（不进入VSIX）。安装了 Codex 的 `nature-figure` 与其 `nature-shared` 依赖；之后的对话可使用。这里只提取配色与类型信息，没有执行上游绘图脚本，也没有复制第三方实验图片。

## Origin 来源图鉴（0.5.0）

在“图表图鉴”按**分组**查找：收录指定 Origin Graphing 主页面的20个分类、217条图种/结构变体；原Personal60类保留，跨来源不宣称全部去重。分类、分组、三维及控制图变体分别列出，颜色或数据变化不新增条目。范围不包含递归收录 More Graphs 外部图库。

每条提供中英文名称、用途、输入数据提示、原创合成示意、来源链接；支持搜索、类别筛选、每页36条、放大及保存PNG。选择科研配色后，示意图跟随重绘。所有资源随VSIX离线分发，不下载Origin图片、不需要安装Origin。

示意图不是Origin图表引擎或统计模板；3D使用固定二维投影，控制图不估计控制限，水化学图只介绍坐标布局。详细清单见 `ORIGIN-CATALOG.md` 与 `origin-library.json`。Origin仅用于标注信息来源，不表示官方合作。

图表图鉴已统一为“搜索 + 分组”，移除来源筛选及来源入口，277条图种/变体均按分组展示。卡片只显示分组，来源记录保留在详情与数据文件中。配色页分类不受影响。
