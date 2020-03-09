//
//  main.cpp
//  arreglo pares impares
//
//  Created by Valeria Conde on 15/01/20.
//  Copyright © 2020 Valeria Conde. All rights reserved.
//

#include <iostream>

using namespace std;

int main() {
    // lee arreglo e imprime la suma de los pares e impares
    
    int pares = 0, impares = 0, n;
    
    cin >> n;
    
    int arr[n];
    
    for (int i = 0; i < n; i++) {
        cin >> arr[i];
    }
    
    for (int i = 0; i < n; i++) {
        if (arr[i] % 2 == 0) {
            pares += arr[i];
        } else {
            impares += arr[i];
        }
    }
    
    cout << "Suma de pares: " << pares << endl;
    cout << "Suma de impares: " << impares << endl;
    
    return 0;
}
