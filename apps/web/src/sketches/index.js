const modules = import.meta.glob("./*.js", { eager: true });

export const sketchRegistry = {};
export const availableSketches = [];

for (const [path, mod] of Object.entries(modules)) {
  if (path === "./index.js") continue;
  if (!mod.sketch || !mod.sketchKey) continue;
  sketchRegistry[mod.sketchKey] = mod;
  availableSketches.push({ key: mod.sketchKey, label: mod.sketchLabel || mod.sketchKey });
}