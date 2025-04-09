<template>
  <div class="my-alert" v-if="visible">
    <div class="my-alert-mask"></div>
    <div class="my-alert-content">
      <div class="button-block">
        <p class="warning-text">荷物の種類を選択してください</p>
      </div>

      <img :src="truck" :class="['truck_display']" />

      <div class="selection-wrapper">
        <div
          :class="['option', { selected: selectedOption === 1 }]"
          @click="selectOption(1)"
        >
          <p>4段</p>
        </div>
        <div
          :class="['option', { selected: selectedOption === 2 }]"
          @click="selectOption(2)"
        >
          <p>5段</p>
        </div>
      </div>
    </div>
    <general-btn-back class="goBackBtn" @click="goBack" />

    <general-btn-confirm
      text="決定"
      class="okBtn"
      :disabled="false"
      :color="confirmBtnColor"
      @click="onClickConfirm"
    />
  </div>
</template>

<script setup>
const props = defineProps({
  truck: {
    type: String,
    required: false,
    default: '/truck_goods.png',
  },
  visible: {
    type: Boolean,
    required: true,
  },
});
const router = useRouter();

const emit = defineEmits(['update:visible', 'confirmSelection']);

const selectedOption = ref(1); // 默认选中4段

const goBack = () => {
  router.back(-1);
};

const selectOption = (option) => {
  selectedOption.value = option;
};

const onClickConfirm = () => {
  emit('confirmSelection', selectedOption.value);
  emit('update:visible', false);
};

const confirmBtnColor = ref('green');
</script>

<style scoped>
.my-alert {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.my-alert-mask {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
}

.my-alert-content {
  width: 40vw;
  height: 50vh;
  position: relative;
  background-color: #fff;
  border-radius: 15px;
  z-index: 1001;
  display: flex;
  flex-direction: column;
  align-items: center; /* 修正：确保内容居中 */
}

.button-block {
  width: 100%;
  height: 5vh;
  background-color: #50ae8b;
  border-radius: 15px 15px 0 0;
  display: flex;
  position: relative;
  justify-content: center;
  align-items: center;
  font-size: 1.4em;
  color: #275339;
  font-weight: 800;
}

.warning-text {
  margin: 0;
}

.close-button {
  text-decoration: none; /* 移除下划线 */
  position: relative;
  color: white;
  float: right;
  font-size: 35px;
  font-weight: 800;
  width: 10%;
  display: flex;
  justify-content: center;
}

.selection-wrapper {
  display: flex;
  justify-content: space-around;
  align-items: center;
  width: 100%;
  margin-top: 20px;
  height: 15%; /* 调整高度以适配容器 */
}

.option {
  width: 30%;
  height: 10vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f5f5f5;
  border: 2px solid transparent;
  border-radius: 10px;
  cursor: pointer;
  transition: background-color 0.3s ease, border-color 0.3s ease;
}

.option.selected {
  background-color: #50ae8b;
  border-color: #1d8348;
  color: #fff;
}

.option p {
  margin: 0;
  font-size: 1.5em;
  font-weight: bold;
}

.truck_display {
  width: 150px;
  margin: 20px auto;
}
.goBackBtn {
  position: absolute;
  left: 10vw;
  bottom: 20vh;
}
.okBtn {
  position: absolute;
  right: 10vw;
  bottom: 20vh;
}
</style>
