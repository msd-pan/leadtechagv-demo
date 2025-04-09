import { info, warn, danger, success } from '../logger.js';
import { rcsCheckAgv } from '../../rcsHandler';

export default defineEventHandler(async (event) => {
  const req = await readBody(event);
  // console.log(req);

  let res = {
    method: getMethod(event),
    response: 'checkAgv API Empty',
  };

  try {
    // let rcsResult = await rcsCheckAgv();
    let rcsResult = ['test', 'test'];
    res.response = rcsResult;

    if (!rcsResult) {
      danger('Cannot check agv status, will try again later');
    }
  } catch (err) {
    danger(err);
  } finally {
  }
  return res;
});
