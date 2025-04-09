<template>
  <div class="err-home-screen">
    <div class="err-home-screen__agf-no">
      AGF{{ occuringErrorCarNo[3] }}号機
    </div>
    <div class="err-home-screen__container">
      <div class="err-home-screen__unfixed" v-if="!ifErrorFixed">
        <div class="err-home-screen__alert-area">
          <img
            v-if="errorType == 1"
            src="/alert_red.png"
            alt=""
            class="err-home-screen__alert-img"
          />
          <img
            v-else
            src="/alert_orange.png"
            alt=""
            class="err-home-screen__alert-img"
          />
          <div
            :class="[
              'err-home-screen__head',
              errorType === 1
                ? 'err-home-screen__head--red'
                : 'err-home-screen__head--orange',
            ]"
          >
            {{ errorTypeHeading }}が発生しました
          </div>
          <div
            :class="[
              'err-home-screen__code',
              errorType === 1
                ? 'err-home-screen__code--red'
                : 'err-home-screen__code--orange',
            ]"
          >
            {{ errorTypeAndReason }}
          </div>
        </div>
        <NuxtLink :to="toNextPage()">
          <button
            :class="[
              'err-home-screen__button',
              errorType === 1
                ? 'err-home-screen__button--red'
                : 'err-home-screen__button--orange',
            ]"
          >
            {{ mainBtnText }}
          </button>
        </NuxtLink>
        <general-btn-confirm
          text="閉じる"
          class="err-home-screen__ok-btn"
          :disabled="false"
          @click="goBack"
        />
      </div>
      <div class="err-home-screen__fixed" v-else>
        <div class="err-home-screen__alert-area">
          <img
            src="/solve_icon.png"
            alt=""
            class="err-home-screen__alert-img"
          />
          <div class="err-home-screen__head--green">エラーが解消されました</div>
          <div class="err-home-screen__code--green">{{ occurError }}</div>
        </div>
        <div class="btn">
          <NuxtLink to="/">
            <general-btn-back class="goBackBtn" @click="goBack" />
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useErrorStore } from '../stores/errorStore';

const errorStore = useErrorStore();
const errorCode = computed(() => errorStore.errorCode);
const carNo = computed(() => errorStore.carNo);

const errorTypeHeading = ref('');
const occuringErrorCarNo = ref('');

const mainBtnText = ref('');

let errorTypeAndReason = ref('');
const errorType = ref(0); // 1代表error，2代表不具合
const getDbErrorMsg = async () => {
  const errorData = await fetch('/error_db.json')
    .then((res) => res.json())
    .catch((error) => {
      return false;
    });

  const foundError = errorData.find(
    (error) => String(error.e_code_10) === String(errorCode.value),
  );

  if (foundError.e_type) {
    errorType.value = foundError.e_type;
  }

  console.log('getDbErrorMsg', foundError);
  if (errorType.value == 1) {
    errorTypeAndReason.value = foundError.e_no + ': ' + foundError.e_no_reason;
  } else {
    errorTypeAndReason.value = errorCode.value;
  }

  // errorStore.setErrorCode(occurError.value);

  return data;
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
const toNextPage = () => {
  // console.log(errorCode.value);
  // console.log(parseInt(errorCode.value, 10).toString(16));

  if (errorType.value == 2) {
    return 'EP003';
  } else if (
    !specialErrorCodesSet.has('0' + parseInt(errorCode.value, 10).toString(16))
  ) {
    return '/error/details';
  } else return 'error/details/frequent-error';
};

const router = useRouter();
const goBack = () => {
  router.go(-1);
};

const fetchConfig = async () => {
  const data = await $fetch('/api/ui/getConfig', {
    method: 'GET',
  }).catch((error) => error.data);
  // console.log(data.response);
  return data.response;
};

const ifErrorFixed = ref(false);

onMounted(async () => {
  // console.log('errorCode', errorCode.value);
  occuringErrorCarNo.value = carNo.value;
  const config = await fetchConfig();
  await getDbErrorMsg();
  if (errorType.value != 0) {
    if (errorType.value == 1) {
      errorTypeHeading.value = 'エラー';
      mainBtnText.value = 'エラー原因と解決方法';
      console.log('errorType.value == 1', errorType.value);
    } else {
      errorTypeHeading.value = '不具合';
      mainBtnText.value =
        'リードテックへ連絡してください ' + config.leadtech_phone_number;
      console.log('errorType.value == 2', errorType.value);
    }
  }

  if (errorCode.value == '') {
    router.push('/');
  }
});
</script>
<style lang="scss" scoped>
.err-home-screen {
  background-color: #dddddd;
  height: 100vh;
  z-index: 1;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;

  &__agf-no {
    z-index: 1;
    display: flex;
    position: absolute;
    align-items: center;
    justify-content: center;
    width: 15vw;
    height: 7vh;
    background: black;
    font-size: 1.6em;
    font-weight: 800;
    letter-spacing: 2px;
    color: #ffffff;
    border-radius: 30px;
    top: 13vh;
    left: 12vw;
  }

  &__container {
    width: 80vw;
    height: 80vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-around;
    background-color: white;
    position: relative;
    border-radius: 40px;
  }

  &__unfixed,
  &__fixed {
    position: relative;
    display: contents;
  }

  &__alert-area {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  &__alert-img {
    width: 15%;
    height: auto;
  }

  &__head {
    margin: 20px 0 0 0;
    font-size: 50px;
    font-weight: 800;

    &--red {
      color: red;
    }

    &--orange {
      color: orange;
    }

    &--green {
      color: green;
    }
  }

  &__code {
    margin: 0;
    font-size: 50px;
    font-weight: 800;

    &--red {
      color: red;
    }

    &--orange {
      color: orange;
    }

    &--green {
      color: green;
    }
  }

  &__button {
    margin: 20px 0;
    width: 40vw;
    height: 10vh;
    border-radius: 50vh;
    font-size: 25px;
    font-weight: 800;
    color: white;
    cursor: pointer;

    &--red {
      background-color: red;
    }

    &--orange {
      background-color: orange;
    }

    &:hover {
      background-color: rgb(15, 199, 54);
      color: black;
    }
  }

  &__ok-btn {
    width: 12vw;
    height: 12vw;
  }
}
</style>
