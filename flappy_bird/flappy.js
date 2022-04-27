function novoElemento(tagName, className) {
    const elem = document.createElement(tagName) // cria um elemento de acordo com sua tag
    elem.className = className // atribui uma determinada classe a esse elemento
    return elem
}

function Barreira(reversa = false) {
    this.elemento = novoElemento('div', 'barreira') // cria um elemento (div) com a classe = "barreira"

    const borda = novoElemento('div', 'borda') // cria um elemento com a classe = "borda"
    const corpo = novoElemento('div', 'corpo') // cria um elemento com a classe = "corpo"
    this.elemento.appendChild(reversa ? corpo : borda)
    this.elemento.appendChild(reversa ? borda : corpo)

    this.setAltura = altura => corpo.style.height = `${altura}px` // define altura do corpo do elemento
}

function ParDeBarreiras(altura, abertura, x) {
    this.elemento = novoElemento('div', 'par-de-barreiras') // cria um elemento (div) com a classe = "par-de-barreiras"

    this.superior = new Barreira(true)
    this.inferior = new Barreira(false)

    this.elemento.appendChild(this.superior.elemento) // coloca elemento .barreira dentro do elemento .par-de-barrreiras
    this.elemento.appendChild(this.inferior.elemento)

    this.sortearAbertura = () => {
        const alturaSuperior = Math.random() * (altura - abertura) // sorteia tamanho do corpo superior
        const alturaInferior = altura - abertura - alturaSuperior
        this.superior.setAltura(alturaSuperior) // atribui o tamanho do corpo superior
        this.inferior.setAltura(alturaInferior)
    }

    this.getX = () => parseInt(this.elemento.style.left.split('px')[0]) // pega posição em px em relação a left
    this.setX = x => this.elemento.style.left = `${x}px` // define distancia em relação a left
    this.getLargura = () => this.elemento.clientWidth // pega a largura da div .par-de-obstaculos

    this.sortearAbertura() // sorteia a posição da abertura
    this.setX(x)
}

function Barreiras(altura, largura, abertura, espaco, notificarPonto) {
    this.pares = [
        new ParDeBarreiras(altura, abertura, largura),
        new ParDeBarreiras(altura, abertura, largura + espaco),
        new ParDeBarreiras(altura, abertura, largura + espaco * 2), // aqui estamos criando 4 pares barreiras
        new ParDeBarreiras(altura, abertura, largura + espaco * 3)
    ]

    const deslocamento = 3 // quantos pixels serão deslocados por vez
    this.animar = () => { // método animar vai estar em loop...
        this.pares.forEach(par => {
            par.setX(par.getX() - deslocamento) // atribui posição de "x", ou seja, em relação a left

            // quando o elemento sair da área do jogo
            if (par.getX() < -par.getLargura()) {
                par.setX(par.getX() + espaco * this.pares.length) // Coloca o elemento no final novamente
                par.sortearAbertura() // sorteia nova posição abertura
            }

            const meio = (largura / 2) - 130
            const cruzouOMeio = par.getX() + deslocamento >= meio
                && par.getX() < meio
            if (cruzouOMeio) notificarPonto()
        })
    }
}

function Passaro(alturaJogo) {
    let voando = false

    this.elemento = novoElemento('img', 'passaro') // cria uma tag img
    this.elemento.setAttribute('src', 'imgs/passaro.png') // tag img recebe src

    this.getY = () => parseInt(this.elemento.style.bottom.split('px')[0]) // pega posição Y em relaçao a bottom 
    this.setY = y => this.elemento.style.bottom = `${y}px` // define distância em relação a bottom

    window.onkeydown = e => voando = true // quando um botão é pressionado
    window.onkeyup = e => voando = false

    this.animar = () => {
        const novoY = this.getY() + (voando ? 8 : -5) // pega nova posição de Y
        const alturaMaxima = alturaJogo - this.elemento.clientHeight // define sltura máxima do jogo

        if (novoY <= 0) {
            this.setY(0)
        } else if (novoY >= alturaMaxima) {
            this.setY(alturaMaxima)
        } else {
            this.setY(novoY)
        }
    }

    this.setY(alturaJogo / 2)
}

function estaoSobrepostos(elementoA, elementoB) {
    const a = elementoA.getBoundingClientRect() // pega o quadrado que compõe o elemento
    const b = elementoB.getBoundingClientRect()

    const horizontal = a.left + a.width >= b.left // testa se colide na horizontal
        && b.left + b.width >= a.left
    const vertical = a.top + a.height >= b.top // testa se colide na vertical
        && b.top + b.height >= a.top
    return horizontal && vertical // retorna true se colidiu na vertical e horizontal
}

function colidiu(passaro, barreiras) {
    let colidiu = false
    barreiras.pares.forEach(parDeBarreiras => {
        if (!colidiu) {
            const superior = parDeBarreiras.superior.elemento
            const inferior = parDeBarreiras.inferior.elemento
            colidiu = estaoSobrepostos(passaro.elemento, superior)
                || estaoSobrepostos(passaro.elemento, inferior)
        }
    })
    return colidiu
}

function Progresso() {
    this.elemento = novoElemento('span', 'progresso')
    this.atualizarPontos = pontos => {
        this.elemento.innerHTML = pontos
    }
    this.atualizarPontos(0)
}

function Reiniciar(areaDoJogo, altura, largura) {
    this.elemento = novoElemento('button', 'reiniciar')
    this.elemento.style.cursor = 'pointer'
    elemento.innerHTML = 'Reiniciar'
    areaDoJogo.appendChild(elemento)

    const button = document.querySelector('.reiniciar')
    button.style.left = `${(largura / 2) - (button.clientWidth / 2)}px`
    button.style.top = `${(altura / 2) - (button.clientHeight / 2)}px`
    button.onclick = _ => window.location.reload()
}

function TelaInicial(passaro, barreiras, areaDoJogo, altura, largura){
    this.elemento = novoElemento('div', 'telaInicial')
    this.elemento.innerHTML = 'Pronto para comecar? :)'
    
    const botaoIniciar = novoElemento('button', 'iniciar')
    botaoIniciar.innerHTML = 'Iniciar'
    this.elemento.appendChild(botaoIniciar)
    areaDoJogo.appendChild(this.elemento)

    botaoIniciar.onclick = _ => {
        this.elemento.parentNode.removeChild(this.elemento)
        StartGame(passaro, barreiras, areaDoJogo, altura, largura) // chama startGame ao clicar em iniciar
    }
}

function StartGame(passaro, barreiras, areaDoJogo, altura, largura){ // inicia o jogo com o setInterval
    this.temporizador = setInterval(() => {
        barreiras.animar()
        passaro.animar()

        if (colidiu(passaro, barreiras)) {
            clearInterval(temporizador)
            Reiniciar(areaDoJogo, altura, largura)
        }
    }, 20)
}

function flappyBird() { // chama a instancia das funções construtoras e inicia o layout do jogo
    let pontos = 0

    const areaDoJogo = document.querySelector('[wm-flappy]')
    const altura = areaDoJogo.clientHeight // altura de [wm-flappy] -> 520
    const largura = areaDoJogo.clientWidth // largura de [wm-flappy] -> 1200

    const progresso = new Progresso()
    const barreiras = new Barreiras(altura, largura, 200, 400,
        () => progresso.atualizarPontos(++pontos))
    const passaro = new Passaro(altura)
    const telaInicial = new TelaInicial(passaro, barreiras, areaDoJogo, altura, largura)
    
    areaDoJogo.appendChild(telaInicial.elemento)
    areaDoJogo.appendChild(progresso.elemento)
    areaDoJogo.appendChild(passaro.elemento)
    barreiras.pares.forEach(par => areaDoJogo.appendChild(par.elemento))
}

flappyBird()