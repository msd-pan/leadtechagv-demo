<template>
  <div class="info-panel">
    <div class="info-panel__header">{{ title }}</div>
    <div
      class="info-panel__content-wrapper"
      :class="{
        'info-panel__content-wrapper--place': isPlace,
        'info-panel__content-wrapper--reason': isReason,
        'info-panel__content-wrapper--fix-way': isFixWay,
        'info-panel__content-wrapper--handbook': isHandBook,
      }"
    >
      <div
        class="info-panel__content-item"
        v-for="(text, index) in textArray"
        :key="index"
        :class="{
          'info-panel__content-item--type1-selected': text.isType1Selected,
          'info-panel__content-item--type2-selected': text.isType2Selected,
        }"
      >
        {{ text.value }}
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  title: { type: String, required: false, default: '' },
  textArray: { type: Array, required: false, default: () => [] },
  isPlace: { type: Boolean, required: false, default: false },
  isReason: { type: Boolean, required: false, default: false },
  isFixWay: { type: Boolean, required: false, default: false },
  isHandBook: { type: Boolean, required: false, default: false },
});
</script>

<style scoped lang="scss">
.info-panel {
  padding: 0;
  border: 0;
  margin: 0;
  width: 10%;
  height: 100%;
  position: relative;
  display: flex;
  flex-direction: column;
  border-radius: 10px;
  background-color: #f2f2f2;

  &__header {
    padding: 4px 2px;
    width: 100%;
    position: sticky;
    top: 0;
    display: flex;
    align-items: center;
    border-radius: 10px;
    background-color: #e6e6e6;
    font-size: 1.2em;
    font-weight: 600;
    border-right: 2px dotted #000;
  }

  &__content-wrapper {
    width: 100%;

    &--place {
    }
    &--reason {
    }
    &--fix-way {
    }
    &--handbook {
    }
  }

  &__content-item {
    padding: 4px 2px;
    display: flex;
    align-items: center;
    border-radius: 10px;
    background-color: #f2f2f2;
    border-right: 2px dotted #000;

    &--type1-selected {
      background-color: #ea4225 !important;
    }

    &--type2-selected {
      background-color: #ff7500 !important;
    }
  }
}
</style>
