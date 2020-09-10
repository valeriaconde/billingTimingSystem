//  main.cpp
//  act 1.2
//
//  Created by Valeria Conde on 09/09/20.
//  Copyright © 2020 Valeria Conde. All rights reserved.

#include <iostream>
#include <vector>
using namespace std;

// Funcion que ordena intercambiando valores cada iteracion
void ordenaIntercambio(vector<int> ar) {
    int n = ar.size();
    int comparaciones = 0;
    for(int i = 0; i <= n-2; i++) {
        for(int j = i+1; j <= n-1; j++) {
            comparaciones++;
            if(ar[j] < ar[i]) {
                swap(ar[i], ar[j]);
            }
        }
    }
    cout << comparaciones << " ";
}

// Funcion que ordena comparando dos valores a la vez
void ordenaBurbuja(vector<int> ar) {
    int n = ar.size();
    int comparaciones = 0;
    bool interruptor = 1;
    for (int i = 0; i < n-1 && interruptor; i++) {
        interruptor = 0;
        for (int j = 0; j < n-1-i; j++) {
            comparaciones++;
            if(ar[j+1] < ar[j]) {
                swap(ar[j], ar[j+1]);
                interruptor = 1;
            }
        }
    }
    cout << comparaciones << " ";
}

// Funcion de apoyo para ordenaMerge que hace la parte de merge
void merge(vector<int>& ar, int lo, int hi, int mid, int& comparaciones) {
    int sizeOfL = mid - lo + 1;
    int sizeOfR = hi - mid;
    int L[sizeOfL], R[sizeOfR];
    
    for(int i = 0; i < sizeOfL; i++) {
        L[i] = ar[lo + i];
    }
    
    for(int j = 0; j < sizeOfR; j++) {
        R[j] = ar[mid + j + 1];
    }
    
    int i = 0, j = 0, k = lo;
    while(i < sizeOfL && j < sizeOfR) {
        comparaciones++;
        if(L[i] < R[j]) {
            ar[k] = L[i];
            i++;
        } else {
            ar[k] = R[j];
            j++;
        }
        k++;
    }
    
    while(i < sizeOfL) {
        ar[k++] = L[i++];
    }
    
    while(j < sizeOfR) {
        ar[k] = R[j];
        j++;
        k++;
    }
}

// Funcion que ordena diviendo en subarreglos
void ordenaMerge(vector<int>& ar, int lo, int hi, int& comparaciones) {
    if(lo < hi) {
        // recursive
        int mid = (lo + hi) / 2;
        ordenaMerge(ar, lo, mid, comparaciones);
        ordenaMerge(ar, mid + 1, hi, comparaciones);
        
        merge(ar, lo, hi, mid, comparaciones);
    }
}

// Funcion que busca un numero en un arreglo de manera secuencial
int comparacionesSecuencial;
int busqSecuencial(vector<int> ar, int n) {
    comparacionesSecuencial = 0;
    for (int i = 0; i < ar.size(); i++) {
        comparacionesSecuencial++;
        if(ar[i] == n) return i;
    }
    return -1;
}

// Funcion que busca un numero en un arreglo de forma binaria
int comparacionesBinaria;
int busqBinaria(vector<int> ar, int n) {
    comparacionesBinaria = 0;
    int lo = 0, hi = ar.size()-1;
    while (lo <= hi) {
        comparacionesBinaria++;
        int mid = (lo + hi) / 2;
        if(ar[mid] == n) {
            return mid;
        } else if (ar[mid] > n) {
            hi = mid - 1;
        } else {
            lo = mid + 1;
        }
    }
    return -1;
}


int main() {
    // leer los datos, ordenarlos, decir la cant de comparaciones en el ordenado
    
    // leer las q consultas de datos, diciendo la posicion del dato en el arreglo (-1 si no lo encuentra)
    
    // decir cant de comparaciones en la busqueda
    
    
    
    // Variables y vector necesario
    int n, q, comparacionesMerge = 0;
    vector<int> ar;
    cin >> n;
    
    // Lee valores del arreglo
    for (int i = 0; i < n; i++) {
        int x;
        cin >> x;
        ar.push_back(x);
    }
    
    // Ordena el arreglo con 3 funciones distintas
    ordenaIntercambio(ar);
    ordenaBurbuja(ar);
    ordenaMerge(ar, 0, ar.size()-1, comparacionesMerge);
    cout << comparacionesMerge << endl;
    
    // Lee numero de casos prueba y corre esa cantidad de veces
    cin >> q;
    while (q--) {
        // Lee el numero a buscar
        int num;
        cin >> num;
        
        // Imprime la posicion del numero y la cantidad de
        // comparaciones hecha por busqueda secuencial y binaria
        cout << busqSecuencial(ar, num) << " ";
        cout << comparacionesSecuencial << " ";
        busqBinaria(ar, num);
        cout << comparacionesBinaria << endl;
    }
    return 0;
}
