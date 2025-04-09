<template>
  <div class="alert" v-if="visible">
    <div class="alert__mask"></div>
    <div class="alert__content">
      <div :class="['alert__header', { 'alert__header--red': ifRed }]">
        <button
          v-if="ifHasCross"
          class="alert__close-button"
          @click="closeAlert"
        >
          ✕
        </button>
      </div>

      <div
        :class="['alert__text-wrapper', { 'alert__text-wrapper--red': ifRed }]"
      >
        <p>{{ line1 }}</p>
        <p>{{ line2 }}</p>
      </div>

      <img :src="truck" class="alert__image" />
    </div>

    <general-btn-back
      v-if="ifHasBtns"
      class="alert__btn alert__btn--back"
      @click="closeAlert"
    />
    <general-btn-confirm
      text="決定"
      v-if="ifHasBtns"
      class="alert__btn alert__btn--confirm"
      :color="confirmBtnColor"
      :disabled="false"
      @click="onClickConfirm"
    />
  </div>
</template>

<script setup>
const props = defineProps({
  line1: {
    type: String,
    required: false,
    default: '',
  },
  line2: {
    type: String,
    required: false,
    default: '',
  },
  truck: {
    type: String,
    required: false,
    default: '/truck_goods.png',
  },
  visible: {
    type: Boolean,
    required: true,
  },
  ifHasCross: {
    type: Boolean,
    required: false,
    default: false,
  },
  ifHasBtns: {
    type: Boolean,
    required: false,
    default: false,
  },
  ifRed: {
    type: Boolean,
    required: false,
    default: false,
  },
});

const emit = defineEmits(['update:visible', 'confirm']);

const closeAlert = () => {
  emit('update:visible', false);
};

const onClickConfirm = () => {
  emit('confirm');
  emit('update:visible', false);
};

const confirmBtnColor = ref('');
onMounted(() => {
  if (props.ifRed) {
    confirmBtnColor.value = '#DF0101';
  } else confirmBtnColor.value = '#1d8348';
});
</script>

<style scoped lang="scss">
.alert {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;

  &__mask {
    position: absolute;
    inset: 0;
    background-color: rgba(0, 0, 0, 0.5);
  }

  &__content {
    width: 40vw;
    height: 50vh;
    position: relative;
    background-color: #fff;
    border-radius: 15px;
    z-index: 1001;
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  &__header {
    width: 100%;
    height: 5vh;
    background-color: #50ae8b;
    border-radius: 15px 15px 0 0;
    display: flex;
    justify-content: flex-end;
    align-items: center;

    &--red {
      background-color: red;
    }
  }

  &__close-button {
    background: none;
    border: none;
    color: white;
    font-size: 35px;
    font-weight: 800;
    cursor: pointer;
    padding: 0 15px;
  }

  &__text-wrapper {
    white-space: pre-wrap;
    width: 100%;
    flex-grow: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;

    p {
      margin-top: 20px;
      text-align: center;
      font-size: 2vw;
      font-weight: bold;
      color: #50ae8b;
    }

    &--red p {
      color: red;
    }
  }

  &__image {
    width: 150px;
    margin: 20px auto;
  }

  &__btn {
    position: absolute;
    bottom: 20vh;

    &--back {
      left: 10vw;
    }

    &--confirm {
      right: 10vw;
    }
  }
}
</style>
