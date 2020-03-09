#include <iostream>
#include <map>
#include <vector>
using namespace std;

int main(){
    int t;
    cin >> t;
    while(t--){
        int a, n;
        vector<int> ar;
        cin >> n;
        for(int i = 0; i < n; i++){
            cin >> a;
            ar.push_back(a);
        }
        
        int i = 0;
        int time = 0;
        while(i < n) {
            if(ar[i] <= time) break;
            time++;
            i++;
            if(i == n) i = 0;
        }
        cout << i + 1 << endl;
    }
    return 0;
}

/*
 2
 4
 1 4 2 1
 2
 4 4
 
 3
 1
 */
