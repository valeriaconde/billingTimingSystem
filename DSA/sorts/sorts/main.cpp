#include <iostream>
#include <vector>
using namespace std;
/*
8, 5, 3, 14, 29, 32, 1
1, 5, 3, 14, 29, 32, 8  - it 1
1, 3, 5, 14, 29, 32, 8  - it 2
*/
 
 
/*
Time: O(n^2)
Space: O(1)
En cada iteracion acarreas el mas grande al final
8, 5, 3, 14, 29, 32, 1
5, 3, 8, 14, 29, 1, 32  - it 1
3, 5, 8, 14, 1, 29, 32  - it 2
*/
void bubbleSort(vector<int>& arr) {
  int n = (int) arr.size();
  for(int i = 0; i < n; i++) {
    for(int j = 0; j < n - 1 - i; j++) {
      if(arr[j] < arr[j + 1]){
        swap(arr[j], arr[j + 1]);
      }
    }
  }
}
 
/*
Time: O(n^2)
Space: O(1)
En cada iteracion buscas el mas chico y lo pones donde va
8, 5, 3, 14, 29, 32, 1
1, 5, 3, 14, 29, 32, 8  - it 1
1, 3, 5, 14, 29, 32, 8  - it 2
*/
void selectionSort(vector<int>& arr) {
  int n = (int) arr.size();
  for(int i = 0; i < n; i++) {
    int min_index = i;
    int mini = arr[i];
    for(int j = i; j < n; j++) {
      if(arr[j] < mini) {
        mini = arr[j];
        min_index = j;
      }
    }
    swap(arr[i], arr[min_index]);
  }
}
 
/*
Time: O(n^2)
Space: O(1)
*/
void insertionSort(vector<int>& arr) {
  int n = (int) arr.size();
  for(int i = 1; i < n; i++) {
    int j = i - 1;
    int value = arr[i];
 
    while(j >= 0 && arr[j] >= value) {
      swap(arr[j], arr[j + 1]);
      j--;
    }
  }
}
 
void merge(vector<int>& arr, int lo, int mid, int hi) {
  int n1 = mid - lo + 1;
  int n2 = hi - mid;
  int i, j, k;
  int L[n1], R[n2];
 
  // copia informacion a L y R
  for(i = 0; i < n1; i++) L[i] = arr[lo + i];
  for(j = 0; j < n2; j++) R[j] = arr[mid + j + 1];
 
  i = 0;
  j = 0;
  k = lo;
  while(i < n1 && j < n2) {
    if(L[i] < R[j]) {
      arr[k] = L[i];
      i++;
    } else {
      arr[k] = R[j];
      j++;
    }
    k++;
  }
 
  // copy reamining
  while(i < n1) {
    arr[k] = L[i];
    i++;
    k++;
  }
 
  while(j < n2) {
    arr[k] = R[j];
    j++;
    k++;
  }
}
 
 
/*
Time: O(nlogn)
Space: O(n)
*/
void mergeSort(vector<int>& arr, int lo, int hi) {
  if(lo < hi) {
    // particionar 2 mitades
    int mid = (lo + hi) / 2;
    mergeSort(arr, lo, mid);
    mergeSort(arr, mid + 1, hi);
 
    // mergear
    merge(arr, lo, mid, hi);
  }
}
 
int partition(vector<int>& arr, int lo, int hi) {
  int pivot = arr[hi];
  int i = lo - 1;
 
  for(int j = lo; j < hi; j++) {
    if(arr[j] < pivot) {
      i++;
      swap(arr[i], arr[j]);
    }
  }
 
  swap(arr[i + 1], arr[hi]);
  return i + 1;
}
 
/*
Time: Average O(nlogn) Worst O(n^2)
Space: O(1)
*/
void quickSort(vector<int>& arr, int lo, int hi) {
  if(lo < hi) {
    int pivot_index = partition(arr, lo, hi);
 
    quickSort(arr, lo, pivot_index - 1);
    quickSort(arr, pivot_index + 1, hi);
  }
}
 
int main() {
  vector<int> arr = { 8, 5, 3, 14, 29, 32, 1 };
 
  // bubbleSort(arr);
  // selectionSort(arr);
  // insertionSort(arr);
  // mergeSort(arr, 0, arr.size() - 1);
  quickSort(arr, 0, arr.size() - 1);
  for(int num : arr) cout << num << endl;
 
  return 0;
}
