# Sources and attribution

## Paul Tol colour schemes

Bright, Vibrant, Muted (nine data colours, excluding the missing-data pale grey), and High Contrast (three data colours, excluding background black/white) are numerical palette definitions from Paul Tol, *Colour Schemes*, SRON/EPS/TN/09-002, issue 3.2, 18 August 2021.

Source: https://sronpersonalpages.nl/~pault/data/colourschemes.pdf

Ocean and Balance are original illustrative discrete palettes for this project. They are not Paul Tol palettes and are not certified perceptually uniform or colour-vision-deficiency safe.

## Colour vision simulation matrices

Full-severity numerical matrices are from Machado et al.'s colour-vision-deficiency simulation model, as tabulated in Colour's `colour/blindness/datasets/machado2010.py`.

- Model: https://www.inf.ufrgs.br/~oliveira/pubs_files/CVD_Simulation/CVD_Simulation.html
- Dataset: https://github.com/colour-science/colour/blob/develop/colour/blindness/datasets/machado2010.py
- Implementation applies matrices to linear-light sRGB, clips to gamut, then re-encodes sRGB. These are approximate previews at severity 1.0; no medical diagnosis is performed.

Colour dataset notice (BSD 3-Clause):

Copyright (c) 2013, Colour Developers. All rights reserved.

Redistribution and use in source and binary forms, with or without modification,
are permitted provided that the following conditions are met:

1. Redistributions of source code must retain the above copyright notice, this
   list of conditions and the following disclaimer.
2. Redistributions in binary form must reproduce the above copyright notice,
   this list of conditions and the following disclaimer in the documentation
   and/or other materials provided with the distribution.
3. Neither the name of the copyright holder nor the names of its contributors
   may be used to endorse or promote products derived from this software without
   specific prior written permission.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR
ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
(INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON
ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
(INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

## Contrast

Relative sRGB luminance and contrast follow WCAG 2.x:
https://www.w3.org/WAI/WCAG21/Understanding/contrast-minimum.html

Text contrast is separate from distinguishability between data series.

## User-provided reference palettes

Three additional palettes are transcribed from HEX labels in user-provided reference images, retaining their left-to-right order. Display names are descriptive names assigned during transcription, not verified original names. Original authorship and reuse terms have not been verified. Original images are not distributed with this extension. No colour-vision safety or perceptual uniformity certification is claimed.

## nature-skills / nature-figure

Eight palette definitions (six semantic dictionaries and two default cycles), and a curated chart-type index are derived from `Yuan1z0825/nature-skills`, commit `6827ae57b62b201acd06b401619050411c0d82f6`. Upstream repository license: Apache-2.0; full license is included at `licenses/nature-skills-LICENSE.txt`. Source: https://github.com/Yuan1z0825/nature-skills

Only palette constants and descriptive metadata are integrated into the plugin. Chart thumbnails are newly implemented Canvas UI illustrations with deterministic demo geometry, not copied experiment figures or third-party `figures4papers` assets. The downloaded source snapshot is excluded from the VSIX. The original user reference screenshots are not redistributed.

## D3 / ColorBrewer and Matplotlib palettes

62 numerical palette definitions added in 0.3.0: 37 from d3-scale-chromatic 3.1.0 (ISC, with ColorBrewer Apache-2.0 attribution), and 25 from Matplotlib 3.6.3 (Matplotlib license, including applicable upstream notices). See OPEN-PALETTES.md and open-palettes.json for exact per-palette sources.

Sources: https://github.com/d3/d3-scale-chromatic/tree/v3.1.0 and https://github.com/matplotlib/matplotlib/tree/v3.6.3

Changes: categorical ColorBrewer/D3 arrays are transcribed at their largest provided size. Matplotlib lookup tables are sampled at nine equally spaced positions; cyclic maps use twelve positions with the duplicate endpoint omitted. Values are converted to rounded sRGB HEX strings. These are discrete samples, not full continuous lookup tables. No upstream runtime code is bundled.

License texts are included in licenses/d3-scale-chromatic-LICENSE.txt, licenses/nature-skills-LICENSE.txt (Apache-2.0), licenses/matplotlib-LICENSE.txt, licenses/matplotlib-LICENSE_COLORBREWER.txt and licenses/matplotlib-LICENSE_YORICK.txt.

## Named color table

148 CSS4 color names and 8 BASE_COLORS aliases are numerical definitions transcribed from Matplotlib 3.6.3 matplotlib.colors. RGB components are rounded to 8-bit HEX. Source: https://github.com/matplotlib/matplotlib/blob/v3.6.3/lib/matplotlib/colors.py and _color_data.py. The existing Matplotlib license texts apply. Aliases are retained and counted as names, not unique colors or palette groups.

## Origin graph-type index

Source: https://www.originlab.com/index.aspx?go=Products/Origin/Graphing (retrieved 2026-10-17). Standard graph-type names and a factual category index are used as references. Origin website images, templates, datasets, long-form descriptions and software are not redistributed. Chinese explanations, synthetic data geometry and Canvas illustrations are newly authored for this extension. Origin and OriginLab are marks of their respective owner; no endorsement or affiliation is implied. Scope and limitations are documented in ORIGIN-CATALOG.md.
