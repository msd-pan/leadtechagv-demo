<template>
  <VitePwaManifest />
  <NuxtPage />
</template>
<script setup>
// if ('serviceWorker' in navigator) {
//   navigator.serviceWorker
//     .register('/sw.js')
//     .then((reg) => {
//       console.log('Service Worker registered:', reg);
//     })
//     .catch((err) => {
//       console.error('Service Worker registration failed:', err);
//     });
// }
</script>
<style>
.transitions {
  width: 100%;
  height: 100%;
  background-color: transparent;
}
.container {
  background-color: transparent;
}

body {
  background-color: #deeee1;
  position: relative;
}

body,
html {
  overflow: hidden;
  touch-action: manipulation;
}

.col {
  background-color: transparent;
}

.page-enter-active,
.page-leave-active {
  transition: all 0.5s;
}

.page-enter-from,
.page-leave-to {
  opacity: 0;
  filter: blur(1rem);
}
</style>
