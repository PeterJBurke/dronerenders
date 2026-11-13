window.makeFCSurfaces=function(renderer,onload){
 const out=[],manager=new THREE.LoadingManager(),loader=new THREE.TextureLoader(manager),textures={};manager.onLoad=onload;
 const unpack=(s,T)=>{const b=atob(s),a=new Uint8Array(b.length);for(let i=0;i<b.length;i++)a[i]=b.charCodeAt(i);return new T(a.buffer)};
 for(const [board,data]of Object.entries(FC_SURFACES.boards)){textures[board]={};for(const [face,maps]of Object.entries(data.faces)){const ts={};for(const [kind,url]of Object.entries(maps)){const t=loader.load(url);t.colorSpace=kind==='basecolor'?THREE.SRGBColorSpace:THREE.NoColorSpace;t.anisotropy=renderer.capabilities.getMaxAnisotropy();ts[kind]=t}textures[board][face]=ts}}
 for(const d of FC_SURFACE_GEOMETRY){const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.BufferAttribute(unpack(d.p,Float32Array),3));g.setAttribute('normal',new THREE.BufferAttribute(unpack(d.n,Float32Array),3));g.setAttribute('uv',new THREE.BufferAttribute(unpack(d.u,Float32Array),2));g.setIndex(new THREE.BufferAttribute(unpack(d.i,Uint32Array),1));let mat;
 if(d.face==='top'||d.face==='bottom'){const t=textures[d.board][d.face];mat=new THREE.MeshStandardMaterial({map:t.basecolor,metalnessMap:t.metalness,roughnessMap:t.roughness,alphaMap:t['surface-opacity'],alphaTest:.5,metalness:1,roughness:1,bumpMap:t.relief,bumpScale:.012,side:THREE.DoubleSide})}else mat=new THREE.MeshStandardMaterial({color:0x355e36,metalness:0,roughness:.6,side:THREE.DoubleSide});
 const m=new THREE.Mesh(g,mat);m.name=d.board+'/'+d.face;m.userData={board:d.board,group:'pcb',role:'substrate',dupontHeader:false};out.push(m);
 }return out;
};
