const ALIGNABLE_BLOCK_TYPES = new Set(['text', 'text-image', 'text-video']);

/**
 * Resolves `alignment: 'auto'` on text/text-image/text-video blocks by computing
 * the inverse of the preceding qualifying block's effective alignment.
 * The first auto block with no qualifying predecessor defaults to 'left'.
 * Non-qualifying blocks are passed through unchanged and do not affect the counter.
 */
export function resolveAutoAlignment<T extends { blockType: string; alignment?: string | null }>(
  blocks: T[],
): T[] {
  // Seed as 'right' so the first auto block (no predecessor) resolves to 'left'.
  let lastAlignment: 'left' | 'right' = 'right';

  return blocks.map((block) => {
    if (!ALIGNABLE_BLOCK_TYPES.has(block.blockType)) return block;

    const effective: 'left' | 'right' =
      block.alignment === 'auto'
        ? lastAlignment === 'left'
          ? 'right'
          : 'left'
        : ((block.alignment ?? 'left') as 'left' | 'right');

    lastAlignment = effective;
    return { ...block, alignment: effective } as T;
  });
}
