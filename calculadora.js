let display = document.getElementById('display');
let operadorAtual = null;
let primeiroNumero = null;

function inserirNumero(numero) {
    if (display.value === '0' || display.value === null) {
        display.value = numero;
    } else {
        display.value += numero;
    }
}

function inserirOperador(operador) {
    if (primeiroNumero !== null) {
        calcular();
    }
    primeiroNumero = parseFloat(display.value);
    operadorAtual = operador;
    display.value = '0';
}

function inserirDecimal(decimal) {
    if (!display.value.includes('.')) {
        display.value += decimal;
    }
}

function limparDisplay() {
    display.value = '0';
    primeiroNumero = null;
    operadorAtual = null;
}

function apagarUltimo() {
    display.value = display.value.slice(0, -1);
    if (display.value === '') {
        display.value = '0';
    }
}

function calcular() {
    if (operadorAtual === null || primeiroNumero === null) {
        return;
    }
    let segundoNumero = parseFloat(display.value);
    let resultado;

    switch (operadorAtual) {
        case '+':
            resultado = primeiroNumero + segundoNumero;
            break;
        case '-':
            resultado = primeiroNumero - segundoNumero;
            break;
        case '*':
            resultado = primeiroNumero * segundoNumero;
            break;
        case '/':
            if (segundoNumero === 0) {
                display.value = 'Erro!';
                return;
            }
            resultado = primeiroNumero / segundoNumero;
            break;
        default:
            return;
    }
    display.value = resultado;
    operadorAtual = null;
    primeiroNumero = resultado;
}