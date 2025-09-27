export function ensureArray(input: any): any[] {
  return Array.isArray(input) ? input : [];
}

export const ensureObject = (input: any): any => {
  return typeof input === "object" ? input : {};
};
