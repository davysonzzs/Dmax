import { agua } from "../src/aguaServices/agua.js";

const objTest = {
    peso: 50,
    altura: 1.90,
    problemas: [10, 0]
}

console.log(new agua(12, 2, objTest.problemas, 1, objTest).calculoDeLitrosDeAgua())