export const getOkibaInfo = async () => {
  const parks = await fetch('/parks.json')
    .then((res) => res.json())
    .catch(() => false);

  if (!parks) return false;

  const groupedData = parks
    .map((item) => {
      const parts = item.ParkNo.split('-');
      return {
        id: item.id,
        ParkNo: item.ParkNo,
        Status: item.Status,
        Appointment: item.Appointment,
        ParkGroup: parts[0],
        FirstNumberPart: parts[1],
        SecondNumberPart: parts[2],
      };
    })
    .sort((a, b) => {
      if (a.ParkGroup !== b.ParkGroup)
        return a.ParkGroup.localeCompare(b.ParkGroup);
      if (parseInt(a.FirstNumberPart) !== parseInt(b.FirstNumberPart))
        return parseInt(a.FirstNumberPart) - parseInt(b.FirstNumberPart);
      return parseInt(a.SecondNumberPart) - parseInt(b.SecondNumberPart);
    })
    .reduce((result, item) => {
      if (!result[item.ParkGroup]) result[item.ParkGroup] = {};
      if (!result[item.ParkGroup][item.FirstNumberPart])
        result[item.ParkGroup][item.FirstNumberPart] = [];
      result[item.ParkGroup][item.FirstNumberPart].push({
        id: item.id,
        name: item.ParkNo,
        status: item.Status,
        appointment: item.Appointment,
      });
      return result;
    }, {});

  return groupedData;
};

export const checkRowAvailableRacks = async (
  startOrGoal,
  okibaName,
  rowName,
  cargoType,
  deliveryType,
  startArea,
) => {
  const parks = await fetch('/parks.json')
    .then((res) => res.json())
    .catch(() => false);

  let availableSpots = 0;
  let filteredParks = [];

  if (startArea === 'conveyor') {
    filteredParks = parks.filter((p) =>
      p.ParkNo.startsWith(`${okibaName}-${rowName}-`),
    );

    if (deliveryType === 2) {
      availableSpots = filteredParks.reduce(
        (count, p) => (p.Status !== 0 ? count : count + 1),
        0,
      );
    } else {
      availableSpots = filteredParks
        .filter((p) => p.ParkNo.split('-')[3] === '1')
        .reduce((count, p) => (p.Status !== 0 ? count : count + 1), 0);
    }
  } else {
    filteredParks = parks.filter((p) =>
      p.ParkNo.startsWith(`${okibaName}-${rowName}`),
    );

    if (startOrGoal === 'start') {
      availableSpots = filteredParks.reduce((count, p) => {
        if (p.Status !== 0 && p.Status !== cargoType) return count;
        return count + 1;
      }, 0);
    } else if (startOrGoal === 'goal' && deliveryType === 2) {
      availableSpots = filteredParks.reduce((count, p) => {
        if (p.Status !== 0 || p.Appointment !== 0) return count;
        return count + 1;
      }, 0);

      const firstUnavailable = filteredParks.find(
        (p) => p.Status !== 0 || p.Appointment !== 0,
      );

      if (firstUnavailable) {
        const nameParts = firstUnavailable.ParkNo.split('-');
        if (
          nameParts[nameParts.length - 1] === '1' &&
          ((cargoType === '1' && firstUnavailable.Status === 2) ||
            (cargoType === '2' && firstUnavailable.Status === 1))
        ) {
          availableSpots -= 1;
        }
      }
    } else {
      filteredParks = filteredParks.filter(
        (p) => p.ParkNo.split('-')[3] === '1',
      );
      availableSpots = filteredParks.reduce((count, p) => {
        if (p.Status !== 0 || p.Appointment !== 0) return count;
        return count + 1;
      }, 0);
    }
  }

  return availableSpots;
};

export const computeOkibaRackStats = (okibaInfo, selectedOkiba) => {
  const rowsArray = Object.keys(okibaInfo[selectedOkiba] || {});
  let emptyRack = 0,
    totalRack = 0;

  for (const row of rowsArray) {
    okibaInfo[selectedOkiba][row].forEach((rack) => {
      if (rack.status === 0 || rack.status === 4) {
        emptyRack += 1;
      }
      totalRack += 1;
    });
  }

  return {
    totalRack,
    emptyRack,
  };
};
