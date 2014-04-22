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

    return {
        execute: function () {
            angular.element(window).resize(function () {
                adjustHeight();
            });
            adjustHeight();
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
    var projectNewModel = {
        register: function () {
            this.modal = this.modal || angular.element('.pop_new');
            this.modal.dialog({
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
        },

        close: function () {
            this.modal.dialog('close');
        },

        open: function() {
            this.modal.dialog('open');
        }
    };

    return {
        projectNew: projectNewModel
    };

});

pmsService.factory('Project', ['$resource', function ($resource) {
    return $resource('scripts/projects/query_results.json', {}, {
        query: {method: 'GET', isArray: true}
    });
}]);

pmsService.factory('ProjectType', ['$resource', function($resource) {
    return $resource('scripts/projects/project_types.json', {}, {
        query: {method: 'GET', isArray: true}
    })
}]);