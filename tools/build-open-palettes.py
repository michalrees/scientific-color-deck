"""Build static, offline palettes from pinned D3 data and local Matplotlib.
Only named base schemes count; reversed schemes and alternative sample counts do not.
No plotting libraries are used to render images.
"""
from pathlib import Path
import argparse,json,re,os,hashlib,shutil
os.environ.setdefault('MPLCONFIGDIR','/tmp/scientific-color-deck-mpl-cache')
import matplotlib
from matplotlib.colors import to_hex
parser=argparse.ArgumentParser();parser.add_argument('--d3-root',type=Path,default=Path('/tmp/color-sources/d3/package'));args=parser.parse_args()
ROOT=Path(__file__).resolve().parents[1];items=[]
for folder,kind,names in [
 ('categorical','qualitative',['Accent','Dark2','Paired','Pastel1','Pastel2','Set1','Set2','Set3','category10','Tableau10']),
 ('sequential-single','sequential',['Blues','Greens','Greys','Oranges','Purples','Reds']),
 ('sequential-multi','sequential',['BuGn','BuPu','GnBu','OrRd','PuBu','PuBuGn','PuRd','RdPu','YlGn','YlGnBu','YlOrBr','YlOrRd']),
 ('diverging','diverging',['BrBG','PRGn','PiYG','PuOr','RdBu','RdGy','RdYlBu','RdYlGn','Spectral'])]:
 for name in names:
  file=args.d3_root/'src'/folder/(name+'.js');content=file.read_text()
  arrays=re.findall(r'"([0-9a-fA-F]{18,})"',content);raw=max(arrays,key=len)
  colors=['#'+raw[i:i+6].upper() for i in range(0,len(raw),6)]
  brewer=name not in ['category10','Tableau10'];origin='colorbrewer' if brewer else 'd3'
  items.append(dict(id='open-'+name.lower(),name=('ColorBrewer · ' if brewer else 'D3 · ')+name,type=kind,collection='Open-source',origin=origin,
   colors=colors,family='ColorBrewer' if brewer else 'D3',license='Apache-2.0' if brewer else 'ISC',
   source=f'https://github.com/d3/d3-scale-chromatic/blob/v3.1.0/src/{folder}/{name}.js',sourceVersion='d3-scale-chromatic 3.1.0',
   attribution='Cynthia Brewer, Mark Harrower, Pennsylvania State University; distributed by D3.' if brewer else 'Mike Bostock / D3; Tableau10 attribution retained upstream.',
   note=(f'{len(colors)}个原始分类色，适合离散组别；不自动保证全部色对在色觉缺陷下可分辨。' if kind=='qualitative' else f'原始最大档 {len(colors)} 色离散色阶；'+('从低到高的有序数值。' if kind=='sequential' else '两端偏离中点的数值；应显式设置中心值。')),
   sampling={'method':'original discrete scheme','count':len(colors)},sourceSha256=hashlib.sha256(content.encode()).hexdigest()))
selected={
 'viridis':'sequential','plasma':'sequential','inferno':'sequential','magma':'sequential','cividis':'sequential',
 'turbo':'miscellaneous','cubehelix':'sequential','coolwarm':'diverging','twilight':'cyclic','terrain':'miscellaneous',
 'ocean':'miscellaneous','gist_earth':'miscellaneous','bone':'sequential','copper':'sequential','pink':'sequential','hot':'sequential',
 'cool':'sequential','Wistia':'sequential','gnuplot':'miscellaneous','gnuplot2':'miscellaneous','brg':'miscellaneous','hsv':'cyclic',
 'CMRmap':'miscellaneous','afmhot':'sequential','gist_heat':'sequential'}
for name,kind in selected.items():
 cmap=matplotlib.colormaps[name];n=12 if kind=='cyclic' else 9
 positions=[i/n if kind=='cyclic' else i/(n-1) for i in range(n)]
 colors=[to_hex(cmap(float(x)),keep_alpha=False).upper() for x in positions]
 note=f'Matplotlib {matplotlib.__version__} 原色图在 [0,1] 均匀取 {n} 个离散样本。'
 if kind=='cyclic':note=f'Matplotlib {matplotlib.__version__} 循环色图在 [0,1) 均匀取 {n} 点，不重复首尾。适用于相位与方向。'
 if kind=='miscellaneous' or name in ['hsv','cool','Wistia','hot','afmhot','gist_heat']:note+=' 非感知均匀性保证；使用前检查亮度、色觉和数据含义。'
 items.append(dict(id='mpl-'+name.lower(),name='Matplotlib · '+name,type=kind,colors=colors,collection='Open-source',origin='matplotlib',family='Matplotlib',license='Matplotlib license (PSF-derived)',sourceVersion=matplotlib.__version__,source='https://github.com/matplotlib/matplotlib/tree/v'+matplotlib.__version__,upstreamName=name,attribution='Matplotlib Development Team; colormap authors credited by upstream.',note=note,sampling={'method':'uniform samples of original colormap','count':n,'positions':positions,'endpoint':kind!='cyclic'}))
assert len(items)==62
assert len({tuple(i['colors']) for i in items})==62
result={'summary':{'added':62,'colorbrewerD3':37,'matplotlib':25,'countingRule':'One named base scheme per group; no reversed or size variants.'},'palettes':items}
(ROOT/'media/open-palettes.js').write_text('(function(root,factory){if(typeof module==="object"&&module.exports)module.exports=factory();else root.OpenPalettes=factory();})(typeof globalThis!=="undefined"?globalThis:this,function(){return '+json.dumps(result,ensure_ascii=False,indent=2)+';});\n')
(ROOT/'open-palettes.json').write_text(json.dumps(result,ensure_ascii=False,indent=2)+'\n')
shutil.copy2(args.d3_root/'LICENSE',ROOT/'licenses/d3-scale-chromatic-LICENSE.txt')
lines=['# 开源配色清单','','现有38组 + 新增62组 = 100组。这里汇总的是精选开源方案，不是对全球所有开源色库的穷尽收录。','', '一组对应一个命名基础方案；反转、改变采样数量不新增组。原始分类/离散数据和连续色图采样分别标明。','','| 名称 | 类型 | 色数 | 来源版本 | 许可证 |','|---|---|---:|---|---|']
for p in items:lines.append('| '+p['name']+' | '+p['type']+' | '+str(len(p['colors']))+' | '+p['sourceVersion']+' | '+p['license']+' |')
for p in items:
 lines+=['','## '+p['name'],'',p['note'],'','来源：'+p['source'],'','```json',json.dumps(p['colors']),'```']
(ROOT/'OPEN-PALETTES.md').write_text('\n'.join(lines)+'\n')
print('Generated:',len(items),'palettes, Matplotlib',matplotlib.__version__)
