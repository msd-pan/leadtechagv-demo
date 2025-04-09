<template>
  <div class="home-screen">
    <div class="home-screen__page-header">
      <div class="home-screen__header-title">
        <p class="home-screen__title">エラー履歴</p>
      </div>
      <div class="home-screen__menu">
        <general-menu-bar />
      </div>
    </div>

    <div class="home-screen__inspection">
      <p class="home-screen__inspection-date">{{ currentDate }}</p>

      <div class="home-screen__inspection-list-container">
        <ul class="home-screen__inspection-list">
          <li
            v-for="(error, index) in errorHistoryArray"
            :key="index"
            class="home-screen__inspection-item"
            @click="
              goToErrorDetails(error.e_h_code, error.e_h_id, error.e_h_time)
            "
          >
            <span class="home-screen__bullet">•</span>
            <span class="home-screen__info">
              {{
                new Date(error.e_h_time).toLocaleString('en-US', {
                  timeZone: 'Asia/Tokyo',
                  hour12: false,
                })
              }}
              エラーコード {{ error.e_h_code }} AGF{{ error.e_h_id }}
            </span>
          </li>
        </ul>
      </div>
    </div>

    <div class="home-screen__btn-group">
      <NuxtLink to="/">
        <general-btn-back class="home-screen__go-back-btn" @click="goBack" />
      </NuxtLink>
      <NuxtLink to="/">
        <general-btn-confirm
          text="確認"
          :disabled="false"
          class="home-screen__ok-btn"
        />
      </NuxtLink>
    </div>
  </div>
</template>

<script setup>
import { useErrorStore } from '../stores/errorStore';

const errorStore = useErrorStore();
const errorCode = computed(() => errorStore.errorCode);

// 当前日期
const currentDate = new Date().toLocaleDateString('ja-JP', {
  year: 'numeric',
  month: 'long',
  day: 'numeric',
  weekday: 'short',
});

const errorHistoryArray = ref([]);

const router = useRouter();

const getDbErrorHistory = async () => {
  const rows = [
    {
      id: 8,
      e_h_id: '0001',
      e_h_code: '18886921',
      e_h_time: '1/4/2025 18:38:06',
    },
    {
      id: 7,
      e_h_id: '0001',
      e_h_code: '18886917',
      e_h_time: '12/3/2025 16:48:16',
    },
    {
      id: 6,
      e_h_id: '0001',
      e_h_code: '120590852',
      e_h_time: '10/3/2025 16:48:16',
    },
    {
      id: 5,
      e_h_id: '0001',
      e_h_code: '70254668',
      e_h_time: '7/3/2025 16:08:16',
    },
    {
      id: 4,
      e_h_id: '0001',
      e_h_code: '104859907',
      e_h_time: '6/3/2025 16:08:16',
    },
    {
      id: 3,
      e_h_id: '0001',
      e_h_code: '37748773',
      e_h_time: '4/3/2025 11:08:16',
    },
    {
      id: 2,
      e_h_id: '0001',
      e_h_code: '37751361',
      e_h_time: '4/3/2025 11:08:02',
    },
    {
      id: 1,
      e_h_id: '0001',
      e_h_code: '36700186',
      e_h_time: '4/3/2025 10:58:48',
    },
  ];

  return rows;
};

// 跳转到指定错误详情页面
const goToErrorDetails = (code, carNo, time) => {
  errorStore.setErrorCode(code);
  errorStore.setCarNo(carNo);
  errorStore.setOccurTime(
    new Date(time).toLocaleString('en-US', {
      timeZone: 'Asia/Tokyo',
      hour12: false,
    }),
  );
  if (specialErrorCodesSet.has('0' + parseInt(code, 10).toString(16))) {
    router.push(`/error/details/frequent-error`);
  } else {
    router.push(`/error/details`);
  }
};

const specialErrorCodesSet = new Set([
  '02400a41', //1-c  追加
  '02400025', //7-a,7-b,6
  '02400017', //2
  '0240002a', //2
  '06400903', //1-a 5 7-c
  '02400027', //1-a 5 7-c
  '0430004c', //1_b
  '0430004d', //1_b
  '02400289', // 3
  '07301204', // 6
  '02400071', // 2
]);

onMounted(async () => {
  errorHistoryArray.value = await getDbErrorHistory();
});

const goBack = () => {
  router.go(-1);
};
</script>

<style lang="scss" scoped>
.home-screen {
  background-color: #ffffff;
  height: 100vh;
  position: relative;

  &__page-header {
    position: relative;
    width: 100%;
    height: 10vh;
  }

  &__header-title {
    position: relative;
    width: 90%;
    height: 100%;
    border: 2px solid #ccc;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    border-radius: 20px;
    display: flex;
    align-items: center;
    justify-content: center;

    .home-screen__title {
      font-size: 1.5em;
      color: #00a55e;
      margin: 0;
      font-weight: bolder;
    }
  }

  &__menu {
    z-index: 9;
    width: 10vw;
    height: 15vh;
    position: absolute;
    right: 1vw;
    top: 0vh;
  }

  &__inspection {
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    margin-top: 5vh;
    display: flex;
    flex-direction: column;
    align-items: center;

    &-date {
      font-size: 1.2em;
      font-weight: bold;
      color: #00a55e;
      margin-bottom: 0;
    }

    &-list-container {
      width: 100%;
      max-width: 80vw;
      height: 50vh;
      background-color: #f9f9f9;
      border: 1px solid #ccc;
      border-radius: 10px;
      padding: 15px;
      margin-bottom: 20px;
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
      overflow-y: scroll;
    }

    &-list {
      list-style: none;
      padding: 0;
      margin: 0;
    }

    &-item {
      display: flex;
      align-items: center;
      margin-bottom: 10px;
      background-color: #e9f5eee8;
      border-radius: 5px;
      cursor: pointer;
      transition: background-color 0.3s ease;

      .home-screen__bullet {
        color: #00a55e;
        font-size: 1.5em;
        margin-right: 10px;
      }

      .home-screen__info {
        font-size: 1.2em;
        color: #00a55e;
        font-weight: bold;
      }
    }
  }

  &__btn-group {
    background-color: white;
    display: flex;
    justify-content: flex-start;

    .home-screen__go-back-btn {
      position: absolute;
      left: 2vw;
      bottom: 14vh;
    }

    .home-screen__ok-btn {
      position: absolute;
      right: 2vw;
      bottom: 14vh;
    }
  }
}
</style>
