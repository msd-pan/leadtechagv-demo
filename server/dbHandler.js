import mysql from 'mysql2/promise';
import chalk from 'chalk';
import { info, danger, warn, print, success } from './api/logger.js';
import config from './server_config.js';

const dbcreate = true; // 确保 dbcreate 为 true 以便创建数据库表
if (dbcreate == false) {
  info('Database creation is disabled. Please enable it in dbHandler.js');
}

chalk.level = 1;

const dbcreation = {
  error_code: `
          CREATE TABLE error_code(
              e_id int NOT NULL AUTO_INCREMENT,
              e_code_10 char(255) NOT NULL,
              e_code_16 char(255) NOT NULL,
              e_type int NOT NULL,
              e_no int NULL,
              e_no_reason char(255) NULL,
              e_message_en TEXT,
              e_message_chs TEXT,
              e_mode char(255),
              e_stop_part char(255),
              e_stop_reason char(255),
              e_stop_fix_way char(255),
              e_defect_part char(255),
              e_defect_reason char(255),
              e_defect_fix_way char(255),
              e_hand_book char(255),
              e_show bool not null,
              PRIMARY KEY(e_id)
          );
      `,
  error_history: `
          CREATE TABLE error_history(
              id int NOT NULL AUTO_INCREMENT,
              e_h_id char(255) NOT NULL,
              e_h_code char(255) NOT NULL,
              e_h_time DATETIME DEFAULT CURRENT_TIMESTAMP(),
              PRIMARY KEY(id)
          );
      `,
};

const db = async () => {
  const connection = await mysql.createConnection({
    host: config.initialTable.ini_db_ip,
    port: config.initialTable.ini_db_port,
    user: config.initialTable.ini_db_user,
    password: config.initialTable.ini_db_pwd,
    database: config.initialTable.ini_db_name,
  });
  await connection.beginTransaction();
  return connection;
};

info('SQL dbhandler Starting up');

const wcsDb = async () => {
  const connection = await mysql.createConnection({
    host: config.wcs_table.ip,
    port: config.wcs_table.db_port,
    user: config.wcs_table.db_user,
    password: config.wcs_table.db_pwd,
    database: config.wcs_table.db_name,
  });
  await connection.beginTransaction();
  return connection;
};

const createTables = async function () {
  const createDB = async function () {
    let conn = await db();
    try {
      warn('Attempting to create database if not exist');
      let sql = `CREATE DATABASE IF NOT EXISTS ${config.initialTable.ini_db_name};`;
      let [rows] = await conn.query(sql).catch((err) => {
        if (err) {
          return [false];
        }
      });
      if (rows[0] === false) {
        return rows[0];
      }
      success('Database created successfully');
      return true;
    } catch (err) {
      danger(err);
      return false;
    } finally {
      conn.end();
    }
  };

  if ((await createDB()) === false) {
    danger('stopping, please check your database connection');
    return;
  }

  const requiredTable = ['error_code', 'error_history'];

  const prefixtable = requiredTable.map((val) => {
    return val;
  });

  const preSQLSyntax = `SELECT * FROM information_schema.tables WHERE table_schema = '${config.initialTable.ini_db_name}' AND table_name=`;

  const generateSQLSyntax = (prefixtable, preSQLSyntax) => {
    let syntaxes = {};
    for (let i of prefixtable) {
      syntaxes[i] = preSQLSyntax + `'${i}';`;
    }
    return syntaxes;
  };

  const queries = generateSQLSyntax(prefixtable, preSQLSyntax);

  warn('iterating through DB for required tables');

  const iterateTables = async function () {
    const conn = await db();
    try {
      for (let tableName in queries) {
        try {
          let [res, fields] = await conn.query(queries[tableName]);
          if (res.length > 0) {
            info('table ' + tableName + ' already exists. Dropping it.');
            let dropSQL = `DROP TABLE IF EXISTS ${tableName};`;
            // info('Executing SQL: ' + dropSQL); // 输出执行的 SQL 语句
            await conn.query(dropSQL);
            success('table ' + tableName + ' dropped successfully');
          }
          info('Table ' + tableName + ' does not exist. Creating now...');
          let createTableSQL = dbcreation[tableName];
          // info('Executing SQL: ' + createTableSQL); // 输出执行的 SQL 语句
          let [res2, fields2] = await conn.query(createTableSQL);
          success('created table ' + tableName + ' Successfully');
        } catch (error) {
          danger('Error creating table ' + tableName + ': ' + error.message);
        }
      }
    } catch (error) {
      danger('Error during table iteration: ' + error.message);
      return undefined;
    } finally {
      await conn.commit();
      conn.end();
    }
    return 'success';
  };

  if (dbcreate) {
    if ((await iterateTables()) === undefined) {
      danger(
        'Something is wrong with the database, please check your connection...',
      );
    }
  }
};

export { createTables, wcsDb };

export default db;
