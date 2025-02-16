const combinedFn = (str: string) => {
  const middleIndex = Math.floor(str.length / 2);
  return str.slice(0, middleIndex) + "T" + str.slice(middleIndex);
};

export const encryptApiKey = (
  tableId: string,
  userId: string,
  method: string
): string => {
  let encryptedString = method.padEnd(6, "a") + tableId + userId;
  for (let i = 0; i < 4; i++)
    encryptedString = btoa(combinedFn(encryptedString));
  return encryptedString;
};
