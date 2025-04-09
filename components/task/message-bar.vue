<template>
  <div class="my-alert">
    <div class="my-alert-mask"></div>
    <div class="my-alert-content">
      <div :class="['button-block', { 'red-bg': ifRed }]"></div>
      <div :class="['text-wrapper', { 'red-text': ifRed }]">
        <p>{{ line1 }}</p>
        <p>{{ line2 }}</p>
        <p>{{ line3 }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  line1: {
    type: String,
    required: false,
    default: '111',
  },
  line2: {
    type: String,
    required: false,
    default: '22222',
  },
  line3: {
    type: String,
    required: false,
    default: '3333',
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

<style scoped>
.my-alert {
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1;
}

.my-alert-content {
  width: 60vw;
  height: 50vh;
  position: relative;
  background-color: #fff;
  border-radius: 15px;
  z-index: 1001;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  border: 1px solid #ccc;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.25);
}

.button-block {
  width: 100%;
  height: 20%;
  background-color: #50ae8b;
  border-radius: 15px 15px 0 0;
}

.text-wrapper {
  width: 100%;
  position: relative;
  align-items: center;
  justify-content: center;
  display: flex;
  flex-direction: column;
  height: 80%;
  margin: 2vh 0;
}

.my-alert-content p {
  margin-top: 10px;
  text-align: center;
  flex-grow: 1;
  width: 100%;
  font-size: 2em;
  font-weight: bold;
  color: #31523a;
}
.red-bg {
  background-color: red;
}

.red-text p {
  color: red;
}
</style>
