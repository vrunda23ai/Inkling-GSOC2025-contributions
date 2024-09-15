export type Draw = {
    ctx: CanvasRenderingContext2D;
    currentPoint: Point;
    prevPoint : null | Point;
}

export type Point = {
    x:number;
    y:number;
}

function onDraw({ctx, currentPoint, prevPoint}:Draw){
    const { x:currX, y:currY } = currentPoint;
    const lineColor = '#ffff';
    const lineWidth = 5;

    const startPoint = prevPoint ?? currentPoint;
    ctx.beginPath();
    ctx.lineWidth = lineWidth;
    ctx.strokeStyle = lineColor;
    ctx.moveTo(startPoint.x , startPoint.y);
    ctx.lineTo(currX, currY);
    ctx.stroke();

    ctx.fillStyle = lineColor;
    ctx.beginPath();
    ctx.arc(startPoint.x, startPoint.y, 2, 0, 2*Math.PI);
    ctx.fill();
  }

export {
    onDraw
}
