var LoggedUser = (function () {
    var isLoggedIn = function() {
        var email = getEmail();
        if(email === "") return false;
        
        var hours = 24;
        var now = new Date().getTime();
        var setupTime = getSetupTime();
        if(setupTime === "") return false;
        // If x hours have passed, remove session
        if(now - setupTime > hours * 60 * 60 * 1000) {
            localStorage.clear();
            return false;
        }
        return true;
    };

    var getSetupTime = function() {
        return localStorage.getItem('setupTime');
    }

    var getEmail = function () {
        return localStorage.getItem('user');
    };

    var setEmail = function (email) {
        localStorage.clear();
        localStorage.setItem('user', email);
        localStorage.setItem('setupTime', new Date().getTime());
    };

    var logOutUser = function () {
        localStorage.clear();
    };

    return {
        getEmail: getEmail,
        setEmail: setEmail,
        logOutUser: logOutUser,
        isLoggedIn: isLoggedIn,
        getSetupTime: getSetupTime
    };
})();

export default LoggedUser;