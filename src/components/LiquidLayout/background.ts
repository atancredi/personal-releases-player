export interface ShaderConfig {
  complexity: number;
  chaos: number;
  density: number;
  viscosity: number;
  crystallize: number;
  merge: number;
  speed: number;
  warpScale: number;
  styleId: number;
  color1: string;
  color2: string;
  color3: string;
  pixelSize: number;
  panX: number;
  panY: number;
  flowX: number;
  flowY: number;
  brightness: number;
  contrast: number;
  vignette: number;
  alphaMode: number;
}

// Your dialed-in preset ready for production
export const PRESETS: { [k: string]: ShaderConfig } = {
  "custom01": {
    "complexity": 1,
    "chaos": 5,
    "density": 1.2,
    "viscosity": 0.2,
    "crystallize": 0.15,
    "merge": 0.05,
    "speed": 0.09,
    "warpScale": 0.5,
    "styleId": 3,
    "color1": "#ff0055",
    "color2": "#00ffff",
    "color3": "#2200ff",
    "pixelSize": 2,
    panX: 0.0,
    panY: 0.0,
    flowX: 0.1,
    flowY: -0.05,
    brightness: 0.8,
    contrast: 1.2,
    vignette: 0,
    alphaMode: 1.0 // 1.0 ensures the dark voids are transparent
  },
  "subtle_bw": {
    "complexity": 2,
    "chaos": 0,
    "density": 0.2,
    "viscosity": 0.1,
    "crystallize": 0.55,
    "merge": 0,
    "speed": 0.02,
    "warpScale": 0.5,
    "styleId": 0,
    "color1": "#121212",
    "color2": "#747474",
    "color3": "#171717",
    "pixelSize": 1.5,
    panX: 0.0,
    panY: 0.0,
    flowX: 0.1,
    flowY: -0.05,
    brightness: 0.9,
    contrast: 1.6,
    vignette: 0,
    alphaMode: 0.0
  },
  "barff": {
    "complexity": 2,
    "chaos": 2.5,
    "density": 1,
    "viscosity": 0.5,
    "crystallize": 0,
    "merge": 0.5,
    "speed": 0.13,
    "warpScale": 8.7,
    "styleId": 0,
    "color1": "#ffff00",
    "color2": "#00ff00",
    "color3": "#c4c4c4",
    "pixelSize": 1,
    panX: 0.0,
    panY: 0.0,
    flowX: 0.1,
    flowY: -0.05,
    brightness: 0.9,
    contrast: 1.6,
    vignette: 0,
    // alphaMode: 1.0 // 1.0 ensures the dark voids are transparent
    alphaMode: 0.0
  }
};
