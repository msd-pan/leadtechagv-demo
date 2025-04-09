import { info, danger, success } from '../logger.js';

export default defineEventHandler(async (event) => {
  const req = await readBody(event);
  // console.log(req);

  let res = {
    method: getMethod(event),
    response: {},
  };

  try {
    // let wcsResult = await sendRowInfosToWcs(req);
    let wcsResult = true;
    res.response = wcsResult;

    if (!wcsResult) {
      danger('Cannot send row infos to WCS');
    }
  } catch (err) {
    danger('Error in sending row infos to WCS:', err);
  } finally {
  }

  return res;
});
