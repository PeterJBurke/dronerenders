# V5 board and mounting study

November 12, 2026. Current V5 placement, native PCB artwork, a parametric mechanical carrier and drawing-derived connector models. The page provides assembly, individual board, carrier-only and exploded views, with a millimetre ruler and a true-scale US penny. Left drag rotates, right drag pans and the wheel zooms.

This is an active layout/routing study. Electrical rework and final native checks are still in progress; the displayed artwork is a pre-route integration preview. It is not a manufacturing release.

| Item | Modeled proposal |
|---|---|
| Main PCBs | 22 × 32 mm, unchanged outlines |
| Upper UART header | 16 contacts, 2 × 8; UARTs 1, 2, 3, 6 each have GND / 5 V / TX / RX |
| Interboard connection | 2 × 10 contacts, 1.27 mm (0.050 in) pitch |
| Proposed connector pair | Samtec FW-10-05-L-D-385-065 with CLP-110-02-L-D |
| Facing board gap | 12.065 mm model target; exact mating tolerance remains open |
| Internal structure | Four M2 × 12 mm female/female hex spacers at 30 × 28 mm centres |
| Screws | Four upper M2 × 6 mm and four lower M2 × 12 mm |
| Carrier footprint | 36 × 34 mm, insulating PCB edge rails and saddle |
| Frame isolation interface | Separate 20 × 20 mm centres; exact grommet not selected |
| HD Cargo roof posts | 35 mm checked in the frame model; 25 mm is too short |
| Service cable | 100 mm, 12-circuit JST SH |

R10 sits immediately above the G / BAT+ / ESC+ / G power pads. J21 moves inward, and the current-sense amplifier is on the lower board's bottom face. The UART labels and power pads come from the V5 native CAD artwork.

The 12 JST circuits carry USB, boot/reset, SWD, buzzer control and power. The two extra grounded footprint tabs are mechanical anchors, not extra cable contacts.

In the checked model, the nearest opposing board components have approximately 4.083 mm separation, excluding intended interboard mating geometry. Minimum board-to-carrier component clearance is approximately 0.526 mm and PCB-to-metal clearance is approximately 1.703 mm. These are nominal geometry results, not tolerance or vibration qualification. Female DuPont housings and cable bends are not modeled.

The carrier captures the existing PCB edges without adding PCB holes. Its seats follow measured native mesh thicknesses; the exported slab thickness and fabrication stack values differ. Resolve actual thickness, capture preload, insulating material, grommet compression stops and connector insertion tolerances before fabrication. The stock 12 mm spacers and modeled seat offset do not by themselves validate connector mating.

The native library lacks exact J1/J20/J21 3D bindings. Drawing-derived models supplement them in this presentation. Cosmetic fillets/contact tips approximate the drawings. Carrier STEP contains the mechanical parts; board artwork, native mesh and connector provenance remain in canonical design/V5 sources.

Penny texture credits are in assets/PENNY-CREDITS.txt. Three.js license is in assets/THREE-LICENSE.txt. Earlier V4 pages and files remain preserved as routed references.
