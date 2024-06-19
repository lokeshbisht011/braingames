import { initGame } from './game.js'

const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext('2d');

initGame(canvas, ctx);