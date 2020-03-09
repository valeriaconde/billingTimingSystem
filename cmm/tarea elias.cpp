//
//  main.cpp
//  tarea elias
//
//  Created by Valeria Conde on 13/01/20.
//  Copyright © 2020 Valeria Conde. All rights reserved.
//

#include <iostream>

using namespace std;

int main() {
    // codigo que lee N numeros en un arreglo
    // y me dice la suma de todos ellos
   
    int n;
    
    cin >> n;
    
    int arr[n];
    
    for (int i = 0; i < n; i++) {
        cin >> arr[i];
    }
    
    int cuenta = 0;

    for (int i = 0; i < n; i++) {
        cuenta += arr[i];
    }
    
    cout << cuenta << endl;
    
    
    return 0;
}
