export class common{
    constructor(kg, m){
        this.kg = kg,
        this.m = m
    }

    imcEAjuste(){
        if(typeof this.kg !== "number" || typeof this.m !== "number" || this.kg !== this.kg || this.m !== this.m || this.m <= 0 || this.kg <= 0) return null
        let imc = this.kg / (this.m**2)
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
}