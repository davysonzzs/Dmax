export class tempoAgua{
    constructor(litrosTotal, litrosJaConsumidos, horaAcorda, horaQueDorme){
        this.litrosTotal = litrosTotal,
        this.litrosJaConsumidos = litrosJaConsumidos,
        this.horaAcorda = horaAcorda,
        this.horaQueDorme = horaQueDorme
    }

    contagem() {
    let litrosRestantes =  this.litrosTotal -  this.litrosJaConsumidos
    const horasParaBeber = []

    if (litrosRestantes <= 0) {
        console.log("Você já consumiu os litros necessários ou mais! Parabéns!")
        return "Você já consumiu os litros necessários ou mais!"
    }

    if ( this.horaQueDorme <=  this.horaAcorda) {
        console.log("Erro: A hora de dormir deve ser depois da hora de acordar.")
        return "Erro: Hora de dormir inválida."
    }

    for (let horaAtual =  this.horaAcorda; horaAtual <  this.horaQueDorme; horaAtual += 2) {
        horasParaBeber.push(horaAtual)
    }

    if (horasParaBeber.length === 0) {
        console.log("Não há horários definidos para beber entre a hora de acordar e dormir.")
        return "Não há horários definidos para beber."
    }

    let intervalId
    let vezes = 0
    const mensagemBeber = () => {
        if (horasParaBeber.length === 0 || litrosRestantes <= 0) {
            clearInterval(intervalId)
            console.log("Contagem de consumo de água finalizada!")
            if (litrosRestantes <= 0) {
                console.log("Parabéns! Você atingiu ou excedeu sua meta diária de hidratação.")
            } else {
                 console.log(`Faltaram ${litrosRestantes.toFixed(0)} mL para a meta. Finalizado por falta de horários.`)
            }
            return
        }
        const mlParaBeberAgora = litrosRestantes / horasParaBeber.length
        console.log(`Consuma ${(mlParaBeberAgora * 1000).toFixed(0)} mL de água.`)
        litrosRestantes -= mlParaBeberAgora
        horasParaBeber.shift()
        vezes++
    }
    mensagemBeber()
    intervalId = setInterval(mensagemBeber, 7200000)
    return intervalId
    }
}