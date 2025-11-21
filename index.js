const prompt = require("prompt-sync")()

const login = { nome: "", genero: "", senha: "" }
let medidaspessoas = { peso: 0, altura: 0, idade: 0, atividade: 0, problemas: [0, 0] }
let clima = 0
const baseDeCalculoPorIdade = [40, 35, 30, 25]

function imcEAjuste(kg, m){
    if(typeof kg !== "number" || typeof m !== "number" || kg !== kg || m !== m || m <= 0 || kg <= 0) return null
    let imc = kg / (m**2)
    let ajuste = 0
    let msg
    if(imc < 18.5 && imc > 0){
        ajuste = 10
        msg = "Voce esta abaixo do peso ideal"
        return [imc, ajuste, msg]
    } else if(imc >= 18.5 && imc <= 24.9){
        ajuste = 0
        msg = "Voce esta no peso ideal"
        return [imc, ajuste, msg]
    } else if(imc >= 25 && imc <= 29.9){
        ajuste = 5
        msg = "Voce esta sobre-peso, acima do peso ideal"
        return [imc, ajuste, msg]
    } else if(imc >= 30){
        ajuste = 10
        msg = "Voce esta Obeso! Alarmante"
        return [imc, ajuste, msg]
    } else {
        return null
    }
}

function calculoDeLitrosDeAgua(idade, atividade, problemas, clima){
    let imcjuste = imcEAjuste(medidaspessoas.peso, medidaspessoas.altura)
    let ajudeDeIdade = 0
    if(idade >= 1 && idade <= 17){
        ajudeDeIdade = baseDeCalculoPorIdade[0]
    } else if(idade > 17 && idade <= 55){
        ajudeDeIdade = baseDeCalculoPorIdade[1]
    } else if(idade > 55 && idade <= 65){
        ajudeDeIdade = baseDeCalculoPorIdade[2]
    } else if(idade > 65){
        ajudeDeIdade = baseDeCalculoPorIdade[3]
    } else {
        ajudeDeIdade = 0
    }
    const ajusteImc = (imcjuste && typeof imcjuste[1] === "number") ? imcjuste[1] : 0
    let litros = (medidaspessoas.peso * ajudeDeIdade) / 1000
    litros += (litros * ajusteImc) / 100
    switch(atividade){
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
    switch(clima){
        case 1:
            litros -= (litros * 10) / 100
            break
        case 2:
            litros += (litros * 15) / 100
            break
        default:
            litros += 0
    }
    const p0 = problemas[0] || 0
    const p1 = problemas[1] || 0
    litros -= litros * (p0 + p1) / 100
    return litros
}

function calcularComida(genero, peso, idade, altura, atividade){
    let tmb = 0
    if(genero === "homem"){
        tmb = (10 * peso) + (6.25 * (altura * 100)) - (5 * idade) + 5
    } else if(genero === "mulher"){
        tmb = (10 * peso) + (6.25 * (altura * 100)) - (5 * idade) - 161
    } else {
        tmb = 0
    }
    let multiplicadorDeAtividade = 0
    switch(atividade){
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
    let imc = imcEAjuste(medidaspessoas.peso, medidaspessoas.altura)
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
function contagem(litrosTotal, litrosJaConsumidos, horaAcorda, horaQueDorme) {
    let litrosRestantes = litrosTotal - litrosJaConsumidos
    const horasParaBeber = []

    if (litrosRestantes <= 0) {
        console.log("Você já consumiu os litros necessários ou mais! Parabéns!")
        return "Você já consumiu os litros necessários ou mais!"
    }

    if (horaQueDorme <= horaAcorda) {
        console.log("Erro: A hora de dormir deve ser depois da hora de acordar.")
        return "Erro: Hora de dormir inválida."
    }

    for (let horaAtual = horaAcorda; horaAtual < horaQueDorme; horaAtual += 2) {
        horasParaBeber.push(horaAtual)
    }

    if (horasParaBeber.length === 0) {
        console.log("Não há horários definidos para beber entre a hora de acordar e dormir.")
        return "Não há horários definidos para beber."
    }
    let intervalId
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
        console.log(`Consuma ${mlParaBeberAgora.toFixed(0)} mL de água.`)
        litrosRestantes -= mlParaBeberAgora
        horasParaBeber.shift()
    }
    mensagemBeber()
    intervalId = setInterval(mensagemBeber, 7200000)
    return intervalId
}

console.log("ligando...")
console.log("Olá, eu sou Dmax! seu assistente virtual de saúde!")
console.log("eu irei supervisionar sua alimentação e controlar seu consumo de água")

do{
    login.nome = prompt("para começar diga seu nome: ")
    login.genero = prompt("Qual seu genero biologico? (homem/mulher) ").toLowerCase()
    login.senha = prompt("digite uma senha: ")
    if(login.nome === "" && login.senha === "" && login.genero === ""){
        console.log("porfavor digite algo!")
    } else if(login.nome === ""){
        console.log("porfavor digite seu nome!")
    } else if(login.senha === ""){
        console.log("digite uma senha!")
    } else if(login.genero === ""){
        console.log("digite um genero valido! homem ou mulher")
    } else if(login.nome !== "" && login.senha !== "" && login.genero !== ""){
        console.log("cadastro bem sucedido!")
        console.log("agora preciso de alguns dados!")
        console.log("com esses dados, irei planejar sua alimentação e consumo de água")
        console.log(`então ${login.nome}, preciso de sinceridade! vamos começar`)
        medidaspessoas.peso = 0
        medidaspessoas.altura = 0
        medidaspessoas.idade = 0
        let validMedidas = false
        do{
            medidaspessoas.peso = parseFloat(prompt("qual seu peso atual (Ex: 70 ou 70.1): "))
            medidaspessoas.altura = parseFloat(prompt("qual sua altura atualmente (Ex: 1.70): "))
            medidaspessoas.idade = parseInt(prompt("qual sua idade atual (Ex: 17): "))
            if(typeof medidaspessoas.peso !== "number" || medidaspessoas.peso !== medidaspessoas.peso){
                console.log("digite um peso valido")
            } else if(typeof medidaspessoas.altura !== "number" || medidaspessoas.altura !== medidaspessoas.altura){
                console.log("digite uma altura valida")
            } else if(typeof medidaspessoas.idade !== "number" || medidaspessoas.idade !== medidaspessoas.idade){
                console.log("digite uma idade valida!")
            } else {
                let testeImc = imcEAjuste(medidaspessoas.peso, medidaspessoas.altura)
                if(testeImc === null){
                    console.log("valores invalidos para peso/altura, tente novamente")
                } else {
                    validMedidas = true
                }
            }
        } while(!validMedidas)
        medidaspessoas.atividade = 0
        medidaspessoas.problemas = [0, 0]
        clima = 0
        let validRotina = false
        do{
            medidaspessoas.atividade = parseInt(prompt("Qual seu nivel de atividade fisica? (1-sendentario, 2-moderado, 3-inteso) "))
            let problemaCardiaco = prompt("Voce tem algum problema cardiaco? S/N ").toLowerCase() == "s" ? 10 : 0
            let problemaRins = prompt("Voce tem algum problema renal? S/N ").toLowerCase() == "s" ? 10 : 0
            medidaspessoas.problemas = [problemaCardiaco, problemaRins]
            clima = parseInt(prompt("qual o clima ultimamente? (1 - frio/nublado, 2 - quente/verao) "))
            if(typeof medidaspessoas.atividade !== "number" || medidaspessoas.atividade !== medidaspessoas.atividade || typeof clima !== "number" || clima !== clima){
                console.log("digite um nivel valido!")
            } else {
                validRotina = true
            }
        } while(!validRotina)
        let imc = imcEAjuste(medidaspessoas.peso, medidaspessoas.altura)
        let agua = calculoDeLitrosDeAgua(medidaspessoas.idade, medidaspessoas.atividade, medidaspessoas.problemas, clima)
        let comida = calcularComida(login.genero, medidaspessoas.peso, medidaspessoas.idade, medidaspessoas.altura, medidaspessoas.atividade)
        console.log(`
            Relatorio da consulta!
            seu imc estar: ${imc[0].toFixed(1)}
            ${imc[2]}
            litros de agua para consumo: ${agua.toFixed(1)}L por dia
            calorias para consumo: ${comida[0].toFixed(0)}Kcal diarias
            Macros diarios:
            carboitrados: ${(comida[1].carbo).toFixed(0)} por dia
            proteinas: ${(comida[1].proteinas).toFixed(0)} por dia
            gorduras: ${(comida[1].gordura).toFixed(0)} por dia
            fibras: ${comida[1].fibras} por dia
            `)
        console.log("Agora com esse dados, eu consigo te auxiliar na sua jornada!!")
        let sairDoMenu = false
        while(!sairDoMenu){
            console.log(`
                Ola ${login.nome}
                bem-vindo ao nosso menu!
                1 - iniciar contagem
                2 - revisar dados
                3 - refazer consulta
                4 - sair
                `)
            let escolha = 0
            do{
                escolha = parseInt(prompt("O que deseja fazer agora? "))
                if(typeof escolha !== "number" || escolha !== escolha || escolha == 0){
                    console.log("digite algo valido!")
                }
            }while(typeof escolha !== "number" || escolha !== escolha || escolha == 0)
            switch(escolha){
                case 1:
                    let bebido = 0
                    let horaAcorda = 0
                    let horaDorme = 0
                    do{
                        bebido = parseFloat(prompt("Voce ja bebeu quantos ML hoje? (digite 0 se Nao tiver bebido nada)"))
                        horaAcorda = parseInt(prompt("Que hora voce acorda? (EX: 8"))
                        horaDorme = parseInt(prompt("Hora que voce dorme? (EX: 22)"))
                    }while(typeof bebido !== "number" || bebido !== bebido || typeof horaAcorda !== 'number' || horaAcorda !== horaAcorda || typeof horaDorme !== "number" || horaDorme !== horaDorme)
                    contagem(agua, bebido, horaAcorda, horaDorme) 
                    break
                case 2:
                    let sair = 0
                    while(sair !== 1){
                        console.log(`
                            Relatorio da consulta!
                            seu imc estar: ${imc[0].toFixed(1)}
                            ${imc[2]}
                            litros de agua para consumo: ${agua.toFixed(1)}L por dia
                            calorias para consumo: ${comida[0].toFixed(0)}Kcal diarias
                            Macros diarios:
                            carboitrados: ${(comida[1].carbo).toFixed(0)} por dia
                            proteinas: ${(comida[1].proteinas).toFixed(0)} por dia
                            gorduras: ${(comida[1].gordura).toFixed(0)} por dia
                            fibras: ${comida[1].fibras} por dia
                            `)
                        do{
                            sair = parseInt(prompt("para sair digite 1: "))
                            if(typeof sair !== "number" || sair !== sair){
                                console.log("digite algo valido!")
                            }
                        }while(typeof sair !== "number" || sair !== sair)
                    }
                    break
                case 3:
                    clima = 0
                    medidaspessoas.peso = 0
                    medidaspessoas.idade = 0
                    medidaspessoas.atividade = 0
                    medidaspessoas.altura = 0
                    medidaspessoas.problemas = [0, 0]
                    validMedidas = false
                    do{
                        medidaspessoas.peso = parseFloat(prompt("qual seu peso atual (Ex: 70 ou 70.1): "))
                        medidaspessoas.altura = parseFloat(prompt("qual sua altura atualmente (Ex: 1.70): "))
                        medidaspessoas.idade = parseInt(prompt("qual sua idade atual (Ex: 17): "))
                        if(typeof medidaspessoas.peso !== "number" || medidaspessoas.peso !== medidaspessoas.peso){
                            console.log("digite um peso valido")
                        } else if(typeof medidaspessoas.altura !== "number" || medidaspessoas.altura !== medidaspessoas.altura){
                            console.log("digite uma altura valida")
                        } else if(typeof medidaspessoas.idade !== "number" || medidaspessoas.idade !== medidaspessoas.idade){
                            console.log("digite uma idade valida!")
                        } else {
                            let testeImc = imcEAjuste(medidaspessoas.peso, medidaspessoas.altura)
                            if(testeImc === null){
                                console.log("valores invalidos para peso/altura, tente novamente")
                            } else {
                                validMedidas = true
                            }
                        }
                    } while(!validMedidas)
                    validRotina = false
                    do{
                        medidaspessoas.atividade = parseInt(prompt("Qual seu nivel de atividade fisica? (1-sendentario, 2-moderado, 3-inteso) "))
                        let problemaCardiaco = prompt("Voce tem algum problema cardiaco? S/N ").toLowerCase() == "s" ? 10 : 0
                        let problemaRins = prompt("Voce tem algum problema renal? S/N ").toLowerCase() == "s" ? 10 : 0
                        medidaspessoas.problemas = [problemaCardiaco, problemaRins]
                        clima = parseInt(prompt("qual o clima ultimamente? (1 - frio/nublado, 2 - quente/verao) "))
                        if(typeof medidaspessoas.atividade !== "number" || medidaspessoas.atividade !== medidaspessoas.atividade || typeof clima !== "number" || clima !== clima){
                            console.log("digite um nivel valido!")
                        } else {
                            validRotina = true
                        }
                    } while(!validRotina)
                    imc = imcEAjuste(medidaspessoas.peso, medidaspessoas.altura)
                    agua = calculoDeLitrosDeAgua(medidaspessoas.idade, medidaspessoas.atividade, medidaspessoas.problemas, clima)
                    comida = calcularComida(login.genero, medidaspessoas.peso, medidaspessoas.idade, medidaspessoas.altura, medidaspessoas.atividade)
                    break
                case 4:
                    sairDoMenu = true
            }
        }
    }
}while(login.nome === "" || login.senha === "" || login.genero === "")
console.log("desligando...")
