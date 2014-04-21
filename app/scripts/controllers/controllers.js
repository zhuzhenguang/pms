/**
 * Created by zhu on 14-4-20.
 */
var pmsController = angular.module('pmsController', []);

pmsController.controller('MainCtrl', ['$scope', 'Resize', function ($scope, Resize) {
    angular.element('.searchbox select').selectbox();
    Resize.execute();

    $scope.pop = function() {
        angular.element('.pop_new').dialog('open');
    }
}]);

pmsController.controller('ProjectCtrl', ['$scope', 'Project', function ($scope, Project) {
    $scope.projects = Project.query();
}]);

pmsController.controller('PopCtrl', ['$scope', function($scope) {
    angular.element('.pop_new').dialog({
        //dialogClass: "no-close",
        modal: true,
        width: 670,
        /*height: 480,*/
        autoOpen: false,
        show: {
            effect: "blind",
            duration: 1000
        },
        hide: {
            effect: "fade",
            duration: 1000
        }
    });

    $scope.close = function() {
        angular.element('.pop_new').dialog('close');
    }
}]);