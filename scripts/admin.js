jQuery(function ($) {
    /**
     * Report Related Scripts
     */
    (function () {
        /**
         * Report Chart Page UI
         */
        $(window).on('report-init', function (e, target) {
            var onAcquire = function () {
                var chartType = $(target).data('chart');
                var chartLabel = $(target).data('label');
                var dataset = $(target).data('dataset');
                var fill = false;
                var labels = [];
                var options = {
                    'scales': {}
                };

                if ($(target).data('x_axis')) {
                    options.scales.xAxes = [$(target).data('x_axis')];
                }

                if ($(target).data('y_axis')) {
                    options.scales.yAxes = [$(target).data('y_axis')];
                }

                if ($(target).data('fill') != '') {
                    fill = $(target).data('fill');
                }

                if ($(target).data('circle') == 'half') {
                    options.rotation = Math.PI;
                    options.circumference = Math.PI;
                }

               // TODO: Find a way to add chart options,
               // like colors, borderColors etc
                var data = {
                    datasets: [
                       {
                            data: dataset,
                            backgroundColor: [
                               'rgba(54, 162, 235, 0.2)',
                               'rgba(255, 99, 132, 0.2)',
                               'rgba(255, 206, 86, 0.2)',
                               'rgba(75, 192, 192, 0.2)',
                               'rgba(153, 102, 255, 0.2)',
                               'rgba(255, 159, 64, 0.2)'
                            ],
                            borderColor: [
                               'rgba(54, 162, 235, 1)',
                               'rgba(255,99,132,1)',
                               'rgba(255, 206, 86, 1)',
                               'rgba(75, 192, 192, 1)',
                               'rgba(153, 102, 255, 1)',
                               'rgba(255, 159, 64, 1)'
                            ],
                            borderWidth: 1,
                            fill: fill
                    }
                    ]
                };

                if (chartType == 'pie' || chartType == 'doughnut') {
                    data.labels = chartLabel;
                } else {
                    data.datasets[0].label = chartLabel;
                }

                var myChart = new Chart($(target), {
                    type: chartType,
                    data: data,
                    options: options
                });
            };

            $.require([
                'components/moment/moment.js',
                'components/chart.js/dist/Chart.bundle.min.js',
                'components/handlebars/dist/handlebars.js'
            ], onAcquire);
        });

        /**
         * Show appropriate additional fields according to
         * what chart type was choosen by the user
         */
        $(window).on('show-report-fields-init', function (e, target) {
            var chart = $(target).val();
            var fields = $('#' + chart + '-fields').html();
            $('#additional-fields-wrapper').html('');
            $('#additional-fields-wrapper').html(fields);

            if (chart == 'bar' || chart == 'line' || chart == 'area') {
                fields = $('#bar-line-fields').html();
                $('#additional-fields-wrapper').append(fields);
            }

            if (chart == 'pie' || chart == 'doughnut') {
                fields = $('#circular-fields').html();
                $('#additional-fields-wrapper').append(fields);
            }

            $('#additional-fields-wrapper .form-group').doon();
        });

        $(window).on('show-report-fields-change', function (e, target) {
            var chart = $(target).val();
            var fields = $('#' + chart + '-fields').html();
            $('#additional-fields-wrapper').html('');
            $('#additional-fields-wrapper').html(fields);

            if (chart == 'bar' || chart == 'line' || chart == 'area') {
                fields = $('#bar-line-fields').html();
                $('#additional-fields-wrapper').append(fields);
            }

            if (chart == 'pie' || chart == 'doughnut') {
                fields = $('#circular-fields').html();
                $('#additional-fields-wrapper').append(fields);
            }

            $('#additional-fields-wrapper .form-group').doon();
        });

        /**
         * Show appropriate additional fields according to
         * what report type was choosen by the user
         */
        $(window).on('show-table-fields-change', function (e, target) {
            var display = $(target).val();
            var metafield = $($(target).parents('.form-select')).data('name') + '[value]';

            var schema = $('.suggestion-value-report_schema').val();
            if (!schema) {
                schema = $('input[name="report_schema"]').val();
            }

            var value = $(target).data('value');

            if (display != 'number') {
                var axisFields = $('#column-fields').html();
                axisFields = axisFields.replace(/\{METAFIELD\}/g, metafield);
                axisFields = axisFields.replace(/\{SCHEMA\}/g, schema);
                axisFields = axisFields.replace(/\{VALUE\}/g, value);

                if ($(target).parents('.form-group').find('.schema-detail').length) {
                    $(target).parents('.form-group').find('.schema-detail').remove();
                }

                $(target).parents('.form-group').append(axisFields);

                $(target).parents('.form-group').doon();
            }
        });
        $(window).on('show-table-fields-init', function (e, target) {
            var display = $(target).val();
            var metafield = $($(target).parents('.form-select')).data('name') + '[value]';
            var schema = $('.suggestion-value-report_schema').val();
            if (!schema) {
                schema = $('input[name="report_schema"]').val();
            }

            var value = $(target).data('value');
            if (display != 'number') {
                var axisFields = $('#column-fields').html();
                axisFields = axisFields.replace(/\{METAFIELD\}/g, metafield);
                axisFields = axisFields.replace(/\{SCHEMA\}/g, schema);
                axisFields = axisFields.replace(/\{VALUE\}/g, value);

                $(target).parents('.form-group').append(axisFields);
                $(target).parents('.form-group').doon();
            }
        });

        $(window).on('circular-chart-table-fields-init', function (e, target) {
            var metafield = $(target).data('name');
            var schema = $('.suggestion-value-report_schema').val();
            if (!schema) {
                schema = $('input[name="report_schema"]').val();
            }

            var value = $(target).data('value');
            var axisFields = $('#column-fields').html();
            axisFields = axisFields.replace(/\{METAFIELD\}/g, metafield);
            axisFields = axisFields.replace(/\{SCHEMA\}/g, schema);
            axisFields = axisFields.replace(/\{VALUE\}/g, value);

            $(target).parents('.form-group').append(axisFields);
            $(target).parents('.form-group').doon();
        });

        /**
        * Do tasks that are for multiple dataset specific
        */
        $(document).on('change', 'input[name="report_meta[multiple]"]', function () {
            var ismultiple = $(this).is(':checked');
            // first, disable other options that should
            // only be available for multiple datasets
            $('option[multiple]').each(function () {
                if (!ismultiple) {
                    $(this).attr('disabled', 'disabled');
                } else {
                    $(this).removeAttr('disabled');
                }
            });
        });

         /**
          *
          */
         $(window).on('update-detail-url-change', function (e, target) {
             var schema = $('input[name="report_schema"]').val();
             $('select[name="report_chart"]').trigger('change');
         });
    })();
    /**
     * General Search
     */
    (function () {
        /**
         * Search filter more less toggle
         */
        $(window).on('search-filter-toggle-click', function (e, target) {
            if ($('i', target).hasClass('fa-caret-down')) {
                $('i', target)
                    .removeClass('fa-caret-down')
                    .addClass('fa-caret-up');
                $('span', target).html('less');
            } else {
                $('i', target)
                    .removeClass('fa-caret-up')
                    .addClass('fa-caret-down');
                $('span', target).html('more');
            }
        });

        /**
         * Search table check all
         */
        $(window).on('table-checkall-init', function (e, trigger) {
            var target = $(trigger).parents('table').eq(0);

            $(trigger).click(function () {
                if ($(trigger).prop('checked')) {
                    $('td input[type="checkbox"]', target).prop('checked', true);
                } else {
                    $('td input[type="checkbox"]', target).prop('checked', false);
                }
            });

            $('td input[type="checkbox"]', target).click(function () {
                var allChecked = true;
                $('td input[type="checkbox"]', target).each(function () {
                    if (!$(this).prop('checked')) {
                        allChecked = false;
                    }
                });

                $(trigger).prop('checked', allChecked);
            });
        });

        /**
         * Show unread history logs
         */
        $(window).on('history-init', function (e, trigger) {
            var target = $(trigger);
            var url = target.attr('data-init-url');

            if (typeof url === 'undefined') {
                return;
            }

            $.get(url, function (response) {
                //process data
                try {
                    response = JSON.parse(response);
                } catch (e) {
                    //fix for echos and print_r
                    response = {
                        error: false,
                        message: 'No new messages loaded',
                        results: {
                            rows: [],
                            total: 0
                        }
                    }
                }

                //if there's no results
                if (typeof response.results === 'undefined') {
                    return;
                }

                var rows = response.results.rows;

                rows.forEach(function (log, key) {
                    $('div.dropdown-menu #logs').append('<a class="dropdown-item" href="#">' +
                            '<img class="rounded-circle" src="/images/default-avatar.png" />' +
                            '<span class="notification-info">' +
                                '<span class="notification-message">' + log.history_activity + '</span>' +
                                '<em class="notification-time">' + log.ago + '</em>' +
                            '</span>' +
                        '</a>');

                    if (key == 4) {
                        $('div.dropdown-menu #logs').addClass('scroll');
                    }
                });

                if (rows.length === 0) {
                    $('div.dropdown-menu #logs').html('<a class="dropdown-item text-center" href="#">' +
                            '<span class="notification-info">' +
                                '<span class="notification-message">No New History</span>' +
                            '</span>' +
                        '</a>');

                    //add class
                    $('.notification-info').addClass('no-notification');

                    //remove doon
                    $('a.nav-link.dropdown-toggle').removeAttr('data-do');
                    $('a.nav-link.dropdown-toggle').removeAttr('data-on');
                }

                $('span#histories').html(response.results.total);
            });
        });

        /**
         * Search table check all
         */
        $(window).on('history-click', function (e, trigger) {
            var target = $(trigger);
            var url = target.attr('data-url');

            $.get(url, function (response) {
                //process data
                try {
                    response = JSON.parse(response);
                } catch (e) {
                    //fix for echos and print_r
                    response = {
                        error: false,
                        message: 'No new messages loaded',
                        results: {
                            rows: [],
                            total: 0
                        }
                    }
                }

                if (!response.error) {
                    $('span#histories').html(0);
                }
            });
        });

        /**
         * Importer init
         */
        $(window).on('import-init', function (e, trigger) {
            $(trigger).toggleClass('disabled');

            $.require('components/papaparse/papaparse.min.js', function () {
                $(trigger).toggleClass('disabled');
            });
        });

        /**
         * Importer tool
         */
        $(window).on('import-click', function (e, trigger) {
            var url = $(trigger).attr('data-url');
            var progress = $(trigger).attr('data-progress');
            var complete = $(trigger).attr('data-complete');

            if (typeof progress === 'undefined') {
                progress = "We are importing you data. Please do not refresh page.";
            }

            //make a file
            $('<input type="file" />')
                .attr(
                    'accept',
                    [
                        'text/plain',
                        'text/csv',
                        'text/x-csv',
                        'application/vnd.ms-excel',
                        'application/csv',
                        'application/x-csv',
                        'text/comma-separated-values',
                        'text/x-comma-separated-values',
                        'text/tab-separated-values'
                    ].join(',')
                )
                .change(function () {
                    var message = '<div>'+progress+'</div>';
                    var notifier = $.notify(message, 'info', 0);

                    $(this).parse({
                        config: {
                            header: true,
                            skipEmptyLines: true,
                            complete: function (results, file) {
                                $.post(url, JSON.stringify(results.data), function (response) {
                                    //process data
                                    try {
                                        response = JSON.parse(response);
                                    } catch (e) {
                                        //fix for echos and print_r
                                        response = {
                                            error: false,
                                            message: 'No data loaded',
                                        }
                                    }

                                    if (response.error) {
                                        var message = response.message;

                                        response.errors.forEach(function (error) {
                                            message += '<br />' + error;
                                        });

                                        notifier.fadeOut('fast', function () {
                                            notifier.remove();
                                        });

                                        $.notify(message, 'danger');
                                    } else {
                                        if (typeof complete === 'undefined') {
                                            complete = response.message;
                                        }

                                        notifier.fadeOut('fast', function () {
                                            notifier.remove();
                                        });

                                        $.notify(complete, 'success');

                                        setTimeout(function () {
                                            window.location.reload();
                                        }, 1000);
                                    }
                                });
                            },
                            error: function (error, file, input, reason) {
                                $.notify(error.message, 'error');
                            }
                        }
                    });
                })
                .click();
        });

        /**
         * Confirm UI
         */
        $(window).on('confirm-click', function (e, trigger) {
            if (!window.confirm('Are you sure you want to remove?')) {
                e.preventDefault();
                e.stopPropagation();
                return false;
            }
        });
    })();

    /**
     * General Forms
     */
    (function () {
        /**
         * Reset button on form page
         */
        $('form button[type="reset"]').click(function (e) {
            e.preventDefault();
            form = $(this).parents('form').get(0);


            $('input', form).each(function () {
                $(this).val('');
            });
        });

        /**
         * Suggestion Field
         */
        $(window).on('suggestion-field-init', function (e, target) {
            $.require('components/handlebars/dist/handlebars.js', function () {
                target = $(target);

                var container = $('<ul>').appendTo(target);

                var searching = false,
                    prevent = false,
                    isSchemaDetail = false,
                    value = target.attr('data-value'),
                    format = target.attr('data-format'),
                    targetLabel = target.attr('data-target-label'),
                    targetValue = target.attr('data-target-value'),
                    url = target.attr('data-url'),
                    template = '<li class="suggestion-item">{VALUE}</li>';

                if (!targetLabel || !targetValue || !url || !value) {
                    return;
                }

                if (target.data('is-schema-fields')) {
                    isSchemaDetail = true;
                }

                targetLabel = $(targetLabel);
                targetValue = $(targetValue);

                var loadSuggestions = function (list, callback) {
                    container.html('');

                    if (typeof list === 'undefined') {
                        target.addClass('d-none');
                        return;
                    }

                    list.forEach(function (item) {
                        var label = '';
                        //if there is a format, yay.
                        if (format) {
                            label = Handlebars.compile(format)(item);
                        //otherwise best guess?
                        } else {
                            for (var key in item) {
                                if (
                                    //if it is not a string
                                    typeof item[key] !== 'string'
                                    //it's a string but is like a number
                                    || !isNaN(parseFloat(item[key]))
                                    //it's a string and is not like a number
                                    // but the first character is like a number
                                    || !isNaN(parseFloat(item[key][0]))
                                ) {
                                    continue;
                                }

                                label = item[key];
                            }
                        }

                        //if still no label
                        if (!label.length) {
                            //just get the first one, i guess.
                            for (var key in item) {
                                label = item[key];
                                break;
                            }
                        }

                        item = { label: label, value: item[value] };
                        var row = template.replace('{VALUE}', item.label);

                        row = $(row).click(function () {
                            callback(item);
                            target.addClass('d-none');
                        });

                        container.append(row);
                    });

                    if (list.length) {
                        target.removeClass('d-none');
                    } else {
                        target.addClass('d-none');
                    }
                };

                targetLabel
                    .keypress(function (e) {
                        //if enter
                        if (e.keyCode == 13 && prevent) {
                            e.preventDefault();
                        }
                    })
                    .keydown(function (e) {
                        //if backspace
                        if (e.keyCode == 8) {
                            //undo the value
                            targetValue.val('');
                        }

                        prevent = false;
                        if (!target.hasClass('d-none')) {
                            switch (e.keyCode) {
                                case 40: //down
                                    var next = $('li.hover', target).removeClass('hover').index() + 1;

                                    if (next === $('li', target).length) {
                                        next = 0;
                                    }

                                    $('li:eq('+next+')', target).addClass('hover');

                                    return;
                                case 38: //up
                                    var prev = $('li.hover', target).removeClass('hover').index() - 1;

                                    if (prev < 0) {
                                        prev = $('li', target).length - 1;
                                    }

                                    $('li:eq('+prev+')', target).addClass('hover');

                                    return;
                                case 13: //enter
                                    if ($('li.hover', target).length) {
                                        $('li.hover', target)[0].click();
                                        prevent = true;
                                    }
                                    return;
                                case 37:
                                case 39:
                                    return;
                            }
                        }

                        if (searching) {
                            return;
                        }

                        setTimeout(function () {
                            if (targetLabel.val() == '') {
                                return;
                            }

                            searching = true;
                            $.ajax({
                                url : url.replace('{QUERY}', targetLabel.val()),
                                type : 'GET',
                                success : function (response) {
                                    var list = [];

                                    if (typeof response.results !== 'undefined'
                                        && typeof response.results.rows !== 'undefined'
                                        && response.results.rows instanceof Array
                                    ) {
                                        list = response.results.rows;
                                    }

                                    if (isSchemaDetail) {
                                        var primary = [{
                                            label: 'ID',
                                            name: 'id'
                                        }];

                                        list = primary.concat(response.results.fields);
                                    }

                                    loadSuggestions(list, function (item) {
                                        targetValue.val(item.value);
                                        targetLabel.val(item.label).trigger('keyup');
                                    });

                                    searching = false;
                                }, error : function () {
                                    searching = false;
                                }
                            });
                        }, 1);
                    });
            });
        });

        /**
         * Tag Field
         */
        $(window).on('tag-field-init', function (e, target) {
            target = $(target);

            var name = target.attr('data-name');

            //TEMPLATES
            var tagTemplate = '<div class="tag"><input type="text" class="tag-input'
            + ' text-field system-form-control" name="' + name + '[]" placeholder="Tag" value="" />'
            + '<a class="remove" href="javascript:void(0)"><i class="fa fa-times">'
            + '</i></a></div>';

            var addResize = function (filter) {
                var input = $('input[type=text]', filter);

                input.keyup(function () {
                    var value = input.val() || input.attr('placeholder');

                    var test = $('<span>').append(value).css({
                        visibility: 'hidden',
                        position: 'absolute',
                        top: 0, left: 0
                    }).appendTo('header:first');

                    var width = test.width() + 10;

                    if ((width + 40) > target.width()) {
                        width = target.width() - 40;
                    }

                    $(this).width(width);
                    test.remove();
                }).trigger('keyup');
            };

            var addRemove = function (filter) {
                $('a.remove', filter).click(function () {
                    var val = $('input', filter).val();

                    $(this).parent().remove();
                });
            };

            //INITITALIZERS
            var initTag = function (filter) {
                addRemove(filter);
                addResize(filter);

                $('input', filter).blur(function () {
                    //if no value
                    if (!$(this).val() || !$(this).val().length) {
                        //remove it
                        $(this).next().click();
                    }

                    var count = 0;
                    var currentTagValue = $(this).val();
                    $('div.tag input', target).each(function () {
                        if (currentTagValue === $(this).val()) {
                            count++;
                        }
                    });

                    if (count > 1) {
                        $(this).parent().remove();
                    }
                });
            };

            //EVENTS
            target.click(function (e) {
                if ($(e.target).hasClass('tag-field')) {
                    var last = $('div.tag:last', this);

                    if (!last.length || $('input', last).val()) {
                        last = $(tagTemplate);
                        target.append(last);

                        initTag(last);
                    }

                    $('input', last).focus();
                }
            });

            //INITIALIZE
            $('div.tag', target).each(function () {
                initTag($(this));
            });
        });

        /**
         * Texts Field
         */
        $(window).on('textlist-field-init', function (e, target) {
            target = $(target);

            var name = target.attr('data-name');
            var placeholder = target.attr('data-placeholder');

            //TEMPLATES
            var template ='<div class="field-row input-group mb-3">'
                + '<div class="input-group-prepend">'
                + '<a class="input-group-text text-success move-up" href="javascript:void(0)">'
                + '<i class="fas fa-arrow-up"></i></a></div><div class="input-group-prepend">'
                + '<a class="input-group-text text-orange move-down" href="javascript:void(0)">'
                + '<i class="fas fa-arrow-down"></i></a></div>'
                + '<input class="text-field form-control system-form-control" type="text" name="'
                + name + '[]" value="" /><div class="input-group-append">'
                + '<a class="input-group-text text-danger remove" '
                + 'href="javascript:void(0)">'
                + '<i class="fas fa-times"></i></a></div></div>';

            //INITITALIZERS
            var initTag = function (filter) {
                $('a.remove', filter).click(function () {
                    filter.remove();
                });

                $('a.move-up', filter).click(function () {
                    var prev = filter.prev();

                    if (prev.length && prev.hasClass('field-row')) {
                        prev.before(filter);
                    }
                });

                $('a.move-down', filter).click(function () {
                    var next = filter.next();

                    if (next.length && next.hasClass('field-row')) {
                        next.after(filter);
                    }
                });
            };

            //append meta template
            $('a.field-add', target).click(function () {
                var key = $('div.field-row', target).length;
                $(this).before(template);
                var item = $(this).prev();

                if (placeholder) {
                    $('input.text-field', item).attr('placeholder', placeholder);
                }

                initTag(item);

                return false;
            });

            //INITIALIZE
            $('div.field-row', target).each(function () {
                initTag($(this));
            });
        });

        /**
         * Textareas Field
         */
        $(window).on('textarealist-field-init', function (e, target) {
            target = $(target);

            var name = target.attr('data-name');
            var rows = target.attr('data-rows');
            var placeholder = target.attr('data-placeholder');

            //TEMPLATES
            var template ='<div class="field-row input-group mb-3">'
                + '<div class="input-group-prepend">'
                + '<a class="input-group-text text-success move-up" href="javascript:void(0)">'
                + '<i class="fas fa-arrow-up"></i></a></div><div class="input-group-prepend">'
                + '<a class="input-group-text text-orange move-down" href="javascript:void(0)">'
                + '<i class="fas fa-arrow-down"></i></a></div>'
                + '<textarea class="text-field form-control system-form-control" name="'
                + name + '[]"></textarea><div class="input-group-append">'
                + '<a class="input-group-text text-danger remove" '
                + 'href="javascript:void(0)">'
                + '<i class="fas fa-times"></i></a></div></div>';

            //INITITALIZERS
            var initTag = function (filter) {
                $('a.remove', filter).click(function () {
                    filter.remove();
                });

                $('a.move-up', filter).click(function () {
                    var prev = filter.prev();

                    if (prev.length && prev.hasClass('field-row')) {
                        prev.before(filter);
                    }
                });

                $('a.move-down', filter).click(function () {
                    var next = filter.next();

                    if (next.length && next.hasClass('field-row')) {
                        next.after(filter);
                    }
                });
            };

            //append meta template
            $('a.field-add', target).click(function () {
                var key = $('div.field-row', target).length;
                $(this).before(template);
                var item = $(this).prev();

                if (placeholder) {
                    $('textarea.text-field', item).attr('placeholder', placeholder);
                }

                if (rows) {
                    $('textarea.text-field', item).attr('rows', rows);
                }

                initTag(item);

                return false;
            });

            //INITIALIZE
            $('div.field-row', target).each(function () {
                initTag($(this));
            });
        });

        /**
         * WYSIWYGs Field
         */
        $(window).on('wysiwyglist-field-init', function (e, target) {
            target = $(target);

            var name = target.attr('data-name');
            var rows = target.attr('data-rows');
            var placeholder = target.attr('data-placeholder');

            //TEMPLATES
            var template = '<div class="field-row mb-3">'
                + '<div class="btn-group mb-2"><a class="btn btn-danger remove" '
                + 'href="javascript:void(0)">'
                + '<i class="fas fa-times"></i></a>'
                + '<a class="btn btn-success move-up" href="javascript:void(0)">'
                + '<i class="fas fa-arrow-up"></i></a>'
                + '<a class="btn btn-orange move-down" href="javascript:void(0)">'
                + '<i class="fas fa-arrow-down"></i></a></div>'
                + '<textarea data-do="wysiwyg" class="text-field form-control system-form-control" name="'
                + name + '[]"></textarea></div>';

            //INITITALIZERS
            var initTag = function (filter) {
                $('a.remove', filter).click(function () {
                    console.log(filter[0])
                    filter.remove();
                });

                $('a.move-up', filter).click(function () {
                    var prev = filter.prev();

                    if (prev.length && prev.hasClass('field-row')) {
                        var value1 = $('textarea', filter).data('editor').getValue();
                        var value2 = $('textarea', prev).data('editor').getValue();

                        $('textarea', prev).data('editor').setValue(value1);
                        $('textarea', filter).data('editor').setValue(value2);
                    }
                });

                $('a.move-down', filter).click(function () {
                    var next = filter.next();

                    if (next.length && next.hasClass('field-row')) {
                        var value1 = $('textarea', filter).data('editor').getValue();
                        var value2 = $('textarea', next).data('editor').getValue();

                        $('textarea', next).data('editor').setValue(value1);
                        $('textarea', filter).data('editor').setValue(value2);
                    }
                });
            };

            //append meta template
            $('a.field-add', target).click(function () {
                var key = $('div.field-row', target).length;
                $(this).before(template);
                var item = $(this).prev();

                if (placeholder) {
                    $('textarea.text-field', item).attr('placeholder', placeholder);
                }

                if (rows) {
                    $('textarea.text-field', item).attr('rows', rows);
                }

                initTag(item);

                item.doon();

                return false;
            });

            //INITIALIZE
            $('div.field-row', target).each(function () {
                initTag($(this));
            });
        });

        /**
         * Meta Field
         */
        $(window).on('meta-field-init', function (e, target) {
            target = $(target);

            //TEMPLATES
            var template ='<div class="field-row input-group mb-3">'
                + '<input class="meta-input key form-control system-form-control" type="text" placeholder="Key" />'
                + '<textarea class="meta-input value form-control system-form-control" placeholder="Value" rows="1"></textarea>'
                + '<input class="system-form-control" type="hidden" name="" value=""/>'
                + '<div class="input-group-append">'
                + '<a class="input-group-text text-danger remove" '
                + 'href="javascript:void(0)">'
                + '<i class="fas fa-times"></i></a></div></div>';

            //INITITALIZERS
            var initTag = function (filter) {
                var hidden = filter.find('input[type="hidden"]')

                $('a.remove', filter).click(function () {
                    filter.remove();
                });

                $('input.meta-input.key', filter).blur(function () {
                    //if no value
                    if (!$(this).val() || !$(this).val().length) {
                        hidden.attr('name', '');
                        return;
                    }

                    hidden.attr('name', $(target).data('name') + '[' + $(this).val() +']');
                });

                $('textarea.meta-input.value', filter).blur(function () {
                    //if no value
                    if (!$(this).val() || !$(this).val().length) {
                        hidden.attr('value', '');
                        return;
                    }

                    hidden.attr('value', $(this).val());
                });
            };

            //append meta template
            $('a.field-add', target).click(function () {
                var key = $('div.field-row', target).length;
                $(this).before(template);
                var item = $(this).prev();

                initTag(item);

                return false;
            });

            //INITIALIZE
            $('div.field-row', target).each(function () {
                initTag($(this));
            });
        });

        /**
         * Table Field
         */
        $(window).on('table-field-init', function (e, target) {
            target = $(target);

            //attributes
            var name = target.data('name');
            var columns = target.data('columns') || '';
            columns = columns.split('|');

            //TEMPLATES
            var template ='<tr><td><a class="btn btn-danger '
                + 'row-remove" href="javascript:void(0)"><i class="fas fa-times">'
                + '</i></a></td></tr>';

            var templateRow = '<td><input class="input-column '
                + 'form-control system-form-control" type="text" /></td>';

            //INITITALIZERS
            var init = function (row) {
                $('a.row-remove', row).click(function () {
                    row.remove();

                    $('tbody tr', target).each(function (index) {
                        $(this)
                            .data('index', index)
                            .attr('data-index', index);

                        $('input', this).attr(
                            'name',
                            name + '[' + index + '][]'
                        );
                    });
                });
            };

            //append meta template
            $('a.row-add', target).click(function () {
                var index = $('tbody tr', target).length;
                var row = $(template)
                    .data('index', index)
                    .attr('data-index', index);

                columns.forEach(function (label) {
                    var column = $(templateRow);

                    $('input', column)
                        .attr(
                            'name',
                            name + '[' + index + '][]'
                        )
                        .attr(
                            'placeholder',
                            label
                        );

                    row.append(column);
                });

                $('tbody', target).append(row);

                init(row);

                return false;
            });

            //INITIALIZE
            $('tbody tr', target).each(function () {
                init($(this));
            });
        });

        /**
         * File Field
         * HTML config for single files
         * data-do="file-field"
         * data-name="post_files"
         *
         * HTML config for multiple files
         * data-do="file-field"
         * data-name="post_files"
         * data-multiple="1"
         */
        $(window).on('file-field-init', function (e, target) {
            var onAcquire = function (extensions) {
                var template = {
                    previewFile:
                        '<div class="file-field-preview-container">'
                        + '<i class="fas fa-file text-info"></i>'
                        + '<span class="file-field-extension">{EXTENSION}</span>'
                        + '</div>',
                    previewImage:
                        '<div class="file-field-preview-container">'
                        + '<img src="{DATA}" height="50" />'
                        + '</div>',
                    actions:
                        '<td class="file-field-actions">'
                            + '<a class="text-info file-field-move-up" href="javascript:void(0)">'
                                + '<i class="fas fa-arrow-up"></i>'
                            + '</a>'
                            + '&nbsp;&nbsp;&nbsp;'
                            + '<a class="text-info file-field-move-down" href="javascript:void(0)">'
                                + '<i class="fas fa-arrow-down"></i>'
                            + '</a>'
                            + '&nbsp;&nbsp;&nbsp;'
                            + '<a class="btn btn-danger file-field-remove" href="javascript:void(0)">'
                                + '<i class="fas fa-times"></i>'
                            + '</a>'
                        + '</td>',
                    row:
                        '<tr class="file-field-item">'
                        + '<td class="file-field-preview">{PREVIEW}</td>'
                        + '<td class="file-field-name">'
                            + '{FILENAME}'
                            + '<input class="system-form-control system-file-input form-control" name="{NAME}" type="hidden" value="{DATA}" placeholder="eg. http://website.com/image.jpg" />'
                        + '</td>'
                        + '{ACTIONS}'
                        + '</tr>'
                };

                //current
                var container = $(target);
                var body = $('tbody', container);
                var foot = $('tfoot', container);

                var noresults = $('tr.file-field-none', body);

                //get meta data

                //for hidden fields
                var name = container.attr('data-name');

                //for file field
                var multiple = container.attr('data-multiple');
                var accept = container.attr('data-accept') || false;
                var classes = container.attr('data-class');
                var width = parseInt(container.attr('data-width') || 0);
                var height = parseInt(container.attr('data-height') || 0);

                //make a file
                var file = $('<input type="file" />').hide();

                if (multiple) {
                    file.attr('multiple', 'multiple');
                }

                if (accept) {
                    file.attr('accept', accept);
                }

                foot.append(file);

                $('button.file-field-upload', container).click(function (e) {
                    file.click();
                });

                $('button.file-field-link', container).click(function (e) {
                    var path = name + '[]';
                    var actions = template.actions;

                    if (!multiple) {
                        $('tr', body).each(function () {
                            if ($(this).hasClass('file-field-none')) {
                                return;
                            }

                            $(this).remove();
                        });

                        actions = '';
                        path = name;
                    }

                    noresults.hide();

                    var preview = template.previewFile.replace('{EXTENSION}', '???');

                    var row = $(
                        template.row
                            .replace('{PREVIEW}', preview)
                            .replace('{FILENAME}', '')
                            .replace('{NAME}', path)
                            .replace('{DATA}', '')
                            .replace('{ACTIONS}', actions)
                    ).appendTo(body);

                    listen(row, body);

                    $('input.system-file-input', row)
                        .attr('type', 'text')
                        .blur(function () {
                            var url = $(this).val();
                            var extension = '???';
                            if (url.indexOf('.') !== -1) {
                                extension = url.split('.').pop();
                            }

                            var preview = template.previewFile.replace('{EXTENSION}', extension);

                            //if it's an image
                            if (
                                [
                                    'jpg',
                                    'jpeg',
                                    'pjpeg',
                                    'svg',
                                    'png',
                                    'ico',
                                    'gif'
                                ].indexOf(extension) !== -1
                            ) {
                                preview = template.previewImage.replace('{DATA}', url);
                            }

                            $('td.file-field-preview', row).html(preview);
                        });
                });

                var listen = function (row, body) {
                    $('a.file-field-remove', row).click(function () {
                        row.remove();
                        if ($('tr', body).length < 2) {
                            noresults.show();
                        }
                    });

                    $('a.file-field-move-up', row).click(function () {
                        var prev = row.prev();

                        if (prev.length && !prev.hasClass('file-field-none')) {
                            prev.before(row);
                        }
                    });

                    $('a.file-field-move-down', row).click(function () {
                        var next = row.next();

                        if (next.length) {
                            next.after(row);
                        }
                    });
                };

                var generate = function (file, name, width, height, row) {
                    var reader = new FileReader();
                    reader.readAsDataURL(file);
                    reader.onload = function () {
                        var extension = file.name.split('.').pop();

                        if (file.name.indexOf('.') === -1) {
                            extension = 'unknown';
                        }

                        var preview = template.previewFile.replace('{EXTENSION}', extension);

                        if (file.type.indexOf('image/') === 0) {
                            preview = template.previewImage.replace('{DATA}', reader.result);
                        }

                        noresults.hide();

                        row = $(
                            row
                                .replace('{NAME}', name)
                                .replace('{DATA}', reader.result)
                                .replace('{PREVIEW}', preview)
                                .replace('{FILENAME}', file.name)
                        ).appendTo(body);

                        listen(row, body);

                        if (file.type.indexOf('image/') === 0 && (width !== 0 || height !== 0)) {
                            //so we can crop
                            $.cropper(file, width, height, function (data) {
                                $('div.file-field-preview-container img', row).attr('src', data);
                                $('input[type="hidden"]', row).val(data);
                            });
                        }

                        //add mime type
                        if (typeof extensions[file.type] !== 'string') {
                            extensions[file.type] = extension;
                        }
                    };
                };

                file.change(function () {
                    if (!this.files || !this.files[0]) {
                        return;
                    }

                    if (!multiple) {
                        $('tr', body).each(function () {
                            if ($(this).hasClass('file-field-none')) {
                                return;
                            }

                            $(this).remove();
                        })
                    }

                    for (var row, path = '', i = 0; i < this.files.length; i++, path = '') {
                        row = template.row.replace('{ACTIONS}', '');
                        if (multiple) {
                            path = '[]' + path;
                            row = template.row.replace('{ACTIONS}', template.actions);
                        }

                        path = name + path;
                        generate(this.files[i], path, width, height, row);
                    }
                });

                $('tr', body).each(function () {
                    if ($(this).hasClass('file-field-none')) {
                        return;
                    }

                    listen($(this), body)
                });
            };

            $.require([
                'cdn/json/extensions.json',
                'components/yarn-cropper/cropper.min.js'
            ], onAcquire);
        });

        /**
         * Direct CDN Upload
         */
        $(window).on('wysiwyg-init', function (e, target) {
            var template = '<div class="wysiwyg-toolbar position-relative" style="display: none;">'
                + '<div class="btn-group">'
                    + '<a class="btn btn-default" data-wysihtml-command="bold" title="CTRL+B"><i class="fas fa-bold"></i></a>'
                    + '<a class="btn btn-default" data-wysihtml-command="italic" title="CTRL+I"><i class="fas fa-italic"></i></a>'
                    + '<a class="btn btn-default" data-wysihtml-command="underline" title="CTRL+U"><i class="fas fa-underline"></i></a>'
                    + '<a class="btn btn-default" data-wysihtml-command="strike" title="CTRL+U"><i class="fas fa-strikethrough"></i></a>'
                + '</div> '
                + '<div class="btn-group">'
                    + '<a class="btn btn-info" data-wysihtml-command="createLink"><i class="fas fa-external-link-alt"></i></a>'
                    + '<a class="btn btn-danger" data-wysihtml-command="removeLink"><i class="fas fa-ban"></i></a>'
                + '</div> '
                + '<a class="btn btn-purple" data-wysihtml-command="insertImage"><i class="fas fa-image"></i></a> '
                + '<div class="dropdown d-inline-block">'
                    + '<button aria-haspopup="true" aria-expanded="false" class="btn btn-grey" data-toggle="dropdown" type="button">Headers <i class="fas fa-chevron-down"></i></button>'
                    + '<div class="dropdown-menu">'
                        + '<a class="dropdown-item" data-wysihtml-command="formatBlock" data-wysihtml-command-blank-value="true">Normal</a>'
                        + '<a class="dropdown-item" data-wysihtml-command="formatBlock" data-wysihtml-command-value="h1">Header 1</a>'
                        + '<a class="dropdown-item" data-wysihtml-command="formatBlock" data-wysihtml-command-value="h2">Header 2</a>'
                        + '<a class="dropdown-item" data-wysihtml-command="formatBlock" data-wysihtml-command-value="h3">Header 3</a>'
                        + '<a class="dropdown-item" data-wysihtml-command="formatBlock" data-wysihtml-command-value="h4">Header 4</a>'
                        + '<a class="dropdown-item" data-wysihtml-command="formatBlock" data-wysihtml-command-value="h5">Header 5</a>'
                        + '<a class="dropdown-item" data-wysihtml-command="formatBlock" data-wysihtml-command-value="h6">Header 6</a>'
                    + '</div>'
                + '</div> '
                + '<div class="dropdown d-inline-block">'
                    + '<button aria-haspopup="true" aria-expanded="false" class="btn btn-pink" data-toggle="dropdown" type="button">Colors <i class="fas fa-chevron-down"></i></button>'
                    + '<div class="dropdown-menu">'
                        + '<a class="dropdown-item text-danger" data-wysihtml-command="foreColor" data-wysihtml-command-value="red"><i class="fas fa-square-full"></i> Red</a>'
                        + '<a class="dropdown-item text-success" data-wysihtml-command="foreColor" data-wysihtml-command-value="green"><i class="fas fa-square-full"></i> Green</a>'
                        + '<a class="dropdown-item text-primary" data-wysihtml-command="foreColor" data-wysihtml-command-value="blue"><i class="fas fa-square-full"></i> Blue</a>'
                        + '<a class="dropdown-item text-purple" data-wysihtml-command="foreColor" data-wysihtml-command-value="purple"><i class="fas fa-square-full"></i> Purple</a>'
                        + '<a class="dropdown-item text-warning" data-wysihtml-command="foreColor" data-wysihtml-command-value="orange"><i class="fas fa-square-full"></i> Orange</a>'
                        + '<a class="dropdown-item text-yellow" data-wysihtml-command="foreColor" data-wysihtml-command-value="yellow"><i class="fas fa-square-full"></i> Yellow</a>'
                        + '<a class="dropdown-item text-pink" data-wysihtml-command="foreColor" data-wysihtml-command-value="pink"><i class="fas fa-square-full"></i> Pink</a>'
                        + '<a class="dropdown-item text-white" data-wysihtml-command="foreColor" data-wysihtml-command-value="white"><i class="fas fa-square-full"></i> White</a>'
                        + '<a class="dropdown-item text-inverse" data-wysihtml-command="foreColor" data-wysihtml-command-value="black"><i class="fas fa-square-full"></i> Black</a>'
                    + '</div>'
                + '</div> '
                + '<div class="btn-group">'
                    + '<a class="btn btn-default" data-wysihtml-command="insertUnorderedList"><i class="fas fa-list-ul"></i></a>'
                    + '<a class="btn btn-default" data-wysihtml-command="insertOrderedList"><i class="fas fa-list-ol"></i></a>'
                + '</div> '
                + '<div class="btn-group">'
                    + '<a class="btn btn-light" data-wysihtml-command="undo"><i class="fas fa-undo"></i></a><a class="btn btn-light" data-wysihtml-command="redo"><i class="fas fa-redo"></i></a>'
                + '</div> '
                + '<a class="btn btn-light" data-wysihtml-command="insertSpeech"><i class="fas fa-comments"></i></a> '
                + '<a class="btn btn-inverse" data-wysihtml-action="change_view"><i class="fas fa-code"></i></a> '
                + '<div class="wysiwyg-dialog" data-wysihtml-dialog="createLink" style="display: none;">'
                    + '<input class="form-control system-form-control" data-wysihtml-dialog-field="href" placeholder="http://" />'
                    + '<input class="form-control system-form-control mb-2" data-wysihtml-dialog-field="title" placeholder="Title" />'
                    + '<a class="btn btn-primary" data-wysihtml-dialog-action="save" href="javascript:void(0)">OK</a>'
                    + '<a class="btn btn-danger" data-wysihtml-dialog-action="cancel" href="javascript:void(0)">Cancel</a>'
                + '</div>'
                + '<div class="wysiwyg-dialog" data-wysihtml-dialog="insertImage" style="display: none;">'
                    + '<input class="form-control system-form-control" data-wysihtml-dialog-field="src" placeholder="http://">'
                    + '<input class="form-control system-form-control" data-wysihtml-dialog-field="alt" placeholder="alt">'
                    + '<select class="form-control system-form-control mb-2" data-wysihtml-dialog-field="className">'
                        + '<option value="">None</option>'
                        + '<option value="float-left">Left</option>'
                        + '<option value="float-right">Right</option>'
                    + '</select>'
                    + '<a class="btn btn-primary" data-wysihtml-dialog-action="save" href="javascript:void(0)">OK</a>'
                    + '<a class="btn btn-danger" data-wysihtml-dialog-action="cancel" href="javascript:void(0)">Cancel</a>'
                + '</div>'
            + '</div>';

            $.require.load(
                [
                    'components/wysihtml/dist/minified/wysihtml.min.js',
                    'components/wysihtml/dist/minified/wysihtml.all-commands.min.js',
                    'components/wysihtml/dist/minified/wysihtml.table_editing.min.js',
                    'components/wysihtml/dist/minified/wysihtml.toolbar.min.js',
                    'components/wysihtml/parser_rules/advanced_unwrap.js'
                ],
                function () {
                    var toolbar = $(template);
                    $(target).before(toolbar);

                    var e = new wysihtml.Editor(target, {
                        toolbar:        toolbar[0],
                        parserRules:    wysihtmlParserRules,
                        stylesheets:  '/styles/admin.css'
                    });

                    $(target).data('editor', e);
                }
            );
        });

        /**
         * Code Editor - Ace
         */
        $(window).on('code-editor-init', function (e, target) {
            $.require.load(
                'components/ace-editor-builds/src/ace.js',
                function () {
                    target = $(target).addClass('ace-textarea').hide();

                    var mode = target.attr('data-mode');
                    var width = target.attr('data-height') || 0;
                    var height = target.attr('data-height') || 500;

                    var container = $('<section>')
                        .addClass('form-control')
                        .addClass('system-form-control')
                        .addClass('code-editor-container');

                    if (width) {
                        container.width(width);
                    }

                    if (height) {
                        container.height(height);
                    }

                    target.after(container);

                    var editor = ace.edit(container[0]);

                    if (mode) {
                        // set mode
                        editor.getSession().setMode('ace/mode/' + mode);
                    }

                    // set editor default value
                    editor.setValue(target.val());

                    target.closest('form').submit(function () {
                        target.val(editor.getValue());
                    });
                }
            );
        });

        /**
         * Markdown Editor -
         */
        $(window).on('markdown-editor-init', function (e, target) {
            $.require.load(
                [
                    'components/bootstrap-markdown-editor-4/dist/css/bootstrap-markdown-editor.min.css',
                    'components/ace-editor-builds/src/ace.js',
                    'components/bootstrap-markdown-editor-4/dist/js/bootstrap-markdown-editor.min.js'
                ],
                function () {
                    target = $(target);

                    var width = target.attr('data-height') || 0;
                    var height = target.attr('data-height') || 500;

                    if (width) {
                        target.width(width);
                    }

                    if (height) {
                        target.height(height);
                    }

                    target.markdownEditor();
                }
            );
        });

        /**
         * Generate Slug
         */
        $(window).on('slugger-init', function (e, target) {
            var source = $(target).attr('data-source');

            if (!source || !source.length) {
                return;
            }

            var upper = $(target).attr('data-upper');
            var lower = $(target).attr('data-lower');
            var space = $(target).attr('data-space') || '-';

            $(source).keyup(function () {
                var slug = $(this)
                    .val()
                    .toString()
                    .toLowerCase()
                    .replace(/\s+/g, '-')           // Replace spaces with -
                    .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
                    .replace(/\-\-+/g, '-')         // Replace multiple - with single -
                    .replace(/^-+/, '')             // Trim - from start of text
                    .replace(/-+$/, '');

                if (upper != 0) {
                    slug = slug.replace(
                        /(^([a-zA-Z\p{M}]))|([ -][a-zA-Z\p{M}])/g,
                        function (s) {
                            return s.toUpperCase();
                        }
                    );
                }

                if (lower != 0) {
                    slug = slug.toLowerCase();
                }

                slug = slug.replace(/\-/g, space);

                $(target).val(slug);
            });
        });

        /**
         * Mask
         */
        $(window).on('mask-field-init', function (e, target) {
            $.require(
                'components/inputmask/dist/min/jquery.inputmask.bundle.min.js',
                function () {
                    var format = $(target).attr('data-format');
                    $(target).inputmask(format);
                }
            );
        });

        /**
         * Mask
         */
        $(window).on('knob-field-init', function (e, target) {
            $.require(
                'components/jquery-knob/dist/jquery.knob.min.js',
                function () {
                    $(target).knob();
                }
            );
        });

        /**
         * Select
         */
        $(window).on('select-field-init', function (e, target) {
            $.require(
                [
                    'components/select2/dist/css/select2.min.css',
                    'components/select2/dist/js/select2.full.min.js'
                ],
                function () {
                    $(target).select2();
                }
            );
        });

        /**
         * Countries Dropdown
         */
        $(window).on('country-dropdown-init', function (e, target) {
            $.require(
                [
                    '/json/countries.json',
                    'components/select2/dist/css/select2.min.css',
                    'components/select2/dist/js/select2.full.min.js'
                ],
                function (countries) {
                    //populate
                    countries.forEach(function (country) {
                        $('<option>')
                            .attr('value', country.abbreviation)
                            .text(country.country)
                            .appendTo(target);
                    });

                    $(target).select2();
                }
            );
        });

        /**
         * Multirange
         */
        $(window).on('multirange-field-init', function (e, target) {
            var onAcquire = function () {
                target = $(target);

                var params = {};
                // loop all attributes
                $.each(target[0].attributes,function (index, attr) {
                    // skip if data do and on
                    if (attr.name == 'data-do' || attr.name == 'data-on') {
                        return true;
                    }

                    // look for attr with data- as prefix
                    if (attr.name.search(/data-/g) > -1) {
                        // get parameter name
                        var key = attr.name
                            .replace('data-', '')
                            .replace('-', '_');

                        // prepare parameter
                        params[key] = attr.value;

                        // if value is boolean
                        if (attr.value == 'true') {
                            params[key] = attr.value == 'true' ? true : false;
                        }
                    }
                });

                target.ionRangeSlider(params);
            };

            $.require(
                [
                    'components/ion-rangeSlider/css/ion.rangeSlider.css',
                    'components/ion-rangeSlider/css/ion.rangeSlider.skinFlat.css',
                    'components/ion-rangeSlider/js/ion.rangeSlider.min.js'
                ],
                onAcquire
            );
        });

        /**
         * Date Field
         */
        $(window).on('date-field-init', function (e, target) {
            $.require(
                [
                    'components/flatpickr/dist/flatpickr.min.css',
                    'components/flatpickr/dist/flatpickr.min.js'
                ],
                function () {
                    $(target).flatpickr({
                        dateFormat: "Y-m-d",
                    });
                }
            );
        });

        /**
         * Time Field
         */
        $(window).on('time-field-init', function (e, target) {
            $.require(
                [
                    'components/flatpickr/dist/flatpickr.min.css',
                    'components/flatpickr/dist/flatpickr.min.js'
                ],
                function () {
                    $(target).flatpickr({
                        enableTime: true,
                        noCalendar: true,
                        dateFormat: "H:i",
                    });
                }
            );
        });

        /**
         * DateTime Field
         */
        $(window).on('datetime-field-init', function (e, target) {
            $.require(
                [
                    'components/flatpickr/dist/flatpickr.min.css',
                    'components/flatpickr/dist/flatpickr.min.js'
                ],
                function () {
                    $(target).flatpickr({
                        enableTime: true,
                        dateFormat: "Y-m-d H:i:S",
                    });
                }
            );
        });

        /**
         * Date Range Field
         */
        $(window).on('date-range-field-init', function (e, target) {
            $.require(
                [
                    'components/flatpickr/dist/flatpickr.min.css',
                    'components/flatpickr/dist/flatpickr.min.js'
                ],
                function () {
                    $(target).flatpickr({
                        mode: "range",
                        dateFormat: "Y-m-d",
                    });
                }
            );
        });

        /**
         * DateTime Range Field
         */
        $(window).on('datetime-range-field-init', function (e, target) {
            $.require(
                [
                    'components/flatpickr/dist/flatpickr.min.css',
                    'components/flatpickr/dist/flatpickr.min.js'
                ],
                function () {
                    $(target).flatpickr({
                        mode: "range",
                        enableTime: true,
                        dateFormat: "Y-m-d H:i",
                    });
                }
            );
        });

        /**
         * Icon field
         */
        $(window).on('icon-field-init', function (e, target) {
            $.require('cdn/json/icons.json', function (icons) {
                target = $(target);

                var targetLevel = parseInt(target.attr('data-target-parent')) || 0;

                var suggestion = $('<div>')
                    .addClass('input-suggestion')
                    .addClass('icon-field')
                    .hide();

                var parent = target;
                for (var i = 0; i < targetLevel; i++) {
                    parent = parent.parent();
                }

                parent.after(suggestion);

                target.click(function () {
                        suggestion.show();
                })
                    .blur(function () {
                        setTimeout(function () {
                            suggestion.hide();
                        }, 100);
                    });

                icons.forEach(function (icon) {
                    $('<i>')
                        .addClass(icon)
                        .addClass('fa-fw')
                        .appendTo(suggestion)
                        .click(function () {
                            var input = target.parent().find('input').eq(0);
                            input.val(this.className.replace(' fa-fw', ''));

                            var preview = target.parent().find('i').eq(0);
                            if (!preview.parent().hasClass('icon-suggestion')) {
                                preview[0].className = this.className;
                            }

                            suggestion.hide();
                            target.focus();
                        });
                });

                $('i', target.attr('data-target'));
            });
        });

        /**
         * Model Range Change
         */
        $(window).on('model-range-change', function (e, target) {
            var target = $(target);

            var form = $('<form>')
                .attr('method', 'get');

            //if relation exists
            if (typeof target.val() !== 'undefined' && target.val() !== '') {
                $('<input>')
                    .attr('type', 'hidden')
                    .attr('name', 'range')
                    .attr('value', target.val())
                    .appendTo(form);
            }

            form.hide().appendTo(document.body).submit();
        });

        /**
         * Direct CDN Upload
         */
        $(window).on('cdn-upload-submit', function (e, target) {
            $.require('cdn/json/extensions.json', function (extensions) {
                //setup cdn configuration
                var container = $(target);
                var config = { form: {}, inputs: {} };

                //though we upload this with s3 you may be using cloudfront
                config.cdn = container.attr('data-cdn');
                config.progress = container.attr('data-progress');
                config.complete = container.attr('data-complete');

                //form configuration
                config.form['enctype'] = container.attr('data-enctype');
                config.form['method'] = container.attr('data-method');
                config.form['action'] = container.attr('data-action');

                //inputs configuration
                config.inputs['acl'] = container.attr('data-acl');
                config.inputs['key'] = container.attr('data-key');
                config.inputs['X-Amz-Credential'] = container.attr('data-credential');
                config.inputs['X-Amz-Algorithm'] = container.attr('data-algorythm');
                config.inputs['X-Amz-Date'] = container.attr('data-date');
                config.inputs['Policy'] = container.attr('data-policy');
                config.inputs['X-Amz-Signature'] = container.attr('data-signature');

                var id = 0,
                    // /upload/123abc for example
                    prefix = config.inputs.key,
                    //the total of files to be uploaded
                    total = 0,
                    //the amount of uploads complete
                    completed = 0;

                //hiddens will have base 64
                $('input[type="hidden"]', target).each(function () {
                    var hidden = $(this);
                    var data = hidden.val();
                    //check for base 64
                    if (data.indexOf(';base64,') === -1) {
                        return;
                    }

                    //parse out the base 64 so we can make a file
                    var base64 = data.split(';base64,');
                    var mime = base64[0].split(':')[1];

                    var extension = extensions[mime] || 'unknown';
                    //this is what hidden will be assigned to when it's uploaded
                    var path = prefix + (++id) + '.' + extension;

                    //EPIC: Base64 to File Object
                    var byteCharacters = window.atob(base64[1]);
                    var byteArrays = [];

                    for (var offset = 0; offset < byteCharacters.length; offset += 512) {
                        var slice = byteCharacters.slice(offset, offset + 512);

                        var byteNumbers = new Array(slice.length);

                        for (var i = 0; i < slice.length; i++) {
                            byteNumbers[i] = slice.charCodeAt(i);
                        }

                        var byteArray = new Uint8Array(byteNumbers);

                        byteArrays.push(byteArray);
                    }

                    var file = new File(byteArrays, {type: mime});

                    //This Code is to verify that we are
                    //encoding the file data correctly
                    //see: http://stackoverflow.com/questions/16245767/creating-a-blob-from-a-base64-string-in-javascript
                    //var reader  = new FileReader();
                    //var preview = $('<img>').appendTo(target)[0];
                    //reader.addEventListener("load", function () {
                    //    preview.src = reader.result;
                    //}, false);
                    //reader.readAsDataURL(file);
                    //return;

                    //add on to the total
                    total ++;

                    //prepare the S3 form to upload just this file
                    var form = new FormData();
                    for (var name in config.inputs) {
                        if (name === 'key') {
                            form.append('key', path);
                            continue;
                        }

                        form.append(name, config.inputs[name]);
                    }

                    //lastly add this file object
                    form.append('file', file);

                    // Need to use jquery ajax
                    // so that auth can catch
                    // up request, and append access
                    // token into it
                    $.ajax({
                        url: config.form.action,
                        type: config.form.method,
                        // form data
                        data: form,
                        // disable cache
                        cache: false,
                        // do not set content type
                        contentType: false,
                        // do not proccess data
                        processData: false,
                        // on error
                        error: function (xhr, status, message) {
                            notifier.fadeOut('fast', function () {
                                notifier.remove();
                            });

                            $.notify(message, 'danger');
                        },
                        // on success
                        success : function () {
                            //now we can reassign hidden value from
                            //base64 to CDN Link
                            hidden.val(config.cdn + '/' + path);

                            //if there is more to upload
                            if ((++completed) < total) {
                                //update bar
                                var percent = Math.floor((completed / total) * 100);
                                bar.css('width', percent + '%').html(percent + '%');

                                //do nothing else
                                return;
                            }

                            notifier.fadeOut('fast', function () {
                                notifier.remove();
                            });

                            $.notify(config.complete, 'success');

                            //all hidden fields that could have possibly
                            //been converted has been converted
                            //submit the form
                            target.submit();
                        }
                    });
                });

                //if there is nothing to upload
                if (!total) {
                    //let the form submit as normal
                    return;
                }

                //otherwise we are uploading something, so we need to wait
                e.preventDefault();

                var message = '<div>' + config.progress + '</div>';
                var progress = '<div class="progress"><div class="progress-bar"'
                + 'role="progressbar" aria-valuenow="2" aria-valuemin="0"'
                + 'aria-valuemax="100" style="min-width: 2em; width: 0%;">0%</div></div>';

                var notifier = $.notify(message + progress, 'info', 0);
                var bar = $('div.progress-bar', notifier);
            });
        });

        /**
         * Fieldset Init
         */
        $(window).on('fieldset-init', function (e, target) {
            var target = $(target);
            //name of the field
            var name = target.data('name');
            //keyword of fieldset
            var fieldset = target.data('fieldset');
            //whether to show the add button
            var multiple = target.data('multiple');
            //label name
            var label = target.data('label');
            //get the template
            var template = target.children('div.template-fieldset-row')
                .remove()
                .html();

            //INITITALIZERS
            var init = function (row) {
                row
                    .children('div.box-head')
                    .find('a.fieldset-remove')
                    .click(function () {
                        //we only need to change the
                        //elements after the one removed
                        var rows = row.nextAll('div.fieldset-row');

                        // Now remove the target
                        row.remove();

                        rows.each(function () {
                            //update the label, it's easy! :D
                            var labelTemplate = $(this).parent().attr('data-label');
                            var rows = $(this)
                                .parents('div.fieldset-row[data-multiple]')
                                .get()
                                .reverse();

                            rows.forEach(function (row, i) {
                                labelTemplate = labelTemplate.replace(
                                    new RegExp('{INDEX_' + i + '}', 'g'),
                                    $(row).index() + 1
                                );
                            });

                            labelTemplate = labelTemplate.replace(
                                new RegExp('{INDEX_' + rows.length + '}', 'g'),
                                $(this).index() + 1
                            );

                            $(this)
                                .children('div.box-head')
                                .find('h3.fieldset-label')
                                .html(labelTemplate);

                            //next update the fields, it's hard... :(
                            // Get all the inputs
                            var fields = $('div.system-form-field', this);
                            // Re-index
                            reindex(fields, true);
                        });
                    });

                $(row).doon();
            };

            //append meta template
            target.children('a.fieldset-add').click(function () {
                var indexes = {};
                var rows = $(this)
                    .parents('div.fieldset-row[data-multiple]')
                    .get()
                    .reverse();

                rows.forEach(function (row, i) {
                    indexes['{INDEX_' + i + '}'] = $(row).index();
                });

                indexes['{INDEX_' + rows.length + '}'] = $(this).siblings('div.fieldset-row').length;

                var row = $(template);
                $('.system-form-control', row).each(function () {
                    var name = $(this).attr('name');
                    for (var index in indexes) {
                        name = name.replace(index, indexes[index]);
                    }

                    $(this).attr('name', name);
                });

                //consider file fields
                $('[data-name]', row).each(function () {
                    var name = $(this).attr('data-name');
                    for (var index in indexes) {
                        name = name.replace(index, indexes[index]);
                    }

                    $(this).attr('data-name', name);
                });

                var labelTemplate = label;
                for (var index in indexes) {
                    labelTemplate = labelTemplate.replace(index, indexes[index] + 1);
                }

                $('h3.fieldset-label', row).html(labelTemplate);

                //insert and activate scripts
                $(this).before(row);

                init(row);
            });

            //INITIALIZE
            $(target)
                .children('div.fieldset-row')
                .each(function () {
                    init($(this));
                });

            var reindex = function (fields, filter) {
                var inputs = $('.system-form-control', fields);
                // Get the input names
                var names = {};
                $.each(inputs, function (index, element) {
                    // Get the original name
                    var original = $(element).attr('name');
                    // Convert to dot e.g a.b.c
                    var name = original
                        .replace(/\[|\]/g, '.')
                        .replace(/\.\./g, '.');

                    // Trim trailing dots
                    name = name.substr(0, name.length - 1);

                    // Convert to object
                    dotToObject(name, original, names);
                });

                // Get the re-index filters
                var filters = [];

                // Filter?
                // if (filter) {
                //     $('[data-name]').map(function(index, element) {
                //         filters.push($(element).data('name'));
                //     });
                // }

                // Re-index names
                var reindexed = arrange(names, filters);
                // Serialized it so we can build something like a[b][c]
                var serialized = serialize(reindexed);
                // Split by pairs
                serialized = serialized.split('&');

                // On each serialized pairs
                for (var i in serialized) {
                    // Get the parts key & value
                    var parts = serialized[i].split('=');

                    // Iterate on each input elements
                    $.each(inputs, function (index, element) {
                        // Get the name
                        var name = $(element).attr('name');

                        // Has matched the original name?
                        if (name === parts[1]) {
                            // Replace it with the re-indexed name
                            $(element).attr('name', parts[0]);

                            // Case for Filelist/File Fields
                            if ($(element).hasClass('system-file-input')) {
                                var container = $(element).parentsUntil('div.system-form-field').last();
                                container.attr('data-name', parts[0].replace('[]', ''));
                            }
                        }
                    });
                }
            };

            var arrange = function (object, filters) {
                // Re-arranged object
                var rearranged = {};
                // Get all the keys
                var keys = Object.keys(object);
                // Current index
                var index = 0;

                // On each keys
                for (var i in keys) {
                    // Get the current key
                    var key = keys[i];
                    // Get the current value
                    var current = object[keys[i]];
                    // Get the type
                    var type = Object.prototype.toString.call(current);

                    // If it's a string but it's an object
                    if (isNaN(parseInt(key)) && type === '[object Object]' && key !== '{INDEX}') {
                        // If it's not fieldset
                        if (filters.length && filters.indexOf(key) === -1) {
                            continue;
                        }

                        // Recurse object
                        rearranged[key] = arrange(current, filters);
                        continue;

                    // If it's a number and it's an object, re-index
                    } else if ((!isNaN(parseInt(key)) || key === '{INDEX}') && type === '[object Object]') {
                        // Re-index the object
                        rearranged[index] = arrange(current, filters);
                        index++;
                    } else {
                        // Just set the value
                        rearranged[key] = current;
                    }
                }

                return rearranged;
            };

            var dotToObject = function (path, value, object) {
                // Get the parts
                var parts = path.split('.'), part;
                var last = parts.pop();

                // On each part
                while (part = parts.shift()) {
                    // Create if doesnt exists
                    if (typeof object[part] != 'object') {
                        object[part] = {};
                    }

                    // Update pointer
                    object = object[part];
                }

                // Set value
                object[last] = value;
            };

            var serialize = function (object, prefix) {
                var string = [], property;

                // On each property
                for (property in object) {
                    if (object.hasOwnProperty(property)) {
                        // Figure out the key
                        var key = prefix ?
                            prefix + '[' + property + ']' :
                            property;

                        // Get the value
                        var value = object[property];

                        // Push or recurse the pair
                        string.push(
                            (value !== null && typeof value === 'object') ?
                            serialize(value, key) :
                            key + '=' + value
                        );
                    }
                }

                return string.join('&');
            };
        });

        /**
         * Star Rating Field Init
         */
        $(window).on('stars-field-init', function (e, target) {
            target = $(target);

            var input = target.find('input.system-form-control');

            //cache rows
            var rows = target.find('.star');
            var range = 0, stop = 0;

            //INITIALIZER
            var init = function () {
                rows
                .each(function () {
                    var icon = $(this).find('i');
                    icon.on('mousemove', hover.bind(icon, icon.outerWidth()));
                    icon.on('click', function () {
                        //not sure why .val is not working :(
                        input.attr('value', range);
                    });
                });

                //reset if didn't select
                target.on('mouseleave', function () {
                    range = 0, stop = 0;
                    fill(input.val());
                });
            };

            //on hover determine steps
            var hover = function (width, e) {
                var index = $(this).parent().index();
                //determine whether it's half step
                var half = Math.ceil(width / 2);
                var position = Math.ceil(
                    e.pageX - $(this).parent().offset().left
                );

                //small threshold to be able to reset to 0
                if (index === 0 && position < 8) {
                    range = 0;
                    return fill(0);
                }

                //half step?
                if (position <= half) {
                    range = index + .5;

                //whole step?
                } else {
                    range = index + 1;
                }

                //do not rerender if value
                //doesn't change
                if (stop === range) {
                    return;
                }

                //set stop threshold
                fill(range);
                stop = range;
            };

            //fill the stars
            var fill = function (range) {
                //determine whether it's a full or half step
                var half = range.toString().indexOf('.5') > 0;
                range = Math.round(range);

                //fill in each rows
                rows.each(function (index) {
                    var star = $(this).find('i');

                    //half step?
                    if (index === range - 1 && half) {
                        star.attr('class', 'fas fa-star-half-alt text-warning');
                        return;
                    }

                    //whole step?
                    if (index < range) {
                        star.attr('class', 'fas fa-star text-warning');

                    //empty step?
                    } else {
                        star.attr('class', 'far fa-star');
                    }
                });
            };

            //INITIALIZE
            init();
        });
    })();

    /**
     * Other UI
     */
    (function () {
        /**
         * Prettyfy
         */
        $(window).on('prettify-init', function (e, target) {
            var loaded = false;
            $.require.load(
                'components/google-code-prettify/src/prettify.js',
                function () {
                    if (!loaded) {
                        PR.prettyPrint();
                        loaded = true;
                    }
                }
            );
        });

        /**
         * Calendar Page UI
         */
        $(window).on('calendar-init', function (e, target) {
            var onAcquire = function () {
                var ajax = $(target).data('ajax');
                var date = $(target).data('date');
                var view = $(target).data('view');
                var eventStart = $(target).data('event-start');
                var eventEnd = $(target).data('event-end');
                var link = $(target).data('event-link');
                var primary = $(target).data('event-id');
                var format = $(target).data('event-title');

                $(target).fullCalendar({
                    defaultView: view,
                    height: 750,
                    header: {
                        left: '',
                        center: 'title',
                        right: ''
                    },
                    eventTextColor: '#fff',
                    eventLimit: true, // allow "more" link when too many events
                    navLinks: true,
                    events: function (start, end, timezone, callback) {
                        var data = {
                            render: false,
                            span: {}
                        };

                        data.span[eventStart] = [];
                        data.span[eventStart].push(start.format());
                        data.span[eventStart].push(end.format());

                        if (eventEnd) {
                            data.span[eventEnd] = [];
                            data.span[eventEnd].push(start.format());
                            data.span[eventEnd].push(end.format());
                        }

                        jQuery.ajax({
                            url: ajax,
                            type: 'GET',
                            dataType: 'json',
                            data: data,
                            success: function (response) {
                                var events = [];
                                if (!!response.results.rows) {
                                    $.map(response.results.rows, function (result) {
                                        var row = {
                                            id: result[primary],
                                            start: result[eventStart],
                                            title: 'No Title'
                                        }

                                        if (format) {
                                            row.title = Handlebars.compile(format)(result);
                                        }

                                        // display end?
                                        if (eventEnd && result[eventEnd]) {
                                            row.end = result[eventEnd];
                                        }

                                        events.push(row);
                                    });
                                }
                                callback(events);
                            }
                        });
                    },
                    eventClick: function (eventData, jsEvent, view) {
                        // on click redirect to update page
                        window.location.href = link + '/' + eventData.id;
                    },
                    eventRender: function (eventData, $el) {
                        //var content = eventData.start.format('LLL');

                        var content = eventData.start.format('hh:mma');
                        if (eventData.end) {
                            //see: http://momentjs.com/docs/#/parsing/string-format/
                            content = eventData.start.format('LLL') + ' - ' + eventData.end.format('LLL');
                            //if on the same day
                            if (eventData.start.format('LL') === eventData.end.format('LL')) {
                                content = eventData.start.format('hh:mma') + ' - ' + eventData.end.format('hh:mma');
                            }
                        }

                        $el.popover({
                            title: eventData.title,
                            content: content,
                            trigger: 'hover',
                            placement: 'top',
                            container: 'body'
                        });
                    },
                });

                if (date) {
                    $(target).fullCalendar('gotoDate', date);
                }
            };

            $.require([
                'components/moment/moment.js',
                'components/fullcalendar/dist/fullcalendar.min.js',
                'components/fullcalendar/dist/fullcalendar.min.css',
                'components/handlebars/dist/handlebars.js'
                // 'components/fullcalendar/dist/fullcalendar.print.css'
            ], onAcquire);
        });

        /**
         * Board Page UI
         */
        $(window).on('board-init', function (e, target) {
            $.require([
                'components/jquery-sortable/source/js/jquery-sortable-min.js',
                'components/handlebars/dist/handlebars.js',
                'components/moment/moment.js',
                'components/@aprilsacil/number_format.js/number_format.min.js',
            ], function () {
                    // prepare data
                    var $target = $(target);
                    var stage = $target.data('stage');
                    var model = $target.data('model');
                    var field = $target.data('field');
                    var sort = $target.data('order');
                    var ajax = $target.data('ajax-pull');
                    var update = $target.data('ajax-update');
                    var currency = $target.data('currency');
                    var primary = $target.data('primary');
                    var detail = $target.data('card-detail');
                    var title = $target.data('card-title');
                    var date = $target.data('card-date');
                    var total = $target.data('total');
                    var admin = $target.data('admin');
                    var rangeFields = [];
                    var relations = {
                        'name': [],
                        'title': [],
                        'primary': []
                };

                    // set range
                if ($target.data('range-1')) {
                    rangeFields.push($target.data('range-1'));
                }

                    // if there's another column for range, add them
                if ($target.data('range-2')) {
                    rangeFields.push($target.data('range-2'));
                }

                    var columns = $target
                        .parent()
                        .find('.column')
                        .length;
                    var width = $('.board-container').width()/columns;

                if (width > 250) {
                    $target.css('width', width);
                }

                    var dataAttributes = $target.data();
                for (var name in dataAttributes) {
                    if (name.indexOf('relationsName-') !== -1) {
                        relations.name.push(dataAttributes[name]);
                    }

                    if (name.indexOf('relationsTitle-') !== -1) {
                        relations.title.push(dataAttributes[name]);
                    }

                    if (name.indexOf('relationsPrimary-') !== -1) {
                        relations.primary.push(dataAttributes[name]);
                    }
                }

                    $('.board-stage', target).sortable({
                        group: 'nav',
                        nested: false,
                        vertical: false,
                        onDrop: function (item, container, _super) {
                            var data = {
                                id: $(item).data('id'),
                                stage: field
                            };

                            var stage = $(container.el)
                                .parents('.column')
                                .data('stage');

                            // if same status/stage and no sorting field
                            // specified, we do nothing
                            if ($(item).data('stage') == stage && !sort) {
                                return;
                            }

                            data[field] = stage;

                            // if there's sort field provided,
                            // then we have to consider the re-ordering of cards
                            if (sort) {
                                // specify the sort page
                                data.sort = sort;
                                // get the primary id
                                data[primary] = $(item).data('id');
                                // get the previous order index
                                var previous_order = $(item).data('order');
                                // get the new order index
                                var newIndex = $(item)
                                    .parent()
                                    .children()
                                    .index(item);

                                // get the older index
                                var oldIndex = $(item).data('index');

                                // let's pull the serialize order
                                // we will be needing this later
                                var order = $(container.el)
                                    .sortable('serialize')
                                    .get(0);

                                // if it's the same, we do nothing
                                if (newIndex == previous_order
                                    && $(item).data('stage') == stage
                                ) {
                                    return;
                                }

                                data.previous_elder = 0;
                                if (previous_order != 1
                                    && order[eval(oldIndex - 1)]) {
                                    data.previous_elder = order[eval(oldIndex - 1)].order
                                }

                                // if it's not the
                                if ($(item).data('stage') != stage) {
                                    var oldStage = $(item).data('stage');
                                    var oldBoard = $('.pipeline-board .column[data-stage="' + oldStage + '"]');

                                    data.previous_elder = oldBoard
                                        .find('.card[data-index="' + eval(oldIndex - 1) + '"]')
                                        .data('order');

                                    if (!data.previous_elder) {
                                        data.previous_elder = 0;
                                    }

                                    data.previous_stage = $(item).data('stage')
                                }

                                data.new_elder = 0;
                                if (order[newIndex - 1]) {
                                    data.new_elder = order[newIndex - 1].order
                                }

                                // set drag direction downwards
                                data.moved = 'downwards';
                                data[sort] = data.new_elder;

                                // but if new index is less than
                                // the old index that means
                                // user dragged it upwards
                                // or if the user moved it to another
                                // status/stage, we also have to tagged
                                // it as a moved upwards in order to
                                // update everything down below
                                if (newIndex < previous_order
                                    || $(item).data('stage') != stage
                                ) {
                                    data.moved = 'upwards';
                                    data[sort] += 1;
                                }
                            }

                            $.post(update, data)
                                .done(function (response) {
                                    if (!response.error) {
                                        if (sort) {
                                            // previous stage/status/column
                                            if ($(item).data('stage') != stage) {
                                                $('.pipeline-board .column[data-stage="'+data.previous_stage+'"]')
                                                    .find('.card').each(function (index) {

                                                        // we should be ignoring the index
                                                        // less than the old index
                                                        // because we don't need to change them
                                                        if (index >= oldIndex) {
                                                            $(this)
                                                                .data('order', parseInt($(this).data('order')) - 1)
                                                                .attr('data-order', $(this).data('order'));
                                                        }

                                                        $(this)
                                                            .data('index', index)
                                                            .attr('data-index', index);
                                                    });
                                            }

                                            // new stage/status/column
                                            $(container.el).find('.card').each(function (index) {
                                                $(this)
                                                    .data('index', index)
                                                    .attr('data-index', index);

                                                if (index == newIndex) {
                                                    $(this)
                                                        .data('order', data[sort])
                                                        .attr('data-order', data[sort]);
                                                    return;
                                                }

                                                if (($(item).data('stage') == stage
                                                    && oldIndex >= index)
                                                    || ($(item).data('stage') != stage
                                                    && newIndex < index)
                                                ) {
                                                    $(this)
                                                        .data('order', $(this).data('order') + 1)
                                                        .attr('data-order', $(this).data('order'));
                                                }
                                            });

                                            $(item)
                                                .data('stage', stage)
                                                .attr('data-stage', stage);
                                        }
                                        toastr.success('Update successful!');
                                    }
                                });

                            _super(item, container);
                        }
                    });

                    var populateBoard = function (start, callback) {
                        var cardTemplate = '<li class="card" data-id="[[card_id]]"'
                            + 'data-stage="[[card_stage]]" data-order="[[card_order]]" '
                            + 'data-index="[[card_index]]">'
                            + '<div class="card-name">'
                            +   '<i class="pull-right field updated">[[card_diff]]</i>'
                            +       '<a href="[[card_link]]">'
                            +           '<strong>'
                            +               '<span class="name" title="[[card_name_title]]">'
                            +                   '[[card_name]]'
                            +               '</span>'
                            +           '</strong>'
                            +       '</a>'
                            +       '<p class="value">[[currency]] [[card_value]]</p>'
                            +       '<div class="card-relations">[[card_relations]]</div>'
                            +   '</div>'
                            +'</li>';

                        var data = {
                            start: start,
                            render: false,
                            range: 20,
                            filter: {}
                        };

                        data.filter[field] = stage;
                        if (sort) {
                            data.order = {};
                            data.order[sort] = 'ASC';
                        }

                        if (total) {
                            data.sum = total;
                        }

                        $.get(ajax, data)
                        .done(function (response) {
                            // stage total
                            $(target)
                                .find('.stage .badge')
                                .html(response.results.total);

                            if (!!response.results.rows) {
                                var lists = '';

                                $.map(response.results.rows, function (result, index) {
                                    var link = detail + '/' + result[primary];
                                    var relative = '';
                                    var name = 'No Title';
                                    var value = '';
                                    if (title) {
                                        name = Handlebars.compile(title)(result);
                                    }

                                    // card relative time
                                    if (date) {
                                        relative = moment(new Date(result[date]))
                                            .fromNow();
                                    }

                                    // card value
                                    if (result[rangeFields[0]] && result[rangeFields[1]]) {
                                        value = $.number_format(result[rangeFields[0]], 2)
                                            + ' - '
                                            + $.number_format(result[rangeFields[1]], 2);
                                    } else if (result[rangeFields[0]]) {
                                        value = $.number_format(result[rangeFields[0]], 2);
                                    }

                                    // if range is not specified but total is
                                    if (!rangeFields.length && total) {
                                        value = result[total];
                                    }

                                    var card = cardTemplate
                                        .replace('[[card_id]]', result[primary])
                                        .replace('[[card_link]]', link)
                                        .replace('[[card_stage]]', stage)
                                        .replace('[[card_diff]]', relative)
                                        .replace('[[card_name]]', name)
                                        .replace('[[card_index]]', index)
                                        .replace('[[card_order]]', result[sort])
                                        .replace('[[card_value]]', value);

                                    if (relations.primary) {
                                        html = '';
                                        for (var i in relations.primary) {
                                            var relationsLink = '';
                                            if (admin) {
                                                relationsLink += '/admin';
                                            }

                                            relationsLink += '/system/model/'
                                            + relations.name[i] + '/detail/'
                                            + result[relations.primary[i]];

                                            if (result[relations.title[i]]) {
                                                html += '<div><a href="'
                                                + relationsLink + '" title="'
                                                + result[relations.title[i]] + '">';

                                                // if there is an image
                                                if (result[relations.name[i]+'_image']) {
                                                    html += '<img src="'
                                                        + result[relations.name[i]+'_image']
                                                        + '" title="' + result[relations.title[i]]
                                                        + '" height="25px"/>';
                                                } else {
                                                    html += result[relations.title[i]]
                                                }

                                                html += '</a></div>';
                                            }
                                        }

                                        card = card.replace('[[card_relations]]', html);
                                    }

                                    lists += card;
                                });

                                if (total) {
                                    // insert total and range in stage header
                                    var template = '<span class="stage-total">'
                                        + '[[currency]] '
                                        + $.number_format(response.results.sum_field, 2)
                                        + '</span>';

                                    template = template
                                        .replace("[[currency]]", currency);

                                    $('.total-range-container', target)
                                        .html('')
                                        .append(template);
                                }

                                lists = lists
                                    .replace(/\[\[currency\]\]/g, currency);

                                //appends the card in the board-stage
                                $('.board-stage', target)
                                    .append(lists);

                                if (callback) {
                                    callback();
                                }
                            }

                            if (!response.results.rows && callback) {
                                callback();
                            }
                        });
                    };

                    var start = 0,
                        paginating = false,
                        loader = $('.board-stage', target).next(),
                        paginator = loader.next();

                    $('.board-stage', target).scroll(function () {
                        //if we are already paginating
                        if (paginating) {
                            return;
                        }

                        var variableHeight = $(this).scrollTop() + $(this).height();
                        var totalHeight = $(this).height();
                        var percent = variableHeight / totalHeight;
                        var range = 20;
                        if (percent < 1.75) {
                            return;
                        }

                        paginating = true;
                        start += range;

                        // show ajax loader
                        loader.removeClass('hide');
                        populateBoard(start, function () {
                            paginating = false;
                        });
                    });

                    populateBoard(0);
            });
        });

        /**
         * Carousel
         */
        $(window).on('carousel-init', function (e, target) {
            target = $(target);

            var width = target.data('width');

            if (width) {
                if (typeof width === 'number') {
                    width += 'px';
                } else if (width.indexOf('%') === -1 && width.indexOf('px') === -1) {
                    width += 'px';
                }

                target.css('width', width);
            }

            var height = target.data('height');
            if (height) {
                if (typeof height === 'number') {
                    height += 'px';
                } else if (height.indexOf('%') === -1 && height.indexOf('px') === -1) {
                    height += 'px';
                }

                $('img', target).css('height', height);
            }

            var config = {
                interval: target.data('interval') || 5000,
                keyboard: target.data('interval') || true,
                pause: target.data('pause') || 'hover',
                ride: target.data('ride') || true,
                wrap: target.data('wrap') || true
            };

            target.carousel(config);

            $('a.carousel-control-prev', target).click(function () {
                target.carousel('prev');
            });

            $('a.carousel-control-next', target).click(function () {
                target.carousel('next');
            });
        });

        /**
         * Package Page UI
         */
        $(window).on('package-move-up-click', function (e, trigger) {
            row = $(trigger).parents('tr');
            var prev = row.prev();

            if (prev.length && !prev.hasClass('file-field-none')) {
                prev.before(row);
                var data = [];

                $(trigger).parents('tbody').find('tr').each(function (index, tr) {
                    data.push($(tr).data('package'));
                });

                $.post('/admin/package/rearrange', {packages: data})
                    .done(function (response) {});
            }
        });

        /**
         * Package Page UI
         */
        $(window).on('package-move-down-click', function (e, trigger) {
            row = $(trigger).parents('tr');
            var next = row.next();

            if (next.length) {
                next.after(row);
                var data = [];

                $(trigger).parents('tbody').find('tr').each(function (index, tr) {
                    data.push($(tr).data('package'));
                });

                $.post('/admin/package/rearrange', {packages: data})
                    .done(function (response) {});
            }
        });
    })();

    /**
     * Notifier
     */
    (function () {
        $(window).on('notify-init', function (e, trigger) {
            var timeout = parseInt($(trigger).attr('data-timeout') || 3000);

            if (!timeout) {
                return;
            }

            setTimeout(function () {
                $(trigger).fadeOut('fast', function () {
                    $(trigger).remove();
                });

            }, timeout);
        });

        $.extend({
            notify: function (message, type, timeout) {
                if (type === 'danger') {
                    type = 'error';
                }

                var toast = toastr[type](message, type[0].toUpperCase() + type.substr(1), {
                    timeOut: timeout
                });

                return toast;
            }
        });
    })();

    /**
     * Admin Theme Top
     */
    (function () {
        $('body.theme-top aside.sidebar div.show').removeClass('show');
        $('body.theme-top aside.sidebar a[data-toggle="collapse"]').click(function () {
            var trigger = this;
            $('body.theme-top aside.sidebar > ul.nav > li.nav-item').each(function () {
                if ($.contains(this, trigger)) {
                    return;
                }

                $('div.show', this).removeClass('show');
            })
        });
    })();

    /**
     * Admin Configuration
     */
    (function () {
        $(window).on('config-builder-init', function (e, target) {
            var itemTemplate =
                '<li class="config-builder-item" data-level="{LEVEL}">'
                    + '<div class="config-builder-input input-group">'
                        + '<input '
                            + 'class="form-control system-form-control" '
                            + 'data-name="key" '
                            + 'placeholder="Config Key" '
                            + 'type="text" '
                        + '/>'
                        + '<input '
                            + 'class="form-control system-form-control" '
                            + 'data-name="value" '
                            + 'placeholder="Config Value" '
                            + 'type="text" '
                        + '/>'
                        + '<div class="input-group-append">'
                            + '<button class="btn btn-danger config-builder-action-remove" type="button">'
                                + '<i class="fas fa-times"></i>'
                            + '</button>'
                        + '</div>'
                    + '</div>'
                    + '<ol class="config-builder-list"></ol>'
                + '</li>';

            var depth = $(target).attr('data-depth') || 9;
            var message = $(target).attr('data-error') || 'Some items were empty';

            var reindex = function (list, level, path) {
                path = path || 'item';
                path += '[{INDEX}]';
                $(list).children('li.config-builder-item').each(function (i) {
                    var newPath = path.replace('{INDEX}', i);
                    $('div.config-builder-input:first', this).find('input').each(function () {
                        var name = $(this).attr('data-name');
                        if (!name.length) {
                            return;
                        }

                        $(this).attr('name', newPath + '[' + name + ']');
                    });

                    reindex($('ol.config-builder-list:first', this), level + 1, newPath + '[children]');
                });
            };

            var listen = function (item, level) {
                //by default level 1
                level = level || 1;
                item = $(item);

                //on button add click
                $('button.config-builder-action-add:first', item).click(function () {
                    //make the template
                    var newItem = $(
                        itemTemplate
                            .replace('{LEVEL}', level)
                    ).doon();

                    //append the template
                    $('ol.config-builder-list:first', item).append(newItem);

                    //reindex the names
                    reindex($('ol.config-builder-list:first', target), level);

                    //listen to the item
                    listen(newItem, level + 1);
                });

                //on button remove click
                $('button.config-builder-action-remove:first', item).click(function () {
                    $(this).closest('li.config-builder-item').remove();

                    //reindex the names
                    reindex($('ol.config-builder-list:first', target), level);
                });

                return item;
            };

            var checkForm = function (e) {
                var errors = false;
                $('input[data-name="key"]', target).each(function () {
                    if (!$(this).val().trim().length) {
                        $(this).parent().addClass('has-error');
                        errors = true;
                    }
                });

                $('input[data-name="value"]', target).each(function () {
                    if (!$(this).val().trim().length) {
                        $(this).parent().addClass('has-error');
                        errors = true;
                    }
                });

                if (errors) {
                    $('span.help-text', target).html(message);
                    e.preventDefault();
                    return false;
                }
            };

            //listen to the root
            listen(target)
                .submit(checkForm)
                //find all the current elements
                .find('li.config-builder-item')
                .each(function () {
                    listen(this).doon();
                });

            $.require('components/jquery-sortable/source/js/jquery-sortable-min.js', function () {
                var root = $('ol.config-builder-list:first');

                root.sortable({
                    onDrop: function ($item, container, _super, event) {
                        $item.removeClass(container.group.options.draggedClass).removeAttr('style');
                        $('body').removeClass(container.group.options.bodyClass);

                        setTimeout(function () {
                            reindex(root, 1);
                        }, 10);
                    }
                });

                reindex(root, 1);
            });
        });

        $(window).on('config-select-change', function (e, target) {
            target = $(target);

            window.location.search = '?type=' + target.val();
        });
    })();

    /**
     * Initialize
     */
    (function () {
        var cdn = $('html').attr('data-cdn') || '';
        // configure require
        require.config({
            cdn: {
                root : cdn
            },
            components: {
                root : cdn + '/components'
            }
        });

        //need to load dependencies
        $.require(
            [
                'components/doon/doon.min.js',
                'components/toastr/build/toastr.min.css',
                'components/toastr/build/toastr.min.js'
            ],
            function () {
                //activate all scripts
                $(document.body).doon();
            }
        );
    })();
});
