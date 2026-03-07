const video = document.getElementById("video");
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let desenhando = false;
let ultimoX = 0;
let ultimoY = 0;

let objeto = {
  x: 300,
  y: 300,
  tamanho: 50,
};

navigator.mediaDevices.getUserMedia({ video: true }).then((stream) => {
  video.srcObject = stream;
});

const hands = new Hands({
  locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`,
});

hands.setOptions({
  maxNumHands: 1,
  modelComplexity: 1,
  minDetectionConfidence: 0.7,
  minTrackingConfidence: 0.7,
});

hands.onResults((results) => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  if (results.multiHandLandmarks) {
    let mao = results.multiHandLandmarks[0];

    let indicador = mao[8];
    let polegar = mao[4];
    let medio = mao[12];

    let x = indicador.x * canvas.width;
    let y = indicador.y * canvas.height;

    let dx = indicador.x - polegar.x;
    let dy = indicador.y - polegar.y;

    let distancia = Math.sqrt(dx * dx + dy * dy);

    // gesto pinça
    if (distancia < 0.05) {
      document.getElementById("gesture").innerText = "Desenhando";

      if (!desenhando) {
        desenhando = true;
        ultimoX = x;
        ultimoY = y;
      }

      ctx.beginPath();
      ctx.moveTo(ultimoX, ultimoY);
      ctx.lineTo(x, y);
      ctx.strokeStyle = "cyan";
      ctx.lineWidth = 5;
      ctx.stroke();

      ultimoX = x;
      ultimoY = y;
    }

    // dois dedos mover objeto
    else if (medio.y < indicador.y) {
      document.getElementById("gesture").innerText = "Movendo objeto";

      objeto.x = x;
      objeto.y = y;

      desenhando = false;
    } else {
      document.getElementById("gesture").innerText = "Cursor";

      desenhando = false;
    }
  }

  ctx.fillStyle = "orange";

  ctx.beginPath();

  ctx.arc(objeto.x, objeto.y, objeto.tamanho, 0, Math.PI * 2);

  ctx.fill();
});

const camera = new Camera(video, {
  onFrame: async () => {
    await hands.send({ image: video });
  },
  width: 640,
  height: 480,
});

camera.start();
