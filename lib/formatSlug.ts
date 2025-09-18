export const formatSlug = (val: string): string => {
  if (!val) {
    console.warn("Warning: Empty value passed to formatSlug");
    return "";
  }
  return val
    .replace(/ /g, "-")
    .replace(/[^\w-]+/g, "")
    .toLowerCase();
};
