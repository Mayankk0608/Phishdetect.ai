/**
 * Utility for combining class names with Tailwind CSS.
 * Filters out falsy values and merges string results.
 */
export function cn(...classes: (string | false | null | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}
