<template>
  <div class="home-screen">
    <div class="home-screen__page">
      <div class="home-screen__callout">
        <general-nav-callout
          id="nav-callout"
          class="home-screen__callout-text"
          :text="'HOME画面です'"
        />
      </div>

      <div class="home-screen__menu">
        <general-menu-bar />
      </div>

      <div class="home-screen__task-panel">
        <div class="home-screen__task-panel-header">実行中 TASK</div>
        <div class="home-screen__task-panel-info">
          {{ data.runningTask }}
        </div>
        <div class="home-screen__task-panel-buttons">
          <button
            class="home-screen__task-panel-buttons__btn home-screen__task-panel-buttons__btn--start"
            @click="data.ifShowDeleteRcsTaskAlert = true"
          >
            <div class="home-screen__task-panel-buttons__btn-top">
              <span class="home-screen__task-panel-buttons__btn-prefix"
                >実行中</span
              >
              <span class="home-screen__task-panel-buttons__btn-main"
                >TASK</span
              >
            </div>
            <div class="home-screen__task-panel-buttons__btn-bottom">
              <span class="home-screen__task-panel-buttons__btn-suffix"
                >取り消し</span
              >
            </div>
          </button>

          <button
            class="home-screen__task-panel-buttons__btn home-screen__task-panel-buttons__btn--stop"
            @click="data.ifShowTaskDeleteAlert = true"
          >
            <div class="home-screen__task-panel-buttons__btn-top">
              <span class="home-screen__task-panel-buttons__btn-prefix"
                >充電所へ</span
              >
              <span class="home-screen__task-panel-buttons__btn-main"
                >戻る</span
              >
            </div>
            <div class="home-screen__task-panel-buttons__btn-bottom">
              <span class="home-screen__task-panel-buttons__btn-suffix"
                >全部TASK消去</span
              >
            </div>
          </button>

          <button
            :class="[
              'home-screen__task-panel-buttons__btn',
              'home-screen__task-panel-buttons__btn--complete',
              data.onceStop
                ? 'home-screen__task-panel-buttons__btn--blue'
                : 'home-screen__task-panel-buttons__btn--red',
            ]"
            @click="pauseTask"
          >
            {{ data.operatingLabel }}
          </button>
        </div>
      </div>

      <div class="home-screen__task-input" @click="refreshTaskStore">
        搬送TASK入力
      </div>

      <general-alert
        :visible="data.ifShowOnceStopAlert"
        :line1="'AGF を一時停止します'"
        :ifHasCross="false"
        :ifHasBtns="true"
        :ifRed="false"
        @update:visible="data.ifShowOnceStopAlert = false"
        @confirm="onceStopConfirm"
      />

      <general-alert
        :visible="data.ifShowTaskDeleteAlert"
        :line1="'TASK を消去します'"
        :ifHasCross="false"
        :ifHasBtns="true"
        :ifRed="false"
        @update:visible="data.ifShowTaskDeleteAlert = false"
        @confirm="taskDeleteConfirm"
      />

      <general-alert
        :visible="data.ifShowDeleteRcsTaskAlert"
        :line1="'実行中TASK を消去します'"
        :ifHasCross="false"
        :ifHasBtns="true"
        :ifRed="false"
        @update:visible="data.ifShowDeleteRcsTaskAlert = false"
        @confirm="rcsTaskDeleteConfirm"
      />
    </div>
  </div>
</template>

<script setup>
import { resetTaskStore, handleNowTask } from '@/composables/general';
import { useErrorStore } from '@/stores/errorStore';
import { useTimerStore } from '@/stores/timerStore';
import { useTaskStore } from '@/stores/taskStore';
import { useErrorChecker } from '@/composables/errorChecker';

const errorStore = useErrorStore();
const timerStore = useTimerStore();
const taskStore = useTaskStore();
const { checkIfHasError } = useErrorChecker();

const errorCode = computed(() => errorStore.errorCode);
const task = computed(() => taskStore.task);

const router = useRouter();

const data = reactive({
  runningTask: '',
  operatingLabel: '一時停止',
  ifShowOnceStopAlert: false,
  ifShowTaskDeleteAlert: false,
  onceStop: false,
  ifShowDeleteRcsTaskAlert: false,
});

const pauseTask = async () => {
  if (!data.onceStop) {
    data.ifShowOnceStopAlert = true;
  } else {
    data.onceStop = false;
    data.operatingLabel = '一時停止';
    data.ifShowOnceStopAlert = false;
  }
};

const onceStopConfirm = async () => {
  if (data.onceStop === false) {
    data.onceStop = true;
    data.operatingLabel = '運転再開';
  }
  data.ifShowOnceStopAlert = false;
};

const taskDeleteConfirm = async () => {
  data.ifShowTaskDeleteAlert = false;
};

const rcsTaskDeleteConfirm = async () => {
  data.ifShowDeleteRcsTaskAlert = false;
};

const handleShowingTask = () => {
  handleNowTask();
};

const resetTaskInfo = () => {
  resetTaskStore();
};

const refreshTaskStore = () => {
  resetTaskInfo();
  router.push('/task');
};

let intervalId;

onMounted(async () => {
  console.log(task.value);

  // timerStore.registerListener(checkIfHasError);

  //test
  // errorStore.setErrorCode('37748737');
  // router.push('/error/popup');

  // await handleIfStopAndShowingTask();
  // intervalId = setInterval(handleIfStopAndShowingTask, 5000);

  handleShowingTask();
});

onBeforeUnmount(async () => {
  // timerStore.unregisterListener(checkIfHasError);
});
</script>

<style lang="scss" scoped>
.home-screen {
  background-color: hwb(103 85% 2%);
  height: 100vh;
  position: relative;
  display: flex;
  justify-content: center;

  &__page {
    width: 100%;
    height: 100%;
    position: relative;
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

  &__menu {
    z-index: 9;
    width: 10vw;
    height: 15vh;
    position: absolute;
    right: 2vw;
  }

  &__task-panel {
    position: absolute;
    top: 25%;
    right: 20%;
    display: flex;
    flex-direction: column;
    align-items: center;
    background-color: #fff;
    border-radius: 15px;
    height: 40%;
    width: 60%;

    &-header {
      height: 15%;
      font-size: 25px;
      background-color: #ff9800;
      text-align: center;
      color: white;
      font-weight: bold;
      border-top-left-radius: 15px;
      border-top-right-radius: 15px;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 10px 20px;
    }

    &-info {
      height: 30%;
      margin: 30px 0 10px;
      color: #333;
      font-size: 25px;
      font-weight: bold;
      text-align: center;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    &-buttons {
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 1vw;

      &__btn {
        height: 80%;
        padding: 10px 20px;
        border: none;
        border-radius: 15px;
        color: white;
        font-size: 16px;
        font-weight: bold;
        cursor: pointer;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;

        &--start {
          width: 35%;
          background-color: #50ae8b;
        }

        &--stop {
          width: 40%;
          background-color: #50ae8b;
        }

        &--complete {
          width: 40%;
        }

        &--red {
          background-color: #ff0000;
        }

        &--blue {
          background-color: blue;
        }

        &-top,
        &-bottom {
          display: flex;
          justify-content: center;
          align-items: center;
          width: 100%;
        }

        &-prefix {
          font-size: 14px;
        }

        &-main {
          font-size: 20px;
          font-weight: bold;
          margin-left: 8px;
        }

        &-suffix {
          font-size: 24px;
        }
      }
    }
  }

  &__task-input {
    position: absolute;
    top: 67%;
    right: 20%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    background-color: #50ae8b;
    border-radius: 15px;
    height: 12%;
    width: 60%;
    font-size: 36px;
    font-weight: bold;
    cursor: pointer;
    color: white;
  }
}
</style>
