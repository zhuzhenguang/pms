/**
 * Created by zhu on 14-4-20.
 */
var pmsDirective = angular.module('pmsDirective', []);

pmsDirective.directive('datePicker', ['DateSelector', function(DateSelector) {
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