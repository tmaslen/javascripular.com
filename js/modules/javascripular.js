/*
    EXAMPLE HELPER
*/
(function() {
    var regex        = $('#regex'),
        flag         = $('#flag'),
        text = $('#text');

    function update_regex_fields(elm) {
        regex.val(elm.attr('data-regex'));
        flag.val(elm.attr('data-flag'));
        text.val(elm.attr('data-text'));
        window.scrollTo(0,0);
    }

    document.body.addEventListener('click', function(e) {
        if ($(e.target).hasClass('js-regex-helper')) {
            update_regex_fields($(e.target));
        }
    }, true);
})();


/*
    TABS INTERFACE
*/
(function() {

    var tab_interface = function(elm) {

        var that = this;
        this.elm = $(elm);
        this.panels = this.elm.find('.panel');
        this.build_tabs();
        this.tabs = this.elm.find('.panel__tabs');
        this.tab_links = this.elm.find('.panel__tabs .panel__tab-link');

        this.panels.addClass('panel--interactive');
        this.hide_panels();

        this.tabs[0].addEventListener('click', function(e) {
            if (e.target !== this) {
                that.press_tab($(e.target));
            }
        }, false);
        this.tabs[0].addEventListener('keypress', function(e) {
            if (e.target !== this) {
                that.press_tab($(e.target));
            }
        }, false);

        this.press_tab($(this.tab_links[0]));

    };

    tab_interface.prototype.build_tabs = function() {
        var tabs_html = "";
        this.elm.find('.panel__title').each(function() {
            tabs_html += '<li class="panel__tab">' +
                '<a href="#" class="panel__tab-link" data-panel="' + this.getAttribute('data-panel') + '">' + this.innerHTML + '</a>' +
            '</li>';
        });
        this.elm.prepend('<ul class="panel__tabs">' + tabs_html + '</ul>');
    };

    tab_interface.prototype.hide_panels = function() {
        this.panels.each(function(panel) {
            $(panel).removeClass('show');
        });
    };

    tab_interface.prototype.unselect_all_tabs = function() {
        this.tab_links.each(function(tab) {
            $(tab).removeClass('selected');
        });
    };

    tab_interface.prototype.press_tab = function(tab) {
        this.hide_panels();
        this.unselect_all_tabs();
        tab.addClass('selected');
        this.show_panel(tab.attr('data-panel'));
    };

    tab_interface.prototype.show_panel = function(panel_name) {
        $('.'+panel_name).addClass('show');
    };

    var ti = new tab_interface('.panels');

})();

/*
    REGEX BUDDY
*/
(function() {

    var regex = document.querySelector('#regex'),
        flag = document.querySelector('#flag'),
        text = document.querySelector('#text'),
        matchCaptures = document.querySelector('#match-captures'),
        matchCapturesHolder = document.querySelector('#match-captures-holder'),
        matchResult = document.querySelector('#match-result'),
        matchResultHolder = document.querySelector('#match-result-holder');

    document.body.addEventListener('click', function(e) {
        if ($(e.target).hasClass('js-regex-helper')) {
            regexBuddy(regex.value, flag.value);
        }
    }, false);

    regex.addEventListener('keyup', function(e) {
        regexBuddy(regex.value, flag.value);
    }, false);
    flag.addEventListener('keyup', function(e) {
        regexBuddy(regex.value, flag.value);
    }, false);
    text.addEventListener('keyup', function(e) {
        regexBuddy(regex.value, flag.value);
    }, false);

    function regexBuddy(regexVal, flagVal) {
        try {
            if (flagVal) {
                var result = text.value.match(new RegExp(regexVal, flagVal));
            }
            else {
                var result = text.value.match(new RegExp(regexVal));
            }
        }
        catch(e) {
            parseOutputBad('Error');
        }
        manageOutput(result);
    }

    function manageOutput(result) {
        matchResultHolder.style.display = 'block';
        if (result == null) {
            result = [];
        }
        renderSample(result);
        if (
            (result.length == 0) ||
            (result[0] == '')
        ) {
            matchCapturesHolder.style.display = 'none';
            //parseOutputBad('No matches');
        }
        else if(result.length == 1) {
            //matchCaptures.innerHTML = '';
            //matchCaptures.className = '';
            matchCapturesHolder.style.display = 'none';
        }
        else if(result.length >= 2) {
            parseOutputGood(result);
        }
    }

    function parseOutputBad(msg) {
        matchCaptures.innerHTML = '<ol><li>' + escapeHTML(msg) + '</li></ol>';
        matchCaptures.className = 'bad';
    }

    function parseOutputGood(result) {
        matchResult.style.display = 'block';
        var outputString = '';
        for(var i = 0, len = result.length; i < len; i++) {
            outputString += '<li>' + escapeHTML(result[i]) + '</li>';
        }   
        matchCaptures.className = 'good';
        matchCaptures.innerHTML = '<ol>' + outputString + '</ol>';
        matchCapturesHolder.style.display = 'block';
    }

    function escapeHTML(html) {
        var escape = document.createElement('textarea');
        escape.textContent = html;
        console.log(html);
        return escape.innerHTML;
    }

    function renderSample(result) {
        var output = '',
            textVal = text.value,
            matchStart,
            matchEnd;

        if(result.length > 1) {
            result = removeFirstItem(result);
        }

        for(var i = 0, len = result.length; i < len; i++) {
            matchStart = textVal.indexOf(result[i]);
            matchEnd = result[i].length;
            output += escapeHTML(textVal.substr(0, matchStart)) + '<span>' + escapeHTML(textVal.substr(matchStart, matchEnd)) + '</span>';
            textVal = escapeHTML( textVal.substr(matchStart+matchEnd) );
        }
        output += textVal;
        matchResult.innerHTML = output+'&nbsp;';
    }

    function removeFirstItem(arr) {
        var newArr = [];
        for(var x = 1, len = arr.length; x < len; x++) {
            newArr.push(arr[x]);
        }
        return newArr;
    }

})();