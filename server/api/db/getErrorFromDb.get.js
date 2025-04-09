import fs from 'fs';
import path from 'path';
import { info, danger, success } from '../logger.js';

export default defineEventHandler(async (event) => {
  const req = getQuery(event);
  // console.log('req', req);

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

    // 在 JSON 中查找匹配的 `e_code_10`
    const foundError = errorData.find(
      (error) => String(error.e_code_10) === String(req.errorCode),
    );

    if (foundError) {
      res.response = foundError; // 返回匹配的错误信息
      success(
        `Successfully fetched error from JSON for code: ${req.errorCode}`,
      );
    } else {
      res.response = 'null'; // 如果没有找到匹配的记录，返回 `null`
    }
  } catch (err) {
    danger(`Failed to fetch error from JSON: ${err.message}`);
  }

  return res;
});
