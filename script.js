const video = document.getElementById("video");
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let desenhando = false;
let lastX = 0;
let lastY = 0;

function limpar() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}

navigator.mediaDevices
  .getUserMedia({
    video: {
      facingMode: "environment",
    },
  })
  .then((stream) => {
    video.srcObject = stream;
  });

const hands = new Hands({
  locateFile: (file) => {
    return `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`;
  },
});

hands.setOptions({
  maxNumHands: 1,
  modelComplexity: 0,
  minDetectionConfidence: 0.7,
  minTrackingConfidence: 0.7,
});

hands.onResults((results) => {
  if (results.multiHandLandmarks) {
    let mao = results.multiHandLandmarks[0];

    let indicador = mao[8];
    let polegar = mao[4];

    let x = indicador.x * canvas.width;
    let y = indicador.y * canvas.height;

    let dx = indicador.x - polegar.x;
    let dy = indicador.y - polegar.y;

    let distancia = Math.sqrt(dx * dx + dy * dy);

    if (distancia < 0.05) {
      if (!desenhando) {
        desenhando = true;
        lastX = x;
        lastY = y;
      }

      ctx.beginPath();
      ctx.moveTo(lastX, lastY);
      ctx.lineTo(x, y);

      ctx.strokeStyle = "cyan";
      ctx.lineWidth = 5;
      ctx.stroke();

      lastX = x;
      lastY = y;
    } else {
      desenhando = false;
    }
  }
});

async function detectar() {
  await hands.send({ image: video });

  requestAnimationFrame(detectar);
}

video.onloadeddata = () => {
  detectar();
};
