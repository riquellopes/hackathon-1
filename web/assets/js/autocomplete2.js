jQuery.widget('custom.catcomplete', jQuery.ui.autocomplete, {
    _renderItem: function(ul, item) {
        var obj = null;
        try {
            //obj = this.options.tplItem(ul, item, this.options.getTerm);
            return jQuery.proxy(this.options.classObj.tplItem, this)(ul, item);
        } catch (e) {
        }

        // return obj;
    },
    _renderMenu: function(ul, items) {
        try {
            return jQuery.proxy(this.options.classObj.tplMenu, this)(ul, items);
        } catch (e) {
        }
    },
    _resizeMenu: function() {
        var bl = this.options.classObj.getBoxResultLimit();

        if (bl) {
            var len = jQuery(this.menu.element).children().length;
            if (len > bl) {
                this.menu.element.css({
                    height: parseInt(this.menu.element.children('li:first').css('height')) * bl,
                    overflow: 'auto'
                });
            }
        }

        this.menu.element.css('minWidth', this.element.outerWidth());
    },
    _lower_and_remove_accented_chars: function(txt) {
        txt = txt.toLowerCase();
        txt = txt.replace(/[áàâãåäª]/gi, 'a');
        txt = txt.replace(/[éèêë]/gi, 'e');
        txt = txt.replace(/[íìîï]/gi, 'i');
        txt = txt.replace(/[óòôõöº°]/gi, 'o');
        txt = txt.replace(/[úùûüµ]/gi, 'u');
        txt = txt.replace(/[ñ]/gi, 'n');
        txt = txt.replace(/[ç]/, 'c');
        txt = txt.replace(/[ÿ¥]/, 'y');
        txt = txt.replace(/[¹]/, '1');
        txt = txt.replace(/[²]/, '2');
        txt = txt.replace(/[³]/, '3');
        txt = txt.replace(/[æ]/, 'ae');
        txt = txt.replace(/[ø]/, '0');
        return txt.replace(/[†°¢£§•¶ß®©™´¨≠±≤≥∂∑∏π∫Ω]/, '');
    }
});


AutoComplete2 = (function(param) {
    // inicialização das variaveis
    this._cache = [];
    this._to = null;
    this._name = null;
    this._url = null;
    this._qtdChars = 1; // min de caracteres digitados para iniciar a busca
    this._delay = 0; // delay para iniciar a busca após o usuário ter terminado de digitar
    this._boxResultLimit = 10;

    this._xhr = null;

    // fim da declaração de propriedades PRIVADAS

    this._onSelect = function() {
    };

    this.tplMenu = function(ul, items) {
        var that = this;
        jQuery.each(items, function(index, item) {
            if (item.name) {
                ul.append('<li class="ui-autocomplete-category">' + item.name + '</li>');

                if (item.data) {
                    jQuery.each(item.data, function(i, dado) {
                        that._renderItemData(ul, dado);
                    });
                }
            }
        });
    };

    this.tplItem = function(ul, item) {
        var strongText = this._lower_and_remove_accented_chars(item.value);

        var reg = new RegExp('(' + this._lower_and_remove_accented_chars(this.element.prop('value')) + ')', 'gi');
        regResult = reg.exec(strongText);

        try {
            strongText = strongText.replace(reg, '<strong>' + regResult[0] + '</strong>');
        } catch (e) {
        }

        var pInicial = strongText.indexOf('<strong>');
        var pFinal = strongText.indexOf('</strong>') - 8;

        if (pFinal > 0) {
            strongText = item.value.substring(0, pInicial) + '<strong>' + item.value.substring(pInicial, pFinal) + '</strong>' + item.value.substr(pFinal);
        }

        return jQuery('<li>')
                .attr('data-value', item.value)
                .append(
                        '<a href="' + (item.url ? item.url : 'javascript:;') + '">' +
                        strongText +
                        (item.endereco ? '<span class="ofertaOpcao">(' + item.endereco + ')</span>' : '') +
                        (item.qtdOferta ? '<span class="ofertaOpcao">(' + item.qtdOferta + (item.qtdOferta > 1 ? ' Opções' : ' Opção') + ')</span>' : '') +
                        '</a>'
                        )
                .appendTo(ul);
    };

    // inicio das substituições de propriedades e métodos

    if (param.to) {
        this._to = jQuery(param.to);
    } else {
        throw new Exception('Input type text isn\'t defined.');
    }

    if (param.name) {
        this._name = param.name;
    } else {
        this._name = jQuery(this._to).prop('name');
    }

    if (param.url) {
        this._url = param.url;
    }

    if (param.qtdChars) {
        this._qtdChars = param.qtdChars;
    }

    if (param.value) {
        this._to.prop('name', param.value);
    }

    if (param.text) {
        this._to.prop('value', param.text);
    }

    if (param.onSelect) {
        this._onSelect = jQuery.proxy(param.onSelect, this);
    }

    if (param.tplMenu) {
        this.tplMenu = param.tplMenu;
    }

    if (param.tplItem) {
        this.tplItem = param.tplItem;
    }

    if (param.boxResultLimit) {
        this._boxResultLimit = param.boxResultLimit;
    }

    this._prepareIptName = function(item) {
        var name = this._name;
        var mt = name.match(/\#(.*?)\#/gi);

        if (mt) {
            jQuery.each(mt, function(i) {
                var key = this.replace(/#/g, '');
                if (item[key]) {
                    name = name.replace(this, item[key]);
                }
            });
        }

        return name;
    };

    this._select = function(event, ui) {
        jQuery(this._to).prop('name', this._prepareIptName(ui.item));

        this._onSelect(ui.item);
    };

    this._getSource = function(request, response) {
        var term = request.term;

        if (term in this._cache) {
            response(this._cache[ term ]);
            return;
        }

        try {
            this._xhr.abort();
        } catch (e) {
        }

        this._imgLoading.show().css('marginTop', parseInt((this._to.innerHeight() / 2) - (this._imgLoading.innerHeight() / 2)) + 'px');

        this._xhr = jQuery.getJSON(this._url, {
            text: term
        }, jQuery.proxy(function(data, status, xhr) {
            this._cache[ term ] = data;

            response(data);

            this._imgLoading.hide();
        }, this));
    };

    this.getBoxResultLimit = function() {
        return this._boxResultLimit;
    };

    // init

    this._imgLoading = jQuery('<span class="autoComLoading"></span>').hide().insertAfter(this._to);

    jQuery(this._to).catcomplete({
        minLength: this._qtdChars,
        delay: this._delay,
        select: jQuery.proxy(this._select, this),
        source: jQuery.proxy(this._getSource, this),
        classObj: this,
    });
});