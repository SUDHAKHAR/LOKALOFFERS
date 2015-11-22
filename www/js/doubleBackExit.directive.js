angular.module('tnf.IonicUtils', ['ionic'])
  // <tnf-dbl-back-exit></tnf-dbl-back-exit>
  .directive('tnfDblBackExit', function ($ionicPlatform, $timeout) {
	  console.log("This is Double click directive.");
    return {
      scope: {},
      restrict: 'E',
      template: '<div class="double-press-exit-label"><span class="label"> </span></div>',
      replace: true,
      transclude: true,      
      link: function($scope, iElm, iAttrs, controller) {
        var exitApp = 0;

        var backButtonHandler = $ionicPlatform.registerBackButtonAction(function (e) {
          e.preventDefault();

          if (exitApp === 1) {
            $scope.hide();
            ionic.Platform.exitApp();
          } else {
            $scope.show();
            exitApp++;
          }
        }, 100);

        $scope.$on('$destroy', function () {
          backButtonHandler();
        });

        $scope.show = function () {
          iElm.addClass('show');
          $timeout(function(){
            exitApp = 0;
            $scope.hide();
          }, 1500);
        };

        $scope.hide = function () {
          iElm.removeClass('show');
        };

        $scope.hide();
      }
    };
  });