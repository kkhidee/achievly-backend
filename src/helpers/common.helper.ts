type Falsy = false | 0 | '' | null | undefined;

export const filterObject = <T extends object>(
  obj: Record<string, T | Falsy>,
): obj is Record<string, T> => {
  const entries = Object.entries(obj);

  const filteredEntries = entries
    .map(([key, value]) => {
      if (!!value) {
        return [key, value];
      }

      return undefined;
    })
    .filter(Boolean);

  return Object.fromEntries(filteredEntries);
};
