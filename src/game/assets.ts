/** Normalizes a public asset path for usage with Vite's base path. */
const normalizeAssetPath = (path: string): string => {
  return path
    .replace(/^\/+/, "")
    .replace(/^public\//, "");
};

/** Builds a public asset URL that respects Vite's configured base path. */
export const asset = (path: string): string => {
  return `${import.meta.env.BASE_URL}${normalizeAssetPath(path)}`;
};

/** Creates the ordered image URLs for a repeated component export. */
export const componentAssets = (
  folder: string,
  componentName: string,
  amount = 18,
): string[] => {
  return Array.from({ length: amount }, (_, index) => {
    const suffix = index === 0 ? "" : `-${index}`;

    return asset(`${folder}/${componentName}${suffix}.png`);
  });
};

/** Starts loading a single image before it is needed in the UI. */
export const preloadImage = (src: string): void => {
  const image = new Image();
  image.src = src;
};

/** Preloads a list of image URLs while safely ignoring empty values. */
export const preloadImages = (sources: Array<string | undefined>): void => {
  sources.filter((src): src is string => Boolean(src)).forEach(preloadImage);
};