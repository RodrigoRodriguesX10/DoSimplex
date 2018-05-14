(function () {
    var variaveis, restricoes, tbody, resultado, header; // Variáveis com a referência dos elementos da página
    function gerarTabela() {
        tbody = document.getElementById("tabela_restricoes");
        tbody.innerHTML = "";
        var linha = document.getElementById("linha_funcao");
        var inner = "";
        var linhatexto = "<tr><th>MAX Z = </th>";
        variaveis = document.getElementById("variaveis");
        restricoes = document.getElementById("restricoes");
        for (let index = 0; index < restricoes.value; index++) {
            inner += "<tr>"
            for (let variavel = 0; variavel < variaveis.value; variavel++) {
                var id = index + "_" + variavel;
                if (!index) {
                    linhatexto += '<td>\
                <div class="input-group-prepend"  style="max-width: 150px">\
                    <input type="number" step="0.01" id="'+ linha + variavel + '" class="input_linha" style="width: 50px" ><div class="input-group-text">x' + (variavel + 1) + '</div>\
                </div></td>';

                }
                inner += '<td>\
                <div class="input-group-prepend"  style="max-width: 150px">\
                    <input type="number" step="0.01" id="'+ id + '" class="input_simplex" style="width: 50px" ><div class="input-group-text">x' + (variavel + 1) + '</div>\
                </div></td>';
            }
            inner += '<td><div class="input-group-prepend" style="max-width: 150px">\
                <div class="input-group-text">&ange;</div><input id="resultado_'+ index + '" class="input_simplex" type="number" step="0.01" style="width: 50px">\
                </div></td></tr>';

        }
        linhatexto += "</tr>";
        tbody.innerHTML = inner;

        linha.innerHTML = linhatexto;

        $("#parametros").show();
    }

    function resolverSimplex() {
        var inputs = document.getElementsByClassName("input_simplex");
        var linha = document.getElementsByClassName("input_linha");
        var matriz = [];
        var cabecalho = [0];
        for (let i = 0; i < inputs.length; i++) {
            var indices = inputs[i].id.split("_");
            matriz[indices[0]] = matriz[indices[0]] || [];
            matriz[indices[0]][indices[1]] = Number(inputs[i].value);
        }

        for (let i = 0; i < linha.length; i++) {
            cabecalho.push(Number(linha[i].value) * -1);
        }

        var tabelaSimplex = [];
        tabelaSimplex.push(cabecalho);

        for (let i = 0; i < matriz.length; i++) {
            var x = [matriz["resultado"][i]].concat(matriz[i]);
            tabelaSimplex.push(x);
        }

        console.log(tabelaSimplex);

        var simplexTabela = {
            m: tabelaSimplex.length,
            n: tabelaSimplex[0].length,
            tableau: tabelaSimplex
        };
        simplex(simplexTabela);

        console.log(simplexTabela);

        resultado = document.getElementById("resultado_simplex");
        header = document.getElementById("resultado_header");
        
        var resultTabela = gerarTabelaSolucao(simplexTabela);

        resultado.innerHTML = simplexTabela.resultado;
        header.innerHTML = simplexTabela.header;

        $("#solucao").show();
        $(document).scrollTop(1000);
    }

    function gerarTabelaSolucao(tabela){
        var inner = "";
        var linhatexto = "<tr>";

        var Z = "<tr>";
        for (let index = 1; index < tabela.m; index++) {
            inner += "<tr>";
            for (let variavel = 0; variavel < tabela.n; variavel++) {
                let id = index + "_" + variavel;
                let value = Number.isInteger(tabela.tableau[index][variavel]) ? tabela.tableau[index][variavel] : tabela.tableau[index][variavel].toFixed(3);
                inner += '<td>' + value + '</td>';
            }
            inner += '</tr>';
        }
        for (let variavel = 0; variavel < tabela.n; variavel++) {
            var nome;
            Z += '<th>' + tabela.tableau[0][variavel] + '</th>';
            if (!variavel) {
                nome = "b";
            } else {
                if (variavel < Number(variaveis.value) + 1) {
                    nome = "x" + variavel;
                } else {
                    nome = "f" + (variavel - variaveis.value);
                }
            }
            linhatexto += '<th>' + nome + '</th>';
        }
        Z += "</tr>";
        linhatexto += "</tr>";
        return { resultado: inner + Z, header: linhatexto };
    }

})();
