export function otpGroups(maxLength = 6, groupSize?: number): number[][] {
  const length = Number.isFinite(maxLength)
    ? Math.max(1, Math.min(32, Math.trunc(maxLength)))
    : 6;
  const size =
    groupSize != null && Number.isFinite(groupSize) && groupSize > 0
      ? Math.max(1, Math.trunc(groupSize))
      : length;
  const groups: number[][] = [];
  for (let start = 0; start < length; start += size)
    groups.push(
      Array.from(
        { length: Math.min(size, length - start) },
        (_, offset) => start + offset,
      ),
    );
  return groups;
}
