//
//  main.cpp
//  tareaelias2
//
//  Created by Valeria Conde on 13/01/20.
//  Copyright © 2020 Valeria Conde. All rights reserved.
//

#include <iostream>

using namespace std;

int main() {
    // codigo que lee N numeros en un arreglo y me dice el maximo de ellos
    // THIS CODE ONLY WORKS WITH POSITIVES
    
    int n;
    int macs = INT_MIN;
    
    cin >> n;
    
    int arr[n];
    
    for (int i = 0; i < n; i++) {
        cin >> arr[i];
    }
        
    for (int i = 0; i < n; i++) {
        if (arr[i] > macs) {
            macs = arr[i];
        }
    }
    
    cout << macs << endl;
    
    return 0;
}
