<template>
  <div class="number-display-container" v-if="ifChangeStatus">
    <div class="okiba-container">
      <span class="label">置場</span>
      <span class="okiba-name">{{ okiba }}</span>
    </div>

    <div class="second-row">
      <div
        class="layer-check"
        :class="{ selected: selectedLayer === '4段' }"
        @click="selectLayer('4段')"
      >
        <div class="checkbox-content">
          <span>4段</span>
          <img src="/goods.png" alt="4段" class="icon" />
        </div>
      </div>

      <div
        class="layer-check"
        :class="{ selected: selectedLayer === '5段' }"
        @click="selectLayer('5段')"
      >
        <div class="checkbox-content">
          <span>5段</span>
          <img src="/goods.png" alt="5段" class="icon" />
        </div>
      </div>
      <div class="status-container">
        <div class="display-box">
          <span class="in color-box"></span>
          <span class="label">在</span>
          <span class="number">{{ inNumber }}</span>
        </div>
        <div class="display-box">
          <span class="empty color-box"></span>
          <span class="label">空</span>
          <span class="number">{{ emptyNumber }}</span>
        </div>
      </div>
    </div>
  </div>
  <div class="display-container" v-else>
    <span class="title orange">選択中</span>
    <span class="box orange">{{ selecting }}</span>

    <span class="title green">選択可</span>
    <span class="box green">{{ inNumber }}</span>
  </div>
</template>

<script setup>
const props = defineProps({
  okiba: { type: String, required: true, default: '' },
  inNumber: {
    type: Number,
    required: true,
    default: 0,
  },
  emptyNumber: {
    type: Number,
    required: true,
    default: 0,
  },
  ifChangeStatus: false,
  selecting: {
    type: Number,
    required: true,
    default: 0,
  },
});

const selectedLayer = ref(null);

// 选择层的逻辑
const selectLayer = (layer) => {
  if (selectedLayer.value === layer) {
    selectedLayer.value = null; // 取消选中
  } else {
    selectedLayer.value = layer; // 设置为当前选中
  }
  emit('selectLayer', selectedLayer.value);
};

const emit = defineEmits(['selectLayer']);
</script>

<style scoped>
.number-display-container {
  display: flex;
  align-items: center;
  gap: 20px;
  flex-direction: column;
  top: -30vh;
}

.okiba-container {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  flex-direction: row;
  box-sizing: border-box;
  width: 100px;
  height: 60px;
  position: relative;
  top: 3vh;
}

.label {
  font-size: 1.2em;
  color: #333;
  position: absolute;
  left: 40px;
}

.okiba-name {
  font-size: 1.5em;
  font-weight: 400;
  color: #333;
  position: absolute;
  right: -20px;
  width: 50px;
  text-align: center;
  overflow: hidden;
  white-space: nowrap;
}

.second-row {
  display: flex;
  flex-direction: row;
  gap: 15px;
}

.layer-check {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  width: 100px;
  height: 90px;
  border-radius: 8px;
  background-color: #35a16b;
  transition: background-color 0.3s ease, border 0.3s ease;
  border: 2px solid transparent;
}

/* 选中时背景色和边框颜色变化 */
.layer-check.selected {
  background-color: #ff7f00;
}

/* 未选中时保持默认颜色 */
.checkbox-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 3px;
  padding: 10px;
}

.layer-check .checkbox-content span {
  color: #ffffff;
  font-size: 1.3em;
  font-weight: 800;
}

.icon {
  width: 40px;
  height: 40px;
}

.display-box {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  flex-direction: row;
  border: 2px solid #ccc;
  border-radius: 8px;
  padding: 10px;
  box-sizing: border-box;
  width: 120px;
  height: 45px;
  position: relative;
}

.color-box {
  width: 20px;
  height: 20px;
  border-radius: 4px;
  margin-right: 8px;
  flex-shrink: 0;
}

.in {
  background: linear-gradient(45deg, #b5b5b6 50%, #ff7f00 50%);
  border: 1px solid #ccc;
}

.empty {
  background-color: #585858;
}

.number {
  font-size: 1.2em;
  font-weight: bold;
  color: #333;
  position: absolute;
  right: 0px;
  width: 56px;
  text-align: center;
  overflow: hidden;
  white-space: nowrap;
}

.display-container {
  display: flex;
  align-items: center;
  gap: 20px;
  top: -27vh;
}

.box {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  border-radius: 8px;
  padding: 10px;
  box-sizing: border-box;
  border: 2px solid #b5b5b6;
  height: 45px;
  width: 60px;
  position: relative;
  font-size: 1.2em;
  font-weight: 800;
  left: -16px;
}

.title {
  font-size: 1.2em;
  font-weight: 800;
}

.orange {
  color: #ff7f00;
}

.green {
  color: #35a16b;
}
</style>
