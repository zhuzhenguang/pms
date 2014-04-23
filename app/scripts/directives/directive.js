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
            if (scope.project && scope.project.projectType) {
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

pmsDirective.directive('integer', function () {
    var number = [48, 49, 50, 51, 52, 53, 54, 55, 56, 57];
    function link(scope, element, attrs) {
        element.on('keypress', function(e) {
            if ($.inArray(e.keyCode, number) == -1) {
                e.preventDefault();
            }
        });
    }

    return {
        link: link
    }
});

pmsDirective.directive('double', function () {
    var number = [48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 46];
    function link(scope, element, attrs) {
        element.on('keypress', function(e) {
            if ($.inArray(e.keyCode, number) == -1) {
                e.preventDefault();
            }
        });
    }

    return {
        link: link
    }
});