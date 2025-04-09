<template>
  <div class="container"><div id="canvas"></div></div>
</template>
<script setup>
import startKonvaStage from '@/composables/konvas/individual/konvaCanvas';

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
  selectedAmount: 0,
});

const allUiRacks = ref(['handleRackClick']);

const konvaStart = (window, parks, events, paraObj) => {
  // console.log(selectedOkiba());
  return startKonvaStage(window, parks, events, paraObj);
};

const emit = defineEmits(['handleRackClick']);

const handleRackClick = (rackObj) => {
  // console.log(rackObj);
  emit('handleRackClick', {
    allUiRacks: allUiRacks.value,
    selectingRackInfo,
    rackObj,
  });
};

const handleIfRacksClickable = () => {
  const racksInColumns = new Map(); // 使用 Map 替代 Object

  // 按区域和列编号分组
  allUiRacks.value.forEach((rack) => {
    const match = rack.rackParameters.name.match(/^([A-Z]+)-(\d+)-\d+$/); // 匹配 区域-列-编号 格式
    if (match) {
      const area = match[1]; // 区域，如 A
      const column = match[2]; // 列编号，如 10
      const groupKey = `${area}-${column}`; // 组合键，如 A-10

      if (!racksInColumns.has(groupKey)) {
        racksInColumns.set(groupKey, []); // 初始化组
      }
      racksInColumns.get(groupKey).push(rack); // 将块加入对应分组
    }
  });

  // 分析每列并修改属性
  racksInColumns.forEach((group, groupKey) => {
    // 对每列按照后缀（数字）升序排列，确保从外到内
    group.sort((a, b) => {
      const suffixA = parseInt(a.rackParameters.name.split('-')[2], 10);
      const suffixB = parseInt(b.rackParameters.name.split('-')[2], 10);
      return suffixA - suffixB; // 从小到大排序
    });

    let firstSelectableRack = null; // 第一个可选择的货物
    group.forEach((rack) => {
      const { status, colors } = rack.rackParameters;

      // 判断是否是可选择的货物
      const isSelectable =
        status.firstFloor === 1 ||
        status.firstFloor === 2 ||
        status.firstFloor === 3;

      if (isSelectable && !firstSelectableRack) {
        // 设置第一个可选择的货物
        firstSelectableRack = rack;
        rack.off('click tap');
        rack.on('click tap', () => {
          // 允许点击内部块
          handleInsideClick(group, rack);
        });
      } else if (isSelectable) {
        // 对其他货物取消点击事件并变灰
        rack.off('click tap', rack.boxClickFunc);
        rack.children[0].fill(colors.selectedDarkGreen);
      }
    });
  });

  /**
   * 允许点击内部的货物
   */
  const handleInsideClick = (group, clickedRack) => {
    const outerSuffix = parseInt(
      outerRack.rackParameters.name.split('-')[2],
      10,
    );

    group.forEach((rack) => {
      const suffix = parseInt(rack.rackParameters.name.split('-')[2], 10);

      // 如果在外层并且可选择
      if (suffix > outerSuffix && !rack.disabled) {
        console.log('clickable', rack);
        rack.off('click tap');
        rack.on('click tap', rack.boxClickFunc);
        rack.children[0].fill(rack.rackParameters.colors.originGreen);

        // 将不可选择的货物变灰并取消点击
      } else if (suffix < outerSuffix && !rack.disabled) {
        rack.off('click tap', rack.boxClickFunc);
        rack.children[0].fill(rack.rackParameters.colors.selectedDarkGreen);
      }

      // 判断当前块是否已经被取消点击
      if (clickedRack.rackParameters.clicked) {
        // 如果被选中，允许内部块点击
        clickedRack.rackParameters.clicked = false;
        clickedRack.children[0].fill(
          clickedRack.rackParameters.colors.originGreen,
        );

        group.forEach((rack) => {
          const suffix = parseInt(rack.rackParameters.name.split('-')[2], 10);

          if (suffix > clickedSuffix && !rack.disabled) {
            rack.off('click tap');
            rack.on('click tap', rack.rackParameters.boxClickFunc);
            rack.children[0].fill(rack.rackParameters.colors.originGreen);
          }
        });
      } else {
        // 如果取消点击，禁用其后续块
        group.forEach((rack) => {
          const suffix = parseInt(rack.rackParameters.name.split('-')[2], 10);

          if (suffix > clickedSuffix) {
            rack.off('click tap', rack.rackParameters.boxClickFunc);
            rack.children[0].fill(rack.rackParameters.colors.disableGray);
          }
        });
      }
    });
  };
};

const selectingRackInfo = reactive({ rackArray: [] });

let konvaStage = null;
onMounted(async () => {
  konvaStage = konvaStart(
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
      selectedAmount: props.selectedAmount,
    },
  );

  emit('handleRackClick', {
    allUiRacks: allUiRacks.value,
    selectingRackInfo: { rackArray: [] },
    rackObj: {},
  });
  // if (!props.ifChangeStatus) {
  //   handleIfRacksClickable();
  // }

  // console.log(props.selectedAmount);
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
  height: 100%;
  display: flex;
  position: absolute;
  justify-content: center;
  top: 28vh;
  left: 0vw;
}
#canvas {
  width: 100%;
  height: 100%;
  position: relative;
  /* background-color: aquamarine; */
}
</style>
