// Next.js <Image> handles WebP conversion automatically via /_next/image — no manual extension swap needed
export function getOptimizedImagePath(path: string | undefined): string {
  return path ?? "";
}
