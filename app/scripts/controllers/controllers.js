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

        $scope.top = function() {
            var header = angular.element('.header');
            if (header.css('display') == 'none') {
                Resize.execute();
                header.show(500);
            } else {
                header.hide(500, function() {
                    Resize.top();
                });
            }
        };
    }
]);

/**
 * 项目管理
 */
pmsController.controller('ProjectCtrl', ['$scope', 'Projects', 'Modal', 'Properties', 'Validator',
    function ($scope, Projects, Modal, Properties, Validator) {

        $scope.search = function () {
            if (arguments.length == 1) {
                var param = arguments[0];
                if (angular.isObject(param)) {// 参数是查询条件
                    $scope.searchCondition = param;
                } else if (angular.isNumber(param) && $scope.searchCondition) {// 或者参数是页码
                    $scope.searchCondition.from = (param - 1) * $scope.page.rows;
                }
            }

            console.log($scope.searchCondition);
            Projects.query($scope.searchCondition, function (result) {
                $scope.projects = result.projects;
                $scope.originalProjects = angular.copy(result.projects);
                initPage(result);
            });
        };

        function initPage(result) {
            $scope.page = {
                count: result.count,
                currentPageNo: result.pageNo,
                rows: result.rows,
                pageCount: result.count / result.rows,
                pageArray: []
            };
            for (var i = 0; i < $scope.page.pageCount; i++) {
                $scope.page.pageArray.push(i + 1);
            }
        }

        $scope.add = function () {
            Modal.projectNew.open();
        };

        $scope.update = function () {
            var updatedProjects = [];
            for (var index in $scope.changeIndexes) {
                if ($scope.changeIndexes.hasOwnProperty(index) ) {
                    if (!Validator.validate($scope.projects[index])) {
                        return;
                    }
                    updatedProjects.push($scope.projects[index]);
                }
            }
            console.log(updatedProjects);
            //Projects.update(updatedProjects);
        };

        $scope.remove = function () {
            var deletedProjectsId = [];
            for (var id in $scope.deleteIds) {
                if ($scope.deleteIds.hasOwnProperty(id)) {
                    deletedProjectsId.push(id);
                }
            }
            console.log(deletedProjectsId);
            //Projects.remove(deletedProjectsId);
        };

        /**
         * 记录表格的变化，为更新做准备
         *
         * @param $event
         * @param $index
         * @param properties
         */
        $scope.record = function ($event, $index, properties) {
            var originalValue = Properties.get($scope.originalProjects[$index], properties),
                currentValue = Properties.get($scope.projects[$index], properties);
            if (originalValue != currentValue) {
                $scope.changeIndexes[$index] = true;
            } else {
                delete $scope.changeIndexes[$index]
            }
        };

        /**
         * 自定义radio的变化
         *
         * @param $index
         * @param prop
         * @param $event
         */
        $scope.radio = function ($index, prop, $event) {
            if (!angular.element($event.currentTarget).hasClass('radio_true')) {
                var value = $scope.projects[$index][prop];
                $scope.projects[$index][prop] = !value;
                /* radio改变都要记录 */
                $scope.record($event, $index, prop);
            }
        };

        /**
         * 自定义checkbox的变化
         *
         * @param $event
         * @param $index
         */
        $scope.checkbox = function ($event, $index) {
            var $element = angular.element($event.currentTarget),
                projectId = $scope.projects[$index].id;
            console.log(projectId);
            $element.toggleClass('checkbox_on');
            if ($element.hasClass('checkbox_on')) {
                $scope.deleteIds[projectId] = true;
            } else {
                delete $scope.deleteIds[projectId];
            }
        };

        $scope.mapping = {
            "true": "是",
            "false": "否"
        };

        $scope.changeIndexes = {};
        $scope.deleteIds = {};
    }
]);

/**
 * 新增功能的控制
 */
pmsController.controller('NewCtrl', ['$scope', 'Modal', 'Project', 'Validator',
    function ($scope, Modal, Project, Validator) {
        Modal.projectNew.register();

        $scope.project = {
            relateSDSK: true,
            inputSAP: true,
            contract: true,
            editable: true,
            manMonths: [
                {},
                {},
                {}
            ]
        };// radio先给默认值

        $scope.add = function () {
            console.log($scope.project);
            if (Validator.validate($scope.project)) {
                //Project.save($scope.project);
                $scope.close();
            }
        };

        /**
         * 自定义radio变幻
         *
         * @param prop
         * @param $event
         */
        $scope.radio = function (prop, $event) {
            if (!angular.element($event.currentTarget).hasClass('radio_true')) {
                var value = $scope.project[prop];
                $scope.project[prop] = !value;
            }
        };

        $scope.close = function () {
            Modal.projectNew.close();
        };
    }
]);

/**
 * 搜索
 */
pmsController.controller('SearchCtrl', ['$scope', '$rootScope', 'CONTRACT',
    function ($scope, $rootScope, CONTRACT) {
        $scope.searchCondition = {from: 0, rows: 10};

        $scope.radio = function (id) {
            $scope[CONTRACT[id]] = "radio_true";
            $scope[CONTRACT[Math.abs(id - 1)]] = "";
            $scope.searchCondition.contract = (id == 0);
        };
    }
]);

pmsController.constant('CONTRACT', ['contractY', 'contractN']);