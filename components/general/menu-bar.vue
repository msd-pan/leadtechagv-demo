<template>
  <div class="menu-bar" @click="toggleMenu">
    <img src="/menu_bar.png" alt="Button Image" class="menu-bar__icon" />
  </div>

  <div ref="menuContainer" class="menu-dropdown" v-if="ifUnfold">
    <ul class="menu-dropdown__list">
      <NuxtLink to="/maintenance" class="menu-dropdown__link">
        <li class="menu-dropdown__item">メンテナンス</li>
      </NuxtLink>
      <NuxtLink to="/error" class="menu-dropdown__link">
        <li class="menu-dropdown__item">トラブル</li>
      </NuxtLink>
    </ul>
  </div>
</template>
<script setup>
const ifUnfold = ref(false);
const menuContainer = ref(null);

const toggleMenu = () => {
  ifUnfold.value = !ifUnfold.value;
  event.stopPropagation();
};

const handleClickOutside = (event) => {
  if (menuContainer.value && !menuContainer.value.contains(event.target)) {
    ifUnfold.value = false;
  }
};

onMounted(() => {
  document.addEventListener('click', handleClickOutside);
});

onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside);
});
</script>
<style scoped lang="scss">
.menu-bar {
  position: absolute;
  right: 7vw;
  top: 0;

  &__icon {
    width: 8vw;
    height: 15vh;
    position: absolute;
    top: -3vh;
  }
}

.menu-dropdown {
  width: 20vw;
  height: 40vh;
  background-image: url('/menu_bar_unfold.png');
  background-size: contain;
  background-position: center;
  background-repeat: no-repeat;
  position: absolute;
  top: -6vh;
  right: -2vw;

  &__list {
    position: absolute;
    top: 14vh;
    left: 2vw;
    padding: 0;
    margin: 0;
    list-style-type: none;
  }

  &__link {
    text-decoration: none;
    color: inherit;
    display: block;
  }

  &__item {
    line-height: 2.5;
    font-size: larger;
    font-weight: 600;
    display: flex;
    justify-content: center;
    align-items: center;

    &:hover {
      background-color: #ffa500;
      color: white;
    }
  }
}
</style>
