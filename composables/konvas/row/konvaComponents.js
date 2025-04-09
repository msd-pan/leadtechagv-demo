import Konva from 'konva';
const konvaComponents = {
  stage(width, height) {
    const stage = new Konva.Stage({
      x: 0,
      y: 0,
      container: 'canvas',
      width: width,
      height: height,
      draggable: false,
    });
    return stage;
  },
};

export default konvaComponents;
