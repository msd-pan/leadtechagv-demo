export const processRacks = (racks) => {
  const groupedByArea = {};
  racks.forEach((rack) => {
    if (rack.name) {
      const [area, column] = rack.name.split('-');
      if (!groupedByArea[area]) groupedByArea[area] = new Set();
      groupedByArea[area].add(parseInt(column, 10));
    }
  });

  return Object.entries(groupedByArea)
    .map(
      ([area, columns]) =>
        `置場${area}の${Array.from(columns)
          .sort((a, b) => a - b)
          .join('列,')}列`,
    )
    .join('、');
};

export const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export const getRackTypeFromLabel = (label) => {
  if (label === '4段') return 1;
  if (label === '5段') return 2;
  return -1;
};

export const isSelectableRack = (status, targetType) => {
  return status === targetType || status === 0;
};

export const getValidParks = (racks, type, deliveryType, maxCount) => {
  const parks = [];
  for (const rack of racks) {
    if (type === 'goal') {
      if (rack.status.firstFloor === 0 && rack.status.firstAppointment === 0)
        parks.push(rack.name + '-1');
      if (
        deliveryType === 2 &&
        parks.length < maxCount &&
        rack.status.secondFloor === 0 &&
        rack.status.secondAppointment === 0
      )
        parks.push(rack.name + '-2');
    } else {
      if (
        deliveryType === 2 &&
        rack.status.secondFloor !== 0 &&
        rack.status.secondAppointment === 0
      )
        parks.push(rack.name + '-2');
      if (
        parks.length < maxCount &&
        rack.status.firstFloor !== 0 &&
        rack.status.firstAppointment === 0
      )
        parks.push(rack.name + '-1');
    }
  }
  return parks;
};
