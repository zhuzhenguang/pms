/**
 * Created by zhu on 14-4-20.
 */
function mysingle() {
    var ep = document.getElementById('EpAdmC'),
        frmObj = document.getElementById('frm');

    try {
        var rrtn = ep.GetSecureBox();
        if (rrtn && rrtn != '') {
            frmObj.userData.value = rrtn;
            $.getJSON(frmObj.action, $(frmObj).serialize() + '&_=' + new Date().getTime(), function (data) {
                $('#username').text(data.username);
                $('#department').text(data.department);
                $('.commonbtn').show();
            });
        } else {
            $('.commonbtn').hide();
            alert('请先登录SSO!');
        }
    } catch (error) {
        alert('请用IE8以上浏览器浏览');
    }
}

var pmsController = angular.module('pmsController', []);

/**
 * 根 Controller
 */
pmsController.controller('AppCtrl', ['$scope', function ($scope) {
    $scope.$on('InsertFromNewCtrl', function () { // 监听插入动作
        $scope.$broadcast("InsertFromAppCtrl", {
            from: 0, rows: 10,
            projectTypeId: '',
            salesRepresentativeId: angular.element('#username').text()
        }); // 广播
    });
}]);

/**
 * 主界面设定
 */
pmsController.controller('MainCtrl', ['$scope', function ($scope) {
    $scope.top = function () {
        var header = angular.element('.header');
        if (header.css('display') == 'none') {
            header.show(500);
        } else {
            header.hide(500);
        }
    };

    $scope.close = function () {
        //window.close();
    };

    //mysingle();
}]);

/**
 * 项目管理
 */
pmsController.controller('ProjectCtrl', ['$scope', 'Projects', 'Modal', 'Properties', 'Validator', 'EXCEL_PATH',
    function ($scope, Projects, Modal, Properties, Validator, EXCEL_PATH) {
        $scope.originalSearchCondition = {}; // 默认的查询条件为空

        /**
         * 查询操作
         */
        $scope.search = function () {
            Modal.loading.open();

            $scope.changeIndexes = {};
            $scope.deleteIds = {};

            if (arguments.length == 1) {
                initCondition(arguments[0]);
            }

            setTimeout(function () {
                //console.log($scope.searchCondition);
                Projects.query($scope.searchCondition, function (result) {
                    Modal.loading.close();
                    $scope.projects = result.projects;
                    //console.log($scope.projects);

                    if ($scope.projects.length == 0) {
                        $scope.excelPath = EXCEL_PATH.none;
                        return;
                    }

                    // 复制一份原件，留作更新时的比较
                    $scope.originalProjects = angular.copy(result.projects);
                    // 旧的查询条件也要复制，为了方便删除、更新后的查询
                    $scope.originalSearchCondition = angular.copy($scope.searchCondition);

                    initPage(result);
                    $scope.excelPath = EXCEL_PATH.correct($scope.originalSearchCondition);
                });
            }, 500);

            /* 初始化分页信息 */
            function initPage(result) {
                $scope.page = {
                    count: result.count,                                // 一共几行
                    currentPageNo: result.pageNo,                      // 当前第几页
                    rows: result.rows,                                  // 每页几行
                    pageCount: Math.ceil(result.count / result.rows), // 一共几页
                    pageArray: []
                };
                for (var i = 0; i < $scope.page.pageCount; i++) {
                    $scope.page.pageArray.push(i + 1);
                }
            }

            /* 初始化信息 */
            function initCondition(param) {
                if (angular.isObject(param)) { // 参数是查询条件(点击查询按钮)
                    param.from = 0;             // 查询都从第一页开始
                    $scope.searchCondition = param;
                } else if (angular.isNumber(param) && $scope.searchCondition) { // 或者参数是页码(分页查询)
                    $scope.searchCondition.from = (param - 1) * $scope.page.rows;
                }
            }
        };

        /**
         * 新增弹出
         */
        $scope.add = function () {
            Modal.projectNew.open();
        };

        /**
         * 更新操作
         */
        $scope.update = function () {
            var updatedProjects = [];
            for (var index in $scope.changeIndexes) {
                if ($scope.changeIndexes.hasOwnProperty(index)) {
                    if (!Validator.validate($scope.projects[index])) {
                        return;
                    }
                    updatedProjects.push($scope.projects[index]);
                }
            }
            //console.log(updatedProjects);
            if (updatedProjects.length == 0) {
                return;
            }
            Projects.update(updatedProjects, function () {
                $scope.search($scope.originalSearchCondition);
            });
        };

        /**
         * 删除操作
         */
        $scope.remove = function () {
            var deletedProjectsId = [];
            for (var id in $scope.deleteIds) {
                if ($scope.deleteIds.hasOwnProperty(id)) {
                    deletedProjectsId.push(id);
                }
            }
            if (deletedProjectsId.length == 0) {
                return;
            }
            Modal.removeWarning.open(function () {
                //console.log(deletedProjectsId);
                Projects.remove({"ids": deletedProjectsId.join(";")}, function () {
                    $scope.search($scope.originalSearchCondition);
                });
            });
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
            //console.log(projectId);
            $element.toggleClass('checkbox_on');
            if ($element.hasClass('checkbox_on')) {
                $scope.deleteIds[projectId] = true;
            } else {
                delete $scope.deleteIds[projectId];
            }
        };

        $scope.excelPath = EXCEL_PATH.none;

        $scope.mapping = {
            "true": "是",
            "false": "否"
        };

        $scope.changeIndexes = {};
        $scope.deleteIds = {};

        Modal.loading.register();

        $scope.$on('InsertFromAppCtrl', function (event, searchCondition) {// 插入后执行查询，只查当前人员的
            $scope.search(searchCondition);
        });
    }
]);

/**
 * Excel下载路径
 */
pmsController.constant('EXCEL_PATH', {
    "none": "#",
    "correct": function (s) {
        return "views/excel?corporation="           + (s.corporation || '') +
                           "&salesRepresentativeId=" + (s.salesRepresentativeId || '') +
                           "&projectTypeId="         + (s.projectTypeId || '') +
                           "&projectNo="             + (s.projectNo || '') +
                           "&estimateContractDate="  + (s.estimateContractDate || '') +
                           "&contract="              + (s.contract || '');
    }
});

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
            projectType: {"id": 1},
            manMonths: [
                {"department": "SSDG"},
                {"department": "Architecture"},
                {"department": "保安"}
            ]
        };// radio先给默认值

        $scope.add = function () {
            //console.log($scope.project);
            if (Validator.validate($scope.project)) {
                Project.save($scope.project, function () {
                    $scope.close();
                    $scope.$emit('InsertFromNewCtrl'); // 插入后，冒泡给父亲
                });
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

pmsController.controller('RemoveWarningCtrl', ['$scope', 'Modal', function ($scope, Modal) {
    Modal.removeWarning.register();

    $scope.close = function () {
        Modal.removeWarning.close();
    };

    $scope.confirm = function () {
        Modal.removeWarning.confirm();
    };
}]);

/**
 * 搜索
 */
pmsController.controller('SearchCtrl', ['$scope', '$rootScope', 'CONTRACT',
    function ($scope, $rootScope, CONTRACT) {
        $scope.searchCondition = {from: 0, rows: 10, projectTypeId: ''};

        $scope.radio = function (id) {
            $scope[CONTRACT[id]] = "radio_true";
            $scope[CONTRACT[Math.abs(id - 1)]] = "";
            $scope.searchCondition.contract = (id == 0);
        };

        $scope.$on('InsertFromAppCtrl', function (event, searchCondition) {
            $scope.searchCondition = searchCondition;
        });
    }
]);

pmsController.constant('CONTRACT', ['contractY', 'contractN']);