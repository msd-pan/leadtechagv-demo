<template>
  <div class="home-screen">
    <div class="home-screen__header">
      <div class="home-screen__header-title">
        <p class="home-screen__header-title-text">メンテナンス基本情報</p>
      </div>
      <div class="home-screen__menu">
        <general-menu-bar />
      </div>
    </div>

    <div class="home-screen__agf-title-box">
      <p class="home-screen__agf-title-box-text">AGF 01</p>
    </div>

    <div class="home-screen__accumulating">
      <maintenance-accumulating
        :nowShowingAgf="data.nowShowingAgf"
        :allTasks="allTasks"
        :gearOilChangeHours="data.gearOilChangeHours"
        :hydraulicOilChangeHours="data.hydraulicOilChangeHours"
        :lastTimeTireChange="data.lastTimeTireChange"
        :lastTimeBatteryChange="data.lastTimeBatteryChange"
        v-if="fetched"
      />
    </div>

    <div class="home-screen__btn-group">
      <NuxtLink to="/">
        <general-btn-back class="home-screen__back-btn" @click="goBack" />
      </NuxtLink>
    </div>
  </div>
</template>

<script setup>
import { useErrorStore } from '../stores/errorStore';

const errorStore = useErrorStore();

const errorCode = computed(() => errorStore.errorCode);

const data = reactive({
  mode: '自動',
  btnText: '',
  ifShowChangeModeAlert: false,
  gearOilChangeHours: 0,
  hydraulicOilChangeHours: 0,
  lastTimeTireChange: {
    year: '-',
    month: '-',
    day: '-',
  },
  lastTimeBatteryChange: {
    year: '-',
    month: '-',
    day: '-',
  },
});

const allTasks = ref({});
const fetched = ref(false);

const router = useRouter();
const goBack = () => {
  router.push('/');
};

onMounted(async () => {
  // await handleMaintenanceData();
  fetched.value = true;

  // call the function that handle error codes
});
</script>

<style lang="scss" scoped>
.home-screen {
  background-color: #ffffff;
  height: 100vh;
  position: relative;

  &__header {
    position: relative;
    width: 100%;
    height: 10vh;

    &-title {
      position: relative;
      width: 85%;
      height: 100%;
      left: 5vw;
      border: 2px solid #ccc;
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
      border-radius: 20px;
      display: flex;
      align-items: center;
      justify-content: center;

      &-text {
        font-size: 3.5ch;
        font-weight: 800;
        color: #00a55e;
        margin: 0;
        padding: 0;
        text-align: center;
      }
    }
  }

  &__menu {
    z-index: 9;
    width: 10vw;
    height: 15vh;
    position: absolute;
    right: 1vw;
    top: 0;
  }

  &__agf-title-box {
    position: relative;
    width: 80%;
    height: 10%;
    left: 10vw;
    top: 4vh;
    border: 2px solid #ccc;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    border-radius: 40px;
    display: flex;
    align-items: center;
    justify-content: center;

    &-text {
      font-size: 3.5ch;
      font-weight: 800;
      color: #00a55e;
      margin: 0;
      padding: 0;
      text-align: center;
    }
  }

  &__accumulating {
    position: relative;
    top: 5vh;
  }

  &__btn-group {
    NuxtLink {
      display: block;
    }

    .home-screen__back-btn {
      position: absolute;
      left: 2vw;
      bottom: 14vh;
    }
  }

  &__agf-name-container {
    display: flex;
    position: relative;
    justify-content: space-around;
    padding: 0 150px;
    top: 6vh;
    gap: 2vw;

    &-box {
      width: 140px;
      height: 80px;
      border-radius: 20px;
      background-color: #00a55e;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-size: 3.5ch;
      font-weight: bold;

      &--selected {
        background-color: blue;
      }
    }
  }

  &__change-mode {
    position: absolute;
    right: 2vw;
    width: 120px;
    height: 120px;
    border-radius: 50%;
    padding: 10px;
    margin-top: 10px;
    background-color: #4caf50;
    color: white;
    border: none;
    font-size: 1.5em;
    font-weight: bold;
    cursor: pointer;
    text-align: center;
    display: flex;
    align-items: center;
    justify-content: center;
  }
}
</style>
