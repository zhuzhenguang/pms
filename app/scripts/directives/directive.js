/**
 * Created by zhu on 14-4-20.
 */
var pmsDirective = angular.module('pmsDirective', []);

pmsDirective.directive('ngDatePicker', ['DateSelector', function (DateSelector) {
    function link(scope, element, attrs) {
        var $element = angular.element(element);
        if ($element.hasClass('date')) {
            DateSelector.configDate($element);
        } else if ($element.hasClass('month')) {
            DateSelector.configMonth($element);
        }
    }

    return {
        link: link
    };
}]);

pmsDirective.directive('ngSelect', function () {
    function link(scope, element, attrs) {
        if (!scope.project || scope.project.editable) {
            var $element = angular.element(element);
            if (scope.project) {
                var id = scope.project.projectType.id;
                $element.find('[value=' + id + ']').attr('selected', true);
            }
            $element.selectbox();
        }
    }

    return {
        link: link
    };
});

pmsDirective.directive('ngGrid', function () {
    function link(scope, element, attrs) {

    }
});