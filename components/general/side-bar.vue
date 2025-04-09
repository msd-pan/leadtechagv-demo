<template>
  <div class="sidebar" v-if="!props.hide">
    <div class="sidebar__header">選択中</div>
    <div class="sidebar__content">
      <div class="sidebar__info">
        <div class="sidebar__section sidebar__section--from">
          <span class="sidebar__label">from</span>
          <span class="sidebar__value">{{ startRack }}</span>
          <span class="sidebar__row-value"
            >{{ minStartRow }}-{{ maxStartRow }}</span
          >
        </div>
        <div class="sidebar__section sidebar__section--to">
          <span class="sidebar__label">to</span>
          <span
            class="sidebar__value"
            v-for="(goalRack, index) in goalRacks"
            :key="index"
          >
            置場{{ goalRack.name }}
            {{ goalRack.minStartRow ? goalRack.minStartRow + '列' : '' }}
            {{ goalRack.maxStartRow ? '-' + goalRack.maxStartRow + '列' : '' }}
            <span v-if="index < goalRacks.length - 1">/</span>
          </span>
        </div>
      </div>
      <div class="sidebar__status">
        <span class="sidebar__current">{{ nowSelectingRackAmount }}</span>
        <span class="sidebar__divider">/</span>
        <span class="sidebar__total">{{ luggageAmount }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  hide: false,
  startRack: '',
  minStartRow: '',
  maxStartRow: '',
  goalRacks: [],

  nowSelectingRackAmount: 0,
  luggageAmount: 0,

  ifIndividual: false,
});

onMounted(() => {
  // console.log('goalRacks', props.goalRacks);
});
</script>

<style scoped lang="scss">
.sidebar {
  width: 200px;
  height: 40vh;
  position: fixed;
  right: 0;
  top: 30vh;
  background-color: #fff;
  border-left: 1px solid #ccc;
  box-shadow: -2px 0 8px rgba(0, 0, 0, 0.1);
  border-radius: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;

  &__header {
    background-color: #ff9900;
    border-top-left-radius: inherit;
    padding-top: 10px;
    height: 15%;
    width: 100%;
    text-align: center;
    letter-spacing: 0.3ch;
    font-size: large;
    font-weight: bold;
    color: white;
  }

  &__content {
    height: 85%;
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 10px;
    gap: 10px;
  }

  &__info {
    width: 100%;
    text-align: center;
    font-weight: bold;
    color: #333;
    position: relative;
    top: -4vh;
  }

  &__section {
    display: flex;
    flex-direction: column;
    overflow-y: auto;
    padding: 5px;

    &--from {
      margin-top: 6vh;
    }

    &--to {
      max-height: 18vh;
      margin-top: 5vh;
    }
  }

  &__label {
    font-size: 0.9em;
    color: #666;
    text-align: left;
    margin-left: -60px;
  }

  &__value {
    font-size: 1.2em;
    color: #333;
    font-weight: bold;
  }

  &__row-value {
    font-size: 1em;
    color: #555;
  }

  &__status {
    display: flex;
    justify-content: center;
    align-items: baseline;
    font-size: 2em;
    font-weight: bold;
    position: relative;
    top: 1vh;
  }

  &__current {
    color: #333;
  }

  &__divider {
    margin: 0 5px;
    font-size: 0.9em;
    color: #888;
  }

  &__total {
    color: #888;
  }
}
</style>
