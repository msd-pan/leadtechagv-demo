<template>
  <div class="container">
    <div class="left-side">
      <div class="row-left">
        <div class="box">
          <div class="inner-box boxA">
            <p class="textA">累計</p>
          </div>
          <div class="inner-box boxB">
            <div class="nested-box">稼働時間</div>
            <div class="nested-box box1">{{ data.total.time }}</div>
          </div>
          <div class="inner-box boxC">
            <div class="nested-box">時間</div>
          </div>
        </div>
      </div>
      <div class="row-left">
        <div class="box">
          <div class="inner-box boxA">
            <p class="textA">月次</p>
          </div>
          <div class="inner-box boxB">
            <div class="nested-box">稼働時間</div>
            <div class="nested-box box1">{{ data.monthly.time }}</div>
          </div>
          <div class="inner-box boxC">
            <div class="nested-box">時間</div>
          </div>
        </div>
      </div>
      <div class="row-left">
        <div class="box">
          <div class="inner-box boxA">
            <p class="textA">日次</p>
          </div>
          <div class="inner-box boxB">
            <div class="nested-box">稼働時間</div>
            <div class="nested-box box1">{{ data.daily.time }}</div>
          </div>
          <div class="inner-box boxC">
            <div class="nested-box">時間</div>
          </div>
        </div>
      </div>
    </div>

    <div class="right-side">
      <div class="row-right charge-count">
        <p class="label">累計充電回数</p>
        <div class="value-box">
          <span class="value">{{ data.totalChargeCount }}</span>
          <span class="unit">回</span>
        </div>
      </div>
      <div class="row-right charge-count">
        <p class="label">月次充電回数</p>
        <div class="value-box">
          <span class="value">{{ data.monthlyChargeCount }}</span>
          <span class="unit">回</span>
        </div>
      </div>
      <div class="row-right charge-count">
        <p class="label">日次充電回数</p>
        <div class="value-box">
          <span class="value">{{ data.dailyChargeCount }}</span>
          <span class="unit">回</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  allTasks: {
    type: Object,
    required: false,
  },
});

const data = reactive({
  total: {
    time: 23.33,
    distance: 0,
  },
  monthly: {
    time: 5.16,
    distance: 0,
  },
  daily: {
    time: 2.16,
    distance: 0,
  },
  totalChargeCount: 66.88,
  monthlyChargeCount: 11.4,
  dailyChargeCount: 0.51,
});

const calculateMaintenanceTime = (totalData, monthlyAndDailyData) => {
  console.log('totalData', totalData);
  console.log('monthlyAndDailyData', monthlyAndDailyData);
  data.total.time = 0;
  data.monthly.time = 0;
  data.daily.time = 0;

  if (totalData.length > 0) {
    data.total.time = +totalData[0].RunTime;
    data.totalChargeCount = +totalData[0].ChargeTimes;
  }
  if (monthlyAndDailyData.thisMonthData.length > 0) {
    data.monthly.time = +monthlyAndDailyData.thisMonthData[0].RunTime;
    data.monthlyChargeCount = +monthlyAndDailyData.thisMonthData[0].ChargeTimes;
  }
  if (monthlyAndDailyData.todayData.length > 0) {
    data.daily.time = +monthlyAndDailyData.todayData[0].RunTime;
    data.dailyChargeCount = +monthlyAndDailyData.todayData[0].ChargeTimes;
  }

  // 格式化数据
  data.total.time = Number(data.total.time).toFixed(2);
  data.monthly.time = Number(data.monthly.time).toFixed(2);
  data.daily.time = Number(data.daily.time).toFixed(2);
};

onMounted(() => {
  // console.log(props.allTasks);
  // calculateMaintenanceTime(
  //   props.allTasks.timeAndDistance,
  //   props.allTasks.monthlyAndDailyData,
  // );
});
</script>

<style scoped>
.container {
  display: flex;
  position: relative;
  width: 100%;
  background-color: #ffffff;
  padding: 10px;
  box-sizing: border-box;
  justify-content: space-between;
}

.left-side,
.right-side {
  width: 49%;
  align-items: center;
  justify-content: center;
  position: relative;
}

.row-left {
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.row-right {
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.charge-count {
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  border: 2px solid #ccc;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  height: 10vh;
}

.charge-count .label {
  font-weight: bold;
  font-size: 1.2em;
  flex: 1;
  margin: 0;
  padding: 0 50px;
}

.charge-count .value-box {
  display: flex;
  align-items: center;
  flex: 1;
  justify-content: flex-end;
  box-sizing: border-box;
  text-align: right;
  font-size: 1.2em;
  font-weight: bold;
  letter-spacing: 2px;
  margin-bottom: 5px;
}

.charge-count .value {
  font-size: 1em;
  color: #00a55e;
  font-weight: bold;
  box-sizing: border-box;
  border: 1px solid #000;
  width: 10vw;
  height: 4vh;
}

.charge-count .unit {
  margin-left: 5px;
  margin-right: 20px;
  font-size: 1.2em;
}

.section-title {
  font-weight: bold;
  margin-bottom: 1px;
}

.maintenance-details {
  border: 2px solid #ccc;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.maintenance-item {
  display: flex;
  justify-content: space-between;
  font-weight: bold;
}

.hours {
  font-size: 1em;
  color: #555;
}

.highlight {
  font-weight: bold;
  color: #00a55e;
  border: 1px solid #000;
}

.date {
  font-weight: bold;
  color: #00a55e;
}

/* .buttons {
  display: flex;
  justify-content: space-between;
  margin-top: 1px;
} */

.box {
  height: 10vh;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  border: 2px solid #ccc;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  margin: 0 5px;
}

.inner-box {
  display: flex;
}

.boxA {
  flex: 0.2;
  display: flex;

  justify-content: flex-end;
  align-items: center;
}

.textA {
  font-size: 1.5em;
  font-weight: bold;
  margin: 0;
}

.boxB {
  flex: 0.5;
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  border: 3px;
  justify-content: flex-end;
}

.boxC {
  flex: 0.2;
  width: 100%;
  display: flex;
  flex-direction: column;
}

.boxC .nested-box {
  flex: 1 1 100%;
  box-sizing: border-box;
  text-align: start;
}

.nested-box {
  flex: 1 1 50%;
  box-sizing: border-box;
  text-align: right;
  font-size: 1em;
  font-weight: bold;
  letter-spacing: 2px;
  margin-bottom: 5px;
}

.box1 {
  color: #00a55e;
  border: 1px solid #000;
  font-size: larger;
}

.details {
  display: flex;
  justify-content: space-between;
  margin-top: 10px;
}

.value {
  color: #00a55e;
  font-size: 1.5em;
  font-weight: bold;
}

.maintenance-info p {
  margin: 0;
  font-size: 1em;
}

.check-button {
  height: 10vh;
  display: flex;
  position: relative;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  border: 2px solid #ccc;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  text-decoration: none;
  background-color: #ffffff;
  font-size: 3.5ch;
  font-weight: 800;
  color: #00a55e;
}

.daily {
  top: 1.2vh;
}

.month {
  top: 2.6vh;
  width: 38.5vw;
}
</style>
