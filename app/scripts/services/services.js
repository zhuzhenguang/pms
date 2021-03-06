/**
 * Created by zhu on 14-4-20.
 */
var pmsService = angular.module('pmsService', ['ngResource']);

pmsService.factory('Resize', function () {
    function adjustHeight() {
        var wh = angular.element(document).height();
        angular.element('#contents').height(wh - 66 - 25);
        angular.element('#data').height(wh - 66 - 25 - 176);
    }

    function topHeight() {
        var wh = angular.element(document).height();
        angular.element('#contents').height(wh - 25);
        angular.element('#data').height(wh - 25 - 176);
    }

    return {
        execute: function () {
            angular.element(window).unbind('resize').resize(function () {
                adjustHeight();
            });
            adjustHeight();
        },

        top: function () {
            angular.element(window).unbind('resize').resize(function () {
                topHeight();
            });
            topHeight();
        }
    };
});

pmsService.factory('DateSelector', function () {
    return {
        configDate: function ($element) {
            $element.datepicker({});
        },

        configMonth: function ($element) {
            $element.datepicker({
                dateFormat: 'yy.mm'
            });
        }
    };
});

pmsService.factory('Modal', function () {
    /**
     * 新建项目的Modal
     *
     * @type {{register: register, close: close, open: open}}
     */
    var projectNewModel = {
        register: function () {
            this.modal = this.modal || angular.element('.pop_new');
            this.modal.dialog({
                modal: true,
                width: 730,
                /*height: 480,*/
                autoOpen: false,
                show: {
                    effect: "blind",
                    duration: 500
                },
                hide: {
                    effect: "fade",
                    duration: 500
                }
            });
        },

        close: function () {
            this.modal.dialog('close');
        },

        open: function () {
            this.modal.dialog('open');
        }
    };

    /**
     * 删除提示的Modal
     *
     * @type {{register: register, close: close, open: open, confirm: confirm}}
     */
    var removeWarning = {
        register: function () {
            this.modal = this.modal || angular.element('.popup02_main');
            this.modal.dialog({
                modal: true,
                width: 503,
                /*height: 480,*/
                autoOpen: false,
                show: {
                    effect: "blind",
                    duration: 500
                },
                hide: {
                    effect: "fade",
                    duration: 500
                }
            });
        },

        close: function () {
            this.modal.dialog('close');
        },

        open: function (done) {
            if (done) {
                this.done = done;
            }
            this.modal.dialog('open');
        },

        confirm: function () {
            this.close();
            if (this.done && angular.isFunction(this.done)) {
                this.done();
            }
        }
    };

    /**
     * loading的Modal
     *
     * @type {{register: register, close: close, open: open}}
     */
    var loading = {
        register: function () {
            this.modal = this.modal || angular.element('#loading');
            this.modal.dialog({
                modal: true,
                width: 300,
                height: 190,
                autoOpen: false,
                show: {
                    effect: "blind",
                    duration: 100
                },
                hide: {
                    effect: "fade",
                    duration: 100
                }
            });
        },

        close: function () {
            this.modal.dialog('close');
        },

        open: function () {
            this.modal.dialog('open');
        }
    };

    return {
        projectNew: projectNewModel,
        removeWarning: removeWarning,
        loading: loading
    };

});

pmsService.factory('Projects', ['$resource', function ($resource) {
    return $resource('api/projects:ids', {}, {
        query: {method: 'POST', isArray: false},
        update: {method: 'PUT'},
        remove: {method: 'DELETE'}
    });
}]);

pmsService.factory('Project', ['$resource', function ($resource) {
    return $resource('api/project', {}, {
        save: {method: 'POST'}
    });
}]);

pmsService.factory('ProjectType', ['$resource', function ($resource) {
    return $resource('scripts/projects/project_types.json', {}, {
        query: {method: 'GET', isArray: true}
    })
}]);

pmsService.factory('Properties', function () {
    return {
        get: function (object, prop) {
            var properties = prop.split('.'),
                i, l = properties.length, o = object;
            for (i = 0; i < l; i++) {
                o = o[properties[i]];
            }
            return o;
        }
    };
});

pmsService.factory('Validator', function () {
    var requiredProperties = {
        projectName: "项目名称",
        corporation: "法人"
    };
    return {
        validate: function (project) {
            for (var prop in requiredProperties) {
                if (requiredProperties.hasOwnProperty(prop) &&
                    (!project[prop] || $.trim(project[prop]) == '')) {
                    alert(requiredProperties[prop] + "为必录项目！");
                    return false;
                }
            }
            return true;
        }
    };
});