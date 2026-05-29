export const getRequiredElement = <T extends Element>(selector: string): T => {
  const element = document.querySelector<T>(selector);

  if (!element) {
    throw new Error(`Element "${selector}" wurde nicht gefunden.`);
  }

  return element;
};

export const capitalize = (value: string): string => {
  return value.charAt(0).toUpperCase() + value.slice(1);
};

export const shuffleArray = <T>(items: T[]): T[] => {
  const array = [...items];

  for (let index = array.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(Math.random() * (index + 1));
    [array[index], array[randomIndex]] = [array[randomIndex], array[index]];
  }

  return array;
};

export const setCssImage = (
  element: HTMLElement,
  customProperty: string,
  imagePath: string,
): void => {
  element.style.setProperty(customProperty, `url("${imagePath}")`);
};