import {
  info,
  danger,
  success,
  warn,
  logAnything,
  writeExecuteLog,
} from '../logger.js';

export default defineEventHandler(async (event) => {
  const req = await readBody(event);
  console.log('req', req);

  let res = {
    method: getMethod(event),
    response: {},
  };

  // if (!Array.isArray(req.parks) || req.parks.length === 0) {
  //   res.response = 'No parks provided';
  //   return res;
  // }

  try {
    // let wcsResult = await taskInsert(req);
    let wcsResult = true;
    res.response = wcsResult;

    if (!wcsResult) {
      danger('Cannot insert parks to WCS');
    }
  } catch (err) {
    danger(`Failed to insert parks to WCS: ${err.message}`);
  }

  return res;
});
