import { comida } from "../src/comidaServices/comida.js";

const test = {
    peso: 70,
    idade: 17,
    altura: 1.90,
    atividade: 2
}

console.log(new comida("homem", test).calcularComida())