// Ionic Starter App


// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'ionic.ion.autoListDivider', 'ionic.service.core','base64', 'ngCordova', 'starter.controllers','starter.directives','tnf.IonicUtils',  'auth0',
  'angular-storage',
  'angular-jwt', 'ngFileUpload','ngResource','ngRoute',
  'ionic.service.push', 'ionic-material', 'ionMdInput','firebase'])
  
  
.config(function($stateProvider, $urlRouterProvider, $compileProvider) {

$compileProvider.imgSrcSanitizationWhitelist(/^\s*(https?|ftp|file|blob):|data:image\//);
 $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|file):/);
 //console.log($compileProvider.imgSrcSanitizationWhitelist());

})
.directive('autoListDivider', function($timeout) {  
	var lastDivideKey = "";

	return {
		link: function(scope, element, attrs) {
			var key = attrs.autoListDividerValue;

			var defaultDivideFunction = function(k){
				return k.slice( 0, 10 ).toUpperCase();
			}
      
			var doDivide = function(){
				var divideFunction = scope.$apply(attrs.autoListDividerFunction) || defaultDivideFunction;
				var divideKey = divideFunction(key);
				
				if(divideKey != lastDivideKey) { 
					var contentTr = angular.element("<div class='item item-divider'>"+divideKey+"</div>");
					//element[0].parentNode.insertBefore(contentTr[0], element[0]);
				}

				lastDivideKey = divideKey;
			}
		  
			$timeout(doDivide,0)
		}
	}
})




 .factory("Auth", function($firebaseAuth) {
  var usersRef = new Firebase("https//localoffers.firebaseio.com/users");
  return $firebaseAuth(usersRef);
})



.config(['$ionicAppProvider', function($ionicAppProvider) {
  $ionicAppProvider.identify({
    app_id: '828c0033',
    api_key: 'a7ff9963180ebcfcb5790789ac87ccdb40afbe419f494c78',
    dev_push: true
  });
}])

.config(['$httpProvider', function($httpProvider) {
        $httpProvider.defaults.useXDomain = true;
        $httpProvider.defaults.headers.common = 'Content-Type: application/json';
        delete $httpProvider.defaults.headers.common['X-Requested-With'];
    }
])

.config(function($compileProvider){
  $compileProvider.imgSrcSanitizationWhitelist(/^\s*(https?|file|blob|cdvfile|content):|data:image\//);
})

.filter('reverse', function() {
  return function(items) {
    return items.slice().reverse();
  };
})


.run(function($ionicPlatform,$cordovaPush,$rootScope) {

	
	
  $ionicPlatform.ready(function() {
	  /*
	  var push = new Ionic.Push({
      "debug": true
    });

    push.register(function(token) {
      console.log("Device token:",token.token);
    });
	  
	  
	  	var iosConfig = {
            'badge': true,
            'sound': true,
            'alert': true,
        }
	 $cordovaPush.register(iosConfig).then(function(result) {
            // Success -- send deviceToken to server, and store for future use
            console.log('result: ' + result)
            $rootScope.deviceToken = result;
            //$http.post('http://server.co/', {user: 'Bob', tokenID: result.deviceToken})
        }, function(err) {
            alert('Registration error: ' + err)
        });


        $rootScope.$on('$cordovaPush:notificationReceived', function(event, notification) {
            if (notification.alert) {
                navigator.notification.alert(notification.alert);
            }

            if (notification.sound) {
                var snd = new Media(event.sound);
                snd.play();
            }

            if (notification.badge) {
                $cordovaPush.setBadgeNumber(notification.badge).then(function(result) {
                    // Success!
                }, function(err) {
                    // An error occurred. Show a message to the user
                });
            }
        })
	*/
	  $ionicPlatform.registerBackButtonAction(function (event) {
        if ( ($state.$current.name=="app.login") ||
             ($state.$current.name=="app.playlists")
            ){
                // H/W BACK button is disabled for these states (these views)
                // Do not go to the previous state (or view) for these states. 
                // Do nothing here to disable H/W back button.
            } else {
                // For all other states, the H/W BACK button is enabled
                navigator.app.backHistory();
            }
        }, 100);
	
	  
	/*  function onHardwareBackButton(e) {
   $scope.sortbyPopup.close();
   //Call your modal / popup close method here
}

$ionicPlatform.registerBackButtonAction(onHardwareBackButton, 400);*/
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
	  if(window.Connection) {
                if(navigator.connection.type == Connection.NONE) {
                    $ionicPopup.confirm({
                        title: "Internet Disconnected",
                        content: "The internet is disconnected on your device."
                    })
                    .then(function(result) {
                        if(!result) {
						
                          //  ionic.Platform.exitApp();
                        }
                    });
                }
            }
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
})
 

 
/*File factory for browse*/
.factory("$fileFactory", function($q) {



    var File = function() { };
console.log("This is in file factory");
    File.prototype = {

        getParentDirectory: function(path) {
            var deferred = $q.defer();
            window.resolveLocalFileSystemURI(path, function(fileSystem) {
                fileSystem.getParent(function(result) {
                    deferred.resolve(result);
                }, function(error) {
                    deferred.reject(error);
                });
            }, function(error) {
                deferred.reject(error);
            });
            return deferred.promise;
        },

        getEntriesAtRoot: function() {
            var deferred = $q.defer();
			console.log("This is in get Entries in root");
            window.webkitrequestFileSystem(1, 0, function(fileSystem) {
                var directoryReader = fileSystem.root.createReader();
                directoryReader.readEntries(function(entries) {
                    deferred.resolve(entries);
                }, function(error) {
                    deferred.reject(error);
                });
            }, function(error) {
                deferred.reject(error);
            });
            return deferred.promise;
        },

        getEntries: function(path) {
            var deferred = $q.defer();
            window.resolveLocalFileSystemURI(path, function(fileSystem) {
                var directoryReader = fileSystem.createReader();
                directoryReader.readEntries(function(entries) {
                    deferred.resolve(entries);
                }, function(error) {
                    deferred.reject(error);
                });
            }, function(error) {
                deferred.reject(error);
            });
            return deferred.promise;
        }

    };

    return File;

})


.factory('Post', function($resource) {
  return $resource('http://104.155.192.54:8080/api/logins');
})


.config(function($stateProvider, $urlRouterProvider, $compileProvider) {
    $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|file|ghttps?|ms-appx|x-wmapp0):/);
   
})



.factory('Camera', ['$q', function($q) {

  return {
    getPicture: function(options) {
      var q = $q.defer();

      navigator.camera.getPicture(function(result) {
        // Do any magic you need
        q.resolve(result);
      }, function(err) {
        q.reject(err);
      }, options);

      return q.promise;
    }
  }
}])



.factory('merchantRegisterFactory', function($http) {
  var urlBase = 'http://104.155.192.54:8080/api/merchantlogins';
  var _loginService = {};
 
  _loginService.getLogins = function() {
    return $http.get(urlBase);
  };
 
  _loginService.saveLogin = function(login) {
	  console.log("This is factory is merchantlogins app.js save");
    return $http.post(urlBase,login);
  };
 
  _loginService.updateLogin = function(login) {
    return $http.put(urlBase, login);
  };
 
  _loginService.deleteLogin = function(id) {
    return $http.delete(urlBase + '/' + id);
  };
 
  return _loginService;
})

.factory('addOffer', function($http) {
  var urlBase = 'http://104.155.192.54:8080/api/addoffers';
  var _addofferService = {};
 
  _addofferService.getOffers = function() {
    return $http.get(urlBase);
  };
 
  _addofferService.saveOffer = function(login) {
	  console.log("This is factory is addoffers app.js save");
    return $http.post(urlBase,login);
  };
 
  _addofferService.updateoffer = function(login) {
    return $http.put(urlBase, login);
  };
 
  _addofferService.deleteOffer = function(id) {
    return $http.delete(urlBase + '/' + id);
  };
 
  return _addofferService;
})

.factory('offerimage', function($http) {
  var urlBase = 'http://104.155.192.54:8080/api/file/upload/';
  var _addofferimageService = {};
 
  _addofferimageService.getOfferimage = function() {
    return $http.get(urlBase);
  };
 
  _addofferimageService.saveOfferimage = function(login) {
	  console.log("This is factory is offer image in client app.js save");
    return $http.post(urlBase,login);
  };
 
  _addofferimageService.updateofferimage = function(login) {
    return $http.put(urlBase, login);
  };
 
  _addofferimageService.deleteOfferimage = function(id) {
    return $http.delete(urlBase + '/' + id);
  };
 
  return _addofferimageService;
})



.factory('loginsFactory', function($http) {
  var urlBase = 'http://104.155.192.54:8080/api/logins';
  var _loginService = {};
 
  _loginService.getLogins = function() {
    return $http.get(urlBase);
  };
 
  _loginService.saveLogin = function(login) {
	  
	  
	  
	  console.log("This is factory Login is app.js save");
    return $http.post(urlBase,login);
  };
 
  _loginService.updateLogin = function(login) {
    return $http.put(urlBase, login);
  };
 
  _loginService.deleteLogin = function(id) {
    return $http.delete(urlBase + '/' + id);
  };
 
  return _loginService;
})




.run(function($rootScope, auth, store, jwtHelper, $location) {
  // This events gets triggered on refresh or URL change
  var refreshingToken = null;
  $rootScope.$on('$locationChangeStart', function() {
    var token = store.get('token');
    var refreshToken = store.get('refreshToken');
    if (token) {
      if (!jwtHelper.isTokenExpired(token)) {
        if (!auth.isAuthenticated) {
          auth.authenticate(store.get('profile'), token);
        }
      } else {
        if (refreshToken) {
          if (refreshingToken === null) {
              refreshingToken =  auth.refreshIdToken(refreshToken).then(function(idToken) {
                store.set('token', idToken);
                auth.authenticate(store.get('profile'), idToken);
              }).finally(function() {
                  refreshingToken = null;
              });
          }
          return refreshingToken;
        } else {
          $location.path('/login');
        }
      }
    }

  });
})

.config(function($stateProvider, $urlRouterProvider, authProvider, $httpProvider,
  jwtInterceptorProvider) {
  
  
   jwtInterceptorProvider.tokenGetter = function(store, jwtHelper, auth) {
    var idToken = store.get('token');
    var refreshToken = store.get('refreshToken');
    // If no token return null
    if (!idToken || !refreshToken) {
      return null;
    }
    // If token is expired, get a new one
    if (jwtHelper.isTokenExpired(idToken)) {
      return auth.refreshIdToken(refreshToken).then(function(idToken) {
        store.set('token', idToken);
        return idToken;
      });
    } else {
      return idToken;
    }
  }

  $httpProvider.interceptors.push('jwtInterceptor');
  
  
  
  $stateProvider
  .state('app', {
    url: "/app",
  cache:false,
  abstract: true,
    templateUrl: "templates/menu.html",
    controller: 'AppCtrl'
  })
 .state('app.login', {
    url: "/login",
    views: {
      'menuContent': {
	        templateUrl: "templates/login.html",
			 controller: 'AppCtrl'
      }
    }
  })
  .state('app.addoffer', {
	   cache:false,
    url: "/addoffer",
    views: {
      'menuContent': {
	        templateUrl: "templates/merchantregister.html",
			 controller: 'merchantregister'
      }
    }
  })
  .state('app.dashboardlogin', {
	   cache:false,
    url: "/dashboardlogin",
    views: {
      'menuContent': {
	        templateUrl: "templates/dashboardlogin.html",
			 controller: 'dashboardcontroller'
      }
    }
  })
 .state('app.addoffer1', {
	  cache:false,
    url: "/addoffer1",
    views: {
      'menuContent': {
	        templateUrl: "templates/addoffer.html",
			 controller: 'MapCtrl'
      }
    }
  })
  .state('app.dashboard', {
	  cache:false,
    url: "/dashboard",
    views: {
      'menuContent': {
	        templateUrl: "templates/dashboard.html",
			 controller: 'dashboardcontroller'
      },
            'fabContent': {
                template: '<button id="add-offer" class="button button-fab button-fab-bottom-right button-assertive " ng-click="onaddoffer()"><i class="icon ion-plus"  ></i></button>',
                controller: 'dashboardcontroller'
            }
    }
  })
  .state('app.browse', {
	   cache:false,
    url: "/browse",
    views: {
      'menuContent': {
        templateUrl: "templates/browse.html",
		 controller: 'MapCtrl'
      }
    }
  })
    .state('app.playlists', {
		 cache:false,
      url: "/playlists",
      views: {
        'menuContent': {
          templateUrl: "templates/playlists.html",
          controller: 'ExampleController'
        }
      }
    })
	
 .state('app.offerview', {
		 cache: false,
      url: "/offerview",
      views: {
        'menuContent': {
          templateUrl: "templates/offerview.html",
          controller: 'ExampleController'
        }
      }
    })
  .state('app.single', {
	  cache: false,
    url: "/playlists/:playlistId",
    views: {
      'menuContent': {
        templateUrl: "templates/playlist.html",
        controller: 'ExampleController'
      }
    } 
  });
  
   authProvider.init({
    domain: 'lokaloffers.auth0.com',
    clientID: 'cWQeRf3L4Ength5tIFSrPhrNPUHgO6yQ',
    loginState: 'login'
  });

  
  
  
  
  
  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/app/login');
})
.run(function(auth) {
  // This hooks all auth events to check everything as soon as the app starts
  auth.hookEvents();
});

