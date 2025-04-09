<template>
  <div class="storage-container">
    <div class="storage-header">置場{{ name }}</div>
    <div class="storage-body">
      <div class="storage-capacity">
        <span class="total">{{ capacity }}</span>
        <span class="icon">[</span>
        <div class="container">
          <span class="empty">空 {{ capacity - used }}</span>
          <span class="used">在 {{ used }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  name: String,
  capacity: Number,
  used: Number,
  width: {
    type: Number,
    require: false,
    default: 100,
  },
});
</script>

<style scoped>
.storage-container {
  width: calc(250px * v-bind('width') / 100);
  display: flex;
  flex-direction: column;
  background-color: #1d8348;
  border-radius: 10px;
  padding: 10px;
  font-size: 16px;
}

.storage-header {
  font-size: 25px;
  font-weight: bold;
  text-align: center;
  color: white;
  margin-bottom: 5px;
}

.storage-body {
  height: 12vh;
  text-align: center;
  background-color: white;
  color: #1d8348;
  border-radius: 10px;
  padding: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.storage-capacity {
  display: flex;
  align-items: center;
  justify-content: space-around;
  width: 100%;
  font-weight: bold;
  color: #1d8348;
  font-size: 25px;
}

.container {
  display: flex;
  flex-direction: column;
  padding: 0;
}

.total {
  font-size: 30px;
  margin-right: 10px;
}

.icon {
  font-size: 50px;
  font-weight: 200;
  margin: 0 0 0 30px;
}

.empty,
.used {
  font-size: 20px;
  margin-left: 0px;
}
</style>
