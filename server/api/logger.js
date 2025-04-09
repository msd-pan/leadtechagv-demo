import chalk from 'chalk';
import config from '../server_config.js';
import * as fs from 'fs';
import path from 'path';

// Utility function to log messages to the console
const log = function (msg) {
  console.log(msg);
};

const info = function (msg) {
  log(chalk.bold.italic.blue(msg));
};

const warn = function (msg) {
  log(chalk.underline.yellow(msg));
};

const danger = function (msg) {
  msg = JSON.stringify(msg);
  log(chalk.bold.red(msg));
  writeErrorLog(msg);
};

const success = function (msg) {
  log(chalk.bold.italic.green(msg));
};

const print = function (msg) {
  log(msg);
};

// Function to check if the log folder exists, and create it if not
const checkLogFolder = function () {
  const dir = './log';
  if (!fs.existsSync(dir)) {
    warn('/log folder does not exist, creating now...');
    fs.mkdirSync(dir);
  }
};

// Function to manage the number of log files in the folder
const manageLogFiles = function () {
  const dir = './log';
  const files = fs.readdirSync(dir);

  if (files.length > 60) {
    // Sort files by creation time (oldest first)
    const sortedFiles = files
      .map((file) => ({
        name: file,
        time: fs.statSync(path.join(dir, file)).mtime.getTime(),
      }))
      .sort((a, b) => a.time - b.time);

    // Delete the oldest file
    const oldestFile = path.join(dir, sortedFiles[0].name);
    fs.unlinkSync(oldestFile);
    warn(`Deleted oldest log file: ${oldestFile}`);
  }
};

// Function to manage the size of the error.log file
const manageErrorLogSize = function (filePath) {
  const maxFileSize = 100 * 1024 * 1024; // 100MB in bytes
  if (fs.existsSync(filePath)) {
    const stats = fs.statSync(filePath);
    if (stats.size > maxFileSize) {
      const logData = fs.readFileSync(filePath, 'utf8');
      const lines = logData.split('\n');

      // Keep only the most recent lines (keep 50% of the lines)
      const keepLines = lines.slice(Math.floor(lines.length / 2));
      fs.writeFileSync(filePath, keepLines.join('\n'), 'utf8');
      warn(`Trimmed ${filePath} to reduce size.`);
    }
  }
};

// Function to write execution logs
const writeExecuteLog = function (tk_code) {
  checkLogFolder();
  manageLogFiles();

  let time = new Date()
    .toLocaleString('ja-JP', { timeZone: 'Asia/Tokyo' })
    .replace(/\//g, '-');
  let log = time + ', ' + tk_code + '\n';

  let date = new Date()
    .toLocaleString('ja-JP', { timeZone: 'Asia/Tokyo' })
    .slice(0, 19)
    .replace(/T/, ' ')
    .replace(/\//g, '-');
  let d = date.split('-');
  let entry_date = `${d[0].slice(2, 4)}${d[1].padStart(2, '0')}${d[2]
    .split(' ')[0]
    .padStart(2, '0')}`;

  let p =
    path.resolve('./' + config.initialTable.ini_logfile_path) +
    `\\LeadTechAGV_${entry_date}.log`;
  fs.writeFileSync(p, log, { flag: 'a+' });
};

// Function to write status logs
const writeStatusLog = function (tk_code, agf_code, state, stage, sts_code) {
  checkLogFolder();
  manageLogFiles();

  let time = new Date()
    .toLocaleString('ja-JP', { timeZone: 'Asia/Tokyo' })
    .replace(/\//g, '-');
  let log = `${time}, ${tk_code}, ${agf_code}, ${state}, ${stage}, ${sts_code}\n`;

  let date = new Date()
    .toLocaleString('ja-JP', { timeZone: 'Asia/Tokyo' })
    .slice(0, 19)
    .replace(/T/, ' ')
    .replace(/\//g, '-');
  let d = date.split('-');
  let entry_date = `${d[0].slice(2, 4)}${d[1].padStart(2, '0')}${d[2]
    .split(' ')[0]
    .padStart(2, '0')}`;

  let p =
    path.resolve('./' + config.initialTable.ini_logfile_status_path) +
    `\\LeadTechAGV_Status_${entry_date}.log`;
  fs.writeFileSync(p, log, { flag: 'a+' });
};

// Function to write error logs
const writeErrorLog = function (msg) {
  checkLogFolder();
  const filePath =
    path.resolve('./' + config.initialTable.ini_logfile_path) + '\\error.log';
  manageErrorLogSize(filePath);

  let time = new Date()
    .toLocaleString('ja-JP', { timeZone: 'Asia/Tokyo' })
    .replace(/\//g, '-');
  let log = `${time}, ERROR, ${msg}\n`;

  fs.writeFileSync(filePath, log, { flag: 'a+' });
};

// Function to log any object
function logAnything(anything) {
  checkLogFolder();
  manageLogFiles();

  let time = new Date()
    .toLocaleString('ja-JP', { timeZone: 'Asia/Tokyo' })
    .replace(/\//g, '-');
  let log = `${time}, ${JSON.stringify(anything)}\n`;

  let p =
    path.resolve('./' + config.initialTable.ini_logfile_path) + '\\log.log';
  fs.writeFileSync(p, log, { flag: 'a+' });
}

export { info, warn, danger, success, print };
export { writeErrorLog, writeExecuteLog, writeStatusLog, logAnything };
