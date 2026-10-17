"""Curated type/variant index; descriptions and demo geometry are original.
The main Graphing page is the scope, not every externally linked gallery.
"""
from pathlib import Path
import json
ROOT=Path(__file__).resolve().parents[1]
URL='https://www.originlab.com/index.aspx?go=Products/Origin/Graphing'
ANCHORS=dict(zip(['Line_and_Symbol','Column_and_Bar','Pie_and_Doughnut','MultiAxis','Waterfall','Contour','3D','Grouped','Categorical','Hierarchy','Statistics','Quality','Specialized','Polar','Vector','Ternary','Hydrochemistry','Profile','Function','Image'],['Line_26_Symbol_Graphs','Column_26_Bar_Graphs','Pie_and_Doughnut_Charts','Multi-Axis_26_Multi-Panel_Graphs','Waterfall_Graphs','Contour_26_Heatmap','3D_Graphs','Grouped_Data_Plot','Categorical_Special_Diagrams_28Parallel2C_Alluvial2C_Sankey2C_Chord2C_Network2C_Ribbon29','Hierarchical_Diagrams','Statistical_Graphs','Quality_Improvement_Graphs','Specialized_Graphs','Polar_and_Radial_Graphs','Vector_and_Streamline_Plots','Ternary_Diagrams','Hydrochemistry_Diagrams','Profile_Plots','Function_Plot','Image_Graphs']))
charts=[];sections=[]
def group(family,anchor,rows):
 section={'name':family,'source':URL+'#'+ANCHORS[anchor],'entries':[]};sections.append(section)
 for row in rows.strip().splitlines():
  slug,en,cn,recipe,*extra=row.split('|');variant=extra[0] if extra else ''
  id='origin-'+slug
  chart=dict(id=id,name=cn,englishName=en,family=family,sources=['origin'],source=section['source'],recipe=recipe,variant=variant,markdownImages=[],natureReferences=[])
  chart['description']=NOTES[recipe]+' 示例采用确定性合成数据，仅解释结构；不执行 Origin 的统计分析。'
  chart['dataHint']=DATA[recipe];chart['illustration']='original synthetic Canvas illustration';charts.append(chart);section['entries'].append(id)
NOTES={
'line':'以线段组织连续观测，比较变化方向。','scatter':'用点的位置编码两变量，附加的尺寸或色彩表示额外维度。','area':'用基线与曲线间的面积表达量值。','bar':'用条长比较类别；堆叠、分组和浮动是不同的组织方式。','pie':'用扇形比较组成；环形保留中心空白。','multi':'以多个坐标轴或小面板展示不同尺度或分组。','waterfall':'将多条曲线沿方向错开，便于检查峰形。','heat':'将数值映射到单元颜色；等值线连接相同水平。','three':'用透视投影展示三维数据结构。','distribution':'用频数或分布形状概括样本。','box':'以箱体和须概括分布，密度轮廓补充形状。','interval':'以点和区间表示估计值及其范围。','qq':'比较排序后的分位数或累计概率。','flow':'用连接和带宽表达类别之间的流动。','hierarchy':'用嵌套面积或层级连接组织父子关系。','dendrogram':'用分支结构表示层级合并关系。','quality':'沿观测次序展示过程或因素效应；参考线只为示意。','special':'用专门的坐标或图形构件表达领域变量。','polar':'以角度和半径组织方向性数据。','vector':'用箭头的方向及长度表示二维或三维场。','ternary':'将三个非负分量归一化后映射到三角形。','hydro':'用离子组成的标准坐标结构比较水样。','profile':'在二维场上选取剖线，并绘出对应的一维截面。','function':'用显式或参数方程生成曲线或曲面。','image':'用合成像素场展示图像及截面关系。'}
DATA={k:'示意输入：X、Y 数值列；分组或附加维度由颜色区分。' for k in NOTES}
DATA.update(ternary='示意输入：A、B、C 非负分量（总和归一化）；可附加 Z 或向量。',hydro='示意输入：水样离子当量；实际分析须先验证单位与电荷平衡。',quality='示意输入：按时间或因素排列的观测；控制限需按实际过程估计，本图不作判异。',three='示意输入：X、Y、Z 或规则矩阵，可选颜色映射变量。',heat='示意输入：矩阵或 XYZ 网格；颜色表示标量。',flow='示意输入：节点、来源、目标及非负流量。',profile='示意输入：二维标量矩阵与剖线坐标。',image='示意输入：二维像素矩阵；此处不包含网站原图。')
group('线与符号','Line_and_Symbol', '''line|Line|折线图|line
row-line|Row-wise Line Series|逐行线序列|line|row
lollipop|Lollipop|棒棒糖图|line|lollipop
scatter|Scatter|散点图|scatter
xy-error|XY Error Scatter|XY误差散点图|scatter|error
column-scatter|Column Scatter|列散点图|scatter|column
drop-line|Drop Line|垂线散点图|scatter|drop
color-scatter|Color-mapped Scatter|颜色映射散点图|scatter|color
size-scatter|Size-mapped Scatter|大小映射散点图|scatter|size
line-symbol|Line and Symbol|线加符号图|line|symbol
area|Area|面积图|area
stacked-area|Stacked Area|堆叠面积图|area|stacked
fill-area|Fill Area|曲线间填充|area|between
density-dots|Density Dots|密度散点图|scatter|density
anomaly-line|Anomaly Line|正负异常折线|line|anomaly
anomaly-column|Anomaly Columns|正负异常柱形|bar|anomaly
anomaly-area|Anomaly Area|正负异常面积|area|anomaly
error-band|Filled Error Band|填充误差带|area|band''')
group('柱形与条形','Column_and_Bar', '''column|Column|柱形图|bar
bar|Bar|横向条形图|bar|horizontal
stacked-column|Stacked Column|堆叠柱形图|bar|stacked
stacked-bar|Stacked Bar|堆叠条形图|bar|horizontal stacked
grouped-column|Grouped Column|分组柱形图|bar|grouped
grouped-bar|Grouped Bar|分组条形图|bar|horizontal grouped
floating-column|Floating Column|浮动柱形图|bar|floating
floating-bar|Floating Bar|浮动条形图|bar|horizontal floating
group-floating-column|Grouped Floating Column|分组浮动柱形|bar|grouped floating
group-floating-bar|Grouped Floating Bar|分组浮动条形|bar|horizontal grouped floating
column3d|3D Column|三维柱形图|three|bar
bar-map|Bar Map|地图柱形符号|special|bar-map
spiral-bar|Spiral Bar|螺旋条形图|polar|spiral
grouped-stacked|Grouped Stacked Column|分组堆叠柱形|bar|grouped stacked
percent-column|100% Stacked Column|百分比堆叠柱形|bar|percent stacked
bar-connected|Bar with Connected Lines|柱形连接线|bar|connected''')
group('饼图与环形','Pie_and_Doughnut', '''pie|2D Pie|二维饼图|pie
pie3d|3D Pie|三维饼图|pie|3d
donut|Doughnut|环形图|pie|donut
pie-map|Pie Map|地图饼图符号|special|pie-map
pie-of-pie|Pie of Pie|复合饼图|pie|secondary
bar-of-pie|Bar of Pie|饼图加条形分解|pie|secondary bar
donut-of-pie|Doughnut of Pie|饼图加环形分解|pie|secondary donut
donut-total|Total Wedge 100|固定总量环形图|pie|donut total
pie-radius|Pie with Different Radius|不等半径饼图|pie|radius
donut-radius|Doughnut with Different Radius|不等半径环形图|pie|donut radius
half-donut|Half Doughnut|半环形图|pie|donut half
chipped-donut|Chipped Doughnut|缺口环形图|pie|donut chipped''')
group('多轴与多面板','MultiAxis', '''multi-axis|Multi-axis|多轴图|multi|axis
multi-panel|Multi-panel|多面板图|multi|panel
tile-grid|Tile Grid Map|瓦片网格地图|multi|tile
dual-y-violin|Double-Y Violin|双Y轴小提琴|multi|violin
linked-insets|Multi-panel with Insets|多面板内嵌图|multi|inset
dual-y-waterfall|Double-Y Waterfall|双Y轴瀑布|multi|waterfall''')
group('瀑布曲线','Waterfall', '''waterfall2d|2D Waterfall|二维瀑布曲线|waterfall
waterfall3d|3D Waterfall|三维瀑布曲线|waterfall|3d
waterfall-color|Colormap Filled Waterfall|填色瀑布曲线|waterfall|filled
waterfall-inset|Waterfall with Inset|瀑布加峰值内嵌图|waterfall|inset''')
group('等值线与热图','Contour', '''contour|Contour Lines|等值线图|heat|contour
filled-contour|Color Fill Contour|填色等值线|heat|filled
heatmap|Heatmap|热图|heat
triangular-heat|Lower-triangular Heatmap|下三角相关热图|heat|triangle
split-heat|Divided-cell Correlation Heatmap|分割单元相关热图|heat|split
grouped-heat|Heatmap with Grouping|带分组热图|heat|grouped
boundary-contour|Custom-boundary Contour|自定义边界等值线|heat|boundary
stacked-heat3d|Stacked 3D Heatmap|堆叠三维热图|three|heat
contour-vectors|Contour with Vectors|等值线叠加向量|vector|contour''')
group('三维图','3D', '''scatter3d|3D Symbol|三维散点图|three|scatter
trajectory3d|3D Trajectory|三维轨迹图|three|trajectory
vector3d|3D Vector|三维向量图|vector|3d
bar3d|3D Basic Bar|三维条形图|three|bar
stacked-bar3d|3D Stacked Bar|三维堆叠条形|three|stacked-bar
surface3d|3D Surface|三维曲面|three|surface
function3d|3D Function|三维函数曲面|function|3d
ribbon3d|3D Ribbons|三维带状曲线|three|ribbon
walls3d|3D Walls|三维墙图|three|wall
tetrahedral|Tetrahedral|四面体组成图|three|tetra
ternary3d|3D Ternary Scatter|三维三元散点|ternary|3d
scatter3d-error|3D Scatter with Errors|三维误差与投影|three|error
surface-sphere|Spherical Surface|球面色图|three|sphere
surface-projections|Surface with Projections|曲面及平面投影|three|projection
surface-boundary|XYZ Surface with Boundary|有界XYZ曲面|three|boundary
bar-scatter3d|3D Bar and Scatter|三维柱形叠加散点|three|bar-scatter''')
group('分组数据图','Grouped', '''group-scatter|Grouped Scatter|分组散点|scatter|grouped
group-line|Grouped Line|分组折线|line|grouped
group-line-symbol|Grouped Line and Symbol|分组线加符号|line|grouped symbol
group-column|Grouped Column Bar|分组柱条图|bar|grouped
group-stacked|Grouped Stacked Column Bar|分组堆叠柱条图|bar|grouped stacked
group-percent|Grouped 100% Stacked|分组百分比堆叠|bar|grouped percent stacked
group-pie|Grouped Pie Doughnut|分组饼环图|pie|grouped donut
group-box|Grouped Box|分组箱线图|box|grouped
group-interval|Grouped Interval|分组区间图|interval|grouped
group-violin|Grouped Violin|分组小提琴图|box|violin grouped
group-hist|Grouped Histogram|分组直方图|distribution|grouped
group-density|Grouped Distribution Curve|分组分布曲线|distribution|density grouped
group-probability|Grouped Probability|分组概率图|qq|probability grouped
group-qq|Grouped QQ|分组Q-Q图|qq|grouped
group-cdf|Grouped CDF|分组累计分布|qq|cdf grouped
group-run|Grouped Run Chart|分组运行图|quality|run grouped
group-pareto|Grouped Pareto|分组帕累托图|quality|pareto grouped
group-time|Grouped Time Series|分组时间序列|line|time grouped
group-trellis|Double-Y Trellis|双Y轴格面图|multi|axis panel''')
group('类别关系与流图','Categorical', '''parallel|Parallel Coordinates|平行坐标|flow|parallel
alluvial|Alluvial|冲积图|flow|alluvial
sankey|Sankey|桑基图|flow|sankey
chord|Chord|弦图|flow|chord
network|Network|网络图|flow|network
ribbon|Ribbon Diagram|排名缎带图|flow|ribbon
edge-bundling|Hierarchical Edge Bundling|层次边捆绑|flow|bundle
sankey-map|Sankey Map|地图桑基图|flow|map
network-map|Network on Map|地图网络图|flow|network map''')
group('层次结构','Hierarchy', '''treemap|Treemap|矩形树图|hierarchy|treemap
sunburst|Sunburst|旭日图|hierarchy|sunburst
circle-packing|Circular Packing|圆形嵌套图|hierarchy|packing''')
group('统计图','Statistics', '''box|Box|箱线图|box
histogram|Histogram|直方图|distribution
stacked-hist|Stacked Histograms|堆叠直方图|distribution|stacked
marginal-box|Marginal Box|边缘箱线散点|scatter|marginal-box
marginal-hist|Marginal Histogram|边缘直方散点|scatter|marginal-hist
hist-prob|Histogram and Probability|直方与概率组合|distribution|probability
rug|Rug|地毯图|distribution|rug
frequency|Frequency|频数图|distribution|frequency
violin|Violin|小提琴图|box|violin
scatter-matrix|Scatter Matrix|散点矩阵|multi|scatter
bridge|Bridge|桥式增减图|bar|bridge
probability|Probability Plot|概率图|qq|probability
qq|Q-Q Plot|分位数比较图|qq
kde2d|2D Kernel Density|二维核密度|heat|density
dendrogram-v|Vertical Dendrogram|纵向树状图|dendrogram
dendrogram-h|Horizontal Dendrogram|横向树状图|dendrogram|horizontal
dendrogram-c|Circular Dendrogram|环形树状图|dendrogram|circular
pyramid|Population Pyramid|人口金字塔|bar|pyramid
control|Control Chart|过程控制图|quality|control
pareto|Pareto Chart|帕累托图|quality|pareto
statistics-bar|Statistics Bars|统计量柱形加样本|bar|points
interval|Interval Plot|区间图|interval
before-after|Before After|前后配对图|interval|paired
bland-altman|Bland Altman|均差图|scatter|bland
half-violin|Half Violin|半小提琴图|box|half violin
dual-half-box|Double-Y Half Box|双Y半箱线|box|half dual
cluster|Cluster Scatter with Centroids|带中心的聚类散点|scatter|cluster
stacked-bridge|Stacked Bridge|堆叠桥图|bar|stacked bridge''')
group('质量改进','Quality', '''main-effect|Main Effect|主效应图|quality|effect
interaction|Interaction|交互作用图|quality|interaction
variability|Variability|变异性图|quality|variability
multi-vari|Multi-Vari|多变异图|quality|multi-vari
run|Run|运行图|quality|run
symmetry|Symmetry|对称性图|qq|symmetry
cdf|CDF|累计分布图|qq|cdf
dot|Dot Plot|点图|distribution|dot
group-dot|Grouped Dot|分组点图|distribution|dot grouped
stack-dot|Stacked Dot|堆叠点图|distribution|dot stacked
fishbone|Cause and Effect|因果鱼骨图|special|fishbone''')
for variant in ['Xbar-R','Xbar-S','I-MR-R/S','Xbar','R','S','Zone','I-MR','Z-MR','Individuals','Moving Range','P/U Diagnostic','P/U','Laney P/U','NP','C','Moving Average','EWMA','CUSUM']:
 slug='control-'+str(len(charts)); group_row=dict(id='origin-'+slug,name=variant+' 控制图',englishName=variant+' Control Chart',family='质量改进',sources=['origin'],source=URL+'#'+ANCHORS['Quality'],recipe='quality',variant='control '+variant,description=NOTES['quality']+' 参考线和序列为合成示意，不根据该控制图公式估计控制限。',dataHint=DATA['quality'],markdownImages=[],natureReferences=[],illustration='original synthetic Canvas illustration');charts.append(group_row);sections[-1]['entries'].append(group_row['id'])
group('专业图形','Specialized', '''windrose|Wind Rose|风玫瑰图|polar|wind
radar|Radar Spider|雷达图|polar|radar
bullet|Bullet|子弹图|special|bullet
wafer|Wafer Map|晶圆图|heat|wafer
smith|Smith Chart|史密斯圆图|special|smith
zoom|Zoom|局部放大图|multi|zoom
stock|Stock|股票OHLC图|special|stock
kite|Kite|风筝图|special|kite''')
group('极坐标与径向','Polar', '''polar|Polar|极坐标曲线|polar
polar-log|Log Polar|对数极坐标|polar|log
polar-heat|Polar Heatmap|极坐标热图|polar|heat
polar-contour|Polar Contour|极坐标等值线|polar|contour
polar-cropped|Cropped Polar|扇区极坐标|polar|sector
radial-bar|Radial Bar|径向条形图|polar|bars
radial-stack|Stacked Radial Bar|堆叠径向条形|polar|bars stacked
polar-vector|Polar Vector|极坐标向量|vector|polar
compass|Compass|罗盘箭头|vector|compass
polar-quiver|Polar Contour and Quiver|极坐标等值线加向量|vector|polar contour''')
group('向量与流线','Vector', '''vector2d|2D Vector|二维向量场|vector
streamline|Streamline|流线图|vector|stream
contour-stream|Contour with Streamline|等值线叠加流线|vector|stream contour
gradient-vector|Contour Gradient Vectors|等值线梯度向量|vector|gradient contour
vector-stick|Wind Vector Stick|风向量杆图|vector|stick''')
group('三元图','Ternary', '''ternary|2D Ternary Scatter|二维三元散点|ternary
ternary-vector|Ternary Vector|三元向量图|ternary|vector
ternary-contour|Ternary Contour|三元等值线|ternary|contour
ternary-surface|3D Ternary Surface|三元曲面|ternary|surface
soil-ternary|Soil Classification|土壤分类三角图|ternary|soil
ternary-line|Ternary Line|三元组成曲线|ternary|line
right-ternary|Right Triangle Ternary|直角三角三元图|ternary|right''')
group('水化学图','Hydrochemistry', '''piper|Piper|Piper三线图|hydro|piper
durov|Durov|Durov图|hydro|durov
stiff|Stiff|Stiff多边形图|hydro|stiff
stiff-map|Stiff Map|地图Stiff符号|hydro|stiff map
schoeller|Schoeller|Schoeller离子折线|hydro|schoeller''')
group('剖面图','Profile', '''horizontal-profile|Horizontal Profile|水平剖面|profile|horizontal
vertical-profile|Vertical Profile|垂直剖面|profile|vertical
arbitrary-profile|Arbitrary Profile|任意线剖面|profile|arbitrary
multiple-profile|Multiple Profiles|多剖面|profile|multiple
width-profile|Profile with Width|带宽剖面取样|profile|width''')
group('函数图','Function', '''function2d|2D Function|二维函数图|function
parametric2d|2D Parametric|二维参数曲线|function|parametric
parametric3d|3D Parametric|三维参数曲面|function|parametric 3d
spherical-contour|Spherical Contour|球面等值色图|three|sphere contour''')
group('图像图','Image', '''image|Image Plot|图像矩阵|image
image-profile|Image Profile|图像剖面|profile|image multiple
image-stack|Stacked Matrix Image|多帧矩阵图像|image|stacked''')
assert len({c['id'] for c in charts})==len(charts)
result=dict(source=URL,retrieved='2026-10-17',scope='Main Graphing page: named types and variants across 20 categories; linked external galleries are not exhaustive scope.',sections=sections,charts=charts)
(ROOT/'origin-library.json').write_text(json.dumps(result,ensure_ascii=False,indent=2)+'\n')
(ROOT/'media/origin-library.js').write_text('(function(r,f){if(typeof module==="object"&&module.exports)module.exports=f();else r.OriginLibrary=f();})(typeof globalThis!=="undefined"?globalThis:this,function(){return '+json.dumps(result,ensure_ascii=False)+';});\n')
lines=['# Origin 图表索引','',f'{len(sections)} 个页面分类，{len(charts)} 条图种/变体记录。与 Personal 保持独立来源统计，不声称跨库去重后的唯一图种数。','', '范围：用户指定 Graphing 主页面，含明确命名的示例和子类型；不递归打包 More Graphs 外链图库。重复出现的类型仅保留一个通用条目，分组及三维等结构变体另列。功能选项（旋转、标签、颜色数量等）不独立计数。','', '原图、模板文件和网站长段说明均未复制。所有中文说明与Canvas几何为原创，3D为固定投影，统计及水化学图仅为结构示意，无实际统计推断。Origin为来源标记，不表示官方合作或Origin功能实现。','', URL,'']
for section in sections:
 lines+=['## '+section['name'], '',section['source'],'']
 for c in charts:
  if c['id'] in section['entries']:lines+=['- '+c['name']+' / '+c['englishName']+' — `'+c['id']+'`']
(ROOT/'ORIGIN-CATALOG.md').write_text('\n'.join(lines)+'\n')
print(len(sections),'categories;',len(charts),'entries')
