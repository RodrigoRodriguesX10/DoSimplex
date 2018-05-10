/*
  What: Solves LP Problem with Simplex:
    { maximize cx : Ax <= b, x >= 0 }.
  Input: { m, n, Mat[m x n] }, where:
    b = mat[1..m,0] .. column 0 is b >= 0, so x=0 is a basic feasible solution.
    c = mat[0,1..n] .. row 0 is z to maximize, note c is negated in input.
    A = mat[1..m,1..n] .. constraints.
    x = [x1..xm] are the named variables in the problem.
    Slack variables are in columns [m+1..m+n]

  USAGE:
    1. Problem can be specified before main function in source code:
      c:\> vim mosplex.c  
      Tableau tab  = { m, n, {   // tableau size, row x columns.
          {  0 , -c1, -c2,  },  // Max: z = c1 x1 + c2 x2,
          { b1 , a11, a12,  },  //  b1 >= a11 x1 + a12 x2
          { b2 , a21, a22,  },  //  b2 >= a21 x1 + a22 x2
        }
      };
      c:\> cl /W4 mosplex.c  ... compile this file.
      c:\> mosplex.exe problem.txt > solution.txt

    2. OR Read the problem data from a file:
      $ cat problem.txt
            m n
            0  -c1 -c2
            b1 a11 a12
            b2 a21 a11 
      $ gcc -Wall -g mosplex.c  -o mosplex
      $ mosplex problem.txt > solution.txt
*/

function print_tableau(tab, mes) {
    var counter = 0;
    var i, j;
    console.log("\n" + (++counter) + ". Tableau " + mes + ":\n");

    console.log("col:");
    for (j = 1; j < tab.n; j++) { console.log("    x" + j); } console.log("\n");

    for (i = 0; i < tab.m; i++) {
        if (i == 0) console.log("max:");
        else
            console.log("b" + i + ": ");
        for (j = 0; j < tab.n; j++) {
            if (tab.mat[i][j] == tab.mat[i][j])
                console.log(tab.mat[i][j]);
            else
                console.log(tab.mat[i][j]);
        }
        console.log("\n");
    }
}

function pivot_on(tab, row, col) {
    var i, j;
    var pivot;

    pivot = tab.mat[row][col];
    for (j = 0; j < tab.n; j++)
        tab.mat[row][j] /= pivot;
    for (i = 0; i < tab.m; i++) { // foreach remaining row i do
        var multiplier = tab.mat[i][col];
        if (i == row) continue;
        for (j = 0; j < tab.n; j++) { // r[i] = r[i] - z * r[row];
            tab.mat[i][j] -= multiplier * tab.mat[row][j];
        }
    }
}

// Find pivot_col = most negative column in mat[0][1..n]
function find_pivot_column(tab) {
    var j, pivot_col = 1;
    var lowest = tab.mat[0][pivot_col];
    for (j = 1; j < tab.n; j++) {
        if (tab.mat[0][j] < lowest) {
            lowest = tab.mat[0][j];
            pivot_col = j;
        }
    }
    console.log("Most negative column in row[0] is col %d = %g.\n", pivot_col, lowest);
    if (lowest >= 0) {
        return -1; // All positive columns in row[0], this is optimal.
    }
    return pivot_col;
}

// Find the pivot_row, with smallest positive ratio = col[0] / col[pivot]
function find_pivot_row(tab, pivot_col) {
    var i, pivot_row = 0;
    var min_ratio = -1;
    console.log("Ratios A[row_i,0]/A[row_i,%d] = [", pivot_col);
    for (i = 1; i < tab.m; i++) {
        var ratio = tab.mat[i][0] / tab.mat[i][pivot_col];
        console.log("%3.2lf, ", ratio);
        if ((ratio > 0 && ratio < min_ratio) || min_ratio < 0) {
            min_ratio = ratio;
            pivot_row = i;
        }
    }
    console.log("].\n");
    if (min_ratio == -1)
        return -1; // Unbounded.
    console.log("Found pivot A[%d,%d], min positive ratio=%g in row=%d.\n",
        pivot_row, pivot_col, min_ratio, pivot_row);
    return pivot_row;
}

function add_slack_variables(tab) {
    var i, j;
    for (i = 0; i < tab.m; i++) {
        for (j = 1; j < tab.m; j++)
            tab.mat[i][j + tab.n - 1] = (i == j) ? 1 : 0;
    }
    tab.n += tab.m - 1;
}


// Given a column of identity matrix, find the row containing 1.
// return -1, if the column as not from an identity matrix.
function find_basis_variable(tab, col) {
    var i, xi = -1;
    for (i = 1; i < tab.m; i++) {
        if (tab.mat[i][col] == 1) {
            if (xi == -1)
                xi = i;   // found first '1', save this row number.
            else
                return -1; // found second '1', not an identity matrix.

        } else if (tab.mat[i][col] != 0) {
            return -1; // not an identity matrix column.
        }
    }
    return xi;
}

function print_optimal_vector(tab, message) {
    var j, xi;
    console.log(message, " at ");
    for (j = 1; j < tab.n; j++) { // for each column.
        xi = find_basis_variable(tab, j);
        if (xi != -1)
            console.log("x" + j + "=", tab.mat[xi][0]);
        else
            console.log("x" + j + "=0");
    }
    console.log("\n");
}

function simplex(tab) {
    var loop = 0;
    add_slack_variables(tab);
    print_tableau(tab, "Padded with slack variables");
    while (++loop) {
        var pivot_col, pivot_row;

        pivot_col = find_pivot_column(tab);
        if (pivot_col < 0) {
            console.log("Found optimal value=A[0,0]="+ tab.mat[0][0] +" (no negatives in row 0).\n");
            print_optimal_vector(tab, "Optimal vector");
            break;
        }
        console.log("Entering variable x"+pivot_col+" to be made basic, so pivot_col="+pivot_col+".\n");

        pivot_row = find_pivot_row(tab, pivot_col);
        if (pivot_row < 0) {
            console.log("unbounded (no pivot_row).\n");
            break;
        }
        console.log("Leaving variable x%d, so pivot_row=%d\n", pivot_row, pivot_row);

        pivot_on(tab, pivot_row, pivot_col);
        print_tableau(tab, "After pivoting");
        print_optimal_vector(tab, "Basic feasible solution");

        if (loop > 20) {
            console.log("Too many iterations > %d.\n", loop);
            break;
        }
    }
}

var tab = {
    n: 3, m: 4, mat:                     // Size of tableau [4 rows x 5 columns ]
        [
            [0, -3, -5],
            [4, 1, 0],
            [6, 0, 1],
            [18, 3, 2],
        ],  //        y     - w <= 10 .. b3
};

simplex(tab);

console.log(tab);