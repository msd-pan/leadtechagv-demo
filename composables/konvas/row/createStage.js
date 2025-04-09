import konvaFunctions from './konvaFunctions';
import konvaComponents from './konvaComponents';
import konvaScaling from './konvaScaling';

function createStage(window, parks, events, paraObj) {
  const getCanvasSize = () => {
    const canvasElement = document.getElementById('canvas');
    if (canvasElement) {
      return {
        width: canvasElement.offsetWidth,
        height: canvasElement.offsetHeight,
      };
    } else {
      return {
        width: 0,
        height: 0,
      };
    }
  };

  const { width: canvasWidth, height: canvasHeight } = getCanvasSize();

  let stage = konvaComponents.stage(window.innerWidth, window.innerHeight);

  const zoomThresholdFar = 0.3;
  const zoomThresholdClose = 0.8;

  stage = konvaScaling.addTouchMove(
    stage,
    zoomThresholdFar,
    zoomThresholdClose,
  );

  const stageMovePos = { x: 0, y: 0 };

  if (paraObj.selectedOkiba == 'D') {
    let stageEnlargeNum = 0.6;
    stage.scale({ x: stageEnlargeNum, y: stageEnlargeNum });
  }

  stage.position({ x: stageMovePos.x, y: stageMovePos.y });

  const updateEvents = {
    handleRackClick(e) {
      events.handleRackClick(e);
    },
  };

  let layer = konvaFunctions.createLayer(window.innerHeight);
  konvaFunctions.createItems(stage, layer, updateEvents, parks, paraObj);
  stage.add(layer);

  return stage;
}

export default createStage;
