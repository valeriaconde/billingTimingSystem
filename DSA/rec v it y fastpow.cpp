//
//  main.cpp
//  recursion
//
//  Created by Valeria Conde on 14/08/20.
//  Copyright © 2020 Valeria Conde. All rights reserved.
//

#include <iostream>
using namespace std;

// fibonacci iterativo
int itfib(int n) {
    int ans = 0, ant = 1, antant = 1;
    if (n <= 2) return 1;
    for (int i = 3; i <= n; i++) {
        ans = ant + antant;
        ant = antant;
        antant = ans;
    }
    return ans;
}

// fibonacci recursivo
int fib(int n) {
    if (n <= 2) return 1;
    
    return fib(n-1) + fib(n-2);
}

//bacteria iterativa
double itbact(int n) {
    int ans = 1;
    for (int i = 0; i < n; i++) {
        ans += (ans*3.78) - (ans*2.34);
    }
    return ans;
}

//bacteria recursiva
double recbact(int n) {
    if (n == 0) return 1;
    int bac = recbact(n-1);
    return bac + (bac*3.78) - (bac*2.34);
}


// potencia iterativa
long long itpot(int x, int y) {
    long long ans = 0;
    for (int i = 0; i < y; i++) {
        ans *= x;
    }
    return ans;
}

// potencia recursiva
long long recpot(int x, int y) {
    if (y == 0) return 1;
    return x * recpot(x, y-1);
}

// fast pow
int pot (int x, int y) {
    int ans = 1;
    while (y > 0) {
        if (y % 2 != 0) ans *= x;
        x *= x;
        y /= 2;
    }
    return ans;
}


int main() {
    cout << fib(6);

    return 0;
}
