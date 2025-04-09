import * as fs from 'fs';
import path from 'path';
import { warn, danger, logAnything, success } from './api/logger.js';

const filePath = path.resolve('./' + 'server/server_config.json');

const config = JSON.parse(fs.readFileSync(filePath, 'utf8'));

const setConfig = function (newConfig) {
  for (let i in newConfig) {
    config[i] = newConfig[i];
  }

  let stringConfig = JSON.stringify(config, null, 4);

  warn('Overwriting server_config.json with new config: \n' + stringConfig);
  //write to file:
  fs.writeFileSync(filePath, stringConfig, 'utf8', 4);

  success('Successfully updated server_config.json');
};

export { setConfig };
export default config;
