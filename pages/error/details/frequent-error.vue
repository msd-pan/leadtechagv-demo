<template>
  <div class="home-screen" v-if="data.fetched">
    <div class="home-screen__car-no">{{ data.carNo }}号機</div>
    <img v-if="data.single" class="home-screen__single" :src="data.singlePicSrc" />
    <div v-else class="home-screen__non-single">
      <img class="home-screen__pic" :src="data.picArray[currentIndex]" />
      <button class="home-screen__switch-btn" @click="showNextImage">次へ</button>
    </div>
    <general-btn-back class="home-screen__go-back-btn" @click="goBack" />
  </div>
</template>

<script setup>
import { useErrorStore } from '../stores/errorStore';
const errorStore = useErrorStore();
const errorCode = computed(() => errorStore.errorCode);
const carNo = computed(() => errorStore.getCarNo);

const data = reactive({
  fetched: false,
  carNo: '',
  single: true,
  singlePicSrc: '',
  picArray: [],
});

const currentIndex = ref(0); // 当前图片索引

const router = useRouter();
const goBack = () => {
  router.go(-1);
};

const showNextImage = () => {
  currentIndex.value = (currentIndex.value + 1) % data.picArray.length;
};

const specialErrorCodesMap = new Map([
  ['02400a41', { single: true, singlePicSrc: '/fixWay/1_c.jpg' }],
  [
    '02400025',
    {
      single: false,
      picArray: ['/fixWay/7_a.jpg', '/fixWay/7_b.jpg', '/fixWay/6.jpg'],
    },
  ],
  ['02400017', { single: true, singlePicSrc: '/fixWay/2.jpg' }],
  ['0240002a', { single: true, singlePicSrc: '/fixWay/2.jpg' }],
  [
    '06400903',
    {
      single: false,
      picArray: ['/fixWay/1_a.jpg', '/fixWay/5.jpg', '/fixWay/7_c.jpg'],
    },
  ],
  [
    '02400027',
    {
      single: false,
      picArray: ['/fixWay/1_a.jpg', '/fixWay/5.jpg', '/fixWay/7_c.jpg'],
    },
  ],
  ['0430004c', { single: true, singlePicSrc: '/fixWay/1_b.jpg' }],
  ['0430004d', { single: true, singlePicSrc: '/fixWay/1_b.jpg' }],
  ['02400289', { single: true, singlePicSrc: '/fixWay/3.jpg' }],
  ['07301204', { single: true, singlePicSrc: '/fixWay/6.jpg' }],
  ['02400071', { single: true, singlePicSrc: '/fixWay/2.jpg' }],
]);

onMounted(async () => {
  if (errorCode.value === '') {
    router.push('/');
  }

  data.carNo = carNo.value;
  const value = specialErrorCodesMap.get(
    '0' + parseInt(errorCode.value, 10).toString(16),
  );
  data.single = value.single;
  if (data.single) {
    data.singlePicSrc = value.singlePicSrc;
  } else {
    data.picArray = value.picArray || [];
  }
  data.fetched = true;
});
</script>

<style lang="scss" scoped>
.home-screen {
  background-color: #dddddd;
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin: 0;

  &__car-no {
    position: absolute;
    top: 1vh;
    right: 2vw;
    background-color: #e6e6e6;
    color: black;
    font-size: 25px;
    font-weight: 800;
    padding: 5px 10px;
    z-index: 1;
  }

  &__single,
  &__pic {
    position: relative;
    display: flex;
    object-fit: contain;
    width: auto;
    height: 90%;
    top: -4vh;
  }

  &__non-single {
    position: relative;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;
  }

  &__switch-btn {
    position: absolute;
    bottom: 10vh;
    padding: 10px 20px;
    font-size: 18px;
    background-color: blue;
    border: 2px solid #dddddd;
    color: white;
    font-weight: bold;
    text-align: center;
    cursor: pointer;
  }

  &__go-back-btn {
    position: absolute;
    right: 7vw;
    bottom: 14vh;
  }
}
</style>

