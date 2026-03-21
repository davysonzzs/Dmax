import { common } from "../common.js"

export class agua extends common {
    baseDeCalculoPorIdade = [40, 35, 30, 25]

    constructor(idade, atividade, problemas, clima, medidaspessoas){
        super(),
        this.idade = idade,
        this.atividade = atividade,
        this.problemas = problemas,
        this.clima = clima,
        this.medidaspessoas = medidaspessoas
    }

    calculoDeLitrosDeAgua(){
    let imcjuste = new common(this.medidaspessoas.peso, this.medidaspessoas.altura).imcEAjuste()
    let ajudeDeIdade = 0
    if(this.idade >= 1 && this.idade <= 17){
        ajudeDeIdade = this.baseDeCalculoPorIdade[0]
    } else if(this.idade > 17 && this.idade <= 55){
        ajudeDeIdade = this.baseDeCalculoPorIdade[1]
    } else if(this.idade > 55 && this.idade <= 65){
        ajudeDeIdade = this.baseDeCalculoPorIdade[2]
    } else if(this.idade > 65){
        ajudeDeIdade = this.baseDeCalculoPorIdade[3]
    } else {
        ajudeDeIdade = 0
    }
    const ajusteImc = (imcjuste && typeof imcjuste[1] === "number") ? imcjuste[1] : 0
    let litros = (this.medidaspessoas.peso * ajudeDeIdade) / 1000
    litros += (litros * ajusteImc) / 100
    switch(this.atividade){
        case 1:
            litros += 0
            break
        case 2:
            litros += (litros * 10) / 100
            break
        case 3:
            litros += (litros * 10) / 100
            break
        default:
            litros += 0
    }
    switch(this.clima){
        case 1:
            litros -= (litros * 10) / 100
            break
        case 2:
            litros += (litros * 15) / 100
            break
        default:
            litros += 0
    }
    const p0 = this.medidaspessoas.problemas[0] || 0
    const p1 = this.medidaspessoas.problemas[1] || 0
    litros -= litros * (p0 + p1) / 100
    return litros
}
}