const holtNoParams = (dataset) => {
  let allForecast = [];

  for (let index = 0.1; index < 1; index += 0.1) {
    if (index.toFixed(1) == 1.0) {
      continue;
    }

    let alpha = index.toFixed(1);
    let bufferForecast = [];

    for (let indexBeta = 0.1; indexBeta < 1; indexBeta += 0.1) {
      if (indexBeta.toFixed(1) == 1.0) {
        continue;
      }

      let beta = indexBeta.toFixed(1);

      dataset.forEach((data, i) => {
        if (i === 0) {
          const level0 = alpha * data.qty;
          const trend0 =
            (dataset[1].qty -
              dataset[0].qty +
              (dataset[3].qty - dataset[2].qty)) /
            2;

          bufferForecast.push({
            i: i,
            period: data.period,
            alpha: alpha,
            beta: beta,
            qty: data.qty,
            level: level0,
            trend: trend0,
            forecast: 0,
            result: 0,
            mad: 0,
            mse: 0,
            mape: 0,
          });
        } else {
          let latestForecast = Object.values(bufferForecast)[
            Object.keys(bufferForecast).length - 1
          ];
          let level =
            alpha * data.qty +
            (1 - alpha) * (latestForecast.level + latestForecast.trend);

          let trend =
            beta * (level - latestForecast.level) +
            (1 - beta) * latestForecast.trend;

          bufferForecast.push({
            i: i,
            period: data.period,
            alpha: alpha,
            beta: beta,
            qty: data.qty,
            level: level,
            trend: trend,
            forecast: latestForecast.level + latestForecast.trend,
            result: Math.round(latestForecast.level + latestForecast.trend),
            mad: Math.abs(
              data.qty - (latestForecast.level + latestForecast.trend)
            ),
            mse: Math.pow(
              data.qty - (latestForecast.level + latestForecast.trend),
              2
            ),
            mape: Math.abs(
              ((data.qty - (latestForecast.level + latestForecast.trend)) /
                data.qty) *
                100
            ),
          });
        }
      });
    }

    allForecast.push(bufferForecast);
  }

  let letForecast = [];
  allForecast.forEach((forecast) => {
    let currentBeta = 0;
    let arrayParsing = [];
    let arrayParsing2 = [];

    forecast.forEach((data) => {
      if (data.beta !== currentBeta && currentBeta !== 0) {
        arrayParsing.push(arrayParsing2);
        arrayParsing2 = [];
      }

      currentBeta = data.beta;

      arrayParsing2.push(data);
    });

    arrayParsing.push(arrayParsing2);

    // forecast next year
    arrayParsing.forEach((arr, i) => {
      let predict = Object.values(arr)[Object.keys(arr).length - 1];

      let nextForecast = {
        i: predict.i + 1,
        period: parseInt(predict.period) + 1,
        forecast: predict.level + predict.trend,
        result: Math.round(predict.level + predict.trend),
      };

      arrayParsing[i].splice(Object.keys(arr).length, 0, nextForecast);
    });

    letForecast.push(arrayParsing);
  });

  return letForecast;
};

const holtWithParams = (dataset, alpha, beta) => {
  const arrAlpha = [0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9];
  const arrBeta = [0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9];

  if (!arrAlpha.includes(alpha) && !arrBeta.includes(beta)) {
    alert("alpha or beta cannot described");
  }

  let bufferForecast = [];
  dataset.forEach((data, i) => {
    if (i === 0) {
      const level0 = alpha * data.qty;
      const trend0 =
        (dataset[1].qty - dataset[0].qty + (dataset[3].qty - dataset[2].qty)) /
        2;

      bufferForecast.push({
        i: i,
        period: data.period,
        alpha: alpha,
        beta: beta,
        qty: data.qty,
        level: level0,
        trend: trend0,
        forecast: 0,
        result: 0,
        mad: 0,
        mse: 0,
        mape: 0,
      });
    } else {
      let latestForecast = Object.values(bufferForecast)[
        Object.keys(bufferForecast).length - 1
      ];
      let level =
        alpha * data.qty +
        (1 - alpha) * (latestForecast.level + latestForecast.trend);

      let trend =
        beta * (level - latestForecast.level) +
        (1 - beta) * latestForecast.trend;

      bufferForecast.push({
        i: i,
        period: data.period,
        alpha: alpha,
        beta: beta,
        qty: data.qty,
        level: level,
        trend: trend,
        forecast: latestForecast.level + latestForecast.trend,
        result: Math.round(latestForecast.level + latestForecast.trend),
        mad: Math.abs(data.qty - (latestForecast.level + latestForecast.trend)),
        mse: Math.pow(
          data.qty - (latestForecast.level + latestForecast.trend),
          2
        ),
        mape: Math.abs(
          ((data.qty - (latestForecast.level + latestForecast.trend)) /
            data.qty) *
            100
        ),
      });
    }
  });

  let predict = Object.values(bufferForecast)[
    Object.keys(bufferForecast).length - 1
  ];
  let nextForecast = {
    i: predict.i + 1,
    period: parseInt(predict.period) + 1,
    forecast: predict.level + predict.trend,
    result: Math.round(predict.level + predict.trend),
  };

  bufferForecast.push(nextForecast);

  return bufferForecast;
};

const DESHolt = (dataset, alpha = null, beta = null) => {
  if (alpha === null && beta === null) {
    return holtNoParams(dataset);
  } else {
    return holtWithParams(dataset, alpha, beta);
  }
};

export default DESHolt;
