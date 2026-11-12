# V4 flight controller on the MOD-L 4-inch HD Cargo frame

Provisional assembly study, November 12, 2026. The user supplied two MOD-L archives and requested the 4-inch HD Cargo variant with our flight controller. The later presentation reference was [the user's reference quad viewer](https://peterjburke.github.io/dronerenders/quad4_ref_render.html), with the scope restricted to the frame and flight controller.

The portable interactive viewer is `FC-Design/V4/Frame-Study-HD-Cargo/index.html`. It works directly from a local file without an internet connection. It provides orbit/pan/zoom, angled/top/side/detail views, roof visibility and light/dark controls. The roof is initially hidden to expose the flight controller; toggle it on to see the frame assembled. Four PNG views and a GLB are included beside the viewer. The PNGs are rendered from the actual mesh geometry, not generated illustrations.

## Geometry and identity

Frame source: MOD-L by **ledroneclub**, Thingiverse item **4295478**, licensed **Creative Commons Attribution** in the bundled LICENSE.txt. The selected original files, original description, license and SHA-256/archive provenance are retained under `references/mod-l-hd-cargo/`. The inbox archives and unrelated inbox files are unchanged.

- Bottom: `MOD-L_HD_CARGO_bottom_plate_2mm_v1-0.stl`.
- Top: `MOD-L_HD_CARGO_top_plate_2mm_v1-1.stl`.
- Four mirrored copies of `MOD-L_arm_4in_3.5mm_v1-1.stl` (regular arm, not BEEF).
- Cross: `MOD-L_bottom_cross_2mm_v2-0.stl`.
- Six simplified 25 mm tall, 4.5 mm diameter frame standoff bodies following the user's reference viewer. The middle pair selection and exact hardware geometry are assumptions.

**Source discrepancy:** the arm filename and bundled cutting recommendation say 3.5 mm, but the supplied STL extrusion measures **3.000 mm**. This study retains that actual mesh unchanged, matching the user's reference viewer. It must not be used as an approved 3.5 mm fabrication model. All plates measure 2 mm thick. The source STLs have inconsistent standalone Z placements; translations assemble cross at Z0–2, arms at Z2–5, bottom at Z5–7 and top at Z32–34 mm. No mesh is stretched to fit.

The central bottom-plate DXF holes are exactly X/Y **±10 mm**, matching the selected 20 × 20 mm mounting centres. A second rear pattern is approximately 20 × 20 mm at Y−28/−48 mm. The top v1-1 does not provide the same stack mounting pattern. Source DXF circles were inspected; this is a frame interface finding, not a finished carrier design.

The flight controller uses the existing **V4 native UpperLogic/LowerPower mesh assembly** from the November 6 CAD checkpoint `abe43c2`, including actual component geometry and native component material base colours; the two PCB substrates use the requested green appearance (#086b32). It retains the existing **8.64 mm facing-board gap**. This is our V4 stack, not the template's simplified Matek FC. The separate Service board is omitted because its placement is not defined; this view shows the main FC stack. No motors, props, battery, other electronics or cable are modeled.

## Placement and checks

Frame coordinates: X lateral, +Y nose, Z up; units are millimeters. The FC is centred at X/Y0 over the central 20 mm mounting pattern. A vertical translation of approximately 12.363 mm places the lowest available component 1 mm above the bottom-plate top surface. This height is a **display assumption**; it does not define the carrier support height.

The available native FC meshes were checked against all displayed frame parts, including the roof and standoff cylinders, using trimesh/python-fcl mesh collision and distance queries:

- No intersections between available FC and frame meshes.
- Minimum available-mesh separation: **1.000 mm**.
- Highest available FC component to roof underside plane: **1.822 mm**.

Exact values, source hashes, transforms and nearest-object identity are in `assembly-verification.json`. The narrow height margins are visual-study results only. They exclude the carrier, grommets, screw heads, mating plugs, wires, motion and tolerances. The modeled native PCB slabs differ from the saved fabrication stacks. J20/J21 connector bodies are absent. Consequently, **this does not demonstrate a buildable or vibration-qualified mounting arrangement**. Choosing a grommet/support assembly may require more frame height or a revised placement.

No canonical PCB source, native project, board placement or routing was modified, and no new board revision is claimed. The earlier board top/bottom/angled views remain the current native render set. This new frame assembly is explicitly provisional.

## Reproduction and artifacts

`build-assembly.py` assembles the source geometry, computes collision/distance evidence, exports GLBs and packs the browser mesh data. Use `tools/placement-venv/bin/python`; it refuses to overwrite its outputs. Preserve existing output files into a dated draft before adapting/re-running. `capture-views.py` uses global Python Playwright and local Chrome to capture the viewer; preserve previous images before re-running.

The PCB substrates use green (#086b32); component materials retain their native base colours. These are simplified materials, not photorealistic soldermask/silkscreen textures. Left-button dragging rotates the near side of the model in the drag direction; right-button dragging pans and the wheel zooms. The orbit signs account for this viewer’s Z-up coordinates. First captures revealed lost PBR base colours in the mesh packing; those images are preserved in dated drafts, and final captures use the corrected base-colour mapping and sRGB conversion. No source geometry changed during that correction.

The portable Three.js runtime is r160, from the same CDN version used by the template, with its MIT license included under `assets/`. It is a runtime viewer asset, not a build dependency. The final viewer has no external script, network model fetch or service dependency.

Frame credit: ledroneclub, [MOD-L on Thingiverse](https://www.thingiverse.com/thing:4295478), CC Attribution. Visual presentation follows the user-provided reference page. Current main-board CAD provenance and all limitations accompany the files.
