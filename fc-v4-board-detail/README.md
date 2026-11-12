# V4 board studio detail

November 12, 2026. User requested a dedicated detailed photorealistic board-render page with a ruler and penny, linked from the frame viewer.

The page presents three CAD-based Blender Cycles studio renders: Upper Logic, Lower Power and the provisional main stack. A separate interactive Three.js viewer allows either board or the main stack to rotate freely. Both studio and interactive views use actual V4 source meshes, green PCB substrate appearance (#086b32), a 70 mm metric ruler with 1 mm divisions and a US penny at19.05mm diameter and1.52mm thickness.

These are rendered CAD models, not hardware photographs. Geometry derives from the November6 native V4 stack export at checkpoint`abe43c2`. Component colours are given plausible presentation roughness/metalness; substrate appearance is green as requested. No source component geometry, placement or routing changes were made. Fine solder, trace and silkscreen details absent from native meshes are not invented. J20/J21 body models are absent; library shapes are not manufacturer-certified; native slab thickness differs from fabrication layers. Service board position is undefined and it is omitted. Stack facing gap8.64mm remains provisional.

The Cycles renders use 48 adaptive samples at 1800 × 1200 pixels. Intel Open Image Denoise 2.5.1 performs the final LDR/sRGB noise cleanup in high-quality mode; original unfiltered Cycles images remain in the engineering `final-renders/` folder. The finishing script is included as `denoise-render.py`, and its OIDN executable path can be supplied as the third argument.

The engineering recipe, source hashes, source texture and native Blender scene are under`design/V4/mechanical/board-detail-2026-11-12/`. Prepare using the project placement Python environment, then run Blender background with`render-studio.py`. Scripts refuse to overwrite existing final renders; preserve all prior versions in a dated draft before adapting or rerunning. The Blender scene includes the penny image packed into the file.

Penny appearance is reused from the reference drone gallery. Obverse image: United States Mint, via Wikimedia Commons File:2010 cent obverse.png, public-domain US government work. Interactive underside texture: Leopard2A7m, File:Union Shield Cent.jpg, CC BY-SA4.0. Full attribution is in`assets/PENNY-CREDITS.txt`. The Three.js r160 license is included. Viewer assets are local and support offline file viewing.
