/* Assembly helper for the photo-derived Matek F405-WMO factory.
 * Nominal visual reconstruction only; not manufacturer CAD or mount qualification.
 * Keeps current comparison factory/assets unchanged.
 */
(function(global){'use strict';
global.makeMatekDroneAssembly=function(THREE,options={}){
 if(typeof global.makeMatekBoard!=='function')throw Error('Load matek-model.js first');
 const outer=new THREE.Group();outer.name='Matek F405-WMO reference assembly';
 const thickness=1.6,gap=6.5,adhesive=1,lowerTop=adhesive+thickness,upperTop=lowerTop+gap+thickness;
 let readyCount=0;const common={photoUrl:options.photoUrl,anisotropy:options.anisotropy,onLoad:()=>{readyCount++;if(outer.userData.metadata)outer.userData.metadata.ready=readyCount===2;options.onLoad?.(outer);},onError:options.onError,headers:false};
 const lower=makeMatekBoard(THREE,'lower',common),upper=makeMatekBoard(THREE,'upper',common);
 lower.rotation.z=0;upper.rotation.z=0;
 function adjust(board){
  board.traverse(m=>{
   if(!m.isMesh)return;
   if(m.userData.pcb||m.name==='Plated mounting hole'||m.name==='2.54 mm through-hole pad'){
    m.geometry=m.geometry.clone();const p=m.geometry.attributes.position;
    for(let i=0;i<p.count;i++)if(p.getZ(i)<0)p.setZ(i,p.getZ(i)*thickness);
    p.needsUpdate=true;m.geometry.computeVertexNormals();m.geometry.computeBoundingBox();m.geometry.computeBoundingSphere();
   }else if(m.position.z<-.9){m.position.z-=thickness-1;}
   if(m.name==='Matek interboard spacer'){
    m.geometry=m.geometry.clone();m.geometry.scale(1,1,gap/5.5);m.geometry.computeBoundingBox();m.geometry.computeBoundingSphere();
   }
  });
  board.userData.metadata={...board.userData.metadata,pcbThicknessMm:thickness,assemblyFacingGapMm:gap,assemblyAdjustment:'1.6mm estimatedPCB thickness and6.5mm photo-estimatedgap;12.7mm publishedbareenvelope, not tolerance-qualified.'};
 }
 adjust(lower);adjust(upper);lower.position.z=lowerTop;upper.position.z=upperTop;outer.add(lower,upper);
 // The upper underside mating header is visible in the official opposite-face
 // photo but omitted in the comparison factory. This small estimated assembly
 // body + twelve posts completes the visible reference connector, not fit CAD.
 const socket=lower.children.find(m=>m.name==='2 x 6 board-to-board socket body');
 if(socket){
  const x=socket.position.x,y=socket.position.y;
  const black=new THREE.MeshStandardMaterial({color:0x121416,roughness:.65}),gold=new THREE.MeshStandardMaterial({color:0xc6a34b,metalness:.8,roughness:.35});
  const body=new THREE.Mesh(new THREE.BoxGeometry(3.25,8.2,.5),black);body.name='Estimated upper interboard header housing';body.position.set(x,y,-thickness-.25);body.castShadow=true;upper.add(body);
  for(let row=0;row<6;row++)for(const col of [-1,1]){
   const pin=new THREE.Mesh(new THREE.BoxGeometry(.3,.3,.6),gold);pin.name='Estimated upper interboard contact';pin.position.set(x+col*.635,y+(row-2.5)*1.27,-thickness-.5-.3);pin.castShadow=true;upper.add(pin);
  }
 }
 // The supplied quad reference mounts Matek with adhesive. Its18.1x12mm M2
 // holes do not match the frame20x20mm FC mounting pattern. Do not reuse our
 // FC's grommets, lift feet or fasteners for this alternative.
 if(options.adhesive!==false){
  const pad=new THREE.Mesh(new THREE.BoxGeometry(19,28,adhesive),new THREE.MeshStandardMaterial({color:0x323437,roughness:.95}));pad.name='Matek reference adhesive support (assumed1mm)';pad.position.z=adhesive/2;pad.castShadow=true;pad.receiveShadow=true;outer.add(pad);
 }
 outer.userData.metadata={ready:false,manufacturerCad:false,source:'OfficialMatek sidephotograph + userquad4_ref_render; estimatedvisualassembly',pcbOutlineMm:[22,32],pcbThicknessMm:thickness,facingGapMm:gap,lowerPcbBottomMm:adhesive,lowerPcbTopMm:lowerTop,upperPcbBottomMm:upperTop-thickness,upperPcbTopMm:upperTop,publishedBareAssemblyHeightMm:12.7,expectedHighestComponentMm:upperTop+3,adhesiveThicknessMm:adhesive,mountPatternMm:[18.1,12],frameMountPatternMm:[20,20],directGrommetCompatibility:false,headerPins:'Unpopulated, matching manufacturerassembledphoto',limitations:['Facinggap andPCB thickness estimated from photograph; not manufacturer dimensioned stackup.','Reference adhesive placement is visual only; adhesive specification, wiring and loads unqualified.','Matek holes do not coincide with frame20x20holes; no directgrommet fit asserted.','Photo-derived connector model does not establish mating tolerances.']};
 outer.userData.lower=lower;outer.userData.upper=upper;outer.updateMatrixWorld(true);return outer;
};
})(window);
