<template>
  <button :class="['go-back-btn', { 'go-back-btn--disabled': disabled }]">
    <div class="go-back-btn__content">
      <div class="go-back-btn__line1">{{ line1 }}</div>
      <div class="go-back-btn__line2">{{ line2 }}</div>
    </div>
  </button>
</template>

<script setup>
const props = defineProps({
  line1: {
    type: String,
    required: false,
    default: '前の画面に',
  },
  line2: {
    type: String,
    required: false,
    default: '戻る',
  },
  disabled: {
    type: Boolean,
    default: false,
  },
});
onMounted(() => {});
</script>

<style scoped lang="scss">
.go-back-btn {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  background-color: blue;
  border: 10px solid white;
  display: flex;
  justify-content: center;
  align-items: center;
  color: white;
  font-weight: bold;
  text-align: center;
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    background-color: #78a8d9;
  }

  &--disabled {
    background-color: gray;
    cursor: not-allowed;
  }

  &__content {
    text-align: center;
  }

  &__line1 {
    font-size: 13px;
  }

  &__line2 {
    font-size: 29px;
    margin-top: 5px;
  }
}
</style>
