import { common } from "../common.js"

export class comida extends common{
    constructor(genero, medidaspessoas){
        super(),
        this.genero = genero,
        this.medidaspessoas = medidaspessoas
    }

    calcularComida(){
    let tmb = 0
    if(this.genero === "homem"){
        tmb = (10 * this.medidaspessoas.peso) + (6.25 * (this.medidaspessoas.altura * 100)) - (5 * this.medidaspessoas.idade) + 5
    } else if(this.genero === "mulher"){
        tmb = (10 * this.medidaspessoas.peso) + (6.25 * (this.medidaspessoas.altura * 100)) - (5 * this.medidaspessoas.idade) - 161
    } else {
        tmb = 0
    }
    let multiplicadorDeAtividade = 0
    switch(this.medidaspessoas.atividade){
        case 1:
            multiplicadorDeAtividade = 1.2
            break
        case 2:
            multiplicadorDeAtividade = 1.55
            break
        case 3:
            multiplicadorDeAtividade = 1.725
            break
        default:
            multiplicadorDeAtividade = 0
    }
    let tdee = tmb * multiplicadorDeAtividade
    let imc = new common(this.medidaspessoas.peso, this.medidaspessoas.altura).imcEAjuste()
    let calorias = 0
    if(imc && typeof imc[0] === "number"){
        if(imc[0] < 18.5 && imc[0] > 0){
            calorias = tdee * 1.15
        } else if(imc[0] >= 18.5 && imc[0] <= 24.9){
            calorias = tdee * 1
        } else if(imc[0] >= 25 && imc[0] <= 29.9){
            calorias = tdee * 0.85
        } else {
            calorias = tdee
        }
    } else {
        calorias = tdee
    }
    const macros = {
        carbo: calorias * 0.45,
        proteinas: calorias * 0.30,
        gordura: calorias * 0.25,
        fibras: 25
    }
    return [calorias, macros]
}
}
