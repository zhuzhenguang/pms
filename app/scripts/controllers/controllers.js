/**
 * Created by zhu on 14-4-20.
 */
var pmsController = angular.module('pmsController', []);

pmsController.controller('MainCtrl', ['$scope', 'Resize', 'Modal',
    function ($scope, Resize, Modal) {
        Resize.execute();

        $scope.pop = function () {
            Modal.projectNew.open();
        }
    }
]);

pmsController.controller('ProjectCtrl', ['$scope', 'Project', function ($scope, Project) {
    $scope.projects = Project.query();
}]);

pmsController.controller('PopCtrl', ['$scope', 'Modal', function ($scope, Modal) {
    Modal.projectNew.register();

    $scope.close = function () {
        Modal.projectNew.close();
    };
}]);

pmsController.controller('SearchCtrl', ['$scope', 'CONTRACT', 'ProjectType', function ($scope, CONTRACT, ProjectType) {
    $scope.radio = function (id) {
        $scope[CONTRACT[id]] = "radio_on";
        $scope[CONTRACT[Math.abs(id - 1)]] = "";
    };

    ProjectType.query()
        .$promise.then(function(projectTypes) {
            $scope.projectTypes = projectTypes;
            angular.element('.searchbox select').selectbox();
        })
}]);

pmsController.constant('CONTRACT', ['contractY', 'contractN']);