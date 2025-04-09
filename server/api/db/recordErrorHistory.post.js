import {
  info,
  danger,
  success,
  warn,
  logAnything,
  writeExecuteLog,
} from '../logger.js';
import db from '../../dbHandler.js';

async function recordErrorHistory(req) {
  let conn;
  try {
    conn = await db();
    // console.log('Database connection established.');
    // console.log('Request data:', req);

    const maxErrorHistories = 10000;
    const [[totalErrorHistories]] = await conn.query(
      'SELECT COUNT(*) AS total FROM error_history',
    );
    console.log(`Total error histories: ${totalErrorHistories.total}`);

    if (totalErrorHistories.total > maxErrorHistories) {
      const deleteResult = await conn.query(
        `DELETE FROM error_history ORDER BY id ASC LIMIT 1;`,
      );

      console.log(
        `Oldest error history deleted. Affected rows: ${deleteResult.affectedRows}`,
      );
    }

    const query = `
    INSERT INTO error_history (e_h_id, e_h_code, e_h_time)
    VALUES (?, ?, NOW());
    `;

    for (const error of req.errors) {
      const values = [error.id, error.code]; // 将数据组装为数组
      try {
        const [result] = await conn.query(query, values); // 使用正确的数组传递参数
        success(
          `Successfully inserted/updated error: ID=${error.id}, Code=${error.code}, Affected rows=${result.affectedRows}`,
        );
      } catch (err) {
        danger(
          `Failed to insert/update error: ID=${error.id}, Code=${error.code}, Error: ${err.message}`,
        );
        throw err; // 确保错误被捕获到外层处理
      }
    }

    await conn.commit(); // 提交事务
    logAnything(`All errors have been recorded successfully.`);
  } catch (err) {
    await conn.rollback(); // 回滚事务
    danger(`Failed to insert error into local history: ${err.message}`);
    throw new Error(`Insertion error: ${err.message}`);
  } finally {
    if (conn) {
      await conn.end(); // 关闭数据库连接
      info('Database connection closed.');
    }
  }
}

export default defineEventHandler(async (event) => {
  const req = await readBody(event);
  console.log('Received request body:', req);

  let res = {
    method: getMethod(event),
    response: null,
  };

  try {
    await recordErrorHistory(req);
    res.response = 'Error history recorded successfully.';
    success('Error history recorded successfully and response sent.');
  } catch (error) {
    res.response = `Error: ${error.message}`;
    danger(`Error while recording error history: ${error.message}`);
  }

  return res;
});
