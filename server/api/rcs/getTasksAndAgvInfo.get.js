import { info, danger, success } from '../logger.js';
import { rcsCheckUnfinishedTask, rcsCheckAgv } from '../../rcsHandler.js';

export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  // console.log(req);

  let res = {
    method: getMethod(event),
    response: {},
  };

  try {
    // let rcsResult = await rcsCheckUnfinishedTask();
    let rcsResult = ['test', 'test'];
    res.response.orders = rcsResult;

    if (!rcsResult) {
      danger('Cannot check unfinished tasks from RCS, will try again later');
    }
  } catch (err) {
    danger('Error in check unfinished tasks from RCS:', err);
  } finally {
  }

  try {
    let rcsResult = await rcsCheckAgv();
    res.response.agvInfos = rcsResult;

    if (!rcsResult) {
      danger('Cannot check agv status, will try again later');
    }
  } catch (err) {
    danger('Cannot check agv status, will try again later', err);
  } finally {
  }
  return res;
});
