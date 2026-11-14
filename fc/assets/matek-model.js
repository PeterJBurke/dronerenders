/* Matek F405-WMO 3D comparison reconstruction, 2026-11-14.
 * Adapted from Peter J. Burke's fc_comparison_render.html Matek construction.
 * Official 22 x 32 mm outline; raised-part positions/textures calibrated from
 * the original Matek photograph. Heights/thickness remain visual estimates.
 * This is real solid/mesh geometry, NOT manufacturer CAD or fit-qualified CAD.
 */
(function(global){'use strict';
const PHOTO={width:1500,height:600,lower:[121,48,470,553],upper:[577,47,927,552],underside:[1025,46,1376,551]};
global.makeMatekBoard=function(THREE,which,options={}){
 if(!['upper','lower'].includes(which))throw Error('Matek board must be upper or lower');
 const group=new THREE.Group();group.name='Matek F405-WMO '+which;
 const meta={model:'Matek F405-WMO',board:which,dimensions:[22,32],pcbThicknessMm:1,topZ:0,units:'mm',geometry:'Photo/layout-derived 3D reconstruction adapted from the reference viewer; not manufacturer CAD',orientation:which==='lower'?'180 degrees from original manufacturer lower photo; power pads at negative Y':'Original manufacturer upper photo; UART bank at positive Y',heightAccuracy:'Component heights and PCB thickness are visual estimates, not measured tolerances',photoSource:'https://www.mateksys.com/wp-content/uploads/2025/08/F405-WMO_2.jpg',referenceSource:'https://peterjburke.github.io/dronerenders/fc_comparison_render.html',ready:false};group.userData.metadata=meta;
 const standard=(color,metalness=0,roughness=.5)=>new THREE.MeshStandardMaterial({color,metalness,roughness});
 const M={pcb:standard(0x154c78,.06,.63),edge:standard(0x9b9670,0,.8),chip:standard(0x22252a,.12,.49),black:standard(0x101216,0,.65),metal:standard(0xc6c5bb,.82,.34),gold:standard(0xc9a44d,.85,.3),cap:standard(0xa79365,.1,.6),jst:standard(0xe9e7d5,0,.67),ind:standard(0x76786e,.25,.55),copper:standard(0x9d622c,.75,.37)};
 let texture;texture=new THREE.TextureLoader().load(options.photoUrl||'assets/matek-f405-wmo-original.jpg',()=>{meta.ready=true;options.onLoad?.(group);},undefined,e=>{meta.error='Manufacturer texture could not load';options.onError?.(e)});texture.colorSpace=THREE.SRGBColorSpace;texture.anisotropy=options.anisotropy||4;
 const photoMat=new THREE.MeshStandardMaterial({map:texture,metalness:.15,roughness:.54});
 function xy(px,py,face=which){const b=PHOTO[face];return [(px-b[0])/(b[2]-b[0])*22-11,16-(py-b[1])/(b[3]-b[1])*32]}
 function pixels(x,y,face=which){const b=PHOTO[face];return [b[0]+(x+11)/22*(b[2]-b[0]),b[1]+(16-y)/32*(b[3]-b[1])]}
 function add(geo,mat,name){const mesh=new THREE.Mesh(geo,mat);mesh.name=name;mesh.castShadow=true;mesh.receiveShadow=true;group.add(mesh);return mesh}
 function photoUV(geo,face=which,cx=0,cy=0,side=1){const p=geo.attributes.position,n=geo.attributes.normal,u=geo.attributes.uv;for(let i=0;i<p.count;i++){if(n.getZ(i)*side>.9){let x=p.getX(i)+cx,y=p.getY(i)+cy;if(face==='underside')x=-x;const q=pixels(x,y,face);u.setXY(i,q[0]/PHOTO.width,1-q[1]/PHOTO.height)}}u.needsUpdate=true;return geo}
 function box(w,h,z,x,y,z0,material,name,face=null){const geo=new THREE.BoxGeometry(w,h,z);const mats=Array(6).fill(material);if(face){photoUV(geo,face,x,y,face==='underside'?-1:1);mats[face==='underside'?5:4]=photoMat;}const m=add(geo,mats,name);m.position.set(x,y,z0+z/2);return m}
 function component(rect,height,mat,name,face=which){let a=xy(rect[0],rect[1],face),b=xy(rect[2],rect[3],face),x=(a[0]+b[0])/2,y=(a[1]+b[1])/2;if(face==='underside')x=-x;return box(Math.abs(b[0]-a[0]),Math.abs(b[1]-a[1]),height,x,y,face==='underside'?-1-height:0,mat,name,face)}
 function circle(x,y,r){const p=new THREE.Path();p.absarc(x,y,r,0,Math.PI*2,false);return p}
 function rounded(w,h,r,x=0,y=0){const s=new THREE.Shape(),l=x-w/2,b=y-h/2;s.moveTo(l+r,b);s.lineTo(l+w-r,b);s.quadraticCurveTo(l+w,b,l+w,b+r);s.lineTo(l+w,b+h-r);s.quadraticCurveTo(l+w,b+h,l+w-r,b+h);s.lineTo(l+r,b+h);s.quadraticCurveTo(l,b+h,l,b+h-r);s.lineTo(l,b+r);s.quadraticCurveTo(l,b,l+r,b);return s}
 const mounts=[[-9.05,-6],[9.05,-6],[-9.05,6],[9.05,6]],shape=rounded(22,32,1.2);
 for(const p of mounts)shape.holes.push(circle(p[0],p[1],1));
 const pinholes=[];
 if(which==='upper'){
  for(const py of [63,103,143])for(const px of [609,649,690,731,771,812,853,893])pinholes.push(xy(px,py));
  for(const py of [452,493,534])for(const px of [598,638,678,719,759])pinholes.push(xy(px,py));
  for(const p of pinholes)shape.holes.push(circle(p[0],p[1],.48));
 }
 const pcbGeo=new THREE.ExtrudeGeometry(shape,{depth:1,bevelEnabled:false,curveSegments:24});pcbGeo.translate(0,0,-1);photoUV(pcbGeo);pcbGeo.clearGroups();for(let i=0;i<pcbGeo.attributes.position.count;i+=3){const z=pcbGeo.attributes.normal.getZ(i);pcbGeo.addGroup(i,3,z>.9?0:z<-.9?2:1)}const pcb=add(pcbGeo,[photoMat,M.edge,M.pcb],'Matek '+which+' PCB 22 x 32 x 1 mm');pcb.userData.pcb=true;
 // Extruded PCB caps share material0. A separate underside surface supplies the
 // actual opposite-face image on the upper board; no inferred backside parts.
 if(which==='upper'){
  const underside=new THREE.ShapeGeometry(shape,24);photoUV(underside,'underside',0,0,1);for(let i=0;i<underside.attributes.uv.count;i++){const q=pixels(-underside.attributes.position.getX(i),underside.attributes.position.getY(i),'underside');underside.attributes.uv.setXY(i,q[0]/1500,1-q[1]/600)}
  const um=new THREE.MeshStandardMaterial({map:texture,metalness:.15,roughness:.54,side:THREE.DoubleSide});const m=add(underside,um,'Matek upper underside photograph on PCB surface');m.position.z=-1.002;
 }
 function ring(x,y,outer,inner,z0,height,mat,name){const s=new THREE.Shape();s.absarc(x,y,outer,0,Math.PI*2,false);s.holes.push(circle(x,y,inner));const g=new THREE.ExtrudeGeometry(s,{depth:height,bevelEnabled:false,curveSegments:20});g.translate(0,0,z0);return add(g,mat,name)}
 for(const p of mounts)ring(p[0],p[1],1.38,1,-1.01,1.04,M.metal,'Plated mounting hole');
 for(const p of pinholes)ring(p[0],p[1],.8,.48,-1.015,1.045,M.gold,'2.54 mm through-hole pad');
 function chipLeads(rect,n,face=which){const a=xy(rect[0],rect[1],face),b=xy(rect[2],rect[3],face),cx=(a[0]+b[0])/2,cy=(a[1]+b[1])/2,w=b[0]-a[0],h=a[1]-b[1],pitch=.5;for(let i=0;i<n;i++){const offset=(i-(n-1)/2)*pitch;for(const sign of [-1,1]){box(.65,.22,.14,cx+sign*(w/2+.28),cy+offset,.12,M.metal,'MCU gull-wing lead');box(.22,.65,.14,cx+offset,cy+sign*(h/2+.28),.12,M.metal,'MCU gull-wing lead')}}}
 function passive(rect,h=.65,mat=M.cap,name='Passive component',face=which){component(rect,h,mat,name,face);const a=xy(rect[0],rect[1],face),b=xy(rect[2],rect[3],face);let x=(a[0]+b[0])/2,y=(a[1]+b[1])/2;if(face==='underside')x=-x;const w=Math.abs(b[0]-a[0]),l=Math.abs(b[1]-a[1]),z=face==='underside'?-1-h:0;if(w>=l){box(w*.18,l+.05,h*.86,x-w*.42,y,z,M.metal,name+' termination');box(w*.18,l+.05,h*.86,x+w*.42,y,z,M.metal,name+' termination')}else{box(w+.05,l*.18,h*.86,x,y-l*.42,z,M.metal,name+' termination');box(w+.05,l*.18,h*.86,x,y+l*.42,z,M.metal,name+' termination')}}
 if(which==='upper'){
  component([677,237,835,393],1.4,M.chip,'STM32F405 LQFP64');chipLeads([677,237,835,393],16);
  component([773,182,826,202],.8,M.metal,'Crystal');component([668,181,704,205],.9,M.chip,'Small regulator');
  for(const r of [[641,237,656,249],[641,257,656,270],[641,277,656,290],[640,310,655,321],[642,371,657,383],[640,404,657,415],[642,426,655,438],[634,179,659,194],[709,182,721,201],[734,182,746,201],[752,182,763,200],[839,204,866,219],[839,223,867,236],[866,242,887,253],[866,260,887,273],[798,417,808,437],[815,417,826,437],[837,419,848,436],[860,418,871,439],[818,449,833,459],[800,474,813,492],[820,475,833,492],[840,476,853,492],[860,475,873,492],[881,475,893,491],[904,476,916,491]])passive(r,.4,M.cap);
  component([622,321,641,356],.75,M.chip,'Left resistor network');component([869,326,888,360],.75,M.chip,'Right resistor network');
  for(const r of [[905,239,923,268],[905,284,923,311],[905,329,923,355]])component(r,.65,M.jst,'Indicator LED');
  const j=component([793,493,929,558],3,M.jst,'JST-SH six-contact service housing');
  const jp=xy(861,555);box(6.6,.16,1.45,jp[0],jp[1]-.04,.65,M.black,'JST service socket opening');for(let i=0;i<6;i++)box(.22,.18,.35,jp[0]-2.5+i,jp[1]-.15,1.05,M.gold,'JST service contact');
  component([1084,334,1276,418],1.8,M.metal,'microSD socket','underside');component([1094,251,1218,312],1.2,M.chip,'AT7456E OSD','underside');component([1265,223,1320,267],.8,M.chip,'IMU','underside');
  if(options.headers===true){const headers=new THREE.Group();headers.name='Optional unfitted Matek DuPont pins';headers.userData.dupontHeader=true;for(const p of pinholes){const base=new THREE.Mesh(new THREE.BoxGeometry(2.5,2.5,2.5),M.black);base.position.set(p[0],p[1],1.25);const pin=new THREE.Mesh(new THREE.BoxGeometry(.64,.64,11.5),M.gold);pin.position.set(p[0],p[1],2.75);for(const m of [base,pin]){m.castShadow=true;m.userData.dupontHeader=true;headers.add(m)}}group.add(headers)}
 }else{
  for(const r of [[131,52,194,105],[210,52,268,105],[299,52,369,105],[399,52,458,105]])component(r,.08,M.gold,'Large BAT/ESC power pad');
  component([218,124,288,177],1.4,M.chip,'TVS power diode');component([324,113,436,167],1.2,M.copper,'Current shunt');
  component([171,426,281,538],3.6,M.ind,'6R8 power inductor');component([300,430,366,505],3,M.ind,'100 power inductor lower');component([393,236,464,310],2.4,M.ind,'100 power inductor upper');
  component([192,303,245,373],.9,M.chip,'Power converter IC');component([335,237,369,284],.9,M.chip,'Power converter switch');component([225,191,264,228],.8,M.chip,'Power controller IC');
  for(const r of [[196,384,244,408],[270,347,317,372],[268,384,319,410],[337,384,388,411],[336,318,386,344],[408,320,464,347],[300,513,347,541]])passive(r,1.25,M.cap,'Power capacitor');
  for(const r of [[158,288,174,303],[157,308,175,326],[158,330,175,344],[158,350,176,365],[157,373,174,389],[260,284,277,302],[260,307,276,327],[279,310,294,328],[299,310,312,329],[285,285,309,299],[278,261,294,273],[327,291,356,307],[366,211,383,223],[349,201,363,226],[330,201,343,226],[310,201,324,226],[289,202,302,227],[266,202,280,228],[200,201,213,227],[309,235,322,258],[381,211,403,223]])passive(r,.45,M.cap);
  const q=xy(421.5,501);const w=3.25,h=8.2,z=5.5;box(w,h,z,q[0],q[1],0,M.black,'2 x 6 board-to-board socket body');
  for(let row=0;row<6;row++)for(const col of [-1,1]){const x=q[0]+col*.635,y=q[1]+(row-2.5)*1.27;box(.66,.66,.07,x,y,z,M.chip,'Socket contact well');box(.2,.35,.08,x-.18,y,z+.03,M.gold,'Socket contact spring');}
  for(const p of mounts)ring(p[0],p[1],1.62,1,0,5.5,M.metal,'Matek interboard spacer');
  group.rotation.z=Math.PI;
 }
 group.updateMatrixWorld(true);let count=0;group.traverse(o=>{if(o.isMesh)count++});meta.meshCount=count;meta.pcbOutlineMm=[22,32];meta.pinHoles=pinholes.length;meta.photo=PHOTO[which];
 return group;
};
})(window);
