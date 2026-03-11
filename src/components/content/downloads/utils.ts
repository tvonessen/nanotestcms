export function formatFilesize(size: number | null | undefined) {
  if (size === null || size === undefined) {
    return '??? kB';
  }
  return size > 1000000
    ? `${(size / 1000000).toFixed(1)} MB`
    : size > 1000
      ? `${Math.round(size / 1000)} kB`
      : `${size} B`;
}
