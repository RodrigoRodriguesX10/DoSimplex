# DoSimplex
Programa simples em Javascript para resolução de Problemas de Programação Linear com SIMPLEX.

## AVISO!
Esse trabalho foi desenvolvido para cenário de estudo e não tem compromisso com questões profissionais.
Esse projeto foi desenvolvido por estudantes universitários com objetivo, exclusivamente, didático e está associado com a disciplina de "Pesquisa Operacional" do curso de Sistemas de Informação do "Centro Universitário Eurípedes de Marília" (UNIVEM - Brasil).

## Exemplo
Seja o objetivo:

**MAX Z = 3\*x_1 + 5\*x_2**

Sujeito a:

  - 1\*x_1 + 0\*x_2 <= 3
  - 0\*x_1 + 1\*x_2 <= 4
  - 3\*x_1 + 2\*x_2 <= 18

  - e x_1, X_2 >= 0

Total: 2 variáveis e 3 restrições.

Você tem o tableau inicial:

|  | b | x_1 | x_2 | f_1 | f_2 | f_3 |
| ------ | ------ | ------ | ------ | ------ | ------ | ------ |
|f_1| 3 | 1 | 0 | 1 | 0 | 0 |
|f_2| 4 | 0 | 1 | 0 | 1 | 0 |
|f_3| 18 | 3 | 2 | 0 | 0 | 1 |
| Z | 0 | -3 | -5 | 0 | 0 | 0 |

### Para o código:
Usando o arquivo simplex.js (esse arquivo não requer quaisquer outros módulos ou bibliotecas):

    var tableau = {

        m: 4, // linhas: número de restrições +1 (para a linha Z)

        n: 3, // colunas: número de variáveis + 1 (para a coluna b)

        tableau: [

        // ↓ primeira coluna (indíce 0 de todos os arrays internos) é sempre a coluna b

            [0, -3, -5], // primeiro array é sempre a linha Z

            [3, 1, 0],

            [4, 0, 1],

            [18, 3, 2]

        ],

    };

    simplex(tableau); // execute a função e a solução será calculada dentro da variável tableau.

    console.log(tableau); // veja o resultado

    console.log("Z = "+ tableau.tableau[0][0]); // Z = 29
  
### Para uso da Interface:
Abra index.html (esse arquivo requer Bootstrap, Popper e jQuery v3.3.1):
- Coloque o número de variáveis e restrições;
- Coloque os valores das restrições;
- Calcule o resultado.

### TESTE ONLINE!
Esse projeto está rodando em: https://dosimplex.azurewebsites.net
