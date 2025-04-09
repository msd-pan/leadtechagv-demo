import { info, danger, success, warn } from '../logger.js';
import db from '../../dbHandler.js';

export default defineEventHandler(async (event) => {
  const req = getQuery(event);
  console.log('req', req);

  let res = {
    method: getMethod(event),
    response: 'null',
  };

  let conn = await db();
  try {
    // const [rows, fields] = await conn
    //   .query(
    //     `SELECT * FROM error_history WHERE DATE(e_h_time) = CURDATE() ORDER BY id DESC;`,
    //   )
    //   .catch((err) => {
    //     danger('Error while querying' + err);
    //   });
    const rows = [
      {
        id: 8,
        e_h_id: '0001',
        e_h_code: '18886921',
        e_h_time: '1/4/2025 18:38:06',
      },
      {
        id: 7,
        e_h_id: '0001',
        e_h_code: '18886917',
        e_h_time: '12/3/2025 16:48:16',
      },
      {
        id: 6,
        e_h_id: '0001',
        e_h_code: '120590852',
        e_h_time: '10/3/2025 16:48:16',
      },
      {
        id: 5,
        e_h_id: '0001',
        e_h_code: '70254668',
        e_h_time: '7/3/2025 16:08:16',
      },
      {
        id: 4,
        e_h_id: '0001',
        e_h_code: '104859907',
        e_h_time: '6/3/2025 16:08:16',
      },
      {
        id: 3,
        e_h_id: '0001',
        e_h_code: '37748773',
        e_h_time: '4/3/2025 11:08:16',
      },
      {
        id: 2,
        e_h_id: '0001',
        e_h_code: '37751361',
        e_h_time: '4/3/2025 11:08:02',
      },
      {
        id: 1,
        e_h_id: '0001',
        e_h_code: '36700186',
        e_h_time: '4/3/2025 10:58:48',
      },
    ];
    if (rows.length > 0) {
      res.response = rows; // 如果找到匹配的记录，将其作为响应返回
      success(`Successfully fetched error_history from DB:${rows[0]}`);
    } else {
      res.response = []; // 如果没有找到匹配的记录，返回提示信息
      warn(`No error_history found`);
    }

    await conn.end(); // 关闭数据库连接
  } catch (err) {
    danger(
      `Failed to fetch error_history from local error_history: ${err.message}`,
    );
  }

  return res;
});
