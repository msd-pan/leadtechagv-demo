<template>
  <div class="home-screen" :key="componentKey">
    <div class="home-screen__page">
      <div class="home-screen__callout">
        <general-nav-callout
          class="home-screen__callout-text"
          :text="data.title"
        />
      </div>

      <task-status-display
        v-if="!data.ifShowMessageBar"
        class="home-screen__rack-status"
        :okiba="data.selectedOkiba"
        :inNumber="data.totalNumber - data.emptyNumber"
        :emptyNumber="data.emptyNumber"
        :ifChangeStatus="data.ifChangeStatus"
        :selecting="data.wholeGoalRacks"
        @selectLayer="selectLayer"
      />

      <rack-select-row
        v-if="data.fetched && !data.ifShowMessageBar"
        :parksData="data.okibas"
        :selectedOkiba="data.selectedOkiba"
        :ifChangeStatus="data.ifChangeStatus"
        :luggageAmount="data.luggageAmount"
        :startOrGoal="data.startOrGoal"
        :singleOrDouble="data.singleOrDouble"
        :statusChangeClick="statusChangeClick"
        :selectedAmount="data.wholeGoalRacks"
        @handleRackClick="handleRackClick"
        @statusChangeRack="statusChangeRack"
      />

      <task-message-bar
        v-if="data.ifShowMessageBar"
        :line1="data.line1"
        :line2="data.line2"
        :line3="data.line3"
      />

      <general-side-bar
        v-if="data.fetched"
        class="home-screen__sidebar"
        :hide="data.ifHideSidebar"
        :ifIndividual="false"
        :startRack="data.startOkiba"
        :goalRacks="data.goalOkibas"
        :luggageAmount="data.luggageAmount"
        :nowSelectingRackAmount="data.wholeGoalRacks"
        :minStartRow="data.minStartRow"
        :maxStartRow="data.maxStartRow"
      />

      <general-btn-back
        class="home-screen__go-back-btn"
        line1="前の画面に"
        line2="戻る"
        @click="goBack"
      />

      <general-btn-confirm
        text="決定"
        class="home-screen__ok-btn"
        :disabled="false"
        @click="onClickTaskFunc"
      />

      <general-alert
        :visible="data.ifShowSendTaskAlert"
        :line1="'タスクを発送しますか'"
        :ifHasCross="false"
        :ifHasBtns="true"
        :ifRed="false"
        @update:visible="data.ifShowSendTaskAlert = false"
        @confirm="sendTaskConfirm"
      />

      <task-rack-type-select
        :visible="data.ifShowRackTypeSelect"
        @update:visible="data.ifShowRackTypeSelect = false"
        @confirmSelection="confirmSelection"
      />
    </div>
  </div>
</template>

<script setup>
import {
  getOkibaInfo,
  applyStatusChangeEffect,
  handleRackTaskConfirm,
  confirmAndSendRackTask,
  prepareOkibaDisplayState,
  computeOkibaRackStats,
  handleRackTypeShowing,
} from '@/composables/rackTask';
import { selectLayerRow, handleRackClickRow } from '@/composables/rackClick';
import { useTaskStore } from '../stores/taskStore';
import { useErrorStore } from '../stores/errorStore';
const router = useRouter();

const errorStore = useErrorStore();
const errorCode = computed(() => errorStore.errorCode);

const taskStore = useTaskStore();
const task = computed(() => taskStore.task);

const data = reactive({
  title: '',
  okibas: {},
  fetched: false,
  selectedOkiba: '',
  totalNumber: 0,
  emptyNumber: 0,
  ifHideSidebar: false,
  ifChangeStatus: false,
  allUiRacks: [],
  selectedRacks: [],
  luggageAmount: 0,
  nowSelectingLugAmount: 0,
  minRowNo: 0,
  maxRowNo: 0,
  startOrGoal: '',
  singleOrDouble: '',
  statusInputWay: null,
  ifSubmittble: false,
  ifShowMessageBar: false,
  line1: '',
  line2: '',
  line3: '',
  ifShowSendTaskAlert: false,
  statusChangeArray: {},
  statusChangedArray: [],
  startOkiba: '',
  goalOkibas: [],
  startRacks: [],
  goalRacks: [],
  minStartRow: '',
  maxStartRow: '',
  wholeGoalRacks: 0,
  ifShowRackTypeSelect: false,
});

const handleOkibaInfos = async (selectedOkiba) => {
  const okibaInfo = await getOkibaInfo();
  const { totalRack, emptyRack } = computeOkibaRackStats(
    okibaInfo,
    selectedOkiba,
  );
  data.totalNumber = totalRack;
  data.emptyNumber = emptyRack;
};

// 选择layer的方法
const selectLayer = (layer) => {
  selectLayerRow(layer, data);
};

const statusChangeClick = (rackObj) => {
  applyStatusChangeEffect(rackObj, data, 'row');
};

const handleRackClick = async (obj) => {
  await handleRackClickRow(obj, data);
};

const statusChangeRack = (statusChangeArray) => {
  data.statusChangeArray = statusChangeArray.statusChangeArray;
};

const onClickTaskFunc = async () => {
  await handleRackTaskConfirm(data, task.value, router, taskStore, 'row');
};

const sendTaskConfirm = async () => {
  await confirmAndSendRackTask(task.value, router, 'row');
};

const confirmSelection = (cargoType) => {
  taskStore.setTaskProperty('deliveryTask.cargoType', +cargoType);
  handleRackTypeShowing(
    data.allUiRacks,
    task.value.deliveryTask.deliveryType,
    cargoType,
    data.startOrGoal,
  );
};

onMounted(async () => {
  if (
    (task.value.ifChangeStatus &&
      task.value.statusChange.selectedOkiba == '') ||
    (!task.value.ifChangeStatus && task.value.deliveryTask.luggageAmount == 0)
  ) {
    router.push('/');
  }

  data.okibas = await getOkibaInfo();
  prepareOkibaDisplayState(data, task.value, 'row');
  await handleOkibaInfos(data.selectedOkiba);

  data.fetched = true;
  // console.log('data.selectedOkiba', data.selectedOkiba);
  console.log(task.value);
});

const goBack = () => {
  router.go(-1);
};

// 定义 componentKey
const componentKey = ref(0);

const resetPage = () => {
  componentKey.value += 1;
};
</script>

<style lang="scss" scoped>
.home-screen {
  background-color: #ffffff;
  height: 100vh;
  position: relative;
  display: flex;
  justify-content: center;

  &__page {
    background-color: transparent;
    width: 100%;
    height: 100%;
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  &__callout {
    position: absolute;
    left: 50%;
    top: 0;
    padding: 0;
    align-content: center;

    &-text {
      margin: 0;
      width: 100vw;
      position: absolute;
      right: -50vw;
    }
  }

  &__rack-status {
    position: relative;
  }

  &__sidebar {
    position: absolute;
    top: 20vh;
    right: 0;
    width: 17vw;
    height: 50vh;
    z-index: 1;
  }

  &__alert {
    width: 100%;
    height: 100%;
  }

  &__menu {
    z-index: 9;
    width: 10vw;
    height: 15vh;
    position: absolute;
    right: 2vw;
  }

  &__go-back-btn {
    position: absolute;
    left: 10vw;
    bottom: 20vh;
  }

  &__ok-btn {
    position: absolute;
    right: 10vw;
    bottom: 20vh;
  }
}
</style>
