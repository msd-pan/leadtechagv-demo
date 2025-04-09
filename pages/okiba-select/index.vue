<template>
  <div class="home-screen">
    <div class="home-screen__page">
      <general-nav-callout
        id="nav-callout"
        class="home-screen__callout"
        :text="data.title"
      />
      <general-menu-bar class="home-screen__menu" />

      <div class="home-screen__storage-wrapper">
        <task-storage-display
          class="home-screen__storage-wrapper-item"
          v-for="storage in data.storages"
          :key="storage.name"
          :class="{
            'home-screen__storage-wrapper-item--selected':
              data.selectedLocation === storage.name,
          }"
          :name="storage.name"
          :capacity="storage.totalRack"
          :used="storage.totalRack - storage.emptyRack"
          @click="handleOkibaSelection(storage.name, data, task)"
        />
      </div>

      <general-side-bar
        v-if="data.fetched"
        class="home-screen__sidebar"
        :hide="data.ifHideSideBar"
        :ifIndividual="true"
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
        @click="goBackToPrev"
      />
      <general-btn-confirm
        text="決定"
        class="home-screen__ok-btn"
        :disabled="!data.selectedLocation"
        @click="confirmAndNext"
      />
    </div>
  </div>
</template>

<script setup>
import { useOkiba } from '@/composables/useOkiba';
import { useTaskStore } from '../stores/taskStore';
import { useErrorStore } from '../stores/errorStore';

const errorStore = useErrorStore();

const errorCode = computed(() => errorStore.errorCode);

const taskStore = useTaskStore();
const task = computed(() => taskStore.task);

const router = useRouter();

const {
  handleOkibaInfos,
  handleShowingInfos,
  initializeTaskState,
  goBack,
  toNextPage,
  handleOkibaSelection,
} = useOkiba();

const data = reactive({
  title: '',
  selectedLocation: '',
  storages: [],
  ifHideSideBar: false,
  fetched: false,
  luggageAmount: 0,
  startOkiba: '',
  goalOkibas: [],
  wholeGoalRacks: 0,
  ifChangedOkibaSelect: false,
  minStartRow: '',
  maxStartRow: '',
});

const goBackToPrev = () => {
  goBack(router);
};

const confirmAndNext = () => {
  toNextPage(data, task.value, router);
};

onMounted(async () => {
  if (
    (task.value.ifChangeStatus &&
      task.value.statusChange.okibaSelectWay == '') ||
    (!task.value.ifChangeStatus && task.value.deliveryTask.luggageAmount == 0)
  ) {
    router.push('/');
  }

  if (task.value.ifChangeStatus) {
    taskStore.setTaskProperty('statusChange.selectedOkiba', '');
  } else {
    if (task.value.deliveryTask.start.startArea == 'conveyor') {
      taskStore.setTaskProperty('deliveryTask.goal.goalArea', '');
    }
  }

  await handleOkibaInfos(data);
  handleShowingInfos(data, task.value);
  initializeTaskState(data, task.value);
});
</script>

<style lang="scss" scoped>
.home-screen {
  background-color: hwb(103 85% 2%);
  height: 100vh;
  display: flex;
  position: relative;
  justify-content: center;
  z-index: 0;

  &__page {
    position: relative;
    height: 100%;
    width: 100%;
    z-index: 0;
    background-image: url('/selecting-bg.png');
    background-size: auto;
    background-repeat: no-repeat;
    background-position: 10px center;
  }

  &__callout,
  &__menu {
    position: absolute;
    top: 0;
    right: 0;
  }

  &__storage-wrapper {
    position: absolute;
    width: 60vw;
    height: 40vh;
    left: 20vw;
    bottom: 30vh;
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;

    &-item {
      flex: 0 0 45%;
      margin-bottom: 10px;

      &--selected {
        background-color: #ff9900;
      }
    }
  }

  &__sidebar {
    // Reserved for future styling
  }

  &__go-back-btn,
  &__ok-btn {
    position: absolute;
    bottom: 20vh;
  }

  &__go-back-btn {
    left: 10vw;
  }

  &__ok-btn {
    right: 10vw;
  }
}
</style>
