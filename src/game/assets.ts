type ViteImportMeta = ImportMeta & {
  env?: {
    BASE_URL?: string;
  };
};

export const asset = (path: string): string => {
  const baseUrl = (import.meta as ViteImportMeta).env?.BASE_URL ?? "/";

  return `${baseUrl}${path
    .replace(/^\/+/, "")
    .replace(/^public\//, "")}`;
};

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

export const preloadImage = (src: string): void => {
  const image = new Image();
  image.src = src;
};

export const preloadImages = (sources: Array<string | undefined>): void => {
  sources.filter((src): src is string => Boolean(src)).forEach(preloadImage);
};