//
//  main.cpp
//  while
//
//  Created by Valeria Conde on 06/01/20.
//  Copyright © 2020 Valeria Conde. All rights reserved.
//

#include <iostream>

using namespace std;

void suma(int a, int b) {
    cout << a + b << endl;
}

void resta(int a, int b) {
    cout << a - b << endl;
}

int multiplica(int a, int b) {
    return a * b;
}

int divide(int a, int b) {
    return a / b;
}

int main(){
    
    int opcion;
    int a, b;
    
    do {
        cout << "menu" << endl;
        cout << "1) Sumar\n";
        cout << "2) Restar\n";
        cout << "3) Multiplicar\n";
        cout << "4) Dividir\n";
        cout << "9) Salir\n";
        
        cin >> opcion;
        cin >> a >> b;
        
        switch (opcion) {
            case 1:
                cout << "Hola, estamos sumando\n";
                suma(a,b);
                break;
            case 2:
                cout << "Hola, estamos restando\n";
                resta(a, b);
                break;
            case 3:
                cout << "Hola, estamos multiplicando\n";
                cout << multiplica(a, b) << endl;
                break;
            case 4:
                cout << "Hola, estamos dividiendo";
                cout << divide(a, b) << endl;
                break;
            case 9:
                cout << "Adios!!!\n";
                break;
            default:
                cout << "Opcion invalida\n";
        }
    } while(opcion != 9);
    
    return 0;
}
