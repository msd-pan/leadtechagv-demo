<template>
  <div class="home-screen">
    <div class="home-screen__page">
      <div class="home-screen__callout">
        <general-nav-callout
          id="nav-callout"
          class="home-screen__callout-text"
          :text="'入庫モードを選択してください'"
        />
      </div>

      <div class="home-screen__menu">
        <general-menu-bar />
      </div>

      <div class="home-screen__button-group">
        <general-btn-select
          :imageSrc="'/hira.png'"
          buttonText="平積み"
          :width="120"
          :height="120"
          @click="handleDeliveryType(1)"
        />
        <general-btn-select
          :imageSrc="'/nidenn.png'"
          buttonText="2段積"
          :width="120"
          :height="120"
          @click="handleDeliveryType(2)"
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

const handleDeliveryType = (number) => {
  data.disabled = false;
  taskStore.setTaskProperty('deliveryTask.deliveryType', number);
};

const goBack = () => {
  router.go(-1);
};

const toNextPage = () => {
  if (task.value.deliveryTask.deliveryType != 0) {
    router.push('/okiba-select/individual-or-row');
  }
};

onMounted(async () => {
  taskStore.setTaskProperty('deliveryTask.deliveryType', 0);
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

  &__button-group {
    position: relative;
    display: flex;
    justify-content: center;
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
