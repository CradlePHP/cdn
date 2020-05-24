/**
 * number_format - javascript/jquery equivalent of number_format in php with additional abilities
 *
 * @version 0.0.1
 * @author April Sacil <aprilvsacil@gmail.com>
 * @website https://github.com/aprilsacil/number_format
 * @license MIT
 */
/*
 * $(element).number(2, '.', ',');
 */
jQuery.fn.extend({
    number_format: function (decimalLength, decimal, separator) {
         if (typeof separator == 'undefined') {
             separator = ',';
         }

         if (typeof decimal == 'undefined') {
             decimal = '.';
         }

         if (typeof decimalLength == 'undefined') {
             decimalLength = 2;
         }
         return this.each(function () {
            var elem = $(this);
            var cents = '';
            var factor = Math.pow(10, decimalLength);
            var number = $.trim(elem.html()).split('.');

            var integer = number[0];
            if (decimalLength
                && number.length > 1
                && number[1]
            ) {
                number[1] = 0 + '.' + number[1];
                cents = Math.round(number[1] * factor) / factor;
                cents = !cents ? '' : cents.toString().replace('0.', decimal);
            }
            var regex = /(\d+)(\d{3})/;
            while (regex.test(integer)) {
                integer = integer.replace(regex, '$1' + separator + '$2');
            }

            elem.html(integer + cents);
         });
     }
});

/*
 * $.number('5125.123', 2, '.', ',');
 */
jQuery.extend({
    number_format: function (number, decimalLength, decimal, separator) {
        var cents = '';
        if (typeof separator == 'undefined') {
            separator = ',';
        }

        if (typeof decimal == 'undefined') {
            decimal = '.';
        }

        if (typeof decimalLength == 'undefined') {
            decimalLength = 0;
        }

        var factor = Math.pow(10, decimalLength);
        var number = number.toString().split('.');
        var integer = number[0];

        if (decimalLength
            && number.length > 1
            && number[1]
        ) {
            number[1] = 0 + '.' + number[1];
            cents = Math.round(number[1] * factor) / factor;
            cents = !cents ? '' : cents.toString().replace('0.', decimal);
        }

        var regex = /(\d+)(\d{3})/;
        while (regex.test(integer)) {
            integer = integer.replace(regex, '$1' + separator + '$2');
        }

        return integer + cents;
    }
});
