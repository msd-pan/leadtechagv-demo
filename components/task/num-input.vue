<template>
  <div class="number-input-container">
    <input
      type="text"
      :value="localNumber"
      readonly
      @click="showCustomKeyboard = true"
    />
    <general-btn-confirm
      text="決定"
      class="okBtn"
      :disabled="!localNumber"
      @click="submitNumber"
    />

    <!-- 自定义数字键盘 -->
    <div v-if="showCustomKeyboard" class="custom-keyboard">
      <button v-for="n in 10" :key="n" @click="appendNumber(n - 1)">
        {{ n - 1 }}
      </button>
      <button @click="clearNumber">クリア</button>
      <button @click="closeKeyboard">閉じる</button>
    </div>
  </div>
</template>

<script setup>
const emit = defineEmits(['update:number']);
const localNumber = ref('');
const showCustomKeyboard = ref(false);

function submitNumber() {
  emit('update:number', Number(localNumber.value));
  localNumber.value = '';
}

function appendNumber(num) {
  localNumber.value += num;
}

function clearNumber() {
  localNumber.value = '';
}

function closeKeyboard() {
  showCustomKeyboard.value = false;
}
</script>

<style scoped>
.number-input-container {
  display: flex;
  align-items: center;
  position: relative;
  justify-content: center;
}

.number-input-container input {
  border: 2px solid #ccc;
  border-radius: 4px;
  width: 40vw;
  height: 15vh;
  font-size: 4em;
  text-align: center;
  letter-spacing: 1vw;
  box-sizing: border-box;
  position: absolute;
  right: 17vw;
}

.custom-keyboard {
  display: flex;
  position: absolute;
  flex-wrap: wrap;
  width: 80vw;
  gap: 10px;
  top: 20vh;
  right: 0vw;
}

.custom-keyboard button {
  width: 18%;
  padding: 20px;
  font-size: 1.5em;
  border: 1px solid #ccc;
  border-radius: 4px;
  background-color: #eee;
  cursor: pointer;
}

.custom-keyboard button:active {
  background-color: #ddd;
}
</style>
