"""Rebuild curated metadata from audited image labels and a pinned nature-figure snapshot.
No third-party scripts are executed. Browser thumbnails are original illustrative UI drawings.
"""
import ast,json,re,hashlib
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]
MD=Path('/home/yuhaoran/Temp/New_Markdown.md')
REPO=Path('/tmp/nature-skills-source')
COMMIT='6827ae57b62b201acd06b401619050411c0d82f6'
refs=re.findall(r'!\[[^]]*\]\(([^)]+)\)',MD.read_text())
prior=json.loads((ROOT/'reference-palettes.json').read_text())
palettes=[]
def palette(id,name,values,images,kind='qualitative',note='',**extra):
 colors=[v.upper() if isinstance(v,str) else '#'+''.join(f'{x:02X}' for x in v) for v in values]
 p=dict(id=id,name=name,colors=colors,type=kind,collection='Personal',origin='markdown',source=None,
  note=note or '按截图标注整理，保持顺序；未经色觉可辨识性认证。',attribution='个人提供的配色参考，原作者及使用许可未核实。',imageRefs=images,**extra)
 palettes.append(p)
for i,p in enumerate(prior,1): palette(p['id'],p['name'],p['hex'],[i],kind='diverging' if i<3 else 'qualitative',originLabel='此前三张参考图与 Markdown 重复，合并为同一项')
palette('personal-teal-lime','Personal · 青绿柠黄',['#46788E','#78B7C9','#F6E093','#E58B7B','#97B319'],[4])
palette('personal-pastel-six','Personal · 六色马卡龙',['#F9EBA7','#FBD6BE','#F6C0CE','#CAC0E3','#ABDAEC','#97D1A0'],[5])
palette('personal-navy-sand','Personal · 藏蓝沙金',['#203888','#518DDD','#A7D2E4','#F5D7A3','#E19C66'],[6],note='以 HEX 标注为准；第2色 HEX #518DDD 对应 RGB(81,141,221)，原图 RGB 标签写成 219。',issues=['第2色 HEX 与 RGB 标签冲突，采用 HEX。'])
palette('personal-powder-five','Personal · 粉蓝奶杏',[(249,208,175),(163,201,226),(221,199,239),(255,221,222),(242,171,171)],[7],note='末色文字位于截图右边缘，按可见 RGB(242,171,171) 记录。')
palette('personal-earth-seven','Personal · 山海七色',[(38,70,83),(40,114,113),(41,157,143),(138,176,125),(232,197,107),(243,162,97),(230,111,81)],[8,9])
palette('personal-navy-gold','Personal · 蓝金朱红',[(73,148,196),(18,38,79),(250,192,61),(234,85,20)],[10])
palette('personal-violet-coral','Personal · 紫蓝暖橙',[(67,57,148),(128,166,226),(251,221,133),(244,111,67),(207,67,62)],[11,22,23,24])
palette('personal-coral-aqua','Personal · 珊瑚青绿',[(240,120,106),(255,188,64),(12,188,192)],[12])
palette('personal-rust-teal','Personal · 赤金湖绿',[(174,32,18),(238,150,0),(9,147,150)],[13])
palette('personal-terrain-ten','Personal · 山川十色',[(231,98,84),(239,138,71),(247,170,88),(255,208,111),(235,230,183),(170,220,224),(114,188,213),(82,143,173),(55,103,149),(30,70,110)],[14,17,19],kind='diverging')
palette('personal-coast-five','Personal · 海岸五色',[(55,103,149),(114,188,213),(255,208,111),'#DC5358',(170,220,224)],[15,16,18],note='第4色原 RGB 标签误重复第2色，暂用截图色块中心近似取样 #DC5358；该色不是可靠的原始色号。',issues=['第4色为截图近似取样，其余为标注值。'],approximateIndices=[3],rawConflictingRGB=[114,188,213])
palette('personal-muted-five','Personal · 柔雾五色',[(231,168,184),(152,176,209),(247,194,179),(195,182,230),(142,198,210)],[20])
palette('personal-bold-four','Personal · 黑金蓝红',[(33,29,31),(242,146,33),(11,112,183),(193,40,45)],[21,31])
palette('personal-cyan-lime','Personal · 青蓝活力',[(144,201,230),(33,158,188),(2,48,71),(251,132,2),(122,201,67)],[25,27])
palette('personal-blue-peach','Personal · 雾蓝桃红',[(130,176,210),(255,190,122),(250,127,111)],[26,28])
palette('personal-purple-gold-red','Personal · 紫黄红渐变',[(64,57,144),(255,210,45),(207,67,63)],[26,28],kind='diverging',note='同一截图下半部的独立三色渐变；与上半部三色分类组分开统计。')
palette('personal-pink-mint','Personal · 玫粉薄荷',[(237,120,158),(101,169,220),(208,235,236)],[29,33])
palette('personal-blue-wine','Personal · 蓝珊瑚酒红',[(65,137,200),(243,126,120),(141,23,85)],[30,32])
palette('personal-rainbow-seven','Personal · 明亮七色',[(212,63,58),(238,162,54),(92,184,92),(70,184,218),(53,126,189),(150,50,184),(184,184,184)],[34,35,36],note='严格按 RGB 标签整理；第5色色块看起来偏浅青，与标注 #357EBD 不一致，仍保留标注值。',issues=['第5色标签与截图色块观感不一致。'])
palette('personal-lilac-six','Personal · 丁香六色',[(196,137,255),(255,153,153),(255,230,153),(180,199,231),(169,209,142),(191,191,191)],[37,38])
palette('personal-coral-ice','Personal · 珊瑚冰蓝',[(236,128,76),(119,214,221),(154,218,250),(167,181,253),(255,57,56)],[39,40,41,42,43,44])
# Extract only literal palette dictionaries / default cycles from the public API reference.
api=(REPO/'skills/nature-figure/references/api.md').read_text();block=re.search(r'```python\n(PALETTE = .*?)```',api,re.S).group(1)
values={}
for node in ast.parse(block).body:
 if isinstance(node,ast.Assign):
  name=node.targets[0].id
  if isinstance(node.value,ast.Dict):values[name]=ast.literal_eval(node.value)
  elif isinstance(node.value,ast.List):values[name]=[values[x.value.id][ast.literal_eval(x.slice)] for x in node.value.elts]
names={'PALETTE':'Nature · 基础语义色','PALETTE_NMI_PASTEL':'Nature · NMI Pastel 语义色','PALETTE_NATURE_IMAGING':'Nature · 成像荧光','PALETTE_NATURE_MATERIAL':'Nature · 材料机制','PALETTE_NATURE_CLINICAL':'Nature · 临床随访','PALETTE_NATURE_GENOMICS':'Nature · 基因组学','DEFAULT_COLORS':'Nature · 默认六色循环','DEFAULT_COLORS_NMI_PASTEL':'Nature · NMI 六色循环'}
for key,data in values.items():
 palettes.append(dict(id='nature-'+key.lower(),name=names[key],type='qualitative',collection='Personal',origin='nature',colors=list(data.values()) if isinstance(data,dict) else data,colorNames=list(data) if isinstance(data,dict) else [],source=f'https://github.com/Yuan1z0825/nature-skills/blob/{COMMIT}/skills/nature-figure/references/api.md',attribution='nature-figure API 配色定义；语义色字典不代表推荐将全部颜色同时作为分类色。',note='语义角色色表，按原字典顺序保留。' if isinstance(data,dict) else '按上游默认循环顺序保留的6色组合。',upstreamKey=key))
# Registry counts chart kinds, not example-panel count; repeat datasets and colors do not create a kind.
charts=[]
def chart(id,name,family,note,md=None,nature=None):
 charts.append(dict(id=id,name=name,family=family,description=note,markdownImages=md or [],natureReferences=nature or [],collection='Personal',illustrative=True))
def a(n):
 names=['bar-charts','line-trends','heatmaps','scatter-bubble','radar-polar','distributions','forest-interval','area-stacked','image-plates','network-matrix']
 return [f'assets/chart-atlas/atlas-{n:02d}-{names[n-1]}.png']
chart('bar','单系列柱状图','比较','比较独立类别的量值。',[25],a(1))
chart('grouped-bar','分组柱状图','比较','同一类别内比较多个系列；误差条可表达不确定性。',[1,2,3,4,5,6],a(1))
chart('stacked-bar','堆叠柱状图','组成','展示各类别的总量与内部组成。',[3,4,5],a(1))
chart('horizontal-stacked','水平百分比堆叠条形图','组成','用于问卷或各组比例，示意中每行总和为100%。',[4,7,8,15,16,18,20,22,24,25,27,34,37,39,42])
chart('signed-bar','正负差值柱状图','比较','围绕零比较增减或差值。',nature=a(1))
chart('log-bar','对数柱状图','比较','比较跨数量级的正值。',nature=['references/chart-types.md#log-scale-bar-chart'])
chart('line','多系列折线图','趋势','展示有序横轴上的连续变化。',[1,2,3,4],a(2))
chart('ribbon','带置信带折线图','趋势','趋势线与其不确定性范围。',[5],a(2))
chart('error-line','带误差条折线图','趋势','各测量点的误差条与连接趋势。',[6])
chart('event-line','事件标记趋势图','趋势','标出干预或事件发生时点。',nature=a(2))
chart('individual-traces','个体轨迹叠加图','趋势','个体变化与总体趋势同时展示。',nature=a(2))
chart('step','阶梯趋势图','趋势','分段保持、离散时点更新的变化。',[7,8,10,15,16,18,20,21,22,24,31,34,37,39,42])
chart('gradient-line','连续着色曲线','趋势','同一曲线沿位置或数值连续编码颜色。',[26,28,36,40,43])
chart('heatmap','矩阵热图','矩阵','用色阶编码矩阵数值，需说明色条单位。',[1,4,6,9,11,22,23,36],a(3))
chart('sequential-heatmap','顺序色阶热图','矩阵','非负或单向大小变化使用浅深色阶。',nature=a(3))
chart('annotated-heatmap','数值标注热图','矩阵','在色格中显示具体数值。',nature=a(3))
chart('cluster-heatmap','聚类热图','矩阵','热图配合行列层次聚类树。',[2,3,5,11,22,23])
chart('scatter','连续着色散点图','关系','点的位置表达双变量，颜色可表达第三个量。',[1])
chart('regression','散点与回归线','关系','展示双变量关系及拟合趋势；示意不用于推断。',[3,5,6],a(4))
chart('clusters','分簇散点图','关系','以颜色区分不同点群。',nature=a(4))
chart('bubble','气泡散点图','关系','点的面积与颜色表达额外变量。',[2],a(4))
chart('volcano','火山图','关系','效应大小与负对数显著性，阈值线仅为演示。',nature=a(4)+['references/template-catalog.md#volcano'])
chart('radar','雷达图','极坐标','在多维轴上比较轮廓；不同轴需可比。',nature=a(5))
chart('polar-bars','极坐标柱状图','极坐标','按方向或周期分组比较幅度。',nature=a(5))
chart('polar-density','极坐标密度曲线','极坐标','方向或周期变量的连续分布。',nature=a(5))
chart('polar-scatter','极坐标散点图','极坐标','以角度和半径放置观测点。',[11,22,23,35,38,40,43])
chart('sector-bubble','扇形坐标气泡图','极坐标','极坐标扇区内以气泡面积编码数值，并非三元图。',[11,22,23,35,38,40,43])
chart('annular-scatter','环形坐标散点图','极坐标','点布置在环带中，用角度表达周期。',[11,22,23,35,38,40,43])
chart('globe','球面投影散点图','空间','以投影球面上的点示意空间分布。',[11,22,23,35,38,40,43])
chart('histogram','直方图','分布','按连续数值区间统计频数。',[13],a(6))
chart('grouped-histogram','分组直方图','分布','多个分布使用同一组区间并排比较。',[7,8,10,12,13,15,16,18,20,21,24,25,26,27,28,29,30,31,32,33,34,35,37,38,39,41,42,44])
chart('stacked-histogram','堆叠直方图','分布','在共同区间上堆叠多个分布的频数。',[10,12,13,26,28,29,30,32,33,35,38,41,44])
chart('step-histogram','轮廓直方图','分布','仅绘制各分布的直方轮廓。',[10,12,13,26,28,29,30,32,33,35,38,41,44])
chart('density','概率密度曲线','分布','平滑分布形状，须注明密度估计方法。',[41,44])
chart('violin','小提琴图','分布','对称密度展示分布形状。',nature=a(6))
chart('box','箱线图','分布','显示中位数、四分位范围及须。',nature=a(6))
chart('violin-box','小提琴与箱线组合图','分布','密度形状与分位数摘要合并显示。',[5,6])
chart('ridgeline','山脊密度图','分布','多个分布沿基线错位堆叠。',nature=a(6))
chart('forest','森林图','区间','点估计与水平置信区间。',nature=a(7))
chart('paired','配对斜率图','区间','同一对象两条件之间的对应变化。',nature=a(7)+['references/template-catalog.md#paired'])
chart('point-range','点区间图','区间','点估计与垂直不确定性区间。',nature=a(7))
chart('area','填充面积趋势图','组成','单条趋势到基线的填充。',nature=a(8))
chart('stacked-area','堆叠面积图','组成','总量和各组随时间的组成变化。',[1,2,6],a(8))
chart('stream','流图','组成','以变化基线排列多个连续组成。',nature=a(8))
chart('cumulative','累计趋势图','组成','表现非递减累计量或累计贡献。',nature=a(8))
chart('donut','环形图','组成','显示少量类别占整体的比例。',[2,3])
chart('contour','填色等值线图','空间','用等值线与色带表达二维连续场。',[1])
chart('surface','三维曲面图','空间','以高度和颜色表达二维位置上的数值。',[9,14,17,19])
chart('joint','散点与边际直方图','关系','联合分布和各变量的一维边际分布。',[13,29,30,32,33,41,44],['references/template-catalog.md#marginal'])
chart('density2d','二维密度着色散点图','关系','用颜色表达点云局部密度。',[40,43])
chart('image-channel','单通道图像面板','成像','模拟荧光单通道示意；不是显微实验图。',[11,22,23,36],a(9))
chart('image-merge','多通道合并面板','成像','模拟多通道叠加示意，不作为实验图像。',nature=a(9))
chart('image-crop','图像局部放大面板','成像','用裁剪框定位局部区域，示意图无真实标尺。',nature=a(9))
chart('bubble-matrix','气泡矩阵 / 标记点图','矩阵','行列类别、点面积与颜色联合编码。',nature=a(10)+['references/template-catalog.md#dotplot'])
chart('adjacency','邻接矩阵热图','矩阵','以矩阵表达节点间的连接关系。',nature=a(10))
chart('network','节点连线网络图','网络','节点与边表达关系结构。',nature=a(10))
chart('bipartite','二部关系图','网络','两组节点之间的连接。',nature=a(10))
chart('roc','ROC 曲线','评价','真阳性率对假阳性率，示意不表示模型性能。',nature=['references/template-catalog.md#roc'])
chart('sphere-concept','球体概念示意图','概念','用带明暗的圆盘示意球体，不是数据图。',nature=['references/chart-types.md#3d-sphere-conceptual-illustration'])
chart('manifold','概率与流形概念图','概念','概念性概率曲线及嵌入流形示意。',nature=['references/chart-types.md#probability-manifold-concept-panel'])
# Explicit source-to-kind mapping with image-level provenance, not inferred panel counts.
for c in charts:
 c['sources']=(['markdown'] if c['markdownImages'] else [])+(['nature'] if c['natureReferences'] else [])
summary={'markdownImages':len(refs),'markdownPalettes':sum(p['origin']=='markdown' for p in palettes),'priorImagePalettes':3,
 'markdownNewPalettes':sum(p['origin']=='markdown' for p in palettes)-3,
 'markdownChartKinds':sum(bool(c['markdownImages']) for c in charts),
 'naturePaletteDictionaries':sum(k.startswith('PALETTE') for k in values),
 'natureDefaultCycles':sum(k.startswith('DEFAULT') for k in values),
 'natureAtlasFamilies':10,'natureAtlasExamplePanels':160,'natureAtlasNormalizedKinds':36,'natureCsvTemplates':5,
 'natureCatalogKinds':sum(bool(c['natureReferences']) for c in charts),'combinedChartKinds':len(charts),'personalPalettes':len(palettes),
 'natureCommit':COMMIT,'countingRule':'图种按此注册表去重；相同图种的配色/数据变化不重复计数。能力不限于这些已收录示例。'}
manifest={'summary':summary,'palettes':palettes,'charts':charts,'sourceImages':[{'index':i+1,'name':Path(r).name,'sha256':hashlib.sha256((MD.parent/r).read_bytes()).hexdigest()} for i,r in enumerate(refs)],
 'notice':'缩略图由插件以演示数据原创绘制；不是论文结果，不是从资料复制的实验图。'}
(ROOT/'media/personal-library.js').write_text('(function(root,factory){if(typeof module==="object"&&module.exports)module.exports=factory();else root.PersonalLibrary=factory();})(typeof globalThis!=="undefined"?globalThis:this,function(){return '+json.dumps(manifest,ensure_ascii=False,indent=2)+';});\n')
(ROOT/'personal-library.json').write_text(json.dumps(manifest,ensure_ascii=False,indent=2)+'\n')
lines=['# Personal 资料汇总','', '## 统计口径','',json.dumps(summary,ensure_ascii=False,indent=2),'','## 配色清单','']
for p in palettes:
 lines+=['### '+p['name'],'',p['note'],'','来源：'+p['origin']+'；截图编号：'+', '.join(map(str,p.get('imageRefs',[]))),'','| HEX | RGB |','|---|---|']
 for h in p['colors']:lines+=['| `'+h+'` | `'+', '.join(str(int(h[i:i+2],16)) for i in [1,3,5])+'` |']
 lines+=['']
lines+=['## 图种清单','','| 图种 | 分组 | 个人资料截图编号 | nature-figure 来源 |','|---|---|---|---|']
for c in charts:lines+=['| '+c['name']+' | '+c['family']+' | '+','.join(map(str,c['markdownImages']))+' | '+'; '.join(c['natureReferences'])+' |']
lines+=['','上游固定版本：`'+COMMIT+'`。10 张 atlas 每张 16 个示例共 160 个面板，并不是 160 个不同图种。5 个 CSV 模板也不是该 skill 的全部能力。','个人截图含重复内容，已按相同色值和顺序合并；源图未随插件分发。']
(ROOT/'PERSONAL-CATALOG.md').write_text('\n'.join(lines)+'\n')
print(json.dumps(summary,ensure_ascii=False,indent=2))
