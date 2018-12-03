export function parseStringPoints(points) {
  if(typeof points === 'string' && points !== '') {
    const p = points.split(',');
    const len = p.length;
    if(len < 4 || len % 2) {
      throw new Error('Invalid points data.');
    }
    const ret = [];
    for(let i = 0; i < len; i += 2) {
      ret.push([Number(p[i].trim()), Number(p[i + 1].trim())]);
    }
    return ret;
  }
  return points;
}

export function smoothCurve(points) {
  points = points.map(([x, y]) => ({x, y}));

  /**
   * 获取 模拟贝塞尔曲线关键控制点
   * @param {*} i
   * @param {*} a
   * @param {*} b
   */
  function getCtrlPoint(i, a = 0.1, b = 0.1) {
    let x0;
    let y0;
    let x1;
    let y1;

    if(points[i].x === points[i + 1].x || points[i].y === points[i + 1].y) {
      a = 0;
      b = 0;
    }

    if(i < 1) {
      x0 = points[0].x + (points[1].x - points[0].x) * a;
      y0 = points[0].y + (points[1].y - points[0].y) * a;
    } else {
      x0 = points[i].x + (points[i + 1].x - points[i - 1].x) * a;
      y0 = points[i].y + (points[i + 1].y - points[i - 1].y) * a;
    }

    if(i > points.length - 3) {
      const last = points.length - 1;
      x1 = points[last].x - (points[last].x - points[last - 1].x) * b;
      y1 = points[last].y - (points[last].y - points[last - 1].y) * b;
    } else {
      x1 = points[i + 1].x - (points[i + 2].x - points[i].x) * b;
      y1 = points[i + 1].y - (points[i + 2].y - points[i].y) * b;
    }

    return [{x: x0, y: y0}, {x: x1, y: y1}];
  }

  let ret = '';
  points.forEach((point, i) => {
    if(i === 0) {
      ret += `M${point.x},${point.y}`;
    } else {
      const [A, B] = getCtrlPoint(i - 1);
      ret += `C${A.x},${A.y},${B.x},${B.y},${point.x},${point.y}`;
    }
  });

  return ret;
}
