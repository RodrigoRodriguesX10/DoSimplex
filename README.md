# DoSimplex 
Simple JavaScript Program to solving Linear Programming Problems with SIMPLEX. [[Ler PT-BR](https://github.com/RodrigoRodriguesX10/DoSimplex/blob/master/README.pt.md)]

## Warning!
This job was developed for study scenario and has no commitment to professional matters.
This project was developed by university students with an exclusively didactic purpose and is associated to the "Operational Research" discipline of the Information Systems course of the "University Center Euripedes of Marília" (UNIVEM - Brazil).

## Example
Be the goal:

**MAX Z = 3\*x_1 + 5\*x_2**

Subject to:

  - 1\*x_1 + 0\*x_2 <= 3
  - 0\*x_1 + 1\*x_2 <= 4
  - 3\*x_1 + 2\*x_2 <= 18

  - and x_1, X_2 >= 0

Total: 2 variables and 3 restrictions.

You got the initial tableau:

|  | b | x_1 | x_2 | f_1 | f_2 | f_3 |
| ------ | ------ | ------ | ------ | ------ | ------ | ------ |
|f_1| 3 | 1 | 0 | 1 | 0 | 0 |
|f_2| 4 | 0 | 1 | 0 | 1 | 0 |
|f_3| 18 | 3 | 2 | 0 | 0 | 1 |
| Z | 0 | -3 | -5 | 0 | 0 | 0 |

### For code:
Using simplex.js (this file doesn't require any other library or module) file:

    var tableau = {

        m: 4, // lines: number of restrictions + 1 (for Z line)

        n: 3, // columns: number of variables + 1 (for B column)

        tableau: [

        // ↓ first column (index 0 of all inner array) is always the B column

            [0, -3, -5], // first array is always Z line

            [3, 1, 0],

            [4, 0, 1],

            [18, 3, 2]

        ],

    };

    simplex(tableau); // execute function and the solution will be calculated into tableau variable.

    console.log(tableau); // see the result

    console.log("Z = "+ tableau.tableau[0][0]); // Z = 29
  
### For Interface Usage:
Open index.html (this file requires Bootstrap, Popper and jQuery v3.3.1):
- Input number of variables and restrictions;
- Input restriction values;
- Calculate result.

### TEST ONLINE!
This project is running at: https://dosimplex.azurewebsites.net
