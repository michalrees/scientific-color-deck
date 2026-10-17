/* Original deterministic UI illustrations. Not scientific observations or manuscript figures. */
(function(root,factory){if(typeof module==='object'&&module.exports)module.exports=factory();else root.ChartGallery=factory();})(typeof globalThis!=='undefined'?globalThis:this,function(){
'use strict';
function draw(canvas, kind, colors) {
 if(kind.startsWith('origin-'))return (typeof module==='object'&&module.exports?require('./origin-charts'):globalThis.OriginCharts).draw(canvas,kind,colors);
 const ctx=canvas.getContext('2d'); if(!ctx)return false;
 const p=colors&&colors.length?colors:['#4477AA','#EE6677','#228833','#CCBB44','#66CCEE'];
 const color=i=>p[((i%p.length)+p.length)%p.length];
 const gradient=value=>{const t=Math.max(0,Math.min(1,value))*(p.length-1),i=Math.floor(t),a=color(i).slice(1),b=color(Math.min(i+1,p.length-1)).slice(1),f=t-i;const channel=k=>Math.round(parseInt(a.slice(k,k+2),16)*(1-f)+parseInt(b.slice(k,k+2),16)*f);return `rgb(${channel(0)},${channel(2)},${channel(4)})`;};
 ctx.save();ctx.scale(canvas.width/320,canvas.height/200);ctx.fillStyle='#FFFFFF';ctx.fillRect(0,0,320,200);
 const line=(pts,c='#54616c',w=1.2)=>{ctx.strokeStyle=c;ctx.lineWidth=w;ctx.beginPath();pts.forEach((v,i)=>i?ctx.lineTo(...v):ctx.moveTo(...v));ctx.stroke();};
 const poly=(pts,c,alpha=1)=>{ctx.globalAlpha=alpha;ctx.fillStyle=c;ctx.beginPath();pts.forEach((v,i)=>i?ctx.lineTo(...v):ctx.moveTo(...v));ctx.closePath();ctx.fill();ctx.globalAlpha=1;};
 const rect=(x,y,w,h,c)=>{ctx.fillStyle=c;ctx.fillRect(x,y,w,h);};
 const dot=(x,y,r,c,alpha=1)=>{ctx.globalAlpha=alpha;ctx.fillStyle=c;ctx.beginPath();ctx.arc(x,y,r,0,Math.PI*2);ctx.fill();ctx.globalAlpha=1;};
 const text=(s,x,y,size=9,c='#64717b')=>{ctx.fillStyle=c;ctx.font=`${size}px sans-serif`;ctx.fillText(String(s),x,y);};
 const rand=(i,k=1)=>(Math.sin(i*12.9898+k*78.233)*43758.5453)%1+1; // normalized below
 const noise=(i,k=1)=>{const n=rand(i,k);return n-Math.floor(n);};
 const axes=()=>{line([[35,22],[35,168],[303,168]],'#9aa4ac',.8);for(let i=0;i<4;i++){text(i,30+i*85,181,8);text(((3-i)/3).toFixed(1),7,26+i*47,8);}text('x',295,192,9);};
 const curve=(j=0)=>Array.from({length:33},(_,i)=>[36+i*8,138-j*28-20*Math.sin(i/7+j)+9*Math.cos(i/4+j)]);
 const gaussian=(x,m=0,s=1)=>Math.exp(-.5*((x-m)/s)**2);
 const hist=(mode)=>{axes();for(let j=0;j<(mode==='single'?1:3);j++){
  const pts=[];
  for(let i=0;i<18;i++){const h=gaussian((i-8)/3,(j-1)*.45)*[67,90,115][j];let x=40+i*14;
   if(mode==='grouped')rect(x+j*4,168-h,3.7,h,color(j));
   else if(mode==='stacked'){const lower=j===0?0:gaussian((i-8)/3,-.45)*34+(j>1?gaussian((i-8)/3,0)*42:0);rect(x,168-lower-h*.45,13,h*.45,color(j));}
   else if(mode==='outline'){pts.push([x,168-h],[x+14,168-h],[x+14,168-(gaussian((i+1-8)/3,(j-1)*.45)*[67,90,115][j])]);}
   else rect(x,168-h,13,h,color(j));
  }if(mode==='outline')line(pts,color(j),1.5);
 }};
 const heat=(mode)=>{for(let r=0;r<7;r++)for(let c=0;c<10;c++){
  const v=mode==='adjacency'?(r===c?1:(r+c)%3/3):noise(r*11+c,4);
  const colorset=mode==='sequential'?['#edf8e9','#bae4b3','#74c476','#31a354','#006d2c']:p;
  rect(36+c*25,25+r*19,24,18,colorset[Math.min(colorset.length-1,Math.floor(v*colorset.length))]);
  if(mode==='annotated')text(v.toFixed(1),39+c*25,37+r*19,7,'#202630');
 }if(mode==='cluster'){for(let i=0;i<5;i++){const x=48+i*50;line([[x,21],[x,13],[x+25,13],[x+25,21]],'#59656f',.7);}line([[38,10],[38,5],[275,5],[275,10]],'#59656f',.7);}text('Matrix',137,183,9);};
 const polar=(mode)=>{const cx=165,cy=100,R=73;
  for(let r=1;r<=3;r++){ctx.strokeStyle='#dae0e5';ctx.lineWidth=.7;ctx.beginPath();ctx.arc(cx,cy,R*r/3,mode==='sector'?-.9*Math.PI:0,mode==='sector'?-.15*Math.PI:Math.PI*2);ctx.stroke();}
  for(let i=0;i<8;i++){let a=mode==='sector'?-.9*Math.PI+i*.75*Math.PI/7:i*Math.PI/4;line([[cx,cy],[cx+R*Math.cos(a),cy+R*Math.sin(a)]],'#dae0e5',.7);}
  if(mode==='radar'){for(let j=0;j<3;j++){const pts=Array.from({length:7},(_,i)=>{const a=i*2*Math.PI/6-Math.PI/2,r=R*(.4+.5*noise(i%6,j));return[cx+r*Math.cos(a),cy+r*Math.sin(a)];});poly(pts,color(j),.1);line(pts,color(j),1.6);}}
  else if(mode==='bars'){for(let i=0;i<18;i++){const a=i*2*Math.PI/18,r=R*(.25+.7*noise(i,3));ctx.fillStyle=color(i%3);ctx.beginPath();ctx.moveTo(cx,cy);ctx.arc(cx,cy,r,a,a+.27);ctx.closePath();ctx.fill();}}
  else if(mode==='density'){const pts=Array.from({length:121},(_,i)=>{const a=i*2*Math.PI/120,r=R*(.55+.23*Math.sin(a*3));return[cx+r*Math.cos(a),cy+r*Math.sin(a)];});line(pts,color(1),2);}
  else {for(let i=0;i<65;i++){let a=noise(i,2)*Math.PI*2,r=R*Math.sqrt(noise(i,5));if(mode==='annular')r=R*(.6+.35*noise(i,5));if(mode==='sector'){a=-Math.PI*.9+noise(i,2)*Math.PI*.75;r=R*Math.sqrt(noise(i,5));}dot(cx+r*Math.cos(a),cy+r*Math.sin(a),mode==='sector'?2+noise(i,6)*5:2+noise(i,6)*3,color(i%p.length),.8);}}
 };
 const network=(mode)=>{const points=Array.from({length:8},(_,i)=>mode==='bipartite'?[i<4?70:255,35+(i%4)*41]:[165+76*Math.cos(i*Math.PI/4),98+70*Math.sin(i*Math.PI/4)]);
  for(let i=0;i<8;i++)for(let j=i+1;j<8;j++)if(mode==='bipartite'?(i<4&&j>=4&&(i+j)%3!==0):((i+j)%3===0))line([points[i],points[j]],color(i),.8);
  points.forEach((v,i)=>dot(...v,5,color(i)));};
 const pointCloud=(mode)=>{if(mode!=='joint')axes();
  for(let i=0;i<110;i++){const x=noise(i,2),n=(noise(i,3)+noise(i,4)-1),j=i%3;let px=43+x*250,py=145-x*99+n*38,r=2.2,c=mode==='scatter'?gradient(x):color(j);
   if(mode==='clusters'){px=90+j*77+n*34;py=68+(j%2)*62+(noise(i,6)-.5)*39;}
   if(mode==='bubble'){py=32+noise(i,5)*126;r=2+noise(i,6)*7;}
   if(mode==='density2d'||mode==='joint'){px=165+n*95;py=100+(noise(i,5)+noise(i,6)-1)*65;c=mode==='density2d'?gradient(Math.exp(-2*(n*n+((py-100)/65)**2))):color(0);}
   if(mode==='volcano'){px=165+n*145;py=164-Math.abs(n)*130-noise(i,5)*22;c=Math.abs(n)>.43?color(n>0?1:0):'#cbd0d5';}
   dot(px,py,r,c,.7);
  }if(mode==='regression')line([[40,150],[292,48]],'#384b5a',1.5);
  if(mode==='volcano'){line([[104,23],[104,165]],'#9aa4ac',.6);line([[224,23],[224,165]],'#9aa4ac',.6);line([[38,120],[299,120]],'#9aa4ac',.6);}
  if(mode==='joint'){line([[36,33],[36,165],[270,165]],'#87939d',.7);for(let i=0;i<18;i++){const h=gaussian((i-8)/3)*24;rect(40+i*12,31-h,11,h,color(1));rect(276,35+i*7,gaussian((i-8)/3)*28,6,color(2));}}
 };
 let rendered=true;
 switch(kind){
 case 'bar':case 'grouped-bar':case 'stacked-bar':case 'signed-bar':case 'log-bar':{
  axes();for(let i=0;i<5;i++){const h=35+noise(i,4)*85;
   if(kind==='grouped-bar'){for(let j=0;j<3;j++){const v=h*(.6+j*.16);rect(48+i*49+j*11,168-v,9,v,color(j));line([[52+i*49+j*11,164-v],[52+i*49+j*11,172-v]],'#49545e',.8);}}
   else if(kind==='stacked-bar'){let top=168;for(let j=0;j<3;j++){const v=(h/3)*(1+j*.2);rect(50+i*48,top-v,26,v,color(j));top-=v;}}
   else if(kind==='signed-bar'){const v=(i%2===0?-1:1)*h*.55;rect(50+i*48,100-Math.max(0,v),26,Math.abs(v),color(i%2));line([[36,100],[300,100]],'#a1a8af',.6);}
   else {rect(50+i*48,168-h,27,h,color(i));}
  }if(kind==='log-bar'){rect(2,17,28,143,'white');text('10³',5,35,9);text('10²',5,95,9);text('10¹',5,155,9);}break;
 }
 case 'horizontal-stacked':{for(let i=0;i<5;i++){let x=36;for(let j=0;j<5;j++){let width=[35,48,63,52,65][j];rect(x,30+i*28,width,20,color(j));x+=width;}text('G'+(i+1),12,44+i*28,9);}text('0%',35,183);text('100%',269,183);break;}
 case 'line':case 'ribbon':case 'error-line':case 'event-line':case 'individual-traces':case 'step':case 'gradient-line':{
  axes();if(kind==='individual-traces'){for(let j=0;j<14;j++)line(curve(1).map(([x,y],i)=>[x,y+(noise(i,j)-.5)*50]),'#dce1e7',.8);}
  for(let j=0;j<(kind==='ribbon'||kind==='individual-traces'?1:3);j++){let pts=curve(j);
   if(kind==='step'){const step=[];for(let i=0;i<pts.length;i+=3){if(step.length)step.push([pts[i][0],step.at(-1)[1]]);step.push(pts[i]);}pts=step;}
   if(kind==='ribbon')poly(pts.map(([x,y])=>[x,y-12]).concat(pts.slice().reverse().map(([x,y])=>[x,y+12])),color(j),.2);
   if(kind==='gradient-line'){for(let i=1;i<pts.length;i++)line([pts[i-1],pts[i]],color(Math.floor(i/pts.length*p.length)),2.5);}else line(pts,color(j),2);
   if(kind==='error-line')pts.filter((_,i)=>i%4===0).forEach(([x,y])=>{line([[x,y-8],[x,y+8]],color(j),1);line([[x-3,y-8],[x+3,y-8]],color(j),1);dot(x,y,2.5,color(j));});
  }if(kind==='event-line'){ctx.setLineDash([3,3]);line([[164,22],[164,168]],'#89949e',1);ctx.setLineDash([]);text('event',168,32,8);}break;
 }
 case 'heatmap':case 'sequential-heatmap':case 'annotated-heatmap':case 'cluster-heatmap':case 'adjacency':heat({'sequential-heatmap':'sequential','annotated-heatmap':'annotated','cluster-heatmap':'cluster',adjacency:'adjacency'}[kind]);break;
 case 'scatter':case 'regression':case 'clusters':case 'bubble':case 'volcano':case 'density2d':case 'joint':pointCloud(kind);break;
 case 'radar':case 'polar-bars':case 'polar-density':case 'polar-scatter':case 'sector-bubble':case 'annular-scatter':polar({radar:'radar','polar-bars':'bars','polar-density':'density','sector-bubble':'sector','annular-scatter':'annular'}[kind]);break;
 case 'globe':case 'sphere-concept':{const g=ctx.createRadialGradient(136,68,5,163,100,75);g.addColorStop(0,'#e8f5ff');g.addColorStop(1,color(0));ctx.fillStyle=g;ctx.beginPath();ctx.arc(165,100,74,0,Math.PI*2);ctx.fill();
  if(kind==='globe'){ctx.strokeStyle='#b8c7d4';for(let i=1;i<5;i++){ctx.beginPath();ctx.ellipse(165,100,74*Math.sin(i*Math.PI/5),74,0,0,Math.PI*2);ctx.stroke();}for(let i=0;i<60;i++){const x=(noise(i,2)-.5)*140,y=(noise(i,3)-.5)*140;if(x*x+y*y<4800)dot(165+x,100+y,2+noise(i,4)*3,color(i),.9);}}break;}
 case 'histogram':hist('single');break;
 case 'grouped-histogram':hist('grouped');break;
 case 'stacked-histogram':hist('stacked');break;
 case 'step-histogram':hist('outline');break;
 case 'density':case 'ridgeline':{axes();for(let j=0;j<(kind==='ridgeline'?4:3);j++){const base=kind==='ridgeline'?163-j*34:168,pts=Array.from({length:81},(_,i)=>[37+i*3.2,base-gaussian((i-40)/13,(j-1)*.45)* (kind==='ridgeline'?42:100)]);poly([[37,base],...pts,[293,base]],color(j),kind==='ridgeline'?.6:.12);line(pts,color(j),1.6);}break;}
 case 'violin':case 'box':case 'violin-box':{axes();for(let i=0;i<5;i++){const x=63+i*48,y=94-i*5;
  if(kind!=='box'){const pts=[];for(let j=0;j<41;j++){const dy=-55+j*2.75;pts.push([x+gaussian(dy/24)*17,y+dy]);}poly(pts.concat(pts.slice().reverse().map(([px,py])=>[2*x-px,py])),color(i),.6);}
  if(kind!=='violin'){line([[x,y-43],[x,y+43]],'#455463',1);rect(x-9,y-18,18,36,kind==='box'?color(i):'#FFFFFF');ctx.strokeStyle='#455463';ctx.strokeRect(x-9,y-18,18,36);line([[x-9,y],[x+9,y]],'#455463',1.4);}}
  break;}
 case 'forest':{line([[160,20],[160,170]],'#ccd3da',1);for(let i=0;i<6;i++){const x=96+noise(i,5)*110,y=30+i*25;line([[x-25,y],[x+35,y]],color(i),1.5);dot(x,y,3.5,color(i));text('G'+(i+1),12,y+3,9);}break;}
 case 'paired':{for(let i=0;i<10;i++){const y=35+noise(i,2)*125,z=30+noise(i,3)*125;line([[65,y],[260,z]],'#c6ccd2',1);dot(65,y,3,color(0));dot(260,z,3,color(1));}text('Before',46,187);text('After',248,187);break;}
 case 'point-range':{axes();for(let i=0;i<8;i++){const x=52+i*32,y=55+noise(i,3)*70;line([[x,y-14],[x,y+14]],'#65717b',1.2);dot(x,y,3.5,color(i));}break;}
 case 'area':case 'stacked-area':case 'stream':case 'cumulative':{axes();const bands=kind==='area'?1:4;let lower=Array.from({length:34},(_,i)=>[36+i*7.8,168]);
  for(let j=0;j<bands;j++){const upper=lower.map(([x,y],i)=>[x,y-(kind==='cumulative'?(i+1)*.65:kind==='area'?35+24*Math.sin(i/10)+i:18+6*Math.sin(i/5+j))]);
   if(kind==='stream'){const shift=i=>15*Math.sin(i/6);poly(upper.map(([x,y],i)=>[x,y+shift(i)]).concat(lower.slice().reverse().map(([x,y],i)=>[x,y+shift(33-i)])),color(j),.85);}else poly(upper.concat(lower.slice().reverse()),color(j),.8);lower=upper;
  }break;}
 case 'donut':{let a=-Math.PI/2;[.28,.22,.19,.17,.14].forEach((v,i)=>{ctx.strokeStyle=color(i);ctx.lineWidth=29;ctx.beginPath();ctx.arc(165,99,58,a,a+v*2*Math.PI-.025);ctx.stroke();a+=v*2*Math.PI;});text('100%',140,106,17,'#344350');break;}
 case 'contour':{for(let i=7;i>=0;i--){ctx.fillStyle=color(i%p.length);ctx.beginPath();ctx.ellipse(166,100,125-i*13,72-i*7,.2,0,Math.PI*2);ctx.fill();}break;}
 case 'surface':{for(let y=12;y>=0;y--)for(let x=0;x<15;x++){const height=(a,b)=>Math.sin(a/3)*Math.cos(b/3)*23;const pt=(a,b)=>[52+a*12+b*6,92+b*5-a*1.3-height(a,b)];poly([pt(x,y),pt(x+1,y),pt(x+1,y+1),pt(x,y+1)],color(Math.floor((height(x,y)+23)/46*p.length)));}break;}
 case 'image-channel':case 'image-merge':case 'image-crop':{rect(47,19,225,154,'#10131b');for(let i=0;i<65;i++){const x=66+noise(i,2)*185,y=36+noise(i,3)*118;dot(x,y,2+noise(i,4)*4,kind==='image-merge'?color(i%2):'#32cfdd',.3+noise(i,5)*.6);}if(kind==='image-crop'){ctx.strokeStyle='white';ctx.strokeRect(115,60,92,70);}text('ILLUSTRATION ONLY',93,188,8);break;}
 case 'bubble-matrix':{for(let i=0;i<5;i++)for(let j=0;j<7;j++)dot(57+j*34,35+i*29,2+noise(i*8+j,3)*7,color(i+j),.8);break;}
 case 'network':case 'bipartite':network(kind);break;
 case 'roc':{axes();line([[35,168],[298,22]],'#c9d0d7',1);for(let j=0;j<3;j++)line(Array.from({length:51},(_,i)=>[36+i*5.2,168-145*(1-(1-i/50)**(2+j))]),color(j),2);text('FPR',265,191);text('TPR',4,17);break;}
 case 'manifold':{for(let j=0;j<12;j++){const pts=Array.from({length:60},(_,i)=>{const t=i/10,r=15+t*6;return[160+r*Math.cos(t)+j*2,100+r*Math.sin(t)*.5-j*2];});line(pts,color(j%p.length),.8);}text('Concept only',119,187);break;}
 default:rendered=false;text('Unsupported',110,100,12);
 }
 ctx.restore();return rendered;
}
return {draw};
});
