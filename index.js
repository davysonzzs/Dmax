import { common } from "./src/common.js"
import { comida } from "./src/comidaServices/comida.js"
import { agua } from "./src/aguaServices/agua.js"
import { tempoAgua } from "./src/tempoServices/tempoAgua.js"
import PromptSync from "prompt-sync"
const prompt = PromptSync()

const login = { nome: "", genero: "", senha: "" }
let medidaspessoas = { peso: 0, altura: 0, idade: 0, atividade: 0, problemas: [0, 0] }
let clima = 0


console.clear()
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
        console.clear()
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
                let testeImc = new common(medidaspessoas.peso, medidaspessoas.altura).imcEAjuste()
                if(testeImc === null){
                    console.log("valores invalidos para peso/altura, tente novamente")
                } else {
                    validMedidas = true
                }
            }
        } while(!validMedidas)
        console.clear()
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
        console.clear()
        let imc = new common(medidaspessoas.peso, medidaspessoas.altura).imcEAjuste()
        let aguaFormatada = new agua(medidaspessoas.idade, medidaspessoas.atividade, medidaspessoas.problemas, clima, medidaspessoas).calculoDeLitrosDeAgua()
        let comidaFormatada = new comida(login.genero, medidaspessoas).calcularComida()
        console.log(`
            Relatorio da consulta!
            seu imc estar: ${imc[0].toFixed(1)}
            ${imc[2]}
            litros de agua para consumo: ${aguaFormatada.toFixed(1)}L por dia
            calorias para consumo: ${comidaFormatada[0].toFixed(0)}Kcal diarias
            Macros diarios:
            carboitrados: ${(comidaFormatada[1].carbo).toFixed(0)} por dia
            proteinas: ${(comidaFormatada[1].proteinas).toFixed(0)} por dia
            gorduras: ${(comidaFormatada[1].gordura).toFixed(0)} por dia
            fibras: ${comidaFormatada[1].fibras} por dia
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
                    new tempoAgua(aguaFormatada, bebido, horaAcorda, horaDorme)
                    break
                case 2:
                    let sair = 0
                    while(sair !== 1){
                        console.log(`
                            Relatorio da consulta!
                            seu imc estar: ${imc[0].toFixed(1)}
                            ${imc[2]}
                            litros de agua para consumo: ${aguaFormatada.toFixed(1)}L por dia
                            calorias para consumo: ${comidaFormatada[0].toFixed(0)}Kcal diarias
                            Macros diarios:
                            carboitrados: ${(comidaFormatada[1].carbo).toFixed(0)} por dia
                            proteinas: ${(comidaFormatada[1].proteinas).toFixed(0)} por dia
                            gorduras: ${(comidaFormatada[1].gordura).toFixed(0)} por dia
                            fibras: ${comidaFormatada[1].fibras} por dia
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
                            let testeImc = new common(medidaspessoas.peso, medidaspessoas.altura).imcEAjuste()
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
                    imc = new common(medidaspessoas.peso, medidaspessoas.altura).imcEAjuste()
                    aguaFormatada = new agua(medidaspessoas.idade, medidaspessoas.atividade, medidaspessoas.problemas, clima, medidaspessoas).calculoDeLitrosDeAgua()
                    comidaFormatada = new comida(login.genero, medidaspessoas).calcularComida()
                    break
                case 4:
                    sairDoMenu = true
            }
        }
    }
}while(login.nome === "" || login.senha === "" || login.genero === "")
console.log("desligando...")
