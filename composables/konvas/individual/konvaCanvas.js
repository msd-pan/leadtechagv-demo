import createStage from './createStage';

function startKonvaStage(window, parks, events, paraObj) {
  let stage = createStage(window, parks, events, paraObj);

  return stage;
}

export default startKonvaStage;
