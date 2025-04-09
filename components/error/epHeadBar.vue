<template>
  <div class="status-banner">
    <div class="status-banner__car-info">
      <div class="status-banner__car-number">{{ carN0 }}</div>
      <div class="status-banner__running-type">{{ runningType }}</div>
    </div>
    <div
      class="status-banner__running-status"
      :class="{
        'status-banner__running-status--red': isRed,
        'status-banner__running-status--orange': isOrange,
      }"
    >
      {{ runningStatus }}
    </div>
    <div
      class="status-banner__error-code"
      :class="{
        'status-banner__error-code--red': isRed,
        'status-banner__error-code--orange': isOrange,
      }"
    >
      {{ errorNo }}：{{ errorNoReason }}
    </div>
    <div class="status-banner__date">{{ nowDate }}</div>
  </div>
</template>

<script setup>
const props = defineProps({
  carN0: {
    type: String,
    required: false,
    default: '',
  },
  runningType: {
    type: String,
    required: false,
    default: '',
  },
  runningStatus: {
    type: String,
    required: false,
    default: '',
  },
  errorNo: {
    type: String,
    required: false,
    default: '',
  },
  errorNoReason: {
    type: String,
    required: false,
    default: '',
  },
  isRed: {
    type: Boolean,
    required: false,
    default: false,
  },
  isOrange: {
    type: Boolean,
    required: false,
    default: false,
  },
});

let nowDate = ref('');

// the function that generate formatted timestamp
const updateDateTime = () => {
  const now = new Date();
  const year = String(now.getFullYear());
  const month = String(now.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
  const day = String(now.getDate()).padStart(2, '0');
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const seconds = String(now.getSeconds()).padStart(2, '0');

  nowDate.value = `${year}年${month}月${day}日　${hours}:${minutes}`;

  return `${year}年${month}月${day}日　${hours}:${minutes}`;
};

onMounted(() => {
  updateDateTime();
  setInterval(updateDateTime, 5000); //re-render the time every 1 sec.
});
</script>
<style scoped lang="scss">
.status-banner {
  height: 10vh;
  width: 90vw;
  z-index: 1;
  position: relative;
  display: flex;
  align-items: flex-end;
  justify-content: flex-start;
  margin: 0;
  border: 0;
  padding-bottom: 0;

  &__car-info {
    margin-left: 10px;
    position: relative;
  }

  &__car-number {
    background-color: #e6e6e6;
    color: black;
    font-size: 15px;
    font-weight: 800;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  &__running-type {
    color: black;
    font-size: 20px;
    font-weight: 800;
  }

  &__running-status {
    font-size: 40px;
    font-weight: 800;
    margin: 0 20px;
    position: relative;

    &--red {
      color: red;
    }

    &--orange {
      color: orange;
    }
  }

  &__error-code {
    font-size: 27px;
    font-weight: 400;
    margin: 0 20px 0 0;
    position: absolute;
    left: 30%;

    &--red {
      color: red;
    }

    &--orange {
      color: orange;
    }
  }

  &__date {
    color: black;
    font-size: 18px;
    font-weight: 600;
    position: relative;
    left: 45%;
  }
}
</style>
