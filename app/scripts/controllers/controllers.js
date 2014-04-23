/**
 * Created by zhu on 14-4-20.
 */
var pmsController = angular.module('pmsController', []);

/**
 * 主界面设定
 */
pmsController.controller('MainCtrl', ['$scope', 'Resize',
    function ($scope, Resize) {
        Resize.execute();
    }
]);

/**
 * 项目管理
 */
pmsController.controller('ProjectCtrl', ['$scope', 'Project', 'Modal', 'Properties',
    function ($scope, Project, Modal, Properties) {
        $scope.search = function(searchCondition) {
            console.log(searchCondition);
            $scope.projects = Project.query(searchCondition, function(projects) {
                $scope.originalProjects = angular.copy(projects);
            });
        };

        $scope.add = function () {
            Modal.projectNew.open();
        };

        $scope.update = function() {

        };

        $scope.remove = function() {

        };

        $scope.record = function($event, $index, properties) {
            var originalValue = Properties.get($scope.originalProjects[$index], properties),
                //$element = angular.element($event.currentTarget),
                currentValue = Properties.get($scope.projects[$index], properties);
            if (originalValue != currentValue) {
                $scope.changeIndexes[$index] = true;
            } else {
                delete $scope.changeIndexes[$index]
            }

            console.log(originalValue);
            console.log(currentValue);
            console.log($scope.changeIndexes);
        };

        $scope.radio = function(index, prop, $event) {
            if (!angular.element($event.currentTarget).hasClass('radio_true')) {
                var value = $scope.projects[index][prop];
                $scope.projects[index][prop] = !value;
            }
        };

        $scope.mapping = {
            "true": "是",
            "false": "否"
        };

        $scope.changeIndexes = {};
    }
]);

/**
 * 弹出层管理
 */
pmsController.controller('PopCtrl', ['$scope', 'Modal', function ($scope, Modal) {
    Modal.projectNew.register();

    $scope.close = function () {
        Modal.projectNew.close();
    };
}]);

/**
 * 搜索
 */
pmsController.controller('SearchCtrl', ['$scope', '$rootScope', 'CONTRACT', 'Project',
    function ($scope, $rootScope, CONTRACT, Project) {
        $scope.searchCondition = {from: 0, rows: 10};

        $scope.radio = function (id) {
            $scope[CONTRACT[id]] = "radio_true";
            $scope[CONTRACT[Math.abs(id - 1)]] = "";
            $scope.searchCondition.contract = (id == 0);
        };
    }
]);

pmsController.constant('CONTRACT', ['contractY', 'contractN']);