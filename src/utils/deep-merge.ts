export function isObject(item: unknown): boolean {
  return Boolean(item && typeof item === 'object' && !Array.isArray(item));
}

// biome-ignore lint/suspicious/noExplicitAny: any is needed to support deep merging
export default function deepMerge(obj1: any, obj2: any) {
  const output = { ...obj1 };

  for (const key in obj2) {
    if (Object.prototype.hasOwnProperty.call(obj2, key)) {
      if (typeof obj2[key] === 'object' && !Array.isArray(obj2[key]) && obj1[key]) {
        output[key] = deepMerge(obj1[key], obj2[key]);
      } else {
        output[key] = obj2[key];
      }
    }
  }

  return output;
}
