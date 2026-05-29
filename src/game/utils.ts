/** Returns a required DOM element or throws a clear error when it is missing. */
export const getRequiredElement = <T extends Element>(selector: string): T => {
  const element = document.querySelector<T>(selector);

  if (!element) {
    throw new Error(`Element "${selector}" wurde nicht gefunden.`);
  }

  return element;
};

/** Capitalizes the first character of a string without changing the rest of it. */
export const capitalize = (value: string): string => {
  return value.charAt(0).toUpperCase() + value.slice(1);
};

/** Returns a shuffled copy of an array using the Fisher-Yates algorithm. */
export const shuffleArray = <T>(items: T[]): T[] => {
  const array = [...items];

  for (let index = array.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(Math.random() * (index + 1));
    [array[index], array[randomIndex]] = [array[randomIndex], array[index]];
  }

  return array;
};

/** Stores an image URL in a CSS custom property as a valid url() value. */
export const setCssImage = (
  element: HTMLElement,
  customProperty: string,
  imagePath: string,
): void => {
  element.style.setProperty(customProperty, `url("${imagePath}")`);
};