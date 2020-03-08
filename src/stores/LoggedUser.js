var LoggedUser = (function() {
    var getEmail = function() {
        return localStorage.getItem('user');
    };

    var setEmail = function(email) {
        localStorage.setItem('user', email);
    }

    return {
        getEmail: getEmail,
        setEmail: setEmail
    }
})();

export default LoggedUser;