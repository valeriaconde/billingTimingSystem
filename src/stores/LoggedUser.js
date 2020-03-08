var LoggedUser = (function() {
    var getEmail = function() {
        return localStorage.getItem('user');
    };

    var setEmail = function(email) {
        localStorage.setItem('user', email);
    }

    var logOutUser = function() {
        localStorage.clear();
    }

    return {
        getEmail: getEmail,
        setEmail: setEmail,
        logOutUser: logOutUser
    }
})();

export default LoggedUser;