//
//  main.cpp
//  act 1.1
//
//  Created by Valeria Conde on 24/08/20.
//  Copyright © 2020 Valeria Conde. All rights reserved.
//

#include <iostream>
using namespace std;

// Casos prueba:
// 15 = 130
// 10 = 55
// 5 = 15
// 4 = 10

// Funcion iterativa; complejidad O(n)
long long sumaIterativa(long long n) {
    long long ans = 0;
    for(long long i = n; i >= 0; i--) {
        ans += i;
    }
    return ans;
}

// Funcion recursiva; complejidad O(n)
long long sumaRecursiva(long long n) {
    long long ans = 0;
    if (n == 0) return ans;
    ans = n + sumaRecursiva(n-1);
    return ans;
}

// Funcion directa; complejidad O(1)
long long sumaDirecta(long long n) {
    long long ans = (n * (n+1)) / 2;
    return ans;
}

int main() {
    int k;
    cin >> k;
    while (k--) {
        long long n;
        cin >> n;
        cout << sumaIterativa(n) << endl;
        cout << sumaDirecta(n) << endl;
        cout << sumaRecursiva(n) << endl;
    }
    return 0;
}
