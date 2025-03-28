function ControlDeSelecao(){
    var dropdown = document.getElementById("operadores").options[document.getElementById("operadores").selectIndex].value;
    var placetest;
    var visibilidade;

        if ( [ 'raiz', 'fatorial', 'fibonacci', 'media', 'calc' ].indexOf(dropdown) > -1){
            visibilidade = "hidden";
			document.getElementById("txtValor1").value = ""

            switch(dropdown){
                case "raiz":
                    placeText = "9 (ex: √9 = 3)"; break;
                case "fatorial":
                    placeText = "5 (ex: 5x4x3x2x1 = 120)"; break;
                case "fibonacci":						
                    placeText = "5 (ex: 1+1+2+3+5)"; break;
                case "media":
                    placeText = "9,6.5,2(decimais com .)"; break;
                case "calc":
                    placeText = "3+4*(5-1)"; break;
                default:
                    break;
             }
        }else{
            visibilidade = "visible";
            placetest = "";
        }
        document.getElementById("txtValor2").style.visibility = visibilidade;
		document.getElementById("txtValor1").placeholder = placeText;
    
}   
    function Calcular(id1, id2){
		var operador = document.getElementById("operadores").options[document.getElementById("operadores").selectedIndex].value;
		
		var num1 = document.getElementById(id1).value;
		var num2 = document.getElementById(id2).value;
		var resultado = new Number();
    }