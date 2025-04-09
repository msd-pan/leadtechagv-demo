<template>
  <div class="home-screen">
    <div class="home-screen__page">
      <div class="home-screen__callout">
        <general-nav-callout
          id="nav-callout"
          class="home-screen__callout-front"
          :text="'置場の選択方法を選んでください'"
        />
      </div>

      <div class="home-screen__menu">
        <general-menu-bar />
      </div>

      <div class="home-screen__buttons">
        <general-btn-select
          :imageSrc="'/retsu.png'"
          buttonText="列選択"
          :width="120"
          :height="120"
          @click="handleOkibaSelectWay('row')"
        />
        <general-btn-select
          :imageSrc="'/kobetu.png'"
          buttonText="個別選択"
          :width="120"
          :height="120"
          @click="handleOkibaSelectWay('individual')"
        />
      </div>

      <general-btn-back
        class="home-screen__go-back-btn"
        line1="前の画面に"
        line2="戻る"
        @click="goBack"
      />

      <general-btn-confirm
        text="決定"
        class="home-screen__ok-btn"
        :disabled="data.disabled"
        @click="toNextPage"
        @touchstart="toNextPage"
      />
    </div>
  </div>
</template>

<script setup>
import { useTaskStore } from '../stores/taskStore';
import { useErrorStore } from '../stores/errorStore';

const errorStore = useErrorStore();

const errorCode = computed(() => errorStore.errorCode);

const taskStore = useTaskStore();
const task = computed(() => taskStore.task);

const data = reactive({ disabled: true });

const router = useRouter();

const handleOkibaSelectWay = (selectWay) => {
  data.disabled = false;
  task.value.ifChangeStatus
    ? taskStore.setTaskProperty('statusChange.okibaSelectWay', selectWay)
    : taskStore.setTaskProperty('deliveryTask.okibaSelectWay', selectWay);

  console.log(task.value);
};

const goBack = () => {
  router.go(-1);
};

const toNextPage = () => {
  if (
    task.value.statusChange.okibaSelectWay != '' ||
    task.value.deliveryTask.okibaSelectWay != ''
  ) {
    router.push('/okiba-select');
  }
};

onMounted(async () => {
  taskStore.setTaskProperty('statusChange.okibaSelectWay', '');
  taskStore.setTaskProperty('deliveryTask.okibaSelectWay', '');
  console.log(task.value);
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
    align-content: center;

    #nav-callout {
      margin: 0;
      width: 100vw;
    }

    .home-screen__callout-front {
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

  &__buttons {
    display: flex;
    justify-content: center;
    position: relative;
    top: 25vh;
    gap: 10vw;
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
