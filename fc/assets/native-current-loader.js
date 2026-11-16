/* Exact native buffers + a material-only analytic four-mask predicate. No generated board/pad solids. */
window.addCurrentNativeAssembly=function(THREE,groups){
 const decode=(s,T)=>{const b=atob(s),u=new Uint8Array(b.length);for(let i=0;i<b.length;i++)u[i]=b.charCodeAt(i);return new T(u.buffer)};
 const linear=x=>x<=.04045?x/12.92:Math.pow((x+.055)/1.055,2.4);
 function finishMaterial(row,name,index){
  const c=row.rgba||[.5,.5,.5,1],rgb=row.colorSpace==='srgb'?c.slice(0,3).map(linear):c.slice(0,3);
  const display=window.CURRENT_MASK_MATERIAL_SLOTS.find(s=>s.name===name&&s.index===index);if(display){if(JSON.stringify(c)!==JSON.stringify(display.before))throw Error('Mask source material mismatch');rgb.splice(0,3,...display.after_srgb.map(linear));}
  const mat=new THREE.MeshStandardMaterial({color:new THREE.Color().setRGB(...rgb),roughness:.4,metalness:0,side:THREE.DoubleSide});
  if(row.powerMask){
   mat.roughness=.3;mat.metalness=.03;mat.customProgramCacheKey=()=> 'FC_four_native_face_masks_v1';
   mat.onBeforeCompile=shader=>{
    shader.vertexShader='varying vec2 fcNativeXY;\n'+shader.vertexShader;
    shader.vertexShader=shader.vertexShader.replace('#include <project_vertex>','fcNativeXY=transformed.xy;\n#include <project_vertex>');
    shader.fragmentShader='varying vec2 fcNativeXY;\nfloat fcRoundedMask(vec2 p,vec4 b,float r){vec2 q=max(max(b.xy-p,p-b.zw),vec2(0.0));return dot(q,q)<=r*r?1.0:0.0;}\n'+shader.fragmentShader;
    const expr='vec2 fcP=fcNativeXY*0.999998;float fcMask=max(max(fcRoundedMask(fcP,vec4(-13.75,-23.65,-8.75,-19.65),0.000005),fcRoundedMask(fcP,vec4(-6.25,-23.65,-1.25,-19.65),0.000005)),max(fcRoundedMask(fcP,vec4(8.75,-23.65,13.75,-19.65),0.00001),fcRoundedMask(fcP,vec4(1.25,-23.65,6.25,-19.65),0.00001)));';
    shader.fragmentShader=shader.fragmentShader.replace('#include <color_fragment>','#include <color_fragment>\n'+expr+'diffuseColor.rgb=mix(diffuseColor.rgb,vec3(0.5704815983772278,0.295699805021286,0.021980946883559227),fcMask);');
    shader.fragmentShader=shader.fragmentShader.replace('#include <roughnessmap_fragment>','#include <roughnessmap_fragment>\nroughnessFactor=mix(roughnessFactor,0.3,fcMask);');
    shader.fragmentShader=shader.fragmentShader.replace('#include <metalnessmap_fragment>','#include <metalnessmap_fragment>\nmetalnessFactor=mix(metalnessFactor,0.8,fcMask);');
   };
  }
  return mat;
 }
 const counts={nativeObjects:0,frameObjects:0,triangles:0,predicateMaterialSlots:0,provisionalHardware:0};
 for(const d of CURRENT_NATIVE_MESHES){
  const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.BufferAttribute(decode(d.p,Float32Array),3));g.setAttribute('normal',new THREE.BufferAttribute(decode(d.n,Float32Array),3));const ix=decode(d.i,Uint32Array);g.setIndex(new THREE.BufferAttribute(ix,1));for(const r of d.ranges)g.addGroup(...r);
  const mats=d.materials.map((row,index)=>finishMaterial(row,d.name,index)),m=new THREE.Mesh(g,mats);m.name=d.name;m.position.fromArray(d.translation);m.userData={group:'fc',board:d.board,role:d.role,ref:d.ref,currentNative:true,dupontHeader:window.CURRENT_HEADER_MESH_NAMES.includes(d.name)};groups.fc.add(m);counts.nativeObjects++;counts.triangles+=ix.length/3;counts.predicateMaterialSlots+=d.materials.filter(x=>x.powerMask).length;if(d.role==='provisional_hardware')counts.provisionalHardware++;
 }
 for(const d of CURRENT_FRAME_MESHES){
  const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.BufferAttribute(decode(d.p,Float32Array),3));g.setAttribute('normal',new THREE.BufferAttribute(decode(d.n,Float32Array),3));const c=decode(d.c,Float32Array);for(let i=0;i<c.length;i++)c[i]=linear(c[i]);g.setAttribute('color',new THREE.BufferAttribute(c,3));g.setIndex(new THREE.BufferAttribute(decode(d.i,Uint32Array),1));const mat=new THREE.MeshStandardMaterial({vertexColors:true,roughness:.77,metalness:.16,side:THREE.DoubleSide});const m=new THREE.Mesh(g,mat);m.name=d.name;groups[d.group].add(m);counts.frameObjects++;
 }
 if(counts.frameObjects!==13||counts.predicateMaterialSlots!==3||counts.provisionalHardware!==48)throw Error('Current native assembly scope mismatch');
 if(groups.fc.children.filter(m=>m.userData.dupontHeader).length!==44)throw Error('Header ownership count');window.CURRENT_NATIVE_ASSEMBLY_COUNTS=counts;return counts;
};
