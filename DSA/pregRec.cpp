// Matricula: A01281637
// Nombre: Valeria Conde
#include <iostream>
using namespace std;

// Complejidad: O(n)
int sumaRecursivaCuadrada(int n){
    if (n == 0) return 0;
    return n*n + sumaRecursivaCuadrada(n-1);
}

int main(){
    int n;
    cin >> n;
    cout << sumaRecursivaCuadrada(n) << endl;
    return 0;
}
