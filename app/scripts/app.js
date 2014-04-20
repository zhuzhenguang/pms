/**
 * Created by zhu on 14-4-20.
 */
var pmsApp = angular.module('pmsApp', [
    'ngRoute',
    'pmsController',
    'pmsService',
    'pmsDirective'
]);

pmsApp.config(['$routeProvider',
    function ($routeProvider) {
        $routeProvider.
            otherwise({
                templateUrl: 'views/main.html',
                controller: 'MainCtrl'
            });
    }]);