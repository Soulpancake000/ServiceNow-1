function () {
    return {
        require: '?ngModel',
        restrict: 'A',
        link: function (scope, element, attrs, ngModel) {
            if (!ngModel) return; // do nothing if no ng-model

            ngModel.$render = function () {
                element.find('input').val(ngModel.$viewValue || '');
            };

            element.datetimepicker({
                language: 'it',
                sideBySide: true,
                defaultDate: ngModel.$modelValue || false
            });

            element.on('dp.change', function () {
                scope.$apply(read);
            });
            element.on('dp.show', function () {
                element.data('DateTimePicker').setDate(new Date(ngModel.$viewValue));
            });

            read();

            function read() {
                var value = element.find('input').val();
                ngModel.$setViewValue(value);
            }
        }
    }
}