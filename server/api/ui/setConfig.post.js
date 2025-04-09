import { setConfig } from '../../server_config';
import { warn, danger, logAnything } from '../logger';
import path from 'path';

const p = path.resolve('../../' + 'server/server_config.js');
console.log(p);

export default defineEventHandler(async (event) => {
  const req = await readBody(event);

  const res = {
    method: getMethod(event),
    response: {},
  };

  if (!req) {
    return res;
  }

  warn(req);

  if (!('config' in req)) {
    res.response = { Message: 'empty config' };
    return res;
  }

  //update configuration file:

  const newConfig = req.config;

  // setConfig(newConfig);
  const config = {
    initialTable: newConfig,
  };
  console.log(config);
  setConfig(config);

  // logAnything(template)

  // fs.writeFileSync(p, template, "utf8")
  res.response = { Message: 'success' };
  return res;
});
