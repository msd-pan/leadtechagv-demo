<template>
  <div class="config" v-if="defineData.fetched">
    <div
      class="alert alert-success"
      @click="closeAlert"
      role="alert"
      v-if="defineData.success && !defineData.failure"
      :key="defineData.message"
    >
      <span class="alert-text">更新しました: {{ defineData.message }}</span>
      <span class="alert-button">
        <span class="alert-button-text">X</span>
      </span>
    </div>

    <div
      class="alert alert-danger"
      @click="closeAlert"
      role="alert"
      v-if="defineData.success && defineData.failure"
      :key="defineData.message"
    >
      <span class="alert-text"
        >エラーが発生しました: {{ defineData.message }}</span
      >
      <span class="alert-button">
        <span class="alert-button-text">X</span>
      </span>
    </div>

    <div class="title">
      <span>設定値メンテナンス</span>
    </div>

    <div class="initTable">
      <table class="table table-hover">
        <tbody class="tbody">
          <tr class="table-info">
            <th>パラメーター</th>
            <th colspan="2">設定値</th>
            <th>備考</th>
          </tr>
          <tr>
            <td>サイクル時間</td>
            <td class="col2">
              <input
                class="form-control"
                type="text"
                :placeholder="defineData.config.ini_cycle"
                id="ini_cycle"
              />
            </td>
            <td class="col3">n ミリ秒</td>
            <td>タスクステータス確認、完了時間算出、実行中タスク表示</td>
          </tr>

          <!-- autogenerate the table rows based on the comments show below -->
          <tr>
            <td>RCS IPアドレス</td>
            <td class="col2">
              <input
                class="form-control"
                type="text"
                :placeholder="defineData.config.ini_rcs_ip"
                id="ini_rcs_ip"
              />
            </td>
            <td class="col3">-</td>
            <td>RCSとAPI通信する際のIPアドレス</td>
          </tr>

          <tr>
            <td>RCS PORT番号</td>
            <td class="col2">
              <input
                class="form-control"
                type="text"
                :placeholder="defineData.config.ini_rcs_port"
                id="ini_rcs_port"
              />
            </td>
            <td class="col3">-</td>
            <td>RCSとAPI通信する際のPORT番号</td>
          </tr>

          <tr>
            <td>MYSQL IPアドレス</td>
            <td class="col2">
              <input
                class="form-control"
                type="text"
                :placeholder="defineData.config.ini_db_ip"
                id="ini_db_ip"
              />
            </td>
            <td class="col3">-</td>
            <td>RCSとデータベース通信する際のIPアドレス</td>
          </tr>

          <tr>
            <td>MYSQL ユーザー名</td>
            <td class="col2">
              <input
                class="form-control"
                type="text"
                :placeholder="defineData.config.ini_db_user"
                id="ini_db_user"
              />
            </td>
            <td class="col3">-</td>
            <td>RCSとデータベース通信する際のユーザー名</td>
          </tr>

          <tr>
            <td>MYSQL パスワード</td>
            <td class="col2">
              <input
                class="form-control"
                type="text"
                :placeholder="defineData.config.ini_db_pwd"
                id="ini_db_pwd"
              />
            </td>
            <td class="col3">-</td>
            <td>RCSとデータベース通信する際のパスワード</td>
          </tr>

          <tr>
            <td>MYSQL データベース名</td>
            <td class="col2">
              <input
                class="form-control"
                type="text"
                :placeholder="defineData.config.ini_db_name"
                id="ini_db_name"
              />
            </td>
            <td class="col3">-</td>
            <td>RCSとデータベース通信する際のデータベース名</td>
          </tr>

          <tr>
            <td>MYSQL PORT番号</td>
            <td class="col2">
              <input
                class="form-control"
                type="text"
                :placeholder="defineData.config.ini_db_port"
                id="ini_db_port"
              />
            </td>
            <td class="col3">-</td>
            <td>RCSとデータベース通信する際のPORT番号</td>
          </tr>

          <tr>
            <td>リフト時間</td>
            <td class="col2">
              <input
                class="form-control"
                type="text"
                :placeholder="defineData.config.ini_lift_time"
                id="ini_lift_time"
              />
            </td>
            <td class="col3">n 秒</td>
            <td>完了時間算出時、タスク当たりのリフト所要時間</td>
          </tr>

          <tr>
            <td>リフト回数</td>
            <td class="col2">
              <input
                class="form-control"
                type="text"
                :placeholder="defineData.config.ini_lift_count"
                id="ini_lift_count"
              />
            </td>
            <td class="col3">n 回</td>
            <td>完了時間算出時、タスク当たりのリフト回数</td>
          </tr>

          <tr>
            <td>回転時間</td>
            <td class="col2">
              <input
                class="form-control"
                type="text"
                :placeholder="defineData.config.ini_roll_time"
                id="ini_roll_time"
              />
            </td>
            <td class="col3">n 秒</td>
            <td>完了時間算出時、タスク当たりの回転所要時間</td>
          </tr>

          <tr>
            <td>回転回数</td>
            <td class="col2">
              <input
                class="form-control"
                type="text"
                :placeholder="defineData.config.ini_roll_count"
                id="ini_roll_count"
              />
            </td>
            <td class="col3">n 回</td>
            <td>完了時間算出時、タスク当たりの回転回数</td>
          </tr>

          <tr>
            <td>AGF稼働台数</td>
            <td class="col2">
              <input
                class="form-control"
                type="text"
                :placeholder="defineData.config.ini_agf_sum"
                id="ini_agf_sum"
              />
            </td>
            <td class="col3">n 台</td>
            <td>AGF稼働台数</td>
          </tr>

          <tr>
            <td>AGF速度</td>
            <td class="col2">
              <input
                class="form-control"
                type="text"
                :placeholder="defineData.config.ini_agf_speed"
                id="ini_agf_speed"
              />
            </td>
            <td class="col3">m/秒</td>
            <td>AGF平均速度</td>
          </tr>

          <tr>
            <td>ログファイルパス</td>
            <td class="col2">
              <input
                class="form-control"
                type="text"
                :placeholder="defineData.config.ini_logfile_path"
                id="ini_logfile_path"
              />
            </td>
            <td class="col3">-</td>
            <td>LeadTechAgv_YYMMDD.log</td>
          </tr>

          <tr>
            <td>ステータスログ<br />ファイルパス</td>
            <td class="col2">
              <input
                class="form-control"
                type="text"
                :placeholder="defineData.config.ini_logfile_status_path"
                id="ini_logfile_status_path"
              />
            </td>
            <td class="col3">-</td>
            <td>LeadTechAgv_Status_YYMMDD.log</td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="loadData" @click="loadData">
      <span class="confirmButtonText">LoadData</span>
    </div>

    <div class="confirmButton" @click="submitConfig">
      <span class="confirmButtonText">更新</span>
    </div>
    <NuxtLink to="/">
      <general-btn-back class="goBackBtn" />
    </NuxtLink>
  </div>
</template>

<script setup>
// Defualt display of config.
const defineData = ref({
  config: {
    ini_id: 0,
    ini_rcs_ip: 'http://192.168.11.132',
    ini_rcs_port: 6546,
    ini_db_ip: 'localhost',
    ini_db_port: 3306,
    ini_db_name: 'tokyo2409',
    ini_db_user: 'root',
    ini_db_pwd: 'msd123456',
    ini_cycle: 1000,
    ini_lift_time: 0,
    ini_lift_count: 0,
    ini_roll_time: 0,
    ini_roll_count: 0,
    ini_agf_sum: 5,
    ini_agf_speed: 0.2,
    ini_logfile_path: '/log/',
    ini_logfile_status_path: '/log/',
  },
  fetched: false,
  success: false,
  message: '',
  failure: false,
});

const getAllRacks = async () => {
  const returnData = await $fetch('/api/rcs/getAllRackStatus', {
    method: 'GET',
  }).catch((error) => {
    return false;
  });
  if (!returnData.response) {
    return false;
  }
  console.log(returnData);

  return returnData.response;
};
const fetchConfig = async () => {
  const data = await $fetch('/api/ui/getConfig', { method: 'GET' }).catch(
    (error) => error.data,
  );
  // console.log({ data });
  return data;
};
const loadData = async () => {
  const data = await $fetch('/api/loadData', {
    method: 'POST',
  }).catch((error) => error.data);
  popUp(data.status);
  console.log(data);

  return data;
};
const submitConfig = async () => {
  const newConfig = { ...defineData.config };

  // newConfig.ini_id = document.getElement

  //generated by copilot, This is a mess.
  //This grabs the data from the input fields and replaces the config object with the new values. If no inputs are given, the old values are used.
  newConfig.ini_cycle =
    document.getElementById('ini_cycle').value != ''
      ? document.getElementById('ini_cycle').value
      : defineData.value.config.ini_cycle;
  newConfig.ini_rcs_ip =
    document.getElementById('ini_rcs_ip').value != ''
      ? document.getElementById('ini_rcs_ip').value
      : defineData.value.config.ini_rcs_ip;
  newConfig.ini_rcs_port =
    document.getElementById('ini_rcs_port').value != ''
      ? document.getElementById('ini_rcs_port').value
      : defineData.value.config.ini_rcs_port;
  newConfig.ini_db_ip =
    document.getElementById('ini_db_ip').value != ''
      ? document.getElementById('ini_db_ip').value
      : defineData.value.config.ini_db_ip;
  newConfig.ini_db_port =
    document.getElementById('ini_db_port').value != ''
      ? document.getElementById('ini_db_port').value
      : defineData.value.config.ini_db_port;
  newConfig.ini_db_name =
    document.getElementById('ini_db_name').value != ''
      ? document.getElementById('ini_db_name').value
      : defineData.value.config.ini_db_name;
  newConfig.ini_db_user =
    document.getElementById('ini_db_user').value != ''
      ? document.getElementById('ini_db_user').value
      : defineData.value.config.ini_db_user;
  newConfig.ini_db_pwd =
    document.getElementById('ini_db_pwd').value != ''
      ? document.getElementById('ini_db_pwd').value
      : defineData.value.config.ini_db_pwd;
  newConfig.ini_lift_time =
    document.getElementById('ini_lift_time').value != ''
      ? document.getElementById('ini_lift_time').value
      : defineData.value.config.ini_lift_time;
  newConfig.ini_lift_count =
    document.getElementById('ini_lift_count').value != ''
      ? document.getElementById('ini_lift_count').value
      : defineData.value.config.ini_lift_count;
  newConfig.ini_roll_time =
    document.getElementById('ini_roll_time').value != ''
      ? document.getElementById('ini_roll_time').value
      : defineData.value.config.ini_roll_time;
  newConfig.ini_roll_count =
    document.getElementById('ini_roll_count').value != ''
      ? document.getElementById('ini_roll_count').value
      : defineData.value.config.ini_roll_count;
  newConfig.ini_agf_sum =
    document.getElementById('ini_agf_sum').value != ''
      ? document.getElementById('ini_agf_sum').value
      : defineData.value.config.ini_agf_sum;
  newConfig.ini_agf_speed =
    document.getElementById('ini_agf_speed').value != ''
      ? document.getElementById('ini_agf_speed').value
      : defineData.value.config.ini_agf_speed;
  newConfig.ini_logfile_path =
    document.getElementById('ini_logfile_path').value != ''
      ? document.getElementById('ini_logfile_path').value
      : defineData.value.config.ini_logfile_path;
  newConfig.ini_logfile_status_path =
    document.getElementById('ini_logfile_status_path').value != ''
      ? document.getElementById('ini_logfile_status_path').value
      : defineData.value.config.ini_logfile_status_path;

  newConfig.ini_cycle = parseInt(newConfig.ini_cycle);
  newConfig.ini_rcs_port = parseInt(newConfig.ini_rcs_port);
  newConfig.ini_db_port = parseInt(newConfig.ini_db_port);
  newConfig.ini_lift_time = parseInt(newConfig.ini_lift_time);
  newConfig.ini_lift_count = parseInt(newConfig.ini_lift_count);
  newConfig.ini_roll_time = parseInt(newConfig.ini_roll_time);
  newConfig.ini_roll_count = parseInt(newConfig.ini_roll_count);
  newConfig.ini_agf_sum = parseInt(newConfig.ini_agf_sum);
  newConfig.ini_agf_speed = parseFloat(newConfig.ini_agf_speed);

  console.log({ newConfig });

  const data = await $fetch('/api/ui/setConfig', {
    method: 'POST',
    body: { config: newConfig },
  }).catch((error) => {
    return error;
  });

  popUp(data.response.Message);

  setTimeout(closeAlert, 5000);

  return data;
};
const popUp = (message) => {
  if (message.length <= 5) {
    defineData.value.failure = true;
  }

  defineData.value.message = message;

  defineData.value.success = true;

  setTimeout(closeAlert, 5000);
};
const closeAlert = () => {
  defineData.value.failure = false;
  defineData.value.success = false;
  defineData.value.message = '';
};

onMounted(() => {
  fetchConfig().then((res) => {
    console.log({ res });
    defineData.value.config = res.response.initialTable;
    defineData.value.fetched = true;
  });
  document.title = 'admin画面';
});
</script>

<style scoped>
.alert-danger {
  position: fixed;
  left: 50%;
  transform: translate(-50%, 0);

  width: 60vw;

  z-index: 10;
  opacity: 0.9;
}

.alert-success {
  position: fixed;
  left: 50%;
  transform: translate(-50%, 0);

  width: 60vw;

  z-index: 10;
  opacity: 0.9;
}
.alert-button {
  float: right;
  background-color: white;
  border-radius: 100%;
  width: 20px;
  height: 20px;
  text-align: center;
  justify-content: center;
  align-items: center;
  line-height: 1;
}
.alert-text {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}

.alert-button:hover {
  cursor: pointer;
  background-color: rgb(249, 250, 213);
}

.config {
  width: 100vw;
  height: 100vh;
}

.title {
  background-color: #4f81bc;
  height: 30px;
  width: 20vw;
  justify-content: center;
  align-items: center;
  text-align: center;
  position: relative;
  border-radius: 5px;
  color: white;
  margin: 10px;

  position: relative;
  left: 50%;
  transform: translate(-50%, 0);
}

.initTable {
  width: 80vw;
  height: 75vh;

  position: absolute;
  left: 50%;

  transform: translate(-50%, 0);
  font-size: smaller;
  overflow-y: scroll;
  scrollbar-color: auto;
}

.table {
  width: 100%;
  height: 100%;
  text-align: center;
}

.col2 {
  /* modified from 37.5 to 30.5 to compensate for the longer text in the fist column */
  /* 37.5 is derived from 25 + (25/2) such that the input and the unit column splits by 3/4 and 1/4 of 50% */
  width: 30.5%;
}
.col3 {
  width: 12.5%;
}

.table-info {
  background-color: #cff4fc;
  background-color: #cff4fc;
}

.tbody {
  background-color: white;
}

table,
th,
td {
  border: 1px lightgrey solid;
}

input {
  height: 25px;
}

.confirmButton {
  position: absolute;
  right: 10vw;
  bottom: 12vh;

  /* transform: translate(0,-200%); */

  height: 6vh;
  width: 15vw;

  background-color: #4f81bc;
  border-radius: 10px;
  text-align: center;
  justify-content: center;
  align-content: center;
  color: white;

  transition: background-color, box-shadow 0.2s ease-in-out;
}

.confirmButton:hover {
  background-color: #809fc4;
  box-shadow: 0px 0px 5px 0px black;

  cursor: pointer;
}

.confirmButtonText {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.loadData {
  position: absolute;
  left: 10vw;
  bottom: 12vh;

  /* transform: translate(0,-200%); */

  height: 6vh;
  width: 15vw;

  background-color: green;
  border-radius: 10px;
  text-align: center;
  justify-content: center;
  align-content: center;
  color: white;

  transition: background-color, box-shadow 0.2s ease-in-out;
}

.loadData:hover {
  background-color: #809fc4;
  box-shadow: 0px 0px 5px 0px black;

  cursor: pointer;
}
.goBackBtn {
  position: absolute;
  left: 44vw;
  bottom: 8vh;
}
</style>
