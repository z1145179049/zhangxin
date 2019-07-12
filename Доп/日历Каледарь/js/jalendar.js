
$(function () {    
    (function ($) {
        $.fn.jalendar = function (options) {
            
            var settings = $.extend({
                customDay: new Date(),
                color: '#65c2c0',
                lang: 'EN'
            }, options);
            
            // 语言            
            var dayNames = {};
            var monthNames = {};
            var lAddEvent = {};
            var lAllDay = {};
            var lTotalEvents = {};
            var lEvent = {};
            dayNames['EN'] = new Array('пн', 'вт', 'ср', 'чт', 'пя', 'су', 'во');
            monthNames['EN'] = new Array('Январь', 'февраль', 'март', 'апрель', 'май', 'июнь', 'июль', 'август', 'сентябрь', 'октябрь', 'ноябрь', 'декабрь'); 
            lAddEvent['EN'] = 'Добавить новое событие';
            lAllDay['EN'] = 'Весь день';
            lTotalEvents['EN'] = 'Всего событий в этом месяце: ';
            lEvent['EN'] = 'Событие(s)';
            
            var $this = $(this);
            var div = function (e, classN) {
                return $(document.createElement(e)).addClass(classN);
            };
            
            var clockHour = [];
            var clockMin = [];
            for (var i=0;i<24;i++ ){
                clockHour.push(div('div', 'option').text(i))
            }
            for (var i=0;i<60;i+=1 ){
                clockMin.push(div('div', 'option').text(i))
            }
            
            // HTML树
            $this.append(
                div('div', 'wood-bottom'), 
                div('div', 'jalendar-wood').append(
                    div('div', 'close-button'),
                    div('div', 'jalendar-pages').append(
                        div('div', 'pages-bottom'),
                        div('div', 'header').css('background-color', settings.color).append(
                            div('a', 'prv-m'),
                            div('h1'),
                            div('a', 'nxt-m'),
                            div('div', 'day-names')
                        ),
                        div('div', 'total-bar').html( lTotalEvents[settings.lang] + '<b style="color: '+settings.color+'"></b>'),
                        div('div', 'days')
                    ),
                    div('div', 'add-event').append(
                        div('div', 'add-new').append(
                            '<input type="text" placeholder="' + lAddEvent[settings.lang] + '" value="' + lAddEvent[settings.lang] + '" />',
                            div('div', 'submit'),
                            div('div', 'clear'),
                            div('div', 'add-time').append(
                                div('div', 'disabled'),
                                div('div', 'select').addClass('hour').css('background-color', settings.color).append(
                                    div('span').text('00'),
                                    div('div', 'dropdown').append(clockHour)
                                ),
                                div('div', 'left').append(':'),
                                div('div', 'select').addClass('min').css('background-color', settings.color).append(
                                    div('span').text('00'),
                                    div('div', 'dropdown').append(clockMin)
                                )
                            ),
                            div('div', 'all-day').append(
                                div('fieldset').attr('data-type','disabled').append(
                                    div('div', 'check').append(
                                        div('span', '')
                                    ),
                                    div('label').text(lAllDay[settings.lang])
                                )
                            ),
                            div('div', 'clear')
                        ),
                        div('div', 'events').append(
                            div('h3','').append(
                                div('span', '').html('<b></b> ' + lEvent[settings.lang])
                            ),
                            div('div', 'gradient-wood'),
                            div('div', 'events-list')
                        )
                    )
                )
            );
            
            // 添加日期框
            for (var i = 0; i < 42; i++) {
                $this.find('.days').append(div('div', 'day'));
            }
            
            // 添加日期名称字段
            for (var i = 0; i < 7; i++) {
                $this.find('.day-names').append(div('h2').text(dayNames[settings.lang][i]));
            }

            var d = new Date(settings.customDay);
            var year = d.getFullYear();
            var date = d.getDate();
            var month = d.getMonth();
            
            var isLeapYear = function(year1) {
                var f = new Date();
                f.setYear(year1);
                f.setMonth(1);
                f.setDate(29);
                return f.getDate() == 29;
            };
        
            var feb;
            var febCalc = function(feb) { 
                if (isLeapYear(year) === true) { feb = 29; } else { feb = 28; } 
                return feb;
            };
            var monthDays = new Array(31, febCalc(feb), 31, 30, 31, 30, 31, 31, 30, 31, 30, 31);

            function calcMonth() {

                monthDays[1] = febCalc(feb);
                
                var weekStart = new Date();
                weekStart.setFullYear(year, month, 0);
                var startDay = weekStart.getDay();  
                
                $this.find('.header h1').html(monthNames[settings.lang][month] + ' ' + year);
        
                $this.find('.day').html('&nbsp;');
                $this.find('.day').removeClass('this-month');
                for (var i = 1; i <= monthDays[month]; i++) {
                    startDay++;
                    $this.find('.day').eq(startDay-1).addClass('this-month').attr('data-date', i+'/'+(month+1)+'/'+year).html(i);
                }
                if ( month == d.getMonth() ) {
                    $this.find('.day.this-month').removeClass('today').eq(date-1).addClass('today').css('color', settings.color);
                } else {
                    $this.find('.day.this-month').removeClass('today').attr('style', '');
                }
                
                // 添加了活动
                $this.find('.added-event').each(function(i){
                    $(this).attr('data-id', i);
                    $this.find('.this-month[data-date="' + $(this).attr('data-date') + '"]').append(
                        div('div','event-single').attr('data-id', i).append(
                            div('p','').text($(this).attr('data-title')),
                            div('div','details').append(
                                div('div', 'clock').text($(this).attr('data-time')),
                                div('div', 'erase')
                            )
                        )
                    );
                    $this.find('.day').has('.event-single').addClass('have-event').prepend(div('i',''));
                });
                
                calcTotalDayAgain();  
                
            }
            
            calcMonth();
            
            var arrows = new Array ($this.find('.prv-m'), $this.find('.nxt-m'));
            var dropdown = new Array ($this.find('.add-time .select span'), $this.find('.add-time .select .dropdown .option'), $this.find('.add-time .select'));
            var allDay = new Array ('.all-day fieldset[data-type="disabled"]', '.all-day fieldset[data-type="enabled"]');
            var $close = $this.find('.jalendar-wood > .close-button');
            var $erase = $this.find('.event-single .erase');
            $this.find('.jalendar-pages').css({'width' : $this.find('.jalendar-pages').width() });
            $this.find('.events').css('height', ($this.height()-197) );
            $this.find('.select .dropdown .option').hover(function() {
                $(this).css('background-color', settings.color); 
            }, function(){
                $(this).css('background-color', 'inherit'); 
            });
            var jalendarWoodW = $this.find('.jalendar-wood').width();
            var woodBottomW = $this.find('.wood-bottom').width();

            // 计算滚动
            function calcScroll() {
                if ( $this.find('.events-list').height() < $this.find('.events').height() ) { $this.find('.gradient-wood').hide(); $this.find('.events-list').css('border', 'none') } else { $this.find('.gradient-wood').show(); }
            }
            
            // 再次计算总事件
            function calcTotalDayAgain() {
                var eventCount = $this.find('.this-month .event-single').length;
                $this.find('.total-bar b').text(eventCount);
                $this.find('.events h3 span b').text($this.find('.events .event-single').length)
            }
            
            function prevAddEvent() {
                $this.find('.day').removeClass('selected').removeAttr('style');
                $this.find('.today').css('color', settings.color);
                $this.find('.add-event').hide();
                $this.children('.jalendar-wood').animate({'width' : jalendarWoodW}, 200);
                $this.children('.wood-bottom').animate({'width' : woodBottomW}, 200);
                $close.hide();
            }
            
            arrows[1].on('click', function () {
                if ( month >= 11 ) {
                    month = 0;
                    year++;
                } else {
                    month++;   
                }
                calcMonth();
                prevAddEvent();
            });
            arrows[0].on('click', function () {
                dayClick = $this.find('.this-month');
                if ( month === 0 ) {
                    month = 11;
                    year--;
                } else {
                    month--;   
                }
                calcMonth();
                prevAddEvent();
            });
            
            $this.on('click', '.this-month', function () {
                var eventSingle = $(this).find('.event-single')
                $this.find('.events .event-single').remove();
                prevAddEvent();
                $(this).addClass('selected').css({'background-color': settings.color});
                $this.children('.jalendar-wood, .wood-bottom').animate({width : '+=300px' }, 200, function() {
                    $this.find('.add-event').show().find('.events-list').html(eventSingle.clone())
                    $this.find('.add-new input').select();
                    calcTotalDayAgain();
                    calcScroll();
                    $close.show();
                });
            });
            
            dropdown[0].click(function(){
                dropdown[2].children('.dropdown').hide(0);
                $(this).next('.dropdown').show(0);
            });
            dropdown[1].click(function(){
                $(this).parent().parent().children('span').text($(this).text());
                dropdown[2].children('.dropdown').hide(0);
            });
            $('html').click(function(){
                dropdown[2].children('.dropdown').hide(0); 
            });
            $('.add-time .select span').click(function(event){
                event.stopPropagation(); 
            });
            
            $this.on('click', allDay[0], function(){
                $(this).removeAttr('data-type').attr('data-type', 'enabled').children('.check').children().css('background-color', settings.color);
                dropdown[2].children('.dropdown').hide(0);
                $(this).parents('.all-day').prev('.add-time').css('opacity', '0.4').children('.disabled').css('z-index', '10');
            });
            $this.on('click', allDay[1], function(){
                $(this).removeAttr('data-type').attr('data-type', 'disabled').children('.check').children().css('background-color', 'transparent');
                $(this).parents('.all-day').prev('.add-time').css('opacity', '1').children('.disabled').css('z-index', '-1');
            });
            
            // 使用面板添加新事件
            var dataId = parseInt($this.find('.total-bar b').text());
            $this.find('.submit').on('click', function(){
                var title = $(this).prev('input').val();
                var hour = $(this).parents('.add-new').find('.hour > span').text();
                var min = $(this).parents('.add-new').find('.min > span').text();
                var isAllDay = $(this).parents('.add-new').find('.all-day fieldset').attr('data-type');
                var isAllDayText = $(this).parents('.add-new').find('.all-day fieldset label').text();
                var thisDay = $this.find('.day.this-month.selected').attr('data-date');
                var time;
                if ( isAllDay == 'disabled' ) {
                    time = hour + ':' + min;
                } else {
                    time = isAllDayText;
                }
                $this.prepend(div('div', 'added-event').attr({'data-date':thisDay, 'data-time': time, 'data-title': title, 'data-id': dataId}));
                
                $this.find('.day.this-month.selected').prepend(
                    div('div','event-single').attr('data-id', dataId).append(
                        div('p','').text(title),
                        div('div','details').append(
                            div('div', 'clock').text(time),
                            div('div', 'erase')
                        )
                    )
                );
                $this.find('.day').has('.event-single').addClass('have-event').prepend(div('i',''));
                $this.find('.events-list').html($this.find('.day.this-month.selected .event-single').clone())
                $this.find('.events-list .event-single').eq(0).hide().slideDown();
                calcTotalDayAgain();
                calcScroll();
                // 添加新事件后滚动顶部
                $this.find('.events-list').scrollTop(0);
                // 表格重置
                $this.find('.add-new > input[type="text"]').val(lAddEvent[settings.lang]).select();
                dataId++;
            });
            
            $close.on('click', function(){
                prevAddEvent(); 
            });
            
            // 删除事件
            $this.on('click', '.event-single .erase', function(){
                $('div[data-id=' + $(this).parents(".event-single").attr("data-id") + ']').animate({'height': 0}, function(){ 
                    $(this).remove();
                    calcTotalDayAgain();
                    calcScroll();
                });
            });

        };

    }(jQuery));

});

