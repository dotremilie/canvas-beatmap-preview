# Canvas osu! Beatmap Preview [WIP]

An osu! beatmap renderer based on [JerryZhu99/osu-preview](https://github.com/JerryZhu99/osu-preview) that utilizes HTML canvas. 
The project uses `osu-parsers` and `osu-classes` libraries for most non-rendering related stuff. The goal is to provide a ready-to-use package
that lets developers render osu! beatmaps with in a lightweight and easy way. This implementation's features:

- Beatmap combo colors.
- Correctly computed complex slider shapes (osu-preview implementation freezes on bezier sliders with multiple anchors due to incorrect computation. 
It is mathematically correct for a Bézier curve, but osu! uses approximation for Béziers, for more details see [PathApproximator.cs#L79](https://github.com/ppy/osu-framework/blob/master/osu.Framework/Utils/PathApproximator.cs#L79)).
- Aspire maps are supported.
- Correctly renders catmull sliders.
- Ability to create multiple previews at once within one context without noticeable performance drawbacks.

### Missing, planned features

- Slider repeats are not implemented.
- Simple skinning.
- Mod support.

---

## Installation and Setup

### Prerequisites:
- Node.js (v18 or higher recommended)
- npm (Node Package Manager)

### Steps:
1. Clone this repository:
   ```bash
   git clone https://github.com/dotremilie/canvas-beatmap-preview.git
   cd canvas-beatmap-preview
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. To build the project for production:
   ```bash
   npm run build
   ```

## Acknowledgements

- [osu!](https://osu.ppy.sh/)
- kionell's [osu-parsers](https://github.com/kionell/osu-parsers), [osu-classes](https://github.com/kionell/osu-classes) and others.
