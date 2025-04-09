import konvaFunctions from './konvaFunctions';
import konvaComponents from './konvaComponents';
import konvaScaling from '../general/konvaScaling';

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

  const stageMovePos = { x: 300, y: -60 };

  if (paraObj.selectedOkiba == 'D') {
    let stageEnlargeNum = 0.65;
    stage.scale({ x: stageEnlargeNum, y: stageEnlargeNum });
  }

  stage.position({ x: stageMovePos.x, y: stageMovePos.y });

  const updateEvents = {
    handleRackClick(e) {
      events.handleRackClick(e);
    },
  };

  const layer = konvaFunctions.createLayer();
  const checkboxLayer = new Konva.Layer();
  konvaFunctions.createItems(
    stage,
    layer,
    checkboxLayer,
    updateEvents,
    parks,
    paraObj,
  );
  stage.add(layer, checkboxLayer);

  return stage;
}

export default createStage;
