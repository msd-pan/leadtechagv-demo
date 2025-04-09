<template>
  <div class="container"><div id="canvas"></div></div>
</template>
<script setup>
import startKonvaStage from '@/composables/konvas/row/konvaCanvas';

const props = defineProps({
  parksData: {
    type: Array,
    required: true,
  },
  selectedOkiba: '',
  ifChangeStatus: false,
  luggageAmount: 0,
  startOrGoal: '',
  singleOrDouble: '',
  statusChangeClick: {},
});

const allUiRacks = ref([]);

const konvaStart = (window, parks, events, paraObj) => {
  return startKonvaStage(window, parks, events, paraObj);
};

const emit = defineEmits(['handleRackClick,statusChangeRack']);

const handleRackClick = (rackObj) => {
  // console.log(rackObj);
  emit('handleRackClick', {
    allUiRacks: allUiRacks.value,
    selectingRackInfo,
    rackObj,
  });
};

const statusChangeRack = () => {
  emit('statusChangeRack', {
    statusChangeArray: selectingRackInfo.statusChangeArray,
  });
};

const selectingRackInfo = reactive({ rackArray: [], statusChangeArray: {} });

let konvaStage = null;
onMounted(async () => {
  konvaStart(
    window,
    props.parksData,
    { handleRackClick },
    {
      allUiRacks: allUiRacks.value,
      selectedOkiba: props.selectedOkiba,
      ifChangeStatus: props.ifChangeStatus,
      luggageAmount: () => props.luggageAmount,
      startOrGoal: props.startOrGoal,
      singleOrDouble: props.singleOrDouble,
      selectingRackInfo,
      statusChangeClick: props.statusChangeClick,
    },
  );

  statusChangeRack();
});

onBeforeUnmount(() => {
  if (konvaStage) {
    konvaStage.destroy();
    konvaStage = null;
  }
});
</script>
<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
.container {
  width: 100%;
  height: 70%;
  display: flex;
  position: absolute;
  justify-content: center;
  top: 30vh;
  /* left: 30vw; */
}
#canvas {
  width: 100%;
  height: 100%;
  position: relative;
  /* background-color: aquamarine; */
}
</style>
