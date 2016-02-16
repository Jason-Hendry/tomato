'use strict';

angular.module('app.wysiwyg', [
    'textAngular'
])
    //.config(['taOptions', function (taOptions) {
    //    taOptions.toolbar = [['']]
    //}])
;

// Declare app level module which depends on views, and components
angular.module('myApp', [
    'ngRoute',
    'myApp.timer',
    'myApp.login',
    'myApp.version',
    'ngDraggable',
    'app.wysiwyg'
]).
directive('ngEnter', function () {
    return function (scope, element, attrs) {
        element.bind("keyup", function (event) {
            if (event.which === 13) {
                scope.$apply(function () {
                    scope.$eval(attrs.ngEnter);
                });
                event.preventDefault();
            }
        });
    };
}).
config(['$routeProvider', function ($routeProvider) {

    $routeProvider.otherwise({redirectTo: '/login'});
}]);

window.addEventListener("beforeunload", function (event) {
    event.returnValue = "Don't leave stuff will break";
});

(function () {
    window._harvestPlatformConfig = {
        "applicationName": "Tomato Timer"
    };
    var s = document.createElement("script");
    s.src = "https://platform.harvestapp.com/assets/platform.js";
    s.async = true;
    var ph = document.getElementsByTagName("script")[0];
    ph.parentNode.insertBefore(s, ph);
})();