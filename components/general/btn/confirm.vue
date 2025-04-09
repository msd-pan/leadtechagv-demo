<template>
  <button
    ref="myButton"
    id="btn"
    :class="['grey-btn', { 'grey-btn--disabled': isDisabled }]"
    :style="{ backgroundColor: isDisabled ? 'darkgrey' : btnColor }"
  >
    <div class="grey-btn__content">
      <div class="grey-btn__pre-line" v-if="text_pre !== undefined">
        {{ text_pre }}
      </div>
      <div class="grey-btn__main-line">{{ text }}</div>
    </div>
  </button>
</template>

<script setup>
const props = defineProps({
  disabled: {
    type: Boolean,
    required: false,
    default: true, // 通过改变这个参数的值来设置按钮的样式与行为 true or false
  },
  text: {
    type: String,
    required: false,
    default: '決定',
  },
  text_pre: {
    type: String,
    required: false,
    default: undefined,
  },
  color: {
    type: String,
    required: false,
    default: '#1d8348', // 默认按钮颜色为绿色
  },
});

const myButton = ref(null);

// 使用 props 传入的 color
const btnColor = ref(props.color);
const isDisabled = ref(props.disabled);

watch(
  () => props.disabled,
  (newValue) => {
    isDisabled.value = newValue;
  },
);

watch(
  () => props.color,
  (newColor) => {
    btnColor.value = newColor;
  },
);
</script>

<style scoped lang="scss">
.grey-btn {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  border: 10px solid white;
  display: flex;
  justify-content: center;
  align-items: center;
  color: white;
  font-weight: bold;
  text-align: center;
  cursor: pointer;
  transition: 0.5s;

  &--disabled {
    background-color: darkgrey;
    cursor: not-allowed;
  }

  &__content {
    text-align: center;
  }

  &__main-line {
    font-size: 34px;
  }

  &__pre-line {
    font-size: 15px;
  }
}
</style>
