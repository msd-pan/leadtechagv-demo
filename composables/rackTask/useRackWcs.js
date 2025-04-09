export const sendRowInfosToWcs = async (
  inputArray,
  count,
  deliveryType,
  type,
  cargo,
) => {
  const data = await $fetch('/api/wcs/sendRowInfosToWcs', {
    method: 'POST',
    body: { inputArray, count, deliveryType, type, cargo },
  }).catch(() => false);
  return data ? data.response : false;
};

export const setRackStatus = async (updates) => {
  const data = await $fetch('/api/db/setRackStatus', {
    method: 'POST',
    body: { updates },
  }).catch(() => false);
  return data ? data.response : false;
};

export const taskInsert = async (type, parks) => {
  // console.log(parks);
  const data = await $fetch('/api/wcs/taskInsert', {
    method: 'POST',
    body: { type, parks },
  }).catch((error) => {
    return false;
  });
  if (!data) {
    return false;
  }
  console.log(data.response);
  return data.response;
};
