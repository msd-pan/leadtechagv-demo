import { info, warn, danger, success } from '../logger.js';
import { rcsCheckUnfinishedTask } from '../../rcsHandler';

export default defineEventHandler(async (event) => {
  const req = await readBody(event);
  // console.log(req);

  let res = {
    method: getMethod(event),
    response: 'check unfinished task api Empty',
  };

  try {
    // let rcsResult = await rcsCheckUnfinishedTask(req);
    let rcsResult = ['test', 'test'];
    res.response = rcsResult;
    // console.log('rcsResult', rcsResult);

    if (!rcsResult) {
      danger('Cannot check unfinished tasks from RCS, will try again later');
    }
  } catch (err) {
    danger('Error in check unfinished tasks from RCS:', err);
  } finally {
  }
  return res;
});
