import fs from 'fs';
import path from 'path';
import { info, danger, success, warn } from '../logger.js';

export default defineEventHandler(async (event) => {
  const req = getQuery(event);
  console.log('req', req);

  let res = {
    method: getMethod(event),
    response: 'null',
  };

  try {
    const response = await fetch('http://localhost:6547/error_db.json');
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const errorData = await response.json();

    if (errorData.length > 0) {
      res.response = errorData; // 直接返回 JSON 数据
      success(
        `Successfully fetched errors from JSON: ${errorData.length} records found.`,
      );
    } else {
      res.response = 'No error code found'; // 如果没有找到数据
      warn(`No errors found in JSON`);
    }
  } catch (err) {
    danger(`Failed to fetch errors from local JSON file: ${err.message}`);
  }

  return res;
});
