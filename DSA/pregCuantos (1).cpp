// Matricula: A01281637
// Nombre: Valeria Conde
#include <iostream>
using namespace std;

// Complejidad: O(1)
int cuantos(int inf, int sup){
    return sup / 15 - (inf - 1) / 15;
}

int main(){
    int inf, sup;
    cin >> inf >> sup;
    cout << cuantos(inf, sup) << endl;
}
