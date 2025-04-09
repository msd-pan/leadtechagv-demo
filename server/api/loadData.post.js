import fs from 'fs';
import path from 'path';
import { info, danger, success } from './logger.js';
import { createTables } from '../dbHandler.js';
import db from '../dbHandler.js';

export default defineEventHandler(async (event) => {
  const query = await readBody(event);
  // console.log('query', query);
  let res = { method: getMethod(event), status: '' };

  // 以下为往数据库中插入error codes的方法。
  // 获取项目的根目录
  const projectRoot = process.cwd();

  // console.log('projectRoot', projectRoot);
  // 读取 JSON 文件
  const readErrorCodes = (file) => {
    const filePath = path.join(projectRoot, 'server', file);
    // console.log('filePath', filePath);
    if (!fs.existsSync(filePath)) {
      throw new Error(`File not found: ${filePath}`);
    }
    const data = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(data);
  };

  // 插入数据到数据库
  const insertErrorCodes = async () => {
    const errorCodes = readErrorCodes('err_code.json');

    let conn = await db();
    try {
      // info('Transaction started.');

      for (const errorCode of errorCodes) {
        let {
          Errorcode,
          Errortype,
          ErrorNo,
          ErrorNoReason,
          errorInfo,
          錯誤信息,
          モード,
          停止場所,
          停止原因,
          復旧方法,
          不具合場所,
          不具合原因,
          不具合対策,
          手順書,
        } = errorCode;

        let ifShow = false;
        // 检查 Errorcode 的第一位是否是 0
        if (
          (Errorcode.startsWith('0') &&
            (Errorcode[2] === '3' || Errorcode[2] === '4')) ||
          Errorcode.startsWith('1') ||
          Errortype == '2'
        ) {
          ifShow = true;
        }

        // 将非系统的 Errorcode 从十六进制转换为十进制
        let errorCode10, errorCode16;
        errorCode16 = Errorcode;
        if (Errorcode.startsWith('0'))
          errorCode10 = parseInt(errorCode16, 16).toString();
        else errorCode10 = Errorcode;

        const query = `
        INSERT INTO error_code (e_code_10, e_code_16, e_type, e_no,e_no_reason,  e_message_en, e_message_chs, e_mode, e_stop_part, e_stop_reason,e_stop_fix_way, e_defect_part, e_defect_reason, e_defect_fix_way, e_hand_book, e_show)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;

        // info(
        //   `Inserting error code: ${code}, ${錯誤信息}, ${errorMessage}, ${errorType}`,
        // );

        try {
          await conn.query(query, [
            errorCode10,
            errorCode16,
            Errortype,
            ErrorNo,
            ErrorNoReason,
            errorInfo,
            錯誤信息,
            モード,
            停止場所,
            停止原因,
            復旧方法,
            不具合場所,
            不具合原因,
            不具合対策,
            手順書,
            ifShow,
          ]);
        } catch (error) {
          danger(`Failed to insert error code ${errorCode}: ${error.message}`);
          throw error; // Rethrow the error to ensure the transaction is rolled back
        }
      }

      await conn.commit();
      success('Error codes inserted successfully.');
    } catch (error) {
      await conn.rollback();
      danger('Failed to insert error codes:', error.message);
      console.error(error); // 打印详细的错误日志
    } finally {
      await conn.end();
      info('Database connection closed.');
    }
  };

  // 下面是调用创建表与插入数据语句的地方
  try {
    await createTables();
    info('Database tables created successfully.');

    await insertErrorCodes();
    info('Error codes inserted successfully.');

    res.status = 'success';
  } catch (err) {
    res.status = 'false';
    danger('Failed to initialize database:', error.message);
    console.error(err); // 添加详细的错误日志
    process.exit(1); // 终止进程，如果数据库创建或数据插入失败
  } finally {
    return res;
  }
});
