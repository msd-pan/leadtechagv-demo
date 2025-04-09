<template>
  <div class="home-screen">
    <div class="home-screen__page" v-if="!hasError">
      <div class="home-screen__callout">
        <general-nav-callout
          id="nav-callout"
          class="home-screen__callout-text"
          :text="'搬送する荷物の数量を入力してください'"
        />
      </div>

      <div class="home-screen__menu">
        <general-menu-bar />
      </div>

      <general-btn-back
        class="home-screen__go-back-btn"
        line1="前の画面に"
        line2="戻る"
        @click="goBack"
      />

      <task-num-input
        class="home-screen__number-input"
        @update:number="handleNumber"
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

const data = reactive({});

const router = useRouter();
const goBack = () => {
  router.go(-1);
};

const handleNumber = (luggageNumber) => {
  taskStore.setTaskProperty('deliveryTask.luggageAmount', luggageNumber);
  router.push('/task/staked-way');
};

onMounted(async () => {
  taskStore.setTaskProperty('deliveryTask.luggageAmount', 0);
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
  align-items: center;

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
    top: 0;
  }

  &__go-back-btn {
    position: absolute;
    left: 10vw;
    top: 30vh;
  }

  &__number-input {
    position: absolute;
    right: 10vw;
    top: 30vh;
  }
}
</style>
