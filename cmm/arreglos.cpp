//
//  main.cpp
//  arreglos
//
//  Created by Valeria Conde on 06/01/20.
//  Copyright © 2020 Valeria Conde. All rights reserved.
//

#include <iostream>

using namespace std;

int main() {
    
    // leer arreglo e imprimir solo los pares
    
    // leer arreglo
    int n;
    cin >> n;
    
    int arr[n];
    for (int i = 0; i < n; i++) {
        cin >> arr[i];
    }
    
    // encontrar los pares
    for (int i = 0; i < n; i++) {
        if (arr[i] % 2 == 0) {
            cout << arr[i] << endl;
        }
    }
    
    return 0;
}
