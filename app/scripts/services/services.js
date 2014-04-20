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

pmsService.factory('DateSelector', function() {
    return {
        configDate: function($element) {
            $element.datepicker({});
        },

        configMonth: function($element) {
            $element.datepicker({
                dateFormat: 'yy.mm'
            });
        }
    };
});

pmsService.factory('Project', ['$resource', function ($resource) {
    return $resource('scripts/projects/query_results.json', {}, {
        query: {method: 'GET', isArray: true}
    });
}]);