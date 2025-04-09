<template>
  <div class="nav-callout">
    <div class="nav-callout__callout">
      <img
        src="/svg/callout.svg"
        class="nav-callout__image"
        preserveAspectRatio="none"
      />
      <div class="nav-callout__text">{{ props.text }}</div>
    </div>
    <div class="nav-callout__logo">
      <img :src="logo" class="nav-callout__logo-image" />
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  width: {},
  text: {
    type: String,
    required: true,
  },
  logo: {
    type: String,
    required: false,
    default: '/callout_forklift.png',
  },
});

watch(
  () => props.text,
  (newVal) => {},
);
</script>
<style scoped lang="scss">
.nav-callout {
  height: 100px;
  width: 100%;
  position: relative;

  &__callout {
    width: 100%;
    transform: translateY(-40px);
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    z-index: 2;
  }

  &__image {
    width: 100%;
    height: 150px;
    filter: drop-shadow(0px 0px 4px rgba(0, 0, 0, 0.3));
  }

  &__text {
    position: absolute;
    width: 100%;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    text-align: center;
    font-size: 2vw;
    color: #50ae8b;
    font-weight: bold;
    z-index: 3;
  }

  &__logo {
    position: absolute;
    top: 95px;
    left: 50%;
    transform: translateX(-400px);
    z-index: 2;
  }

  &__logo-image {
    width: 130px;
  }

  &--ys001-callout-custom {
    display: flex;
    position: absolute;
    top: -8vh;
    left: 5vw;
    width: 85vw;
    height: 30vh;
  }

  &--ys001-logo-custom {
    position: absolute;
    left: -14vw;
    top: 3vh;
  }
}
</style>
