function Matriz(x, y) {
    let clona = function () { return this.slice(); };
    return Array.apply(null, Array(x)).map(clona, Array.apply(null, Array(y)).map(Number.prototype.valueOf, 0));
}

class Tableau {
    constructor(m, n) {
        this.m = Number(m) || 0;
        this.n = Number(n) || 0;
        this.max = true;
        this.labelColumn = [];
        this.labelRow = [];
        this.createCopy = function () { return createCopy(this); };
        this.restricoes = Array.apply(null, Array(m)).map(Number.prototype.valueOf, 0);
        this.tableau = Matriz(this.m, this.n);
    }
}

function pivot_on(tab, row, col) {
    let i, j, pivot, a, multiplier;
    pivot = tab.tableau[row][col];
    console.log("Encontrou pivot: " + pivot, " linha: ", row, " coluna: ", col);
    tab.labelColumn[row - 1] = tab.labelRow[col - 1];

    for (j = 0; j < tab.n; j++)
        tab.tableau[row][j] /= pivot;
    for (i = 0; i < tab.m; i++) {
        multiplier = tab.tableau[i][col];
        if (i == row) continue;
        for (j = 0; j < tab.n; j++) {
            tab.tableau[i][j] -= multiplier * tab.tableau[row][j];
        }
    }
}

function find_pivot_column(tab) {
    let j, pivot_col = 1;
    let lowest = tab.tableau[0][pivot_col];
    for (j = 1; j < tab.n; j++) {
        if (tab.tableau[0][j] < lowest) {
            lowest = tab.tableau[0][j];
            pivot_col = j;
        }
    } if (lowest >= 0) {
        return -1;
    }
    return pivot_col;
}

function find_pivot_row(tab, pivot_col) {
    let i, pivot_row = 0, min_ratio = -1, ratio;
    for (i = 1; i < tab.m; i++) {
        if (tab.tableau[i][pivot_col]) {
            ratio = tab.tableau[i][0] / (tab.tableau[i][pivot_col]);
            if ((ratio > 0 && ratio < min_ratio) || min_ratio < 0) {
                min_ratio = ratio;
                pivot_row = i;
            }
        }
    }
    return min_ratio == -1 ? -1 : pivot_row;
}
function add_variaveis_nao_basicas(tab) {
    let i, j;
    let rest = 0;
    tab.labelColumn = []; // Cria a coluna para a label das linhas da tabela, com exceção da linha Z

    for (let index = 0; index < tab.m - 1; index++) {
        rest += tab.restricoes[index] == "<=" ? 1 : 2;
    }

    for (i = 0; i < tab.m; i++) {
        tab.labelColumn.push("f" + (i + 1));
        for (j = 1; j < tab.m; j++) {
            tab.tableau[i][j + tab.n - 1] = (i == j) ? (tab.restricoes[i - 1] == "<=" ? 1 : -1) : 0;
        }
    }

    tab.labelColumn.pop(); // Remove a linha adicionada a mais (não conta a linha Z)

    for (i = 1, l = tab.labelColumn.length; i < tab.m; i++) {
        if (tab.restricoes[i - 1] == ">=") {
            tab.hasExtraVariable = true;
            tab.labelColumn.push("f" + (tab.labelColumn.length + 1));
            for (j = 0; j < tab.m; j++) {
                tab.tableau[j].push((i == j) ? 1 : 0);
            }
        }
    }

    tab.labelRow = []; // cria a linha cabeçalho da matriz, sendo a primeira coluna b
    for (i = 1; i < tab.n; i++) { // começa a iterar as variáveis básicas
        tab.labelRow.push("x" + i);
    }
    tab.labelRow = tab.labelRow.concat(tab.labelColumn); // concatena as variáveis básicas com as variáveis não básicas
    tab.n = tab.labelRow.length + 1;
}

function calculateZLine(tab, final) {
    var newZ = [];
    if (!final) {
        for (i = 0; i < tab.n; i++) {
            newZ.push(0);
            if (i && tab.labelRow[i - 1].replace("f", "") > (tab.m - 1)) {
                continue;
            }
            for (j = 1; j < tab.m; j++) {
                if (tab.restricoes[j - 1] == ">=") {
                    newZ[i] -= tab.tableau[j][i];
                }
            }
        }
    }
    else {
        newZ.push(0);
        for (j = 1; j < tab.m; j++) {
            let x = tab.labelColumn[j - 1].match(/^(?:x)(\d+)$/);
            if (x) {
                newZ[0] += tab.funcaoObjetivo[Number(x[1])] * tab.tableau[j][0];
            }
        }
        for (i = 1; i < tab.n; i++) {
            newZ.push(0);
            for (j = 1; j < tab.m; j++) {
                let x = tab.labelColumn[j - 1].match(/^(?:x)(\d+)$/);
                newZ[i] += ((tab.funcaoObjetivo[Number(x ? x[1] : -1)] || 0) * tab.tableau[j][i] || 0) - ((x ? tab.funcaoObjetivo[i] : 0) || 0);
            }
        }
    }

    tab.tableau[0] = newZ;
}

function criarFuncaoObjetivo(tab) {
    tab.funcaoObjetivo = tab.tableau[0].slice();
}

function simplex(tab, iteracoes) {
    console.log("TABLEAU INICIAL: ", JSON.stringify(tab));
    let loop = 0;
    iteracoes = Number(iteracoes) || 20;
    try {
        let passoapasso = [];
        let pivot_col, pivot_row;
        criarFuncaoObjetivo(tab);
        add_variaveis_nao_basicas(tab);
        passoapasso.push(createCopy(tab));
        do {
            if(loop > 20) return false;
            if (loop >= iteracoes) break;

            if (!tab.max) {
                if (!loop && tab.hasExtraVariable) calculateZLine(tab);
                pivot_col = find_pivot_column(tab);
                if (pivot_col < 0) {
                    tab.max = true;
                    calculateZLine(tab, true);
                    break;
                }
                pivot_row = find_pivot_row(tab, pivot_col);
                if (pivot_row < 0) {
                    tab.max = true;
                    if (tab.hasExtraVariable) calculateZLine(tab, true);
                    break;
                }
                pivot_on(tab, pivot_row, pivot_col);
            }
            else {
                pivot_col = find_pivot_column(tab);
                if (pivot_col < 0) {
                    break;
                }
                pivot_row = find_pivot_row(tab, pivot_col);
                if (pivot_row < 0) {
                    break;
                }
                pivot_on(tab, pivot_row, pivot_col);
            }
            passoapasso.push(createCopy(tab));
        } while (++loop);
        tab.passoapasso = passoapasso;
        tab.iteracoes = loop;
        return true;
    } catch (error) {
        console.log(error);
        return false;
    }
}

function createCopy(tableau) {
    let copy = new Tableau(tableau.m, tableau.n);
    for (let i = 0; i < tableau.tableau.length; i++) {
        copy.tableau[i] = tableau.tableau[i].slice();
    }
    copy.funcaoObjetivo = tableau.funcaoObjetivo.slice();
    copy.restricoes = tableau.restricoes.slice();
    copy.labelColumn = tableau.labelColumn.slice();
    copy.labelRow = tableau.labelRow.slice();
    return copy;
}

function getSensibilityTable(final) {
    var sensibilityTable = {
        labelRow: ["Variável", "Valor Final", "Preço Sombra", "+", "-"],
        labelColumn: final.labelRow.concat(["Z"]),
        table: Matriz(final.labelRow.length + 1, 4)
    };
    // VALOR FINAL
    for (let index = 0; index <= final.labelColumn.length; index++) {
        let i = sensibilityTable.labelColumn.indexOf(final.labelColumn[index]);
        sensibilityTable.table[i >= 0 ? i : (sensibilityTable.labelColumn.length - 1)][0] = (final.tableau[index + 1] || final.tableau[0])[0];
    }
    // PREÇO SOMBRA
    for (let index = 0; index < sensibilityTable.labelColumn.length; index++) {
        sensibilityTable.table[index][1] = "-";
        if (sensibilityTable.labelColumn[index].match(/^f/)) {
            sensibilityTable.table[index][1] = final.tableau[0][(index + 1) % sensibilityTable.labelColumn.length];
        }
    }
    // Calcular + e - 
    let firstColumn = final.labelRow.indexOf("f1") + 1;
    for (let index = 0, total = sensibilityTable.labelColumn.length; index < total; index++) {
        sensibilityTable.table[index][2] = "-";
        sensibilityTable.table[index][3] = "-";

        if (index >= firstColumn && (total) > index) {
            let divide = final.tableau[1][0];
            let maior = (divide) / (final.tableau[1][index]), menor = (divide) / (final.tableau[1][index]);

            for (let l = 1; l <= final.labelColumn.length; l++) {
                let divide = final.tableau[l][0];
                const element = final.tableau[l][index];
                let mn = (divide) / (element), mx = (divide) / (element);
                if (Math.abs(mn) !== Infinity) {
                    if (mn < menor) {
                        menor = mn;
                    }
                    if (mx > maior) {
                        maior = mx;
                    }
                }
            }
            sensibilityTable.table[index - 1][2] = Math.abs(maior);
            sensibilityTable.table[index - 1][3] = Math.abs(menor);
            if (final.labelColumn.indexOf(final.labelRow[index]) >= 0){
                sensibilityTable.table[index - 1][2] = Math.abs(menor);
                sensibilityTable.table[index - 1][3] = Math.abs(maior);
            }
        }

    }
    return sensibilityTable;
}