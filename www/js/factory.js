loginApp.factory('loginsFactory', function($http) {
  var urlBase = '/api/logins';
  var _loginService = {};
 
  _loginService.getLogins = function() {
    return $http.get(urlBase);
  };
 
  _loginService.saveLogin = function(login) {
    return $http.post(urlBase, login);
  };
 
  _loginService.updateLogin = function(login) {
    return $http.put(urlBase, login);
  };
 
  _loginService.deleteLogin = function(id) {
    return $http.delete(urlBase + '/' + id);
  };
 
  return _loginService;
});
