<template>
  <div class="home-screen">
    <div class="home-screen__bar">
      <error-epHeadBar
        :carN0="data.carNo + '号機'"
        :runningType="occurError.e_mode"
        :runningStatus="'停止'"
        :errorNo="occurError.e_no"
        :errorNoReason="occurError.e_no_reason"
        :errorTime="data.occurTime"
        :isRed="true"
        v-show="tableDatas.fetched"
      />
      <hr class="home-screen__level-line" />
      <div class="home-screen__message-container">
        <error-messageBar
          class="home-screen__message-container-section home-screen__message-container-section--place"
          title="停止箇所"
          :textArray="tableDatas.stopPlaceArray"
          :isPlace="true"
          v-show="tableDatas.fetched"
        />
        <error-messageBar
          class="home-screen__message-container-section home-screen__message-container-section--reason"
          title="停止原因"
          :textArray="tableDatas.stopReasonArray"
          :isReason="true"
          v-show="tableDatas.fetched"
        />
        <error-messageBar
          class="home-screen__message-container-section home-screen__message-container-section--fix"
          title="対策（復旧方法）"
          :textArray="tableDatas.fixWayArray"
          :isFixWay="true"
          v-show="tableDatas.fetched"
        />
        <error-messageBar
          class="home-screen__message-container-section home-screen__message-container-section--handbook"
          title="手順書"
          :textArray="tableDatas.handBookArray"
          :isHandBook="true"
          v-show="tableDatas.fetched"
        />
      </div>
    </div>
    <general-btn-back class="home-screen__go-back-btn" @click="goBack" />
  </div>
</template>

<script setup>
import { useErrorStore } from '../stores/errorStore';

const errorStore = useErrorStore();
const errorCode = computed(() => errorStore.errorCode);
const carNo = computed(() => errorStore.getCarNo);
const occurTime = computed(() => errorStore.getOccurTime);

const data = reactive({
  carNo: '',
  occurTime: '',
});

let dbErrors;
const errorType = 1;

let tableDatas = reactive({
  stopPlaceArray: [],
  stopReasonArray: [],
  fixWayArray: [],
  handBookArray: [],
  fetched: false,
});

const initializeArray = (array) => {
  array.forEach((entry) => {
    if (!entry.hasOwnProperty('isType1Selected')) {
      entry.isType1Selected = false; // 确保初始化属性
    }
    if (!entry.hasOwnProperty('isType2Selected')) {
      entry.isType2Selected = false;
    }
  });
};

const getDbErrors = async () => {
  const errorData = await fetch('/error_db.json')
    .then((res) => res.json())
    .catch((error) => {
      return false;
    });

  dbErrors = errorData;
  // console.log(dbErrors);
  filterDatas('e_stop_part', tableDatas.stopPlaceArray, errorType);
  filterDatas('e_stop_reason', tableDatas.stopReasonArray, errorType);
  filterDatas('e_stop_fix_way', tableDatas.fixWayArray, errorType, true);

  return data;
};

const filterDatas = (columnName, array, type, ifSetHandBook) => {
  const uniqueEntries = new Map();
  const handBookEntries = new Map();
  dbErrors.forEach((entry) => {
    const key = entry[columnName];

    if (!uniqueEntries.has(key) && entry.e_type == type) {
      uniqueEntries.set(key, {
        value: entry[columnName],
        isType1Selected: false, // 初始化属性
      });
      if (ifSetHandBook) {
        handBookEntries.set(key, {
          value: entry['e_hand_book'],
          isType1Selected: false,
        });
      }
    }
  });

  const uniqueData = Array.from(uniqueEntries.values());
  initializeArray(uniqueData); // 确保数组中的每个对象属性完整
  array.splice(0, array.length, ...uniqueData);

  if (ifSetHandBook) {
    const handBookData = Array.from(handBookEntries.values());
    initializeArray(handBookData); // 确保数组中的每个对象属性完整
    tableDatas.handBookArray.splice(
      0,
      tableDatas.handBookArray.length,
      ...handBookData,
    );
  }
};

let occurError = ref({});

const getDbErrorMsg = async () => {
  const errorData = await fetch('/error_db.json')
    .then((res) => res.json())
    .catch((error) => {
      return false;
    });

  const foundError = errorData.find(
    (error) => String(error.e_code_10) === String(errorCode.value),
  );

  occurError.value = foundError;
  checkIfSelected(tableDatas.stopPlaceArray, occurError.value.e_stop_part);
  checkIfSelected(tableDatas.stopReasonArray, occurError.value.e_stop_reason);
  checkIfSelected(tableDatas.fixWayArray, occurError.value.e_stop_fix_way);

  tableDatas.handBookArray.forEach((item, index) => {
    if (tableDatas.fixWayArray[index]?.isType1Selected) {
      item.isType1Selected = true;
    }
  });

  return data;
};

const checkIfSelected = (array, compValue) => {
  array.forEach((item) => {
    if (String(item.value) === String(compValue)) {
      item.isType1Selected = true;
    }
  });
};

const router = useRouter();
const goBack = () => {
  router.go(-1);
};

onMounted(async () => {
  await getDbErrors();
  await getDbErrorMsg();
  data.carNo = carNo.value;
  data.occurTime = occurTime.value;
  tableDatas.fetched = true; // 确保在数据完全加载后再设置为 true
});
</script>

<style lang="scss" scoped>
.home-screen {
  background-color: #dddddd;
  width: 100vw;
  height: 100vh;
  z-index: 1;

  position: relative;
  display: flex;
  justify-content: center;
  margin: 0;
  border: 0;

  &__bar {
    background-color: white;
    width: 80vw;
    height: 80vh;
    position: relative;
    top: 5vh;
    border-radius: 5%;
  }

  &__level-line {
    position: absolute;
    width: 80vw;
    top: 9vh;
  }

  &__message-container {
    width: 95%;
    display: flex;
    flex-direction: row;
    position: relative;
    top: 5%;
    left: 2%;

    &-section {
      height: 500px;
      overflow-y: scroll;

      // 隐藏滚动条
      &::-webkit-scrollbar {
        display: none;
      }

      &--place {
        width: 20%;
      }

      &--reason {
        width: 20%;
      }

      &--fix {
        width: 45%;
      }

      &--handbook {
        width: 15%;
      }
    }
  }

  &__go-back-btn {
    position: absolute;
    left: 7vw;
    bottom: 14vh;
  }
}
</style>
