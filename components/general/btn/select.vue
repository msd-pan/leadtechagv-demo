<template>
  <button :class="['button', { 'button--disabled': disabled }]">
    <div
      class="button__inner"
      :style="{ width: computedWidth, height: computedHeight }"
    >
      <img
        v-if="imageSrc.length > 0"
        :src="imageSrc"
        alt="Button Image"
        class="button__icon"
      />
      <div class="button__text" :style="{ fontSize: dynamicFontSize }">
        {{ buttonText }}
      </div>
    </div>
  </button>
</template>

<script setup>
const props = defineProps({
  disabled: {
    type: Boolean,
    required: false,
    default: false,
  },
  imageSrc: {
    type: String,
    required: false,
    default: '',
  },
  buttonText: {
    type: String,
    required: true,
  },
  width: {
    type: Number,
    required: false,
    default: 100,
  },
  height: {
    type: Number,
    required: false,
    default: 100,
  },
});

const computedWidth = `${(250 * props.width) / 100}px`;
const computedHeight = `${(250 * props.height) / 100}px`;

// 计算动态字体大小
const dynamicFontSize = computed(() => {
  const baseSize = (80 * props.width) / 100;
  const textLength = props.buttonText.length;
  // 调整字体大小：字数越多，字体越小
  return `${baseSize / Math.sqrt(textLength)}px`;
});
</script>

<style scoped lang="scss">
.button {
  background-color: transparent;
  color: white;
  padding: 10px;

  &--disabled {
    pointer-events: none;
    opacity: 0.5;
  }

  &__inner {
    border-radius: 50%;
    background-color: #35a16b;
    border: 20px solid white;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    color: white;
    font-weight: bold;
    text-align: center;
    transition: background-color 0.3s;

    &:hover {
      background-color: #ef8632;
      border-color: white;
    }
  }

  &__icon {
    width: calc(100px * v-bind('width') / 100);
    height: calc(60px * v-bind('height') / 100);
  }

  &__text {
    font-weight: bold;
  }
}
</style>
