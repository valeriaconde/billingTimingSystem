//
//  main.cpp
//  string y switch
//
//  Created by Valeria Conde on 06/01/20.
//  Copyright © 2020 Valeria Conde. All rights reserved.
//

#include <iostream>
using namespace std;

int main() {
     // lees string, para cada letra de la string decir si es vocal o no
    
    string s;
    cin >> s;
    
    for (int i = 0; i < s.length(); i++) {
        
        switch (s[i]) {
            case 'a': case 'e': case 'i' : case 'o' : case 'u':
                cout << "chi" << endl;
                break;
                
            default:
                cout << "ño" << endl;
        }
        
    }
    
    
    return 0;
}
