import fs from 'fs';
import path from 'path';
import { info, danger, success, warn } from '../logger.js';

export default defineEventHandler(async (event) => {
  const req = await readBody(event);
  console.log('Request received:', req);

  let res = {
    method: getMethod(event),
    response: null,
    ifExist: false,
  };

  // 检查必要参数是否存在
  if (!req.taskId || !req.errorCode) {
    danger('Missing required parameters: taskId or errorCode');
    res.response = 'Invalid input: taskId and errorCode are required.';
    return res;
  }

  try {
    const response = await fetch('http://localhost:6547/error_db.json');
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const errorHistory = await response.json();

    // 在 JSON 中查找匹配的 `taskId` 和 `errorCode`
    const foundError = errorHistory.find(
      (error) =>
        String(error.e_h_id) === String(req.taskId) &&
        String(error.e_h_code) === String(req.errorCode),
    );

    if (foundError) {
      res.ifExist = true; // 如果找到匹配的记录
      success(
        `Successfully fetched error_history from JSON: ${JSON.stringify(
          foundError,
        )}`,
      );
      res.response = foundError;
    } else {
      res.ifExist = false; // 如果没有找到匹配的记录
      warn('No matching error_history found in JSON.');
    }
  } catch (err) {
    danger(`Failed to fetch error_history from JSON: ${err.message}`);
    res.response = `Error occurred: ${err.message}`;
  }

  return res;
});
