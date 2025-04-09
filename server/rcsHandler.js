import config from './server_config.js';
import axios from 'axios';
import { info, warn, danger, success } from './api/logger.js';
import db from './dbHandler.js';
import { writeStatusLog, writeExecuteLog, logAnything } from './api/logger.js';



//use this as a flag to turn off RCS communication for testing purposes when RCS is not available.

//确保将任何输入转换为数组形式，无论输入是数组、对象还是其他类型的值，最终都会返回一个数组。
function ensureArray(obj) {
  if (Array.isArray(obj)) {
    return obj; // Already an array
  } else if (obj !== null && typeof obj === 'object') {
    return [obj]; // Wrap in an array
  } else {
    return []; // Return empty array if it's neither an array nor an object
  }
}

async function rcsSendTask(task) {
  console.log(task);

  const reqLink =
    config.initialTable.ini_rcs_ip +
    ':' +
    config.initialTable.ini_rcs_port +
    '/api/v2/orders';

  function replaceFirstLetter(str) {
    if (!str || str.length === 0) {
      return str;
    }
    const strArr = str.split('');
    strArr[0] = 'B';
    return strArr.join('');
  }
  let query;

  if (task.tk_dependencies == '') {
    query = {
      id: task.tk_code,
      systemId: 'WEB',
      type: 'LoadingAndUnloading',
      flag: '',
      requiredAgvs: [task.agf_code],
      priority: 0,
      source: task.s_p_name,
      destination: task.g_p_name,
      parameters: {},
      Dependencies: [],
      validPeriod: 0,
    };
  } else {
    query = {
      id: task.tk_code,
      systemId: 'WEB',
      type: 'LoadingAndUnloading',
      flag: '',
      requiredAgvs: [task.agf_code],
      priority: 0,
      source: task.s_p_name,
      destination: task.g_p_name,
      parameters: {},
      Dependencies: [task.tk_dependencies],
      validPeriod: 0,
    };
  }

  console.log(query);
  //http request:
  const rcsResponse = await axios.post(reqLink, query).catch((err) => {
    warn(err);
    return false;
  });

  danger('rcsResponse: ' + rcsResponse);
  console.log(rcsResponse.data);

  //write to log (both the query and the actual task row)

  return rcsResponse;
}

// 查询所有agv车状态
async function rcsCheckAgv() {
  // 从config文件中读取数据
  const reqLink =
    config.initialTable.ini_rcs_ip +
    ':' +
    config.initialTable.ini_rcs_port +
    '/api/v2/agvs';

  // console.log(reqLink);

  //http request:
  const rcsResponse = await axios.get(reqLink).catch((err) => {
    warn(err);
    return false;
  });

  // danger('RCS Returned: ' + rcsResponse);
  // only log the data
  // console.log(rcsResponse.data);
  return rcsResponse.data;
}

// nagoya 展示会用获取rack的状态api
async function rcsCheckRackStatus(parkName) {
  // 从config文件中读取数据
  const reqLink =
    config.ini_rack_status_url +
    ':' +
    config.ini_rack_status_port +
    '/api/RCSDatabase/GetUseStateAndGoodsByParkId/' +
    parkName;

  // console.log(reqLink);

  //http request:
  const rcsResponse = await axios.get(reqLink).catch((err) => {
    warn(err);
    return false;
  });
  // console.log(parkName);
  // console.log(rcsResponse.data);

  return rcsResponse.data;
}

// new version of getting all racks' status api,using in next versions
async function rcsGetRacksStatus() {
  // 从config文件中读取数据
  const reqLink =
    config.ini_rack_status_url +
    ':' +
    config.ini_rack_status_port +
    '/api/RCSDatabase/GetParks';

  console.log(reqLink);

  //http request:
  const rcsResponse = await axios.get(reqLink).catch((err) => {
    warn(err);
    return false;
  });
  // console.log(parkName);
  // console.log(rcsResponse.data);

  return rcsResponse.data;
}

// api that the two racks in the middle in nagoya2407 version
async function rcsUpdateRackStatus(
  source,
  destination,
  park8State,
  park9State,
) {
  // 从config文件中读取数据
  const reqLink =
    config.ini_rack_status_url +
    ':' +
    config.ini_rack_status_port +
    '/api/RCSDatabase/SynchronizeUseStateByParkId/' +
    // RCSDatabase/SynchronizeUseStateByParkId/8/to/9/1/3
    source +
    '/to/' +
    destination +
    '/' +
    park8State +
    '/' +
    park9State;

  // console.log(reqLink);

  //http request:
  const rcsResponse = await axios.put(reqLink).catch((err) => {
    warn(err);
    return false;
  });
  // console.log(parkName);
  console.log(rcsResponse.data);

  return rcsResponse.data;
}

// 查询指定task状态
async function rcsCheckTask(task) {
  // 从config文件中读取数据
  const reqLink =
    config.initialTable.ini_rcs_ip +
    ':' +
    config.initialTable.ini_rcs_port +
    '/api/v2/orders/' +
    task.id;

  // console.log(reqLink);

  //http request:
  const rcsResponse = await axios.get(reqLink).catch((err) => {
    warn(err);
    return false;
  });

  // danger('RCS Returned: ' + rcsResponse);
  // only log the data
  // console.log(rcsResponse.data);
  return rcsResponse.data;
}

// 查询未完成的任务的状态
async function rcsCheckUnfinishedTask() {
  // 从config文件中读取数据
  const reqLink =
  config.initialTable.ini_rcs_ip +
  ':' +
  String(config.initialTable.ini_rcs_port) + // 确保端口是字符串
  '/api/v2/orders?type=unclosed';


  // const reqLink = 'http://192.168.1.111:6546/api/v2/orders?type=unclosed';


  console.log(reqLink);

  //http request:
  const rcsResponse = await axios.get(reqLink).catch((err) => {
    warn(err);
    return false;
  });

  // danger('RCS CheckUnfinishedTask Returned: ' + rcsResponse);
  // only log the data
  // console.log(rcsResponse.data);
  return rcsResponse.data;
}

// 查询有无error
async function rcsCheckError() {
  // 从config文件中读取数据
  const reqLink =
    config.initialTable.ini_rcs_ip +
    ':' +
    config.initialTable.ini_rcs_port +
    '/api/v2/errors';

  // console.log(reqLink);

  //http request:
  const rcsResponse = await axios.get(reqLink).catch((err) => {
    warn(err);
    return false;
  });

  // console.log(rcsResponse.data);
  return rcsResponse.data;
}

// 停止任务方法
async function stopTask(task, type = '2') {
  function replaceFirstLetter(str) {
    if (!str || str.length === 0) {
      return str;
    }
    const strArr = str.split('');
    strArr[0] = 'B';
    return strArr.join('');
  }
  const backTaskId = replaceFirstLetter(task.id);
  const reqLink =
    config.initialTable.ini_rcs_ip +
    ':' +
    config.initialTable.ini_rcs_port +
    '/api/v2/orderModifications';
  let stopTaskQuery = {
    id: task.id,
    orderId: task.id,
    type: type,
  };

  let stopBackTaskQuery = {
    id: backTaskId,
    orderId: backTaskId,
    type: type,
  };

  warn(JSON.stringify(stopTaskQuery));
  warn(JSON.stringify(stopBackTaskQuery));
  console.log(reqLink);
  console.log(stopTaskQuery);
  console.log(stopBackTaskQuery);

  //http request:
  const rcsStopTaskResponse = await axios
    .post(reqLink, stopTaskQuery)
    .catch((err) => {
      err = JSON.stringify(err);
      return err;
    });
  const rcsStopBackResponse = await axios
    .post(reqLink, stopBackTaskQuery)
    .catch((err) => {
      err = JSON.stringify(err);
      return err;
    });

  danger('RCS Returned :  ' + rcsStopTaskResponse);
  danger('RCS Returned :  ' + rcsStopBackResponse);

  console.log(rcsStopTaskResponse);
  return rcsStopTaskResponse;
}

export {
  rcsSendTask,
  rcsCheckAgv,
  rcsCheckRackStatus,
  rcsGetRacksStatus,
  rcsUpdateRackStatus,
  rcsCheckTask,
  rcsCheckUnfinishedTask,
  rcsCheckError,
  stopTask,
};

/**
 *
 * This function should be executed every time in the RCS API cycle, this will attempt to communicate to the server and send the tasks to RCS if the task has not yet been sent.
 *
 * @param {DbConnection} conn connection to the MYSQL db.
 * @returns void
 */
async function attemptResendOtherConnections(conn) {
  info('Attempting to resend pending tasks to RCS');

  try {
    let [results, fields] = await conn
      .query(`SELECT * FROM lt_task WHERE sts_code=10`)
      .catch((err) => {
        danger('Error while querying into lt_task table.' + err);
      });

    if (results.length == 0) {
      warn('No pending tasks found');
      return;
    }

    let numsUpdated = 0;

    console.log(results);

    //for each unprocessed task, send to RCS again.
    for (let i = 0; i < results.length; i++) {
      let currentTask = results[i];

      warn('Attempting to submit task ' + currentTask['tk_code'] + ' to RCS');
      let rcsResponse = await rcsSendTask(currentTask);
      if (rcsResponse) {
        //update the sts_code to 20
        let [results, fields] = await conn
          .query(
            `UPDATE lt_task SET sts_code=20 WHERE tk_code=${currentTask['tk_code']}`,
          )
          .catch((err) => {
            danger('Error while updating lt_task table.' + err);
            return false;
          });
        if (!results) {
          danger(
            'Error while updating lt_task table of tk_code: ' +
              tk_code +
              '. Skipping...',
          );
          continue;
        }
        success('Successfully updated lt_task and sent to RCS');
        numsUpdated += 1;
      }
    }

    warn(
      'Total of ' +
        numsUpdated +
        ' out of ' +
        results.length +
        ' tasks sent to RCS.',
    );
  } catch (err) {
    danger('Error in attemptResendOtherConnections ' + err);
    throw err;
  }

  return;
}

/**
 *
 * This function is called concurrently for every 5 seconds by the server, this will attempt to communicate to the RCS server and get the status of the tasks.
 *
 * This function can also be called manually by instances.
 *
 *
 * @returns {Obeject} message
 */
async function rscAPI(rcsIDs = []) {
  console.log(
    'config.initialTable.ini_rcs_port',
    config.initialTable.ini_rcs_port,
  );
  console.log('config.rcsPort', config.initialTable.ini_rcs_port);

  console.log('\n\n\n\n\n\n\n\n');

  warn('communicating with the RCS');

  try {
    let conn = await db();
    try {
      /**
       *
       * Selects from the lt_task table where the sts_code is within the proper active range.
       *
       *
       *
       *
       */
      await attemptResendOtherConnections(conn);

      let [results, fields] = await conn
        .query(
          `SELECT * FROM lt_task WHERE sts_code>=10 and sts_code<80 and sts_code != 30`,
        )
        .catch((err) => {
          danger(err);
        });
      if (results.length < 1) {
        return { message: 'No tasks found, will not communicate with RCS' };
      }

      /**
       *
       * Creates the query link
       *
       */

      //iterate for each task, create the range tag;

      let syntax = '?range=' + results[0]['tk_code'];
      for (let i = 1; i < results.length; i++) {
        syntax += ',' + results[i]['tk_code'];
      }

      let reqLink =
        config.initialTable.ini_rcs_ip +
        ':' +
        config.initialTable.ini_rcs_port +
        '/api/v2/orders' +
        syntax; //multiple order get.
      // warn(reqLink)

      /**
       *
       * Sends the HTTP request to RCS
       *
       *
       */

      //http request:

      // warn("Attempting to submit request to RCS")
      const rcsResponse = await axios
        .get(reqLink)
        .catch((err) => {
          danger(err);
          danger('RCS Response: ' + err.response.status);
          return false;
        })
        .then((res) => {
          return res;
        });

      if (rcsResponse) {
        logAnything(rcsResponse.data);
        success('RCS http ok');
      } else {
        danger('RCS http NOT OK');
        res.response = { Message: 'RCS HTTP NOT OK' };
        return res;
      }

      /**
       *
       * For each given response from the RCS, update the status of the task accordingly in the database.
       */

      for (let i = 0; i < rcsResponse.data.length; i++) {
        console.log(i);

        let current = rcsResponse.data[i];

        writeExecuteLog(current['id'], current);

        warn(current['state']);

        //state first, then stage if needed
        const stateStageMap = {
          0: 20,
          1: { 0: 21, 1: 22, 3: 23 },
          2: 30,
          3: 90,
          4: 80,
          5: 91,
          6: 92,
        };

        //datas
        let returnState = Number(current['state']);
        let returnStage = Number(current['stage']);
        let usingAGF = current['agvId']; //get the actual agv id and replace the "calculated version" of agv to this.

        console.log(returnState, returnStage);

        //search for state and stage mapping to status code.
        let sts_code = 10;

        if (typeof stateStageMap[returnState] != 'number') {
          sts_code = stateStageMap[returnState][returnStage];
        } else {
          sts_code = stateStageMap[returnState];
        }

        //fetch from table;
        [r, fields] = await conn
          .query(
            `SELECT tk_code,sts_code FROM lt_task WHERE tk_code = '${current['id']}'`,
          )
          .catch((err) => {
            danger('Error while fetching table ' + err);
            return false;
          });
        if (!r || r.length < 1) {
          warn('No such task found, skipping...');
          continue;
        }

        logAnything(r);
        if (r[0]['sts_code'] == sts_code) {
          info('sts_code was not updated, skipping...');
          continue;
        }

        //writes into the status log file.
        writeStatusLog(
          current['id'],
          current['requiredAgvs'],
          current['state'],
          current['stage'],
          sts_code,
        );

        //get cmp_date

        let cmp_date = null;
        if (sts_code == 30) {
          cmp_date = new Date()
            .toLocaleString('ja-JP', { timeZone: 'Asia/Tokyo' })
            .slice(0, 19)
            .replace('T', ' ')
            .replace('/', '-')
            .replace('/', '-');
          cmp_date = `"${cmp_date}"`;
        }

        info('Updating Table...');
        console.log(
          `UPDATE lt_task SET sts_code = ${sts_code}, sts_code='${sts_code}' WHERE tk_code = '${current['id']}'`,
        );
        let [r, fields] = await conn
          .query(
            `UPDATE lt_task SET agf_code="${usingAGF}", sts_code = ${sts_code}, cmp_date=${cmp_date} WHERE tk_code = '${current['id']}'`,
          )
          .catch((err) => {
            danger('Error while updating table ' + err);
            return false;
          });
        if (r) {
          success('successfully updated table');
        }
      }
    } catch (err) {
      danger('Error within try except ' + err);
    } finally {
      conn.commit();
      conn.end();
    }

    // return response; // Assuming the API returns JSON data
  } catch (error) {
    console.error('Error fetching data from API:', error);
    return null;
  }

  return 'RCS OK';
}

export default rscAPI;
