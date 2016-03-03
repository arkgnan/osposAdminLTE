/*! opensourcepos 14-02-2016 */
function get_dimensions() {
    var a = {
        width: 0,
        height: 0
    };
    return "number" == typeof window.innerWidth ? (a.width = window.innerWidth, a.height = window.innerHeight) : document.documentElement && (document.documentElement.clientWidth || document.documentElement.clientHeight) ? (a.width = document.documentElement.clientWidth, a.height = document.documentElement.clientHeight) : document.body && (document.body.clientWidth || document.body.clientHeight) && (a.width = document.body.clientWidth, a.height = document.body.clientHeight), a
}

function set_feedback(a, b, c) {
    a ? ($("#feedback_bar").removeClass().addClass(b).html(a).css("opacity", "1"), c || $("#feedback_bar").fadeTo(5e3, 1).fadeTo("fast", 0)) : $("#feedback_bar").css("opacity", "0")
}

function checkbox_click(a) {
    a.stopPropagation(), do_email(enable_email.url), $(a.target).attr("checked") ? $(a.target).parent().parent().find("td").addClass("selected").css("backgroundColor", "") : $(a.target).parent().parent().find("td").removeClass()
}

function enable_search(a) {
    a.format_item || (format_item = function(a) {
        return a[0]
    }), enable_search.enabled || (enable_search.enabled = !0), $("#search").click(function() {
        $(this).attr("value", "")
    });
    var b = $("#search").autocomplete(a.suggest_url, {
        max: 100,
        delay: 10,
        selectFirst: !1,
        formatItem: a.format_item,
        extraParams: a.extra_params
    });
    return $("#search").result(function() {
        do_search(!0, a.on_complete)
    }), attach_search_listener(), $("#search_form").submit(function(b) {
        b.preventDefault(), $("#limit_from").val(0), get_selected_values().length > 0 && !confirm(a.confirm_search_message) || do_search(!0, a.on_complete)
    }), b
}

function attach_search_listener() {
    $("#pagination a").click(function(a) {
        if ($("#search").val() || $("#search_form input:checked")) {
            a.preventDefault();
            var b = a.currentTarget.href.split("/"),
                c = b.pop();
            $("#limit_from").val(c), do_search(!0)
        }
    })
}

function do_search(a, b) {
    enable_search.enabled && (a && $("#search").addClass("ac_loading"), $.post($("#search_form").attr("action"), $("#search_form").serialize(), function(a) {
        $("#sortable_table tbody").html(a.rows), "function" == typeof b && b(a), $("#search").removeClass("ac_loading"), tb_init("#sortable_table a.thickbox"), $("#pagination").html(a.pagination), $("#sortable_table tbody :checkbox").click(checkbox_click), $("#select_all").attr("checked", !1), a.total_rows > 0 && (update_sortable_table(), enable_row_selection()), attach_search_listener()
    }, "json"))
}

function enable_email(a) {
    enable_email.enabled || (enable_email.enabled = !0), enable_email.url || (enable_email.url = a), $("#select_all, #sortable_table tbody :checkbox").click(checkbox_click)
}

function do_email(a) {
    enable_email.enabled && $.post(a, {
        "ids[]": get_selected_values()
    }, function(a) {
        $("#email").attr("href", a)
    })
}

function enable_checkboxes() {
    $("#sortable_table tbody :checkbox").click(checkbox_click)
}

function enable_delete(a, b) {
    enable_delete.enabled || (enable_delete.enabled = !0), $("#delete").click(function(c) {
        if (c.preventDefault(), $("#sortable_table tbody :checkbox:checked").length > 0) {
            if (!confirm(a)) return !1;
            do_delete($(this).attr("href"))
        } else alert(b)
    })
}

function do_delete(a) {
    if (enable_delete.enabled) {
        var b = get_selected_values(),
            c = get_selected_rows();
        $.post(a, {
            "ids[]": b
        }, function(a) {
            a.success ? ($(c).each(function() {
                $(this).find("td").animate({
                    backgroundColor: "green"
                }, 1200, "linear").end().animate({
                    opacity: 0
                }, 1200, "linear", function() {
                    $(this).remove(), $("#sortable_table tbody tr").length > 0 && update_sortable_table()
                })
            }), set_feedback(a.message, "alert alert-dismissible alert-success", !1)) : set_feedback(a.message, "alert alert-dismissible alert-danger", !0)
        }, "json")
    }
}

function enable_bulk_edit(a) {
    enable_bulk_edit.enabled || (enable_bulk_edit.enabled = !0), $("#bulk_edit").click(function(b) {
        b.preventDefault(), $("#sortable_table tbody :checkbox:checked").length > 0 ? (tb_show($(this).attr("title"), $(this).attr("href"), !1), $(this).blur()) : alert(a)
    })
}

function enable_select_all() {
    enable_select_all.enabled || (enable_select_all.enabled = !0), $("#select_all").click(function() {
        $("#sortable_table tbody :checkbox").each($(this).attr("checked") ? function() {
            $(this).attr("checked", !0), $(this).parent().parent().find("td").addClass("selected").css("backgroundColor", "")
        } : function() {
            $(this).attr("checked", !1), $(this).parent().parent().find("td").removeClass()
        })
    })
}

function enable_row_selection(a) {
    enable_row_selection.enabled || (enable_row_selection.enabled = !0), "undefined" == typeof a && (a = $("#sortable_table tbody tr")), a.hover(function() {
        $(this).find("td").addClass("over").css("backgroundColor", ""), $(this).css("cursor", "pointer")
    }, function() {
        $(this).find("td").hasClass("selected") || $(this).find("td").removeClass()
    }), a.click(function() {
        var a = $(this).find(":checkbox");
        a.attr("checked", !a.attr("checked")), do_email(enable_email.url), a.attr("checked") ? $(this).find("td").addClass("selected").css("backgroundColor", "") : $(this).find("td").removeClass()
    })
}

function update_sortable_table() {
    if ($("#sortable_table").trigger("update"), "undefined" != typeof $("#sortable_table")[0].config) {
        var a = $("#sortable_table")[0].config.sortList;
        $("#sortable_table").trigger("sorton", [a])
    } else window.init_table_sorting && init_table_sorting()
}

function get_table_row(a) {
    a = a || $("input[name='sale_id']").val();
    var b = $("#sortable_table tbody :checkbox[value='" + a + "']");
    return 0 === b.length && (b = $("#sortable_table tbody a[href*='/" + a + "/']")), b
}

function update_row(a, b, c) {
    $.post(b, {
        row_id: a
    }, function(b) {
        var d = get_table_row(a).parent().parent();
        d.replaceWith(b), reinit_row(a), hightlight_row(a), c && "function" == typeof c && c()
    }, "html")
}

function reinit_row(a) {
    var b = $("#sortable_table tbody tr :checkbox[value=" + a + "]"),
        c = b.parent().parent();
    enable_row_selection(c), update_sortable_table(), tb_init(c.find("a.thickbox")), b.click(checkbox_click)
}

function animate_row(a, b) {
    b = b || "#e1ffdd", a.find("td").css("backgroundColor", "#ffffff").animate({
        backgroundColor: b
    }, "slow", "linear").animate({
        backgroundColor: b
    }, 5e3).animate({
        backgroundColor: "#ffffff"
    }, "slow", "linear")
}

function hightlight_row(a) {
    var b = $("#sortable_table tbody tr :checkbox[value=" + a + "]"),
        c = b.parent().parent();
    animate_row(c)
}

function get_selected_values() {
    var a = new Array;
    return $("#sortable_table tbody :checkbox:checked").each(function() {
        a.push($(this).val())
    }), a
}

function get_selected_rows() {
    var a = new Array;
    return $("#sortable_table tbody :checkbox:checked").each(function() {
        a.push($(this).parent().parent())
    }), a
}

function get_visible_checkbox_ids() {
    var a = new Array;
    return $("#sortable_table tbody :checkbox").each(function() {
        a.push($(this).val())
    }), a
}

function phpjsDate(a, b) {
    var c, d, e = this,
        f = ["Sun", "Mon", "Tues", "Wednes", "Thurs", "Fri", "Satur", "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
        g = /\\?(.?)/gi,
        h = function(a, b) {
            return d[a] ? d[a]() : b
        },
        i = function(a, b) {
            for (a = String(a); a.length < b;) a = "0" + a;
            return a
        };
    return d = {
        d: function() {
            return i(d.j(), 2)
        },
        D: function() {
            return d.l().slice(0, 3)
        },
        j: function() {
            return c.getDate()
        },
        l: function() {
            return f[d.w()] + "day"
        },
        N: function() {
            return d.w() || 7
        },
        S: function() {
            var a = d.j(),
                b = a % 10;
            return 3 >= b && 1 == parseInt(a % 100 / 10, 10) && (b = 0), ["st", "nd", "rd"][b - 1] || "th"
        },
        w: function() {
            return c.getDay()
        },
        z: function() {
            var a = new Date(d.Y(), d.n() - 1, d.j()),
                b = new Date(d.Y(), 0, 1);
            return Math.round((a - b) / 864e5)
        },
        W: function() {
            var a = new Date(d.Y(), d.n() - 1, d.j() - d.N() + 3),
                b = new Date(a.getFullYear(), 0, 4);
            return i(1 + Math.round((a - b) / 864e5 / 7), 2)
        },
        F: function() {
            return f[6 + d.n()]
        },
        m: function() {
            return i(d.n(), 2)
        },
        M: function() {
            return d.F().slice(0, 3)
        },
        n: function() {
            return c.getMonth() + 1
        },
        t: function() {
            return new Date(d.Y(), d.n(), 0).getDate()
        },
        L: function() {
            var a = d.Y();
            return a % 4 === 0 & a % 100 !== 0 | a % 400 === 0
        },
        o: function() {
            var a = d.n(),
                b = d.W(),
                c = d.Y();
            return c + (12 === a && 9 > b ? 1 : 1 === a && b > 9 ? -1 : 0)
        },
        Y: function() {
            return c.getFullYear()
        },
        y: function() {
            return d.Y().toString().slice(-2)
        },
        a: function() {
            return c.getHours() > 11 ? "pm" : "am"
        },
        A: function() {
            return d.a().toUpperCase()
        },
        B: function() {
            var a = 3600 * c.getUTCHours(),
                b = 60 * c.getUTCMinutes(),
                d = c.getUTCSeconds();
            return i(Math.floor((a + b + d + 3600) / 86.4) % 1e3, 3)
        },
        g: function() {
            return d.G() % 12 || 12
        },
        G: function() {
            return c.getHours()
        },
        h: function() {
            return i(d.g(), 2)
        },
        H: function() {
            return i(d.G(), 2)
        },
        i: function() {
            return i(c.getMinutes(), 2)
        },
        s: function() {
            return i(c.getSeconds(), 2)
        },
        u: function() {
            return i(1e3 * c.getMilliseconds(), 6)
        },
        e: function() {
            throw "Not supported (see source code of date() for timezone on how to add support)"
        },
        I: function() {
            var a = new Date(d.Y(), 0),
                b = Date.UTC(d.Y(), 0),
                c = new Date(d.Y(), 6),
                e = Date.UTC(d.Y(), 6);
            return a - b !== c - e ? 1 : 0
        },
        O: function() {
            var a = c.getTimezoneOffset(),
                b = Math.abs(a);
            return (a > 0 ? "-" : "+") + i(100 * Math.floor(b / 60) + b % 60, 4)
        },
        P: function() {
            var a = d.O();
            return a.substr(0, 3) + ":" + a.substr(3, 2)
        },
        T: function() {
            return "UTC"
        },
        Z: function() {
            return 60 * -c.getTimezoneOffset()
        },
        c: function() {
            return "Y-m-d\\TH:i:sP".replace(g, h)
        },
        r: function() {
            return "D, d M Y H:i:s O".replace(g, h)
        },
        U: function() {
            return c / 1e3 | 0
        }
    }, this.date = function(a, b) {
        return e = this, c = void 0 === b ? new Date : new Date(b instanceof Date ? b : 1e3 * b), a.replace(g, h)
    }, this.date(a, b)
}

function tb_init(a) {
    $(a).click(function() {
        var a = this.title || this.name || null,
            b = this.href || this.alt,
            c = this.rel || !1;
        return tb_show(a, b, c), this.blur(), !1
    })
}

function tb_show(a, b, c) {
    try {
        "undefined" == typeof document.body.style.maxHeight ? ($("body", "html").css({
            height: "100%",
            width: "100%"
        }), $("html").css("overflow", "hidden"), null === document.getElementById("TB_HideSelect") && ($("body").append("<iframe id='TB_HideSelect'></iframe><div id='TB_overlay'></div><div id='TB_window'></div>"), $("#TB_overlay").click(tb_remove))) : null === document.getElementById("TB_overlay") && ($("body").append("<div id='TB_overlay'></div><div id='TB_window'></div>"), $("#TB_overlay").click(tb_remove)), $("#TB_overlay").addClass(tb_detectMacXFF() ? "TB_overlayMacFFBGHack" : "TB_overlayBG"), null === a && (a = ""), $("body").append("<div id='TB_load'><img src='" + imgLoader.src + "' /></div>"), $("#TB_load").show();
        var d;
        d = -1 !== b.indexOf("?") ? b.substr(0, b.indexOf("?")) : b;
        var e = /\.jpg$|\.jpeg$|\.png$|\.gif$|\.bmp$/,
            f = d.toLowerCase().match(e);
        if (".jpg" == f || ".jpeg" == f || ".png" == f || ".gif" == f || ".bmp" == f) {
            if (TB_PrevCaption = "", TB_PrevURL = "", TB_PrevHTML = "", TB_NextCaption = "", TB_NextURL = "", TB_NextHTML = "", TB_imageCount = "", TB_FoundURL = !1, c)
                for (TB_TempArray = $("a[@rel=" + c + "]").get(), TB_Counter = 0; TB_Counter < TB_TempArray.length && "" === TB_NextHTML; TB_Counter++) {
                    {
                        TB_TempArray[TB_Counter].href.toLowerCase().match(e)
                    }
                    TB_TempArray[TB_Counter].href != b ? TB_FoundURL ? (TB_NextCaption = TB_TempArray[TB_Counter].title, TB_NextURL = TB_TempArray[TB_Counter].href, TB_NextHTML = "<span id='TB_next'>&nbsp;&nbsp;<a href='#'>Next &gt;</a></span>") : (TB_PrevCaption = TB_TempArray[TB_Counter].title, TB_PrevURL = TB_TempArray[TB_Counter].href, TB_PrevHTML = "<span id='TB_prev'>&nbsp;&nbsp;<a href='#'>&lt; Prev</a></span>") : (TB_FoundURL = !0, TB_imageCount = "Image " + (TB_Counter + 1) + " of " + TB_TempArray.length)
                }
            imgPreloader = new Image, imgPreloader.onload = function() {
                function d() {
                    return $(document).unbind("click", d) && $(document).unbind("click", d), $("#TB_window").remove(), $("body").append("<div id='TB_window'></div>"), tb_show(TB_PrevCaption, TB_PrevURL, c), !1
                }

                function e() {
                    return $("#TB_window").remove(), $("body").append("<div id='TB_window'></div>"), tb_show(TB_NextCaption, TB_NextURL, c), !1
                }
                imgPreloader.onload = null;
                var f = tb_getPageSize(),
                    g = f[0] - 150,
                    h = f[1] - 150,
                    i = imgPreloader.width,
                    j = imgPreloader.height;
                i > g ? (j *= g / i, i = g, j > h && (i *= h / j, j = h)) : j > h && (i *= h / j, j = h, i > g && (j *= g / i, i = g)), TB_WIDTH = i + 30, TB_HEIGHT = j + 60, $("#TB_window").append("<a href='' id='TB_ImageOff' title='Close'><img id='TB_Image' src='" + b + "' width='" + i + "' height='" + j + "' alt='" + a + "'/></a><div id='TB_caption'>" + a + "<div id='TB_secondLine'>" + TB_imageCount + TB_PrevHTML + TB_NextHTML + "</div></div><div id='TB_closeWindow'><a href='#' id='TB_closeWindowButton' title='Close'>X</a></div>"), $("#TB_closeWindowButton").click(tb_remove), "" !== TB_PrevHTML && $("#TB_prev").click(d), "" !== TB_NextHTML && $("#TB_next").click(e), document.onkeydown = function(a) {
                    keycode = null == a ? event.keyCode : a.which, 27 == keycode ? tb_remove() : 190 == keycode ? "" != TB_NextHTML && (document.onkeydown = "", e()) : 188 == keycode && "" != TB_PrevHTML && (document.onkeydown = "", d())
                }, tb_position(), $("#TB_load").remove(), $("#TB_ImageOff").click(tb_remove), $("#TB_window").css({
                    display: "block"
                })
            }, imgPreloader.src = b
        } else {
            var g = tb_parseUrl(b),
                h = get_dimensions();
            TB_WIDTH = 1 * g.width + 30 || .6 * h.width, TB_HEIGHT = 1 * g.height + 40 || .85 * h.height, ajaxContentW = TB_WIDTH - 30, ajaxContentH = TB_HEIGHT - 45, -1 != b.indexOf("TB_iframe") ? (urlNoQuery = b.split("TB_"), $("#TB_iframeContent").remove(), "true" != g.modal ? $("#TB_window").append("<div id='TB_title'><div id='TB_ajaxWindowTitle'>" + a + "</div><div id='TB_closeAjaxWindow'><a href='#' id='TB_closeWindowButton' title='Close'>X</a></div></div><iframe frameborder='0' hspace='0' src='" + urlNoQuery[0] + "' id='TB_iframeContent' name='TB_iframeContent" + Math.round(1e3 * Math.random()) + "' onload='tb_showIframe()' style='width:" + (ajaxContentW + 29) + "px;height:" + (ajaxContentH + 17) + "px;' > </iframe>") : ($("#TB_overlay").unbind(), $("#TB_window").append("<iframe frameborder='0' hspace='0' src='" + urlNoQuery[0] + "' id='TB_iframeContent' name='TB_iframeContent" + Math.round(1e3 * Math.random()) + "' onload='tb_showIframe()' style='width:" + (ajaxContentW + 29) + "px;height:" + (ajaxContentH + 17) + "px;'> </iframe>"))) : "block" != $("#TB_window").css("display") ? "true" != g.modal ? $("#TB_window").append("<div id='TB_title'><div id='TB_ajaxWindowTitle'>" + a + "</div><div id='TB_closeAjaxWindow'><a href='#' id='TB_closeWindowButton'>X</a></div></div><div id='TB_ajaxContent' style='width:" + ajaxContentW + "px;height:" + ajaxContentH + "px'></div>") : ($("#TB_overlay").unbind(), $("#TB_window").append("<div id='TB_ajaxContent' class='TB_modal' style='width:" + ajaxContentW + "px;height:" + ajaxContentH + "px;'></div>")) : ($("#TB_ajaxContent")[0].style.width = ajaxContentW + "px", $("#TB_ajaxContent")[0].style.height = ajaxContentH + "px", $("#TB_ajaxContent")[0].scrollTop = 0, $("#TB_ajaxWindowTitle").html(a)), $("#TB_closeWindowButton").click(tb_remove), -1 != b.indexOf("TB_inline") ? ($("#TB_ajaxContent").append($("#" + g.inlineId).children()), $("#TB_window").unload(function() {
                $("#" + g.inlineId).append($("#TB_ajaxContent").children())
            }), tb_position(), $("#TB_load").remove(), $("#TB_window").css({
                display: "block"
            })) : -1 != b.indexOf("TB_iframe") ? (tb_position(), $.browser.safari && ($("#TB_load").remove(), $("#TB_window").css({
                display: "block"
            }))) : $("#TB_ajaxContent").load(b += "/random:" + (new Date).getTime(), function() {
                tb_position(), $("#TB_load").remove(), tb_init("#TB_ajaxContent a.thickbox"), $("#TB_window").css({
                    display: "block"
                })
            })
        }
        g.modal || (document.onkeyup = function(a) {
            keycode = null == a ? event.keyCode : a.which, 27 == keycode && tb_remove()
        })
    } catch (i) {}
}

function tb_showIframe() {
    $("#TB_load").remove(), $("#TB_window").css({
        display: "block"
    })
}

function tb_remove() {
    return $("#TB_imageOff").unbind("click"), $("#TB_closeWindowButton").unbind("click"), $("#TB_window").fadeOut("fast", function() {
        $("#TB_window,#TB_overlay,#TB_HideSelect").trigger("unload").unbind().remove()
    }), $("#TB_load").remove(), "undefined" == typeof document.body.style.maxHeight && ($("body", "html").css({
        height: "auto",
        width: "auto"
    }), $("html").css("overflow", "")), document.onkeydown = "", document.onkeyup = "", !1
}

function tb_position() {
    $("#TB_window").css({
        marginLeft: "-" + parseInt(TB_WIDTH / 2, 10) + "px",
        width: TB_WIDTH + "px"
    }), jQuery.browser.msie && jQuery.browser.version < 7 || $("#TB_window").css({
        marginTop: "-" + parseInt(TB_HEIGHT / 2, 10) + "px"
    })
}

function tb_parseQuery(a) {
    var b = {};
    if (!a) return b;
    for (var c = a.split(/[;&]/), d = 0; d < c.length; d++) {
        var e = c[d].split("=");
        if (e && 2 == e.length) {
            var f = unescape(e[0]),
                g = unescape(e[1]);
            g = g.replace(/\+/g, " "), b[f] = g
        }
    }
    return b
}

function tb_parseUrl(a) {
    var b = {};
    if (!a) return b;
    var c = a.match(/[a-z 0-9~%.:_\-]+:[a-z 0-9~%.:_\-]+/gi);
    if (null == c) return b;
    for (var d = 0; d < c.length; d++) {
        var e = c[d].split(":");
        if (e && 2 == e.length) {
            var f = unescape(e[0]),
                g = unescape(e[1]);
            g = g.replace(/\+/g, " "), b[f] = g
        }
    }
    return b
}

function tb_getPageSize() {
    var a = document.documentElement,
        b = window.innerWidth || self.innerWidth || a && a.clientWidth || document.body.clientWidth,
        c = window.innerHeight || self.innerHeight || a && a.clientHeight || document.body.clientHeight;
    return arrayPageSize = [b, c], arrayPageSize
}

function tb_detectMacXFF() {
    var a = navigator.userAgent.toLowerCase();
    return -1 != a.indexOf("mac") && -1 != a.indexOf("firefox") ? !0 : void 0
}
if (function(a, b) {
        "object" == typeof module && "object" == typeof module.exports ? module.exports = a.document ? b(a, !0) : function(a) {
            if (!a.document) throw new Error("jQuery requires a window with a document");
            return b(a)
        } : b(a)
    }("undefined" != typeof window ? window : this, function(a, b) {
        function c(a) {
            var b = !!a && "length" in a && a.length,
                c = na.type(a);
            return "function" === c || na.isWindow(a) ? !1 : "array" === c || 0 === b || "number" == typeof b && b > 0 && b - 1 in a
        }

        function d(a, b, c) {
            if (na.isFunction(b)) return na.grep(a, function(a, d) {
                return !!b.call(a, d, a) !== c
            });
            if (b.nodeType) return na.grep(a, function(a) {
                return a === b !== c
            });
            if ("string" == typeof b) {
                if (xa.test(b)) return na.filter(b, a, c);
                b = na.filter(b, a)
            }
            return na.grep(a, function(a) {
                return na.inArray(a, b) > -1 !== c
            })
        }

        function e(a, b) {
            do a = a[b]; while (a && 1 !== a.nodeType);
            return a
        }

        function f(a) {
            var b = {};
            return na.each(a.match(Da) || [], function(a, c) {
                b[c] = !0
            }), b
        }

        function g() {
            da.addEventListener ? (da.removeEventListener("DOMContentLoaded", h), a.removeEventListener("load", h)) : (da.detachEvent("onreadystatechange", h), a.detachEvent("onload", h))
        }

        function h() {
            (da.addEventListener || "load" === a.event.type || "complete" === da.readyState) && (g(), na.ready())
        }

        function i(a, b, c) {
            if (void 0 === c && 1 === a.nodeType) {
                var d = "data-" + b.replace(Ia, "-$1").toLowerCase();
                if (c = a.getAttribute(d), "string" == typeof c) {
                    try {
                        c = "true" === c ? !0 : "false" === c ? !1 : "null" === c ? null : +c + "" === c ? +c : Ha.test(c) ? na.parseJSON(c) : c
                    } catch (e) {}
                    na.data(a, b, c)
                } else c = void 0
            }
            return c
        }

        function j(a) {
            var b;
            for (b in a)
                if (("data" !== b || !na.isEmptyObject(a[b])) && "toJSON" !== b) return !1;
            return !0
        }

        function k(a, b, c, d) {
            if (Ga(a)) {
                var e, f, g = na.expando,
                    h = a.nodeType,
                    i = h ? na.cache : a,
                    j = h ? a[g] : a[g] && g;
                if (j && i[j] && (d || i[j].data) || void 0 !== c || "string" != typeof b) return j || (j = h ? a[g] = ca.pop() || na.guid++ : g), i[j] || (i[j] = h ? {} : {
                    toJSON: na.noop
                }), ("object" == typeof b || "function" == typeof b) && (d ? i[j] = na.extend(i[j], b) : i[j].data = na.extend(i[j].data, b)), f = i[j], d || (f.data || (f.data = {}), f = f.data), void 0 !== c && (f[na.camelCase(b)] = c), "string" == typeof b ? (e = f[b], null == e && (e = f[na.camelCase(b)])) : e = f, e
            }
        }

        function l(a, b, c) {
            if (Ga(a)) {
                var d, e, f = a.nodeType,
                    g = f ? na.cache : a,
                    h = f ? a[na.expando] : na.expando;
                if (g[h]) {
                    if (b && (d = c ? g[h] : g[h].data)) {
                        na.isArray(b) ? b = b.concat(na.map(b, na.camelCase)) : b in d ? b = [b] : (b = na.camelCase(b), b = b in d ? [b] : b.split(" ")), e = b.length;
                        for (; e--;) delete d[b[e]];
                        if (c ? !j(d) : !na.isEmptyObject(d)) return
                    }(c || (delete g[h].data, j(g[h]))) && (f ? na.cleanData([a], !0) : la.deleteExpando || g != g.window ? delete g[h] : g[h] = void 0)
                }
            }
        }

        function m(a, b, c, d) {
            var e, f = 1,
                g = 20,
                h = d ? function() {
                    return d.cur()
                } : function() {
                    return na.css(a, b, "")
                },
                i = h(),
                j = c && c[3] || (na.cssNumber[b] ? "" : "px"),
                k = (na.cssNumber[b] || "px" !== j && +i) && Ka.exec(na.css(a, b));
            if (k && k[3] !== j) {
                j = j || k[3], c = c || [], k = +i || 1;
                do f = f || ".5", k /= f, na.style(a, b, k + j); while (f !== (f = h() / i) && 1 !== f && --g)
            }
            return c && (k = +k || +i || 0, e = c[1] ? k + (c[1] + 1) * c[2] : +c[2], d && (d.unit = j, d.start = k, d.end = e)), e
        }

        function n(a) {
            var b = Sa.split("|"),
                c = a.createDocumentFragment();
            if (c.createElement)
                for (; b.length;) c.createElement(b.pop());
            return c
        }

        function o(a, b) {
            var c, d, e = 0,
                f = "undefined" != typeof a.getElementsByTagName ? a.getElementsByTagName(b || "*") : "undefined" != typeof a.querySelectorAll ? a.querySelectorAll(b || "*") : void 0;
            if (!f)
                for (f = [], c = a.childNodes || a; null != (d = c[e]); e++) !b || na.nodeName(d, b) ? f.push(d) : na.merge(f, o(d, b));
            return void 0 === b || b && na.nodeName(a, b) ? na.merge([a], f) : f
        }

        function p(a, b) {
            for (var c, d = 0; null != (c = a[d]); d++) na._data(c, "globalEval", !b || na._data(b[d], "globalEval"))
        }

        function q(a) {
            Oa.test(a.type) && (a.defaultChecked = a.checked)
        }

        function r(a, b, c, d, e) {
            for (var f, g, h, i, j, k, l, m = a.length, r = n(b), s = [], t = 0; m > t; t++)
                if (g = a[t], g || 0 === g)
                    if ("object" === na.type(g)) na.merge(s, g.nodeType ? [g] : g);
                    else if (Ua.test(g)) {
                for (i = i || r.appendChild(b.createElement("div")), j = (Pa.exec(g) || ["", ""])[1].toLowerCase(), l = Ta[j] || Ta._default, i.innerHTML = l[1] + na.htmlPrefilter(g) + l[2], f = l[0]; f--;) i = i.lastChild;
                if (!la.leadingWhitespace && Ra.test(g) && s.push(b.createTextNode(Ra.exec(g)[0])), !la.tbody)
                    for (g = "table" !== j || Va.test(g) ? "<table>" !== l[1] || Va.test(g) ? 0 : i : i.firstChild, f = g && g.childNodes.length; f--;) na.nodeName(k = g.childNodes[f], "tbody") && !k.childNodes.length && g.removeChild(k);
                for (na.merge(s, i.childNodes), i.textContent = ""; i.firstChild;) i.removeChild(i.firstChild);
                i = r.lastChild
            } else s.push(b.createTextNode(g));
            for (i && r.removeChild(i), la.appendChecked || na.grep(o(s, "input"), q), t = 0; g = s[t++];)
                if (d && na.inArray(g, d) > -1) e && e.push(g);
                else if (h = na.contains(g.ownerDocument, g), i = o(r.appendChild(g), "script"), h && p(i), c)
                for (f = 0; g = i[f++];) Qa.test(g.type || "") && c.push(g);
            return i = null, r
        }

        function s() {
            return !0
        }

        function t() {
            return !1
        }

        function u() {
            try {
                return da.activeElement
            } catch (a) {}
        }

        function v(a, b, c, d, e, f) {
            var g, h;
            if ("object" == typeof b) {
                "string" != typeof c && (d = d || c, c = void 0);
                for (h in b) v(a, h, c, d, b[h], f);
                return a
            }
            if (null == d && null == e ? (e = c, d = c = void 0) : null == e && ("string" == typeof c ? (e = d, d = void 0) : (e = d, d = c, c = void 0)), e === !1) e = t;
            else if (!e) return a;
            return 1 === f && (g = e, e = function(a) {
                return na().off(a), g.apply(this, arguments)
            }, e.guid = g.guid || (g.guid = na.guid++)), a.each(function() {
                na.event.add(this, b, e, d, c)
            })
        }

        function w(a, b) {
            return na.nodeName(a, "table") && na.nodeName(11 !== b.nodeType ? b : b.firstChild, "tr") ? a.getElementsByTagName("tbody")[0] || a.appendChild(a.ownerDocument.createElement("tbody")) : a
        }

        function x(a) {
            return a.type = (null !== na.find.attr(a, "type")) + "/" + a.type, a
        }

        function y(a) {
            var b = eb.exec(a.type);
            return b ? a.type = b[1] : a.removeAttribute("type"), a
        }

        function z(a, b) {
            if (1 === b.nodeType && na.hasData(a)) {
                var c, d, e, f = na._data(a),
                    g = na._data(b, f),
                    h = f.events;
                if (h) {
                    delete g.handle, g.events = {};
                    for (c in h)
                        for (d = 0, e = h[c].length; e > d; d++) na.event.add(b, c, h[c][d])
                }
                g.data && (g.data = na.extend({}, g.data))
            }
        }

        function A(a, b) {
            var c, d, e;
            if (1 === b.nodeType) {
                if (c = b.nodeName.toLowerCase(), !la.noCloneEvent && b[na.expando]) {
                    e = na._data(b);
                    for (d in e.events) na.removeEvent(b, d, e.handle);
                    b.removeAttribute(na.expando)
                }
                "script" === c && b.text !== a.text ? (x(b).text = a.text, y(b)) : "object" === c ? (b.parentNode && (b.outerHTML = a.outerHTML), la.html5Clone && a.innerHTML && !na.trim(b.innerHTML) && (b.innerHTML = a.innerHTML)) : "input" === c && Oa.test(a.type) ? (b.defaultChecked = b.checked = a.checked, b.value !== a.value && (b.value = a.value)) : "option" === c ? b.defaultSelected = b.selected = a.defaultSelected : ("input" === c || "textarea" === c) && (b.defaultValue = a.defaultValue)
            }
        }

        function B(a, b, c, d) {
            b = fa.apply([], b);
            var e, f, g, h, i, j, k = 0,
                l = a.length,
                m = l - 1,
                n = b[0],
                p = na.isFunction(n);
            if (p || l > 1 && "string" == typeof n && !la.checkClone && db.test(n)) return a.each(function(e) {
                var f = a.eq(e);
                p && (b[0] = n.call(this, e, f.html())), B(f, b, c, d)
            });
            if (l && (j = r(b, a[0].ownerDocument, !1, a, d), e = j.firstChild, 1 === j.childNodes.length && (j = e), e || d)) {
                for (h = na.map(o(j, "script"), x), g = h.length; l > k; k++) f = j, k !== m && (f = na.clone(f, !0, !0), g && na.merge(h, o(f, "script"))), c.call(a[k], f, k);
                if (g)
                    for (i = h[h.length - 1].ownerDocument, na.map(h, y), k = 0; g > k; k++) f = h[k], Qa.test(f.type || "") && !na._data(f, "globalEval") && na.contains(i, f) && (f.src ? na._evalUrl && na._evalUrl(f.src) : na.globalEval((f.text || f.textContent || f.innerHTML || "").replace(fb, "")));
                j = e = null
            }
            return a
        }

        function C(a, b, c) {
            for (var d, e = b ? na.filter(b, a) : a, f = 0; null != (d = e[f]); f++) c || 1 !== d.nodeType || na.cleanData(o(d)), d.parentNode && (c && na.contains(d.ownerDocument, d) && p(o(d, "script")), d.parentNode.removeChild(d));
            return a
        }

        function D(a, b) {
            var c = na(b.createElement(a)).appendTo(b.body),
                d = na.css(c[0], "display");
            return c.detach(), d
        }

        function E(a) {
            var b = da,
                c = jb[a];
            return c || (c = D(a, b), "none" !== c && c || (ib = (ib || na("<iframe frameborder='0' width='0' height='0'/>")).appendTo(b.documentElement), b = (ib[0].contentWindow || ib[0].contentDocument).document, b.write(), b.close(), c = D(a, b), ib.detach()), jb[a] = c), c
        }

        function F(a, b) {
            return {
                get: function() {
                    return a() ? void delete this.get : (this.get = b).apply(this, arguments)
                }
            }
        }

        function G(a) {
            if (a in yb) return a;
            for (var b = a.charAt(0).toUpperCase() + a.slice(1), c = xb.length; c--;)
                if (a = xb[c] + b, a in yb) return a
        }

        function H(a, b) {
            for (var c, d, e, f = [], g = 0, h = a.length; h > g; g++) d = a[g], d.style && (f[g] = na._data(d, "olddisplay"), c = d.style.display, b ? (f[g] || "none" !== c || (d.style.display = ""), "" === d.style.display && Ma(d) && (f[g] = na._data(d, "olddisplay", E(d.nodeName)))) : (e = Ma(d), (c && "none" !== c || !e) && na._data(d, "olddisplay", e ? c : na.css(d, "display"))));
            for (g = 0; h > g; g++) d = a[g], d.style && (b && "none" !== d.style.display && "" !== d.style.display || (d.style.display = b ? f[g] || "" : "none"));
            return a
        }

        function I(a, b, c) {
            var d = ub.exec(b);
            return d ? Math.max(0, d[1] - (c || 0)) + (d[2] || "px") : b
        }

        function J(a, b, c, d, e) {
            for (var f = c === (d ? "border" : "content") ? 4 : "width" === b ? 1 : 0, g = 0; 4 > f; f += 2) "margin" === c && (g += na.css(a, c + La[f], !0, e)), d ? ("content" === c && (g -= na.css(a, "padding" + La[f], !0, e)), "margin" !== c && (g -= na.css(a, "border" + La[f] + "Width", !0, e))) : (g += na.css(a, "padding" + La[f], !0, e), "padding" !== c && (g += na.css(a, "border" + La[f] + "Width", !0, e)));
            return g
        }

        function K(b, c, d) {
            var e = !0,
                f = "width" === c ? b.offsetWidth : b.offsetHeight,
                g = ob(b),
                h = la.boxSizing && "border-box" === na.css(b, "boxSizing", !1, g);
            if (da.msFullscreenElement && a.top !== a && b.getClientRects().length && (f = Math.round(100 * b.getBoundingClientRect()[c])), 0 >= f || null == f) {
                if (f = pb(b, c, g), (0 > f || null == f) && (f = b.style[c]), lb.test(f)) return f;
                e = h && (la.boxSizingReliable() || f === b.style[c]), f = parseFloat(f) || 0
            }
            return f + J(b, c, d || (h ? "border" : "content"), e, g) + "px"
        }

        function L(a, b, c, d, e) {
            return new L.prototype.init(a, b, c, d, e)
        }

        function M() {
            return a.setTimeout(function() {
                zb = void 0
            }), zb = na.now()
        }

        function N(a, b) {
            var c, d = {
                    height: a
                },
                e = 0;
            for (b = b ? 1 : 0; 4 > e; e += 2 - b) c = La[e], d["margin" + c] = d["padding" + c] = a;
            return b && (d.opacity = d.width = a), d
        }

        function O(a, b, c) {
            for (var d, e = (R.tweeners[b] || []).concat(R.tweeners["*"]), f = 0, g = e.length; g > f; f++)
                if (d = e[f].call(c, b, a)) return d
        }

        function P(a, b, c) {
            var d, e, f, g, h, i, j, k, l = this,
                m = {},
                n = a.style,
                o = a.nodeType && Ma(a),
                p = na._data(a, "fxshow");
            c.queue || (h = na._queueHooks(a, "fx"), null == h.unqueued && (h.unqueued = 0, i = h.empty.fire, h.empty.fire = function() {
                h.unqueued || i()
            }), h.unqueued++, l.always(function() {
                l.always(function() {
                    h.unqueued--, na.queue(a, "fx").length || h.empty.fire()
                })
            })), 1 === a.nodeType && ("height" in b || "width" in b) && (c.overflow = [n.overflow, n.overflowX, n.overflowY], j = na.css(a, "display"), k = "none" === j ? na._data(a, "olddisplay") || E(a.nodeName) : j, "inline" === k && "none" === na.css(a, "float") && (la.inlineBlockNeedsLayout && "inline" !== E(a.nodeName) ? n.zoom = 1 : n.display = "inline-block")), c.overflow && (n.overflow = "hidden", la.shrinkWrapBlocks() || l.always(function() {
                n.overflow = c.overflow[0], n.overflowX = c.overflow[1], n.overflowY = c.overflow[2]
            }));
            for (d in b)
                if (e = b[d], Bb.exec(e)) {
                    if (delete b[d], f = f || "toggle" === e, e === (o ? "hide" : "show")) {
                        if ("show" !== e || !p || void 0 === p[d]) continue;
                        o = !0
                    }
                    m[d] = p && p[d] || na.style(a, d)
                } else j = void 0;
            if (na.isEmptyObject(m)) "inline" === ("none" === j ? E(a.nodeName) : j) && (n.display = j);
            else {
                p ? "hidden" in p && (o = p.hidden) : p = na._data(a, "fxshow", {}), f && (p.hidden = !o), o ? na(a).show() : l.done(function() {
                    na(a).hide()
                }), l.done(function() {
                    var b;
                    na._removeData(a, "fxshow");
                    for (b in m) na.style(a, b, m[b])
                });
                for (d in m) g = O(o ? p[d] : 0, d, l), d in p || (p[d] = g.start, o && (g.end = g.start, g.start = "width" === d || "height" === d ? 1 : 0))
            }
        }

        function Q(a, b) {
            var c, d, e, f, g;
            for (c in a)
                if (d = na.camelCase(c), e = b[d], f = a[c], na.isArray(f) && (e = f[1], f = a[c] = f[0]), c !== d && (a[d] = f, delete a[c]), g = na.cssHooks[d], g && "expand" in g) {
                    f = g.expand(f), delete a[d];
                    for (c in f) c in a || (a[c] = f[c], b[c] = e)
                } else b[d] = e
        }

        function R(a, b, c) {
            var d, e, f = 0,
                g = R.prefilters.length,
                h = na.Deferred().always(function() {
                    delete i.elem
                }),
                i = function() {
                    if (e) return !1;
                    for (var b = zb || M(), c = Math.max(0, j.startTime + j.duration - b), d = c / j.duration || 0, f = 1 - d, g = 0, i = j.tweens.length; i > g; g++) j.tweens[g].run(f);
                    return h.notifyWith(a, [j, f, c]), 1 > f && i ? c : (h.resolveWith(a, [j]), !1)
                },
                j = h.promise({
                    elem: a,
                    props: na.extend({}, b),
                    opts: na.extend(!0, {
                        specialEasing: {},
                        easing: na.easing._default
                    }, c),
                    originalProperties: b,
                    originalOptions: c,
                    startTime: zb || M(),
                    duration: c.duration,
                    tweens: [],
                    createTween: function(b, c) {
                        var d = na.Tween(a, j.opts, b, c, j.opts.specialEasing[b] || j.opts.easing);
                        return j.tweens.push(d), d
                    },
                    stop: function(b) {
                        var c = 0,
                            d = b ? j.tweens.length : 0;
                        if (e) return this;
                        for (e = !0; d > c; c++) j.tweens[c].run(1);
                        return b ? (h.notifyWith(a, [j, 1, 0]), h.resolveWith(a, [j, b])) : h.rejectWith(a, [j, b]), this
                    }
                }),
                k = j.props;
            for (Q(k, j.opts.specialEasing); g > f; f++)
                if (d = R.prefilters[f].call(j, a, k, j.opts)) return na.isFunction(d.stop) && (na._queueHooks(j.elem, j.opts.queue).stop = na.proxy(d.stop, d)), d;
            return na.map(k, O, j), na.isFunction(j.opts.start) && j.opts.start.call(a, j), na.fx.timer(na.extend(i, {
                elem: a,
                anim: j,
                queue: j.opts.queue
            })), j.progress(j.opts.progress).done(j.opts.done, j.opts.complete).fail(j.opts.fail).always(j.opts.always)
        }

        function S(a) {
            return na.attr(a, "class") || ""
        }

        function T(a) {
            return function(b, c) {
                "string" != typeof b && (c = b, b = "*");
                var d, e = 0,
                    f = b.toLowerCase().match(Da) || [];
                if (na.isFunction(c))
                    for (; d = f[e++];) "+" === d.charAt(0) ? (d = d.slice(1) || "*", (a[d] = a[d] || []).unshift(c)) : (a[d] = a[d] || []).push(c)
            }
        }

        function U(a, b, c, d) {
            function e(h) {
                var i;
                return f[h] = !0, na.each(a[h] || [], function(a, h) {
                    var j = h(b, c, d);
                    return "string" != typeof j || g || f[j] ? g ? !(i = j) : void 0 : (b.dataTypes.unshift(j), e(j), !1)
                }), i
            }
            var f = {},
                g = a === Zb;
            return e(b.dataTypes[0]) || !f["*"] && e("*")
        }

        function V(a, b) {
            var c, d, e = na.ajaxSettings.flatOptions || {};
            for (d in b) void 0 !== b[d] && ((e[d] ? a : c || (c = {}))[d] = b[d]);
            return c && na.extend(!0, a, c), a
        }

        function W(a, b, c) {
            for (var d, e, f, g, h = a.contents, i = a.dataTypes;
                "*" === i[0];) i.shift(), void 0 === e && (e = a.mimeType || b.getResponseHeader("Content-Type"));
            if (e)
                for (g in h)
                    if (h[g] && h[g].test(e)) {
                        i.unshift(g);
                        break
                    }
            if (i[0] in c) f = i[0];
            else {
                for (g in c) {
                    if (!i[0] || a.converters[g + " " + i[0]]) {
                        f = g;
                        break
                    }
                    d || (d = g)
                }
                f = f || d
            }
            return f ? (f !== i[0] && i.unshift(f), c[f]) : void 0
        }

        function X(a, b, c, d) {
            var e, f, g, h, i, j = {},
                k = a.dataTypes.slice();
            if (k[1])
                for (g in a.converters) j[g.toLowerCase()] = a.converters[g];
            for (f = k.shift(); f;)
                if (a.responseFields[f] && (c[a.responseFields[f]] = b), !i && d && a.dataFilter && (b = a.dataFilter(b, a.dataType)), i = f, f = k.shift())
                    if ("*" === f) f = i;
                    else if ("*" !== i && i !== f) {
                if (g = j[i + " " + f] || j["* " + f], !g)
                    for (e in j)
                        if (h = e.split(" "), h[1] === f && (g = j[i + " " + h[0]] || j["* " + h[0]])) {
                            g === !0 ? g = j[e] : j[e] !== !0 && (f = h[0], k.unshift(h[1]));
                            break
                        }
                if (g !== !0)
                    if (g && a["throws"]) b = g(b);
                    else try {
                        b = g(b)
                    } catch (l) {
                        return {
                            state: "parsererror",
                            error: g ? l : "No conversion from " + i + " to " + f
                        }
                    }
            }
            return {
                state: "success",
                data: b
            }
        }

        function Y(a) {
            return a.style && a.style.display || na.css(a, "display")
        }

        function Z(a) {
            for (; a && 1 === a.nodeType;) {
                if ("none" === Y(a) || "hidden" === a.type) return !0;
                a = a.parentNode
            }
            return !1
        }

        function $(a, b, c, d) {
            var e;
            if (na.isArray(b)) na.each(b, function(b, e) {
                c || cc.test(a) ? d(a, e) : $(a + "[" + ("object" == typeof e && null != e ? b : "") + "]", e, c, d)
            });
            else if (c || "object" !== na.type(b)) d(a, b);
            else
                for (e in b) $(a + "[" + e + "]", b[e], c, d)
        }

        function _() {
            try {
                return new a.XMLHttpRequest
            } catch (b) {}
        }

        function aa() {
            try {
                return new a.ActiveXObject("Microsoft.XMLHTTP")
            } catch (b) {}
        }

        function ba(a) {
            return na.isWindow(a) ? a : 9 === a.nodeType ? a.defaultView || a.parentWindow : !1
        }
        var ca = [],
            da = a.document,
            ea = ca.slice,
            fa = ca.concat,
            ga = ca.push,
            ha = ca.indexOf,
            ia = {},
            ja = ia.toString,
            ka = ia.hasOwnProperty,
            la = {},
            ma = "1.12.0",
            na = function(a, b) {
                return new na.fn.init(a, b)
            },
            oa = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g,
            pa = /^-ms-/,
            qa = /-([\da-z])/gi,
            ra = function(a, b) {
                return b.toUpperCase()
            };
        na.fn = na.prototype = {
            jquery: ma,
            constructor: na,
            selector: "",
            length: 0,
            toArray: function() {
                return ea.call(this)
            },
            get: function(a) {
                return null != a ? 0 > a ? this[a + this.length] : this[a] : ea.call(this)
            },
            pushStack: function(a) {
                var b = na.merge(this.constructor(), a);
                return b.prevObject = this, b.context = this.context, b
            },
            each: function(a) {
                return na.each(this, a)
            },
            map: function(a) {
                return this.pushStack(na.map(this, function(b, c) {
                    return a.call(b, c, b)
                }))
            },
            slice: function() {
                return this.pushStack(ea.apply(this, arguments))
            },
            first: function() {
                return this.eq(0)
            },
            last: function() {
                return this.eq(-1)
            },
            eq: function(a) {
                var b = this.length,
                    c = +a + (0 > a ? b : 0);
                return this.pushStack(c >= 0 && b > c ? [this[c]] : [])
            },
            end: function() {
                return this.prevObject || this.constructor()
            },
            push: ga,
            sort: ca.sort,
            splice: ca.splice
        }, na.extend = na.fn.extend = function() {
            var a, b, c, d, e, f, g = arguments[0] || {},
                h = 1,
                i = arguments.length,
                j = !1;
            for ("boolean" == typeof g && (j = g, g = arguments[h] || {}, h++), "object" == typeof g || na.isFunction(g) || (g = {}), h === i && (g = this, h--); i > h; h++)
                if (null != (e = arguments[h]))
                    for (d in e) a = g[d],
                        c = e[d], g !== c && (j && c && (na.isPlainObject(c) || (b = na.isArray(c))) ? (b ? (b = !1, f = a && na.isArray(a) ? a : []) : f = a && na.isPlainObject(a) ? a : {}, g[d] = na.extend(j, f, c)) : void 0 !== c && (g[d] = c));
            return g
        }, na.extend({
            expando: "jQuery" + (ma + Math.random()).replace(/\D/g, ""),
            isReady: !0,
            error: function(a) {
                throw new Error(a)
            },
            noop: function() {},
            isFunction: function(a) {
                return "function" === na.type(a)
            },
            isArray: Array.isArray || function(a) {
                return "array" === na.type(a)
            },
            isWindow: function(a) {
                return null != a && a == a.window
            },
            isNumeric: function(a) {
                var b = a && a.toString();
                return !na.isArray(a) && b - parseFloat(b) + 1 >= 0
            },
            isEmptyObject: function(a) {
                var b;
                for (b in a) return !1;
                return !0
            },
            isPlainObject: function(a) {
                var b;
                if (!a || "object" !== na.type(a) || a.nodeType || na.isWindow(a)) return !1;
                try {
                    if (a.constructor && !ka.call(a, "constructor") && !ka.call(a.constructor.prototype, "isPrototypeOf")) return !1
                } catch (c) {
                    return !1
                }
                if (!la.ownFirst)
                    for (b in a) return ka.call(a, b);
                for (b in a);
                return void 0 === b || ka.call(a, b)
            },
            type: function(a) {
                return null == a ? a + "" : "object" == typeof a || "function" == typeof a ? ia[ja.call(a)] || "object" : typeof a
            },
            globalEval: function(b) {
                b && na.trim(b) && (a.execScript || function(b) {
                    a.eval.call(a, b)
                })(b)
            },
            camelCase: function(a) {
                return a.replace(pa, "ms-").replace(qa, ra)
            },
            nodeName: function(a, b) {
                return a.nodeName && a.nodeName.toLowerCase() === b.toLowerCase()
            },
            each: function(a, b) {
                var d, e = 0;
                if (c(a))
                    for (d = a.length; d > e && b.call(a[e], e, a[e]) !== !1; e++);
                else
                    for (e in a)
                        if (b.call(a[e], e, a[e]) === !1) break; return a
            },
            trim: function(a) {
                return null == a ? "" : (a + "").replace(oa, "")
            },
            makeArray: function(a, b) {
                var d = b || [];
                return null != a && (c(Object(a)) ? na.merge(d, "string" == typeof a ? [a] : a) : ga.call(d, a)), d
            },
            inArray: function(a, b, c) {
                var d;
                if (b) {
                    if (ha) return ha.call(b, a, c);
                    for (d = b.length, c = c ? 0 > c ? Math.max(0, d + c) : c : 0; d > c; c++)
                        if (c in b && b[c] === a) return c
                }
                return -1
            },
            merge: function(a, b) {
                for (var c = +b.length, d = 0, e = a.length; c > d;) a[e++] = b[d++];
                if (c !== c)
                    for (; void 0 !== b[d];) a[e++] = b[d++];
                return a.length = e, a
            },
            grep: function(a, b, c) {
                for (var d, e = [], f = 0, g = a.length, h = !c; g > f; f++) d = !b(a[f], f), d !== h && e.push(a[f]);
                return e
            },
            map: function(a, b, d) {
                var e, f, g = 0,
                    h = [];
                if (c(a))
                    for (e = a.length; e > g; g++) f = b(a[g], g, d), null != f && h.push(f);
                else
                    for (g in a) f = b(a[g], g, d), null != f && h.push(f);
                return fa.apply([], h)
            },
            guid: 1,
            proxy: function(a, b) {
                var c, d, e;
                return "string" == typeof b && (e = a[b], b = a, a = e), na.isFunction(a) ? (c = ea.call(arguments, 2), d = function() {
                    return a.apply(b || this, c.concat(ea.call(arguments)))
                }, d.guid = a.guid = a.guid || na.guid++, d) : void 0
            },
            now: function() {
                return +new Date
            },
            support: la
        }), "function" == typeof Symbol && (na.fn[Symbol.iterator] = ca[Symbol.iterator]), na.each("Boolean Number String Function Array Date RegExp Object Error Symbol".split(" "), function(a, b) {
            ia["[object " + b + "]"] = b.toLowerCase()
        });
        var sa = function(a) {
            function b(a, b, c, d) {
                var e, f, g, h, i, j, l, n, o = b && b.ownerDocument,
                    p = b ? b.nodeType : 9;
                if (c = c || [], "string" != typeof a || !a || 1 !== p && 9 !== p && 11 !== p) return c;
                if (!d && ((b ? b.ownerDocument || b : O) !== G && F(b), b = b || G, I)) {
                    if (11 !== p && (j = ra.exec(a)))
                        if (e = j[1]) {
                            if (9 === p) {
                                if (!(g = b.getElementById(e))) return c;
                                if (g.id === e) return c.push(g), c
                            } else if (o && (g = o.getElementById(e)) && M(b, g) && g.id === e) return c.push(g), c
                        } else {
                            if (j[2]) return $.apply(c, b.getElementsByTagName(a)), c;
                            if ((e = j[3]) && v.getElementsByClassName && b.getElementsByClassName) return $.apply(c, b.getElementsByClassName(e)), c
                        }
                    if (!(!v.qsa || T[a + " "] || J && J.test(a))) {
                        if (1 !== p) o = b, n = a;
                        else if ("object" !== b.nodeName.toLowerCase()) {
                            for ((h = b.getAttribute("id")) ? h = h.replace(ta, "\\$&") : b.setAttribute("id", h = N), l = z(a), f = l.length, i = ma.test(h) ? "#" + h : "[id='" + h + "']"; f--;) l[f] = i + " " + m(l[f]);
                            n = l.join(","), o = sa.test(a) && k(b.parentNode) || b
                        }
                        if (n) try {
                            return $.apply(c, o.querySelectorAll(n)), c
                        } catch (q) {} finally {
                            h === N && b.removeAttribute("id")
                        }
                    }
                }
                return B(a.replace(ha, "$1"), b, c, d)
            }

            function c() {
                function a(c, d) {
                    return b.push(c + " ") > w.cacheLength && delete a[b.shift()], a[c + " "] = d
                }
                var b = [];
                return a
            }

            function d(a) {
                return a[N] = !0, a
            }

            function e(a) {
                var b = G.createElement("div");
                try {
                    return !!a(b)
                } catch (c) {
                    return !1
                } finally {
                    b.parentNode && b.parentNode.removeChild(b), b = null
                }
            }

            function f(a, b) {
                for (var c = a.split("|"), d = c.length; d--;) w.attrHandle[c[d]] = b
            }

            function g(a, b) {
                var c = b && a,
                    d = c && 1 === a.nodeType && 1 === b.nodeType && (~b.sourceIndex || V) - (~a.sourceIndex || V);
                if (d) return d;
                if (c)
                    for (; c = c.nextSibling;)
                        if (c === b) return -1;
                return a ? 1 : -1
            }

            function h(a) {
                return function(b) {
                    var c = b.nodeName.toLowerCase();
                    return "input" === c && b.type === a
                }
            }

            function i(a) {
                return function(b) {
                    var c = b.nodeName.toLowerCase();
                    return ("input" === c || "button" === c) && b.type === a
                }
            }

            function j(a) {
                return d(function(b) {
                    return b = +b, d(function(c, d) {
                        for (var e, f = a([], c.length, b), g = f.length; g--;) c[e = f[g]] && (c[e] = !(d[e] = c[e]))
                    })
                })
            }

            function k(a) {
                return a && "undefined" != typeof a.getElementsByTagName && a
            }

            function l() {}

            function m(a) {
                for (var b = 0, c = a.length, d = ""; c > b; b++) d += a[b].value;
                return d
            }

            function n(a, b, c) {
                var d = b.dir,
                    e = c && "parentNode" === d,
                    f = Q++;
                return b.first ? function(b, c, f) {
                    for (; b = b[d];)
                        if (1 === b.nodeType || e) return a(b, c, f)
                } : function(b, c, g) {
                    var h, i, j, k = [P, f];
                    if (g) {
                        for (; b = b[d];)
                            if ((1 === b.nodeType || e) && a(b, c, g)) return !0
                    } else
                        for (; b = b[d];)
                            if (1 === b.nodeType || e) {
                                if (j = b[N] || (b[N] = {}), i = j[b.uniqueID] || (j[b.uniqueID] = {}), (h = i[d]) && h[0] === P && h[1] === f) return k[2] = h[2];
                                if (i[d] = k, k[2] = a(b, c, g)) return !0
                            }
                }
            }

            function o(a) {
                return a.length > 1 ? function(b, c, d) {
                    for (var e = a.length; e--;)
                        if (!a[e](b, c, d)) return !1;
                    return !0
                } : a[0]
            }

            function p(a, c, d) {
                for (var e = 0, f = c.length; f > e; e++) b(a, c[e], d);
                return d
            }

            function q(a, b, c, d, e) {
                for (var f, g = [], h = 0, i = a.length, j = null != b; i > h; h++)(f = a[h]) && (!c || c(f, d, e)) && (g.push(f), j && b.push(h));
                return g
            }

            function r(a, b, c, e, f, g) {
                return e && !e[N] && (e = r(e)), f && !f[N] && (f = r(f, g)), d(function(d, g, h, i) {
                    var j, k, l, m = [],
                        n = [],
                        o = g.length,
                        r = d || p(b || "*", h.nodeType ? [h] : h, []),
                        s = !a || !d && b ? r : q(r, m, a, h, i),
                        t = c ? f || (d ? a : o || e) ? [] : g : s;
                    if (c && c(s, t, h, i), e)
                        for (j = q(t, n), e(j, [], h, i), k = j.length; k--;)(l = j[k]) && (t[n[k]] = !(s[n[k]] = l));
                    if (d) {
                        if (f || a) {
                            if (f) {
                                for (j = [], k = t.length; k--;)(l = t[k]) && j.push(s[k] = l);
                                f(null, t = [], j, i)
                            }
                            for (k = t.length; k--;)(l = t[k]) && (j = f ? aa(d, l) : m[k]) > -1 && (d[j] = !(g[j] = l))
                        }
                    } else t = q(t === g ? t.splice(o, t.length) : t), f ? f(null, g, t, i) : $.apply(g, t)
                })
            }

            function s(a) {
                for (var b, c, d, e = a.length, f = w.relative[a[0].type], g = f || w.relative[" "], h = f ? 1 : 0, i = n(function(a) {
                        return a === b
                    }, g, !0), j = n(function(a) {
                        return aa(b, a) > -1
                    }, g, !0), k = [function(a, c, d) {
                        var e = !f && (d || c !== C) || ((b = c).nodeType ? i(a, c, d) : j(a, c, d));
                        return b = null, e
                    }]; e > h; h++)
                    if (c = w.relative[a[h].type]) k = [n(o(k), c)];
                    else {
                        if (c = w.filter[a[h].type].apply(null, a[h].matches), c[N]) {
                            for (d = ++h; e > d && !w.relative[a[d].type]; d++);
                            return r(h > 1 && o(k), h > 1 && m(a.slice(0, h - 1).concat({
                                value: " " === a[h - 2].type ? "*" : ""
                            })).replace(ha, "$1"), c, d > h && s(a.slice(h, d)), e > d && s(a = a.slice(d)), e > d && m(a))
                        }
                        k.push(c)
                    }
                return o(k)
            }

            function t(a, c) {
                var e = c.length > 0,
                    f = a.length > 0,
                    g = function(d, g, h, i, j) {
                        var k, l, m, n = 0,
                            o = "0",
                            p = d && [],
                            r = [],
                            s = C,
                            t = d || f && w.find.TAG("*", j),
                            u = P += null == s ? 1 : Math.random() || .1,
                            v = t.length;
                        for (j && (C = g === G || g || j); o !== v && null != (k = t[o]); o++) {
                            if (f && k) {
                                for (l = 0, g || k.ownerDocument === G || (F(k), h = !I); m = a[l++];)
                                    if (m(k, g || G, h)) {
                                        i.push(k);
                                        break
                                    }
                                j && (P = u)
                            }
                            e && ((k = !m && k) && n--, d && p.push(k))
                        }
                        if (n += o, e && o !== n) {
                            for (l = 0; m = c[l++];) m(p, r, g, h);
                            if (d) {
                                if (n > 0)
                                    for (; o--;) p[o] || r[o] || (r[o] = Y.call(i));
                                r = q(r)
                            }
                            $.apply(i, r), j && !d && r.length > 0 && n + c.length > 1 && b.uniqueSort(i)
                        }
                        return j && (P = u, C = s), p
                    };
                return e ? d(g) : g
            }
            var u, v, w, x, y, z, A, B, C, D, E, F, G, H, I, J, K, L, M, N = "sizzle" + 1 * new Date,
                O = a.document,
                P = 0,
                Q = 0,
                R = c(),
                S = c(),
                T = c(),
                U = function(a, b) {
                    return a === b && (E = !0), 0
                },
                V = 1 << 31,
                W = {}.hasOwnProperty,
                X = [],
                Y = X.pop,
                Z = X.push,
                $ = X.push,
                _ = X.slice,
                aa = function(a, b) {
                    for (var c = 0, d = a.length; d > c; c++)
                        if (a[c] === b) return c;
                    return -1
                },
                ba = "checked|selected|async|autofocus|autoplay|controls|defer|disabled|hidden|ismap|loop|multiple|open|readonly|required|scoped",
                ca = "[\\x20\\t\\r\\n\\f]",
                da = "(?:\\\\.|[\\w-]|[^\\x00-\\xa0])+",
                ea = "\\[" + ca + "*(" + da + ")(?:" + ca + "*([*^$|!~]?=)" + ca + "*(?:'((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\"|(" + da + "))|)" + ca + "*\\]",
                fa = ":(" + da + ")(?:\\((('((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\")|((?:\\\\.|[^\\\\()[\\]]|" + ea + ")*)|.*)\\)|)",
                ga = new RegExp(ca + "+", "g"),
                ha = new RegExp("^" + ca + "+|((?:^|[^\\\\])(?:\\\\.)*)" + ca + "+$", "g"),
                ia = new RegExp("^" + ca + "*," + ca + "*"),
                ja = new RegExp("^" + ca + "*([>+~]|" + ca + ")" + ca + "*"),
                ka = new RegExp("=" + ca + "*([^\\]'\"]*?)" + ca + "*\\]", "g"),
                la = new RegExp(fa),
                ma = new RegExp("^" + da + "$"),
                na = {
                    ID: new RegExp("^#(" + da + ")"),
                    CLASS: new RegExp("^\\.(" + da + ")"),
                    TAG: new RegExp("^(" + da + "|[*])"),
                    ATTR: new RegExp("^" + ea),
                    PSEUDO: new RegExp("^" + fa),
                    CHILD: new RegExp("^:(only|first|last|nth|nth-last)-(child|of-type)(?:\\(" + ca + "*(even|odd|(([+-]|)(\\d*)n|)" + ca + "*(?:([+-]|)" + ca + "*(\\d+)|))" + ca + "*\\)|)", "i"),
                    bool: new RegExp("^(?:" + ba + ")$", "i"),
                    needsContext: new RegExp("^" + ca + "*[>+~]|:(even|odd|eq|gt|lt|nth|first|last)(?:\\(" + ca + "*((?:-\\d)?\\d*)" + ca + "*\\)|)(?=[^-]|$)", "i")
                },
                oa = /^(?:input|select|textarea|button)$/i,
                pa = /^h\d$/i,
                qa = /^[^{]+\{\s*\[native \w/,
                ra = /^(?:#([\w-]+)|(\w+)|\.([\w-]+))$/,
                sa = /[+~]/,
                ta = /'|\\/g,
                ua = new RegExp("\\\\([\\da-f]{1,6}" + ca + "?|(" + ca + ")|.)", "ig"),
                va = function(a, b, c) {
                    var d = "0x" + b - 65536;
                    return d !== d || c ? b : 0 > d ? String.fromCharCode(d + 65536) : String.fromCharCode(d >> 10 | 55296, 1023 & d | 56320)
                },
                wa = function() {
                    F()
                };
            try {
                $.apply(X = _.call(O.childNodes), O.childNodes), X[O.childNodes.length].nodeType
            } catch (xa) {
                $ = {
                    apply: X.length ? function(a, b) {
                        Z.apply(a, _.call(b))
                    } : function(a, b) {
                        for (var c = a.length, d = 0; a[c++] = b[d++];);
                        a.length = c - 1
                    }
                }
            }
            v = b.support = {}, y = b.isXML = function(a) {
                var b = a && (a.ownerDocument || a).documentElement;
                return b ? "HTML" !== b.nodeName : !1
            }, F = b.setDocument = function(a) {
                var b, c, d = a ? a.ownerDocument || a : O;
                return d !== G && 9 === d.nodeType && d.documentElement ? (G = d, H = G.documentElement, I = !y(G), (c = G.defaultView) && c.top !== c && (c.addEventListener ? c.addEventListener("unload", wa, !1) : c.attachEvent && c.attachEvent("onunload", wa)), v.attributes = e(function(a) {
                    return a.className = "i", !a.getAttribute("className")
                }), v.getElementsByTagName = e(function(a) {
                    return a.appendChild(G.createComment("")), !a.getElementsByTagName("*").length
                }), v.getElementsByClassName = qa.test(G.getElementsByClassName), v.getById = e(function(a) {
                    return H.appendChild(a).id = N, !G.getElementsByName || !G.getElementsByName(N).length
                }), v.getById ? (w.find.ID = function(a, b) {
                    if ("undefined" != typeof b.getElementById && I) {
                        var c = b.getElementById(a);
                        return c ? [c] : []
                    }
                }, w.filter.ID = function(a) {
                    var b = a.replace(ua, va);
                    return function(a) {
                        return a.getAttribute("id") === b
                    }
                }) : (delete w.find.ID, w.filter.ID = function(a) {
                    var b = a.replace(ua, va);
                    return function(a) {
                        var c = "undefined" != typeof a.getAttributeNode && a.getAttributeNode("id");
                        return c && c.value === b
                    }
                }), w.find.TAG = v.getElementsByTagName ? function(a, b) {
                    return "undefined" != typeof b.getElementsByTagName ? b.getElementsByTagName(a) : v.qsa ? b.querySelectorAll(a) : void 0
                } : function(a, b) {
                    var c, d = [],
                        e = 0,
                        f = b.getElementsByTagName(a);
                    if ("*" === a) {
                        for (; c = f[e++];) 1 === c.nodeType && d.push(c);
                        return d
                    }
                    return f
                }, w.find.CLASS = v.getElementsByClassName && function(a, b) {
                    return "undefined" != typeof b.getElementsByClassName && I ? b.getElementsByClassName(a) : void 0
                }, K = [], J = [], (v.qsa = qa.test(G.querySelectorAll)) && (e(function(a) {
                    H.appendChild(a).innerHTML = "<a id='" + N + "'></a><select id='" + N + "-\r\\' msallowcapture=''><option selected=''></option></select>", a.querySelectorAll("[msallowcapture^='']").length && J.push("[*^$]=" + ca + "*(?:''|\"\")"), a.querySelectorAll("[selected]").length || J.push("\\[" + ca + "*(?:value|" + ba + ")"), a.querySelectorAll("[id~=" + N + "-]").length || J.push("~="), a.querySelectorAll(":checked").length || J.push(":checked"), a.querySelectorAll("a#" + N + "+*").length || J.push(".#.+[+~]")
                }), e(function(a) {
                    var b = G.createElement("input");
                    b.setAttribute("type", "hidden"), a.appendChild(b).setAttribute("name", "D"), a.querySelectorAll("[name=d]").length && J.push("name" + ca + "*[*^$|!~]?="), a.querySelectorAll(":enabled").length || J.push(":enabled", ":disabled"), a.querySelectorAll("*,:x"), J.push(",.*:")
                })), (v.matchesSelector = qa.test(L = H.matches || H.webkitMatchesSelector || H.mozMatchesSelector || H.oMatchesSelector || H.msMatchesSelector)) && e(function(a) {
                    v.disconnectedMatch = L.call(a, "div"), L.call(a, "[s!='']:x"), K.push("!=", fa)
                }), J = J.length && new RegExp(J.join("|")), K = K.length && new RegExp(K.join("|")), b = qa.test(H.compareDocumentPosition), M = b || qa.test(H.contains) ? function(a, b) {
                    var c = 9 === a.nodeType ? a.documentElement : a,
                        d = b && b.parentNode;
                    return a === d || !(!d || 1 !== d.nodeType || !(c.contains ? c.contains(d) : a.compareDocumentPosition && 16 & a.compareDocumentPosition(d)))
                } : function(a, b) {
                    if (b)
                        for (; b = b.parentNode;)
                            if (b === a) return !0;
                    return !1
                }, U = b ? function(a, b) {
                    if (a === b) return E = !0, 0;
                    var c = !a.compareDocumentPosition - !b.compareDocumentPosition;
                    return c ? c : (c = (a.ownerDocument || a) === (b.ownerDocument || b) ? a.compareDocumentPosition(b) : 1, 1 & c || !v.sortDetached && b.compareDocumentPosition(a) === c ? a === G || a.ownerDocument === O && M(O, a) ? -1 : b === G || b.ownerDocument === O && M(O, b) ? 1 : D ? aa(D, a) - aa(D, b) : 0 : 4 & c ? -1 : 1)
                } : function(a, b) {
                    if (a === b) return E = !0, 0;
                    var c, d = 0,
                        e = a.parentNode,
                        f = b.parentNode,
                        h = [a],
                        i = [b];
                    if (!e || !f) return a === G ? -1 : b === G ? 1 : e ? -1 : f ? 1 : D ? aa(D, a) - aa(D, b) : 0;
                    if (e === f) return g(a, b);
                    for (c = a; c = c.parentNode;) h.unshift(c);
                    for (c = b; c = c.parentNode;) i.unshift(c);
                    for (; h[d] === i[d];) d++;
                    return d ? g(h[d], i[d]) : h[d] === O ? -1 : i[d] === O ? 1 : 0
                }, G) : G
            }, b.matches = function(a, c) {
                return b(a, null, null, c)
            }, b.matchesSelector = function(a, c) {
                if ((a.ownerDocument || a) !== G && F(a), c = c.replace(ka, "='$1']"), !(!v.matchesSelector || !I || T[c + " "] || K && K.test(c) || J && J.test(c))) try {
                    var d = L.call(a, c);
                    if (d || v.disconnectedMatch || a.document && 11 !== a.document.nodeType) return d
                } catch (e) {}
                return b(c, G, null, [a]).length > 0
            }, b.contains = function(a, b) {
                return (a.ownerDocument || a) !== G && F(a), M(a, b)
            }, b.attr = function(a, b) {
                (a.ownerDocument || a) !== G && F(a);
                var c = w.attrHandle[b.toLowerCase()],
                    d = c && W.call(w.attrHandle, b.toLowerCase()) ? c(a, b, !I) : void 0;
                return void 0 !== d ? d : v.attributes || !I ? a.getAttribute(b) : (d = a.getAttributeNode(b)) && d.specified ? d.value : null
            }, b.error = function(a) {
                throw new Error("Syntax error, unrecognized expression: " + a)
            }, b.uniqueSort = function(a) {
                var b, c = [],
                    d = 0,
                    e = 0;
                if (E = !v.detectDuplicates, D = !v.sortStable && a.slice(0), a.sort(U), E) {
                    for (; b = a[e++];) b === a[e] && (d = c.push(e));
                    for (; d--;) a.splice(c[d], 1)
                }
                return D = null, a
            }, x = b.getText = function(a) {
                var b, c = "",
                    d = 0,
                    e = a.nodeType;
                if (e) {
                    if (1 === e || 9 === e || 11 === e) {
                        if ("string" == typeof a.textContent) return a.textContent;
                        for (a = a.firstChild; a; a = a.nextSibling) c += x(a)
                    } else if (3 === e || 4 === e) return a.nodeValue
                } else
                    for (; b = a[d++];) c += x(b);
                return c
            }, w = b.selectors = {
                cacheLength: 50,
                createPseudo: d,
                match: na,
                attrHandle: {},
                find: {},
                relative: {
                    ">": {
                        dir: "parentNode",
                        first: !0
                    },
                    " ": {
                        dir: "parentNode"
                    },
                    "+": {
                        dir: "previousSibling",
                        first: !0
                    },
                    "~": {
                        dir: "previousSibling"
                    }
                },
                preFilter: {
                    ATTR: function(a) {
                        return a[1] = a[1].replace(ua, va), a[3] = (a[3] || a[4] || a[5] || "").replace(ua, va), "~=" === a[2] && (a[3] = " " + a[3] + " "), a.slice(0, 4)
                    },
                    CHILD: function(a) {
                        return a[1] = a[1].toLowerCase(), "nth" === a[1].slice(0, 3) ? (a[3] || b.error(a[0]), a[4] = +(a[4] ? a[5] + (a[6] || 1) : 2 * ("even" === a[3] || "odd" === a[3])), a[5] = +(a[7] + a[8] || "odd" === a[3])) : a[3] && b.error(a[0]), a
                    },
                    PSEUDO: function(a) {
                        var b, c = !a[6] && a[2];
                        return na.CHILD.test(a[0]) ? null : (a[3] ? a[2] = a[4] || a[5] || "" : c && la.test(c) && (b = z(c, !0)) && (b = c.indexOf(")", c.length - b) - c.length) && (a[0] = a[0].slice(0, b), a[2] = c.slice(0, b)), a.slice(0, 3))
                    }
                },
                filter: {
                    TAG: function(a) {
                        var b = a.replace(ua, va).toLowerCase();
                        return "*" === a ? function() {
                            return !0
                        } : function(a) {
                            return a.nodeName && a.nodeName.toLowerCase() === b
                        }
                    },
                    CLASS: function(a) {
                        var b = R[a + " "];
                        return b || (b = new RegExp("(^|" + ca + ")" + a + "(" + ca + "|$)")) && R(a, function(a) {
                            return b.test("string" == typeof a.className && a.className || "undefined" != typeof a.getAttribute && a.getAttribute("class") || "")
                        })
                    },
                    ATTR: function(a, c, d) {
                        return function(e) {
                            var f = b.attr(e, a);
                            return null == f ? "!=" === c : c ? (f += "", "=" === c ? f === d : "!=" === c ? f !== d : "^=" === c ? d && 0 === f.indexOf(d) : "*=" === c ? d && f.indexOf(d) > -1 : "$=" === c ? d && f.slice(-d.length) === d : "~=" === c ? (" " + f.replace(ga, " ") + " ").indexOf(d) > -1 : "|=" === c ? f === d || f.slice(0, d.length + 1) === d + "-" : !1) : !0
                        }
                    },
                    CHILD: function(a, b, c, d, e) {
                        var f = "nth" !== a.slice(0, 3),
                            g = "last" !== a.slice(-4),
                            h = "of-type" === b;
                        return 1 === d && 0 === e ? function(a) {
                            return !!a.parentNode
                        } : function(b, c, i) {
                            var j, k, l, m, n, o, p = f !== g ? "nextSibling" : "previousSibling",
                                q = b.parentNode,
                                r = h && b.nodeName.toLowerCase(),
                                s = !i && !h,
                                t = !1;
                            if (q) {
                                if (f) {
                                    for (; p;) {
                                        for (m = b; m = m[p];)
                                            if (h ? m.nodeName.toLowerCase() === r : 1 === m.nodeType) return !1;
                                        o = p = "only" === a && !o && "nextSibling"
                                    }
                                    return !0
                                }
                                if (o = [g ? q.firstChild : q.lastChild], g && s) {
                                    for (m = q, l = m[N] || (m[N] = {}), k = l[m.uniqueID] || (l[m.uniqueID] = {}), j = k[a] || [], n = j[0] === P && j[1], t = n && j[2], m = n && q.childNodes[n]; m = ++n && m && m[p] || (t = n = 0) || o.pop();)
                                        if (1 === m.nodeType && ++t && m === b) {
                                            k[a] = [P, n, t];
                                            break
                                        }
                                } else if (s && (m = b, l = m[N] || (m[N] = {}), k = l[m.uniqueID] || (l[m.uniqueID] = {}), j = k[a] || [], n = j[0] === P && j[1], t = n), t === !1)
                                    for (;
                                        (m = ++n && m && m[p] || (t = n = 0) || o.pop()) && ((h ? m.nodeName.toLowerCase() !== r : 1 !== m.nodeType) || !++t || (s && (l = m[N] || (m[N] = {}), k = l[m.uniqueID] || (l[m.uniqueID] = {}), k[a] = [P, t]), m !== b)););
                                return t -= e, t === d || t % d === 0 && t / d >= 0
                            }
                        }
                    },
                    PSEUDO: function(a, c) {
                        var e, f = w.pseudos[a] || w.setFilters[a.toLowerCase()] || b.error("unsupported pseudo: " + a);
                        return f[N] ? f(c) : f.length > 1 ? (e = [a, a, "", c], w.setFilters.hasOwnProperty(a.toLowerCase()) ? d(function(a, b) {
                            for (var d, e = f(a, c), g = e.length; g--;) d = aa(a, e[g]), a[d] = !(b[d] = e[g])
                        }) : function(a) {
                            return f(a, 0, e)
                        }) : f
                    }
                },
                pseudos: {
                    not: d(function(a) {
                        var b = [],
                            c = [],
                            e = A(a.replace(ha, "$1"));
                        return e[N] ? d(function(a, b, c, d) {
                            for (var f, g = e(a, null, d, []), h = a.length; h--;)(f = g[h]) && (a[h] = !(b[h] = f))
                        }) : function(a, d, f) {
                            return b[0] = a, e(b, null, f, c), b[0] = null, !c.pop()
                        }
                    }),
                    has: d(function(a) {
                        return function(c) {
                            return b(a, c).length > 0
                        }
                    }),
                    contains: d(function(a) {
                        return a = a.replace(ua, va),
                            function(b) {
                                return (b.textContent || b.innerText || x(b)).indexOf(a) > -1
                            }
                    }),
                    lang: d(function(a) {
                        return ma.test(a || "") || b.error("unsupported lang: " + a), a = a.replace(ua, va).toLowerCase(),
                            function(b) {
                                var c;
                                do
                                    if (c = I ? b.lang : b.getAttribute("xml:lang") || b.getAttribute("lang")) return c = c.toLowerCase(), c === a || 0 === c.indexOf(a + "-");
                                while ((b = b.parentNode) && 1 === b.nodeType);
                                return !1
                            }
                    }),
                    target: function(b) {
                        var c = a.location && a.location.hash;
                        return c && c.slice(1) === b.id
                    },
                    root: function(a) {
                        return a === H
                    },
                    focus: function(a) {
                        return a === G.activeElement && (!G.hasFocus || G.hasFocus()) && !!(a.type || a.href || ~a.tabIndex)
                    },
                    enabled: function(a) {
                        return a.disabled === !1
                    },
                    disabled: function(a) {
                        return a.disabled === !0
                    },
                    checked: function(a) {
                        var b = a.nodeName.toLowerCase();
                        return "input" === b && !!a.checked || "option" === b && !!a.selected
                    },
                    selected: function(a) {
                        return a.parentNode && a.parentNode.selectedIndex, a.selected === !0
                    },
                    empty: function(a) {
                        for (a = a.firstChild; a; a = a.nextSibling)
                            if (a.nodeType < 6) return !1;
                        return !0
                    },
                    parent: function(a) {
                        return !w.pseudos.empty(a)
                    },
                    header: function(a) {
                        return pa.test(a.nodeName)
                    },
                    input: function(a) {
                        return oa.test(a.nodeName)
                    },
                    button: function(a) {
                        var b = a.nodeName.toLowerCase();
                        return "input" === b && "button" === a.type || "button" === b
                    },
                    text: function(a) {
                        var b;
                        return "input" === a.nodeName.toLowerCase() && "text" === a.type && (null == (b = a.getAttribute("type")) || "text" === b.toLowerCase())
                    },
                    first: j(function() {
                        return [0]
                    }),
                    last: j(function(a, b) {
                        return [b - 1]
                    }),
                    eq: j(function(a, b, c) {
                        return [0 > c ? c + b : c]
                    }),
                    even: j(function(a, b) {
                        for (var c = 0; b > c; c += 2) a.push(c);
                        return a
                    }),
                    odd: j(function(a, b) {
                        for (var c = 1; b > c; c += 2) a.push(c);
                        return a
                    }),
                    lt: j(function(a, b, c) {
                        for (var d = 0 > c ? c + b : c; --d >= 0;) a.push(d);
                        return a
                    }),
                    gt: j(function(a, b, c) {
                        for (var d = 0 > c ? c + b : c; ++d < b;) a.push(d);
                        return a
                    })
                }
            }, w.pseudos.nth = w.pseudos.eq;
            for (u in {
                    radio: !0,
                    checkbox: !0,
                    file: !0,
                    password: !0,
                    image: !0
                }) w.pseudos[u] = h(u);
            for (u in {
                    submit: !0,
                    reset: !0
                }) w.pseudos[u] = i(u);
            return l.prototype = w.filters = w.pseudos, w.setFilters = new l, z = b.tokenize = function(a, c) {
                var d, e, f, g, h, i, j, k = S[a + " "];
                if (k) return c ? 0 : k.slice(0);
                for (h = a, i = [], j = w.preFilter; h;) {
                    (!d || (e = ia.exec(h))) && (e && (h = h.slice(e[0].length) || h), i.push(f = [])), d = !1, (e = ja.exec(h)) && (d = e.shift(), f.push({
                        value: d,
                        type: e[0].replace(ha, " ")
                    }), h = h.slice(d.length));
                    for (g in w.filter) !(e = na[g].exec(h)) || j[g] && !(e = j[g](e)) || (d = e.shift(), f.push({
                        value: d,
                        type: g,
                        matches: e
                    }), h = h.slice(d.length));
                    if (!d) break
                }
                return c ? h.length : h ? b.error(a) : S(a, i).slice(0)
            }, A = b.compile = function(a, b) {
                var c, d = [],
                    e = [],
                    f = T[a + " "];
                if (!f) {
                    for (b || (b = z(a)), c = b.length; c--;) f = s(b[c]), f[N] ? d.push(f) : e.push(f);
                    f = T(a, t(e, d)), f.selector = a
                }
                return f
            }, B = b.select = function(a, b, c, d) {
                var e, f, g, h, i, j = "function" == typeof a && a,
                    l = !d && z(a = j.selector || a);
                if (c = c || [], 1 === l.length) {
                    if (f = l[0] = l[0].slice(0), f.length > 2 && "ID" === (g = f[0]).type && v.getById && 9 === b.nodeType && I && w.relative[f[1].type]) {
                        if (b = (w.find.ID(g.matches[0].replace(ua, va), b) || [])[0], !b) return c;
                        j && (b = b.parentNode), a = a.slice(f.shift().value.length)
                    }
                    for (e = na.needsContext.test(a) ? 0 : f.length; e-- && (g = f[e], !w.relative[h = g.type]);)
                        if ((i = w.find[h]) && (d = i(g.matches[0].replace(ua, va), sa.test(f[0].type) && k(b.parentNode) || b))) {
                            if (f.splice(e, 1), a = d.length && m(f), !a) return $.apply(c, d), c;
                            break
                        }
                }
                return (j || A(a, l))(d, b, !I, c, !b || sa.test(a) && k(b.parentNode) || b), c
            }, v.sortStable = N.split("").sort(U).join("") === N, v.detectDuplicates = !!E, F(), v.sortDetached = e(function(a) {
                return 1 & a.compareDocumentPosition(G.createElement("div"))
            }), e(function(a) {
                return a.innerHTML = "<a href='#'></a>", "#" === a.firstChild.getAttribute("href")
            }) || f("type|href|height|width", function(a, b, c) {
                return c ? void 0 : a.getAttribute(b, "type" === b.toLowerCase() ? 1 : 2)
            }), v.attributes && e(function(a) {
                return a.innerHTML = "<input/>", a.firstChild.setAttribute("value", ""), "" === a.firstChild.getAttribute("value")
            }) || f("value", function(a, b, c) {
                return c || "input" !== a.nodeName.toLowerCase() ? void 0 : a.defaultValue
            }), e(function(a) {
                return null == a.getAttribute("disabled")
            }) || f(ba, function(a, b, c) {
                var d;
                return c ? void 0 : a[b] === !0 ? b.toLowerCase() : (d = a.getAttributeNode(b)) && d.specified ? d.value : null
            }), b
        }(a);
        na.find = sa, na.expr = sa.selectors, na.expr[":"] = na.expr.pseudos, na.uniqueSort = na.unique = sa.uniqueSort, na.text = sa.getText, na.isXMLDoc = sa.isXML, na.contains = sa.contains;
        var ta = function(a, b, c) {
                for (var d = [], e = void 0 !== c;
                    (a = a[b]) && 9 !== a.nodeType;)
                    if (1 === a.nodeType) {
                        if (e && na(a).is(c)) break;
                        d.push(a)
                    }
                return d
            },
            ua = function(a, b) {
                for (var c = []; a; a = a.nextSibling) 1 === a.nodeType && a !== b && c.push(a);
                return c
            },
            va = na.expr.match.needsContext,
            wa = /^<([\w-]+)\s*\/?>(?:<\/\1>|)$/,
            xa = /^.[^:#\[\.,]*$/;
        na.filter = function(a, b, c) {
            var d = b[0];
            return c && (a = ":not(" + a + ")"), 1 === b.length && 1 === d.nodeType ? na.find.matchesSelector(d, a) ? [d] : [] : na.find.matches(a, na.grep(b, function(a) {
                return 1 === a.nodeType
            }))
        }, na.fn.extend({
            find: function(a) {
                var b, c = [],
                    d = this,
                    e = d.length;
                if ("string" != typeof a) return this.pushStack(na(a).filter(function() {
                    for (b = 0; e > b; b++)
                        if (na.contains(d[b], this)) return !0
                }));
                for (b = 0; e > b; b++) na.find(a, d[b], c);
                return c = this.pushStack(e > 1 ? na.unique(c) : c), c.selector = this.selector ? this.selector + " " + a : a, c
            },
            filter: function(a) {
                return this.pushStack(d(this, a || [], !1))
            },
            not: function(a) {
                return this.pushStack(d(this, a || [], !0))
            },
            is: function(a) {
                return !!d(this, "string" == typeof a && va.test(a) ? na(a) : a || [], !1).length
            }
        });
        var ya, za = /^(?:\s*(<[\w\W]+>)[^>]*|#([\w-]*))$/,
            Aa = na.fn.init = function(a, b, c) {
                var d, e;
                if (!a) return this;
                if (c = c || ya, "string" == typeof a) {
                    if (d = "<" === a.charAt(0) && ">" === a.charAt(a.length - 1) && a.length >= 3 ? [null, a, null] : za.exec(a), !d || !d[1] && b) return !b || b.jquery ? (b || c).find(a) : this.constructor(b).find(a);
                    if (d[1]) {
                        if (b = b instanceof na ? b[0] : b, na.merge(this, na.parseHTML(d[1], b && b.nodeType ? b.ownerDocument || b : da, !0)), wa.test(d[1]) && na.isPlainObject(b))
                            for (d in b) na.isFunction(this[d]) ? this[d](b[d]) : this.attr(d, b[d]);
                        return this
                    }
                    if (e = da.getElementById(d[2]), e && e.parentNode) {
                        if (e.id !== d[2]) return ya.find(a);
                        this.length = 1, this[0] = e
                    }
                    return this.context = da, this.selector = a, this
                }
                return a.nodeType ? (this.context = this[0] = a, this.length = 1, this) : na.isFunction(a) ? "undefined" != typeof c.ready ? c.ready(a) : a(na) : (void 0 !== a.selector && (this.selector = a.selector, this.context = a.context), na.makeArray(a, this))
            };
        Aa.prototype = na.fn, ya = na(da);
        var Ba = /^(?:parents|prev(?:Until|All))/,
            Ca = {
                children: !0,
                contents: !0,
                next: !0,
                prev: !0
            };
        na.fn.extend({
            has: function(a) {
                var b, c = na(a, this),
                    d = c.length;
                return this.filter(function() {
                    for (b = 0; d > b; b++)
                        if (na.contains(this, c[b])) return !0
                })
            },
            closest: function(a, b) {
                for (var c, d = 0, e = this.length, f = [], g = va.test(a) || "string" != typeof a ? na(a, b || this.context) : 0; e > d; d++)
                    for (c = this[d]; c && c !== b; c = c.parentNode)
                        if (c.nodeType < 11 && (g ? g.index(c) > -1 : 1 === c.nodeType && na.find.matchesSelector(c, a))) {
                            f.push(c);
                            break
                        }
                return this.pushStack(f.length > 1 ? na.uniqueSort(f) : f)
            },
            index: function(a) {
                return a ? "string" == typeof a ? na.inArray(this[0], na(a)) : na.inArray(a.jquery ? a[0] : a, this) : this[0] && this[0].parentNode ? this.first().prevAll().length : -1
            },
            add: function(a, b) {
                return this.pushStack(na.uniqueSort(na.merge(this.get(), na(a, b))))
            },
            addBack: function(a) {
                return this.add(null == a ? this.prevObject : this.prevObject.filter(a))
            }
        }), na.each({
            parent: function(a) {
                var b = a.parentNode;
                return b && 11 !== b.nodeType ? b : null
            },
            parents: function(a) {
                return ta(a, "parentNode")
            },
            parentsUntil: function(a, b, c) {
                return ta(a, "parentNode", c)
            },
            next: function(a) {
                return e(a, "nextSibling")
            },
            prev: function(a) {
                return e(a, "previousSibling")
            },
            nextAll: function(a) {
                return ta(a, "nextSibling")
            },
            prevAll: function(a) {
                return ta(a, "previousSibling")
            },
            nextUntil: function(a, b, c) {
                return ta(a, "nextSibling", c)
            },
            prevUntil: function(a, b, c) {
                return ta(a, "previousSibling", c)
            },
            siblings: function(a) {
                return ua((a.parentNode || {}).firstChild, a)
            },
            children: function(a) {
                return ua(a.firstChild)
            },
            contents: function(a) {
                return na.nodeName(a, "iframe") ? a.contentDocument || a.contentWindow.document : na.merge([], a.childNodes)
            }
        }, function(a, b) {
            na.fn[a] = function(c, d) {
                var e = na.map(this, b, c);
                return "Until" !== a.slice(-5) && (d = c), d && "string" == typeof d && (e = na.filter(d, e)), this.length > 1 && (Ca[a] || (e = na.uniqueSort(e)), Ba.test(a) && (e = e.reverse())), this.pushStack(e)
            }
        });
        var Da = /\S+/g;
        na.Callbacks = function(a) {
            a = "string" == typeof a ? f(a) : na.extend({}, a);
            var b, c, d, e, g = [],
                h = [],
                i = -1,
                j = function() {
                    for (e = a.once, d = b = !0; h.length; i = -1)
                        for (c = h.shift(); ++i < g.length;) g[i].apply(c[0], c[1]) === !1 && a.stopOnFalse && (i = g.length, c = !1);
                    a.memory || (c = !1), b = !1, e && (g = c ? [] : "")
                },
                k = {
                    add: function() {
                        return g && (c && !b && (i = g.length - 1, h.push(c)), function d(b) {
                            na.each(b, function(b, c) {
                                na.isFunction(c) ? a.unique && k.has(c) || g.push(c) : c && c.length && "string" !== na.type(c) && d(c)
                            })
                        }(arguments), c && !b && j()), this
                    },
                    remove: function() {
                        return na.each(arguments, function(a, b) {
                            for (var c;
                                (c = na.inArray(b, g, c)) > -1;) g.splice(c, 1), i >= c && i--
                        }), this
                    },
                    has: function(a) {
                        return a ? na.inArray(a, g) > -1 : g.length > 0
                    },
                    empty: function() {
                        return g && (g = []), this
                    },
                    disable: function() {
                        return e = h = [], g = c = "", this
                    },
                    disabled: function() {
                        return !g
                    },
                    lock: function() {
                        return e = !0, c || k.disable(), this
                    },
                    locked: function() {
                        return !!e
                    },
                    fireWith: function(a, c) {
                        return e || (c = c || [], c = [a, c.slice ? c.slice() : c], h.push(c), b || j()), this
                    },
                    fire: function() {
                        return k.fireWith(this, arguments), this
                    },
                    fired: function() {
                        return !!d
                    }
                };
            return k
        }, na.extend({
            Deferred: function(a) {
                var b = [
                        ["resolve", "done", na.Callbacks("once memory"), "resolved"],
                        ["reject", "fail", na.Callbacks("once memory"), "rejected"],
                        ["notify", "progress", na.Callbacks("memory")]
                    ],
                    c = "pending",
                    d = {
                        state: function() {
                            return c
                        },
                        always: function() {
                            return e.done(arguments).fail(arguments), this
                        },
                        then: function() {
                            var a = arguments;
                            return na.Deferred(function(c) {
                                na.each(b, function(b, f) {
                                    var g = na.isFunction(a[b]) && a[b];
                                    e[f[1]](function() {
                                        var a = g && g.apply(this, arguments);
                                        a && na.isFunction(a.promise) ? a.promise().progress(c.notify).done(c.resolve).fail(c.reject) : c[f[0] + "With"](this === d ? c.promise() : this, g ? [a] : arguments)
                                    })
                                }), a = null
                            }).promise()
                        },
                        promise: function(a) {
                            return null != a ? na.extend(a, d) : d
                        }
                    },
                    e = {};
                return d.pipe = d.then, na.each(b, function(a, f) {
                    var g = f[2],
                        h = f[3];
                    d[f[1]] = g.add, h && g.add(function() {
                        c = h
                    }, b[1 ^ a][2].disable, b[2][2].lock), e[f[0]] = function() {
                        return e[f[0] + "With"](this === e ? d : this, arguments), this
                    }, e[f[0] + "With"] = g.fireWith
                }), d.promise(e), a && a.call(e, e), e
            },
            when: function(a) {
                var b, c, d, e = 0,
                    f = ea.call(arguments),
                    g = f.length,
                    h = 1 !== g || a && na.isFunction(a.promise) ? g : 0,
                    i = 1 === h ? a : na.Deferred(),
                    j = function(a, c, d) {
                        return function(e) {
                            c[a] = this, d[a] = arguments.length > 1 ? ea.call(arguments) : e, d === b ? i.notifyWith(c, d) : --h || i.resolveWith(c, d)
                        }
                    };
                if (g > 1)
                    for (b = new Array(g), c = new Array(g), d = new Array(g); g > e; e++) f[e] && na.isFunction(f[e].promise) ? f[e].promise().progress(j(e, c, b)).done(j(e, d, f)).fail(i.reject) : --h;
                return h || i.resolveWith(d, f), i.promise()
            }
        });
        var Ea;
        na.fn.ready = function(a) {
            return na.ready.promise().done(a), this
        }, na.extend({
            isReady: !1,
            readyWait: 1,
            holdReady: function(a) {
                a ? na.readyWait++ : na.ready(!0)
            },
            ready: function(a) {
                (a === !0 ? --na.readyWait : na.isReady) || (na.isReady = !0, a !== !0 && --na.readyWait > 0 || (Ea.resolveWith(da, [na]), na.fn.triggerHandler && (na(da).triggerHandler("ready"), na(da).off("ready"))))
            }
        }), na.ready.promise = function(b) {
            if (!Ea)
                if (Ea = na.Deferred(), "complete" === da.readyState) a.setTimeout(na.ready);
                else if (da.addEventListener) da.addEventListener("DOMContentLoaded", h), a.addEventListener("load", h);
            else {
                da.attachEvent("onreadystatechange", h), a.attachEvent("onload", h);
                var c = !1;
                try {
                    c = null == a.frameElement && da.documentElement
                } catch (d) {}
                c && c.doScroll && ! function e() {
                    if (!na.isReady) {
                        try {
                            c.doScroll("left")
                        } catch (b) {
                            return a.setTimeout(e, 50)
                        }
                        g(), na.ready()
                    }
                }()
            }
            return Ea.promise(b)
        }, na.ready.promise();
        var Fa;
        for (Fa in na(la)) break;
        la.ownFirst = "0" === Fa, la.inlineBlockNeedsLayout = !1, na(function() {
                var a, b, c, d;
                c = da.getElementsByTagName("body")[0], c && c.style && (b = da.createElement("div"), d = da.createElement("div"), d.style.cssText = "position:absolute;border:0;width:0;height:0;top:0;left:-9999px", c.appendChild(d).appendChild(b), "undefined" != typeof b.style.zoom && (b.style.cssText = "display:inline;margin:0;border:0;padding:1px;width:1px;zoom:1", la.inlineBlockNeedsLayout = a = 3 === b.offsetWidth, a && (c.style.zoom = 1)), c.removeChild(d))
            }),
            function() {
                var a = da.createElement("div");
                la.deleteExpando = !0;
                try {
                    delete a.test
                } catch (b) {
                    la.deleteExpando = !1
                }
                a = null
            }();
        var Ga = function(a) {
                var b = na.noData[(a.nodeName + " ").toLowerCase()],
                    c = +a.nodeType || 1;
                return 1 !== c && 9 !== c ? !1 : !b || b !== !0 && a.getAttribute("classid") === b
            },
            Ha = /^(?:\{[\w\W]*\}|\[[\w\W]*\])$/,
            Ia = /([A-Z])/g;
        na.extend({
                cache: {},
                noData: {
                    "applet ": !0,
                    "embed ": !0,
                    "object ": "clsid:D27CDB6E-AE6D-11cf-96B8-444553540000"
                },
                hasData: function(a) {
                    return a = a.nodeType ? na.cache[a[na.expando]] : a[na.expando], !!a && !j(a)
                },
                data: function(a, b, c) {
                    return k(a, b, c)
                },
                removeData: function(a, b) {
                    return l(a, b)
                },
                _data: function(a, b, c) {
                    return k(a, b, c, !0)
                },
                _removeData: function(a, b) {
                    return l(a, b, !0)
                }
            }), na.fn.extend({
                data: function(a, b) {
                    var c, d, e, f = this[0],
                        g = f && f.attributes;
                    if (void 0 === a) {
                        if (this.length && (e = na.data(f), 1 === f.nodeType && !na._data(f, "parsedAttrs"))) {
                            for (c = g.length; c--;) g[c] && (d = g[c].name, 0 === d.indexOf("data-") && (d = na.camelCase(d.slice(5)), i(f, d, e[d])));
                            na._data(f, "parsedAttrs", !0)
                        }
                        return e
                    }
                    return "object" == typeof a ? this.each(function() {
                        na.data(this, a)
                    }) : arguments.length > 1 ? this.each(function() {
                        na.data(this, a, b)
                    }) : f ? i(f, a, na.data(f, a)) : void 0
                },
                removeData: function(a) {
                    return this.each(function() {
                        na.removeData(this, a)
                    })
                }
            }), na.extend({
                queue: function(a, b, c) {
                    var d;
                    return a ? (b = (b || "fx") + "queue", d = na._data(a, b), c && (!d || na.isArray(c) ? d = na._data(a, b, na.makeArray(c)) : d.push(c)), d || []) : void 0
                },
                dequeue: function(a, b) {
                    b = b || "fx";
                    var c = na.queue(a, b),
                        d = c.length,
                        e = c.shift(),
                        f = na._queueHooks(a, b),
                        g = function() {
                            na.dequeue(a, b)
                        };
                    "inprogress" === e && (e = c.shift(), d--), e && ("fx" === b && c.unshift("inprogress"), delete f.stop, e.call(a, g, f)), !d && f && f.empty.fire()
                },
                _queueHooks: function(a, b) {
                    var c = b + "queueHooks";
                    return na._data(a, c) || na._data(a, c, {
                        empty: na.Callbacks("once memory").add(function() {
                            na._removeData(a, b + "queue"), na._removeData(a, c)
                        })
                    })
                }
            }), na.fn.extend({
                queue: function(a, b) {
                    var c = 2;
                    return "string" != typeof a && (b = a, a = "fx", c--), arguments.length < c ? na.queue(this[0], a) : void 0 === b ? this : this.each(function() {
                        var c = na.queue(this, a, b);
                        na._queueHooks(this, a), "fx" === a && "inprogress" !== c[0] && na.dequeue(this, a)
                    })
                },
                dequeue: function(a) {
                    return this.each(function() {
                        na.dequeue(this, a)
                    })
                },
                clearQueue: function(a) {
                    return this.queue(a || "fx", [])
                },
                promise: function(a, b) {
                    var c, d = 1,
                        e = na.Deferred(),
                        f = this,
                        g = this.length,
                        h = function() {
                            --d || e.resolveWith(f, [f])
                        };
                    for ("string" != typeof a && (b = a, a = void 0), a = a || "fx"; g--;) c = na._data(f[g], a + "queueHooks"), c && c.empty && (d++, c.empty.add(h));
                    return h(), e.promise(b)
                }
            }),
            function() {
                var a;
                la.shrinkWrapBlocks = function() {
                    if (null != a) return a;
                    a = !1;
                    var b, c, d;
                    return c = da.getElementsByTagName("body")[0], c && c.style ? (b = da.createElement("div"), d = da.createElement("div"), d.style.cssText = "position:absolute;border:0;width:0;height:0;top:0;left:-9999px", c.appendChild(d).appendChild(b), "undefined" != typeof b.style.zoom && (b.style.cssText = "-webkit-box-sizing:content-box;-moz-box-sizing:content-box;box-sizing:content-box;display:block;margin:0;border:0;padding:1px;width:1px;zoom:1",
                        b.appendChild(da.createElement("div")).style.width = "5px", a = 3 !== b.offsetWidth), c.removeChild(d), a) : void 0
                }
            }();
        var Ja = /[+-]?(?:\d*\.|)\d+(?:[eE][+-]?\d+|)/.source,
            Ka = new RegExp("^(?:([+-])=|)(" + Ja + ")([a-z%]*)$", "i"),
            La = ["Top", "Right", "Bottom", "Left"],
            Ma = function(a, b) {
                return a = b || a, "none" === na.css(a, "display") || !na.contains(a.ownerDocument, a)
            },
            Na = function(a, b, c, d, e, f, g) {
                var h = 0,
                    i = a.length,
                    j = null == c;
                if ("object" === na.type(c)) {
                    e = !0;
                    for (h in c) Na(a, b, h, c[h], !0, f, g)
                } else if (void 0 !== d && (e = !0, na.isFunction(d) || (g = !0), j && (g ? (b.call(a, d), b = null) : (j = b, b = function(a, b, c) {
                        return j.call(na(a), c)
                    })), b))
                    for (; i > h; h++) b(a[h], c, g ? d : d.call(a[h], h, b(a[h], c)));
                return e ? a : j ? b.call(a) : i ? b(a[0], c) : f
            },
            Oa = /^(?:checkbox|radio)$/i,
            Pa = /<([\w:-]+)/,
            Qa = /^$|\/(?:java|ecma)script/i,
            Ra = /^\s+/,
            Sa = "abbr|article|aside|audio|bdi|canvas|data|datalist|details|dialog|figcaption|figure|footer|header|hgroup|main|mark|meter|nav|output|picture|progress|section|summary|template|time|video";
        ! function() {
            var a = da.createElement("div"),
                b = da.createDocumentFragment(),
                c = da.createElement("input");
            a.innerHTML = "  <link/><table></table><a href='/a'>a</a><input type='checkbox'/>", la.leadingWhitespace = 3 === a.firstChild.nodeType, la.tbody = !a.getElementsByTagName("tbody").length, la.htmlSerialize = !!a.getElementsByTagName("link").length, la.html5Clone = "<:nav></:nav>" !== da.createElement("nav").cloneNode(!0).outerHTML, c.type = "checkbox", c.checked = !0, b.appendChild(c), la.appendChecked = c.checked, a.innerHTML = "<textarea>x</textarea>", la.noCloneChecked = !!a.cloneNode(!0).lastChild.defaultValue, b.appendChild(a), c = da.createElement("input"), c.setAttribute("type", "radio"), c.setAttribute("checked", "checked"), c.setAttribute("name", "t"), a.appendChild(c), la.checkClone = a.cloneNode(!0).cloneNode(!0).lastChild.checked, la.noCloneEvent = !!a.addEventListener, a[na.expando] = 1, la.attributes = !a.getAttribute(na.expando)
        }();
        var Ta = {
            option: [1, "<select multiple='multiple'>", "</select>"],
            legend: [1, "<fieldset>", "</fieldset>"],
            area: [1, "<map>", "</map>"],
            param: [1, "<object>", "</object>"],
            thead: [1, "<table>", "</table>"],
            tr: [2, "<table><tbody>", "</tbody></table>"],
            col: [2, "<table><tbody></tbody><colgroup>", "</colgroup></table>"],
            td: [3, "<table><tbody><tr>", "</tr></tbody></table>"],
            _default: la.htmlSerialize ? [0, "", ""] : [1, "X<div>", "</div>"]
        };
        Ta.optgroup = Ta.option, Ta.tbody = Ta.tfoot = Ta.colgroup = Ta.caption = Ta.thead, Ta.th = Ta.td;
        var Ua = /<|&#?\w+;/,
            Va = /<tbody/i;
        ! function() {
            var b, c, d = da.createElement("div");
            for (b in {
                    submit: !0,
                    change: !0,
                    focusin: !0
                }) c = "on" + b, (la[b] = c in a) || (d.setAttribute(c, "t"), la[b] = d.attributes[c].expando === !1);
            d = null
        }();
        var Wa = /^(?:input|select|textarea)$/i,
            Xa = /^key/,
            Ya = /^(?:mouse|pointer|contextmenu|drag|drop)|click/,
            Za = /^(?:focusinfocus|focusoutblur)$/,
            $a = /^([^.]*)(?:\.(.+)|)/;
        na.event = {
            global: {},
            add: function(a, b, c, d, e) {
                var f, g, h, i, j, k, l, m, n, o, p, q = na._data(a);
                if (q) {
                    for (c.handler && (i = c, c = i.handler, e = i.selector), c.guid || (c.guid = na.guid++), (g = q.events) || (g = q.events = {}), (k = q.handle) || (k = q.handle = function(a) {
                            return "undefined" == typeof na || a && na.event.triggered === a.type ? void 0 : na.event.dispatch.apply(k.elem, arguments)
                        }, k.elem = a), b = (b || "").match(Da) || [""], h = b.length; h--;) f = $a.exec(b[h]) || [], n = p = f[1], o = (f[2] || "").split(".").sort(), n && (j = na.event.special[n] || {}, n = (e ? j.delegateType : j.bindType) || n, j = na.event.special[n] || {}, l = na.extend({
                        type: n,
                        origType: p,
                        data: d,
                        handler: c,
                        guid: c.guid,
                        selector: e,
                        needsContext: e && na.expr.match.needsContext.test(e),
                        namespace: o.join(".")
                    }, i), (m = g[n]) || (m = g[n] = [], m.delegateCount = 0, j.setup && j.setup.call(a, d, o, k) !== !1 || (a.addEventListener ? a.addEventListener(n, k, !1) : a.attachEvent && a.attachEvent("on" + n, k))), j.add && (j.add.call(a, l), l.handler.guid || (l.handler.guid = c.guid)), e ? m.splice(m.delegateCount++, 0, l) : m.push(l), na.event.global[n] = !0);
                    a = null
                }
            },
            remove: function(a, b, c, d, e) {
                var f, g, h, i, j, k, l, m, n, o, p, q = na.hasData(a) && na._data(a);
                if (q && (k = q.events)) {
                    for (b = (b || "").match(Da) || [""], j = b.length; j--;)
                        if (h = $a.exec(b[j]) || [], n = p = h[1], o = (h[2] || "").split(".").sort(), n) {
                            for (l = na.event.special[n] || {}, n = (d ? l.delegateType : l.bindType) || n, m = k[n] || [], h = h[2] && new RegExp("(^|\\.)" + o.join("\\.(?:.*\\.|)") + "(\\.|$)"), i = f = m.length; f--;) g = m[f], !e && p !== g.origType || c && c.guid !== g.guid || h && !h.test(g.namespace) || d && d !== g.selector && ("**" !== d || !g.selector) || (m.splice(f, 1), g.selector && m.delegateCount--, l.remove && l.remove.call(a, g));
                            i && !m.length && (l.teardown && l.teardown.call(a, o, q.handle) !== !1 || na.removeEvent(a, n, q.handle), delete k[n])
                        } else
                            for (n in k) na.event.remove(a, n + b[j], c, d, !0);
                    na.isEmptyObject(k) && (delete q.handle, na._removeData(a, "events"))
                }
            },
            trigger: function(b, c, d, e) {
                var f, g, h, i, j, k, l, m = [d || da],
                    n = ka.call(b, "type") ? b.type : b,
                    o = ka.call(b, "namespace") ? b.namespace.split(".") : [];
                if (h = k = d = d || da, 3 !== d.nodeType && 8 !== d.nodeType && !Za.test(n + na.event.triggered) && (n.indexOf(".") > -1 && (o = n.split("."), n = o.shift(), o.sort()), g = n.indexOf(":") < 0 && "on" + n, b = b[na.expando] ? b : new na.Event(n, "object" == typeof b && b), b.isTrigger = e ? 2 : 3, b.namespace = o.join("."), b.rnamespace = b.namespace ? new RegExp("(^|\\.)" + o.join("\\.(?:.*\\.|)") + "(\\.|$)") : null, b.result = void 0, b.target || (b.target = d), c = null == c ? [b] : na.makeArray(c, [b]), j = na.event.special[n] || {}, e || !j.trigger || j.trigger.apply(d, c) !== !1)) {
                    if (!e && !j.noBubble && !na.isWindow(d)) {
                        for (i = j.delegateType || n, Za.test(i + n) || (h = h.parentNode); h; h = h.parentNode) m.push(h), k = h;
                        k === (d.ownerDocument || da) && m.push(k.defaultView || k.parentWindow || a)
                    }
                    for (l = 0;
                        (h = m[l++]) && !b.isPropagationStopped();) b.type = l > 1 ? i : j.bindType || n, f = (na._data(h, "events") || {})[b.type] && na._data(h, "handle"), f && f.apply(h, c), f = g && h[g], f && f.apply && Ga(h) && (b.result = f.apply(h, c), b.result === !1 && b.preventDefault());
                    if (b.type = n, !e && !b.isDefaultPrevented() && (!j._default || j._default.apply(m.pop(), c) === !1) && Ga(d) && g && d[n] && !na.isWindow(d)) {
                        k = d[g], k && (d[g] = null), na.event.triggered = n;
                        try {
                            d[n]()
                        } catch (p) {}
                        na.event.triggered = void 0, k && (d[g] = k)
                    }
                    return b.result
                }
            },
            dispatch: function(a) {
                a = na.event.fix(a);
                var b, c, d, e, f, g = [],
                    h = ea.call(arguments),
                    i = (na._data(this, "events") || {})[a.type] || [],
                    j = na.event.special[a.type] || {};
                if (h[0] = a, a.delegateTarget = this, !j.preDispatch || j.preDispatch.call(this, a) !== !1) {
                    for (g = na.event.handlers.call(this, a, i), b = 0;
                        (e = g[b++]) && !a.isPropagationStopped();)
                        for (a.currentTarget = e.elem, c = 0;
                            (f = e.handlers[c++]) && !a.isImmediatePropagationStopped();)(!a.rnamespace || a.rnamespace.test(f.namespace)) && (a.handleObj = f, a.data = f.data, d = ((na.event.special[f.origType] || {}).handle || f.handler).apply(e.elem, h), void 0 !== d && (a.result = d) === !1 && (a.preventDefault(), a.stopPropagation()));
                    return j.postDispatch && j.postDispatch.call(this, a), a.result
                }
            },
            handlers: function(a, b) {
                var c, d, e, f, g = [],
                    h = b.delegateCount,
                    i = a.target;
                if (h && i.nodeType && ("click" !== a.type || isNaN(a.button) || a.button < 1))
                    for (; i != this; i = i.parentNode || this)
                        if (1 === i.nodeType && (i.disabled !== !0 || "click" !== a.type)) {
                            for (d = [], c = 0; h > c; c++) f = b[c], e = f.selector + " ", void 0 === d[e] && (d[e] = f.needsContext ? na(e, this).index(i) > -1 : na.find(e, this, null, [i]).length), d[e] && d.push(f);
                            d.length && g.push({
                                elem: i,
                                handlers: d
                            })
                        }
                return h < b.length && g.push({
                    elem: this,
                    handlers: b.slice(h)
                }), g
            },
            fix: function(a) {
                if (a[na.expando]) return a;
                var b, c, d, e = a.type,
                    f = a,
                    g = this.fixHooks[e];
                for (g || (this.fixHooks[e] = g = Ya.test(e) ? this.mouseHooks : Xa.test(e) ? this.keyHooks : {}), d = g.props ? this.props.concat(g.props) : this.props, a = new na.Event(f), b = d.length; b--;) c = d[b], a[c] = f[c];
                return a.target || (a.target = f.srcElement || da), 3 === a.target.nodeType && (a.target = a.target.parentNode), a.metaKey = !!a.metaKey, g.filter ? g.filter(a, f) : a
            },
            props: "altKey bubbles cancelable ctrlKey currentTarget detail eventPhase metaKey relatedTarget shiftKey target timeStamp view which".split(" "),
            fixHooks: {},
            keyHooks: {
                props: "char charCode key keyCode".split(" "),
                filter: function(a, b) {
                    return null == a.which && (a.which = null != b.charCode ? b.charCode : b.keyCode), a
                }
            },
            mouseHooks: {
                props: "button buttons clientX clientY fromElement offsetX offsetY pageX pageY screenX screenY toElement".split(" "),
                filter: function(a, b) {
                    var c, d, e, f = b.button,
                        g = b.fromElement;
                    return null == a.pageX && null != b.clientX && (d = a.target.ownerDocument || da, e = d.documentElement, c = d.body, a.pageX = b.clientX + (e && e.scrollLeft || c && c.scrollLeft || 0) - (e && e.clientLeft || c && c.clientLeft || 0), a.pageY = b.clientY + (e && e.scrollTop || c && c.scrollTop || 0) - (e && e.clientTop || c && c.clientTop || 0)), !a.relatedTarget && g && (a.relatedTarget = g === a.target ? b.toElement : g), a.which || void 0 === f || (a.which = 1 & f ? 1 : 2 & f ? 3 : 4 & f ? 2 : 0), a
                }
            },
            special: {
                load: {
                    noBubble: !0
                },
                focus: {
                    trigger: function() {
                        if (this !== u() && this.focus) try {
                            return this.focus(), !1
                        } catch (a) {}
                    },
                    delegateType: "focusin"
                },
                blur: {
                    trigger: function() {
                        return this === u() && this.blur ? (this.blur(), !1) : void 0
                    },
                    delegateType: "focusout"
                },
                click: {
                    trigger: function() {
                        return na.nodeName(this, "input") && "checkbox" === this.type && this.click ? (this.click(), !1) : void 0
                    },
                    _default: function(a) {
                        return na.nodeName(a.target, "a")
                    }
                },
                beforeunload: {
                    postDispatch: function(a) {
                        void 0 !== a.result && a.originalEvent && (a.originalEvent.returnValue = a.result)
                    }
                }
            },
            simulate: function(a, b, c) {
                var d = na.extend(new na.Event, c, {
                    type: a,
                    isSimulated: !0
                });
                na.event.trigger(d, null, b), d.isDefaultPrevented() && c.preventDefault()
            }
        }, na.removeEvent = da.removeEventListener ? function(a, b, c) {
            a.removeEventListener && a.removeEventListener(b, c)
        } : function(a, b, c) {
            var d = "on" + b;
            a.detachEvent && ("undefined" == typeof a[d] && (a[d] = null), a.detachEvent(d, c))
        }, na.Event = function(a, b) {
            return this instanceof na.Event ? (a && a.type ? (this.originalEvent = a, this.type = a.type, this.isDefaultPrevented = a.defaultPrevented || void 0 === a.defaultPrevented && a.returnValue === !1 ? s : t) : this.type = a, b && na.extend(this, b), this.timeStamp = a && a.timeStamp || na.now(), void(this[na.expando] = !0)) : new na.Event(a, b)
        }, na.Event.prototype = {
            constructor: na.Event,
            isDefaultPrevented: t,
            isPropagationStopped: t,
            isImmediatePropagationStopped: t,
            preventDefault: function() {
                var a = this.originalEvent;
                this.isDefaultPrevented = s, a && (a.preventDefault ? a.preventDefault() : a.returnValue = !1)
            },
            stopPropagation: function() {
                var a = this.originalEvent;
                this.isPropagationStopped = s, a && !this.isSimulated && (a.stopPropagation && a.stopPropagation(), a.cancelBubble = !0)
            },
            stopImmediatePropagation: function() {
                var a = this.originalEvent;
                this.isImmediatePropagationStopped = s, a && a.stopImmediatePropagation && a.stopImmediatePropagation(), this.stopPropagation()
            }
        }, na.each({
            mouseenter: "mouseover",
            mouseleave: "mouseout",
            pointerenter: "pointerover",
            pointerleave: "pointerout"
        }, function(a, b) {
            na.event.special[a] = {
                delegateType: b,
                bindType: b,
                handle: function(a) {
                    var c, d = this,
                        e = a.relatedTarget,
                        f = a.handleObj;
                    return (!e || e !== d && !na.contains(d, e)) && (a.type = f.origType, c = f.handler.apply(this, arguments), a.type = b), c
                }
            }
        }), la.submit || (na.event.special.submit = {
            setup: function() {
                return na.nodeName(this, "form") ? !1 : void na.event.add(this, "click._submit keypress._submit", function(a) {
                    var b = a.target,
                        c = na.nodeName(b, "input") || na.nodeName(b, "button") ? na.prop(b, "form") : void 0;
                    c && !na._data(c, "submit") && (na.event.add(c, "submit._submit", function(a) {
                        a._submitBubble = !0
                    }), na._data(c, "submit", !0))
                })
            },
            postDispatch: function(a) {
                a._submitBubble && (delete a._submitBubble, this.parentNode && !a.isTrigger && na.event.simulate("submit", this.parentNode, a))
            },
            teardown: function() {
                return na.nodeName(this, "form") ? !1 : void na.event.remove(this, "._submit")
            }
        }), la.change || (na.event.special.change = {
            setup: function() {
                return Wa.test(this.nodeName) ? (("checkbox" === this.type || "radio" === this.type) && (na.event.add(this, "propertychange._change", function(a) {
                    "checked" === a.originalEvent.propertyName && (this._justChanged = !0)
                }), na.event.add(this, "click._change", function(a) {
                    this._justChanged && !a.isTrigger && (this._justChanged = !1), na.event.simulate("change", this, a)
                })), !1) : void na.event.add(this, "beforeactivate._change", function(a) {
                    var b = a.target;
                    Wa.test(b.nodeName) && !na._data(b, "change") && (na.event.add(b, "change._change", function(a) {
                        !this.parentNode || a.isSimulated || a.isTrigger || na.event.simulate("change", this.parentNode, a)
                    }), na._data(b, "change", !0))
                })
            },
            handle: function(a) {
                var b = a.target;
                return this !== b || a.isSimulated || a.isTrigger || "radio" !== b.type && "checkbox" !== b.type ? a.handleObj.handler.apply(this, arguments) : void 0
            },
            teardown: function() {
                return na.event.remove(this, "._change"), !Wa.test(this.nodeName)
            }
        }), la.focusin || na.each({
            focus: "focusin",
            blur: "focusout"
        }, function(a, b) {
            var c = function(a) {
                na.event.simulate(b, a.target, na.event.fix(a))
            };
            na.event.special[b] = {
                setup: function() {
                    var d = this.ownerDocument || this,
                        e = na._data(d, b);
                    e || d.addEventListener(a, c, !0), na._data(d, b, (e || 0) + 1)
                },
                teardown: function() {
                    var d = this.ownerDocument || this,
                        e = na._data(d, b) - 1;
                    e ? na._data(d, b, e) : (d.removeEventListener(a, c, !0), na._removeData(d, b))
                }
            }
        }), na.fn.extend({
            on: function(a, b, c, d) {
                return v(this, a, b, c, d)
            },
            one: function(a, b, c, d) {
                return v(this, a, b, c, d, 1)
            },
            off: function(a, b, c) {
                var d, e;
                if (a && a.preventDefault && a.handleObj) return d = a.handleObj, na(a.delegateTarget).off(d.namespace ? d.origType + "." + d.namespace : d.origType, d.selector, d.handler), this;
                if ("object" == typeof a) {
                    for (e in a) this.off(e, b, a[e]);
                    return this
                }
                return (b === !1 || "function" == typeof b) && (c = b, b = void 0), c === !1 && (c = t), this.each(function() {
                    na.event.remove(this, a, c, b)
                })
            },
            trigger: function(a, b) {
                return this.each(function() {
                    na.event.trigger(a, b, this)
                })
            },
            triggerHandler: function(a, b) {
                var c = this[0];
                return c ? na.event.trigger(a, b, c, !0) : void 0
            }
        });
        var _a = / jQuery\d+="(?:null|\d+)"/g,
            ab = new RegExp("<(?:" + Sa + ")[\\s/>]", "i"),
            bb = /<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:-]+)[^>]*)\/>/gi,
            cb = /<script|<style|<link/i,
            db = /checked\s*(?:[^=]|=\s*.checked.)/i,
            eb = /^true\/(.*)/,
            fb = /^\s*<!(?:\[CDATA\[|--)|(?:\]\]|--)>\s*$/g,
            gb = n(da),
            hb = gb.appendChild(da.createElement("div"));
        na.extend({
            htmlPrefilter: function(a) {
                return a.replace(bb, "<$1></$2>")
            },
            clone: function(a, b, c) {
                var d, e, f, g, h, i = na.contains(a.ownerDocument, a);
                if (la.html5Clone || na.isXMLDoc(a) || !ab.test("<" + a.nodeName + ">") ? f = a.cloneNode(!0) : (hb.innerHTML = a.outerHTML, hb.removeChild(f = hb.firstChild)), !(la.noCloneEvent && la.noCloneChecked || 1 !== a.nodeType && 11 !== a.nodeType || na.isXMLDoc(a)))
                    for (d = o(f), h = o(a), g = 0; null != (e = h[g]); ++g) d[g] && A(e, d[g]);
                if (b)
                    if (c)
                        for (h = h || o(a), d = d || o(f), g = 0; null != (e = h[g]); g++) z(e, d[g]);
                    else z(a, f);
                return d = o(f, "script"), d.length > 0 && p(d, !i && o(a, "script")), d = h = e = null, f
            },
            cleanData: function(a, b) {
                for (var c, d, e, f, g = 0, h = na.expando, i = na.cache, j = la.attributes, k = na.event.special; null != (c = a[g]); g++)
                    if ((b || Ga(c)) && (e = c[h], f = e && i[e])) {
                        if (f.events)
                            for (d in f.events) k[d] ? na.event.remove(c, d) : na.removeEvent(c, d, f.handle);
                        i[e] && (delete i[e], j || "undefined" == typeof c.removeAttribute ? c[h] = void 0 : c.removeAttribute(h), ca.push(e))
                    }
            }
        }), na.fn.extend({
            domManip: B,
            detach: function(a) {
                return C(this, a, !0)
            },
            remove: function(a) {
                return C(this, a)
            },
            text: function(a) {
                return Na(this, function(a) {
                    return void 0 === a ? na.text(this) : this.empty().append((this[0] && this[0].ownerDocument || da).createTextNode(a))
                }, null, a, arguments.length)
            },
            append: function() {
                return B(this, arguments, function(a) {
                    if (1 === this.nodeType || 11 === this.nodeType || 9 === this.nodeType) {
                        var b = w(this, a);
                        b.appendChild(a)
                    }
                })
            },
            prepend: function() {
                return B(this, arguments, function(a) {
                    if (1 === this.nodeType || 11 === this.nodeType || 9 === this.nodeType) {
                        var b = w(this, a);
                        b.insertBefore(a, b.firstChild)
                    }
                })
            },
            before: function() {
                return B(this, arguments, function(a) {
                    this.parentNode && this.parentNode.insertBefore(a, this)
                })
            },
            after: function() {
                return B(this, arguments, function(a) {
                    this.parentNode && this.parentNode.insertBefore(a, this.nextSibling)
                })
            },
            empty: function() {
                for (var a, b = 0; null != (a = this[b]); b++) {
                    for (1 === a.nodeType && na.cleanData(o(a, !1)); a.firstChild;) a.removeChild(a.firstChild);
                    a.options && na.nodeName(a, "select") && (a.options.length = 0)
                }
                return this
            },
            clone: function(a, b) {
                return a = null == a ? !1 : a, b = null == b ? a : b, this.map(function() {
                    return na.clone(this, a, b)
                })
            },
            html: function(a) {
                return Na(this, function(a) {
                    var b = this[0] || {},
                        c = 0,
                        d = this.length;
                    if (void 0 === a) return 1 === b.nodeType ? b.innerHTML.replace(_a, "") : void 0;
                    if (!("string" != typeof a || cb.test(a) || !la.htmlSerialize && ab.test(a) || !la.leadingWhitespace && Ra.test(a) || Ta[(Pa.exec(a) || ["", ""])[1].toLowerCase()])) {
                        a = na.htmlPrefilter(a);
                        try {
                            for (; d > c; c++) b = this[c] || {}, 1 === b.nodeType && (na.cleanData(o(b, !1)), b.innerHTML = a);
                            b = 0
                        } catch (e) {}
                    }
                    b && this.empty().append(a)
                }, null, a, arguments.length)
            },
            replaceWith: function() {
                var a = [];
                return B(this, arguments, function(b) {
                    var c = this.parentNode;
                    na.inArray(this, a) < 0 && (na.cleanData(o(this)), c && c.replaceChild(b, this))
                }, a)
            }
        }), na.each({
            appendTo: "append",
            prependTo: "prepend",
            insertBefore: "before",
            insertAfter: "after",
            replaceAll: "replaceWith"
        }, function(a, b) {
            na.fn[a] = function(a) {
                for (var c, d = 0, e = [], f = na(a), g = f.length - 1; g >= d; d++) c = d === g ? this : this.clone(!0), na(f[d])[b](c), ga.apply(e, c.get());
                return this.pushStack(e)
            }
        });
        var ib, jb = {
                HTML: "block",
                BODY: "block"
            },
            kb = /^margin/,
            lb = new RegExp("^(" + Ja + ")(?!px)[a-z%]+$", "i"),
            mb = function(a, b, c, d) {
                var e, f, g = {};
                for (f in b) g[f] = a.style[f], a.style[f] = b[f];
                e = c.apply(a, d || []);
                for (f in b) a.style[f] = g[f];
                return e
            },
            nb = da.documentElement;
        ! function() {
            function b() {
                var b, k, l = da.documentElement;
                l.appendChild(i), j.style.cssText = "-webkit-box-sizing:border-box;box-sizing:border-box;position:relative;display:block;margin:auto;border:1px;padding:1px;top:1%;width:50%", c = e = h = !1, d = g = !0, a.getComputedStyle && (k = a.getComputedStyle(j), c = "1%" !== (k || {}).top, h = "2px" === (k || {}).marginLeft, e = "4px" === (k || {
                    width: "4px"
                }).width, j.style.marginRight = "50%", d = "4px" === (k || {
                    marginRight: "4px"
                }).marginRight, b = j.appendChild(da.createElement("div")), b.style.cssText = j.style.cssText = "-webkit-box-sizing:content-box;-moz-box-sizing:content-box;box-sizing:content-box;display:block;margin:0;border:0;padding:0", b.style.marginRight = b.style.width = "0", j.style.width = "1px", g = !parseFloat((a.getComputedStyle(b) || {}).marginRight), j.removeChild(b)), j.style.display = "none", f = 0 === j.getClientRects().length, f && (j.style.display = "", j.innerHTML = "<table><tr><td></td><td>t</td></tr></table>", b = j.getElementsByTagName("td"), b[0].style.cssText = "margin:0;border:0;padding:0;display:none", f = 0 === b[0].offsetHeight, f && (b[0].style.display = "", b[1].style.display = "none", f = 0 === b[0].offsetHeight)), l.removeChild(i)
            }
            var c, d, e, f, g, h, i = da.createElement("div"),
                j = da.createElement("div");
            j.style && (j.style.cssText = "float:left;opacity:.5", la.opacity = "0.5" === j.style.opacity, la.cssFloat = !!j.style.cssFloat, j.style.backgroundClip = "content-box", j.cloneNode(!0).style.backgroundClip = "", la.clearCloneStyle = "content-box" === j.style.backgroundClip, i = da.createElement("div"), i.style.cssText = "border:0;width:8px;height:0;top:0;left:-9999px;padding:0;margin-top:1px;position:absolute", j.innerHTML = "", i.appendChild(j), la.boxSizing = "" === j.style.boxSizing || "" === j.style.MozBoxSizing || "" === j.style.WebkitBoxSizing, na.extend(la, {
                reliableHiddenOffsets: function() {
                    return null == c && b(), f
                },
                boxSizingReliable: function() {
                    return null == c && b(), e
                },
                pixelMarginRight: function() {
                    return null == c && b(), d
                },
                pixelPosition: function() {
                    return null == c && b(), c
                },
                reliableMarginRight: function() {
                    return null == c && b(), g
                },
                reliableMarginLeft: function() {
                    return null == c && b(), h
                }
            }))
        }();
        var ob, pb, qb = /^(top|right|bottom|left)$/;
        a.getComputedStyle ? (ob = function(b) {
            var c = b.ownerDocument.defaultView;
            return c.opener || (c = a), c.getComputedStyle(b)
        }, pb = function(a, b, c) {
            var d, e, f, g, h = a.style;
            return c = c || ob(a), g = c ? c.getPropertyValue(b) || c[b] : void 0, c && ("" !== g || na.contains(a.ownerDocument, a) || (g = na.style(a, b)), !la.pixelMarginRight() && lb.test(g) && kb.test(b) && (d = h.width, e = h.minWidth, f = h.maxWidth, h.minWidth = h.maxWidth = h.width = g, g = c.width, h.width = d, h.minWidth = e, h.maxWidth = f)), void 0 === g ? g : g + ""
        }) : nb.currentStyle && (ob = function(a) {
            return a.currentStyle
        }, pb = function(a, b, c) {
            var d, e, f, g, h = a.style;
            return c = c || ob(a), g = c ? c[b] : void 0, null == g && h && h[b] && (g = h[b]), lb.test(g) && !qb.test(b) && (d = h.left, e = a.runtimeStyle, f = e && e.left, f && (e.left = a.currentStyle.left), h.left = "fontSize" === b ? "1em" : g, g = h.pixelLeft + "px", h.left = d, f && (e.left = f)), void 0 === g ? g : g + "" || "auto"
        });
        var rb = /alpha\([^)]*\)/i,
            sb = /opacity\s*=\s*([^)]*)/i,
            tb = /^(none|table(?!-c[ea]).+)/,
            ub = new RegExp("^(" + Ja + ")(.*)$", "i"),
            vb = {
                position: "absolute",
                visibility: "hidden",
                display: "block"
            },
            wb = {
                letterSpacing: "0",
                fontWeight: "400"
            },
            xb = ["Webkit", "O", "Moz", "ms"],
            yb = da.createElement("div").style;
        na.extend({
            cssHooks: {
                opacity: {
                    get: function(a, b) {
                        if (b) {
                            var c = pb(a, "opacity");
                            return "" === c ? "1" : c
                        }
                    }
                }
            },
            cssNumber: {
                animationIterationCount: !0,
                columnCount: !0,
                fillOpacity: !0,
                flexGrow: !0,
                flexShrink: !0,
                fontWeight: !0,
                lineHeight: !0,
                opacity: !0,
                order: !0,
                orphans: !0,
                widows: !0,
                zIndex: !0,
                zoom: !0
            },
            cssProps: {
                "float": la.cssFloat ? "cssFloat" : "styleFloat"
            },
            style: function(a, b, c, d) {
                if (a && 3 !== a.nodeType && 8 !== a.nodeType && a.style) {
                    var e, f, g, h = na.camelCase(b),
                        i = a.style;
                    if (b = na.cssProps[h] || (na.cssProps[h] = G(h) || h), g = na.cssHooks[b] || na.cssHooks[h], void 0 === c) return g && "get" in g && void 0 !== (e = g.get(a, !1, d)) ? e : i[b];
                    if (f = typeof c, "string" === f && (e = Ka.exec(c)) && e[1] && (c = m(a, b, e), f = "number"), null != c && c === c && ("number" === f && (c += e && e[3] || (na.cssNumber[h] ? "" : "px")), la.clearCloneStyle || "" !== c || 0 !== b.indexOf("background") || (i[b] = "inherit"), !(g && "set" in g && void 0 === (c = g.set(a, c, d))))) try {
                        i[b] = c
                    } catch (j) {}
                }
            },
            css: function(a, b, c, d) {
                var e, f, g, h = na.camelCase(b);
                return b = na.cssProps[h] || (na.cssProps[h] = G(h) || h), g = na.cssHooks[b] || na.cssHooks[h], g && "get" in g && (f = g.get(a, !0, c)), void 0 === f && (f = pb(a, b, d)), "normal" === f && b in wb && (f = wb[b]), "" === c || c ? (e = parseFloat(f), c === !0 || isFinite(e) ? e || 0 : f) : f
            }
        }), na.each(["height", "width"], function(a, b) {
            na.cssHooks[b] = {
                get: function(a, c, d) {
                    return c ? tb.test(na.css(a, "display")) && 0 === a.offsetWidth ? mb(a, vb, function() {
                        return K(a, b, d)
                    }) : K(a, b, d) : void 0
                },
                set: function(a, c, d) {
                    var e = d && ob(a);
                    return I(a, c, d ? J(a, b, d, la.boxSizing && "border-box" === na.css(a, "boxSizing", !1, e), e) : 0)
                }
            }
        }), la.opacity || (na.cssHooks.opacity = {
            get: function(a, b) {
                return sb.test((b && a.currentStyle ? a.currentStyle.filter : a.style.filter) || "") ? .01 * parseFloat(RegExp.$1) + "" : b ? "1" : ""
            },
            set: function(a, b) {
                var c = a.style,
                    d = a.currentStyle,
                    e = na.isNumeric(b) ? "alpha(opacity=" + 100 * b + ")" : "",
                    f = d && d.filter || c.filter || "";
                c.zoom = 1, (b >= 1 || "" === b) && "" === na.trim(f.replace(rb, "")) && c.removeAttribute && (c.removeAttribute("filter"), "" === b || d && !d.filter) || (c.filter = rb.test(f) ? f.replace(rb, e) : f + " " + e)
            }
        }), na.cssHooks.marginRight = F(la.reliableMarginRight, function(a, b) {
            return b ? mb(a, {
                display: "inline-block"
            }, pb, [a, "marginRight"]) : void 0
        }), na.cssHooks.marginLeft = F(la.reliableMarginLeft, function(a, b) {
            return b ? (parseFloat(pb(a, "marginLeft")) || (na.contains(a.ownerDocument, a) ? a.getBoundingClientRect().left - mb(a, {
                marginLeft: 0
            }, function() {
                return a.getBoundingClientRect().left
            }) : 0)) + "px" : void 0
        }), na.each({
            margin: "",
            padding: "",
            border: "Width"
        }, function(a, b) {
            na.cssHooks[a + b] = {
                expand: function(c) {
                    for (var d = 0, e = {}, f = "string" == typeof c ? c.split(" ") : [c]; 4 > d; d++) e[a + La[d] + b] = f[d] || f[d - 2] || f[0];
                    return e
                }
            }, kb.test(a) || (na.cssHooks[a + b].set = I)
        }), na.fn.extend({
            css: function(a, b) {
                return Na(this, function(a, b, c) {
                    var d, e, f = {},
                        g = 0;
                    if (na.isArray(b)) {
                        for (d = ob(a), e = b.length; e > g; g++) f[b[g]] = na.css(a, b[g], !1, d);
                        return f
                    }
                    return void 0 !== c ? na.style(a, b, c) : na.css(a, b)
                }, a, b, arguments.length > 1)
            },
            show: function() {
                return H(this, !0)
            },
            hide: function() {
                return H(this)
            },
            toggle: function(a) {
                return "boolean" == typeof a ? a ? this.show() : this.hide() : this.each(function() {
                    Ma(this) ? na(this).show() : na(this).hide()
                })
            }
        }), na.Tween = L, L.prototype = {
            constructor: L,
            init: function(a, b, c, d, e, f) {
                this.elem = a, this.prop = c, this.easing = e || na.easing._default, this.options = b, this.start = this.now = this.cur(), this.end = d, this.unit = f || (na.cssNumber[c] ? "" : "px")
            },
            cur: function() {
                var a = L.propHooks[this.prop];
                return a && a.get ? a.get(this) : L.propHooks._default.get(this)
            },
            run: function(a) {
                var b, c = L.propHooks[this.prop];
                return this.pos = b = this.options.duration ? na.easing[this.easing](a, this.options.duration * a, 0, 1, this.options.duration) : a, this.now = (this.end - this.start) * b + this.start, this.options.step && this.options.step.call(this.elem, this.now, this), c && c.set ? c.set(this) : L.propHooks._default.set(this), this
            }
        }, L.prototype.init.prototype = L.prototype, L.propHooks = {
            _default: {
                get: function(a) {
                    var b;
                    return 1 !== a.elem.nodeType || null != a.elem[a.prop] && null == a.elem.style[a.prop] ? a.elem[a.prop] : (b = na.css(a.elem, a.prop, ""), b && "auto" !== b ? b : 0)
                },
                set: function(a) {
                    na.fx.step[a.prop] ? na.fx.step[a.prop](a) : 1 !== a.elem.nodeType || null == a.elem.style[na.cssProps[a.prop]] && !na.cssHooks[a.prop] ? a.elem[a.prop] = a.now : na.style(a.elem, a.prop, a.now + a.unit)
                }
            }
        }, L.propHooks.scrollTop = L.propHooks.scrollLeft = {
            set: function(a) {
                a.elem.nodeType && a.elem.parentNode && (a.elem[a.prop] = a.now)
            }
        }, na.easing = {
            linear: function(a) {
                return a
            },
            swing: function(a) {
                return .5 - Math.cos(a * Math.PI) / 2
            },
            _default: "swing"
        }, na.fx = L.prototype.init, na.fx.step = {};
        var zb, Ab, Bb = /^(?:toggle|show|hide)$/,
            Cb = /queueHooks$/;
        na.Animation = na.extend(R, {
                tweeners: {
                    "*": [function(a, b) {
                        var c = this.createTween(a, b);
                        return m(c.elem, a, Ka.exec(b), c), c
                    }]
                },
                tweener: function(a, b) {
                    na.isFunction(a) ? (b = a, a = ["*"]) : a = a.match(Da);
                    for (var c, d = 0, e = a.length; e > d; d++) c = a[d], R.tweeners[c] = R.tweeners[c] || [], R.tweeners[c].unshift(b)
                },
                prefilters: [P],
                prefilter: function(a, b) {
                    b ? R.prefilters.unshift(a) : R.prefilters.push(a)
                }
            }), na.speed = function(a, b, c) {
                var d = a && "object" == typeof a ? na.extend({}, a) : {
                    complete: c || !c && b || na.isFunction(a) && a,
                    duration: a,
                    easing: c && b || b && !na.isFunction(b) && b
                };
                return d.duration = na.fx.off ? 0 : "number" == typeof d.duration ? d.duration : d.duration in na.fx.speeds ? na.fx.speeds[d.duration] : na.fx.speeds._default, (null == d.queue || d.queue === !0) && (d.queue = "fx"), d.old = d.complete, d.complete = function() {
                    na.isFunction(d.old) && d.old.call(this), d.queue && na.dequeue(this, d.queue)
                }, d
            }, na.fn.extend({
                fadeTo: function(a, b, c, d) {
                    return this.filter(Ma).css("opacity", 0).show().end().animate({
                        opacity: b
                    }, a, c, d)
                },
                animate: function(a, b, c, d) {
                    var e = na.isEmptyObject(a),
                        f = na.speed(b, c, d),
                        g = function() {
                            var b = R(this, na.extend({}, a), f);
                            (e || na._data(this, "finish")) && b.stop(!0)
                        };
                    return g.finish = g, e || f.queue === !1 ? this.each(g) : this.queue(f.queue, g)
                },
                stop: function(a, b, c) {
                    var d = function(a) {
                        var b = a.stop;
                        delete a.stop, b(c)
                    };
                    return "string" != typeof a && (c = b, b = a, a = void 0), b && a !== !1 && this.queue(a || "fx", []), this.each(function() {
                        var b = !0,
                            e = null != a && a + "queueHooks",
                            f = na.timers,
                            g = na._data(this);
                        if (e) g[e] && g[e].stop && d(g[e]);
                        else
                            for (e in g) g[e] && g[e].stop && Cb.test(e) && d(g[e]);
                        for (e = f.length; e--;) f[e].elem !== this || null != a && f[e].queue !== a || (f[e].anim.stop(c), b = !1, f.splice(e, 1));
                        (b || !c) && na.dequeue(this, a)
                    })
                },
                finish: function(a) {
                    return a !== !1 && (a = a || "fx"), this.each(function() {
                        var b, c = na._data(this),
                            d = c[a + "queue"],
                            e = c[a + "queueHooks"],
                            f = na.timers,
                            g = d ? d.length : 0;
                        for (c.finish = !0, na.queue(this, a, []), e && e.stop && e.stop.call(this, !0), b = f.length; b--;) f[b].elem === this && f[b].queue === a && (f[b].anim.stop(!0), f.splice(b, 1));
                        for (b = 0; g > b; b++) d[b] && d[b].finish && d[b].finish.call(this);
                        delete c.finish
                    })
                }
            }), na.each(["toggle", "show", "hide"], function(a, b) {
                var c = na.fn[b];
                na.fn[b] = function(a, d, e) {
                    return null == a || "boolean" == typeof a ? c.apply(this, arguments) : this.animate(N(b, !0), a, d, e)
                }
            }), na.each({
                slideDown: N("show"),
                slideUp: N("hide"),
                slideToggle: N("toggle"),
                fadeIn: {
                    opacity: "show"
                },
                fadeOut: {
                    opacity: "hide"
                },
                fadeToggle: {
                    opacity: "toggle"
                }
            }, function(a, b) {
                na.fn[a] = function(a, c, d) {
                    return this.animate(b, a, c, d)
                }
            }), na.timers = [], na.fx.tick = function() {
                var a, b = na.timers,
                    c = 0;
                for (zb = na.now(); c < b.length; c++) a = b[c], a() || b[c] !== a || b.splice(c--, 1);
                b.length || na.fx.stop(), zb = void 0
            }, na.fx.timer = function(a) {
                na.timers.push(a), a() ? na.fx.start() : na.timers.pop()
            }, na.fx.interval = 13, na.fx.start = function() {
                Ab || (Ab = a.setInterval(na.fx.tick, na.fx.interval))
            }, na.fx.stop = function() {
                a.clearInterval(Ab), Ab = null
            }, na.fx.speeds = {
                slow: 600,
                fast: 200,
                _default: 400
            }, na.fn.delay = function(b, c) {
                return b = na.fx ? na.fx.speeds[b] || b : b, c = c || "fx", this.queue(c, function(c, d) {
                    var e = a.setTimeout(c, b);
                    d.stop = function() {
                        a.clearTimeout(e)
                    }
                })
            },
            function() {
                var a, b = da.createElement("input"),
                    c = da.createElement("div"),
                    d = da.createElement("select"),
                    e = d.appendChild(da.createElement("option"));
                c = da.createElement("div"), c.setAttribute("className", "t"), c.innerHTML = "  <link/><table></table><a href='/a'>a</a><input type='checkbox'/>", a = c.getElementsByTagName("a")[0], b.setAttribute("type", "checkbox"), c.appendChild(b), a = c.getElementsByTagName("a")[0], a.style.cssText = "top:1px", la.getSetAttribute = "t" !== c.className, la.style = /top/.test(a.getAttribute("style")), la.hrefNormalized = "/a" === a.getAttribute("href"), la.checkOn = !!b.value, la.optSelected = e.selected, la.enctype = !!da.createElement("form").enctype, d.disabled = !0, la.optDisabled = !e.disabled, b = da.createElement("input"), b.setAttribute("value", ""), la.input = "" === b.getAttribute("value"), b.value = "t", b.setAttribute("type", "radio"), la.radioValue = "t" === b.value
            }();
        var Db = /\r/g;
        na.fn.extend({
            val: function(a) {
                var b, c, d, e = this[0]; {
                    if (arguments.length) return d = na.isFunction(a), this.each(function(c) {
                        var e;
                        1 === this.nodeType && (e = d ? a.call(this, c, na(this).val()) : a, null == e ? e = "" : "number" == typeof e ? e += "" : na.isArray(e) && (e = na.map(e, function(a) {
                            return null == a ? "" : a + ""
                        })), b = na.valHooks[this.type] || na.valHooks[this.nodeName.toLowerCase()], b && "set" in b && void 0 !== b.set(this, e, "value") || (this.value = e))
                    });
                    if (e) return b = na.valHooks[e.type] || na.valHooks[e.nodeName.toLowerCase()], b && "get" in b && void 0 !== (c = b.get(e, "value")) ? c : (c = e.value, "string" == typeof c ? c.replace(Db, "") : null == c ? "" : c)
                }
            }
        }), na.extend({
            valHooks: {
                option: {
                    get: function(a) {
                        var b = na.find.attr(a, "value");
                        return null != b ? b : na.trim(na.text(a))
                    }
                },
                select: {
                    get: function(a) {
                        for (var b, c, d = a.options, e = a.selectedIndex, f = "select-one" === a.type || 0 > e, g = f ? null : [], h = f ? e + 1 : d.length, i = 0 > e ? h : f ? e : 0; h > i; i++)
                            if (c = d[i], !(!c.selected && i !== e || (la.optDisabled ? c.disabled : null !== c.getAttribute("disabled")) || c.parentNode.disabled && na.nodeName(c.parentNode, "optgroup"))) {
                                if (b = na(c).val(), f) return b;
                                g.push(b)
                            }
                        return g
                    },
                    set: function(a, b) {
                        for (var c, d, e = a.options, f = na.makeArray(b), g = e.length; g--;)
                            if (d = e[g], na.inArray(na.valHooks.option.get(d), f) >= 0) try {
                                d.selected = c = !0
                            } catch (h) {
                                d.scrollHeight
                            } else d.selected = !1;
                        return c || (a.selectedIndex = -1), e
                    }
                }
            }
        }), na.each(["radio", "checkbox"], function() {
            na.valHooks[this] = {
                set: function(a, b) {
                    return na.isArray(b) ? a.checked = na.inArray(na(a).val(), b) > -1 : void 0
                }
            }, la.checkOn || (na.valHooks[this].get = function(a) {
                return null === a.getAttribute("value") ? "on" : a.value
            })
        });
        var Eb, Fb, Gb = na.expr.attrHandle,
            Hb = /^(?:checked|selected)$/i,
            Ib = la.getSetAttribute,
            Jb = la.input;
        na.fn.extend({
            attr: function(a, b) {
                return Na(this, na.attr, a, b, arguments.length > 1)
            },
            removeAttr: function(a) {
                return this.each(function() {
                    na.removeAttr(this, a)
                })
            }
        }), na.extend({
            attr: function(a, b, c) {
                var d, e, f = a.nodeType;
                if (3 !== f && 8 !== f && 2 !== f) return "undefined" == typeof a.getAttribute ? na.prop(a, b, c) : (1 === f && na.isXMLDoc(a) || (b = b.toLowerCase(), e = na.attrHooks[b] || (na.expr.match.bool.test(b) ? Fb : Eb)), void 0 !== c ? null === c ? void na.removeAttr(a, b) : e && "set" in e && void 0 !== (d = e.set(a, c, b)) ? d : (a.setAttribute(b, c + ""), c) : e && "get" in e && null !== (d = e.get(a, b)) ? d : (d = na.find.attr(a, b), null == d ? void 0 : d))
            },
            attrHooks: {
                type: {
                    set: function(a, b) {
                        if (!la.radioValue && "radio" === b && na.nodeName(a, "input")) {
                            var c = a.value;
                            return a.setAttribute("type", b), c && (a.value = c), b
                        }
                    }
                }
            },
            removeAttr: function(a, b) {
                var c, d, e = 0,
                    f = b && b.match(Da);
                if (f && 1 === a.nodeType)
                    for (; c = f[e++];) d = na.propFix[c] || c, na.expr.match.bool.test(c) ? Jb && Ib || !Hb.test(c) ? a[d] = !1 : a[na.camelCase("default-" + c)] = a[d] = !1 : na.attr(a, c, ""), a.removeAttribute(Ib ? c : d)
            }
        }), Fb = {
            set: function(a, b, c) {
                return b === !1 ? na.removeAttr(a, c) : Jb && Ib || !Hb.test(c) ? a.setAttribute(!Ib && na.propFix[c] || c, c) : a[na.camelCase("default-" + c)] = a[c] = !0, c
            }
        }, na.each(na.expr.match.bool.source.match(/\w+/g), function(a, b) {
            var c = Gb[b] || na.find.attr;
            Gb[b] = Jb && Ib || !Hb.test(b) ? function(a, b, d) {
                var e, f;
                return d || (f = Gb[b], Gb[b] = e, e = null != c(a, b, d) ? b.toLowerCase() : null, Gb[b] = f), e
            } : function(a, b, c) {
                return c ? void 0 : a[na.camelCase("default-" + b)] ? b.toLowerCase() : null
            }
        }), Jb && Ib || (na.attrHooks.value = {
            set: function(a, b, c) {
                return na.nodeName(a, "input") ? void(a.defaultValue = b) : Eb && Eb.set(a, b, c)
            }
        }), Ib || (Eb = {
            set: function(a, b, c) {
                var d = a.getAttributeNode(c);
                return d || a.setAttributeNode(d = a.ownerDocument.createAttribute(c)), d.value = b += "", "value" === c || b === a.getAttribute(c) ? b : void 0
            }
        }, Gb.id = Gb.name = Gb.coords = function(a, b, c) {
            var d;
            return c ? void 0 : (d = a.getAttributeNode(b)) && "" !== d.value ? d.value : null
        }, na.valHooks.button = {
            get: function(a, b) {
                var c = a.getAttributeNode(b);
                return c && c.specified ? c.value : void 0
            },
            set: Eb.set
        }, na.attrHooks.contenteditable = {
            set: function(a, b, c) {
                Eb.set(a, "" === b ? !1 : b, c)
            }
        }, na.each(["width", "height"], function(a, b) {
            na.attrHooks[b] = {
                set: function(a, c) {
                    return "" === c ? (a.setAttribute(b, "auto"), c) : void 0
                }
            }
        })), la.style || (na.attrHooks.style = {
            get: function(a) {
                return a.style.cssText || void 0;

            },
            set: function(a, b) {
                return a.style.cssText = b + ""
            }
        });
        var Kb = /^(?:input|select|textarea|button|object)$/i,
            Lb = /^(?:a|area)$/i;
        na.fn.extend({
            prop: function(a, b) {
                return Na(this, na.prop, a, b, arguments.length > 1)
            },
            removeProp: function(a) {
                return a = na.propFix[a] || a, this.each(function() {
                    try {
                        this[a] = void 0, delete this[a]
                    } catch (b) {}
                })
            }
        }), na.extend({
            prop: function(a, b, c) {
                var d, e, f = a.nodeType;
                if (3 !== f && 8 !== f && 2 !== f) return 1 === f && na.isXMLDoc(a) || (b = na.propFix[b] || b, e = na.propHooks[b]), void 0 !== c ? e && "set" in e && void 0 !== (d = e.set(a, c, b)) ? d : a[b] = c : e && "get" in e && null !== (d = e.get(a, b)) ? d : a[b]
            },
            propHooks: {
                tabIndex: {
                    get: function(a) {
                        var b = na.find.attr(a, "tabindex");
                        return b ? parseInt(b, 10) : Kb.test(a.nodeName) || Lb.test(a.nodeName) && a.href ? 0 : -1
                    }
                }
            },
            propFix: {
                "for": "htmlFor",
                "class": "className"
            }
        }), la.hrefNormalized || na.each(["href", "src"], function(a, b) {
            na.propHooks[b] = {
                get: function(a) {
                    return a.getAttribute(b, 4)
                }
            }
        }), la.optSelected || (na.propHooks.selected = {
            get: function(a) {
                var b = a.parentNode;
                return b && (b.selectedIndex, b.parentNode && b.parentNode.selectedIndex), null
            }
        }), na.each(["tabIndex", "readOnly", "maxLength", "cellSpacing", "cellPadding", "rowSpan", "colSpan", "useMap", "frameBorder", "contentEditable"], function() {
            na.propFix[this.toLowerCase()] = this
        }), la.enctype || (na.propFix.enctype = "encoding");
        var Mb = /[\t\r\n\f]/g;
        na.fn.extend({
            addClass: function(a) {
                var b, c, d, e, f, g, h, i = 0;
                if (na.isFunction(a)) return this.each(function(b) {
                    na(this).addClass(a.call(this, b, S(this)))
                });
                if ("string" == typeof a && a)
                    for (b = a.match(Da) || []; c = this[i++];)
                        if (e = S(c), d = 1 === c.nodeType && (" " + e + " ").replace(Mb, " ")) {
                            for (g = 0; f = b[g++];) d.indexOf(" " + f + " ") < 0 && (d += f + " ");
                            h = na.trim(d), e !== h && na.attr(c, "class", h)
                        }
                return this
            },
            removeClass: function(a) {
                var b, c, d, e, f, g, h, i = 0;
                if (na.isFunction(a)) return this.each(function(b) {
                    na(this).removeClass(a.call(this, b, S(this)))
                });
                if (!arguments.length) return this.attr("class", "");
                if ("string" == typeof a && a)
                    for (b = a.match(Da) || []; c = this[i++];)
                        if (e = S(c), d = 1 === c.nodeType && (" " + e + " ").replace(Mb, " ")) {
                            for (g = 0; f = b[g++];)
                                for (; d.indexOf(" " + f + " ") > -1;) d = d.replace(" " + f + " ", " ");
                            h = na.trim(d), e !== h && na.attr(c, "class", h)
                        }
                return this
            },
            toggleClass: function(a, b) {
                var c = typeof a;
                return "boolean" == typeof b && "string" === c ? b ? this.addClass(a) : this.removeClass(a) : this.each(na.isFunction(a) ? function(c) {
                    na(this).toggleClass(a.call(this, c, S(this), b), b)
                } : function() {
                    var b, d, e, f;
                    if ("string" === c)
                        for (d = 0, e = na(this), f = a.match(Da) || []; b = f[d++];) e.hasClass(b) ? e.removeClass(b) : e.addClass(b);
                    else(void 0 === a || "boolean" === c) && (b = S(this), b && na._data(this, "__className__", b), na.attr(this, "class", b || a === !1 ? "" : na._data(this, "__className__") || ""))
                })
            },
            hasClass: function(a) {
                var b, c, d = 0;
                for (b = " " + a + " "; c = this[d++];)
                    if (1 === c.nodeType && (" " + S(c) + " ").replace(Mb, " ").indexOf(b) > -1) return !0;
                return !1
            }
        }), na.each("blur focus focusin focusout load resize scroll unload click dblclick mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave change select submit keydown keypress keyup error contextmenu".split(" "), function(a, b) {
            na.fn[b] = function(a, c) {
                return arguments.length > 0 ? this.on(b, null, a, c) : this.trigger(b)
            }
        }), na.fn.extend({
            hover: function(a, b) {
                return this.mouseenter(a).mouseleave(b || a)
            }
        });
        var Nb = a.location,
            Ob = na.now(),
            Pb = /\?/,
            Qb = /(,)|(\[|{)|(}|])|"(?:[^"\\\r\n]|\\["\\\/bfnrt]|\\u[\da-fA-F]{4})*"\s*:?|true|false|null|-?(?!0\d)\d+(?:\.\d+|)(?:[eE][+-]?\d+|)/g;
        na.parseJSON = function(b) {
            if (a.JSON && a.JSON.parse) return a.JSON.parse(b + "");
            var c, d = null,
                e = na.trim(b + "");
            return e && !na.trim(e.replace(Qb, function(a, b, e, f) {
                return c && b && (d = 0), 0 === d ? a : (c = e || b, d += !f - !e, "")
            })) ? Function("return " + e)() : na.error("Invalid JSON: " + b)
        }, na.parseXML = function(b) {
            var c, d;
            if (!b || "string" != typeof b) return null;
            try {
                a.DOMParser ? (d = new a.DOMParser, c = d.parseFromString(b, "text/xml")) : (c = new a.ActiveXObject("Microsoft.XMLDOM"), c.async = "false", c.loadXML(b))
            } catch (e) {
                c = void 0
            }
            return c && c.documentElement && !c.getElementsByTagName("parsererror").length || na.error("Invalid XML: " + b), c
        };
        var Rb = /#.*$/,
            Sb = /([?&])_=[^&]*/,
            Tb = /^(.*?):[ \t]*([^\r\n]*)\r?$/gm,
            Ub = /^(?:about|app|app-storage|.+-extension|file|res|widget):$/,
            Vb = /^(?:GET|HEAD)$/,
            Wb = /^\/\//,
            Xb = /^([\w.+-]+:)(?:\/\/(?:[^\/?#]*@|)([^\/?#:]*)(?::(\d+)|)|)/,
            Yb = {},
            Zb = {},
            $b = "*/".concat("*"),
            _b = Nb.href,
            ac = Xb.exec(_b.toLowerCase()) || [];
        na.extend({
            active: 0,
            lastModified: {},
            etag: {},
            ajaxSettings: {
                url: _b,
                type: "GET",
                isLocal: Ub.test(ac[1]),
                global: !0,
                processData: !0,
                async: !0,
                contentType: "application/x-www-form-urlencoded; charset=UTF-8",
                accepts: {
                    "*": $b,
                    text: "text/plain",
                    html: "text/html",
                    xml: "application/xml, text/xml",
                    json: "application/json, text/javascript"
                },
                contents: {
                    xml: /\bxml\b/,
                    html: /\bhtml/,
                    json: /\bjson\b/
                },
                responseFields: {
                    xml: "responseXML",
                    text: "responseText",
                    json: "responseJSON"
                },
                converters: {
                    "* text": String,
                    "text html": !0,
                    "text json": na.parseJSON,
                    "text xml": na.parseXML
                },
                flatOptions: {
                    url: !0,
                    context: !0
                }
            },
            ajaxSetup: function(a, b) {
                return b ? V(V(a, na.ajaxSettings), b) : V(na.ajaxSettings, a)
            },
            ajaxPrefilter: T(Yb),
            ajaxTransport: T(Zb),
            ajax: function(b, c) {
                function d(b, c, d, e) {
                    var f, l, s, t, v, x = c;
                    2 !== u && (u = 2, i && a.clearTimeout(i), k = void 0, h = e || "", w.readyState = b > 0 ? 4 : 0, f = b >= 200 && 300 > b || 304 === b, d && (t = W(m, w, d)), t = X(m, t, w, f), f ? (m.ifModified && (v = w.getResponseHeader("Last-Modified"), v && (na.lastModified[g] = v), v = w.getResponseHeader("etag"), v && (na.etag[g] = v)), 204 === b || "HEAD" === m.type ? x = "nocontent" : 304 === b ? x = "notmodified" : (x = t.state, l = t.data, s = t.error, f = !s)) : (s = x, (b || !x) && (x = "error", 0 > b && (b = 0))), w.status = b, w.statusText = (c || x) + "", f ? p.resolveWith(n, [l, x, w]) : p.rejectWith(n, [w, x, s]), w.statusCode(r), r = void 0, j && o.trigger(f ? "ajaxSuccess" : "ajaxError", [w, m, f ? l : s]), q.fireWith(n, [w, x]), j && (o.trigger("ajaxComplete", [w, m]), --na.active || na.event.trigger("ajaxStop")))
                }
                "object" == typeof b && (c = b, b = void 0), c = c || {};
                var e, f, g, h, i, j, k, l, m = na.ajaxSetup({}, c),
                    n = m.context || m,
                    o = m.context && (n.nodeType || n.jquery) ? na(n) : na.event,
                    p = na.Deferred(),
                    q = na.Callbacks("once memory"),
                    r = m.statusCode || {},
                    s = {},
                    t = {},
                    u = 0,
                    v = "canceled",
                    w = {
                        readyState: 0,
                        getResponseHeader: function(a) {
                            var b;
                            if (2 === u) {
                                if (!l)
                                    for (l = {}; b = Tb.exec(h);) l[b[1].toLowerCase()] = b[2];
                                b = l[a.toLowerCase()]
                            }
                            return null == b ? null : b
                        },
                        getAllResponseHeaders: function() {
                            return 2 === u ? h : null
                        },
                        setRequestHeader: function(a, b) {
                            var c = a.toLowerCase();
                            return u || (a = t[c] = t[c] || a, s[a] = b), this
                        },
                        overrideMimeType: function(a) {
                            return u || (m.mimeType = a), this
                        },
                        statusCode: function(a) {
                            var b;
                            if (a)
                                if (2 > u)
                                    for (b in a) r[b] = [r[b], a[b]];
                                else w.always(a[w.status]);
                            return this
                        },
                        abort: function(a) {
                            var b = a || v;
                            return k && k.abort(b), d(0, b), this
                        }
                    };
                if (p.promise(w).complete = q.add, w.success = w.done, w.error = w.fail, m.url = ((b || m.url || _b) + "").replace(Rb, "").replace(Wb, ac[1] + "//"), m.type = c.method || c.type || m.method || m.type, m.dataTypes = na.trim(m.dataType || "*").toLowerCase().match(Da) || [""], null == m.crossDomain && (e = Xb.exec(m.url.toLowerCase()), m.crossDomain = !(!e || e[1] === ac[1] && e[2] === ac[2] && (e[3] || ("http:" === e[1] ? "80" : "443")) === (ac[3] || ("http:" === ac[1] ? "80" : "443")))), m.data && m.processData && "string" != typeof m.data && (m.data = na.param(m.data, m.traditional)), U(Yb, m, c, w), 2 === u) return w;
                j = na.event && m.global, j && 0 === na.active++ && na.event.trigger("ajaxStart"), m.type = m.type.toUpperCase(), m.hasContent = !Vb.test(m.type), g = m.url, m.hasContent || (m.data && (g = m.url += (Pb.test(g) ? "&" : "?") + m.data, delete m.data), m.cache === !1 && (m.url = Sb.test(g) ? g.replace(Sb, "$1_=" + Ob++) : g + (Pb.test(g) ? "&" : "?") + "_=" + Ob++)), m.ifModified && (na.lastModified[g] && w.setRequestHeader("If-Modified-Since", na.lastModified[g]), na.etag[g] && w.setRequestHeader("If-None-Match", na.etag[g])), (m.data && m.hasContent && m.contentType !== !1 || c.contentType) && w.setRequestHeader("Content-Type", m.contentType), w.setRequestHeader("Accept", m.dataTypes[0] && m.accepts[m.dataTypes[0]] ? m.accepts[m.dataTypes[0]] + ("*" !== m.dataTypes[0] ? ", " + $b + "; q=0.01" : "") : m.accepts["*"]);
                for (f in m.headers) w.setRequestHeader(f, m.headers[f]);
                if (m.beforeSend && (m.beforeSend.call(n, w, m) === !1 || 2 === u)) return w.abort();
                v = "abort";
                for (f in {
                        success: 1,
                        error: 1,
                        complete: 1
                    }) w[f](m[f]);
                if (k = U(Zb, m, c, w)) {
                    if (w.readyState = 1, j && o.trigger("ajaxSend", [w, m]), 2 === u) return w;
                    m.async && m.timeout > 0 && (i = a.setTimeout(function() {
                        w.abort("timeout")
                    }, m.timeout));
                    try {
                        u = 1, k.send(s, d)
                    } catch (x) {
                        if (!(2 > u)) throw x;
                        d(-1, x)
                    }
                } else d(-1, "No Transport");
                return w
            },
            getJSON: function(a, b, c) {
                return na.get(a, b, c, "json")
            },
            getScript: function(a, b) {
                return na.get(a, void 0, b, "script")
            }
        }), na.each(["get", "post"], function(a, b) {
            na[b] = function(a, c, d, e) {
                return na.isFunction(c) && (e = e || d, d = c, c = void 0), na.ajax(na.extend({
                    url: a,
                    type: b,
                    dataType: e,
                    data: c,
                    success: d
                }, na.isPlainObject(a) && a))
            }
        }), na._evalUrl = function(a) {
            return na.ajax({
                url: a,
                type: "GET",
                dataType: "script",
                cache: !0,
                async: !1,
                global: !1,
                "throws": !0
            })
        }, na.fn.extend({
            wrapAll: function(a) {
                if (na.isFunction(a)) return this.each(function(b) {
                    na(this).wrapAll(a.call(this, b))
                });
                if (this[0]) {
                    var b = na(a, this[0].ownerDocument).eq(0).clone(!0);
                    this[0].parentNode && b.insertBefore(this[0]), b.map(function() {
                        for (var a = this; a.firstChild && 1 === a.firstChild.nodeType;) a = a.firstChild;
                        return a
                    }).append(this)
                }
                return this
            },
            wrapInner: function(a) {
                return this.each(na.isFunction(a) ? function(b) {
                    na(this).wrapInner(a.call(this, b))
                } : function() {
                    var b = na(this),
                        c = b.contents();
                    c.length ? c.wrapAll(a) : b.append(a)
                })
            },
            wrap: function(a) {
                var b = na.isFunction(a);
                return this.each(function(c) {
                    na(this).wrapAll(b ? a.call(this, c) : a)
                })
            },
            unwrap: function() {
                return this.parent().each(function() {
                    na.nodeName(this, "body") || na(this).replaceWith(this.childNodes)
                }).end()
            }
        }), na.expr.filters.hidden = function(a) {
            return la.reliableHiddenOffsets() ? a.offsetWidth <= 0 && a.offsetHeight <= 0 && !a.getClientRects().length : Z(a)
        }, na.expr.filters.visible = function(a) {
            return !na.expr.filters.hidden(a)
        };
        var bc = /%20/g,
            cc = /\[\]$/,
            dc = /\r?\n/g,
            ec = /^(?:submit|button|image|reset|file)$/i,
            fc = /^(?:input|select|textarea|keygen)/i;
        na.param = function(a, b) {
            var c, d = [],
                e = function(a, b) {
                    b = na.isFunction(b) ? b() : null == b ? "" : b, d[d.length] = encodeURIComponent(a) + "=" + encodeURIComponent(b)
                };
            if (void 0 === b && (b = na.ajaxSettings && na.ajaxSettings.traditional), na.isArray(a) || a.jquery && !na.isPlainObject(a)) na.each(a, function() {
                e(this.name, this.value)
            });
            else
                for (c in a) $(c, a[c], b, e);
            return d.join("&").replace(bc, "+")
        }, na.fn.extend({
            serialize: function() {
                return na.param(this.serializeArray())
            },
            serializeArray: function() {
                return this.map(function() {
                    var a = na.prop(this, "elements");
                    return a ? na.makeArray(a) : this
                }).filter(function() {
                    var a = this.type;
                    return this.name && !na(this).is(":disabled") && fc.test(this.nodeName) && !ec.test(a) && (this.checked || !Oa.test(a))
                }).map(function(a, b) {
                    var c = na(this).val();
                    return null == c ? null : na.isArray(c) ? na.map(c, function(a) {
                        return {
                            name: b.name,
                            value: a.replace(dc, "\r\n")
                        }
                    }) : {
                        name: b.name,
                        value: c.replace(dc, "\r\n")
                    }
                }).get()
            }
        }), na.ajaxSettings.xhr = void 0 !== a.ActiveXObject ? function() {
            return this.isLocal ? aa() : da.documentMode > 8 ? _() : /^(get|post|head|put|delete|options)$/i.test(this.type) && _() || aa()
        } : _;
        var gc = 0,
            hc = {},
            ic = na.ajaxSettings.xhr();
        a.attachEvent && a.attachEvent("onunload", function() {
            for (var a in hc) hc[a](void 0, !0)
        }), la.cors = !!ic && "withCredentials" in ic, ic = la.ajax = !!ic, ic && na.ajaxTransport(function(b) {
            if (!b.crossDomain || la.cors) {
                var c;
                return {
                    send: function(d, e) {
                        var f, g = b.xhr(),
                            h = ++gc;
                        if (g.open(b.type, b.url, b.async, b.username, b.password), b.xhrFields)
                            for (f in b.xhrFields) g[f] = b.xhrFields[f];
                        b.mimeType && g.overrideMimeType && g.overrideMimeType(b.mimeType), b.crossDomain || d["X-Requested-With"] || (d["X-Requested-With"] = "XMLHttpRequest");
                        for (f in d) void 0 !== d[f] && g.setRequestHeader(f, d[f] + "");
                        g.send(b.hasContent && b.data || null), c = function(a, d) {
                            var f, i, j;
                            if (c && (d || 4 === g.readyState))
                                if (delete hc[h], c = void 0, g.onreadystatechange = na.noop, d) 4 !== g.readyState && g.abort();
                                else {
                                    j = {}, f = g.status, "string" == typeof g.responseText && (j.text = g.responseText);
                                    try {
                                        i = g.statusText
                                    } catch (k) {
                                        i = ""
                                    }
                                    f || !b.isLocal || b.crossDomain ? 1223 === f && (f = 204) : f = j.text ? 200 : 404
                                }
                            j && e(f, i, j, g.getAllResponseHeaders())
                        }, b.async ? 4 === g.readyState ? a.setTimeout(c) : g.onreadystatechange = hc[h] = c : c()
                    },
                    abort: function() {
                        c && c(void 0, !0)
                    }
                }
            }
        }), na.ajaxPrefilter(function(a) {
            a.crossDomain && (a.contents.script = !1)
        }), na.ajaxSetup({
            accepts: {
                script: "text/javascript, application/javascript, application/ecmascript, application/x-ecmascript"
            },
            contents: {
                script: /\b(?:java|ecma)script\b/
            },
            converters: {
                "text script": function(a) {
                    return na.globalEval(a), a
                }
            }
        }), na.ajaxPrefilter("script", function(a) {
            void 0 === a.cache && (a.cache = !1), a.crossDomain && (a.type = "GET", a.global = !1)
        }), na.ajaxTransport("script", function(a) {
            if (a.crossDomain) {
                var b, c = da.head || na("head")[0] || da.documentElement;
                return {
                    send: function(d, e) {
                        b = da.createElement("script"), b.async = !0, a.scriptCharset && (b.charset = a.scriptCharset), b.src = a.url, b.onload = b.onreadystatechange = function(a, c) {
                            (c || !b.readyState || /loaded|complete/.test(b.readyState)) && (b.onload = b.onreadystatechange = null, b.parentNode && b.parentNode.removeChild(b), b = null, c || e(200, "success"))
                        }, c.insertBefore(b, c.firstChild)
                    },
                    abort: function() {
                        b && b.onload(void 0, !0)
                    }
                }
            }
        });
        var jc = [],
            kc = /(=)\?(?=&|$)|\?\?/;
        na.ajaxSetup({
            jsonp: "callback",
            jsonpCallback: function() {
                var a = jc.pop() || na.expando + "_" + Ob++;
                return this[a] = !0, a
            }
        }), na.ajaxPrefilter("json jsonp", function(b, c, d) {
            var e, f, g, h = b.jsonp !== !1 && (kc.test(b.url) ? "url" : "string" == typeof b.data && 0 === (b.contentType || "").indexOf("application/x-www-form-urlencoded") && kc.test(b.data) && "data");
            return h || "jsonp" === b.dataTypes[0] ? (e = b.jsonpCallback = na.isFunction(b.jsonpCallback) ? b.jsonpCallback() : b.jsonpCallback, h ? b[h] = b[h].replace(kc, "$1" + e) : b.jsonp !== !1 && (b.url += (Pb.test(b.url) ? "&" : "?") + b.jsonp + "=" + e), b.converters["script json"] = function() {
                return g || na.error(e + " was not called"), g[0]
            }, b.dataTypes[0] = "json", f = a[e], a[e] = function() {
                g = arguments
            }, d.always(function() {
                void 0 === f ? na(a).removeProp(e) : a[e] = f, b[e] && (b.jsonpCallback = c.jsonpCallback, jc.push(e)), g && na.isFunction(f) && f(g[0]), g = f = void 0
            }), "script") : void 0
        }), la.createHTMLDocument = function() {
            if (!da.implementation.createHTMLDocument) return !1;
            var a = da.implementation.createHTMLDocument("");
            return a.body.innerHTML = "<form></form><form></form>", 2 === a.body.childNodes.length
        }(), na.parseHTML = function(a, b, c) {
            if (!a || "string" != typeof a) return null;
            "boolean" == typeof b && (c = b, b = !1), b = b || (la.createHTMLDocument ? da.implementation.createHTMLDocument("") : da);
            var d = wa.exec(a),
                e = !c && [];
            return d ? [b.createElement(d[1])] : (d = r([a], b, e), e && e.length && na(e).remove(), na.merge([], d.childNodes))
        };
        var lc = na.fn.load;
        na.fn.load = function(a, b, c) {
            if ("string" != typeof a && lc) return lc.apply(this, arguments);
            var d, e, f, g = this,
                h = a.indexOf(" ");
            return h > -1 && (d = na.trim(a.slice(h, a.length)), a = a.slice(0, h)), na.isFunction(b) ? (c = b, b = void 0) : b && "object" == typeof b && (e = "POST"), g.length > 0 && na.ajax({
                url: a,
                type: e || "GET",
                dataType: "html",
                data: b
            }).done(function(a) {
                f = arguments, g.html(d ? na("<div>").append(na.parseHTML(a)).find(d) : a)
            }).always(c && function(a, b) {
                g.each(function() {
                    c.apply(g, f || [a.responseText, b, a])
                })
            }), this
        }, na.each(["ajaxStart", "ajaxStop", "ajaxComplete", "ajaxError", "ajaxSuccess", "ajaxSend"], function(a, b) {
            na.fn[b] = function(a) {
                return this.on(b, a)
            }
        }), na.expr.filters.animated = function(a) {
            return na.grep(na.timers, function(b) {
                return a === b.elem
            }).length
        }, na.offset = {
            setOffset: function(a, b, c) {
                var d, e, f, g, h, i, j, k = na.css(a, "position"),
                    l = na(a),
                    m = {};
                "static" === k && (a.style.position = "relative"), h = l.offset(), f = na.css(a, "top"), i = na.css(a, "left"), j = ("absolute" === k || "fixed" === k) && na.inArray("auto", [f, i]) > -1, j ? (d = l.position(), g = d.top, e = d.left) : (g = parseFloat(f) || 0, e = parseFloat(i) || 0), na.isFunction(b) && (b = b.call(a, c, na.extend({}, h))), null != b.top && (m.top = b.top - h.top + g), null != b.left && (m.left = b.left - h.left + e), "using" in b ? b.using.call(a, m) : l.css(m)
            }
        }, na.fn.extend({
            offset: function(a) {
                if (arguments.length) return void 0 === a ? this : this.each(function(b) {
                    na.offset.setOffset(this, a, b)
                });
                var b, c, d = {
                        top: 0,
                        left: 0
                    },
                    e = this[0],
                    f = e && e.ownerDocument;
                if (f) return b = f.documentElement, na.contains(b, e) ? ("undefined" != typeof e.getBoundingClientRect && (d = e.getBoundingClientRect()), c = ba(f), {
                    top: d.top + (c.pageYOffset || b.scrollTop) - (b.clientTop || 0),
                    left: d.left + (c.pageXOffset || b.scrollLeft) - (b.clientLeft || 0)
                }) : d
            },
            position: function() {
                if (this[0]) {
                    var a, b, c = {
                            top: 0,
                            left: 0
                        },
                        d = this[0];
                    return "fixed" === na.css(d, "position") ? b = d.getBoundingClientRect() : (a = this.offsetParent(), b = this.offset(), na.nodeName(a[0], "html") || (c = a.offset()), c.top += na.css(a[0], "borderTopWidth", !0) - a.scrollTop(), c.left += na.css(a[0], "borderLeftWidth", !0) - a.scrollLeft()), {
                        top: b.top - c.top - na.css(d, "marginTop", !0),
                        left: b.left - c.left - na.css(d, "marginLeft", !0)
                    }
                }
            },
            offsetParent: function() {
                return this.map(function() {
                    for (var a = this.offsetParent; a && !na.nodeName(a, "html") && "static" === na.css(a, "position");) a = a.offsetParent;
                    return a || nb
                })
            }
        }), na.each({
            scrollLeft: "pageXOffset",
            scrollTop: "pageYOffset"
        }, function(a, b) {
            var c = /Y/.test(b);
            na.fn[a] = function(d) {
                return Na(this, function(a, d, e) {
                    var f = ba(a);
                    return void 0 === e ? f ? b in f ? f[b] : f.document.documentElement[d] : a[d] : void(f ? f.scrollTo(c ? na(f).scrollLeft() : e, c ? e : na(f).scrollTop()) : a[d] = e)
                }, a, d, arguments.length, null)
            }
        }), na.each(["top", "left"], function(a, b) {
            na.cssHooks[b] = F(la.pixelPosition, function(a, c) {
                return c ? (c = pb(a, b), lb.test(c) ? na(a).position()[b] + "px" : c) : void 0
            })
        }), na.each({
            Height: "height",
            Width: "width"
        }, function(a, b) {
            na.each({
                padding: "inner" + a,
                content: b,
                "": "outer" + a
            }, function(c, d) {
                na.fn[d] = function(d, e) {
                    var f = arguments.length && (c || "boolean" != typeof d),
                        g = c || (d === !0 || e === !0 ? "margin" : "border");
                    return Na(this, function(b, c, d) {
                        var e;
                        return na.isWindow(b) ? b.document.documentElement["client" + a] : 9 === b.nodeType ? (e = b.documentElement, Math.max(b.body["scroll" + a], e["scroll" + a], b.body["offset" + a], e["offset" + a], e["client" + a])) : void 0 === d ? na.css(b, c, g) : na.style(b, c, d, g)
                    }, b, f ? d : void 0, f, null)
                }
            })
        }), na.fn.extend({
            bind: function(a, b, c) {
                return this.on(a, null, b, c)
            },
            unbind: function(a, b) {
                return this.off(a, null, b)
            },
            delegate: function(a, b, c, d) {
                return this.on(b, a, c, d)
            },
            undelegate: function(a, b, c) {
                return 1 === arguments.length ? this.off(a, "**") : this.off(b, a || "**", c)
            }
        }), na.fn.size = function() {
            return this.length
        }, na.fn.andSelf = na.fn.addBack, "function" == typeof define && define.amd && define("jquery", [], function() {
            return na
        });
        var mc = a.jQuery,
            nc = a.$;
        return na.noConflict = function(b) {
            return a.$ === na && (a.$ = nc), b && a.jQuery === na && (a.jQuery = mc), na
        }, b || (a.jQuery = a.$ = na), na
    }), function(a, b, c) {
        function d(c) {
            var d = b.console;
            f[c] || (f[c] = !0, a.migrateWarnings.push(c), d && d.warn && !a.migrateMute && (d.warn("JQMIGRATE: " + c), a.migrateTrace && d.trace && d.trace()))
        }

        function e(b, c, e, f) {
            if (Object.defineProperty) try {
                return void Object.defineProperty(b, c, {
                    configurable: !0,
                    enumerable: !0,
                    get: function() {
                        return d(f), e
                    },
                    set: function(a) {
                        d(f), e = a
                    }
                })
            } catch (g) {}
            a._definePropertyBroken = !0, b[c] = e
        }
        a.migrateVersion = "1.3.0";
        var f = {};
        a.migrateWarnings = [], a.migrateMute = !0, !a.migrateMute && b.console && b.console.log && b.console.log("JQMIGRATE: Logging is active"), a.migrateTrace === c && (a.migrateTrace = !1), a.migrateReset = function() {
            f = {}, a.migrateWarnings.length = 0
        }, "BackCompat" === document.compatMode && d("jQuery is not compatible with Quirks Mode");
        var g = a("<input/>", {
                size: 1
            }).attr("size") && a.attrFn,
            h = a.attr,
            i = a.attrHooks.value && a.attrHooks.value.get || function() {
                return null
            },
            j = a.attrHooks.value && a.attrHooks.value.set || function() {
                return c
            },
            k = /^(?:input|button)$/i,
            l = /^[238]$/,
            m = /^(?:autofocus|autoplay|async|checked|controls|defer|disabled|hidden|loop|multiple|open|readonly|required|scoped|selected)$/i,
            n = /^(?:checked|selected)$/i;
        e(a, "attrFn", g || {}, "jQuery.attrFn is deprecated"), a.attr = function(b, e, f, i) {
            var j = e.toLowerCase(),
                o = b && b.nodeType;
            return i && (h.length < 4 && d("jQuery.fn.attr( props, pass ) is deprecated"), b && !l.test(o) && (g ? e in g : a.isFunction(a.fn[e]))) ? a(b)[e](f) : ("type" === e && f !== c && k.test(b.nodeName) && b.parentNode && d("Can't change the 'type' of an input or button in IE 6/7/8"), !a.attrHooks[j] && m.test(j) && (a.attrHooks[j] = {
                get: function(b, d) {
                    var e, f = a.prop(b, d);
                    return f === !0 || "boolean" != typeof f && (e = b.getAttributeNode(d)) && e.nodeValue !== !1 ? d.toLowerCase() : c
                },
                set: function(b, c, d) {
                    var e;
                    return c === !1 ? a.removeAttr(b, d) : (e = a.propFix[d] || d, e in b && (b[e] = !0), b.setAttribute(d, d.toLowerCase())), d
                }
            }, n.test(j) && d("jQuery.fn.attr('" + j + "') might use property instead of attribute")), h.call(a, b, e, f))
        }, a.attrHooks.value = {
            get: function(a, b) {
                var c = (a.nodeName || "").toLowerCase();
                return "button" === c ? i.apply(this, arguments) : ("input" !== c && "option" !== c && d("jQuery.fn.attr('value') no longer gets properties"), b in a ? a.value : null)
            },
            set: function(a, b) {
                var c = (a.nodeName || "").toLowerCase();
                return "button" === c ? j.apply(this, arguments) : ("input" !== c && "option" !== c && d("jQuery.fn.attr('value', val) no longer sets properties"), void(a.value = b))
            }
        };
        var o, p, q = a.fn.init,
            r = a.parseJSON,
            s = /^\s*</,
            t = /^([^<]*)(<[\w\W]+>)([^>]*)$/;
        a.fn.init = function(b, e, f) {
            var g, h;
            return b && "string" == typeof b && !a.isPlainObject(e) && (g = t.exec(a.trim(b))) && g[0] && (s.test(b) || d("$(html) HTML strings must start with '<' character"), g[3] && d("$(html) HTML text after last tag is ignored"), "#" === g[0].charAt(0) && (d("HTML string cannot start with a '#' character"), a.error("JQMIGRATE: Invalid selector string (XSS)")), e && e.context && (e = e.context), a.parseHTML) ? q.call(this, a.parseHTML(g[2], e && e.ownerDocument || e || document, !0), e, f) : ("#" === b && (d("jQuery( '#' ) is not a valid selector"), b = []), h = q.apply(this, arguments), b && b.selector !== c ? (h.selector = b.selector, h.context = b.context) : (h.selector = "string" == typeof b ? b : "", b && (h.context = b.nodeType ? b : e || document)), h)
        }, a.fn.init.prototype = a.fn, a.parseJSON = function(a) {
            return a ? r.apply(this, arguments) : (d("jQuery.parseJSON requires a valid JSON string"), null)
        }, a.uaMatch = function(a) {
            a = a.toLowerCase();
            var b = /(chrome)[ \/]([\w.]+)/.exec(a) || /(webkit)[ \/]([\w.]+)/.exec(a) || /(opera)(?:.*version|)[ \/]([\w.]+)/.exec(a) || /(msie) ([\w.]+)/.exec(a) || a.indexOf("compatible") < 0 && /(mozilla)(?:.*? rv:([\w.]+)|)/.exec(a) || [];
            return {
                browser: b[1] || "",
                version: b[2] || "0"
            }
        }, a.browser || (o = a.uaMatch(navigator.userAgent), p = {}, o.browser && (p[o.browser] = !0, p.version = o.version), p.chrome ? p.webkit = !0 : p.webkit && (p.safari = !0), a.browser = p), e(a, "browser", a.browser, "jQuery.browser is deprecated"), a.boxModel = a.support.boxModel = "CSS1Compat" === document.compatMode, e(a, "boxModel", a.boxModel, "jQuery.boxModel is deprecated"), e(a.support, "boxModel", a.support.boxModel, "jQuery.support.boxModel is deprecated"), a.sub = function() {
            function b(a, c) {
                return new b.fn.init(a, c)
            }
            a.extend(!0, b, this), b.superclass = this, b.fn = b.prototype = this(), b.fn.constructor = b, b.sub = this.sub, b.fn.init = function(d, e) {
                var f = a.fn.init.call(this, d, e, c);
                return f instanceof b ? f : b(f)
            }, b.fn.init.prototype = b.fn;
            var c = b(document);
            return d("jQuery.sub() is deprecated"), b
        }, a.fn.size = function() {
            return d("jQuery.fn.size() is deprecated; use the .length property"), this.length
        };
        var u = !1;
        a.swap && a.each(["height", "width", "reliableMarginRight"], function(b, c) {
            var d = a.cssHooks[c] && a.cssHooks[c].get;
            d && (a.cssHooks[c].get = function() {
                var a;
                return u = !0, a = d.apply(this, arguments), u = !1, a
            })
        }), a.swap = function(a, b, c, e) {
            var f, g, h = {};
            u || d("jQuery.swap() is undocumented and deprecated");
            for (g in b) h[g] = a.style[g], a.style[g] = b[g];
            f = c.apply(a, e || []);
            for (g in b) a.style[g] = h[g];
            return f
        }, a.ajaxSetup({
            converters: {
                "text json": a.parseJSON
            }
        });
        var v = a.fn.data;
        a.fn.data = function(b) {
            var e, f, g = this[0];
            return !g || "events" !== b || 1 !== arguments.length || (e = a.data(g, b), f = a._data(g, b), e !== c && e !== f || f === c) ? v.apply(this, arguments) : (d("Use of jQuery.fn.data('events') is deprecated"), f)
        };
        var w = /\/(java|ecma)script/i;
        a.clean || (a.clean = function(b, c, e, f) {
            c = c || document, c = !c.nodeType && c[0] || c, c = c.ownerDocument || c, d("jQuery.clean() is deprecated");
            var g, h, i, j, k = [];
            if (a.merge(k, a.buildFragment(b, c).childNodes), e)
                for (i = function(a) {
                        return !a.type || w.test(a.type) ? f ? f.push(a.parentNode ? a.parentNode.removeChild(a) : a) : e.appendChild(a) : void 0
                    }, g = 0; null != (h = k[g]); g++) a.nodeName(h, "script") && i(h) || (e.appendChild(h), "undefined" != typeof h.getElementsByTagName && (j = a.grep(a.merge([], h.getElementsByTagName("script")), i), k.splice.apply(k, [g + 1, 0].concat(j)), g += j.length));
            return k
        });
        var x = a.event.add,
            y = a.event.remove,
            z = a.event.trigger,
            A = a.fn.toggle,
            B = a.fn.live,
            C = a.fn.die,
            D = a.fn.load,
            E = "ajaxStart|ajaxStop|ajaxSend|ajaxComplete|ajaxError|ajaxSuccess",
            F = new RegExp("\\b(?:" + E + ")\\b"),
            G = /(?:^|\s)hover(\.\S+|)\b/,
            H = function(b) {
                return "string" != typeof b || a.event.special.hover ? b : (G.test(b) && d("'hover' pseudo-event is deprecated, use 'mouseenter mouseleave'"), b && b.replace(G, "mouseenter$1 mouseleave$1"))
            };
        a.event.props && "attrChange" !== a.event.props[0] && a.event.props.unshift("attrChange", "attrName", "relatedNode", "srcElement"), a.event.dispatch && e(a.event, "handle", a.event.dispatch, "jQuery.event.handle is undocumented and deprecated"), a.event.add = function(a, b, c, e, f) {
            a !== document && F.test(b) && d("AJAX events should be attached to document: " + b), x.call(this, a, H(b || ""), c, e, f)
        }, a.event.remove = function(a, b, c, d, e) {
            y.call(this, a, H(b) || "", c, d, e)
        }, a.each(["load", "unload", "error"], function(b, c) {
            a.fn[c] = function() {
                var a = Array.prototype.slice.call(arguments, 0);
                return d("jQuery.fn." + c + "() is deprecated"), "load" === c && "string" == typeof arguments[0] ? D.apply(this, arguments) : (a.splice(0, 0, c), arguments.length ? this.bind.apply(this, a) : (this.triggerHandler.apply(this, a), this))
            }
        }), a.fn.toggle = function(b, c) {
            if (!a.isFunction(b) || !a.isFunction(c)) return A.apply(this, arguments);
            d("jQuery.fn.toggle(handler, handler...) is deprecated");
            var e = arguments,
                f = b.guid || a.guid++,
                g = 0,
                h = function(c) {
                    var d = (a._data(this, "lastToggle" + b.guid) || 0) % g;
                    return a._data(this, "lastToggle" + b.guid, d + 1), c.preventDefault(), e[d].apply(this, arguments) || !1
                };
            for (h.guid = f; g < e.length;) e[g++].guid = f;
            return this.click(h)
        }, a.fn.live = function(b, c, e) {
            return d("jQuery.fn.live() is deprecated"), B ? B.apply(this, arguments) : (a(this.context).on(b, this.selector, c, e), this)
        }, a.fn.die = function(b, c) {
            return d("jQuery.fn.die() is deprecated"), C ? C.apply(this, arguments) : (a(this.context).off(b, this.selector || "**", c), this)
        }, a.event.trigger = function(a, b, c, e) {
            return c || F.test(a) || d("Global events are undocumented and deprecated"), z.call(this, a, b, c || document, e)
        }, a.each(E.split("|"), function(b, c) {
            a.event.special[c] = {
                setup: function() {
                    var b = this;
                    return b !== document && (a.event.add(document, c + "." + a.guid, function() {
                        a.event.trigger(c, Array.prototype.slice.call(arguments, 1), b, !0)
                    }), a._data(this, c, a.guid++)), !1
                },
                teardown: function() {
                    return this !== document && a.event.remove(document, c + "." + a._data(this, c)), !1
                }
            }
        }), a.event.special.ready = {
            setup: function() {
                d("'ready' event is deprecated")
            }
        };
        var I = a.fn.andSelf || a.fn.addBack,
            J = a.fn.find;
        if (a.fn.andSelf = function() {
                return d("jQuery.fn.andSelf() replaced by jQuery.fn.addBack()"), I.apply(this, arguments)
            }, a.fn.find = function(a) {
                var b = J.apply(this, arguments);
                return b.context = this.context, b.selector = this.selector ? this.selector + " " + a : a, b
            }, a.Callbacks) {
            var K = a.Deferred,
                L = [
                    ["resolve", "done", a.Callbacks("once memory"), a.Callbacks("once memory"), "resolved"],
                    ["reject", "fail", a.Callbacks("once memory"), a.Callbacks("once memory"), "rejected"],
                    ["notify", "progress", a.Callbacks("memory"), a.Callbacks("memory")]
                ];
            a.Deferred = function(b) {
                var c = K(),
                    e = c.promise();
                return c.pipe = e.pipe = function() {
                    var b = arguments;
                    return d("deferred.pipe() is deprecated"), a.Deferred(function(d) {
                        a.each(L, function(f, g) {
                            var h = a.isFunction(b[f]) && b[f];
                            c[g[1]](function() {
                                var b = h && h.apply(this, arguments);
                                b && a.isFunction(b.promise) ? b.promise().done(d.resolve).fail(d.reject).progress(d.notify) : d[g[0] + "With"](this === e ? d.promise() : this, h ? [b] : arguments)
                            })
                        }), b = null
                    }).promise()
                }, c.isResolved = function() {
                    return d("deferred.isResolved is deprecated"), "resolved" === c.state()
                }, c.isRejected = function() {
                    return d("deferred.isRejected is deprecated"), "rejected" === c.state()
                }, b && b.call(c, c), c
            }
        }
    }(jQuery, window), function(a) {
        "function" == typeof define && define.amd ? define(["jquery"], a) : a(jQuery)
    }(function(a) {
        function b(b, d) {
            var e, f, g, h = b.nodeName.toLowerCase();
            return "area" === h ? (e = b.parentNode, f = e.name, b.href && f && "map" === e.nodeName.toLowerCase() ? (g = a("img[usemap='#" + f + "']")[0], !!g && c(g)) : !1) : (/^(input|select|textarea|button|object)$/.test(h) ? !b.disabled : "a" === h ? b.href || d : d) && c(b)
        }

        function c(b) {
            return a.expr.filters.visible(b) && !a(b).parents().addBack().filter(function() {
                return "hidden" === a.css(this, "visibility")
            }).length
        }

        function d(a) {
            for (var b, c; a.length && a[0] !== document;) {
                if (b = a.css("position"), ("absolute" === b || "relative" === b || "fixed" === b) && (c = parseInt(a.css("zIndex"), 10), !isNaN(c) && 0 !== c)) return c;
                a = a.parent()
            }
            return 0
        }

        function e() {
            this._curInst = null, this._keyEvent = !1, this._disabledInputs = [], this._datepickerShowing = !1, this._inDialog = !1, this._mainDivId = "ui-datepicker-div", this._inlineClass = "ui-datepicker-inline", this._appendClass = "ui-datepicker-append", this._triggerClass = "ui-datepicker-trigger", this._dialogClass = "ui-datepicker-dialog", this._disableClass = "ui-datepicker-disabled", this._unselectableClass = "ui-datepicker-unselectable", this._currentClass = "ui-datepicker-current-day", this._dayOverClass = "ui-datepicker-days-cell-over", this.regional = [], this.regional[""] = {
                closeText: "Done",
                prevText: "Prev",
                nextText: "Next",
                currentText: "Today",
                monthNames: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
                monthNamesShort: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
                dayNames: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
                dayNamesShort: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
                dayNamesMin: ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"],
                weekHeader: "Wk",
                dateFormat: "mm/dd/yy",
                firstDay: 0,
                isRTL: !1,
                showMonthAfterYear: !1,
                yearSuffix: ""
            }, this._defaults = {
                showOn: "focus",
                showAnim: "fadeIn",
                showOptions: {},
                defaultDate: null,
                appendText: "",
                buttonText: "...",
                buttonImage: "",
                buttonImageOnly: !1,
                hideIfNoPrevNext: !1,
                navigationAsDateFormat: !1,
                gotoCurrent: !1,
                changeMonth: !1,
                changeYear: !1,
                yearRange: "c-10:c+10",
                showOtherMonths: !1,
                selectOtherMonths: !1,
                showWeek: !1,
                calculateWeek: this.iso8601Week,
                shortYearCutoff: "+10",
                minDate: null,
                maxDate: null,
                duration: "fast",
                beforeShowDay: null,
                beforeShow: null,
                onSelect: null,
                onChangeMonthYear: null,
                onClose: null,
                numberOfMonths: 1,
                showCurrentAtPos: 0,
                stepMonths: 1,
                stepBigMonths: 12,
                altField: "",
                altFormat: "",
                constrainInput: !0,
                showButtonPanel: !1,
                autoSize: !1,
                disabled: !1
            }, a.extend(this._defaults, this.regional[""]), this.regional.en = a.extend(!0, {}, this.regional[""]), this.regional["en-US"] = a.extend(!0, {}, this.regional.en), this.dpDiv = f(a("<div id='" + this._mainDivId + "' class='ui-datepicker ui-widget ui-widget-content ui-helper-clearfix ui-corner-all'></div>"))
        }

        function f(b) {
            var c = "button, .ui-datepicker-prev, .ui-datepicker-next, .ui-datepicker-calendar td a";
            return b.delegate(c, "mouseout", function() {
                a(this).removeClass("ui-state-hover"), -1 !== this.className.indexOf("ui-datepicker-prev") && a(this).removeClass("ui-datepicker-prev-hover"), -1 !== this.className.indexOf("ui-datepicker-next") && a(this).removeClass("ui-datepicker-next-hover")
            }).delegate(c, "mouseover", g)
        }

        function g() {
            a.datepicker._isDisabledDatepicker(l.inline ? l.dpDiv.parent()[0] : l.input[0]) || (a(this).parents(".ui-datepicker-calendar").find("a").removeClass("ui-state-hover"), a(this).addClass("ui-state-hover"), -1 !== this.className.indexOf("ui-datepicker-prev") && a(this).addClass("ui-datepicker-prev-hover"), -1 !== this.className.indexOf("ui-datepicker-next") && a(this).addClass("ui-datepicker-next-hover"))
        }

        function h(b, c) {
            a.extend(b, c);
            for (var d in c) null == c[d] && (b[d] = c[d]);
            return b
        }
        a.ui = a.ui || {}, a.extend(a.ui, {
            version: "1.11.4",
            keyCode: {
                BACKSPACE: 8,
                COMMA: 188,
                DELETE: 46,
                DOWN: 40,
                END: 35,
                ENTER: 13,
                ESCAPE: 27,
                HOME: 36,
                LEFT: 37,
                PAGE_DOWN: 34,
                PAGE_UP: 33,
                PERIOD: 190,
                RIGHT: 39,
                SPACE: 32,
                TAB: 9,
                UP: 38
            }
        }), a.fn.extend({
            scrollParent: function(b) {
                var c = this.css("position"),
                    d = "absolute" === c,
                    e = b ? /(auto|scroll|hidden)/ : /(auto|scroll)/,
                    f = this.parents().filter(function() {
                        var b = a(this);
                        return d && "static" === b.css("position") ? !1 : e.test(b.css("overflow") + b.css("overflow-y") + b.css("overflow-x"))
                    }).eq(0);
                return "fixed" !== c && f.length ? f : a(this[0].ownerDocument || document)
            },
            uniqueId: function() {
                var a = 0;
                return function() {
                    return this.each(function() {
                        this.id || (this.id = "ui-id-" + ++a)
                    })
                }
            }(),
            removeUniqueId: function() {
                return this.each(function() {
                    /^ui-id-\d+$/.test(this.id) && a(this).removeAttr("id")
                })
            }
        }), a.extend(a.expr[":"], {
            data: a.expr.createPseudo ? a.expr.createPseudo(function(b) {
                return function(c) {
                    return !!a.data(c, b)
                }
            }) : function(b, c, d) {
                return !!a.data(b, d[3])
            },
            focusable: function(c) {
                return b(c, !isNaN(a.attr(c, "tabindex")))
            },
            tabbable: function(c) {
                var d = a.attr(c, "tabindex"),
                    e = isNaN(d);

                return (e || d >= 0) && b(c, !e)
            }
        }), a("<a>").outerWidth(1).jquery || a.each(["Width", "Height"], function(b, c) {
            function d(b, c, d, f) {
                return a.each(e, function() {
                    c -= parseFloat(a.css(b, "padding" + this)) || 0, d && (c -= parseFloat(a.css(b, "border" + this + "Width")) || 0), f && (c -= parseFloat(a.css(b, "margin" + this)) || 0)
                }), c
            }
            var e = "Width" === c ? ["Left", "Right"] : ["Top", "Bottom"],
                f = c.toLowerCase(),
                g = {
                    innerWidth: a.fn.innerWidth,
                    innerHeight: a.fn.innerHeight,
                    outerWidth: a.fn.outerWidth,
                    outerHeight: a.fn.outerHeight
                };
            a.fn["inner" + c] = function(b) {
                return void 0 === b ? g["inner" + c].call(this) : this.each(function() {
                    a(this).css(f, d(this, b) + "px")
                })
            }, a.fn["outer" + c] = function(b, e) {
                return "number" != typeof b ? g["outer" + c].call(this, b) : this.each(function() {
                    a(this).css(f, d(this, b, !0, e) + "px")
                })
            }
        }), a.fn.addBack || (a.fn.addBack = function(a) {
            return this.add(null == a ? this.prevObject : this.prevObject.filter(a))
        }), a("<a>").data("a-b", "a").removeData("a-b").data("a-b") && (a.fn.removeData = function(b) {
            return function(c) {
                return arguments.length ? b.call(this, a.camelCase(c)) : b.call(this)
            }
        }(a.fn.removeData)), a.ui.ie = !!/msie [\w.]+/.exec(navigator.userAgent.toLowerCase()), a.fn.extend({
            focus: function(b) {
                return function(c, d) {
                    return "number" == typeof c ? this.each(function() {
                        var b = this;
                        setTimeout(function() {
                            a(b).focus(), d && d.call(b)
                        }, c)
                    }) : b.apply(this, arguments)
                }
            }(a.fn.focus),
            disableSelection: function() {
                var a = "onselectstart" in document.createElement("div") ? "selectstart" : "mousedown";
                return function() {
                    return this.bind(a + ".ui-disableSelection", function(a) {
                        a.preventDefault()
                    })
                }
            }(),
            enableSelection: function() {
                return this.unbind(".ui-disableSelection")
            },
            zIndex: function(b) {
                if (void 0 !== b) return this.css("zIndex", b);
                if (this.length)
                    for (var c, d, e = a(this[0]); e.length && e[0] !== document;) {
                        if (c = e.css("position"), ("absolute" === c || "relative" === c || "fixed" === c) && (d = parseInt(e.css("zIndex"), 10), !isNaN(d) && 0 !== d)) return d;
                        e = e.parent()
                    }
                return 0
            }
        }), a.ui.plugin = {
            add: function(b, c, d) {
                var e, f = a.ui[b].prototype;
                for (e in d) f.plugins[e] = f.plugins[e] || [], f.plugins[e].push([c, d[e]])
            },
            call: function(a, b, c, d) {
                var e, f = a.plugins[b];
                if (f && (d || a.element[0].parentNode && 11 !== a.element[0].parentNode.nodeType))
                    for (e = 0; e < f.length; e++) a.options[f[e][0]] && f[e][1].apply(a.element, c)
            }
        };
        var i = 0,
            j = Array.prototype.slice;
        a.cleanData = function(b) {
            return function(c) {
                var d, e, f;
                for (f = 0; null != (e = c[f]); f++) try {
                    d = a._data(e, "events"), d && d.remove && a(e).triggerHandler("remove")
                } catch (g) {}
                b(c)
            }
        }(a.cleanData), a.widget = function(b, c, d) {
            var e, f, g, h, i = {},
                j = b.split(".")[0];
            return b = b.split(".")[1], e = j + "-" + b, d || (d = c, c = a.Widget), a.expr[":"][e.toLowerCase()] = function(b) {
                return !!a.data(b, e)
            }, a[j] = a[j] || {}, f = a[j][b], g = a[j][b] = function(a, b) {
                return this._createWidget ? void(arguments.length && this._createWidget(a, b)) : new g(a, b)
            }, a.extend(g, f, {
                version: d.version,
                _proto: a.extend({}, d),
                _childConstructors: []
            }), h = new c, h.options = a.widget.extend({}, h.options), a.each(d, function(b, d) {
                return a.isFunction(d) ? void(i[b] = function() {
                    var a = function() {
                            return c.prototype[b].apply(this, arguments)
                        },
                        e = function(a) {
                            return c.prototype[b].apply(this, a)
                        };
                    return function() {
                        var b, c = this._super,
                            f = this._superApply;
                        return this._super = a, this._superApply = e, b = d.apply(this, arguments), this._super = c, this._superApply = f, b
                    }
                }()) : void(i[b] = d)
            }), g.prototype = a.widget.extend(h, {
                widgetEventPrefix: f ? h.widgetEventPrefix || b : b
            }, i, {
                constructor: g,
                namespace: j,
                widgetName: b,
                widgetFullName: e
            }), f ? (a.each(f._childConstructors, function(b, c) {
                var d = c.prototype;
                a.widget(d.namespace + "." + d.widgetName, g, c._proto)
            }), delete f._childConstructors) : c._childConstructors.push(g), a.widget.bridge(b, g), g
        }, a.widget.extend = function(b) {
            for (var c, d, e = j.call(arguments, 1), f = 0, g = e.length; g > f; f++)
                for (c in e[f]) d = e[f][c], e[f].hasOwnProperty(c) && void 0 !== d && (b[c] = a.isPlainObject(d) ? a.isPlainObject(b[c]) ? a.widget.extend({}, b[c], d) : a.widget.extend({}, d) : d);
            return b
        }, a.widget.bridge = function(b, c) {
            var d = c.prototype.widgetFullName || b;
            a.fn[b] = function(e) {
                var f = "string" == typeof e,
                    g = j.call(arguments, 1),
                    h = this;
                return f ? this.each(function() {
                    var c, f = a.data(this, d);
                    return "instance" === e ? (h = f, !1) : f ? a.isFunction(f[e]) && "_" !== e.charAt(0) ? (c = f[e].apply(f, g), c !== f && void 0 !== c ? (h = c && c.jquery ? h.pushStack(c.get()) : c, !1) : void 0) : a.error("no such method '" + e + "' for " + b + " widget instance") : a.error("cannot call methods on " + b + " prior to initialization; attempted to call method '" + e + "'")
                }) : (g.length && (e = a.widget.extend.apply(null, [e].concat(g))), this.each(function() {
                    var b = a.data(this, d);
                    b ? (b.option(e || {}), b._init && b._init()) : a.data(this, d, new c(e, this))
                })), h
            }
        }, a.Widget = function() {}, a.Widget._childConstructors = [], a.Widget.prototype = {
            widgetName: "widget",
            widgetEventPrefix: "",
            defaultElement: "<div>",
            options: {
                disabled: !1,
                create: null
            },
            _createWidget: function(b, c) {
                c = a(c || this.defaultElement || this)[0], this.element = a(c), this.uuid = i++, this.eventNamespace = "." + this.widgetName + this.uuid, this.bindings = a(), this.hoverable = a(), this.focusable = a(), c !== this && (a.data(c, this.widgetFullName, this), this._on(!0, this.element, {
                    remove: function(a) {
                        a.target === c && this.destroy()
                    }
                }), this.document = a(c.style ? c.ownerDocument : c.document || c), this.window = a(this.document[0].defaultView || this.document[0].parentWindow)), this.options = a.widget.extend({}, this.options, this._getCreateOptions(), b), this._create(), this._trigger("create", null, this._getCreateEventData()), this._init()
            },
            _getCreateOptions: a.noop,
            _getCreateEventData: a.noop,
            _create: a.noop,
            _init: a.noop,
            destroy: function() {
                this._destroy(), this.element.unbind(this.eventNamespace).removeData(this.widgetFullName).removeData(a.camelCase(this.widgetFullName)), this.widget().unbind(this.eventNamespace).removeAttr("aria-disabled").removeClass(this.widgetFullName + "-disabled ui-state-disabled"), this.bindings.unbind(this.eventNamespace), this.hoverable.removeClass("ui-state-hover"), this.focusable.removeClass("ui-state-focus")
            },
            _destroy: a.noop,
            widget: function() {
                return this.element
            },
            option: function(b, c) {
                var d, e, f, g = b;
                if (0 === arguments.length) return a.widget.extend({}, this.options);
                if ("string" == typeof b)
                    if (g = {}, d = b.split("."), b = d.shift(), d.length) {
                        for (e = g[b] = a.widget.extend({}, this.options[b]), f = 0; f < d.length - 1; f++) e[d[f]] = e[d[f]] || {}, e = e[d[f]];
                        if (b = d.pop(), 1 === arguments.length) return void 0 === e[b] ? null : e[b];
                        e[b] = c
                    } else {
                        if (1 === arguments.length) return void 0 === this.options[b] ? null : this.options[b];
                        g[b] = c
                    }
                return this._setOptions(g), this
            },
            _setOptions: function(a) {
                var b;
                for (b in a) this._setOption(b, a[b]);
                return this
            },
            _setOption: function(a, b) {
                return this.options[a] = b, "disabled" === a && (this.widget().toggleClass(this.widgetFullName + "-disabled", !!b), b && (this.hoverable.removeClass("ui-state-hover"), this.focusable.removeClass("ui-state-focus"))), this
            },
            enable: function() {
                return this._setOptions({
                    disabled: !1
                })
            },
            disable: function() {
                return this._setOptions({
                    disabled: !0
                })
            },
            _on: function(b, c, d) {
                var e, f = this;
                "boolean" != typeof b && (d = c, c = b, b = !1), d ? (c = e = a(c), this.bindings = this.bindings.add(c)) : (d = c, c = this.element, e = this.widget()), a.each(d, function(d, g) {
                    function h() {
                        return b || f.options.disabled !== !0 && !a(this).hasClass("ui-state-disabled") ? ("string" == typeof g ? f[g] : g).apply(f, arguments) : void 0
                    }
                    "string" != typeof g && (h.guid = g.guid = g.guid || h.guid || a.guid++);
                    var i = d.match(/^([\w:-]*)\s*(.*)$/),
                        j = i[1] + f.eventNamespace,
                        k = i[2];
                    k ? e.delegate(k, j, h) : c.bind(j, h)
                })
            },
            _off: function(b, c) {
                c = (c || "").split(" ").join(this.eventNamespace + " ") + this.eventNamespace, b.unbind(c).undelegate(c), this.bindings = a(this.bindings.not(b).get()), this.focusable = a(this.focusable.not(b).get()), this.hoverable = a(this.hoverable.not(b).get())
            },
            _delay: function(a, b) {
                function c() {
                    return ("string" == typeof a ? d[a] : a).apply(d, arguments)
                }
                var d = this;
                return setTimeout(c, b || 0)
            },
            _hoverable: function(b) {
                this.hoverable = this.hoverable.add(b), this._on(b, {
                    mouseenter: function(b) {
                        a(b.currentTarget).addClass("ui-state-hover")
                    },
                    mouseleave: function(b) {
                        a(b.currentTarget).removeClass("ui-state-hover")
                    }
                })
            },
            _focusable: function(b) {
                this.focusable = this.focusable.add(b), this._on(b, {
                    focusin: function(b) {
                        a(b.currentTarget).addClass("ui-state-focus")
                    },
                    focusout: function(b) {
                        a(b.currentTarget).removeClass("ui-state-focus")
                    }
                })
            },
            _trigger: function(b, c, d) {
                var e, f, g = this.options[b];
                if (d = d || {}, c = a.Event(c), c.type = (b === this.widgetEventPrefix ? b : this.widgetEventPrefix + b).toLowerCase(), c.target = this.element[0], f = c.originalEvent)
                    for (e in f) e in c || (c[e] = f[e]);
                return this.element.trigger(c, d), !(a.isFunction(g) && g.apply(this.element[0], [c].concat(d)) === !1 || c.isDefaultPrevented())
            }
        }, a.each({
            show: "fadeIn",
            hide: "fadeOut"
        }, function(b, c) {
            a.Widget.prototype["_" + b] = function(d, e, f) {
                "string" == typeof e && (e = {
                    effect: e
                });
                var g, h = e ? e === !0 || "number" == typeof e ? c : e.effect || c : b;
                e = e || {}, "number" == typeof e && (e = {
                    duration: e
                }), g = !a.isEmptyObject(e), e.complete = f, e.delay && d.delay(e.delay), g && a.effects && a.effects.effect[h] ? d[b](e) : h !== b && d[h] ? d[h](e.duration, e.easing, f) : d.queue(function(c) {
                    a(this)[b](), f && f.call(d[0]), c()
                })
            }
        });
        var k = (a.widget, !1);
        a(document).mouseup(function() {
            k = !1
        });
        a.widget("ui.mouse", {
            version: "1.11.4",
            options: {
                cancel: "input,textarea,button,select,option",
                distance: 1,
                delay: 0
            },
            _mouseInit: function() {
                var b = this;
                this.element.bind("mousedown." + this.widgetName, function(a) {
                    return b._mouseDown(a)
                }).bind("click." + this.widgetName, function(c) {
                    return !0 === a.data(c.target, b.widgetName + ".preventClickEvent") ? (a.removeData(c.target, b.widgetName + ".preventClickEvent"), c.stopImmediatePropagation(), !1) : void 0
                }), this.started = !1
            },
            _mouseDestroy: function() {
                this.element.unbind("." + this.widgetName), this._mouseMoveDelegate && this.document.unbind("mousemove." + this.widgetName, this._mouseMoveDelegate).unbind("mouseup." + this.widgetName, this._mouseUpDelegate)
            },
            _mouseDown: function(b) {
                if (!k) {
                    this._mouseMoved = !1, this._mouseStarted && this._mouseUp(b), this._mouseDownEvent = b;
                    var c = this,
                        d = 1 === b.which,
                        e = "string" == typeof this.options.cancel && b.target.nodeName ? a(b.target).closest(this.options.cancel).length : !1;
                    return d && !e && this._mouseCapture(b) ? (this.mouseDelayMet = !this.options.delay, this.mouseDelayMet || (this._mouseDelayTimer = setTimeout(function() {
                        c.mouseDelayMet = !0
                    }, this.options.delay)), this._mouseDistanceMet(b) && this._mouseDelayMet(b) && (this._mouseStarted = this._mouseStart(b) !== !1, !this._mouseStarted) ? (b.preventDefault(), !0) : (!0 === a.data(b.target, this.widgetName + ".preventClickEvent") && a.removeData(b.target, this.widgetName + ".preventClickEvent"), this._mouseMoveDelegate = function(a) {
                        return c._mouseMove(a)
                    }, this._mouseUpDelegate = function(a) {
                        return c._mouseUp(a)
                    }, this.document.bind("mousemove." + this.widgetName, this._mouseMoveDelegate).bind("mouseup." + this.widgetName, this._mouseUpDelegate), b.preventDefault(), k = !0, !0)) : !0
                }
            },
            _mouseMove: function(b) {
                if (this._mouseMoved) {
                    if (a.ui.ie && (!document.documentMode || document.documentMode < 9) && !b.button) return this._mouseUp(b);
                    if (!b.which) return this._mouseUp(b)
                }
                return (b.which || b.button) && (this._mouseMoved = !0), this._mouseStarted ? (this._mouseDrag(b), b.preventDefault()) : (this._mouseDistanceMet(b) && this._mouseDelayMet(b) && (this._mouseStarted = this._mouseStart(this._mouseDownEvent, b) !== !1, this._mouseStarted ? this._mouseDrag(b) : this._mouseUp(b)), !this._mouseStarted)
            },
            _mouseUp: function(b) {
                return this.document.unbind("mousemove." + this.widgetName, this._mouseMoveDelegate).unbind("mouseup." + this.widgetName, this._mouseUpDelegate), this._mouseStarted && (this._mouseStarted = !1, b.target === this._mouseDownEvent.target && a.data(b.target, this.widgetName + ".preventClickEvent", !0), this._mouseStop(b)), k = !1, !1
            },
            _mouseDistanceMet: function(a) {
                return Math.max(Math.abs(this._mouseDownEvent.pageX - a.pageX), Math.abs(this._mouseDownEvent.pageY - a.pageY)) >= this.options.distance
            },
            _mouseDelayMet: function() {
                return this.mouseDelayMet
            },
            _mouseStart: function() {},
            _mouseDrag: function() {},
            _mouseStop: function() {},
            _mouseCapture: function() {
                return !0
            }
        });
        ! function() {
            function b(a, b, c) {
                return [parseFloat(a[0]) * (n.test(a[0]) ? b / 100 : 1), parseFloat(a[1]) * (n.test(a[1]) ? c / 100 : 1)]
            }

            function c(b, c) {
                return parseInt(a.css(b, c), 10) || 0
            }

            function d(b) {
                var c = b[0];
                return 9 === c.nodeType ? {
                    width: b.width(),
                    height: b.height(),
                    offset: {
                        top: 0,
                        left: 0
                    }
                } : a.isWindow(c) ? {
                    width: b.width(),
                    height: b.height(),
                    offset: {
                        top: b.scrollTop(),
                        left: b.scrollLeft()
                    }
                } : c.preventDefault ? {
                    width: 0,
                    height: 0,
                    offset: {
                        top: c.pageY,
                        left: c.pageX
                    }
                } : {
                    width: b.outerWidth(),
                    height: b.outerHeight(),
                    offset: b.offset()
                }
            }
            a.ui = a.ui || {};
            var e, f, g = Math.max,
                h = Math.abs,
                i = Math.round,
                j = /left|center|right/,
                k = /top|center|bottom/,
                l = /[\+\-]\d+(\.[\d]+)?%?/,
                m = /^\w+/,
                n = /%$/,
                o = a.fn.position;
            a.position = {
                    scrollbarWidth: function() {
                        if (void 0 !== e) return e;
                        var b, c, d = a("<div style='display:block;position:absolute;width:50px;height:50px;overflow:hidden;'><div style='height:100px;width:auto;'></div></div>"),
                            f = d.children()[0];
                        return a("body").append(d), b = f.offsetWidth, d.css("overflow", "scroll"), c = f.offsetWidth, b === c && (c = d[0].clientWidth), d.remove(), e = b - c
                    },
                    getScrollInfo: function(b) {
                        var c = b.isWindow || b.isDocument ? "" : b.element.css("overflow-x"),
                            d = b.isWindow || b.isDocument ? "" : b.element.css("overflow-y"),
                            e = "scroll" === c || "auto" === c && b.width < b.element[0].scrollWidth,
                            f = "scroll" === d || "auto" === d && b.height < b.element[0].scrollHeight;
                        return {
                            width: f ? a.position.scrollbarWidth() : 0,
                            height: e ? a.position.scrollbarWidth() : 0
                        }
                    },
                    getWithinInfo: function(b) {
                        var c = a(b || window),
                            d = a.isWindow(c[0]),
                            e = !!c[0] && 9 === c[0].nodeType;
                        return {
                            element: c,
                            isWindow: d,
                            isDocument: e,
                            offset: c.offset() || {
                                left: 0,
                                top: 0
                            },
                            scrollLeft: c.scrollLeft(),
                            scrollTop: c.scrollTop(),
                            width: d || e ? c.width() : c.outerWidth(),
                            height: d || e ? c.height() : c.outerHeight()
                        }
                    }
                }, a.fn.position = function(e) {
                    if (!e || !e.of) return o.apply(this, arguments);
                    e = a.extend({}, e);
                    var n, p, q, r, s, t, u = a(e.of),
                        v = a.position.getWithinInfo(e.within),
                        w = a.position.getScrollInfo(v),
                        x = (e.collision || "flip").split(" "),
                        y = {};
                    return t = d(u), u[0].preventDefault && (e.at = "left top"), p = t.width, q = t.height, r = t.offset, s = a.extend({}, r), a.each(["my", "at"], function() {
                        var a, b, c = (e[this] || "").split(" ");
                        1 === c.length && (c = j.test(c[0]) ? c.concat(["center"]) : k.test(c[0]) ? ["center"].concat(c) : ["center", "center"]), c[0] = j.test(c[0]) ? c[0] : "center", c[1] = k.test(c[1]) ? c[1] : "center", a = l.exec(c[0]), b = l.exec(c[1]), y[this] = [a ? a[0] : 0, b ? b[0] : 0], e[this] = [m.exec(c[0])[0], m.exec(c[1])[0]]
                    }), 1 === x.length && (x[1] = x[0]), "right" === e.at[0] ? s.left += p : "center" === e.at[0] && (s.left += p / 2), "bottom" === e.at[1] ? s.top += q : "center" === e.at[1] && (s.top += q / 2), n = b(y.at, p, q), s.left += n[0], s.top += n[1], this.each(function() {
                        var d, j, k = a(this),
                            l = k.outerWidth(),
                            m = k.outerHeight(),
                            o = c(this, "marginLeft"),
                            t = c(this, "marginTop"),
                            z = l + o + c(this, "marginRight") + w.width,
                            A = m + t + c(this, "marginBottom") + w.height,
                            B = a.extend({}, s),
                            C = b(y.my, k.outerWidth(), k.outerHeight());
                        "right" === e.my[0] ? B.left -= l : "center" === e.my[0] && (B.left -= l / 2), "bottom" === e.my[1] ? B.top -= m : "center" === e.my[1] && (B.top -= m / 2), B.left += C[0], B.top += C[1], f || (B.left = i(B.left), B.top = i(B.top)), d = {
                            marginLeft: o,
                            marginTop: t
                        }, a.each(["left", "top"], function(b, c) {
                            a.ui.position[x[b]] && a.ui.position[x[b]][c](B, {
                                targetWidth: p,
                                targetHeight: q,
                                elemWidth: l,
                                elemHeight: m,
                                collisionPosition: d,
                                collisionWidth: z,
                                collisionHeight: A,
                                offset: [n[0] + C[0], n[1] + C[1]],
                                my: e.my,
                                at: e.at,
                                within: v,
                                elem: k
                            })
                        }), e.using && (j = function(a) {
                            var b = r.left - B.left,
                                c = b + p - l,
                                d = r.top - B.top,
                                f = d + q - m,
                                i = {
                                    target: {
                                        element: u,
                                        left: r.left,
                                        top: r.top,
                                        width: p,
                                        height: q
                                    },
                                    element: {
                                        element: k,
                                        left: B.left,
                                        top: B.top,
                                        width: l,
                                        height: m
                                    },
                                    horizontal: 0 > c ? "left" : b > 0 ? "right" : "center",
                                    vertical: 0 > f ? "top" : d > 0 ? "bottom" : "middle"
                                };
                            l > p && h(b + c) < p && (i.horizontal = "center"), m > q && h(d + f) < q && (i.vertical = "middle"), i.important = g(h(b), h(c)) > g(h(d), h(f)) ? "horizontal" : "vertical", e.using.call(this, a, i)
                        }), k.offset(a.extend(B, {
                            using: j
                        }))
                    })
                }, a.ui.position = {
                    fit: {
                        left: function(a, b) {
                            var c, d = b.within,
                                e = d.isWindow ? d.scrollLeft : d.offset.left,
                                f = d.width,
                                h = a.left - b.collisionPosition.marginLeft,
                                i = e - h,
                                j = h + b.collisionWidth - f - e;
                            b.collisionWidth > f ? i > 0 && 0 >= j ? (c = a.left + i + b.collisionWidth - f - e, a.left += i - c) : a.left = j > 0 && 0 >= i ? e : i > j ? e + f - b.collisionWidth : e : i > 0 ? a.left += i : j > 0 ? a.left -= j : a.left = g(a.left - h, a.left)
                        },
                        top: function(a, b) {
                            var c, d = b.within,
                                e = d.isWindow ? d.scrollTop : d.offset.top,
                                f = b.within.height,
                                h = a.top - b.collisionPosition.marginTop,
                                i = e - h,
                                j = h + b.collisionHeight - f - e;
                            b.collisionHeight > f ? i > 0 && 0 >= j ? (c = a.top + i + b.collisionHeight - f - e, a.top += i - c) : a.top = j > 0 && 0 >= i ? e : i > j ? e + f - b.collisionHeight : e : i > 0 ? a.top += i : j > 0 ? a.top -= j : a.top = g(a.top - h, a.top)
                        }
                    },
                    flip: {
                        left: function(a, b) {
                            var c, d, e = b.within,
                                f = e.offset.left + e.scrollLeft,
                                g = e.width,
                                i = e.isWindow ? e.scrollLeft : e.offset.left,
                                j = a.left - b.collisionPosition.marginLeft,
                                k = j - i,
                                l = j + b.collisionWidth - g - i,
                                m = "left" === b.my[0] ? -b.elemWidth : "right" === b.my[0] ? b.elemWidth : 0,
                                n = "left" === b.at[0] ? b.targetWidth : "right" === b.at[0] ? -b.targetWidth : 0,
                                o = -2 * b.offset[0];
                            0 > k ? (c = a.left + m + n + o + b.collisionWidth - g - f, (0 > c || c < h(k)) && (a.left += m + n + o)) : l > 0 && (d = a.left - b.collisionPosition.marginLeft + m + n + o - i, (d > 0 || h(d) < l) && (a.left += m + n + o))
                        },
                        top: function(a, b) {
                            var c, d, e = b.within,
                                f = e.offset.top + e.scrollTop,
                                g = e.height,
                                i = e.isWindow ? e.scrollTop : e.offset.top,
                                j = a.top - b.collisionPosition.marginTop,
                                k = j - i,
                                l = j + b.collisionHeight - g - i,
                                m = "top" === b.my[1],
                                n = m ? -b.elemHeight : "bottom" === b.my[1] ? b.elemHeight : 0,
                                o = "top" === b.at[1] ? b.targetHeight : "bottom" === b.at[1] ? -b.targetHeight : 0,
                                p = -2 * b.offset[1];
                            0 > k ? (d = a.top + n + o + p + b.collisionHeight - g - f, (0 > d || d < h(k)) && (a.top += n + o + p)) : l > 0 && (c = a.top - b.collisionPosition.marginTop + n + o + p - i, (c > 0 || h(c) < l) && (a.top += n + o + p))
                        }
                    },
                    flipfit: {
                        left: function() {
                            a.ui.position.flip.left.apply(this, arguments), a.ui.position.fit.left.apply(this, arguments)
                        },
                        top: function() {
                            a.ui.position.flip.top.apply(this, arguments), a.ui.position.fit.top.apply(this, arguments)
                        }
                    }
                },
                function() {
                    var b, c, d, e, g, h = document.getElementsByTagName("body")[0],
                        i = document.createElement("div");
                    b = document.createElement(h ? "div" : "body"), d = {
                        visibility: "hidden",
                        width: 0,
                        height: 0,
                        border: 0,
                        margin: 0,
                        background: "none"
                    }, h && a.extend(d, {
                        position: "absolute",
                        left: "-1000px",
                        top: "-1000px"
                    });
                    for (g in d) b.style[g] = d[g];
                    b.appendChild(i), c = h || document.documentElement, c.insertBefore(b, c.firstChild), i.style.cssText = "position: absolute; left: 10.7432222px;", e = a(i).offset().left, f = e > 10 && 11 > e, b.innerHTML = "", c.removeChild(b)
                }()
        }();
        a.ui.position;
        a.extend(a.ui, {
            datepicker: {
                version: "1.11.4"
            }
        });
        var l;
        a.extend(e.prototype, {
            markerClassName: "hasDatepicker",
            maxRows: 4,
            _widgetDatepicker: function() {
                return this.dpDiv
            },
            setDefaults: function(a) {
                return h(this._defaults, a || {}), this
            },
            _attachDatepicker: function(b, c) {
                var d, e, f;
                d = b.nodeName.toLowerCase(), e = "div" === d || "span" === d, b.id || (this.uuid += 1, b.id = "dp" + this.uuid), f = this._newInst(a(b), e), f.settings = a.extend({}, c || {}), "input" === d ? this._connectDatepicker(b, f) : e && this._inlineDatepicker(b, f)
            },
            _newInst: function(b, c) {
                var d = b[0].id.replace(/([^A-Za-z0-9_\-])/g, "\\\\$1");
                return {
                    id: d,
                    input: b,
                    selectedDay: 0,
                    selectedMonth: 0,
                    selectedYear: 0,
                    drawMonth: 0,
                    drawYear: 0,
                    inline: c,
                    dpDiv: c ? f(a("<div class='" + this._inlineClass + " ui-datepicker ui-widget ui-widget-content ui-helper-clearfix ui-corner-all'></div>")) : this.dpDiv
                }
            },
            _connectDatepicker: function(b, c) {
                var d = a(b);
                c.append = a([]), c.trigger = a([]), d.hasClass(this.markerClassName) || (this._attachments(d, c), d.addClass(this.markerClassName).keydown(this._doKeyDown).keypress(this._doKeyPress).keyup(this._doKeyUp), this._autoSize(c), a.data(b, "datepicker", c), c.settings.disabled && this._disableDatepicker(b))
            },
            _attachments: function(b, c) {
                var d, e, f, g = this._get(c, "appendText"),
                    h = this._get(c, "isRTL");
                c.append && c.append.remove(), g && (c.append = a("<span class='" + this._appendClass + "'>" + g + "</span>"), b[h ? "before" : "after"](c.append)), b.unbind("focus", this._showDatepicker), c.trigger && c.trigger.remove(), d = this._get(c, "showOn"), ("focus" === d || "both" === d) && b.focus(this._showDatepicker), ("button" === d || "both" === d) && (e = this._get(c, "buttonText"), f = this._get(c, "buttonImage"), c.trigger = a(this._get(c, "buttonImageOnly") ? a("<img/>").addClass(this._triggerClass).attr({
                    src: f,
                    alt: e,
                    title: e
                }) : a("<button type='button'></button>").addClass(this._triggerClass).html(f ? a("<img/>").attr({
                    src: f,
                    alt: e,
                    title: e
                }) : e)), b[h ? "before" : "after"](c.trigger), c.trigger.click(function() {
                    return a.datepicker._datepickerShowing && a.datepicker._lastInput === b[0] ? a.datepicker._hideDatepicker() : a.datepicker._datepickerShowing && a.datepicker._lastInput !== b[0] ? (a.datepicker._hideDatepicker(), a.datepicker._showDatepicker(b[0])) : a.datepicker._showDatepicker(b[0]), !1
                }))
            },
            _autoSize: function(a) {
                if (this._get(a, "autoSize") && !a.inline) {
                    var b, c, d, e, f = new Date(2009, 11, 20),
                        g = this._get(a, "dateFormat");
                    g.match(/[DM]/) && (b = function(a) {
                        for (c = 0, d = 0, e = 0; e < a.length; e++) a[e].length > c && (c = a[e].length, d = e);
                        return d
                    }, f.setMonth(b(this._get(a, g.match(/MM/) ? "monthNames" : "monthNamesShort"))), f.setDate(b(this._get(a, g.match(/DD/) ? "dayNames" : "dayNamesShort")) + 20 - f.getDay())), a.input.attr("size", this._formatDate(a, f).length)
                }
            },
            _inlineDatepicker: function(b, c) {
                var d = a(b);
                d.hasClass(this.markerClassName) || (d.addClass(this.markerClassName).append(c.dpDiv), a.data(b, "datepicker", c), this._setDate(c, this._getDefaultDate(c), !0), this._updateDatepicker(c), this._updateAlternate(c), c.settings.disabled && this._disableDatepicker(b), c.dpDiv.css("display", "block"))
            },
            _dialogDatepicker: function(b, c, d, e, f) {
                var g, i, j, k, l, m = this._dialogInst;
                return m || (this.uuid += 1, g = "dp" + this.uuid, this._dialogInput = a("<input type='text' id='" + g + "' style='position: absolute; top: -100px; width: 0px;'/>"), this._dialogInput.keydown(this._doKeyDown), a("body").append(this._dialogInput), m = this._dialogInst = this._newInst(this._dialogInput, !1), m.settings = {}, a.data(this._dialogInput[0], "datepicker", m)), h(m.settings, e || {}), c = c && c.constructor === Date ? this._formatDate(m, c) : c, this._dialogInput.val(c), this._pos = f ? f.length ? f : [f.pageX, f.pageY] : null, this._pos || (i = document.documentElement.clientWidth, j = document.documentElement.clientHeight, k = document.documentElement.scrollLeft || document.body.scrollLeft, l = document.documentElement.scrollTop || document.body.scrollTop, this._pos = [i / 2 - 100 + k, j / 2 - 150 + l]), this._dialogInput.css("left", this._pos[0] + 20 + "px").css("top", this._pos[1] + "px"), m.settings.onSelect = d, this._inDialog = !0, this.dpDiv.addClass(this._dialogClass), this._showDatepicker(this._dialogInput[0]), a.blockUI && a.blockUI(this.dpDiv), a.data(this._dialogInput[0], "datepicker", m), this
            },
            _destroyDatepicker: function(b) {
                var c, d = a(b),
                    e = a.data(b, "datepicker");
                d.hasClass(this.markerClassName) && (c = b.nodeName.toLowerCase(), a.removeData(b, "datepicker"), "input" === c ? (e.append.remove(), e.trigger.remove(), d.removeClass(this.markerClassName).unbind("focus", this._showDatepicker).unbind("keydown", this._doKeyDown).unbind("keypress", this._doKeyPress).unbind("keyup", this._doKeyUp)) : ("div" === c || "span" === c) && d.removeClass(this.markerClassName).empty(), l === e && (l = null))
            },
            _enableDatepicker: function(b) {
                var c, d, e = a(b),
                    f = a.data(b, "datepicker");
                e.hasClass(this.markerClassName) && (c = b.nodeName.toLowerCase(), "input" === c ? (b.disabled = !1, f.trigger.filter("button").each(function() {
                    this.disabled = !1
                }).end().filter("img").css({
                    opacity: "1.0",
                    cursor: ""
                })) : ("div" === c || "span" === c) && (d = e.children("." + this._inlineClass), d.children().removeClass("ui-state-disabled"), d.find("select.ui-datepicker-month, select.ui-datepicker-year").prop("disabled", !1)), this._disabledInputs = a.map(this._disabledInputs, function(a) {
                    return a === b ? null : a
                }))
            },
            _disableDatepicker: function(b) {
                var c, d, e = a(b),
                    f = a.data(b, "datepicker");
                e.hasClass(this.markerClassName) && (c = b.nodeName.toLowerCase(), "input" === c ? (b.disabled = !0, f.trigger.filter("button").each(function() {
                    this.disabled = !0
                }).end().filter("img").css({
                    opacity: "0.5",
                    cursor: "default"
                })) : ("div" === c || "span" === c) && (d = e.children("." + this._inlineClass), d.children().addClass("ui-state-disabled"), d.find("select.ui-datepicker-month, select.ui-datepicker-year").prop("disabled", !0)), this._disabledInputs = a.map(this._disabledInputs, function(a) {
                    return a === b ? null : a
                }), this._disabledInputs[this._disabledInputs.length] = b)
            },
            _isDisabledDatepicker: function(a) {
                if (!a) return !1;
                for (var b = 0; b < this._disabledInputs.length; b++)
                    if (this._disabledInputs[b] === a) return !0;
                return !1
            },
            _getInst: function(b) {
                try {
                    return a.data(b, "datepicker")
                } catch (c) {
                    throw "Missing instance data for this datepicker"
                }
            },
            _optionDatepicker: function(b, c, d) {
                var e, f, g, i, j = this._getInst(b);
                return 2 === arguments.length && "string" == typeof c ? "defaults" === c ? a.extend({}, a.datepicker._defaults) : j ? "all" === c ? a.extend({}, j.settings) : this._get(j, c) : null : (e = c || {}, "string" == typeof c && (e = {}, e[c] = d), void(j && (this._curInst === j && this._hideDatepicker(), f = this._getDateDatepicker(b, !0), g = this._getMinMaxDate(j, "min"), i = this._getMinMaxDate(j, "max"), h(j.settings, e), null !== g && void 0 !== e.dateFormat && void 0 === e.minDate && (j.settings.minDate = this._formatDate(j, g)), null !== i && void 0 !== e.dateFormat && void 0 === e.maxDate && (j.settings.maxDate = this._formatDate(j, i)), "disabled" in e && (e.disabled ? this._disableDatepicker(b) : this._enableDatepicker(b)), this._attachments(a(b), j), this._autoSize(j), this._setDate(j, f), this._updateAlternate(j), this._updateDatepicker(j))))
            },
            _changeDatepicker: function(a, b, c) {
                this._optionDatepicker(a, b, c)
            },
            _refreshDatepicker: function(a) {
                var b = this._getInst(a);
                b && this._updateDatepicker(b)
            },
            _setDateDatepicker: function(a, b) {
                var c = this._getInst(a);
                c && (this._setDate(c, b), this._updateDatepicker(c), this._updateAlternate(c))
            },
            _getDateDatepicker: function(a, b) {
                var c = this._getInst(a);
                return c && !c.inline && this._setDateFromField(c, b), c ? this._getDate(c) : null
            },
            _doKeyDown: function(b) {
                var c, d, e, f = a.datepicker._getInst(b.target),
                    g = !0,
                    h = f.dpDiv.is(".ui-datepicker-rtl");
                if (f._keyEvent = !0, a.datepicker._datepickerShowing) switch (b.keyCode) {
                    case 9:
                        a.datepicker._hideDatepicker(), g = !1;
                        break;
                    case 13:
                        return e = a("td." + a.datepicker._dayOverClass + ":not(." + a.datepicker._currentClass + ")", f.dpDiv), e[0] && a.datepicker._selectDay(b.target, f.selectedMonth, f.selectedYear, e[0]), c = a.datepicker._get(f, "onSelect"), c ? (d = a.datepicker._formatDate(f), c.apply(f.input ? f.input[0] : null, [d, f])) : a.datepicker._hideDatepicker(), !1;
                    case 27:
                        a.datepicker._hideDatepicker();
                        break;
                    case 33:
                        a.datepicker._adjustDate(b.target, b.ctrlKey ? -a.datepicker._get(f, "stepBigMonths") : -a.datepicker._get(f, "stepMonths"), "M");
                        break;
                    case 34:
                        a.datepicker._adjustDate(b.target, b.ctrlKey ? +a.datepicker._get(f, "stepBigMonths") : +a.datepicker._get(f, "stepMonths"), "M");
                        break;
                    case 35:
                        (b.ctrlKey || b.metaKey) && a.datepicker._clearDate(b.target), g = b.ctrlKey || b.metaKey;
                        break;
                    case 36:
                        (b.ctrlKey || b.metaKey) && a.datepicker._gotoToday(b.target), g = b.ctrlKey || b.metaKey;
                        break;
                    case 37:
                        (b.ctrlKey || b.metaKey) && a.datepicker._adjustDate(b.target, h ? 1 : -1, "D"), g = b.ctrlKey || b.metaKey, b.originalEvent.altKey && a.datepicker._adjustDate(b.target, b.ctrlKey ? -a.datepicker._get(f, "stepBigMonths") : -a.datepicker._get(f, "stepMonths"), "M");
                        break;
                    case 38:
                        (b.ctrlKey || b.metaKey) && a.datepicker._adjustDate(b.target, -7, "D"), g = b.ctrlKey || b.metaKey;
                        break;
                    case 39:
                        (b.ctrlKey || b.metaKey) && a.datepicker._adjustDate(b.target, h ? -1 : 1, "D"), g = b.ctrlKey || b.metaKey, b.originalEvent.altKey && a.datepicker._adjustDate(b.target, b.ctrlKey ? +a.datepicker._get(f, "stepBigMonths") : +a.datepicker._get(f, "stepMonths"), "M");
                        break;
                    case 40:
                        (b.ctrlKey || b.metaKey) && a.datepicker._adjustDate(b.target, 7, "D"), g = b.ctrlKey || b.metaKey;
                        break;
                    default:
                        g = !1
                } else 36 === b.keyCode && b.ctrlKey ? a.datepicker._showDatepicker(this) : g = !1;
                g && (b.preventDefault(), b.stopPropagation())
            },
            _doKeyPress: function(b) {
                var c, d, e = a.datepicker._getInst(b.target);
                return a.datepicker._get(e, "constrainInput") ? (c = a.datepicker._possibleChars(a.datepicker._get(e, "dateFormat")), d = String.fromCharCode(null == b.charCode ? b.keyCode : b.charCode), b.ctrlKey || b.metaKey || " " > d || !c || c.indexOf(d) > -1) : void 0
            },
            _doKeyUp: function(b) {
                var c, d = a.datepicker._getInst(b.target);
                if (d.input.val() !== d.lastVal) try {
                    c = a.datepicker.parseDate(a.datepicker._get(d, "dateFormat"), d.input ? d.input.val() : null, a.datepicker._getFormatConfig(d)), c && (a.datepicker._setDateFromField(d), a.datepicker._updateAlternate(d), a.datepicker._updateDatepicker(d))
                } catch (e) {}
                return !0
            },
            _showDatepicker: function(b) {
                if (b = b.target || b, "input" !== b.nodeName.toLowerCase() && (b = a("input", b.parentNode)[0]), !a.datepicker._isDisabledDatepicker(b) && a.datepicker._lastInput !== b) {
                    var c, e, f, g, i, j, k;
                    c = a.datepicker._getInst(b), a.datepicker._curInst && a.datepicker._curInst !== c && (a.datepicker._curInst.dpDiv.stop(!0, !0), c && a.datepicker._datepickerShowing && a.datepicker._hideDatepicker(a.datepicker._curInst.input[0])), e = a.datepicker._get(c, "beforeShow"), f = e ? e.apply(b, [b, c]) : {}, f !== !1 && (h(c.settings, f), c.lastVal = null, a.datepicker._lastInput = b, a.datepicker._setDateFromField(c), a.datepicker._inDialog && (b.value = ""), a.datepicker._pos || (a.datepicker._pos = a.datepicker._findPos(b), a.datepicker._pos[1] += b.offsetHeight), g = !1, a(b).parents().each(function() {
                        return g |= "fixed" === a(this).css("position"), !g
                    }), i = {
                        left: a.datepicker._pos[0],
                        top: a.datepicker._pos[1]
                    }, a.datepicker._pos = null, c.dpDiv.empty(), c.dpDiv.css({
                        position: "absolute",
                        display: "block",
                        top: "-1000px"
                    }), a.datepicker._updateDatepicker(c), i = a.datepicker._checkOffset(c, i, g), c.dpDiv.css({
                        position: a.datepicker._inDialog && a.blockUI ? "static" : g ? "fixed" : "absolute",
                        display: "none",
                        left: i.left + "px",
                        top: i.top + "px"
                    }), c.inline || (j = a.datepicker._get(c, "showAnim"), k = a.datepicker._get(c, "duration"), c.dpDiv.css("z-index", d(a(b)) + 1), a.datepicker._datepickerShowing = !0, a.effects && a.effects.effect[j] ? c.dpDiv.show(j, a.datepicker._get(c, "showOptions"), k) : c.dpDiv[j || "show"](j ? k : null), a.datepicker._shouldFocusInput(c) && c.input.focus(), a.datepicker._curInst = c))
                }
            },
            _updateDatepicker: function(b) {
                this.maxRows = 4, l = b, b.dpDiv.empty().append(this._generateHTML(b)), this._attachHandlers(b);
                var c, d = this._getNumberOfMonths(b),
                    e = d[1],
                    f = 17,
                    h = b.dpDiv.find("." + this._dayOverClass + " a");
                h.length > 0 && g.apply(h.get(0)), b.dpDiv.removeClass("ui-datepicker-multi-2 ui-datepicker-multi-3 ui-datepicker-multi-4").width(""), e > 1 && b.dpDiv.addClass("ui-datepicker-multi-" + e).css("width", f * e + "em"), b.dpDiv[(1 !== d[0] || 1 !== d[1] ? "add" : "remove") + "Class"]("ui-datepicker-multi"), b.dpDiv[(this._get(b, "isRTL") ? "add" : "remove") + "Class"]("ui-datepicker-rtl"), b === a.datepicker._curInst && a.datepicker._datepickerShowing && a.datepicker._shouldFocusInput(b) && b.input.focus(), b.yearshtml && (c = b.yearshtml, setTimeout(function() {
                    c === b.yearshtml && b.yearshtml && b.dpDiv.find("select.ui-datepicker-year:first").replaceWith(b.yearshtml), c = b.yearshtml = null
                }, 0))
            },
            _shouldFocusInput: function(a) {
                return a.input && a.input.is(":visible") && !a.input.is(":disabled") && !a.input.is(":focus")
            },
            _checkOffset: function(b, c, d) {
                var e = b.dpDiv.outerWidth(),
                    f = b.dpDiv.outerHeight(),
                    g = b.input ? b.input.outerWidth() : 0,
                    h = b.input ? b.input.outerHeight() : 0,
                    i = document.documentElement.clientWidth + (d ? 0 : a(document).scrollLeft()),
                    j = document.documentElement.clientHeight + (d ? 0 : a(document).scrollTop());
                return c.left -= this._get(b, "isRTL") ? e - g : 0, c.left -= d && c.left === b.input.offset().left ? a(document).scrollLeft() : 0, c.top -= d && c.top === b.input.offset().top + h ? a(document).scrollTop() : 0, c.left -= Math.min(c.left, c.left + e > i && i > e ? Math.abs(c.left + e - i) : 0), c.top -= Math.min(c.top, c.top + f > j && j > f ? Math.abs(f + h) : 0), c
            },
            _findPos: function(b) {
                for (var c, d = this._getInst(b), e = this._get(d, "isRTL"); b && ("hidden" === b.type || 1 !== b.nodeType || a.expr.filters.hidden(b));) b = b[e ? "previousSibling" : "nextSibling"];
                return c = a(b).offset(), [c.left, c.top]
            },
            _hideDatepicker: function(b) {
                var c, d, e, f, g = this._curInst;
                !g || b && g !== a.data(b, "datepicker") || this._datepickerShowing && (c = this._get(g, "showAnim"), d = this._get(g, "duration"), e = function() {
                    a.datepicker._tidyDialog(g)
                }, a.effects && (a.effects.effect[c] || a.effects[c]) ? g.dpDiv.hide(c, a.datepicker._get(g, "showOptions"), d, e) : g.dpDiv["slideDown" === c ? "slideUp" : "fadeIn" === c ? "fadeOut" : "hide"](c ? d : null, e), c || e(), this._datepickerShowing = !1, f = this._get(g, "onClose"), f && f.apply(g.input ? g.input[0] : null, [g.input ? g.input.val() : "", g]), this._lastInput = null, this._inDialog && (this._dialogInput.css({
                    position: "absolute",
                    left: "0",
                    top: "-100px"
                }), a.blockUI && (a.unblockUI(), a("body").append(this.dpDiv))), this._inDialog = !1)
            },
            _tidyDialog: function(a) {
                a.dpDiv.removeClass(this._dialogClass).unbind(".ui-datepicker-calendar")
            },
            _checkExternalClick: function(b) {
                if (a.datepicker._curInst) {
                    var c = a(b.target),
                        d = a.datepicker._getInst(c[0]);
                    (c[0].id !== a.datepicker._mainDivId && 0 === c.parents("#" + a.datepicker._mainDivId).length && !c.hasClass(a.datepicker.markerClassName) && !c.closest("." + a.datepicker._triggerClass).length && a.datepicker._datepickerShowing && (!a.datepicker._inDialog || !a.blockUI) || c.hasClass(a.datepicker.markerClassName) && a.datepicker._curInst !== d) && a.datepicker._hideDatepicker()
                }
            },
            _adjustDate: function(b, c, d) {
                var e = a(b),
                    f = this._getInst(e[0]);
                this._isDisabledDatepicker(e[0]) || (this._adjustInstDate(f, c + ("M" === d ? this._get(f, "showCurrentAtPos") : 0), d),
                    this._updateDatepicker(f))
            },
            _gotoToday: function(b) {
                var c, d = a(b),
                    e = this._getInst(d[0]);
                this._get(e, "gotoCurrent") && e.currentDay ? (e.selectedDay = e.currentDay, e.drawMonth = e.selectedMonth = e.currentMonth, e.drawYear = e.selectedYear = e.currentYear) : (c = new Date, e.selectedDay = c.getDate(), e.drawMonth = e.selectedMonth = c.getMonth(), e.drawYear = e.selectedYear = c.getFullYear()), this._notifyChange(e), this._adjustDate(d)
            },
            _selectMonthYear: function(b, c, d) {
                var e = a(b),
                    f = this._getInst(e[0]);
                f["selected" + ("M" === d ? "Month" : "Year")] = f["draw" + ("M" === d ? "Month" : "Year")] = parseInt(c.options[c.selectedIndex].value, 10), this._notifyChange(f), this._adjustDate(e)
            },
            _selectDay: function(b, c, d, e) {
                var f, g = a(b);
                a(e).hasClass(this._unselectableClass) || this._isDisabledDatepicker(g[0]) || (f = this._getInst(g[0]), f.selectedDay = f.currentDay = a("a", e).html(), f.selectedMonth = f.currentMonth = c, f.selectedYear = f.currentYear = d, this._selectDate(b, this._formatDate(f, f.currentDay, f.currentMonth, f.currentYear)))
            },
            _clearDate: function(b) {
                var c = a(b);
                this._selectDate(c, "")
            },
            _selectDate: function(b, c) {
                var d, e = a(b),
                    f = this._getInst(e[0]);
                c = null != c ? c : this._formatDate(f), f.input && f.input.val(c), this._updateAlternate(f), d = this._get(f, "onSelect"), d ? d.apply(f.input ? f.input[0] : null, [c, f]) : f.input && f.input.trigger("change"), f.inline ? this._updateDatepicker(f) : (this._hideDatepicker(), this._lastInput = f.input[0], "object" != typeof f.input[0] && f.input.focus(), this._lastInput = null)
            },
            _updateAlternate: function(b) {
                var c, d, e, f = this._get(b, "altField");
                f && (c = this._get(b, "altFormat") || this._get(b, "dateFormat"), d = this._getDate(b), e = this.formatDate(c, d, this._getFormatConfig(b)), a(f).each(function() {
                    a(this).val(e)
                }))
            },
            noWeekends: function(a) {
                var b = a.getDay();
                return [b > 0 && 6 > b, ""]
            },
            iso8601Week: function(a) {
                var b, c = new Date(a.getTime());
                return c.setDate(c.getDate() + 4 - (c.getDay() || 7)), b = c.getTime(), c.setMonth(0), c.setDate(1), Math.floor(Math.round((b - c) / 864e5) / 7) + 1
            },
            parseDate: function(b, c, d) {
                if (null == b || null == c) throw "Invalid arguments";
                if (c = "object" == typeof c ? c.toString() : c + "", "" === c) return null;
                var e, f, g, h, i = 0,
                    j = (d ? d.shortYearCutoff : null) || this._defaults.shortYearCutoff,
                    k = "string" != typeof j ? j : (new Date).getFullYear() % 100 + parseInt(j, 10),
                    l = (d ? d.dayNamesShort : null) || this._defaults.dayNamesShort,
                    m = (d ? d.dayNames : null) || this._defaults.dayNames,
                    n = (d ? d.monthNamesShort : null) || this._defaults.monthNamesShort,
                    o = (d ? d.monthNames : null) || this._defaults.monthNames,
                    p = -1,
                    q = -1,
                    r = -1,
                    s = -1,
                    t = !1,
                    u = function(a) {
                        var c = e + 1 < b.length && b.charAt(e + 1) === a;
                        return c && e++, c
                    },
                    v = function(a) {
                        var b = u(a),
                            d = "@" === a ? 14 : "!" === a ? 20 : "y" === a && b ? 4 : "o" === a ? 3 : 2,
                            e = "y" === a ? d : 1,
                            f = new RegExp("^\\d{" + e + "," + d + "}"),
                            g = c.substring(i).match(f);
                        if (!g) throw "Missing number at position " + i;
                        return i += g[0].length, parseInt(g[0], 10)
                    },
                    w = function(b, d, e) {
                        var f = -1,
                            g = a.map(u(b) ? e : d, function(a, b) {
                                return [
                                    [b, a]
                                ]
                            }).sort(function(a, b) {
                                return -(a[1].length - b[1].length)
                            });
                        if (a.each(g, function(a, b) {
                                var d = b[1];
                                return c.substr(i, d.length).toLowerCase() === d.toLowerCase() ? (f = b[0], i += d.length, !1) : void 0
                            }), -1 !== f) return f + 1;
                        throw "Unknown name at position " + i
                    },
                    x = function() {
                        if (c.charAt(i) !== b.charAt(e)) throw "Unexpected literal at position " + i;
                        i++
                    };
                for (e = 0; e < b.length; e++)
                    if (t) "'" !== b.charAt(e) || u("'") ? x() : t = !1;
                    else switch (b.charAt(e)) {
                        case "d":
                            r = v("d");
                            break;
                        case "D":
                            w("D", l, m);
                            break;
                        case "o":
                            s = v("o");
                            break;
                        case "m":
                            q = v("m");
                            break;
                        case "M":
                            q = w("M", n, o);
                            break;
                        case "y":
                            p = v("y");
                            break;
                        case "@":
                            h = new Date(v("@")), p = h.getFullYear(), q = h.getMonth() + 1, r = h.getDate();
                            break;
                        case "!":
                            h = new Date((v("!") - this._ticksTo1970) / 1e4), p = h.getFullYear(), q = h.getMonth() + 1, r = h.getDate();
                            break;
                        case "'":
                            u("'") ? x() : t = !0;
                            break;
                        default:
                            x()
                    }
                    if (i < c.length && (g = c.substr(i), !/^\s+/.test(g))) throw "Extra/unparsed characters found in date: " + g;
                if (-1 === p ? p = (new Date).getFullYear() : 100 > p && (p += (new Date).getFullYear() - (new Date).getFullYear() % 100 + (k >= p ? 0 : -100)), s > -1)
                    for (q = 1, r = s;;) {
                        if (f = this._getDaysInMonth(p, q - 1), f >= r) break;
                        q++, r -= f
                    }
                if (h = this._daylightSavingAdjust(new Date(p, q - 1, r)), h.getFullYear() !== p || h.getMonth() + 1 !== q || h.getDate() !== r) throw "Invalid date";
                return h
            },
            ATOM: "yy-mm-dd",
            COOKIE: "D, dd M yy",
            ISO_8601: "yy-mm-dd",
            RFC_822: "D, d M y",
            RFC_850: "DD, dd-M-y",
            RFC_1036: "D, d M y",
            RFC_1123: "D, d M yy",
            RFC_2822: "D, d M yy",
            RSS: "D, d M y",
            TICKS: "!",
            TIMESTAMP: "@",
            W3C: "yy-mm-dd",
            _ticksTo1970: 24 * (718685 + Math.floor(492.5) - Math.floor(19.7) + Math.floor(4.925)) * 60 * 60 * 1e7,
            formatDate: function(a, b, c) {
                if (!b) return "";
                var d, e = (c ? c.dayNamesShort : null) || this._defaults.dayNamesShort,
                    f = (c ? c.dayNames : null) || this._defaults.dayNames,
                    g = (c ? c.monthNamesShort : null) || this._defaults.monthNamesShort,
                    h = (c ? c.monthNames : null) || this._defaults.monthNames,
                    i = function(b) {
                        var c = d + 1 < a.length && a.charAt(d + 1) === b;
                        return c && d++, c
                    },
                    j = function(a, b, c) {
                        var d = "" + b;
                        if (i(a))
                            for (; d.length < c;) d = "0" + d;
                        return d
                    },
                    k = function(a, b, c, d) {
                        return i(a) ? d[b] : c[b]
                    },
                    l = "",
                    m = !1;
                if (b)
                    for (d = 0; d < a.length; d++)
                        if (m) "'" !== a.charAt(d) || i("'") ? l += a.charAt(d) : m = !1;
                        else switch (a.charAt(d)) {
                            case "d":
                                l += j("d", b.getDate(), 2);
                                break;
                            case "D":
                                l += k("D", b.getDay(), e, f);
                                break;
                            case "o":
                                l += j("o", Math.round((new Date(b.getFullYear(), b.getMonth(), b.getDate()).getTime() - new Date(b.getFullYear(), 0, 0).getTime()) / 864e5), 3);
                                break;
                            case "m":
                                l += j("m", b.getMonth() + 1, 2);
                                break;
                            case "M":
                                l += k("M", b.getMonth(), g, h);
                                break;
                            case "y":
                                l += i("y") ? b.getFullYear() : (b.getYear() % 100 < 10 ? "0" : "") + b.getYear() % 100;
                                break;
                            case "@":
                                l += b.getTime();
                                break;
                            case "!":
                                l += 1e4 * b.getTime() + this._ticksTo1970;
                                break;
                            case "'":
                                i("'") ? l += "'" : m = !0;
                                break;
                            default:
                                l += a.charAt(d)
                        }
                        return l
            },
            _possibleChars: function(a) {
                var b, c = "",
                    d = !1,
                    e = function(c) {
                        var d = b + 1 < a.length && a.charAt(b + 1) === c;
                        return d && b++, d
                    };
                for (b = 0; b < a.length; b++)
                    if (d) "'" !== a.charAt(b) || e("'") ? c += a.charAt(b) : d = !1;
                    else switch (a.charAt(b)) {
                        case "d":
                        case "m":
                        case "y":
                        case "@":
                            c += "0123456789";
                            break;
                        case "D":
                        case "M":
                            return null;
                        case "'":
                            e("'") ? c += "'" : d = !0;
                            break;
                        default:
                            c += a.charAt(b)
                    }
                    return c
            },
            _get: function(a, b) {
                return void 0 !== a.settings[b] ? a.settings[b] : this._defaults[b]
            },
            _setDateFromField: function(a, b) {
                if (a.input.val() !== a.lastVal) {
                    var c = this._get(a, "dateFormat"),
                        d = a.lastVal = a.input ? a.input.val() : null,
                        e = this._getDefaultDate(a),
                        f = e,
                        g = this._getFormatConfig(a);
                    try {
                        f = this.parseDate(c, d, g) || e
                    } catch (h) {
                        d = b ? "" : d
                    }
                    a.selectedDay = f.getDate(), a.drawMonth = a.selectedMonth = f.getMonth(), a.drawYear = a.selectedYear = f.getFullYear(), a.currentDay = d ? f.getDate() : 0, a.currentMonth = d ? f.getMonth() : 0, a.currentYear = d ? f.getFullYear() : 0, this._adjustInstDate(a)
                }
            },
            _getDefaultDate: function(a) {
                return this._restrictMinMax(a, this._determineDate(a, this._get(a, "defaultDate"), new Date))
            },
            _determineDate: function(b, c, d) {
                var e = function(a) {
                        var b = new Date;
                        return b.setDate(b.getDate() + a), b
                    },
                    f = function(c) {
                        try {
                            return a.datepicker.parseDate(a.datepicker._get(b, "dateFormat"), c, a.datepicker._getFormatConfig(b))
                        } catch (d) {}
                        for (var e = (c.toLowerCase().match(/^c/) ? a.datepicker._getDate(b) : null) || new Date, f = e.getFullYear(), g = e.getMonth(), h = e.getDate(), i = /([+\-]?[0-9]+)\s*(d|D|w|W|m|M|y|Y)?/g, j = i.exec(c); j;) {
                            switch (j[2] || "d") {
                                case "d":
                                case "D":
                                    h += parseInt(j[1], 10);
                                    break;
                                case "w":
                                case "W":
                                    h += 7 * parseInt(j[1], 10);
                                    break;
                                case "m":
                                case "M":
                                    g += parseInt(j[1], 10), h = Math.min(h, a.datepicker._getDaysInMonth(f, g));
                                    break;
                                case "y":
                                case "Y":
                                    f += parseInt(j[1], 10), h = Math.min(h, a.datepicker._getDaysInMonth(f, g))
                            }
                            j = i.exec(c)
                        }
                        return new Date(f, g, h)
                    },
                    g = null == c || "" === c ? d : "string" == typeof c ? f(c) : "number" == typeof c ? isNaN(c) ? d : e(c) : new Date(c.getTime());
                return g = g && "Invalid Date" === g.toString() ? d : g, g && (g.setHours(0), g.setMinutes(0), g.setSeconds(0), g.setMilliseconds(0)), this._daylightSavingAdjust(g)
            },
            _daylightSavingAdjust: function(a) {
                return a ? (a.setHours(a.getHours() > 12 ? a.getHours() + 2 : 0), a) : null
            },
            _setDate: function(a, b, c) {
                var d = !b,
                    e = a.selectedMonth,
                    f = a.selectedYear,
                    g = this._restrictMinMax(a, this._determineDate(a, b, new Date));
                a.selectedDay = a.currentDay = g.getDate(), a.drawMonth = a.selectedMonth = a.currentMonth = g.getMonth(), a.drawYear = a.selectedYear = a.currentYear = g.getFullYear(), e === a.selectedMonth && f === a.selectedYear || c || this._notifyChange(a), this._adjustInstDate(a), a.input && a.input.val(d ? "" : this._formatDate(a))
            },
            _getDate: function(a) {
                var b = !a.currentYear || a.input && "" === a.input.val() ? null : this._daylightSavingAdjust(new Date(a.currentYear, a.currentMonth, a.currentDay));
                return b
            },
            _attachHandlers: function(b) {
                var c = this._get(b, "stepMonths"),
                    d = "#" + b.id.replace(/\\\\/g, "\\");
                b.dpDiv.find("[data-handler]").map(function() {
                    var b = {
                        prev: function() {
                            a.datepicker._adjustDate(d, -c, "M")
                        },
                        next: function() {
                            a.datepicker._adjustDate(d, +c, "M")
                        },
                        hide: function() {
                            a.datepicker._hideDatepicker()
                        },
                        today: function() {
                            a.datepicker._gotoToday(d)
                        },
                        selectDay: function() {
                            return a.datepicker._selectDay(d, +this.getAttribute("data-month"), +this.getAttribute("data-year"), this), !1
                        },
                        selectMonth: function() {
                            return a.datepicker._selectMonthYear(d, this, "M"), !1
                        },
                        selectYear: function() {
                            return a.datepicker._selectMonthYear(d, this, "Y"), !1
                        }
                    };
                    a(this).bind(this.getAttribute("data-event"), b[this.getAttribute("data-handler")])
                })
            },
            _generateHTML: function(a) {
                var b, c, d, e, f, g, h, i, j, k, l, m, n, o, p, q, r, s, t, u, v, w, x, y, z, A, B, C, D, E, F, G, H, I, J, K, L, M, N, O = new Date,
                    P = this._daylightSavingAdjust(new Date(O.getFullYear(), O.getMonth(), O.getDate())),
                    Q = this._get(a, "isRTL"),
                    R = this._get(a, "showButtonPanel"),
                    S = this._get(a, "hideIfNoPrevNext"),
                    T = this._get(a, "navigationAsDateFormat"),
                    U = this._getNumberOfMonths(a),
                    V = this._get(a, "showCurrentAtPos"),
                    W = this._get(a, "stepMonths"),
                    X = 1 !== U[0] || 1 !== U[1],
                    Y = this._daylightSavingAdjust(a.currentDay ? new Date(a.currentYear, a.currentMonth, a.currentDay) : new Date(9999, 9, 9)),
                    Z = this._getMinMaxDate(a, "min"),
                    $ = this._getMinMaxDate(a, "max"),
                    _ = a.drawMonth - V,
                    aa = a.drawYear;
                if (0 > _ && (_ += 12, aa--), $)
                    for (b = this._daylightSavingAdjust(new Date($.getFullYear(), $.getMonth() - U[0] * U[1] + 1, $.getDate())), b = Z && Z > b ? Z : b; this._daylightSavingAdjust(new Date(aa, _, 1)) > b;) _--, 0 > _ && (_ = 11, aa--);
                for (a.drawMonth = _, a.drawYear = aa, c = this._get(a, "prevText"), c = T ? this.formatDate(c, this._daylightSavingAdjust(new Date(aa, _ - W, 1)), this._getFormatConfig(a)) : c, d = this._canAdjustMonth(a, -1, aa, _) ? "<a class='ui-datepicker-prev ui-corner-all' data-handler='prev' data-event='click' title='" + c + "'><span class='ui-icon ui-icon-circle-triangle-" + (Q ? "e" : "w") + "'>" + c + "</span></a>" : S ? "" : "<a class='ui-datepicker-prev ui-corner-all ui-state-disabled' title='" + c + "'><span class='ui-icon ui-icon-circle-triangle-" + (Q ? "e" : "w") + "'>" + c + "</span></a>", e = this._get(a, "nextText"), e = T ? this.formatDate(e, this._daylightSavingAdjust(new Date(aa, _ + W, 1)), this._getFormatConfig(a)) : e, f = this._canAdjustMonth(a, 1, aa, _) ? "<a class='ui-datepicker-next ui-corner-all' data-handler='next' data-event='click' title='" + e + "'><span class='ui-icon ui-icon-circle-triangle-" + (Q ? "w" : "e") + "'>" + e + "</span></a>" : S ? "" : "<a class='ui-datepicker-next ui-corner-all ui-state-disabled' title='" + e + "'><span class='ui-icon ui-icon-circle-triangle-" + (Q ? "w" : "e") + "'>" + e + "</span></a>", g = this._get(a, "currentText"), h = this._get(a, "gotoCurrent") && a.currentDay ? Y : P, g = T ? this.formatDate(g, h, this._getFormatConfig(a)) : g, i = a.inline ? "" : "<button type='button' class='ui-datepicker-close ui-state-default ui-priority-primary ui-corner-all' data-handler='hide' data-event='click'>" + this._get(a, "closeText") + "</button>", j = R ? "<div class='ui-datepicker-buttonpane ui-widget-content'>" + (Q ? i : "") + (this._isInRange(a, h) ? "<button type='button' class='ui-datepicker-current ui-state-default ui-priority-secondary ui-corner-all' data-handler='today' data-event='click'>" + g + "</button>" : "") + (Q ? "" : i) + "</div>" : "", k = parseInt(this._get(a, "firstDay"), 10), k = isNaN(k) ? 0 : k, l = this._get(a, "showWeek"), m = this._get(a, "dayNames"), n = this._get(a, "dayNamesMin"), o = this._get(a, "monthNames"), p = this._get(a, "monthNamesShort"), q = this._get(a, "beforeShowDay"), r = this._get(a, "showOtherMonths"), s = this._get(a, "selectOtherMonths"), t = this._getDefaultDate(a), u = "", w = 0; w < U[0]; w++) {
                    for (x = "", this.maxRows = 4, y = 0; y < U[1]; y++) {
                        if (z = this._daylightSavingAdjust(new Date(aa, _, a.selectedDay)), A = " ui-corner-all", B = "", X) {
                            if (B += "<div class='ui-datepicker-group", U[1] > 1) switch (y) {
                                case 0:
                                    B += " ui-datepicker-group-first", A = " ui-corner-" + (Q ? "right" : "left");
                                    break;
                                case U[1] - 1:
                                    B += " ui-datepicker-group-last", A = " ui-corner-" + (Q ? "left" : "right");
                                    break;
                                default:
                                    B += " ui-datepicker-group-middle", A = ""
                            }
                            B += "'>"
                        }
                        for (B += "<div class='ui-datepicker-header ui-widget-header ui-helper-clearfix" + A + "'>" + (/all|left/.test(A) && 0 === w ? Q ? f : d : "") + (/all|right/.test(A) && 0 === w ? Q ? d : f : "") + this._generateMonthYearHeader(a, _, aa, Z, $, w > 0 || y > 0, o, p) + "</div><table class='ui-datepicker-calendar'><thead><tr>", C = l ? "<th class='ui-datepicker-week-col'>" + this._get(a, "weekHeader") + "</th>" : "", v = 0; 7 > v; v++) D = (v + k) % 7, C += "<th scope='col'" + ((v + k + 6) % 7 >= 5 ? " class='ui-datepicker-week-end'" : "") + "><span title='" + m[D] + "'>" + n[D] + "</span></th>";
                        for (B += C + "</tr></thead><tbody>", E = this._getDaysInMonth(aa, _), aa === a.selectedYear && _ === a.selectedMonth && (a.selectedDay = Math.min(a.selectedDay, E)), F = (this._getFirstDayOfMonth(aa, _) - k + 7) % 7, G = Math.ceil((F + E) / 7), H = X && this.maxRows > G ? this.maxRows : G, this.maxRows = H, I = this._daylightSavingAdjust(new Date(aa, _, 1 - F)), J = 0; H > J; J++) {
                            for (B += "<tr>", K = l ? "<td class='ui-datepicker-week-col'>" + this._get(a, "calculateWeek")(I) + "</td>" : "", v = 0; 7 > v; v++) L = q ? q.apply(a.input ? a.input[0] : null, [I]) : [!0, ""], M = I.getMonth() !== _, N = M && !s || !L[0] || Z && Z > I || $ && I > $, K += "<td class='" + ((v + k + 6) % 7 >= 5 ? " ui-datepicker-week-end" : "") + (M ? " ui-datepicker-other-month" : "") + (I.getTime() === z.getTime() && _ === a.selectedMonth && a._keyEvent || t.getTime() === I.getTime() && t.getTime() === z.getTime() ? " " + this._dayOverClass : "") + (N ? " " + this._unselectableClass + " ui-state-disabled" : "") + (M && !r ? "" : " " + L[1] + (I.getTime() === Y.getTime() ? " " + this._currentClass : "") + (I.getTime() === P.getTime() ? " ui-datepicker-today" : "")) + "'" + (M && !r || !L[2] ? "" : " title='" + L[2].replace(/'/g, "&#39;") + "'") + (N ? "" : " data-handler='selectDay' data-event='click' data-month='" + I.getMonth() + "' data-year='" + I.getFullYear() + "'") + ">" + (M && !r ? "&#xa0;" : N ? "<span class='ui-state-default'>" + I.getDate() + "</span>" : "<a class='ui-state-default" + (I.getTime() === P.getTime() ? " ui-state-highlight" : "") + (I.getTime() === Y.getTime() ? " ui-state-active" : "") + (M ? " ui-priority-secondary" : "") + "' href='#'>" + I.getDate() + "</a>") + "</td>", I.setDate(I.getDate() + 1), I = this._daylightSavingAdjust(I);
                            B += K + "</tr>"
                        }
                        _++, _ > 11 && (_ = 0, aa++), B += "</tbody></table>" + (X ? "</div>" + (U[0] > 0 && y === U[1] - 1 ? "<div class='ui-datepicker-row-break'></div>" : "") : ""), x += B
                    }
                    u += x
                }
                return u += j, a._keyEvent = !1, u
            },
            _generateMonthYearHeader: function(a, b, c, d, e, f, g, h) {
                var i, j, k, l, m, n, o, p, q = this._get(a, "changeMonth"),
                    r = this._get(a, "changeYear"),
                    s = this._get(a, "showMonthAfterYear"),
                    t = "<div class='ui-datepicker-title'>",
                    u = "";
                if (f || !q) u += "<span class='ui-datepicker-month'>" + g[b] + "</span>";
                else {
                    for (i = d && d.getFullYear() === c, j = e && e.getFullYear() === c, u += "<select class='ui-datepicker-month' data-handler='selectMonth' data-event='change'>", k = 0; 12 > k; k++)(!i || k >= d.getMonth()) && (!j || k <= e.getMonth()) && (u += "<option value='" + k + "'" + (k === b ? " selected='selected'" : "") + ">" + h[k] + "</option>");
                    u += "</select>"
                }
                if (s || (t += u + (!f && q && r ? "" : "&#xa0;")), !a.yearshtml)
                    if (a.yearshtml = "", f || !r) t += "<span class='ui-datepicker-year'>" + c + "</span>";
                    else {
                        for (l = this._get(a, "yearRange").split(":"), m = (new Date).getFullYear(), n = function(a) {
                                var b = a.match(/c[+\-].*/) ? c + parseInt(a.substring(1), 10) : a.match(/[+\-].*/) ? m + parseInt(a, 10) : parseInt(a, 10);
                                return isNaN(b) ? m : b
                            }, o = n(l[0]), p = Math.max(o, n(l[1] || "")), o = d ? Math.max(o, d.getFullYear()) : o, p = e ? Math.min(p, e.getFullYear()) : p, a.yearshtml += "<select class='ui-datepicker-year' data-handler='selectYear' data-event='change'>"; p >= o; o++) a.yearshtml += "<option value='" + o + "'" + (o === c ? " selected='selected'" : "") + ">" + o + "</option>";
                        a.yearshtml += "</select>", t += a.yearshtml, a.yearshtml = null
                    }
                return t += this._get(a, "yearSuffix"), s && (t += (!f && q && r ? "" : "&#xa0;") + u), t += "</div>"
            },
            _adjustInstDate: function(a, b, c) {
                var d = a.drawYear + ("Y" === c ? b : 0),
                    e = a.drawMonth + ("M" === c ? b : 0),
                    f = Math.min(a.selectedDay, this._getDaysInMonth(d, e)) + ("D" === c ? b : 0),
                    g = this._restrictMinMax(a, this._daylightSavingAdjust(new Date(d, e, f)));
                a.selectedDay = g.getDate(), a.drawMonth = a.selectedMonth = g.getMonth(), a.drawYear = a.selectedYear = g.getFullYear(), ("M" === c || "Y" === c) && this._notifyChange(a)
            },
            _restrictMinMax: function(a, b) {
                var c = this._getMinMaxDate(a, "min"),
                    d = this._getMinMaxDate(a, "max"),
                    e = c && c > b ? c : b;
                return d && e > d ? d : e
            },
            _notifyChange: function(a) {
                var b = this._get(a, "onChangeMonthYear");
                b && b.apply(a.input ? a.input[0] : null, [a.selectedYear, a.selectedMonth + 1, a])
            },
            _getNumberOfMonths: function(a) {
                var b = this._get(a, "numberOfMonths");
                return null == b ? [1, 1] : "number" == typeof b ? [1, b] : b
            },
            _getMinMaxDate: function(a, b) {
                return this._determineDate(a, this._get(a, b + "Date"), null)
            },
            _getDaysInMonth: function(a, b) {
                return 32 - this._daylightSavingAdjust(new Date(a, b, 32)).getDate()
            },
            _getFirstDayOfMonth: function(a, b) {
                return new Date(a, b, 1).getDay()
            },
            _canAdjustMonth: function(a, b, c, d) {
                var e = this._getNumberOfMonths(a),
                    f = this._daylightSavingAdjust(new Date(c, d + (0 > b ? b : e[0] * e[1]), 1));
                return 0 > b && f.setDate(this._getDaysInMonth(f.getFullYear(), f.getMonth())), this._isInRange(a, f)
            },
            _isInRange: function(a, b) {
                var c, d, e = this._getMinMaxDate(a, "min"),
                    f = this._getMinMaxDate(a, "max"),
                    g = null,
                    h = null,
                    i = this._get(a, "yearRange");
                return i && (c = i.split(":"), d = (new Date).getFullYear(), g = parseInt(c[0], 10), h = parseInt(c[1], 10), c[0].match(/[+\-].*/) && (g += d), c[1].match(/[+\-].*/) && (h += d)), (!e || b.getTime() >= e.getTime()) && (!f || b.getTime() <= f.getTime()) && (!g || b.getFullYear() >= g) && (!h || b.getFullYear() <= h)
            },
            _getFormatConfig: function(a) {
                var b = this._get(a, "shortYearCutoff");
                return b = "string" != typeof b ? b : (new Date).getFullYear() % 100 + parseInt(b, 10), {
                    shortYearCutoff: b,
                    dayNamesShort: this._get(a, "dayNamesShort"),
                    dayNames: this._get(a, "dayNames"),
                    monthNamesShort: this._get(a, "monthNamesShort"),
                    monthNames: this._get(a, "monthNames")
                }
            },
            _formatDate: function(a, b, c, d) {
                b || (a.currentDay = a.selectedDay, a.currentMonth = a.selectedMonth, a.currentYear = a.selectedYear);
                var e = b ? "object" == typeof b ? b : this._daylightSavingAdjust(new Date(d, c, b)) : this._daylightSavingAdjust(new Date(a.currentYear, a.currentMonth, a.currentDay));
                return this.formatDate(this._get(a, "dateFormat"), e, this._getFormatConfig(a))
            }
        }), a.fn.datepicker = function(b) {
            if (!this.length) return this;
            a.datepicker.initialized || (a(document).mousedown(a.datepicker._checkExternalClick), a.datepicker.initialized = !0), 0 === a("#" + a.datepicker._mainDivId).length && a("body").append(a.datepicker.dpDiv);
            var c = Array.prototype.slice.call(arguments, 1);
            return "string" != typeof b || "isDisabled" !== b && "getDate" !== b && "widget" !== b ? "option" === b && 2 === arguments.length && "string" == typeof arguments[1] ? a.datepicker["_" + b + "Datepicker"].apply(a.datepicker, [this[0]].concat(c)) : this.each(function() {
                "string" == typeof b ? a.datepicker["_" + b + "Datepicker"].apply(a.datepicker, [this].concat(c)) : a.datepicker._attachDatepicker(this, b)
            }) : a.datepicker["_" + b + "Datepicker"].apply(a.datepicker, [this[0]].concat(c))
        }, a.datepicker = new e, a.datepicker.initialized = !1, a.datepicker.uuid = (new Date).getTime(), a.datepicker.version = "1.11.4";
        a.datepicker, a.widget("ui.slider", a.ui.mouse, {
            version: "1.11.4",
            widgetEventPrefix: "slide",
            options: {
                animate: !1,
                distance: 0,
                max: 100,
                min: 0,
                orientation: "horizontal",
                range: !1,
                step: 1,
                value: 0,
                values: null,
                change: null,
                slide: null,
                start: null,
                stop: null
            },
            numPages: 5,
            _create: function() {
                this._keySliding = !1, this._mouseSliding = !1, this._animateOff = !0, this._handleIndex = null, this._detectOrientation(), this._mouseInit(), this._calculateNewMax(), this.element.addClass("ui-slider ui-slider-" + this.orientation + " ui-widget ui-widget-content ui-corner-all"), this._refresh(), this._setOption("disabled", this.options.disabled), this._animateOff = !1
            },
            _refresh: function() {
                this._createRange(), this._createHandles(), this._setupEvents(), this._refreshValue()
            },
            _createHandles: function() {
                var b, c, d = this.options,
                    e = this.element.find(".ui-slider-handle").addClass("ui-state-default ui-corner-all"),
                    f = "<span class='ui-slider-handle ui-state-default ui-corner-all' tabindex='0'></span>",
                    g = [];
                for (c = d.values && d.values.length || 1, e.length > c && (e.slice(c).remove(), e = e.slice(0, c)), b = e.length; c > b; b++) g.push(f);
                this.handles = e.add(a(g.join("")).appendTo(this.element)), this.handle = this.handles.eq(0), this.handles.each(function(b) {
                    a(this).data("ui-slider-handle-index", b)
                })
            },
            _createRange: function() {
                var b = this.options,
                    c = "";
                b.range ? (b.range === !0 && (b.values ? b.values.length && 2 !== b.values.length ? b.values = [b.values[0], b.values[0]] : a.isArray(b.values) && (b.values = b.values.slice(0)) : b.values = [this._valueMin(), this._valueMin()]), this.range && this.range.length ? this.range.removeClass("ui-slider-range-min ui-slider-range-max").css({
                    left: "",
                    bottom: ""
                }) : (this.range = a("<div></div>").appendTo(this.element), c = "ui-slider-range ui-widget-header ui-corner-all"), this.range.addClass(c + ("min" === b.range || "max" === b.range ? " ui-slider-range-" + b.range : ""))) : (this.range && this.range.remove(), this.range = null)
            },
            _setupEvents: function() {
                this._off(this.handles), this._on(this.handles, this._handleEvents), this._hoverable(this.handles), this._focusable(this.handles)
            },
            _destroy: function() {
                this.handles.remove(), this.range && this.range.remove(), this.element.removeClass("ui-slider ui-slider-horizontal ui-slider-vertical ui-widget ui-widget-content ui-corner-all"), this._mouseDestroy()
            },
            _mouseCapture: function(b) {
                var c, d, e, f, g, h, i, j, k = this,
                    l = this.options;
                return l.disabled ? !1 : (this.elementSize = {
                    width: this.element.outerWidth(),
                    height: this.element.outerHeight()
                }, this.elementOffset = this.element.offset(), c = {
                    x: b.pageX,
                    y: b.pageY
                }, d = this._normValueFromMouse(c), e = this._valueMax() - this._valueMin() + 1, this.handles.each(function(b) {
                    var c = Math.abs(d - k.values(b));
                    (e > c || e === c && (b === k._lastChangedValue || k.values(b) === l.min)) && (e = c, f = a(this), g = b)
                }), h = this._start(b, g), h === !1 ? !1 : (this._mouseSliding = !0, this._handleIndex = g, f.addClass("ui-state-active").focus(), i = f.offset(), j = !a(b.target).parents().addBack().is(".ui-slider-handle"), this._clickOffset = j ? {
                    left: 0,
                    top: 0
                } : {
                    left: b.pageX - i.left - f.width() / 2,
                    top: b.pageY - i.top - f.height() / 2 - (parseInt(f.css("borderTopWidth"), 10) || 0) - (parseInt(f.css("borderBottomWidth"), 10) || 0) + (parseInt(f.css("marginTop"), 10) || 0)
                }, this.handles.hasClass("ui-state-hover") || this._slide(b, g, d), this._animateOff = !0, !0))
            },
            _mouseStart: function() {
                return !0
            },
            _mouseDrag: function(a) {
                var b = {
                        x: a.pageX,
                        y: a.pageY
                    },
                    c = this._normValueFromMouse(b);
                return this._slide(a, this._handleIndex, c), !1
            },
            _mouseStop: function(a) {
                return this.handles.removeClass("ui-state-active"), this._mouseSliding = !1, this._stop(a, this._handleIndex), this._change(a, this._handleIndex), this._handleIndex = null, this._clickOffset = null, this._animateOff = !1, !1
            },
            _detectOrientation: function() {
                this.orientation = "vertical" === this.options.orientation ? "vertical" : "horizontal"
            },
            _normValueFromMouse: function(a) {
                var b, c, d, e, f;
                return "horizontal" === this.orientation ? (b = this.elementSize.width, c = a.x - this.elementOffset.left - (this._clickOffset ? this._clickOffset.left : 0)) : (b = this.elementSize.height, c = a.y - this.elementOffset.top - (this._clickOffset ? this._clickOffset.top : 0)), d = c / b, d > 1 && (d = 1), 0 > d && (d = 0), "vertical" === this.orientation && (d = 1 - d), e = this._valueMax() - this._valueMin(), f = this._valueMin() + d * e, this._trimAlignValue(f)
            },
            _start: function(a, b) {
                var c = {
                    handle: this.handles[b],
                    value: this.value()
                };
                return this.options.values && this.options.values.length && (c.value = this.values(b), c.values = this.values()), this._trigger("start", a, c)
            },
            _slide: function(a, b, c) {
                var d, e, f;
                this.options.values && this.options.values.length ? (d = this.values(b ? 0 : 1), 2 === this.options.values.length && this.options.range === !0 && (0 === b && c > d || 1 === b && d > c) && (c = d), c !== this.values(b) && (e = this.values(), e[b] = c, f = this._trigger("slide", a, {
                    handle: this.handles[b],
                    value: c,
                    values: e
                }), d = this.values(b ? 0 : 1), f !== !1 && this.values(b, c))) : c !== this.value() && (f = this._trigger("slide", a, {
                    handle: this.handles[b],
                    value: c
                }), f !== !1 && this.value(c))
            },
            _stop: function(a, b) {
                var c = {
                    handle: this.handles[b],
                    value: this.value()
                };
                this.options.values && this.options.values.length && (c.value = this.values(b), c.values = this.values()), this._trigger("stop", a, c)
            },
            _change: function(a, b) {
                if (!this._keySliding && !this._mouseSliding) {
                    var c = {
                        handle: this.handles[b],
                        value: this.value()
                    };
                    this.options.values && this.options.values.length && (c.value = this.values(b), c.values = this.values()), this._lastChangedValue = b, this._trigger("change", a, c)
                }
            },
            value: function(a) {
                return arguments.length ? (this.options.value = this._trimAlignValue(a), this._refreshValue(), void this._change(null, 0)) : this._value()
            },
            values: function(b, c) {
                var d, e, f;
                if (arguments.length > 1) return this.options.values[b] = this._trimAlignValue(c), this._refreshValue(), void this._change(null, b);
                if (!arguments.length) return this._values();
                if (!a.isArray(arguments[0])) return this.options.values && this.options.values.length ? this._values(b) : this.value();
                for (d = this.options.values, e = arguments[0], f = 0; f < d.length; f += 1) d[f] = this._trimAlignValue(e[f]), this._change(null, f);
                this._refreshValue()
            },
            _setOption: function(b, c) {
                var d, e = 0;
                switch ("range" === b && this.options.range === !0 && ("min" === c ? (this.options.value = this._values(0), this.options.values = null) : "max" === c && (this.options.value = this._values(this.options.values.length - 1), this.options.values = null)), a.isArray(this.options.values) && (e = this.options.values.length), "disabled" === b && this.element.toggleClass("ui-state-disabled", !!c), this._super(b, c), b) {
                    case "orientation":
                        this._detectOrientation(), this.element.removeClass("ui-slider-horizontal ui-slider-vertical").addClass("ui-slider-" + this.orientation), this._refreshValue(), this.handles.css("horizontal" === c ? "bottom" : "left", "");
                        break;
                    case "value":
                        this._animateOff = !0, this._refreshValue(), this._change(null, 0), this._animateOff = !1;
                        break;
                    case "values":
                        for (this._animateOff = !0, this._refreshValue(), d = 0; e > d; d += 1) this._change(null, d);
                        this._animateOff = !1;
                        break;
                    case "step":
                    case "min":
                    case "max":
                        this._animateOff = !0, this._calculateNewMax(), this._refreshValue(), this._animateOff = !1;
                        break;
                    case "range":
                        this._animateOff = !0, this._refresh(), this._animateOff = !1
                }
            },
            _value: function() {
                var a = this.options.value;
                return a = this._trimAlignValue(a)
            },
            _values: function(a) {
                var b, c, d;
                if (arguments.length) return b = this.options.values[a], b = this._trimAlignValue(b);
                if (this.options.values && this.options.values.length) {
                    for (c = this.options.values.slice(), d = 0; d < c.length; d += 1) c[d] = this._trimAlignValue(c[d]);
                    return c
                }
                return []
            },
            _trimAlignValue: function(a) {
                if (a <= this._valueMin()) return this._valueMin();
                if (a >= this._valueMax()) return this._valueMax();
                var b = this.options.step > 0 ? this.options.step : 1,
                    c = (a - this._valueMin()) % b,
                    d = a - c;
                return 2 * Math.abs(c) >= b && (d += c > 0 ? b : -b), parseFloat(d.toFixed(5))
            },
            _calculateNewMax: function() {
                var a = this.options.max,
                    b = this._valueMin(),
                    c = this.options.step,
                    d = Math.floor(+(a - b).toFixed(this._precision()) / c) * c;
                a = d + b, this.max = parseFloat(a.toFixed(this._precision()))
            },
            _precision: function() {
                var a = this._precisionOf(this.options.step);
                return null !== this.options.min && (a = Math.max(a, this._precisionOf(this.options.min))), a
            },
            _precisionOf: function(a) {
                var b = a.toString(),
                    c = b.indexOf(".");
                return -1 === c ? 0 : b.length - c - 1
            },
            _valueMin: function() {
                return this.options.min
            },
            _valueMax: function() {
                return this.max
            },
            _refreshValue: function() {
                var b, c, d, e, f, g = this.options.range,
                    h = this.options,
                    i = this,
                    j = this._animateOff ? !1 : h.animate,
                    k = {};
                this.options.values && this.options.values.length ? this.handles.each(function(d) {
                    c = (i.values(d) - i._valueMin()) / (i._valueMax() - i._valueMin()) * 100, k["horizontal" === i.orientation ? "left" : "bottom"] = c + "%", a(this).stop(1, 1)[j ? "animate" : "css"](k, h.animate), i.options.range === !0 && ("horizontal" === i.orientation ? (0 === d && i.range.stop(1, 1)[j ? "animate" : "css"]({
                        left: c + "%"
                    }, h.animate), 1 === d && i.range[j ? "animate" : "css"]({
                        width: c - b + "%"
                    }, {
                        queue: !1,
                        duration: h.animate
                    })) : (0 === d && i.range.stop(1, 1)[j ? "animate" : "css"]({
                        bottom: c + "%"
                    }, h.animate), 1 === d && i.range[j ? "animate" : "css"]({
                        height: c - b + "%"
                    }, {
                        queue: !1,
                        duration: h.animate
                    }))), b = c
                }) : (d = this.value(), e = this._valueMin(), f = this._valueMax(), c = f !== e ? (d - e) / (f - e) * 100 : 0, k["horizontal" === this.orientation ? "left" : "bottom"] = c + "%", this.handle.stop(1, 1)[j ? "animate" : "css"](k, h.animate), "min" === g && "horizontal" === this.orientation && this.range.stop(1, 1)[j ? "animate" : "css"]({
                    width: c + "%"
                }, h.animate), "max" === g && "horizontal" === this.orientation && this.range[j ? "animate" : "css"]({
                    width: 100 - c + "%"
                }, {
                    queue: !1,
                    duration: h.animate
                }), "min" === g && "vertical" === this.orientation && this.range.stop(1, 1)[j ? "animate" : "css"]({
                    height: c + "%"
                }, h.animate), "max" === g && "vertical" === this.orientation && this.range[j ? "animate" : "css"]({
                    height: 100 - c + "%"
                }, {
                    queue: !1,
                    duration: h.animate
                }))
            },
            _handleEvents: {
                keydown: function(b) {
                    var c, d, e, f, g = a(b.target).data("ui-slider-handle-index");
                    switch (b.keyCode) {
                        case a.ui.keyCode.HOME:
                        case a.ui.keyCode.END:
                        case a.ui.keyCode.PAGE_UP:
                        case a.ui.keyCode.PAGE_DOWN:
                        case a.ui.keyCode.UP:
                        case a.ui.keyCode.RIGHT:
                        case a.ui.keyCode.DOWN:
                        case a.ui.keyCode.LEFT:
                            if (b.preventDefault(), !this._keySliding && (this._keySliding = !0, a(b.target).addClass("ui-state-active"), c = this._start(b, g), c === !1)) return
                    }
                    switch (f = this.options.step, d = e = this.options.values && this.options.values.length ? this.values(g) : this.value(), b.keyCode) {
                        case a.ui.keyCode.HOME:
                            e = this._valueMin();
                            break;
                        case a.ui.keyCode.END:
                            e = this._valueMax();
                            break;
                        case a.ui.keyCode.PAGE_UP:
                            e = this._trimAlignValue(d + (this._valueMax() - this._valueMin()) / this.numPages);
                            break;
                        case a.ui.keyCode.PAGE_DOWN:
                            e = this._trimAlignValue(d - (this._valueMax() - this._valueMin()) / this.numPages);
                            break;
                        case a.ui.keyCode.UP:
                        case a.ui.keyCode.RIGHT:
                            if (d === this._valueMax()) return;
                            e = this._trimAlignValue(d + f);
                            break;
                        case a.ui.keyCode.DOWN:
                        case a.ui.keyCode.LEFT:
                            if (d === this._valueMin()) return;
                            e = this._trimAlignValue(d - f)
                    }
                    this._slide(b, g, e)
                },
                keyup: function(b) {
                    var c = a(b.target).data("ui-slider-handle-index");
                    this._keySliding && (this._keySliding = !1, this._stop(b, c), this._change(b, c), a(b.target).removeClass("ui-state-active"))
                }
            }
        }), a.widget("ui.tooltip", {
            version: "1.11.4",
            options: {
                content: function() {
                    var b = a(this).attr("title") || "";
                    return a("<a>").text(b).html()
                },
                hide: !0,
                items: "[title]:not([disabled])",
                position: {
                    my: "left top+15",
                    at: "left bottom",
                    collision: "flipfit flip"
                },
                show: !0,
                tooltipClass: null,
                track: !1,
                close: null,
                open: null
            },
            _addDescribedBy: function(b, c) {
                var d = (b.attr("aria-describedby") || "").split(/\s+/);
                d.push(c), b.data("ui-tooltip-id", c).attr("aria-describedby", a.trim(d.join(" ")))
            },
            _removeDescribedBy: function(b) {
                var c = b.data("ui-tooltip-id"),
                    d = (b.attr("aria-describedby") || "").split(/\s+/),
                    e = a.inArray(c, d); - 1 !== e && d.splice(e, 1), b.removeData("ui-tooltip-id"), d = a.trim(d.join(" ")), d ? b.attr("aria-describedby", d) : b.removeAttr("aria-describedby")
            },
            _create: function() {
                this._on({
                    mouseover: "open",
                    focusin: "open"
                }), this.tooltips = {}, this.parents = {}, this.options.disabled && this._disable(), this.liveRegion = a("<div>").attr({
                    role: "log",
                    "aria-live": "assertive",
                    "aria-relevant": "additions"
                }).addClass("ui-helper-hidden-accessible").appendTo(this.document[0].body)
            },
            _setOption: function(b, c) {
                var d = this;
                return "disabled" === b ? (this[c ? "_disable" : "_enable"](), void(this.options[b] = c)) : (this._super(b, c), void("content" === b && a.each(this.tooltips, function(a, b) {
                    d._updateContent(b.element)
                })))
            },
            _disable: function() {
                var b = this;
                a.each(this.tooltips, function(c, d) {
                    var e = a.Event("blur");
                    e.target = e.currentTarget = d.element[0], b.close(e, !0)
                }), this.element.find(this.options.items).addBack().each(function() {
                    var b = a(this);
                    b.is("[title]") && b.data("ui-tooltip-title", b.attr("title")).removeAttr("title")
                })
            },
            _enable: function() {
                this.element.find(this.options.items).addBack().each(function() {
                    var b = a(this);
                    b.data("ui-tooltip-title") && b.attr("title", b.data("ui-tooltip-title"))
                })
            },
            open: function(b) {
                var c = this,
                    d = a(b ? b.target : this.element).closest(this.options.items);
                d.length && !d.data("ui-tooltip-id") && (d.attr("title") && d.data("ui-tooltip-title", d.attr("title")), d.data("ui-tooltip-open", !0), b && "mouseover" === b.type && d.parents().each(function() {
                    var b, d = a(this);
                    d.data("ui-tooltip-open") && (b = a.Event("blur"), b.target = b.currentTarget = this, c.close(b, !0)), d.attr("title") && (d.uniqueId(), c.parents[this.id] = {
                        element: this,
                        title: d.attr("title")
                    }, d.attr("title", ""))
                }), this._registerCloseHandlers(b, d), this._updateContent(d, b))
            },
            _updateContent: function(a, b) {
                var c, d = this.options.content,
                    e = this,
                    f = b ? b.type : null;
                return "string" == typeof d ? this._open(b, a, d) : (c = d.call(a[0], function(c) {
                    e._delay(function() {
                        a.data("ui-tooltip-open") && (b && (b.type = f), this._open(b, a, c))
                    })
                }), void(c && this._open(b, a, c)))
            },
            _open: function(b, c, d) {
                function e(a) {
                    j.of = a, g.is(":hidden") || g.position(j)
                }
                var f, g, h, i, j = a.extend({}, this.options.position);

                if (d) {
                    if (f = this._find(c)) return void f.tooltip.find(".ui-tooltip-content").html(d);
                    c.is("[title]") && (b && "mouseover" === b.type ? c.attr("title", "") : c.removeAttr("title")), f = this._tooltip(c), g = f.tooltip, this._addDescribedBy(c, g.attr("id")), g.find(".ui-tooltip-content").html(d), this.liveRegion.children().hide(), d.clone ? (i = d.clone(), i.removeAttr("id").find("[id]").removeAttr("id")) : i = d, a("<div>").html(i).appendTo(this.liveRegion), this.options.track && b && /^mouse/.test(b.type) ? (this._on(this.document, {
                        mousemove: e
                    }), e(b)) : g.position(a.extend({
                        of: c
                    }, this.options.position)), g.hide(), this._show(g, this.options.show), this.options.show && this.options.show.delay && (h = this.delayedShow = setInterval(function() {
                        g.is(":visible") && (e(j.of), clearInterval(h))
                    }, a.fx.interval)), this._trigger("open", b, {
                        tooltip: g
                    })
                }
            },
            _registerCloseHandlers: function(b, c) {
                var d = {
                    keyup: function(b) {
                        if (b.keyCode === a.ui.keyCode.ESCAPE) {
                            var d = a.Event(b);
                            d.currentTarget = c[0], this.close(d, !0)
                        }
                    }
                };
                c[0] !== this.element[0] && (d.remove = function() {
                    this._removeTooltip(this._find(c).tooltip)
                }), b && "mouseover" !== b.type || (d.mouseleave = "close"), b && "focusin" !== b.type || (d.focusout = "close"), this._on(!0, c, d)
            },
            close: function(b) {
                var c, d = this,
                    e = a(b ? b.currentTarget : this.element),
                    f = this._find(e);
                return f ? (c = f.tooltip, void(f.closing || (clearInterval(this.delayedShow), e.data("ui-tooltip-title") && !e.attr("title") && e.attr("title", e.data("ui-tooltip-title")), this._removeDescribedBy(e), f.hiding = !0, c.stop(!0), this._hide(c, this.options.hide, function() {
                    d._removeTooltip(a(this))
                }), e.removeData("ui-tooltip-open"), this._off(e, "mouseleave focusout keyup"), e[0] !== this.element[0] && this._off(e, "remove"), this._off(this.document, "mousemove"), b && "mouseleave" === b.type && a.each(this.parents, function(b, c) {
                    a(c.element).attr("title", c.title), delete d.parents[b]
                }), f.closing = !0, this._trigger("close", b, {
                    tooltip: c
                }), f.hiding || (f.closing = !1)))) : void e.removeData("ui-tooltip-open")
            },
            _tooltip: function(b) {
                var c = a("<div>").attr("role", "tooltip").addClass("ui-tooltip ui-widget ui-corner-all ui-widget-content " + (this.options.tooltipClass || "")),
                    d = c.uniqueId().attr("id");
                return a("<div>").addClass("ui-tooltip-content").appendTo(c), c.appendTo(this.document[0].body), this.tooltips[d] = {
                    element: b,
                    tooltip: c
                }
            },
            _find: function(a) {
                var b = a.data("ui-tooltip-id");
                return b ? this.tooltips[b] : null
            },
            _removeTooltip: function(a) {
                a.remove(), delete this.tooltips[a.attr("id")]
            },
            _destroy: function() {
                var b = this;
                a.each(this.tooltips, function(c, d) {
                    var e = a.Event("blur"),
                        f = d.element;
                    e.target = e.currentTarget = f[0], b.close(e, !0), a("#" + c).remove(), f.data("ui-tooltip-title") && (f.attr("title") || f.attr("title", f.data("ui-tooltip-title")), f.removeData("ui-tooltip-title"))
                }), this.liveRegion.remove()
            }
        })
    }), function(a) {
        var b = a.ajax,
            c = {},
            d = [],
            e = [];
        a.ajax = function(a) {
            a = jQuery.extend(a, jQuery.extend({}, jQuery.ajaxSettings, a));
            var f = a.port;
            switch (a.mode) {
                case "abort":
                    return c[f] && c[f].abort(), c[f] = b.apply(this, arguments);
                case "queue":
                    var g = a.complete;
                    return a.complete = function() {
                        g && g.apply(this, arguments), jQuery([b]).dequeue("ajax" + f)
                    }, void jQuery([b]).queue("ajax" + f, function() {
                        b(a)
                    });
                case "sync":
                    var h = d.length;
                    d[h] = {
                        error: a.error,
                        success: a.success,
                        complete: a.complete,
                        done: !1
                    }, e[h] = {
                        error: [],
                        success: [],
                        complete: []
                    }, a.error = function() {
                        e[h].error = arguments
                    }, a.success = function() {
                        e[h].success = arguments
                    }, a.complete = function() {
                        if (e[h].complete = arguments, d[h].done = !0, 0 == h || !d[h - 1])
                            for (var a = h; a < d.length && d[a].done; a++) d[a].error && d[a].error.apply(jQuery, e[a].error), d[a].success && d[a].success.apply(jQuery, e[a].success), d[a].complete && d[a].complete.apply(jQuery, e[a].complete), d[a] = null, e[a] = null
                    }
            }
            return b.apply(this, arguments)
        }
    }(jQuery), function(a) {
        a.fn.extend({
            autocomplete: function(b, c) {
                var d = "string" == typeof b;
                return c = a.extend({}, a.Autocompleter.defaults, {
                    url: d ? b : null,
                    data: d ? null : b,
                    delay: d ? a.Autocompleter.defaults.delay : 10,
                    max: c && !c.scroll ? 10 : 150
                }, c), c.highlight = c.highlight || function(a) {
                    return a
                }, c.formatMatch = c.formatMatch || c.formatItem, this.each(function() {
                    new a.Autocompleter(this, c)
                })
            },
            result: function(a) {
                return this.bind("result", a)
            },
            search: function(a) {
                return this.trigger("search", [a])
            },
            flushCache: function() {
                return this.trigger("flushCache")
            },
            setOptions: function(a) {
                return this.trigger("setOptions", [a])
            },
            unautocomplete: function() {
                return this.trigger("unautocomplete")
            }
        }), a.Autocompleter = function(b, c) {
            function d() {
                var a = x.selected();
                if (!a) return !1;
                var b = a.result;
                if (t = b, c.multiple) {
                    var d = f(s.val());
                    d.length > 1 && (b = d.slice(0, d.length - 1).join(c.multipleSeparator) + c.multipleSeparator + b), b += c.multipleSeparator
                }
                return s.val(b), j(), s.trigger("result", [a.data, a.value]), !0
            }

            function e(a, b) {
                if (p == r.DEL) return void x.hide();
                var d = s.val();
                (b || d != t) && (t = d, d = g(d), d.length >= c.minChars ? (s.addClass(c.loadingClass), c.matchCase || (d = d.toLowerCase()), l(d, k, j)) : (n(), x.hide()))
            }

            function f(b) {
                if (!b) return [""];
                var d = b.split(c.multipleSeparator),
                    e = [];
                return a.each(d, function(b, c) {
                    a.trim(c) && (e[b] = a.trim(c))
                }), e
            }

            function g(a) {
                if (!c.multiple) return a;
                var b = f(a);
                return b[b.length - 1]
            }

            function h(d, e) {
                c.autoFill && g(s.val()).toLowerCase() == d.toLowerCase() && p != r.BACKSPACE && (s.val(s.val() + e.substring(g(t).length)), a.Autocompleter.Selection(b, t.length, t.length + e.length))
            }

            function i() {
                clearTimeout(o), o = setTimeout(j, 200)
            }

            function j() {
                var d = x.visible();
                x.hide(), clearTimeout(o), n(), c.mustMatch && s.search(function(a) {
                    if (!a)
                        if (c.multiple) {
                            var b = f(s.val()).slice(0, -1);
                            s.val(b.join(c.multipleSeparator) + (b.length ? c.multipleSeparator : ""))
                        } else s.val("")
                }), d && a.Autocompleter.Selection(b, b.value.length, b.value.length)
            }

            function k(a, b) {
                b && b.length && v ? (n(), x.display(b, a), h(a, b[0].value), x.show()) : j()
            }

            function l(d, e, f) {
                c.matchCase || (d = d.toLowerCase());
                var h = u.load(d);
                if (h && h.length) e(d, h);
                else if ("string" == typeof c.url && c.url.length > 0) {
                    var i = {
                        timestamp: +new Date
                    };
                    a.each(c.extraParams, function(a, b) {
                        i[a] = "function" == typeof b ? b() : b
                    });
                    var h = "function" == typeof c.extraParams ? a.extend({}, c.extraParams()) : a.extend({
                        q: g(d),
                        limit: c.max
                    }, i);
                    a.ajax({
                        mode: "abort",
                        port: "autocomplete" + b.name,
                        dataType: c.dataType,
                        url: c.url,
                        type: c.type || "POST",
                        data: h,
                        success: function(a) {
                            var b = c.parse && c.parse(a) || m(a);
                            u.add(d, b), e(d, b)
                        }
                    })
                } else x.emptyList(), f(d)
            }

            function m(b) {
                for (var d = [], e = b.split("\n"), f = 0; f < e.length; f++) {
                    var g = a.trim(e[f]);
                    g && (g = g.split("|"), d[d.length] = {
                        data: g,
                        value: g[0],
                        result: c.formatResult && c.formatResult(g, g[0]) || g[0]
                    })
                }
                return d
            }

            function n() {
                s.removeClass(c.loadingClass)
            }
            var o, p, q, r = {
                    UP: 38,
                    DOWN: 40,
                    DEL: 46,
                    TAB: 9,
                    RETURN: 13,
                    ESC: 27,
                    COMMA: 188,
                    PAGEUP: 33,
                    PAGEDOWN: 34,
                    BACKSPACE: 8
                },
                s = a(b).attr("autocomplete", "off").addClass(c.inputClass),
                t = "",
                u = a.Autocompleter.Cache(c),
                v = 0,
                w = {
                    mouseDownOnSelect: !1
                },
                x = a.Autocompleter.Select(c, b, d, w);
            a.browser.opera && a(b.form).bind("submit.autocomplete", function() {
                return q ? (q = !1, !1) : void 0
            }), s.bind((a.browser.opera ? "keypress" : "keydown") + ".autocomplete", function(b) {
                switch (p = b.keyCode, b.keyCode) {
                    case r.UP:
                        b.preventDefault(), x.visible() ? x.prev() : e(0, !0);
                        break;
                    case r.DOWN:
                        b.preventDefault(), x.visible() ? x.next() : e(0, !0);
                        break;
                    case r.PAGEUP:
                        b.preventDefault(), x.visible() ? x.pageUp() : e(0, !0);
                        break;
                    case r.PAGEDOWN:
                        b.preventDefault(), x.visible() ? x.pageDown() : e(0, !0);
                        break;
                    case c.multiple && "," == a.trim(c.multipleSeparator) && r.COMMA:
                    case r.TAB:
                    case r.RETURN:
                        if (d()) return b.preventDefault(), q = !0, !1;
                        break;
                    case r.ESC:
                        x.hide();
                        break;
                    default:
                        clearTimeout(o), o = setTimeout(e, c.delay)
                }
            }).focus(function() {
                v++
            }).blur(function() {
                v = 0, w.mouseDownOnSelect || i()
            }).click(function() {
                v++ > 1 && !x.visible() && e(0, !0)
            }).bind("search", function() {
                function b(a, b) {
                    var d;
                    if (b && b.length)
                        for (var e = 0; e < b.length; e++)
                            if (b[e].result.toLowerCase() == a.toLowerCase()) {
                                d = b[e];
                                break
                            }
                            "function" == typeof c ? c(d) : s.trigger("result", d && [d.data, d.value])
                }
                var c = arguments.length > 1 ? arguments[1] : null;
                a.each(f(s.val()), function(a, c) {
                    l(c, b, b)
                })
            }).bind("flushCache", function() {
                u.flush()
            }).bind("setOptions", function() {
                a.extend(c, arguments[1]), "data" in arguments[1] && u.populate()
            }).bind("unautocomplete", function() {
                x.unbind(), s.unbind(), a(b.form).unbind(".autocomplete")
            })
        }, a.Autocompleter.defaults = {
            inputClass: "ac_input",
            resultsClass: "ac_results",
            loadingClass: "ac_loading",
            minChars: 1,
            delay: 400,
            matchCase: !1,
            matchSubset: !0,
            matchContains: !1,
            cacheLength: 10,
            max: 100,
            mustMatch: !1,
            extraParams: {},
            selectFirst: !0,
            formatItem: function(a) {
                return a[0]
            },
            formatMatch: null,
            autoFill: !1,
            width: 0,
            multiple: !1,
            multipleSeparator: ", ",
            highlight: function(a, b) {
                return a.replace(new RegExp("(?![^&;]+;)(?!<[^<>]*)(" + b.replace(/([\^\$\(\)\[\]\{\}\*\.\+\?\|\\])/gi, "\\$1") + ")(?![^<>]*>)(?![^&;]+;)", "gi"), "<strong>$1</strong>")
            },
            scroll: !0,
            scrollHeight: 180
        }, a.Autocompleter.Cache = function(b) {
            function c(a, c) {
                b.matchCase || (a = a.toLowerCase());
                var d = a.indexOf(c);
                return -1 == d ? !1 : 0 == d || b.matchContains
            }

            function d(a, c) {
                h > b.cacheLength && f(), g[a] || h++, g[a] = c
            }

            function e() {
                if (!b.data) return !1;
                var c = {},
                    e = 0;
                b.url || (b.cacheLength = 1), c[""] = [];
                for (var f = 0, g = b.data.length; g > f; f++) {
                    var h = b.data[f];
                    h = "string" == typeof h ? [h] : h;
                    var i = b.formatMatch(h, f + 1, b.data.length);
                    if (i !== !1) {
                        var j = i.charAt(0).toLowerCase();
                        c[j] || (c[j] = []);
                        var k = {
                            value: i,
                            data: h,
                            result: b.formatResult && b.formatResult(h) || i
                        };
                        c[j].push(k), e++ < b.max && c[""].push(k)
                    }
                }
                a.each(c, function(a, c) {
                    b.cacheLength++, d(a, c)
                })
            }

            function f() {
                g = {}, h = 0
            }
            var g = {},
                h = 0;
            return setTimeout(e, 25), {
                flush: f,
                add: d,
                populate: e,
                load: function(d) {
                    if (!b.cacheLength || !h) return null;
                    if (!b.url && b.matchContains) {
                        var e = [];
                        for (var f in g)
                            if (f.length > 0) {
                                var i = g[f];
                                a.each(i, function(a, b) {
                                    c(b.value, d) && e.push(b)
                                })
                            }
                        return e
                    }
                    if (g[d]) return g[d];
                    if (b.matchSubset)
                        for (var j = d.length - 1; j >= b.minChars; j--) {
                            var i = g[d.substr(0, j)];
                            if (i) {
                                var e = [];
                                return a.each(i, function(a, b) {
                                    c(b.value, d) && (e[e.length] = b)
                                }), e
                            }
                        }
                    return null
                }
            }
        }, a.Autocompleter.Select = function(b, c, d, e) {
            function f() {
                s && (n = a("<div/>").hide().addClass(b.resultsClass).css("position", "absolute").appendTo(document.body), o = a("<ul/>").appendTo(n).mouseover(function(b) {
                    g(b).nodeName && "LI" == g(b).nodeName.toUpperCase() && (q = a("li", o).removeClass(p.ACTIVE).index(g(b)), a(g(b)).addClass(p.ACTIVE))
                }).click(function(b) {
                    return a(g(b)).addClass(p.ACTIVE), d(), c.focus(), !1
                }).mousedown(function() {
                    e.mouseDownOnSelect = !0
                }).mouseup(function() {
                    e.mouseDownOnSelect = !1
                }), b.width > 0 && n.css("width", b.width), s = !1)
            }

            function g(a) {
                for (var b = a.target; b && "LI" != b.tagName;) b = b.parentNode;
                return b ? b : []
            }

            function h(a) {
                l.slice(q, q + 1).removeClass(p.ACTIVE), i(a);
                var c = l.slice(q, q + 1).addClass(p.ACTIVE);
                if (b.scroll) {
                    var d = 0;
                    l.slice(0, q).each(function() {
                        d += this.offsetHeight
                    }), d + c[0].offsetHeight - o.scrollTop() > o[0].clientHeight ? o.scrollTop(d + c[0].offsetHeight - o.innerHeight()) : d < o.scrollTop() && o.scrollTop(d)
                }
            }

            function i(a) {
                q += a, 0 > q ? q = l.size() - 1 : q >= l.size() && (q = 0)
            }

            function j(a) {
                return b.max && b.max < a ? b.max : a
            }

            function k() {
                o.empty();
                for (var c = j(m.length), d = 0; c > d; d++)
                    if (m[d]) {
                        var e = b.formatItem(m[d].data, d + 1, c, m[d].value, r);
                        if (e !== !1) {
                            var f = a("<li/>").html(b.highlight(e, r)).addClass(d % 2 == 0 ? "ac_even" : "ac_odd").appendTo(o)[0];
                            a.data(f, "ac_data", m[d])
                        }
                    }
                l = o.find("li"), b.selectFirst && (l.slice(0, 1).addClass(p.ACTIVE), q = 0), a.fn.bgiframe && o.bgiframe()
            }
            var l, m, n, o, p = {
                    ACTIVE: "ac_over"
                },
                q = -1,
                r = "",
                s = !0;
            return {
                display: function(a, b) {
                    f(), m = a, r = b, k()
                },
                next: function() {
                    h(1)
                },
                prev: function() {
                    h(-1)
                },
                pageUp: function() {
                    h(0 != q && 0 > q - 8 ? -q : -8)
                },
                pageDown: function() {
                    h(q != l.size() - 1 && q + 8 > l.size() ? l.size() - 1 - q : 8)
                },
                hide: function() {
                    n && n.hide(), l && l.removeClass(p.ACTIVE), q = -1
                },
                visible: function() {
                    return n && n.is(":visible")
                },
                current: function() {
                    return this.visible() && (l.filter("." + p.ACTIVE)[0] || b.selectFirst && l[0])
                },
                show: function() {
                    var d = a(c).offset();
                    if (n.css({
                            width: "string" == typeof b.width || b.width > 0 ? b.width : a(c).width(),
                            top: d.top + c.offsetHeight,
                            left: d.left
                        }).show(), b.scroll && (o.scrollTop(0), o.css({
                            maxHeight: b.scrollHeight,
                            overflow: "auto"
                        }), a.browser.msie && "undefined" == typeof document.body.style.maxHeight)) {
                        var e = 0;
                        l.each(function() {
                            e += this.offsetHeight
                        });
                        var f = e > b.scrollHeight;
                        o.css("height", f ? b.scrollHeight : e), f || l.width(o.width() - parseInt(l.css("padding-left")) - parseInt(l.css("padding-right")))
                    }
                },
                selected: function() {
                    var b = l && l.filter("." + p.ACTIVE).removeClass(p.ACTIVE);
                    return b && b.length && a.data(b[0], "ac_data")
                },
                emptyList: function() {
                    o && o.empty()
                },
                unbind: function() {
                    n && n.remove()
                }
            }
        }, a.Autocompleter.Selection = function(a, b, c) {
            if (a.createTextRange) {
                var d = a.createTextRange();
                d.collapse(!0), d.moveStart("character", b), d.moveEnd("character", c), d.select()
            } else a.setSelectionRange ? a.setSelectionRange(b, c) : a.selectionStart && (a.selectionStart = b, a.selectionEnd = c);
            a.focus()
        }
    }(jQuery), function(a) {
        a.fn.bgIframe = a.fn.bgiframe = function(b) {
            if (a.browser.msie && /6.0/.test(navigator.userAgent)) {
                b = a.extend({
                    top: "auto",
                    left: "auto",
                    width: "auto",
                    height: "auto",
                    opacity: !0,
                    src: "javascript:false;"
                }, b || {});
                var c = function(a) {
                        return a && a.constructor == Number ? a + "px" : a
                    },
                    d = '<iframe class="bgiframe"frameborder="0"tabindex="-1"src="' + b.src + '"style="display:block;position:absolute;z-index:-1;' + (b.opacity !== !1 ? "filter:Alpha(Opacity='0');" : "") + "top:" + ("auto" == b.top ? "expression(((parseInt(this.parentNode.currentStyle.borderTopWidth)||0)*-1)+'px')" : c(b.top)) + ";left:" + ("auto" == b.left ? "expression(((parseInt(this.parentNode.currentStyle.borderLeftWidth)||0)*-1)+'px')" : c(b.left)) + ";width:" + ("auto" == b.width ? "expression(this.parentNode.offsetWidth+'px')" : c(b.width)) + ";height:" + ("auto" == b.height ? "expression(this.parentNode.offsetHeight+'px')" : c(b.height)) + ';"/>';
                return this.each(function() {
                    0 == a("> iframe.bgiframe", this).length && this.insertBefore(document.createElement(d), this.firstChild)
                })
            }
            return this
        }
    }(jQuery), function(a, b) {
        function c(a, b, c) {
            var d = l[b.type] || {};
            return null == a ? c || !b.def ? null : b.def : (a = d.floor ? ~~a : parseFloat(a), isNaN(a) ? b.def : d.mod ? (a + d.mod) % d.mod : 0 > a ? 0 : d.max < a ? d.max : a)
        }

        function d(b) {
            var c = j(),
                d = c._rgba = [];
            return b = b.toLowerCase(), o(i, function(a, e) {
                var f, g = e.re.exec(b),
                    h = g && e.parse(g),
                    i = e.space || "rgba";
                return h ? (f = c[i](h), c[k[i].cache] = f[k[i].cache], d = c._rgba = f._rgba, !1) : void 0
            }), d.length ? ("0,0,0,0" === d.join() && a.extend(d, f.transparent), c) : f[b]
        }

        function e(a, b, c) {
            return c = (c + 1) % 1, 1 > 6 * c ? a + (b - a) * c * 6 : 1 > 2 * c ? b : 2 > 3 * c ? a + (b - a) * (2 / 3 - c) * 6 : a
        }
        var f, g = "backgroundColor borderBottomColor borderLeftColor borderRightColor borderTopColor color columnRuleColor outlineColor textDecorationColor textEmphasisColor",
            h = /^([\-+])=\s*(\d+\.?\d*)/,
            i = [{
                re: /rgba?\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*(?:,\s*(\d?(?:\.\d+)?)\s*)?\)/,
                parse: function(a) {
                    return [a[1], a[2], a[3], a[4]]
                }
            }, {
                re: /rgba?\(\s*(\d+(?:\.\d+)?)\%\s*,\s*(\d+(?:\.\d+)?)\%\s*,\s*(\d+(?:\.\d+)?)\%\s*(?:,\s*(\d?(?:\.\d+)?)\s*)?\)/,
                parse: function(a) {
                    return [2.55 * a[1], 2.55 * a[2], 2.55 * a[3], a[4]]
                }
            }, {
                re: /#([a-f0-9]{2})([a-f0-9]{2})([a-f0-9]{2})/,
                parse: function(a) {
                    return [parseInt(a[1], 16), parseInt(a[2], 16), parseInt(a[3], 16)]
                }
            }, {
                re: /#([a-f0-9])([a-f0-9])([a-f0-9])/,
                parse: function(a) {
                    return [parseInt(a[1] + a[1], 16), parseInt(a[2] + a[2], 16), parseInt(a[3] + a[3], 16)]
                }
            }, {
                re: /hsla?\(\s*(\d+(?:\.\d+)?)\s*,\s*(\d+(?:\.\d+)?)\%\s*,\s*(\d+(?:\.\d+)?)\%\s*(?:,\s*(\d?(?:\.\d+)?)\s*)?\)/,
                space: "hsla",
                parse: function(a) {
                    return [a[1], a[2] / 100, a[3] / 100, a[4]]
                }
            }],
            j = a.Color = function(b, c, d, e) {
                return new a.Color.fn.parse(b, c, d, e)
            },
            k = {
                rgba: {
                    props: {
                        red: {
                            idx: 0,
                            type: "byte"
                        },
                        green: {
                            idx: 1,
                            type: "byte"
                        },
                        blue: {
                            idx: 2,
                            type: "byte"
                        }
                    }
                },
                hsla: {
                    props: {
                        hue: {
                            idx: 0,
                            type: "degrees"
                        },
                        saturation: {
                            idx: 1,
                            type: "percent"
                        },
                        lightness: {
                            idx: 2,
                            type: "percent"
                        }
                    }
                }
            },
            l = {
                "byte": {
                    floor: !0,
                    max: 255
                },
                percent: {
                    max: 1
                },
                degrees: {
                    mod: 360,
                    floor: !0
                }
            },
            m = j.support = {},
            n = a("<p>")[0],
            o = a.each;
        n.style.cssText = "background-color:rgba(1,1,1,.5)", m.rgba = n.style.backgroundColor.indexOf("rgba") > -1, o(k, function(a, b) {
            b.cache = "_" + a, b.props.alpha = {
                idx: 3,
                type: "percent",
                def: 1
            }
        }), j.fn = a.extend(j.prototype, {
            parse: function(e, g, h, i) {
                if (e === b) return this._rgba = [null, null, null, null], this;
                (e.jquery || e.nodeType) && (e = a(e).css(g), g = b);
                var l = this,
                    m = a.type(e),
                    n = this._rgba = [];
                return g !== b && (e = [e, g, h, i], m = "array"), "string" === m ? this.parse(d(e) || f._default) : "array" === m ? (o(k.rgba.props, function(a, b) {
                    n[b.idx] = c(e[b.idx], b)
                }), this) : "object" === m ? (e instanceof j ? o(k, function(a, b) {
                    e[b.cache] && (l[b.cache] = e[b.cache].slice())
                }) : o(k, function(b, d) {
                    var f = d.cache;
                    o(d.props, function(a, b) {
                        if (!l[f] && d.to) {
                            if ("alpha" === a || null == e[a]) return;
                            l[f] = d.to(l._rgba)
                        }
                        l[f][b.idx] = c(e[a], b, !0)
                    }), l[f] && a.inArray(null, l[f].slice(0, 3)) < 0 && (l[f][3] = 1, d.from && (l._rgba = d.from(l[f])))
                }), this) : void 0
            },
            is: function(a) {
                var b = j(a),
                    c = !0,
                    d = this;
                return o(k, function(a, e) {
                    var f, g = b[e.cache];
                    return g && (f = d[e.cache] || e.to && e.to(d._rgba) || [], o(e.props, function(a, b) {
                        return null != g[b.idx] ? c = g[b.idx] === f[b.idx] : void 0
                    })), c
                }), c
            },
            _space: function() {
                var a = [],
                    b = this;
                return o(k, function(c, d) {
                    b[d.cache] && a.push(c)
                }), a.pop()
            },
            transition: function(a, b) {
                var d = j(a),
                    e = d._space(),
                    f = k[e],
                    g = 0 === this.alpha() ? j("transparent") : this,
                    h = g[f.cache] || f.to(g._rgba),
                    i = h.slice();
                return d = d[f.cache], o(f.props, function(a, e) {
                    var f = e.idx,
                        g = h[f],
                        j = d[f],
                        k = l[e.type] || {};
                    null !== j && (null === g ? i[f] = j : (k.mod && (j - g > k.mod / 2 ? g += k.mod : g - j > k.mod / 2 && (g -= k.mod)), i[f] = c((j - g) * b + g, e)))
                }), this[e](i)
            },
            blend: function(b) {
                if (1 === this._rgba[3]) return this;
                var c = this._rgba.slice(),
                    d = c.pop(),
                    e = j(b)._rgba;
                return j(a.map(c, function(a, b) {
                    return (1 - d) * e[b] + d * a
                }))
            },
            toRgbaString: function() {
                var b = "rgba(",
                    c = a.map(this._rgba, function(a, b) {
                        return null == a ? b > 2 ? 1 : 0 : a
                    });
                return 1 === c[3] && (c.pop(), b = "rgb("), b + c.join() + ")"
            },
            toHslaString: function() {
                var b = "hsla(",
                    c = a.map(this.hsla(), function(a, b) {
                        return null == a && (a = b > 2 ? 1 : 0), b && 3 > b && (a = Math.round(100 * a) + "%"), a
                    });
                return 1 === c[3] && (c.pop(), b = "hsl("), b + c.join() + ")"
            },
            toHexString: function(b) {
                var c = this._rgba.slice(),
                    d = c.pop();
                return b && c.push(~~(255 * d)), "#" + a.map(c, function(a) {
                    return a = (a || 0).toString(16), 1 === a.length ? "0" + a : a
                }).join("")
            },
            toString: function() {
                return 0 === this._rgba[3] ? "transparent" : this.toRgbaString()
            }
        }), j.fn.parse.prototype = j.fn, k.hsla.to = function(a) {
            if (null == a[0] || null == a[1] || null == a[2]) return [null, null, null, a[3]];
            var b, c, d = a[0] / 255,
                e = a[1] / 255,
                f = a[2] / 255,
                g = a[3],
                h = Math.max(d, e, f),
                i = Math.min(d, e, f),
                j = h - i,
                k = h + i,
                l = .5 * k;
            return b = i === h ? 0 : d === h ? 60 * (e - f) / j + 360 : e === h ? 60 * (f - d) / j + 120 : 60 * (d - e) / j + 240, c = 0 === j ? 0 : .5 >= l ? j / k : j / (2 - k), [Math.round(b) % 360, c, l, null == g ? 1 : g]
        }, k.hsla.from = function(a) {
            if (null == a[0] || null == a[1] || null == a[2]) return [null, null, null, a[3]];
            var b = a[0] / 360,
                c = a[1],
                d = a[2],
                f = a[3],
                g = .5 >= d ? d * (1 + c) : d + c - d * c,
                h = 2 * d - g;
            return [Math.round(255 * e(h, g, b + 1 / 3)), Math.round(255 * e(h, g, b)), Math.round(255 * e(h, g, b - 1 / 3)), f]
        }, o(k, function(d, e) {
            var f = e.props,
                g = e.cache,
                i = e.to,
                k = e.from;
            j.fn[d] = function(d) {
                if (i && !this[g] && (this[g] = i(this._rgba)), d === b) return this[g].slice();
                var e, h = a.type(d),
                    l = "array" === h || "object" === h ? d : arguments,
                    m = this[g].slice();
                return o(f, function(a, b) {
                    var d = l["object" === h ? a : b.idx];
                    null == d && (d = m[b.idx]), m[b.idx] = c(d, b)
                }), k ? (e = j(k(m)), e[g] = m, e) : j(m)
            }, o(f, function(b, c) {
                j.fn[b] || (j.fn[b] = function(e) {
                    var f, g = a.type(e),
                        i = "alpha" === b ? this._hsla ? "hsla" : "rgba" : d,
                        j = this[i](),
                        k = j[c.idx];
                    return "undefined" === g ? k : ("function" === g && (e = e.call(this, k), g = a.type(e)), null == e && c.empty ? this : ("string" === g && (f = h.exec(e), f && (e = k + parseFloat(f[2]) * ("+" === f[1] ? 1 : -1))), j[c.idx] = e, this[i](j)))
                })
            })
        }), j.hook = function(b) {
            var c = b.split(" ");
            o(c, function(b, c) {
                a.cssHooks[c] = {
                    set: function(b, e) {
                        var f, g, h = "";
                        if ("transparent" !== e && ("string" !== a.type(e) || (f = d(e)))) {
                            if (e = j(f || e), !m.rgba && 1 !== e._rgba[3]) {
                                for (g = "backgroundColor" === c ? b.parentNode : b;
                                    ("" === h || "transparent" === h) && g && g.style;) try {
                                    h = a.css(g, "backgroundColor"), g = g.parentNode
                                } catch (i) {}
                                e = e.blend(h && "transparent" !== h ? h : "_default")
                            }
                            e = e.toRgbaString()
                        }
                        try {
                            b.style[c] = e
                        } catch (i) {}
                    }
                }, a.fx.step[c] = function(b) {
                    b.colorInit || (b.start = j(b.elem, c), b.end = j(b.end), b.colorInit = !0), a.cssHooks[c].set(b.elem, b.start.transition(b.end, b.pos))
                }
            })
        }, j.hook(g), a.cssHooks.borderColor = {
            expand: function(a) {
                var b = {};
                return o(["Top", "Right", "Bottom", "Left"], function(c, d) {
                    b["border" + d + "Color"] = a
                }), b
            }
        }, f = a.Color.names = {
            aqua: "#00ffff",
            black: "#000000",
            blue: "#0000ff",
            fuchsia: "#ff00ff",
            gray: "#808080",
            green: "#008000",
            lime: "#00ff00",
            maroon: "#800000",
            navy: "#000080",
            olive: "#808000",
            purple: "#800080",
            red: "#ff0000",
            silver: "#c0c0c0",
            teal: "#008080",
            white: "#ffffff",
            yellow: "#ffff00",
            transparent: [null, null, null, 0],
            _default: "#ffffff"
        }
    }(jQuery), function(a) {
        "use strict";
        "function" == typeof define && define.amd ? define(["jquery"], a) : a("undefined" != typeof jQuery ? jQuery : window.Zepto)
    }(function(a) {
        "use strict";

        function b(b) {
            var c = b.data;
            b.isDefaultPrevented() || (b.preventDefault(), a(b.target).ajaxSubmit(c))
        }

        function c(b) {
            var c = b.target,
                d = a(c);
            if (!d.is("[type=submit],[type=image]")) {
                var e = d.closest("[type=submit]");
                if (0 === e.length) return;
                c = e[0]
            }
            var f = this;
            if (f.clk = c, "image" == c.type)
                if (void 0 !== b.offsetX) f.clk_x = b.offsetX, f.clk_y = b.offsetY;
                else if ("function" == typeof a.fn.offset) {
                var g = d.offset();
                f.clk_x = b.pageX - g.left, f.clk_y = b.pageY - g.top
            } else f.clk_x = b.pageX - c.offsetLeft, f.clk_y = b.pageY - c.offsetTop;
            setTimeout(function() {
                f.clk = f.clk_x = f.clk_y = null
            }, 100)
        }

        function d() {
            if (a.fn.ajaxSubmit.debug) {
                var b = "[jquery.form] " + Array.prototype.join.call(arguments, "");
                window.console && window.console.log ? window.console.log(b) : window.opera && window.opera.postError && window.opera.postError(b)
            }
        }
        var e = {};
        e.fileapi = void 0 !== a("<input type='file'/>").get(0).files, e.formdata = void 0 !== window.FormData;
        var f = !!a.fn.prop;
        a.fn.attr2 = function() {
            if (!f) return this.attr.apply(this, arguments);
            var a = this.prop.apply(this, arguments);
            return a && a.jquery || "string" == typeof a ? a : this.attr.apply(this, arguments)
        }, a.fn.ajaxSubmit = function(b) {
            function c(c) {
                var d, e, f = a.param(c, b.traditional).split("&"),
                    g = f.length,
                    h = [];
                for (d = 0; g > d; d++) f[d] = f[d].replace(/\+/g, " "), e = f[d].split("="), h.push([decodeURIComponent(e[0]), decodeURIComponent(e[1])]);
                return h
            }

            function g(d) {
                for (var e = new FormData, f = 0; f < d.length; f++) e.append(d[f].name, d[f].value);
                if (b.extraData) {
                    var g = c(b.extraData);
                    for (f = 0; f < g.length; f++) g[f] && e.append(g[f][0], g[f][1])
                }
                b.data = null;
                var h = a.extend(!0, {}, a.ajaxSettings, b, {
                    contentType: !1,
                    processData: !1,
                    cache: !1,
                    type: i || "POST"
                });
                b.uploadProgress && (h.xhr = function() {
                    var c = a.ajaxSettings.xhr();
                    return c.upload && c.upload.addEventListener("progress", function(a) {
                        var c = 0,
                            d = a.loaded || a.position,
                            e = a.total;
                        a.lengthComputable && (c = Math.ceil(d / e * 100)), b.uploadProgress(a, d, e, c)
                    }, !1), c
                }), h.data = null;
                var j = h.beforeSend;
                return h.beforeSend = function(a, c) {
                    c.data = b.formData ? b.formData : e, j && j.call(this, a, c)
                }, a.ajax(h)
            }

            function h(c) {
                function e(a) {
                    var b = null;
                    try {
                        a.contentWindow && (b = a.contentWindow.document)
                    } catch (c) {
                        d("cannot get iframe.contentWindow document: " + c)
                    }
                    if (b) return b;
                    try {
                        b = a.contentDocument ? a.contentDocument : a.document
                    } catch (c) {
                        d("cannot get iframe.contentDocument: " + c), b = a.document
                    }
                    return b
                }

                function g() {
                    function b() {
                        try {
                            var a = e(r).readyState;
                            d("state = " + a), a && "uninitialized" == a.toLowerCase() && setTimeout(b, 50)
                        } catch (c) {
                            d("Server abort: ", c, " (", c.name, ")"), h(A), w && clearTimeout(w), w = void 0
                        }
                    }
                    var c = l.attr2("target"),
                        f = l.attr2("action"),
                        g = "multipart/form-data",
                        j = l.attr("enctype") || l.attr("encoding") || g;
                    x.setAttribute("target", o), (!i || /post/i.test(i)) && x.setAttribute("method", "POST"), f != m.url && x.setAttribute("action", m.url), m.skipEncodingOverride || i && !/post/i.test(i) || l.attr({
                        encoding: "multipart/form-data",
                        enctype: "multipart/form-data"
                    }), m.timeout && (w = setTimeout(function() {
                        v = !0, h(z)
                    }, m.timeout));
                    var k = [];
                    try {
                        if (m.extraData)
                            for (var n in m.extraData) m.extraData.hasOwnProperty(n) && k.push(a.isPlainObject(m.extraData[n]) && m.extraData[n].hasOwnProperty("name") && m.extraData[n].hasOwnProperty("value") ? a('<input type="hidden" name="' + m.extraData[n].name + '">').val(m.extraData[n].value).appendTo(x)[0] : a('<input type="hidden" name="' + n + '">').val(m.extraData[n]).appendTo(x)[0]);
                        m.iframeTarget || q.appendTo("body"), r.attachEvent ? r.attachEvent("onload", h) : r.addEventListener("load", h, !1), setTimeout(b, 15);
                        try {
                            x.submit()
                        } catch (p) {
                            var s = document.createElement("form").submit;
                            s.apply(x)
                        }
                    } finally {
                        x.setAttribute("action", f), x.setAttribute("enctype", j), c ? x.setAttribute("target", c) : l.removeAttr("target"), a(k).remove()
                    }
                }

                function h(b) {
                    if (!s.aborted && !F) {
                        if (E = e(r), E || (d("cannot access response document"), b = A), b === z && s) return s.abort("timeout"), void y.reject(s, "timeout");
                        if (b == A && s) return s.abort("server abort"), void y.reject(s, "error", "server abort");
                        if (E && E.location.href != m.iframeSrc || v) {
                            r.detachEvent ? r.detachEvent("onload", h) : r.removeEventListener("load", h, !1);
                            var c, f = "success";
                            try {
                                if (v) throw "timeout";
                                var g = "xml" == m.dataType || E.XMLDocument || a.isXMLDoc(E);
                                if (d("isXml=" + g), !g && window.opera && (null === E.body || !E.body.innerHTML) && --G) return d("requeing onLoad callback, DOM not available"), void setTimeout(h, 250);
                                var i = E.body ? E.body : E.documentElement;
                                s.responseText = i ? i.innerHTML : null, s.responseXML = E.XMLDocument ? E.XMLDocument : E, g && (m.dataType = "xml"), s.getResponseHeader = function(a) {
                                    var b = {
                                        "content-type": m.dataType
                                    };
                                    return b[a.toLowerCase()]
                                }, i && (s.status = Number(i.getAttribute("status")) || s.status, s.statusText = i.getAttribute("statusText") || s.statusText);
                                var j = (m.dataType || "").toLowerCase(),
                                    k = /(json|script|text)/.test(j);
                                if (k || m.textarea) {
                                    var l = E.getElementsByTagName("textarea")[0];
                                    if (l) s.responseText = l.value, s.status = Number(l.getAttribute("status")) || s.status, s.statusText = l.getAttribute("statusText") || s.statusText;
                                    else if (k) {
                                        var o = E.getElementsByTagName("pre")[0],
                                            p = E.getElementsByTagName("body")[0];
                                        o ? s.responseText = o.textContent ? o.textContent : o.innerText : p && (s.responseText = p.textContent ? p.textContent : p.innerText)
                                    }
                                } else "xml" == j && !s.responseXML && s.responseText && (s.responseXML = H(s.responseText));
                                try {
                                    D = J(s, j, m)
                                } catch (t) {
                                    f = "parsererror", s.error = c = t || f
                                }
                            } catch (t) {
                                d("error caught: ", t), f = "error", s.error = c = t || f
                            }
                            s.aborted && (d("upload aborted"), f = null), s.status && (f = s.status >= 200 && s.status < 300 || 304 === s.status ? "success" : "error"), "success" === f ? (m.success && m.success.call(m.context, D, "success", s), y.resolve(s.responseText, "success", s), n && a.event.trigger("ajaxSuccess", [s, m])) : f && (void 0 === c && (c = s.statusText), m.error && m.error.call(m.context, s, f, c), y.reject(s, "error", c), n && a.event.trigger("ajaxError", [s, m, c])), n && a.event.trigger("ajaxComplete", [s, m]), n && !--a.active && a.event.trigger("ajaxStop"), m.complete && m.complete.call(m.context, s, f), F = !0, m.timeout && clearTimeout(w), setTimeout(function() {
                                m.iframeTarget ? q.attr("src", m.iframeSrc) : q.remove(), s.responseXML = null
                            }, 100)
                        }
                    }
                }
                var j, k, m, n, o, q, r, s, t, u, v, w, x = l[0],
                    y = a.Deferred();
                if (y.abort = function(a) {
                        s.abort(a)
                    }, c)
                    for (k = 0; k < p.length; k++) j = a(p[k]), f ? j.prop("disabled", !1) : j.removeAttr("disabled");
                if (m = a.extend(!0, {}, a.ajaxSettings, b), m.context = m.context || m, o = "jqFormIO" + (new Date).getTime(), m.iframeTarget ? (q = a(m.iframeTarget), u = q.attr2("name"), u ? o = u : q.attr2("name", o)) : (q = a('<iframe name="' + o + '" src="' + m.iframeSrc + '" />'), q.css({
                        position: "absolute",
                        top: "-1000px",
                        left: "-1000px"
                    })), r = q[0], s = {
                        aborted: 0,
                        responseText: null,
                        responseXML: null,
                        status: 0,
                        statusText: "n/a",
                        getAllResponseHeaders: function() {},
                        getResponseHeader: function() {},
                        setRequestHeader: function() {},
                        abort: function(b) {
                            var c = "timeout" === b ? "timeout" : "aborted";
                            d("aborting upload... " + c), this.aborted = 1;
                            try {
                                r.contentWindow.document.execCommand && r.contentWindow.document.execCommand("Stop")
                            } catch (e) {}
                            q.attr("src", m.iframeSrc), s.error = c, m.error && m.error.call(m.context, s, c, b), n && a.event.trigger("ajaxError", [s, m, c]), m.complete && m.complete.call(m.context, s, c)
                        }
                    }, n = m.global, n && 0 === a.active++ && a.event.trigger("ajaxStart"), n && a.event.trigger("ajaxSend", [s, m]), m.beforeSend && m.beforeSend.call(m.context, s, m) === !1) return m.global && a.active--, y.reject(), y;
                if (s.aborted) return y.reject(), y;
                t = x.clk, t && (u = t.name, u && !t.disabled && (m.extraData = m.extraData || {}, m.extraData[u] = t.value, "image" == t.type && (m.extraData[u + ".x"] = x.clk_x, m.extraData[u + ".y"] = x.clk_y)));
                var z = 1,
                    A = 2,
                    B = a("meta[name=csrf-token]").attr("content"),
                    C = a("meta[name=csrf-param]").attr("content");
                C && B && (m.extraData = m.extraData || {}, m.extraData[C] = B), m.forceSync ? g() : setTimeout(g, 10);
                var D, E, F, G = 50,
                    H = a.parseXML || function(a, b) {
                        return window.ActiveXObject ? (b = new ActiveXObject("Microsoft.XMLDOM"), b.async = "false", b.loadXML(a)) : b = (new DOMParser).parseFromString(a, "text/xml"), b && b.documentElement && "parsererror" != b.documentElement.nodeName ? b : null
                    },
                    I = a.parseJSON || function(a) {
                        return window.eval("(" + a + ")")
                    },
                    J = function(b, c, d) {
                        var e = b.getResponseHeader("content-type") || "",
                            f = "xml" === c || !c && e.indexOf("xml") >= 0,
                            g = f ? b.responseXML : b.responseText;
                        return f && "parsererror" === g.documentElement.nodeName && a.error && a.error("parsererror"), d && d.dataFilter && (g = d.dataFilter(g, c)), "string" == typeof g && ("json" === c || !c && e.indexOf("json") >= 0 ? g = I(g) : ("script" === c || !c && e.indexOf("javascript") >= 0) && a.globalEval(g)), g
                    };
                return y
            }
            if (!this.length) return d("ajaxSubmit: skipping submit process - no element selected"), this;
            var i, j, k, l = this;
            "function" == typeof b ? b = {
                success: b
            } : void 0 === b && (b = {}), i = b.type || this.attr2("method"), j = b.url || this.attr2("action"), k = "string" == typeof j ? a.trim(j) : "", k = k || window.location.href || "", k && (k = (k.match(/^([^#]+)/) || [])[1]), b = a.extend(!0, {
                url: k,
                success: a.ajaxSettings.success,
                type: i || a.ajaxSettings.type,
                iframeSrc: /^https/i.test(window.location.href || "") ? "javascript:false" : "about:blank"
            }, b);
            var m = {};
            if (this.trigger("form-pre-serialize", [this, b, m]), m.veto) return d("ajaxSubmit: submit vetoed via form-pre-serialize trigger"), this;
            if (b.beforeSerialize && b.beforeSerialize(this, b) === !1) return d("ajaxSubmit: submit aborted via beforeSerialize callback"), this;
            var n = b.traditional;
            void 0 === n && (n = a.ajaxSettings.traditional);
            var o, p = [],
                q = this.formToArray(b.semantic, p);
            if (b.data && (b.extraData = b.data, o = a.param(b.data, n)), b.beforeSubmit && b.beforeSubmit(q, this, b) === !1) return d("ajaxSubmit: submit aborted via beforeSubmit callback"), this;
            if (this.trigger("form-submit-validate", [q, this, b, m]), m.veto) return d("ajaxSubmit: submit vetoed via form-submit-validate trigger"), this;
            var r = a.param(q, n);
            o && (r = r ? r + "&" + o : o), "GET" == b.type.toUpperCase() ? (b.url += (b.url.indexOf("?") >= 0 ? "&" : "?") + r, b.data = null) : b.data = r;
            var s = [];
            if (b.resetForm && s.push(function() {
                    l.resetForm()
                }), b.clearForm && s.push(function() {
                    l.clearForm(b.includeHidden)
                }), !b.dataType && b.target) {
                var t = b.success || function() {};
                s.push(function(c) {
                    var d = b.replaceTarget ? "replaceWith" : "html";
                    a(b.target)[d](c).each(t, arguments)
                })
            } else b.success && s.push(b.success);
            if (b.success = function(a, c, d) {
                    for (var e = b.context || this, f = 0, g = s.length; g > f; f++) s[f].apply(e, [a, c, d || l, l])
                }, b.error) {
                var u = b.error;
                b.error = function(a, c, d) {
                    var e = b.context || this;
                    u.apply(e, [a, c, d, l])
                }
            }
            if (b.complete) {
                var v = b.complete;
                b.complete = function(a, c) {
                    var d = b.context || this;
                    v.apply(d, [a, c, l])
                }
            }
            var w = a("input[type=file]:enabled", this).filter(function() {
                    return "" !== a(this).val()
                }),
                x = w.length > 0,
                y = "multipart/form-data",
                z = l.attr("enctype") == y || l.attr("encoding") == y,
                A = e.fileapi && e.formdata;
            d("fileAPI :" + A);
            var B, C = (x || z) && !A;
            b.iframe !== !1 && (b.iframe || C) ? b.closeKeepAlive ? a.get(b.closeKeepAlive, function() {
                B = h(q)
            }) : B = h(q) : B = (x || z) && A ? g(q) : a.ajax(b), l.removeData("jqxhr").data("jqxhr", B);
            for (var D = 0; D < p.length; D++) p[D] = null;
            return this.trigger("form-submit-notify", [this, b]), this
        }, a.fn.ajaxForm = function(e) {
            if (e = e || {}, e.delegation = e.delegation && a.isFunction(a.fn.on), !e.delegation && 0 === this.length) {
                var f = {
                    s: this.selector,
                    c: this.context
                };
                return !a.isReady && f.s ? (d("DOM not ready, queuing ajaxForm"), a(function() {
                    a(f.s, f.c).ajaxForm(e)
                }), this) : (d("terminating; zero elements found by selector" + (a.isReady ? "" : " (DOM not ready)")), this)
            }
            return e.delegation ? (a(document).off("submit.form-plugin", this.selector, b).off("click.form-plugin", this.selector, c).on("submit.form-plugin", this.selector, e, b).on("click.form-plugin", this.selector, e, c), this) : this.ajaxFormUnbind().bind("submit.form-plugin", e, b).bind("click.form-plugin", e, c)
        }, a.fn.ajaxFormUnbind = function() {
            return this.unbind("submit.form-plugin click.form-plugin")
        }, a.fn.formToArray = function(b, c) {
            var d = [];
            if (0 === this.length) return d;
            var f, g = this[0],
                h = this.attr("id"),
                i = b ? g.getElementsByTagName("*") : g.elements;
            if (i && !/MSIE [678]/.test(navigator.userAgent) && (i = a(i).get()), h && (f = a(':input[form="' + h + '"]').get(), f.length && (i = (i || []).concat(f))), !i || !i.length) return d;
            var j, k, l, m, n, o, p;
            for (j = 0, o = i.length; o > j; j++)
                if (n = i[j], l = n.name, l && !n.disabled)
                    if (b && g.clk && "image" == n.type) g.clk == n && (d.push({
                        name: l,
                        value: a(n).val(),
                        type: n.type
                    }), d.push({
                        name: l + ".x",
                        value: g.clk_x
                    }, {
                        name: l + ".y",
                        value: g.clk_y
                    }));
                    else if (m = a.fieldValue(n, !0), m && m.constructor == Array)
                for (c && c.push(n), k = 0, p = m.length; p > k; k++) d.push({
                    name: l,
                    value: m[k]
                });
            else if (e.fileapi && "file" == n.type) {
                c && c.push(n);
                var q = n.files;
                if (q.length)
                    for (k = 0; k < q.length; k++) d.push({
                        name: l,
                        value: q[k],
                        type: n.type
                    });
                else d.push({
                    name: l,
                    value: "",
                    type: n.type
                })
            } else null !== m && "undefined" != typeof m && (c && c.push(n), d.push({
                name: l,
                value: m,
                type: n.type,
                required: n.required
            }));
            if (!b && g.clk) {
                var r = a(g.clk),
                    s = r[0];
                l = s.name, l && !s.disabled && "image" == s.type && (d.push({
                    name: l,
                    value: r.val()
                }), d.push({
                    name: l + ".x",
                    value: g.clk_x
                }, {
                    name: l + ".y",
                    value: g.clk_y
                }))
            }
            return d
        }, a.fn.formSerialize = function(b) {
            return a.param(this.formToArray(b))
        }, a.fn.fieldSerialize = function(b) {
            var c = [];
            return this.each(function() {
                var d = this.name;
                if (d) {
                    var e = a.fieldValue(this, b);
                    if (e && e.constructor == Array)
                        for (var f = 0, g = e.length; g > f; f++) c.push({
                            name: d,
                            value: e[f]
                        });
                    else null !== e && "undefined" != typeof e && c.push({
                        name: this.name,
                        value: e
                    })
                }
            }), a.param(c)
        }, a.fn.fieldValue = function(b) {
            for (var c = [], d = 0, e = this.length; e > d; d++) {
                var f = this[d],
                    g = a.fieldValue(f, b);
                null === g || "undefined" == typeof g || g.constructor == Array && !g.length || (g.constructor == Array ? a.merge(c, g) : c.push(g))
            }
            return c
        }, a.fieldValue = function(b, c) {
            var d = b.name,
                e = b.type,
                f = b.tagName.toLowerCase();
            if (void 0 === c && (c = !0), c && (!d || b.disabled || "reset" == e || "button" == e || ("checkbox" == e || "radio" == e) && !b.checked || ("submit" == e || "image" == e) && b.form && b.form.clk != b || "select" == f && -1 == b.selectedIndex)) return null;
            if ("select" == f) {
                var g = b.selectedIndex;
                if (0 > g) return null;
                for (var h = [], i = b.options, j = "select-one" == e, k = j ? g + 1 : i.length, l = j ? g : 0; k > l; l++) {
                    var m = i[l];
                    if (m.selected) {
                        var n = m.value;
                        if (n || (n = m.attributes && m.attributes.value && !m.attributes.value.specified ? m.text : m.value), j) return n;
                        h.push(n)
                    }
                }
                return h
            }
            return a(b).val()
        }, a.fn.clearForm = function(b) {
            return this.each(function() {
                a("input,select,textarea", this).clearFields(b)
            })
        }, a.fn.clearFields = a.fn.clearInputs = function(b) {
            var c = /^(?:color|date|datetime|email|month|number|password|range|search|tel|text|time|url|week)$/i;
            return this.each(function() {
                var d = this.type,
                    e = this.tagName.toLowerCase();
                c.test(d) || "textarea" == e ? this.value = "" : "checkbox" == d || "radio" == d ? this.checked = !1 : "select" == e ? this.selectedIndex = -1 : "file" == d ? /MSIE/.test(navigator.userAgent) ? a(this).replaceWith(a(this).clone(!0)) : a(this).val("") : b && (b === !0 && /hidden/.test(d) || "string" == typeof b && a(this).is(b)) && (this.value = "")
            })
        }, a.fn.resetForm = function() {
            return this.each(function() {
                ("function" == typeof this.reset || "object" == typeof this.reset && !this.reset.nodeType) && this.reset()
            })
        }, a.fn.enable = function(a) {
            return void 0 === a && (a = !0), this.each(function() {
                this.disabled = !a
            })
        }, a.fn.selected = function(b) {
            return void 0 === b && (b = !0), this.each(function() {
                var c = this.type;
                if ("checkbox" == c || "radio" == c) this.checked = b;
                else if ("option" == this.tagName.toLowerCase()) {
                    var d = a(this).parent("select");
                    b && d[0] && "select-one" == d[0].type && d.find("option").selected(!1), this.selected = b
                }
            })
        }, a.fn.ajaxSubmit.debug = !1
    }), function(a) {
        a.fn.jkey = function(b, c, d) {
            function e(a) {
                var b, c = {};
                for (b in a) a.hasOwnProperty(b) && (c[a[b]] = b);
                return c
            }
            var f = {
                    a: 65,
                    b: 66,
                    c: 67,
                    d: 68,
                    e: 69,
                    f: 70,
                    g: 71,
                    h: 72,
                    i: 73,
                    j: 74,
                    k: 75,
                    l: 76,
                    m: 77,
                    n: 78,
                    o: 79,
                    p: 80,
                    q: 81,
                    r: 82,
                    s: 83,
                    t: 84,
                    u: 85,
                    v: 86,
                    w: 87,
                    x: 88,
                    y: 89,
                    z: 90,
                    0: 48,
                    1: 49,
                    2: 50,
                    3: 51,
                    4: 52,
                    5: 53,
                    6: 54,
                    7: 55,
                    8: 56,
                    9: 57,
                    f1: 112,
                    f2: 113,
                    f3: 114,
                    f4: 115,
                    f5: 116,
                    f6: 117,
                    f7: 118,
                    f8: 119,
                    f9: 120,
                    f10: 121,
                    f11: 122,
                    f12: 123,
                    shift: 16,
                    ctrl: 17,
                    control: 17,
                    alt: 18,
                    option: 18,
                    opt: 18,
                    cmd: 224,
                    command: 224,
                    fn: 255,
                    "function": 255,
                    backspace: 8,
                    osxdelete: 8,
                    enter: 13,
                    "return": 13,
                    space: 32,
                    spacebar: 32,
                    esc: 27,
                    escape: 27,
                    tab: 9,
                    capslock: 20,
                    capslk: 20,
                    "super": 91,
                    windows: 91,
                    insert: 45,
                    "delete": 46,
                    home: 36,
                    end: 35,
                    pgup: 33,
                    pageup: 33,
                    pgdn: 34,
                    pagedown: 34,
                    left: 37,
                    up: 38,
                    right: 39,
                    down: 40,
                    "`": 96,
                    "~": 96,
                    "-": 45,
                    _: 45,
                    "=": 187,
                    "+": 187,
                    "[": 219,
                    "{": 219,
                    "]": 221,
                    "}": 221,
                    "\\": 220,
                    "|": 220,
                    ";": 59,
                    ":": 59,
                    "'": 222,
                    '"': 222,
                    ",": 188,
                    "<": 188,
                    ".": 190,
                    ">": 190,
                    "/": 191,
                    "?": 191
                },
                g = "",
                h = "";
            if ("function" == typeof c && "undefined" == typeof d && (d = c, c = !1), b.toString().indexOf(",") > -1) var i = b.match(/[a-zA-Z0-9]+/gi);
            else var i = [b];
            for (g in i)
                if (i.hasOwnProperty(g))
                    if (i[g].toString().indexOf("+") > -1) {
                        var j = [],
                            k = i[g].split("+");
                        for (h in k) j[h] = f[k[h]];
                        i[g] = j
                    } else i[g] = f[i[g]];
            var l = e(f);
            return this.each(function() {
                $this = a(this);
                var b = [];
                $this.bind("keydown", function(e) {
                    if (b[e.keyCode] = e.keyCode, a.inArray(e.keyCode, i) > -1) "function" == typeof d && (d.call(this, l[e.keyCode]), c === !1 && e.preventDefault());
                    else
                        for (g in i)
                            if (a.inArray(e.keyCode, i[g]) > -1) {
                                var f = "unchecked";
                                for (h in i[g]) 0 != f && (f = a.inArray(i[g][h], b) > -1 ? !0 : !1);
                                if (f === !0 && "function" == typeof d) {
                                    var j = "";
                                    for (var k in b) "" != b[k] && (j += l[b[k]] + "+");
                                    j = j.substring(0, j.length - 1), d.call(this, j), c === !1 && e.preventDefault()
                                }
                            }
                }).bind("keyup", function(a) {
                    b[a.keyCode] = ""
                })
            })
        }
    }(jQuery), function($) {
        $.extend({
            metadata: {
                defaults: {
                    type: "class",
                    name: "metadata",
                    cre: /({.*})/,
                    single: "metadata"
                },
                setType: function(a, b) {
                    this.defaults.type = a, this.defaults.name = b
                },
                get: function(elem, opts) {
                    var settings = $.extend({}, this.defaults, opts);
                    settings.single.length || (settings.single = "metadata");
                    var data = $.data(elem, settings.single);
                    if (data) return data;
                    if (data = "{}", "class" == settings.type) {
                        var m = settings.cre.exec(elem.className);
                        m && (data = m[1])
                    } else if ("elem" == settings.type) {
                        if (!elem.getElementsByTagName) return void 0;
                        var e = elem.getElementsByTagName(settings.name);
                        e.length && (data = $.trim(e[0].innerHTML))
                    } else if (void 0 != elem.getAttribute) {
                        var attr = elem.getAttribute(settings.name);
                        attr && (data = attr)
                    }
                    return data.indexOf("{") < 0 && (data = "{" + data + "}"), data = eval("(" + data + ")"), $.data(elem, settings.single, data), data
                }
            }
        }), $.fn.metadata = function(a) {
            return $.metadata.get(this[0], a)
        }
    }(jQuery), function(a) {
        "function" == typeof define && define.amd ? define(["jquery"], a) : "object" == typeof module && "object" == typeof module.exports ? module.exports = a(require("jquery")) : a(jQuery)
    }(function(a) {
        "use strict";
        a.extend({
            tablesorter: new function() {
                function b() {
                    var a = arguments[0],
                        b = arguments.length > 1 ? Array.prototype.slice.call(arguments) : a;
                    "undefined" != typeof console && "undefined" != typeof console.log ? console[/error/i.test(a) ? "error" : /warn/i.test(a) ? "warn" : "log"](b) : alert(b)
                }

                function c(a, c) {
                    b(a + " (" + ((new Date).getTime() - c.getTime()) + "ms)")
                }

                function d(a) {
                    for (var b in a) return !1;
                    return !0
                }

                function e(c, d, e, f) {
                    for (var g, h, i = c.config, j = u.parsers.length, k = !1, l = "", m = !0;
                        "" === l && m;) e++, d[e] ? (k = d[e].cells[f], l = u.getElementText(i, k, f), h = a(k), c.config.debug && b("Checking if value was empty on row " + e + ", column: " + f + ': "' + l + '"')) : m = !1;
                    for (; --j >= 0;)
                        if (g = u.parsers[j], g && "text" !== g.id && g.is && g.is(l, c, k, h)) return g;
                    return u.getParserById("text")
                }

                function f(a) {
                    var d, f, g, h, i, j, k, l, m, n, o = a.config,
                        p = o.$tbodies = o.$table.children("tbody:not(." + o.cssInfoBlock + ")"),
                        q = 0,
                        r = "",
                        s = p.length;
                    if (0 === s) return o.debug ? b("Warning: *Empty table!* Not building a parser cache") : "";
                    for (o.debug && (n = new Date, b("Detecting parsers for each column")), f = {
                            extractors: [],
                            parsers: []
                        }; s > q;) {
                        if (d = p[q].rows, d.length)
                            for (g = o.columns, h = 0; g > h; h++) i = o.$headers.filter('[data-column="' + h + '"]:last'), j = u.getColumnData(a, o.headers, h), m = u.getParserById(u.getData(i, j, "extractor")), l = u.getParserById(u.getData(i, j, "sorter")), k = "false" === u.getData(i, j, "parser"), o.empties[h] = (u.getData(i, j, "empty") || o.emptyTo || (o.emptyToBottom ? "bottom" : "top")).toLowerCase(), o.strings[h] = (u.getData(i, j, "string") || o.stringTo || "max").toLowerCase(), k && (l = u.getParserById("no-parser")), m || (m = !1), l || (l = e(a, d, -1, h)), o.debug && (r += "column:" + h + "; extractor:" + m.id + "; parser:" + l.id + "; string:" + o.strings[h] + "; empty: " + o.empties[h] + "\n"), f.parsers[h] = l, f.extractors[h] = m;
                        q += f.parsers.length ? s : 1
                    }
                    o.debug && (b(r ? r : "No parsers detected"), c("Completed detecting parsers", n)), o.parsers = f.parsers, o.extractors = f.extractors
                }

                function g(d) {
                    var e, f, g, h, i, j, k, l, m, n, o, p, q, r = d.config,
                        s = r.$tbodies,
                        t = r.extractors,
                        v = r.parsers;
                    if (r.cache = {}, r.totalRows = 0, !v) return r.debug ? b("Warning: *Empty table!* Not building a cache") : "";
                    for (r.debug && (n = new Date), r.showProcessing && u.isProcessing(d, !0), k = 0; k < s.length; k++) {
                        for (q = [], e = r.cache[k] = {
                                normalized: []
                            }, o = s[k] && s[k].rows.length || 0, i = 0; o > i; ++i)
                            if (p = {
                                    child: [],
                                    raw: []
                                }, l = a(s[k].rows[i]), m = [], l.hasClass(r.cssChildRow) && 0 !== i) f = e.normalized.length - 1, e.normalized[f][r.columns].$row = e.normalized[f][r.columns].$row.add(l), l.prev().hasClass(r.cssChildRow) || l.prev().addClass(u.css.cssHasChild), p.child[f] = a.trim(l[0].textContent || l.text() || "");
                            else {
                                for (p.$row = l, p.order = i, j = 0; j < r.columns; ++j) "undefined" != typeof v[j] ? (f = u.getElementText(r, l[0].cells[j], j), p.raw.push(f), g = "undefined" == typeof t[j].id ? f : t[j].format(f, d, l[0].cells[j], j), h = "no-parser" === v[j].id ? "" : v[j].format(g, d, l[0].cells[j], j), m.push(r.ignoreCase && "string" == typeof h ? h.toLowerCase() : h), "numeric" === (v[j].type || "").toLowerCase() && (q[j] = Math.max(Math.abs(h) || 0, q[j] || 0))) : r.debug && b("No parser found for cell:", l[0].cells[j], "does it have a header?");
                                m[r.columns] = p, e.normalized.push(m)
                            }
                        e.colMax = q, r.totalRows += e.normalized.length
                    }
                    r.showProcessing && u.isProcessing(d), r.debug && c("Building cache for " + o + " rows", n)
                }

                function h(a, b) {
                    var e, f, g, h, i, j, k, l = a.config,
                        m = l.widgetOptions,
                        n = l.$tbodies,
                        o = [],
                        p = l.cache;
                    if (d(p)) return l.appender ? l.appender(a, o) : a.isUpdating ? l.$table.trigger("updateComplete", a) : "";
                    for (l.debug && (k = new Date), j = 0; j < n.length; j++)
                        if (g = n.eq(j), g.length) {
                            for (h = u.processTbody(a, g, !0), e = p[j].normalized, f = e.length, i = 0; f > i; i++) o.push(e[i][l.columns].$row), l.appender && (!l.pager || l.pager.removeRows && m.pager_removeRows || l.pager.ajax) || h.append(e[i][l.columns].$row);
                            u.processTbody(a, h, !1)
                        }
                    l.appender && l.appender(a, o), l.debug && c("Rebuilt table", k), b || l.appender || u.applyWidget(a), a.isUpdating && l.$table.trigger("updateComplete", a)
                }

                function i(a) {
                    return /^d/i.test(a) || 1 === a
                }

                function j(d) {
                    var e, f, g, h, j, k, m, n = d.config;
                    n.headerList = [], n.headerContent = [], n.debug && (m = new Date), n.columns = u.computeColumnIndex(n.$table.children("thead, tfoot").children("tr")), h = n.cssIcon ? '<i class="' + (n.cssIcon === u.css.icon ? u.css.icon : n.cssIcon + " " + u.css.icon) + '"></i>' : "", n.$headers = a(a.map(a(d).find(n.selectorHeaders), function(b, c) {
                        return f = a(b), f.parent().hasClass(n.cssIgnoreRow) ? void 0 : (e = u.getColumnData(d, n.headers, c, !0), n.headerContent[c] = f.html(), "" === n.headerTemplate || f.find("." + u.css.headerIn).length || (j = n.headerTemplate.replace(/\{content\}/g, f.html()).replace(/\{icon\}/g, f.find("." + u.css.icon).length ? "" : h), n.onRenderTemplate && (g = n.onRenderTemplate.apply(f, [c, j]), g && "string" == typeof g && (j = g)), f.html('<div class="' + u.css.headerIn + '">' + j + "</div>")), n.onRenderHeader && n.onRenderHeader.apply(f, [c, n, n.$table]), b.column = parseInt(f.attr("data-column"), 10), b.order = i(u.getData(f, e, "sortInitialOrder") || n.sortInitialOrder) ? [1, 0, 2] : [0, 1, 2], b.count = -1, b.lockedOrder = !1, k = u.getData(f, e, "lockedOrder") || !1, "undefined" != typeof k && k !== !1 && (b.order = b.lockedOrder = i(k) ? [1, 1, 1] : [0, 0, 0]), f.addClass(u.css.header + " " + n.cssHeader), n.headerList[c] = b, f.parent().addClass(u.css.headerRow + " " + n.cssHeaderRow).attr("role", "row"), n.tabIndex && f.attr("tabindex", 0), b)
                    })), a(d).find(n.selectorHeaders).attr({
                        scope: "col",
                        role: "columnheader"
                    }), l(d), n.debug && (c("Built headers:", m), b(n.$headers))
                }

                function k(a, b, c) {
                    var d = a.config;
                    d.$table.find(d.selectorRemove).remove(), f(a), g(a), s(d, b, c)
                }

                function l(b) {
                    var c, d, e, f = b.config;
                    f.$headers.each(function(g, h) {
                        d = a(h), e = u.getColumnData(b, f.headers, g, !0), c = "false" === u.getData(h, e, "sorter") || "false" === u.getData(h, e, "parser"), h.sortDisabled = c, d[c ? "addClass" : "removeClass"]("sorter-false").attr("aria-disabled", "" + c), b.id && (c ? d.removeAttr("aria-controls") : d.attr("aria-controls", b.id))
                    })
                }

                function m(b) {
                    var c, d, e, f = b.config,
                        g = f.sortList,
                        h = g.length,
                        i = u.css.sortNone + " " + f.cssNone,
                        j = [u.css.sortAsc + " " + f.cssAsc, u.css.sortDesc + " " + f.cssDesc],
                        k = [f.cssIconAsc, f.cssIconDesc, f.cssIconNone],
                        l = ["ascending", "descending"],
                        m = a(b).find("tfoot tr").children().add(f.$extraHeaders).removeClass(j.join(" "));
                    for (f.$headers.removeClass(j.join(" ")).addClass(i).attr("aria-sort", "none").find("." + f.cssIcon).removeClass(k.join(" ")).addClass(k[2]), d = 0; h > d; d++)
                        if (2 !== g[d][1] && (c = f.$headers.not(".sorter-false").filter('[data-column="' + g[d][0] + '"]' + (1 === h ? ":last" : "")), c.length)) {
                            for (e = 0; e < c.length; e++) c[e].sortDisabled || c.eq(e).removeClass(i).addClass(j[g[d][1]]).attr("aria-sort", l[g[d][1]]).find("." + f.cssIcon).removeClass(k[2]).addClass(k[g[d][1]]);
                            m.length && m.filter('[data-column="' + g[d][0] + '"]').removeClass(i).addClass(j[g[d][1]])
                        }
                    f.$headers.not(".sorter-false").each(function() {
                        var b = a(this),
                            c = this.order[(this.count + 1) % (f.sortReset ? 3 : 2)],
                            d = a.trim(b.text()) + ": " + u.language[b.hasClass(u.css.sortAsc) ? "sortAsc" : b.hasClass(u.css.sortDesc) ? "sortDesc" : "sortNone"] + u.language[0 === c ? "nextAsc" : 1 === c ? "nextDesc" : "nextNone"];
                        b.attr("aria-label", d)
                    })
                }

                function n(b, c) {
                    var d, e, f, g, h, i = b.config,
                        j = c || i.sortList;
                    i.sortList = [], a.each(j, function(b, c) {
                        if (g = parseInt(c[0], 10), f = i.$headers.filter('[data-column="' + g + '"]:last')[0]) {
                            switch (e = ("" + c[1]).match(/^(1|d|s|o|n)/), e = e ? e[0] : "") {
                                case "1":
                                case "d":
                                    e = 1;
                                    break;
                                case "s":
                                    e = h || 0;
                                    break;
                                case "o":
                                    d = f.order[(h || 0) % (i.sortReset ? 3 : 2)], e = 0 === d ? 1 : 1 === d ? 0 : 2;
                                    break;
                                case "n":
                                    f.count = f.count + 1, e = f.order[f.count % (i.sortReset ? 3 : 2)];
                                    break;
                                default:
                                    e = 0
                            }
                            h = 0 === b ? e : h, d = [g, parseInt(e, 10) || 0], i.sortList.push(d), e = a.inArray(d[1], f.order), f.count = e >= 0 ? e : d[1] % (i.sortReset ? 3 : 2)
                        }
                    })
                }

                function o(a, b) {
                    return a && a[b] ? a[b].type || "" : ""
                }

                function p(b, c, d) {
                    if (b.isUpdating) return setTimeout(function() {
                        p(b, c, d)
                    }, 50);
                    var e, f, g, i, j, k = b.config,
                        l = !d[k.sortMultiSortKey],
                        n = k.$table;
                    if (n.trigger("sortStart", b), c.count = d[k.sortResetKey] ? 2 : (c.count + 1) % (k.sortReset ? 3 : 2), k.sortRestart && (f = c, k.$headers.each(function() {
                            this === f || !l && a(this).is("." + u.css.sortDesc + ",." + u.css.sortAsc) || (this.count = -1)
                        })), f = parseInt(a(c).attr("data-column"), 10), l) {
                        if (k.sortList = [], null !== k.sortForce)
                            for (e = k.sortForce, g = 0; g < e.length; g++) e[g][0] !== f && k.sortList.push(e[g]);
                        if (i = c.order[c.count], 2 > i && (k.sortList.push([f, i]), c.colSpan > 1))
                            for (g = 1; g < c.colSpan; g++) k.sortList.push([f + g, i])
                    } else {
                        if (k.sortAppend && k.sortList.length > 1)
                            for (g = 0; g < k.sortAppend.length; g++) j = u.isValueInArray(k.sortAppend[g][0], k.sortList), j >= 0 && k.sortList.splice(j, 1);
                        if (u.isValueInArray(f, k.sortList) >= 0)
                            for (g = 0; g < k.sortList.length; g++) j = k.sortList[g], i = k.$headers.filter('[data-column="' + j[0] + '"]:last')[0], j[0] === f && (j[1] = i.order[c.count], 2 === j[1] && (k.sortList.splice(g, 1), i.count = -1));
                        else if (i = c.order[c.count], 2 > i && (k.sortList.push([f, i]), c.colSpan > 1))
                            for (g = 1; g < c.colSpan; g++) k.sortList.push([f + g, i])
                    }
                    if (null !== k.sortAppend)
                        for (e = k.sortAppend, g = 0; g < e.length; g++) e[g][0] !== f && k.sortList.push(e[g]);
                    n.trigger("sortBegin", b), setTimeout(function() {
                        m(b), q(b), h(b), n.trigger("sortEnd", b)
                    }, 1)
                }

                function q(a) {
                    var b, e, f, g, h, i, j, k, l, m, n, p = 0,
                        q = a.config,
                        r = q.textSorter || "",
                        s = q.sortList,
                        t = s.length,
                        v = q.$tbodies.length;
                    if (!q.serverSideSorting && !d(q.cache)) {
                        for (q.debug && (h = new Date), e = 0; v > e; e++) i = q.cache[e].colMax, j = q.cache[e].normalized, j.sort(function(c, d) {
                            for (b = 0; t > b; b++) {
                                if (g = s[b][0], k = s[b][1], p = 0 === k, q.sortStable && c[g] === d[g] && 1 === t) return c[q.columns].order - d[q.columns].order;
                                if (f = /n/i.test(o(q.parsers, g)), f && q.strings[g] ? (f = "boolean" == typeof q.string[q.strings[g]] ? (p ? 1 : -1) * (q.string[q.strings[g]] ? -1 : 1) : q.strings[g] ? q.string[q.strings[g]] || 0 : 0, l = q.numberSorter ? q.numberSorter(c[g], d[g], p, i[g], a) : u["sortNumeric" + (p ? "Asc" : "Desc")](c[g], d[g], f, i[g], g, a)) : (m = p ? c : d, n = p ? d : c, l = "function" == typeof r ? r(m[g], n[g], p, g, a) : "object" == typeof r && r.hasOwnProperty(g) ? r[g](m[g], n[g], p, g, a) : u["sortNatural" + (p ? "Asc" : "Desc")](c[g], d[g], g, a, q)), l) return l
                            }
                            return c[q.columns].order - d[q.columns].order
                        });
                        q.debug && c("Sorting on " + s.toString() + " and dir " + k + " time", h)
                    }
                }

                function r(b, c) {
                    b.table.isUpdating && b.$table.trigger("updateComplete", b.table), a.isFunction(c) && c(b.table)
                }

                function s(b, c, d) {
                    var e = a.isArray(c) ? c : b.sortList,
                        f = "undefined" == typeof c ? b.resort : c;
                    f === !1 || b.serverSideSorting || b.table.isProcessing ? (r(b, d), u.applyWidget(b.table, !1)) : e.length ? b.$table.trigger("sorton", [e, function() {
                        r(b, d)
                    }, !0]) : b.$table.trigger("sortReset", [function() {
                        r(b, d), u.applyWidget(b.table, !1)
                    }])
                }

                function t(b) {
                    var c = b.config,
                        e = c.$table,
                        i = "sortReset update updateRows updateCell updateAll addRows updateComplete sorton appendCache updateCache applyWidgetId applyWidgets refreshWidgets destroy mouseup mouseleave ".split(" ").join(c.namespace + " ");
                    e.unbind(i.replace(/\s+/g, " ")).bind("sortReset" + c.namespace, function(d, e) {
                        d.stopPropagation(), c.sortList = [], m(b), q(b), h(b), a.isFunction(e) && e(b)
                    }).bind("updateAll" + c.namespace, function(a, d, e) {
                        a.stopPropagation(), b.isUpdating = !0, u.refreshWidgets(b, !0, !0), j(b), u.bindEvents(b, c.$headers, !0), t(b), k(b, d, e)
                    }).bind("update" + c.namespace + " updateRows" + c.namespace, function(a, c, d) {
                        a.stopPropagation(), b.isUpdating = !0, l(b), k(b, c, d)
                    }).bind("updateCell" + c.namespace, function(d, f, g, h) {
                        d.stopPropagation(), b.isUpdating = !0, e.find(c.selectorRemove).remove();
                        var i, j, k, l, m = c.$tbodies,
                            n = a(f),
                            o = m.index(a.fn.closest ? n.closest("tbody") : n.parents("tbody").filter(":first")),
                            p = a.fn.closest ? n.closest("tr") : n.parents("tr").filter(":first");
                        f = n[0], m.length && o >= 0 && (k = m.eq(o).find("tr").index(p), l = n.index(), c.cache[o].normalized[k][c.columns].$row = p, j = "undefined" == typeof c.extractors[l].id ? u.getElementText(c, f, l) : c.extractors[l].format(u.getElementText(c, f, l), b, f, l), i = "no-parser" === c.parsers[l].id ? "" : c.parsers[l].format(j, b, f, l), c.cache[o].normalized[k][l] = c.ignoreCase && "string" == typeof i ? i.toLowerCase() : i, "numeric" === (c.parsers[l].type || "").toLowerCase() && (c.cache[o].colMax[l] = Math.max(Math.abs(i) || 0, c.cache[o].colMax[l] || 0)), i = "undefined" !== g ? g : c.resort, i !== !1 ? s(c, i, h) : (a.isFunction(h) && h(b), c.$table.trigger("updateComplete", c.table)))
                    }).bind("addRows" + c.namespace, function(e, g, h, i) {
                        if (e.stopPropagation(), b.isUpdating = !0, d(c.cache)) l(b), k(b, h, i);
                        else {
                            g = a(g).attr("role", "row");
                            var j, m, n, o, p, q, r, t = g.filter("tr").length,
                                v = c.$tbodies.index(g.parents("tbody").filter(":first"));
                            for (c.parsers && c.parsers.length || f(b), j = 0; t > j; j++) {
                                for (n = g[j].cells.length, r = [], q = {
                                        child: [],
                                        $row: g.eq(j),
                                        order: c.cache[v].normalized.length
                                    }, m = 0; n > m; m++) o = "undefined" == typeof c.extractors[m].id ? u.getElementText(c, g[j].cells[m], m) : c.extractors[m].format(u.getElementText(c, g[j].cells[m], m), b, g[j].cells[m], m), p = "no-parser" === c.parsers[m].id ? "" : c.parsers[m].format(o, b, g[j].cells[m], m), r[m] = c.ignoreCase && "string" == typeof p ? p.toLowerCase() : p, "numeric" === (c.parsers[m].type || "").toLowerCase() && (c.cache[v].colMax[m] = Math.max(Math.abs(r[m]) || 0, c.cache[v].colMax[m] || 0));
                                r.push(q), c.cache[v].normalized.push(r)
                            }
                            s(c, h, i)
                        }
                    }).bind("updateComplete" + c.namespace, function() {
                        b.isUpdating = !1
                    }).bind("sorton" + c.namespace, function(c, f, i, j) {
                        var k = b.config;
                        c.stopPropagation(), e.trigger("sortStart", this), n(b, f), m(b), k.delayInit && d(k.cache) && g(b), e.trigger("sortBegin", this), q(b), h(b, j), e.trigger("sortEnd", this), u.applyWidget(b), a.isFunction(i) && i(b)
                    }).bind("appendCache" + c.namespace, function(c, d, e) {
                        c.stopPropagation(), h(b, e), a.isFunction(d) && d(b)
                    }).bind("updateCache" + c.namespace, function(d, e) {
                        c.parsers && c.parsers.length || f(b), g(b), a.isFunction(e) && e(b)
                    }).bind("applyWidgetId" + c.namespace, function(a, d) {
                        a.stopPropagation(), u.getWidgetById(d).format(b, c, c.widgetOptions)
                    }).bind("applyWidgets" + c.namespace, function(a, c) {
                        a.stopPropagation(), u.applyWidget(b, c)
                    }).bind("refreshWidgets" + c.namespace, function(a, c, d) {
                        a.stopPropagation(), u.refreshWidgets(b, c, d)
                    }).bind("destroy" + c.namespace, function(a, c, d) {
                        a.stopPropagation(), u.destroy(b, c, d)
                    }).bind("resetToLoadState" + c.namespace, function() {
                        u.removeWidget(b, !0, !1), c = a.extend(!0, u.defaults, c.originalSettings), b.hasInitialized = !1, u.setup(b, c)
                    })
                }
                var u = this;
                u.version = "{{version}}", u.parsers = [], u.widgets = [], u.defaults = {
                    theme: "default",
                    widthFixed: !1,
                    showProcessing: !1,
                    headerTemplate: "{content}",
                    onRenderTemplate: null,
                    onRenderHeader: null,
                    cancelSelection: !0,
                    tabIndex: !0,
                    dateFormat: "mmddyyyy",
                    sortMultiSortKey: "shiftKey",
                    sortResetKey: "ctrlKey",
                    usNumberFormat: !0,
                    delayInit: !1,
                    serverSideSorting: !1,
                    resort: !0,
                    headers: {},
                    ignoreCase: !0,
                    sortForce: null,
                    sortList: [],
                    sortAppend: null,
                    sortStable: !1,
                    sortInitialOrder: "asc",
                    sortLocaleCompare: !1,
                    sortReset: !1,
                    sortRestart: !1,
                    emptyTo: "bottom",
                    stringTo: "max",
                    textExtraction: "basic",
                    textAttribute: "data-text",
                    textSorter: null,
                    numberSorter: null,
                    widgets: [],
                    widgetOptions: {
                        zebra: ["even", "odd"]
                    },
                    initWidgets: !0,
                    widgetClass: "widget-{name}",
                    initialized: null,
                    tableClass: "",
                    cssAsc: "",
                    cssDesc: "",
                    cssNone: "",
                    cssHeader: "",
                    cssHeaderRow: "",
                    cssProcessing: "",
                    cssChildRow: "tablesorter-childRow",
                    cssIcon: "tablesorter-icon",
                    cssIconNone: "",
                    cssIconAsc: "",
                    cssIconDesc: "",
                    cssInfoBlock: "tablesorter-infoOnly",
                    cssNoSort: "tablesorter-noSort",
                    cssIgnoreRow: "tablesorter-ignoreRow",
                    selectorHeaders: "> thead th, > thead td",
                    selectorSort: "th, td",
                    selectorRemove: ".remove-me",
                    debug: !1,
                    headerList: [],
                    empties: {},
                    strings: {},
                    parsers: []
                }, u.css = {
                    table: "tablesorter",
                    cssHasChild: "tablesorter-hasChildRow",
                    childRow: "tablesorter-childRow",
                    colgroup: "tablesorter-colgroup",
                    header: "tablesorter-header",
                    headerRow: "tablesorter-headerRow",
                    headerIn: "tablesorter-header-inner",
                    icon: "tablesorter-icon",
                    processing: "tablesorter-processing",
                    sortAsc: "tablesorter-headerAsc",
                    sortDesc: "tablesorter-headerDesc",
                    sortNone: "tablesorter-headerUnSorted"
                }, u.language = {
                    sortAsc: "Ascending sort applied, ",
                    sortDesc: "Descending sort applied, ",
                    sortNone: "No sort applied, ",
                    nextAsc: "activate to apply an ascending sort",
                    nextDesc: "activate to apply a descending sort",
                    nextNone: "activate to remove the sort"
                }, u.log = b, u.benchmark = c, u.getElementText = function(b, c, d) {
                    if (!c) return "";
                    var e, f = b.textExtraction || "",
                        g = c.jquery ? c : a(c);
                    return a.trim("string" == typeof f ? ("basic" === f ? g.attr(b.textAttribute) || c.textContent : c.textContent) || g.text() || "" : "function" == typeof f ? f(g[0], b.table, d) : "function" == typeof(e = u.getColumnData(b.table, f, d)) ? e(g[0], b.table, d) : g[0].textContent || g.text() || "")
                }, u.construct = function(b) {
                    return this.each(function() {
                        var c = this,
                            d = a.extend(!0, {}, u.defaults, b);
                        d.originalSettings = b, !c.hasInitialized && u.buildTable && "TABLE" !== this.tagName ? u.buildTable(c, d) : u.setup(c, d)
                    })
                }, u.setup = function(c, d) {
                    if (!c || !c.tHead || 0 === c.tBodies.length || c.hasInitialized === !0) return d.debug ? b("ERROR: stopping initialization! No table, thead, tbody or tablesorter has already been initialized") : "";
                    var e = "",
                        h = a(c),
                        i = a.metadata;
                    c.hasInitialized = !1, c.isProcessing = !0, c.config = d, a.data(c, "tablesorter", d), d.debug && a.data(c, "startoveralltimer", new Date), d.supportsDataObject = function(a) {
                        return a[0] = parseInt(a[0], 10), a[0] > 1 || 1 === a[0] && parseInt(a[1], 10) >= 4
                    }(a.fn.jquery.split(".")), d.string = {
                        max: 1,
                        min: -1,
                        emptymin: 1,
                        emptymax: -1,
                        zero: 0,
                        none: 0,
                        "null": 0,
                        top: !0,
                        bottom: !1
                    }, d.emptyTo = d.emptyTo.toLowerCase(), d.stringTo = d.stringTo.toLowerCase(), /tablesorter\-/.test(h.attr("class")) || (e = "" !== d.theme ? " tablesorter-" + d.theme : ""), d.table = c, d.$table = h.addClass(u.css.table + " " + d.tableClass + e).attr("role", "grid"), d.$headers = h.find(d.selectorHeaders), d.namespace = d.namespace ? "." + d.namespace.replace(/\W/g, "") : ".tablesorter" + Math.random().toString(16).slice(2), d.$table.children().children("tr").attr("role", "row"), d.$tbodies = h.children("tbody:not(." + d.cssInfoBlock + ")").attr({
                        "aria-live": "polite",
                        "aria-relevant": "all"
                    }), d.$table.children("caption").length && (e = d.$table.children("caption")[0], e.id || (e.id = d.namespace.slice(1) + "caption"), d.$table.attr("aria-labelledby", e.id)), d.widgetInit = {}, d.textExtraction = d.$table.attr("data-text-extraction") || d.textExtraction || "basic", j(c), u.fixColumnWidth(c), f(c), d.totalRows = 0, d.delayInit || g(c), u.bindEvents(c, d.$headers, !0), t(c), d.supportsDataObject && "undefined" != typeof h.data().sortlist ? d.sortList = h.data().sortlist : i && h.metadata() && h.metadata().sortlist && (d.sortList = h.metadata().sortlist), u.applyWidget(c, !0), d.sortList.length > 0 ? h.trigger("sorton", [d.sortList, {}, !d.initWidgets, !0]) : (m(c), d.initWidgets && u.applyWidget(c, !1)), d.showProcessing && h.unbind("sortBegin" + d.namespace + " sortEnd" + d.namespace).bind("sortBegin" + d.namespace + " sortEnd" + d.namespace, function(a) {
                        clearTimeout(d.processTimer), u.isProcessing(c), "sortBegin" === a.type && (d.processTimer = setTimeout(function() {
                            u.isProcessing(c, !0)
                        }, 500))
                    }), c.hasInitialized = !0, c.isProcessing = !1, d.debug && u.benchmark("Overall initialization time", a.data(c, "startoveralltimer")), h.trigger("tablesorter-initialized", c), "function" == typeof d.initialized && d.initialized(c)
                }, u.fixColumnWidth = function(b) {
                    b = a(b)[0];
                    var c, d, e = b.config,
                        f = e.$table.children("colgroup");
                    f.length && f.hasClass(u.css.colgroup) && f.remove(), e.widthFixed && 0 === e.$table.children("colgroup").length && (f = a('<colgroup class="' + u.css.colgroup + '">'), c = e.$table.width(), e.$tbodies.find("tr:first").children(":visible").each(function() {
                        d = parseInt(a(this).width() / c * 1e3, 10) / 10 + "%", f.append(a("<col>").css("width", d))
                    }), e.$table.prepend(f))
                }, u.getColumnData = function(b, c, d, e, f) {
                    if ("undefined" != typeof c && null !== c) {
                        b = a(b)[0];
                        var g, h, i = b.config,
                            j = f || i.$headers;
                        if (c[d]) return e ? c[d] : c[j.index(j.filter('[data-column="' + d + '"]:last'))];
                        for (h in c)
                            if ("string" == typeof h && (g = j.filter('[data-column="' + d + '"]:last').filter(h).add(j.filter('[data-column="' + d + '"]:last').find(h)), g.length)) return c[h]
                    }
                }, u.computeColumnIndex = function(b) {
                    var c, d, e, f, g, h, i, j, k, l, m, n, o, p = [],
                        q = {},
                        r = 0;
                    for (c = 0; c < b.length; c++)
                        for (i = b[c].cells, d = 0; d < i.length; d++) {
                            for (h = i[d], g = a(h), j = h.parentNode.rowIndex, k = j + "-" + g.index(), l = h.rowSpan || 1, m = h.colSpan || 1, "undefined" == typeof p[j] && (p[j] = []), e = 0; e < p[j].length + 1; e++)
                                if ("undefined" == typeof p[j][e]) {
                                    n = e;
                                    break
                                }
                            for (q[k] = n, r = Math.max(n, r), g.attr({
                                    "data-column": n
                                }), e = j; j + l > e; e++)
                                for ("undefined" == typeof p[e] && (p[e] = []), o = p[e], f = n; n + m > f; f++) o[f] = "x"
                        }
                    return r + 1
                }, u.isProcessing = function(b, c, d) {
                    b = a(b);
                    var e = b[0].config,
                        f = d || b.find("." + u.css.header);
                    c ? ("undefined" != typeof d && e.sortList.length > 0 && (f = f.filter(function() {
                        return this.sortDisabled ? !1 : u.isValueInArray(parseFloat(a(this).attr("data-column")), e.sortList) >= 0
                    })), b.add(f).addClass(u.css.processing + " " + e.cssProcessing)) : b.add(f).removeClass(u.css.processing + " " + e.cssProcessing)
                }, u.processTbody = function(b, c, d) {
                    b = a(b)[0];
                    var e;
                    return d ? (b.isProcessing = !0, c.before('<span class="tablesorter-savemyplace"/>'), e = a.fn.detach ? c.detach() : c.remove()) : (e = a(b).find("span.tablesorter-savemyplace"), c.insertAfter(e), e.remove(), void(b.isProcessing = !1))
                }, u.clearTableBody = function(b) {
                    a(b)[0].config.$tbodies.children().detach()
                }, u.bindEvents = function(b, c, e) {
                    b = a(b)[0];
                    var f, h = b.config;
                    e !== !0 && (h.$extraHeaders = h.$extraHeaders ? h.$extraHeaders.add(c) : c), c.find(h.selectorSort).add(c.filter(h.selectorSort)).unbind("mousedown mouseup sort keyup ".split(" ").join(h.namespace + " ").replace(/\s+/g, " ")).bind("mousedown mouseup sort keyup ".split(" ").join(h.namespace + " "), function(e, i) {
                        var j, k = a(e.target),
                            l = e.type;
                        if (!(1 !== (e.which || e.button) && !/sort|keyup/.test(l) || "keyup" === l && 13 !== e.which || "mouseup" === l && i !== !0 && (new Date).getTime() - f > 250)) {
                            if ("mousedown" === l) return void(f = (new Date).getTime());
                            if (j = a.fn.closest ? k.closest("td,th") : k.parents("td,th").filter(":first"), /(input|select|button|textarea)/i.test(e.target.tagName) || k.hasClass(h.cssNoSort) || k.parents("." + h.cssNoSort).length > 0 || k.parents("button").length > 0) return !h.cancelSelection;
                            h.delayInit && d(h.cache) && g(b), j = a.fn.closest ? a(this).closest("th, td")[0] : /TH|TD/.test(this.tagName) ? this : a(this).parents("th, td")[0], j = h.$headers[c.index(j)], j.sortDisabled || p(b, j, e)
                        }
                    }), h.cancelSelection && c.attr("unselectable", "on").bind("selectstart", !1).css({
                        "user-select": "none",
                        MozUserSelect: "none"
                    })
                }, u.restoreHeaders = function(b) {
                    var c, d = a(b)[0].config;
                    d.$table.find(d.selectorHeaders).each(function(b) {
                        c = a(this), c.find("." + u.css.headerIn).length && c.html(d.headerContent[b])
                    })
                }, u.destroy = function(b, c, d) {
                    if (b = a(b)[0], b.hasInitialized) {
                        u.removeWidget(b, !0, !1);
                        var e, f = a(b),
                            g = b.config,
                            h = f.find("thead:first"),
                            i = h.find("tr." + u.css.headerRow).removeClass(u.css.headerRow + " " + g.cssHeaderRow),
                            j = f.find("tfoot:first > tr").children("th, td");
                        c === !1 && a.inArray("uitheme", g.widgets) >= 0 && (f.trigger("applyWidgetId", ["uitheme"]), f.trigger("applyWidgetId", ["zebra"])), h.find("tr").not(i).remove(), e = "sortReset update updateAll updateRows updateCell addRows updateComplete sorton appendCache updateCache " + "applyWidgetId applyWidgets refreshWidgets destroy mouseup mouseleave keypress sortBegin sortEnd resetToLoadState ".split(" ").join(g.namespace + " "), f.removeData("tablesorter").unbind(e.replace(/\s+/g, " ")), g.$headers.add(j).removeClass([u.css.header, g.cssHeader, g.cssAsc, g.cssDesc, u.css.sortAsc, u.css.sortDesc, u.css.sortNone].join(" ")).removeAttr("data-column").removeAttr("aria-label").attr("aria-disabled", "true"), i.find(g.selectorSort).unbind("mousedown mouseup keypress ".split(" ").join(g.namespace + " ").replace(/\s+/g, " ")), u.restoreHeaders(b), f.toggleClass(u.css.table + " " + g.tableClass + " tablesorter-" + g.theme, c === !1), b.hasInitialized = !1, delete b.config.cache, "function" == typeof d && d(b)
                    }
                }, u.regex = {
                    chunk: /(^([+\-]?(?:0|[1-9]\d*)(?:\.\d*)?(?:[eE][+\-]?\d+)?)?$|^0x[0-9a-f]+$|\d+)/gi,
                    chunks: /(^\\0|\\0$)/,
                    hex: /^0x[0-9a-f]+$/i
                }, u.sortNatural = function(a, b) {
                    if (a === b) return 0;
                    var c, d, e, f, g, h, i, j, k = u.regex;
                    if (k.hex.test(b)) {
                        if (d = parseInt(a.match(k.hex), 16), f = parseInt(b.match(k.hex), 16), f > d) return -1;
                        if (d > f) return 1
                    }
                    for (c = a.replace(k.chunk, "\\0$1\\0").replace(k.chunks, "").split("\\0"), e = b.replace(k.chunk, "\\0$1\\0").replace(k.chunks, "").split("\\0"), j = Math.max(c.length, e.length), i = 0; j > i; i++) {
                        if (g = isNaN(c[i]) ? c[i] || 0 : parseFloat(c[i]) || 0, h = isNaN(e[i]) ? e[i] || 0 : parseFloat(e[i]) || 0, isNaN(g) !== isNaN(h)) return isNaN(g) ? 1 : -1;
                        if (typeof g != typeof h && (g += "", h += ""), h > g) return -1;
                        if (g > h) return 1
                    }
                    return 0
                }, u.sortNaturalAsc = function(a, b, c, d, e) {
                    if (a === b) return 0;
                    var f = e.string[e.empties[c] || e.emptyTo];
                    return "" === a && 0 !== f ? "boolean" == typeof f ? f ? -1 : 1 : -f || -1 : "" === b && 0 !== f ? "boolean" == typeof f ? f ? 1 : -1 : f || 1 : u.sortNatural(a, b)
                }, u.sortNaturalDesc = function(a, b, c, d, e) {
                    if (a === b) return 0;
                    var f = e.string[e.empties[c] || e.emptyTo];
                    return "" === a && 0 !== f ? "boolean" == typeof f ? f ? -1 : 1 : f || 1 : "" === b && 0 !== f ? "boolean" == typeof f ? f ? 1 : -1 : -f || -1 : u.sortNatural(b, a)
                }, u.sortText = function(a, b) {
                    return a > b ? 1 : b > a ? -1 : 0
                }, u.getTextValue = function(a, b, c) {
                    if (c) {
                        var d, e = a ? a.length : 0,
                            f = c + b;
                        for (d = 0; e > d; d++) f += a.charCodeAt(d);
                        return b * f
                    }
                    return 0
                }, u.sortNumericAsc = function(a, b, c, d, e, f) {
                    if (a === b) return 0;
                    var g = f.config,
                        h = g.string[g.empties[e] || g.emptyTo];
                    return "" === a && 0 !== h ? "boolean" == typeof h ? h ? -1 : 1 : -h || -1 : "" === b && 0 !== h ? "boolean" == typeof h ? h ? 1 : -1 : h || 1 : (isNaN(a) && (a = u.getTextValue(a, c, d)), isNaN(b) && (b = u.getTextValue(b, c, d)), a - b)
                }, u.sortNumericDesc = function(a, b, c, d, e, f) {
                    if (a === b) return 0;
                    var g = f.config,
                        h = g.string[g.empties[e] || g.emptyTo];
                    return "" === a && 0 !== h ? "boolean" == typeof h ? h ? -1 : 1 : h || 1 : "" === b && 0 !== h ? "boolean" == typeof h ? h ? 1 : -1 : -h || -1 : (isNaN(a) && (a = u.getTextValue(a, c, d)), isNaN(b) && (b = u.getTextValue(b, c, d)), b - a)
                }, u.sortNumeric = function(a, b) {
                    return a - b
                }, u.characterEquivalents = {
                    a: "�����a�",
                    A: "�����A�",
                    c: "�cc",
                    C: "�CC",
                    e: "����ee",
                    E: "����EE",
                    i: "��I��i",
                    I: "��I��",
                    o: "�����",
                    O: "�����",
                    ss: "�",
                    SS: "?",
                    u: "����u",
                    U: "����U"
                }, u.replaceAccents = function(a) {
                    var b, c = "[",
                        d = u.characterEquivalents;
                    if (!u.characterRegex) {
                        u.characterRegexArray = {};
                        for (b in d) "string" == typeof b && (c += d[b], u.characterRegexArray[b] = new RegExp("[" + d[b] + "]", "g"));
                        u.characterRegex = new RegExp(c + "]")
                    }
                    if (u.characterRegex.test(a))
                        for (b in d) "string" == typeof b && (a = a.replace(u.characterRegexArray[b], b));
                    return a
                }, u.isValueInArray = function(a, b) {
                    var c, d = b.length;
                    for (c = 0; d > c; c++)
                        if (b[c][0] === a) return c;
                    return -1
                }, u.addParser = function(a) {
                    var b, c = u.parsers.length,
                        d = !0;
                    for (b = 0; c > b; b++) u.parsers[b].id.toLowerCase() === a.id.toLowerCase() && (d = !1);
                    d && u.parsers.push(a)
                }, u.getParserById = function(a) {
                    if ("false" == a) return !1;
                    var b, c = u.parsers.length;
                    for (b = 0; c > b; b++)
                        if (u.parsers[b].id.toLowerCase() === a.toString().toLowerCase()) return u.parsers[b];
                    return !1
                }, u.addWidget = function(a) {
                    u.widgets.push(a)
                }, u.hasWidget = function(b, c) {
                    return b = a(b), b.length && b[0].config && b[0].config.widgetInit[c] || !1
                }, u.getWidgetById = function(a) {
                    var b, c, d = u.widgets.length;
                    for (b = 0; d > b; b++)
                        if (c = u.widgets[b], c && c.hasOwnProperty("id") && c.id.toLowerCase() === a.toLowerCase()) return c
                }, u.applyWidget = function(b, d, e) {
                    b = a(b)[0];
                    var f, g, h, i, j = b.config,
                        k = j.widgetOptions,
                        l = " " + j.table.className + " ",
                        m = [];
                    d !== !1 && b.hasInitialized && (b.isApplyingWidgets || b.isUpdating) || (j.debug && (f = new Date), i = new RegExp("\\s" + j.widgetClass.replace(/\{name\}/i, "([\\w-]+)") + "\\s", "g"), l.match(i) && (h = l.match(i), h && a.each(h, function(a, b) {
                        j.widgets.push(b.replace(i, "$1"))
                    })), j.widgets.length && (b.isApplyingWidgets = !0, j.widgets = a.grep(j.widgets, function(b, c) {
                        return a.inArray(b, j.widgets) === c
                    }), a.each(j.widgets || [], function(a, b) {
                        i = u.getWidgetById(b), i && i.id && (i.priority || (i.priority = 10), m[a] = i)
                    }), m.sort(function(a, b) {
                        return a.priority < b.priority ? -1 : a.priority === b.priority ? 0 : 1;

                    }), a.each(m, function(c, e) {
                        e && ((d || !j.widgetInit[e.id]) && (j.widgetInit[e.id] = !0, e.hasOwnProperty("options") && (k = b.config.widgetOptions = a.extend(!0, {}, e.options, k)), e.hasOwnProperty("init") && (j.debug && (g = new Date), e.init(b, e, j, k), j.debug && u.benchmark("Initializing " + e.id + " widget", g))), !d && e.hasOwnProperty("format") && (j.debug && (g = new Date), e.format(b, j, k, !1), j.debug && u.benchmark((d ? "Initializing " : "Applying ") + e.id + " widget", g)))
                    }), d || "function" != typeof e || e(b)), setTimeout(function() {
                        b.isApplyingWidgets = !1, a.data(b, "lastWidgetApplication", new Date)
                    }, 0), j.debug && (h = j.widgets.length, c("Completed " + (d === !0 ? "initializing " : "applying ") + h + " widget" + (1 !== h ? "s" : ""), f)))
                }, u.removeWidget = function(c, d, e) {
                    c = a(c)[0], d === !0 ? (d = [], a.each(u.widgets, function(a, b) {
                        b && b.id && d.push(b.id)
                    })) : d = (a.isArray(d) ? d.join(",") : d || "").toLowerCase().split(/[\s,]+/);
                    var f, g, h, i = c.config,
                        j = d.length;
                    for (f = 0; j > f; f++) g = u.getWidgetById(d[f]), h = a.inArray(d[f], i.widgets), g && "remove" in g && (i.debug && h >= 0 && b('Removing "' + d[f] + '" widget'), g.remove(c, i, i.widgetOptions, e), i.widgetInit[d[f]] = !1), h >= 0 && e !== !0 && i.widgets.splice(h, 1)
                }, u.refreshWidgets = function(b, c, d) {
                    b = a(b)[0];
                    var e = b.config,
                        f = e.widgets,
                        g = [],
                        h = function(b) {
                            a(b).trigger("refreshComplete")
                        };
                    a.each(u.widgets, function(b, d) {
                        d && d.id && (c || a.inArray(d.id, f) < 0) && g.push(d.id)
                    }), u.removeWidget(b, g.join(","), !0), d !== !0 ? (u.applyWidget(b, c || !1, h), c && u.applyWidget(b, !1, h)) : h(b)
                }, u.getData = function(b, c, d) {
                    var e, f, g = "",
                        h = a(b);
                    return h.length ? (e = a.metadata ? h.metadata() : !1, f = " " + (h.attr("class") || ""), "undefined" != typeof h.data(d) || "undefined" != typeof h.data(d.toLowerCase()) ? g += h.data(d) || h.data(d.toLowerCase()) : e && "undefined" != typeof e[d] ? g += e[d] : c && "undefined" != typeof c[d] ? g += c[d] : " " !== f && f.match(" " + d + "-") && (g = f.match(new RegExp("\\s" + d + "-([\\w-]+)"))[1] || ""), a.trim(g)) : ""
                }, u.formatFloat = function(b, c) {
                    if ("string" != typeof b || "" === b) return b;
                    var d, e = c && c.config ? c.config.usNumberFormat !== !1 : "undefined" != typeof c ? c : !0;
                    return b = e ? b.replace(/,/g, "") : b.replace(/[\s|\.]/g, "").replace(/,/g, "."), /^\s*\([.\d]+\)/.test(b) && (b = b.replace(/^\s*\(([.\d]+)\)/, "-$1")), d = parseFloat(b), isNaN(d) ? a.trim(b) : d
                }, u.isDigit = function(a) {
                    return isNaN(a) ? /^[\-+(]?\d+[)]?$/.test(a.toString().replace(/[,.'"\s]/g, "")) : !0
                }
            }
        });
        var b = a.tablesorter;
        return a.fn.extend({
            tablesorter: b.construct
        }), b.addParser({
            id: "no-parser",
            is: function() {
                return !1
            },
            format: function() {
                return ""
            },
            type: "text"
        }), b.addParser({
            id: "text",
            is: function() {
                return !0
            },
            format: function(c, d) {
                var e = d.config;
                return c && (c = a.trim(e.ignoreCase ? c.toLocaleLowerCase() : c), c = e.sortLocaleCompare ? b.replaceAccents(c) : c), c
            },
            type: "text"
        }), b.addParser({
            id: "digit",
            is: function(a) {
                return b.isDigit(a)
            },
            format: function(c, d) {
                var e = b.formatFloat((c || "").replace(/[^\w,. \-()]/g, ""), d);
                return c && "number" == typeof e ? e : c ? a.trim(c && d.config.ignoreCase ? c.toLocaleLowerCase() : c) : c
            },
            type: "numeric"
        }), b.addParser({
            id: "currency",
            is: function(a) {
                return /^\(?\d+[\u00a3$\u20ac\u00a4\u00a5\u00a2?.]|[\u00a3$\u20ac\u00a4\u00a5\u00a2?.]\d+\)?$/.test((a || "").replace(/[+\-,. ]/g, ""))
            },
            format: function(c, d) {
                var e = b.formatFloat((c || "").replace(/[^\w,. \-()]/g, ""), d);
                return c && "number" == typeof e ? e : c ? a.trim(c && d.config.ignoreCase ? c.toLocaleLowerCase() : c) : c
            },
            type: "numeric"
        }), b.addParser({
            id: "url",
            is: function(a) {
                return /^(https?|ftp|file):\/\//.test(a)
            },
            format: function(b) {
                return b ? a.trim(b.replace(/(https?|ftp|file):\/\//, "")) : b
            },
            parsed: !0,
            type: "text"
        }), b.addParser({
            id: "isoDate",
            is: function(a) {
                return /^\d{4}[\/\-]\d{1,2}[\/\-]\d{1,2}/.test(a)
            },
            format: function(a) {
                var b = a ? new Date(a.replace(/-/g, "/")) : a;
                return b instanceof Date && isFinite(b) ? b.getTime() : a
            },
            type: "numeric"
        }), b.addParser({
            id: "percent",
            is: function(a) {
                return /(\d\s*?%|%\s*?\d)/.test(a) && a.length < 15
            },
            format: function(a, c) {
                return a ? b.formatFloat(a.replace(/%/g, ""), c) : a
            },
            type: "numeric"
        }), b.addParser({
            id: "image",
            is: function(a, b, c, d) {
                return d.find("img").length > 0
            },
            format: function(b, c, d) {
                return a(d).find("img").attr(c.config.imgAttr || "alt") || b
            },
            parsed: !0,
            type: "text"
        }), b.addParser({
            id: "usLongDate",
            is: function(a) {
                return /^[A-Z]{3,10}\.?\s+\d{1,2},?\s+(\d{4})(\s+\d{1,2}:\d{2}(:\d{2})?(\s+[AP]M)?)?$/i.test(a) || /^\d{1,2}\s+[A-Z]{3,10}\s+\d{4}/i.test(a)
            },
            format: function(a) {
                var b = a ? new Date(a.replace(/(\S)([AP]M)$/i, "$1 $2")) : a;
                return b instanceof Date && isFinite(b) ? b.getTime() : a
            },
            type: "numeric"
        }), b.addParser({
            id: "shortDate",
            is: function(a) {
                return /(^\d{1,2}[\/\s]\d{1,2}[\/\s]\d{4})|(^\d{4}[\/\s]\d{1,2}[\/\s]\d{1,2})/.test((a || "").replace(/\s+/g, " ").replace(/[\-.,]/g, "/"))
            },
            format: function(a, c, d, e) {
                if (a) {
                    var f, g, h = c.config,
                        i = h.$headers.filter('[data-column="' + e + '"]:last'),
                        j = i.length && i[0].dateFormat || b.getData(i, b.getColumnData(c, h.headers, e), "dateFormat") || h.dateFormat;
                    return g = a.replace(/\s+/g, " ").replace(/[\-.,]/g, "/"), "mmddyyyy" === j ? g = g.replace(/(\d{1,2})[\/\s](\d{1,2})[\/\s](\d{4})/, "$3/$1/$2") : "ddmmyyyy" === j ? g = g.replace(/(\d{1,2})[\/\s](\d{1,2})[\/\s](\d{4})/, "$3/$2/$1") : "yyyymmdd" === j && (g = g.replace(/(\d{4})[\/\s](\d{1,2})[\/\s](\d{1,2})/, "$1/$2/$3")), f = new Date(g), f instanceof Date && isFinite(f) ? f.getTime() : a
                }
                return a
            },
            type: "numeric"
        }), b.addParser({
            id: "time",
            is: function(a) {
                return /^(([0-2]?\d:[0-5]\d)|([0-1]?\d:[0-5]\d\s?([AP]M)))$/i.test(a)
            },
            format: function(a) {
                var b = a ? new Date("2000/01/01 " + a.replace(/(\S)([AP]M)$/i, "$1 $2")) : a;
                return b instanceof Date && isFinite(b) ? b.getTime() : a
            },
            type: "numeric"
        }), b.addParser({
            id: "metadata",
            is: function() {
                return !1
            },
            format: function(b, c, d) {
                var e = c.config,
                    f = e.parserMetadataName ? e.parserMetadataName : "sortValue";
                return a(d).metadata()[f]
            },
            type: "numeric"
        }), b.addWidget({
            id: "zebra",
            priority: 90,
            format: function(b, c, d) {
                var e, f, g, h, i, j, k, l = new RegExp(c.cssChildRow, "i"),
                    m = c.$tbodies;
                for (c.debug && (j = new Date), k = 0; k < m.length; k++) h = 0, e = m.eq(k), f = e.children("tr:visible").not(c.selectorRemove), f.each(function() {
                    g = a(this), l.test(this.className) || h++, i = h % 2 === 0, g.removeClass(d.zebra[i ? 1 : 0]).addClass(d.zebra[i ? 0 : 1])
                })
            },
            remove: function(a, c, d, e) {
                if (!e) {
                    var f, g, h = c.$tbodies,
                        i = (d.zebra || ["even", "odd"]).join(" ");
                    for (f = 0; f < h.length; f++) g = b.processTbody(a, h.eq(f), !0), g.children().removeClass(i), b.processTbody(a, g, !1)
                }
            }
        }), b
    }), $.tablesorter.addWidget({
        id: "staticRow",
        format: function(a) {
            if ("undefined" == typeof $(a).data("hasSorted")) $(a).data("hasSorted", !0), $("tbody .static", a).each(function() {
                $(this).data("tableindex", $(this).index())
            });
            else
                for (var b = !0; b;) b = !1, $("tbody .static", a).each(function() {
                    var c = $(this).data("tableindex");
                    if (c != $(this).index()) {
                        b = !0;
                        var d = $(this).detach(),
                            e = $("tbody tr", a).length;
                        c >= e ? d.appendTo($("tbody", a)) : 0 == c ? d.prependTo($("tbody", a)) : d.insertBefore($("tbody tr:eq(" + c + ")", a))
                    }
                });
            $("tbody .static-last", a).each(function() {
                var b = $(this).detach();
                b.appendTo($("tbody", a))
            })
        }
    }), ! function(a) {
        "function" == typeof define && define.amd ? define(["jquery"], a) : a(jQuery)
    }(function(a) {
        a.extend(a.fn, {
            validate: function(b) {
                if (!this.length) return void(b && b.debug && window.console && console.warn("Nothing selected, can't validate, returning nothing."));
                var c = a.data(this[0], "validator");
                return c ? c : (this.attr("novalidate", "novalidate"), c = new a.validator(b, this[0]), a.data(this[0], "validator", c), c.settings.onsubmit && (this.validateDelegate(":submit", "click", function(b) {
                    c.settings.submitHandler && (c.submitButton = b.target), a(b.target).hasClass("cancel") && (c.cancelSubmit = !0), void 0 !== a(b.target).attr("formnovalidate") && (c.cancelSubmit = !0)
                }), this.submit(function(b) {
                    function d() {
                        var d, e;
                        return c.settings.submitHandler ? (c.submitButton && (d = a("<input type='hidden'/>").attr("name", c.submitButton.name).val(a(c.submitButton).val()).appendTo(c.currentForm)), e = c.settings.submitHandler.call(c, c.currentForm, b), c.submitButton && d.remove(), void 0 !== e ? e : !1) : !0
                    }
                    return c.settings.debug && b.preventDefault(), c.cancelSubmit ? (c.cancelSubmit = !1, d()) : c.form() ? c.pendingRequest ? (c.formSubmitted = !0, !1) : d() : (c.focusInvalid(), !1)
                })), c)
            },
            valid: function() {
                var b, c;
                return a(this[0]).is("form") ? b = this.validate().form() : (b = !0, c = a(this[0].form).validate(), this.each(function() {
                    b = c.element(this) && b
                })), b
            },
            removeAttrs: function(b) {
                var c = {},
                    d = this;
                return a.each(b.split(/\s/), function(a, b) {
                    c[b] = d.attr(b), d.removeAttr(b)
                }), c
            },
            rules: function(b, c) {
                var d, e, f, g, h, i, j = this[0];
                if (b) switch (d = a.data(j.form, "validator").settings, e = d.rules, f = a.validator.staticRules(j), b) {
                    case "add":
                        a.extend(f, a.validator.normalizeRule(c)), delete f.messages, e[j.name] = f, c.messages && (d.messages[j.name] = a.extend(d.messages[j.name], c.messages));
                        break;
                    case "remove":
                        return c ? (i = {}, a.each(c.split(/\s/), function(b, c) {
                            i[c] = f[c], delete f[c], "required" === c && a(j).removeAttr("aria-required")
                        }), i) : (delete e[j.name], f)
                }
                return g = a.validator.normalizeRules(a.extend({}, a.validator.classRules(j), a.validator.attributeRules(j), a.validator.dataRules(j), a.validator.staticRules(j)), j), g.required && (h = g.required, delete g.required, g = a.extend({
                    required: h
                }, g), a(j).attr("aria-required", "true")), g.remote && (h = g.remote, delete g.remote, g = a.extend(g, {
                    remote: h
                })), g
            }
        }), a.extend(a.expr[":"], {
            blank: function(b) {
                return !a.trim("" + a(b).val())
            },
            filled: function(b) {
                return !!a.trim("" + a(b).val())
            },
            unchecked: function(b) {
                return !a(b).prop("checked")
            }
        }), a.validator = function(b, c) {
            this.settings = a.extend(!0, {}, a.validator.defaults, b), this.currentForm = c, this.init()
        }, a.validator.format = function(b, c) {
            return 1 === arguments.length ? function() {
                var c = a.makeArray(arguments);
                return c.unshift(b), a.validator.format.apply(this, c)
            } : (arguments.length > 2 && c.constructor !== Array && (c = a.makeArray(arguments).slice(1)), c.constructor !== Array && (c = [c]), a.each(c, function(a, c) {
                b = b.replace(new RegExp("\\{" + a + "\\}", "g"), function() {
                    return c
                })
            }), b)
        }, a.extend(a.validator, {
            defaults: {
                messages: {},
                groups: {},
                rules: {},
                errorClass: "error",
                validClass: "valid",
                errorElement: "label",
                focusCleanup: !1,
                focusInvalid: !0,
                errorContainer: a([]),
                errorLabelContainer: a([]),
                onsubmit: !0,
                ignore: ":hidden",
                ignoreTitle: !1,
                onfocusin: function(a) {
                    this.lastActive = a, this.settings.focusCleanup && (this.settings.unhighlight && this.settings.unhighlight.call(this, a, this.settings.errorClass, this.settings.validClass), this.hideThese(this.errorsFor(a)))
                },
                onfocusout: function(a) {
                    this.checkable(a) || !(a.name in this.submitted) && this.optional(a) || this.element(a)
                },
                onkeyup: function(a, b) {
                    (9 !== b.which || "" !== this.elementValue(a)) && (a.name in this.submitted || a === this.lastElement) && this.element(a)
                },
                onclick: function(a) {
                    a.name in this.submitted ? this.element(a) : a.parentNode.name in this.submitted && this.element(a.parentNode)
                },
                highlight: function(b, c, d) {
                    "radio" === b.type ? this.findByName(b.name).addClass(c).removeClass(d) : a(b).addClass(c).removeClass(d)
                },
                unhighlight: function(b, c, d) {
                    "radio" === b.type ? this.findByName(b.name).removeClass(c).addClass(d) : a(b).removeClass(c).addClass(d)
                }
            },
            setDefaults: function(b) {
                a.extend(a.validator.defaults, b)
            },
            messages: {
                required: "This field is required.",
                remote: "Please fix this field.",
                email: "Please enter a valid email address.",
                url: "Please enter a valid URL.",
                date: "Please enter a valid date.",
                dateISO: "Please enter a valid date ( ISO ).",
                number: "Please enter a valid number.",
                digits: "Please enter only digits.",
                creditcard: "Please enter a valid credit card number.",
                equalTo: "Please enter the same value again.",
                maxlength: a.validator.format("Please enter no more than {0} characters."),
                minlength: a.validator.format("Please enter at least {0} characters."),
                rangelength: a.validator.format("Please enter a value between {0} and {1} characters long."),
                range: a.validator.format("Please enter a value between {0} and {1}."),
                max: a.validator.format("Please enter a value less than or equal to {0}."),
                min: a.validator.format("Please enter a value greater than or equal to {0}.")
            },
            autoCreateRanges: !1,
            prototype: {
                init: function() {
                    function b(b) {
                        var c = a.data(this[0].form, "validator"),
                            d = "on" + b.type.replace(/^validate/, ""),
                            e = c.settings;
                        e[d] && !this.is(e.ignore) && e[d].call(c, this[0], b)
                    }
                    this.labelContainer = a(this.settings.errorLabelContainer), this.errorContext = this.labelContainer.length && this.labelContainer || a(this.currentForm), this.containers = a(this.settings.errorContainer).add(this.settings.errorLabelContainer), this.submitted = {}, this.valueCache = {}, this.pendingRequest = 0, this.pending = {}, this.invalid = {}, this.reset();
                    var c, d = this.groups = {};
                    a.each(this.settings.groups, function(b, c) {
                        "string" == typeof c && (c = c.split(/\s/)), a.each(c, function(a, c) {
                            d[c] = b
                        })
                    }), c = this.settings.rules, a.each(c, function(b, d) {
                        c[b] = a.validator.normalizeRule(d)
                    }), a(this.currentForm).validateDelegate(":text, [type='password'], [type='file'], select, textarea, [type='number'], [type='search'] ,[type='tel'], [type='url'], [type='email'], [type='datetime'], [type='date'], [type='month'], [type='week'], [type='time'], [type='datetime-local'], [type='range'], [type='color'], [type='radio'], [type='checkbox']", "focusin focusout keyup", b).validateDelegate("select, option, [type='radio'], [type='checkbox']", "click", b), this.settings.invalidHandler && a(this.currentForm).bind("invalid-form.validate", this.settings.invalidHandler), a(this.currentForm).find("[required], [data-rule-required], .required").attr("aria-required", "true")
                },
                form: function() {
                    return this.checkForm(), a.extend(this.submitted, this.errorMap), this.invalid = a.extend({}, this.errorMap), this.valid() || a(this.currentForm).triggerHandler("invalid-form", [this]), this.showErrors(), this.valid()
                },
                checkForm: function() {
                    this.prepareForm();
                    for (var a = 0, b = this.currentElements = this.elements(); b[a]; a++) this.check(b[a]);
                    return this.valid()
                },
                element: function(b) {
                    var c = this.clean(b),
                        d = this.validationTargetFor(c),
                        e = !0;
                    return this.lastElement = d, void 0 === d ? delete this.invalid[c.name] : (this.prepareElement(d), this.currentElements = a(d), e = this.check(d) !== !1, e ? delete this.invalid[d.name] : this.invalid[d.name] = !0), a(b).attr("aria-invalid", !e), this.numberOfInvalids() || (this.toHide = this.toHide.add(this.containers)), this.showErrors(), e
                },
                showErrors: function(b) {
                    if (b) {
                        a.extend(this.errorMap, b), this.errorList = [];
                        for (var c in b) this.errorList.push({
                            message: b[c],
                            element: this.findByName(c)[0]
                        });
                        this.successList = a.grep(this.successList, function(a) {
                            return !(a.name in b)
                        })
                    }
                    this.settings.showErrors ? this.settings.showErrors.call(this, this.errorMap, this.errorList) : this.defaultShowErrors()
                },
                resetForm: function() {
                    a.fn.resetForm && a(this.currentForm).resetForm(), this.submitted = {}, this.lastElement = null, this.prepareForm(), this.hideErrors(), this.elements().removeClass(this.settings.errorClass).removeData("previousValue").removeAttr("aria-invalid")
                },
                numberOfInvalids: function() {
                    return this.objectLength(this.invalid)
                },
                objectLength: function(a) {
                    var b, c = 0;
                    for (b in a) c++;
                    return c
                },
                hideErrors: function() {
                    this.hideThese(this.toHide)
                },
                hideThese: function(a) {
                    a.not(this.containers).text(""), this.addWrapper(a).hide()
                },
                valid: function() {
                    return 0 === this.size()
                },
                size: function() {
                    return this.errorList.length
                },
                focusInvalid: function() {
                    if (this.settings.focusInvalid) try {
                        a(this.findLastActive() || this.errorList.length && this.errorList[0].element || []).filter(":visible").focus().trigger("focusin")
                    } catch (b) {}
                },
                findLastActive: function() {
                    var b = this.lastActive;
                    return b && 1 === a.grep(this.errorList, function(a) {
                        return a.element.name === b.name
                    }).length && b
                },
                elements: function() {
                    var b = this,
                        c = {};
                    return a(this.currentForm).find("input, select, textarea").not(":submit, :reset, :image, [disabled], [readonly]").not(this.settings.ignore).filter(function() {
                        return !this.name && b.settings.debug && window.console && console.error("%o has no name assigned", this), this.name in c || !b.objectLength(a(this).rules()) ? !1 : (c[this.name] = !0, !0)
                    })
                },
                clean: function(b) {
                    return a(b)[0]
                },
                errors: function() {
                    var b = this.settings.errorClass.split(" ").join(".");
                    return a(this.settings.errorElement + "." + b, this.errorContext)
                },
                reset: function() {
                    this.successList = [], this.errorList = [], this.errorMap = {}, this.toShow = a([]), this.toHide = a([]), this.currentElements = a([])
                },
                prepareForm: function() {
                    this.reset(), this.toHide = this.errors().add(this.containers)
                },
                prepareElement: function(a) {
                    this.reset(), this.toHide = this.errorsFor(a)
                },
                elementValue: function(b) {
                    var c, d = a(b),
                        e = b.type;
                    return "radio" === e || "checkbox" === e ? a("input[name='" + b.name + "']:checked").val() : "number" === e && "undefined" != typeof b.validity ? b.validity.badInput ? !1 : d.val() : (c = d.val(), "string" == typeof c ? c.replace(/\r/g, "") : c)
                },
                check: function(b) {
                    b = this.validationTargetFor(this.clean(b));
                    var c, d, e, f = a(b).rules(),
                        g = a.map(f, function(a, b) {
                            return b
                        }).length,
                        h = !1,
                        i = this.elementValue(b);
                    for (d in f) {
                        e = {
                            method: d,
                            parameters: f[d]
                        };
                        try {
                            if (c = a.validator.methods[d].call(this, i, b, e.parameters), "dependency-mismatch" === c && 1 === g) {
                                h = !0;
                                continue
                            }
                            if (h = !1, "pending" === c) return void(this.toHide = this.toHide.not(this.errorsFor(b)));
                            if (!c) return this.formatAndAdd(b, e), !1
                        } catch (j) {
                            throw this.settings.debug && window.console && console.log("Exception occurred when checking element " + b.id + ", check the '" + e.method + "' method.", j), j
                        }
                    }
                    return h ? void 0 : (this.objectLength(f) && this.successList.push(b), !0)
                },
                customDataMessage: function(b, c) {
                    return a(b).data("msg" + c.charAt(0).toUpperCase() + c.substring(1).toLowerCase()) || a(b).data("msg")
                },
                customMessage: function(a, b) {
                    var c = this.settings.messages[a];
                    return c && (c.constructor === String ? c : c[b])
                },
                findDefined: function() {
                    for (var a = 0; a < arguments.length; a++)
                        if (void 0 !== arguments[a]) return arguments[a];
                    return void 0
                },
                defaultMessage: function(b, c) {
                    return this.findDefined(this.customMessage(b.name, c), this.customDataMessage(b, c), !this.settings.ignoreTitle && b.title || void 0, a.validator.messages[c], "<strong>Warning: No message defined for " + b.name + "</strong>")
                },
                formatAndAdd: function(b, c) {
                    var d = this.defaultMessage(b, c.method),
                        e = /\$?\{(\d+)\}/g;
                    "function" == typeof d ? d = d.call(this, c.parameters, b) : e.test(d) && (d = a.validator.format(d.replace(e, "{$1}"), c.parameters)), this.errorList.push({
                        message: d,
                        element: b,
                        method: c.method
                    }), this.errorMap[b.name] = d, this.submitted[b.name] = d
                },
                addWrapper: function(a) {
                    return this.settings.wrapper && (a = a.add(a.parent(this.settings.wrapper))), a
                },
                defaultShowErrors: function() {
                    var a, b, c;
                    for (a = 0; this.errorList[a]; a++) c = this.errorList[a], this.settings.highlight && this.settings.highlight.call(this, c.element, this.settings.errorClass, this.settings.validClass), this.showLabel(c.element, c.message);
                    if (this.errorList.length && (this.toShow = this.toShow.add(this.containers)), this.settings.success)
                        for (a = 0; this.successList[a]; a++) this.showLabel(this.successList[a]);
                    if (this.settings.unhighlight)
                        for (a = 0, b = this.validElements(); b[a]; a++) this.settings.unhighlight.call(this, b[a], this.settings.errorClass, this.settings.validClass);
                    this.toHide = this.toHide.not(this.toShow), this.hideErrors(), this.addWrapper(this.toShow).show()
                },
                validElements: function() {
                    return this.currentElements.not(this.invalidElements())
                },
                invalidElements: function() {
                    return a(this.errorList).map(function() {
                        return this.element
                    })
                },
                showLabel: function(b, c) {
                    var d, e, f, g = this.errorsFor(b),
                        h = this.idOrName(b),
                        i = a(b).attr("aria-describedby");
                    g.length ? (g.removeClass(this.settings.validClass).addClass(this.settings.errorClass), g.html(c)) : (g = a("<" + this.settings.errorElement + ">").attr("id", h + "-error").addClass(this.settings.errorClass).html(c || ""), d = g, this.settings.wrapper && (d = g.hide().show().wrap("<" + this.settings.wrapper + "/>").parent()), this.labelContainer.length ? this.labelContainer.append(d) : this.settings.errorPlacement ? this.settings.errorPlacement(d, a(b)) : d.insertAfter(b), g.is("label") ? g.attr("for", h) : 0 === g.parents("label[for='" + h + "']").length && (f = g.attr("id").replace(/(:|\.|\[|\])/g, "\\$1"), i ? i.match(new RegExp("\\b" + f + "\\b")) || (i += " " + f) : i = f, a(b).attr("aria-describedby", i), e = this.groups[b.name], e && a.each(this.groups, function(b, c) {
                        c === e && a("[name='" + b + "']", this.currentForm).attr("aria-describedby", g.attr("id"))
                    }))), !c && this.settings.success && (g.text(""), "string" == typeof this.settings.success ? g.addClass(this.settings.success) : this.settings.success(g, b)), this.toShow = this.toShow.add(g)
                },
                errorsFor: function(b) {
                    var c = this.idOrName(b),
                        d = a(b).attr("aria-describedby"),
                        e = "label[for='" + c + "'], label[for='" + c + "'] *";
                    return d && (e = e + ", #" + d.replace(/\s+/g, ", #")), this.errors().filter(e)
                },
                idOrName: function(a) {
                    return this.groups[a.name] || (this.checkable(a) ? a.name : a.id || a.name)
                },
                validationTargetFor: function(b) {
                    return this.checkable(b) && (b = this.findByName(b.name)), a(b).not(this.settings.ignore)[0]
                },
                checkable: function(a) {
                    return /radio|checkbox/i.test(a.type)
                },
                findByName: function(b) {
                    return a(this.currentForm).find("[name='" + b + "']")
                },
                getLength: function(b, c) {
                    switch (c.nodeName.toLowerCase()) {
                        case "select":
                            return a("option:selected", c).length;
                        case "input":
                            if (this.checkable(c)) return this.findByName(c.name).filter(":checked").length
                    }
                    return b.length
                },
                depend: function(a, b) {
                    return this.dependTypes[typeof a] ? this.dependTypes[typeof a](a, b) : !0
                },
                dependTypes: {
                    "boolean": function(a) {
                        return a
                    },
                    string: function(b, c) {
                        return !!a(b, c.form).length
                    },
                    "function": function(a, b) {
                        return a(b)
                    }
                },
                optional: function(b) {
                    var c = this.elementValue(b);
                    return !a.validator.methods.required.call(this, c, b) && "dependency-mismatch"
                },
                startRequest: function(a) {
                    this.pending[a.name] || (this.pendingRequest++, this.pending[a.name] = !0)
                },
                stopRequest: function(b, c) {
                    this.pendingRequest--, this.pendingRequest < 0 && (this.pendingRequest = 0), delete this.pending[b.name], c && 0 === this.pendingRequest && this.formSubmitted && this.form() ? (a(this.currentForm).submit(), this.formSubmitted = !1) : !c && 0 === this.pendingRequest && this.formSubmitted && (a(this.currentForm).triggerHandler("invalid-form", [this]), this.formSubmitted = !1)
                },
                previousValue: function(b) {
                    return a.data(b, "previousValue") || a.data(b, "previousValue", {
                        old: null,
                        valid: !0,
                        message: this.defaultMessage(b, "remote")
                    })
                }
            },
            classRuleSettings: {
                required: {
                    required: !0
                },
                email: {
                    email: !0
                },
                url: {
                    url: !0
                },
                date: {
                    date: !0
                },
                dateISO: {
                    dateISO: !0
                },
                number: {
                    number: !0
                },
                digits: {
                    digits: !0
                },
                creditcard: {
                    creditcard: !0
                }
            },
            addClassRules: function(b, c) {
                b.constructor === String ? this.classRuleSettings[b] = c : a.extend(this.classRuleSettings, b)
            },
            classRules: function(b) {
                var c = {},
                    d = a(b).attr("class");
                return d && a.each(d.split(" "), function() {
                    this in a.validator.classRuleSettings && a.extend(c, a.validator.classRuleSettings[this])
                }), c
            },
            attributeRules: function(b) {
                var c, d, e = {},
                    f = a(b),
                    g = b.getAttribute("type");
                for (c in a.validator.methods) "required" === c ? (d = b.getAttribute(c), "" === d && (d = !0), d = !!d) : d = f.attr(c), /min|max/.test(c) && (null === g || /number|range|text/.test(g)) && (d = Number(d)), d || 0 === d ? e[c] = d : g === c && "range" !== g && (e[c] = !0);
                return e.maxlength && /-1|2147483647|524288/.test(e.maxlength) && delete e.maxlength, e
            },
            dataRules: function(b) {
                var c, d, e = {},
                    f = a(b);
                for (c in a.validator.methods) d = f.data("rule" + c.charAt(0).toUpperCase() + c.substring(1).toLowerCase()), void 0 !== d && (e[c] = d);
                return e
            },
            staticRules: function(b) {
                var c = {},
                    d = a.data(b.form, "validator");
                return d.settings.rules && (c = a.validator.normalizeRule(d.settings.rules[b.name]) || {}), c
            },
            normalizeRules: function(b, c) {
                return a.each(b, function(d, e) {
                    if (e === !1) return void delete b[d];
                    if (e.param || e.depends) {
                        var f = !0;
                        switch (typeof e.depends) {
                            case "string":
                                f = !!a(e.depends, c.form).length;
                                break;
                            case "function":
                                f = e.depends.call(c, c)
                        }
                        f ? b[d] = void 0 !== e.param ? e.param : !0 : delete b[d]
                    }
                }), a.each(b, function(d, e) {
                    b[d] = a.isFunction(e) ? e(c) : e
                }), a.each(["minlength", "maxlength"], function() {
                    b[this] && (b[this] = Number(b[this]))
                }), a.each(["rangelength", "range"], function() {
                    var c;
                    b[this] && (a.isArray(b[this]) ? b[this] = [Number(b[this][0]), Number(b[this][1])] : "string" == typeof b[this] && (c = b[this].replace(/[\[\]]/g, "").split(/[\s,]+/), b[this] = [Number(c[0]), Number(c[1])]))
                }), a.validator.autoCreateRanges && (null != b.min && null != b.max && (b.range = [b.min, b.max], delete b.min, delete b.max), null != b.minlength && null != b.maxlength && (b.rangelength = [b.minlength, b.maxlength], delete b.minlength, delete b.maxlength)), b
            },
            normalizeRule: function(b) {
                if ("string" == typeof b) {
                    var c = {};
                    a.each(b.split(/\s/), function() {
                        c[this] = !0
                    }), b = c
                }
                return b
            },
            addMethod: function(b, c, d) {
                a.validator.methods[b] = c, a.validator.messages[b] = void 0 !== d ? d : a.validator.messages[b], c.length < 3 && a.validator.addClassRules(b, a.validator.normalizeRule(b))
            },
            methods: {
                required: function(b, c, d) {
                    if (!this.depend(d, c)) return "dependency-mismatch";
                    if ("select" === c.nodeName.toLowerCase()) {
                        var e = a(c).val();
                        return e && e.length > 0
                    }
                    return this.checkable(c) ? this.getLength(b, c) > 0 : a.trim(b).length > 0
                },
                email: function(a, b) {
                    return this.optional(b) || /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/.test(a)
                },
                url: function(a, b) {
                    return this.optional(b) || /^(https?|s?ftp):\/\/(((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:)*@)?(((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?)(:\d*)?)(\/((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)+(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*)?)?(\?((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|[\uE000-\uF8FF]|\/|\?)*)?(#((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|\/|\?)*)?$/i.test(a)
                },
                date: function(a, b) {
                    return this.optional(b) || !/Invalid|NaN/.test(new Date(a).toString())
                },
                dateISO: function(a, b) {
                    return this.optional(b) || /^\d{4}[\/\-](0?[1-9]|1[012])[\/\-](0?[1-9]|[12][0-9]|3[01])$/.test(a)
                },
                number: function(a, b) {
                    return this.optional(b) || /^-?(?:\d+|\d{1,3}(?:,\d{3})+)?(?:\.\d+)?$/.test(a)
                },
                digits: function(a, b) {
                    return this.optional(b) || /^\d+$/.test(a)
                },
                creditcard: function(a, b) {
                    if (this.optional(b)) return "dependency-mismatch";
                    if (/[^0-9 \-]+/.test(a)) return !1;
                    var c, d, e = 0,
                        f = 0,
                        g = !1;
                    if (a = a.replace(/\D/g, ""), a.length < 13 || a.length > 19) return !1;
                    for (c = a.length - 1; c >= 0; c--) d = a.charAt(c), f = parseInt(d, 10), g && (f *= 2) > 9 && (f -= 9), e += f, g = !g;
                    return e % 10 === 0
                },
                minlength: function(b, c, d) {
                    var e = a.isArray(b) ? b.length : this.getLength(b, c);
                    return this.optional(c) || e >= d
                },
                maxlength: function(b, c, d) {
                    var e = a.isArray(b) ? b.length : this.getLength(b, c);
                    return this.optional(c) || d >= e
                },
                rangelength: function(b, c, d) {
                    var e = a.isArray(b) ? b.length : this.getLength(b, c);
                    return this.optional(c) || e >= d[0] && e <= d[1]
                },
                min: function(a, b, c) {
                    return this.optional(b) || a >= c
                },
                max: function(a, b, c) {
                    return this.optional(b) || c >= a
                },
                range: function(a, b, c) {
                    return this.optional(b) || a >= c[0] && a <= c[1]
                },
                equalTo: function(b, c, d) {
                    var e = a(d);
                    return this.settings.onfocusout && e.unbind(".validate-equalTo").bind("blur.validate-equalTo", function() {
                        a(c).valid()
                    }), b === e.val()
                },
                remote: function(b, c, d) {
                    if (this.optional(c)) return "dependency-mismatch";
                    var e, f, g = this.previousValue(c);
                    return this.settings.messages[c.name] || (this.settings.messages[c.name] = {}), g.originalMessage = this.settings.messages[c.name].remote, this.settings.messages[c.name].remote = g.message, d = "string" == typeof d && {
                        url: d
                    } || d, g.old === b ? g.valid : (g.old = b, e = this, this.startRequest(c), f = {}, f[c.name] = b, a.ajax(a.extend(!0, {
                        url: d,
                        mode: "abort",
                        port: "validate" + c.name,
                        dataType: "json",
                        data: f,
                        context: e.currentForm,
                        success: function(d) {
                            var f, h, i, j = d === !0 || "true" === d;
                            e.settings.messages[c.name].remote = g.originalMessage, j ? (i = e.formSubmitted, e.prepareElement(c), e.formSubmitted = i, e.successList.push(c), delete e.invalid[c.name], e.showErrors()) : (f = {}, h = d || e.defaultMessage(c, "remote"), f[c.name] = g.message = a.isFunction(h) ? h(b) : h, e.invalid[c.name] = !0, e.showErrors(f)), g.valid = j, e.stopRequest(c, j)
                        }
                    }, d)), "pending")
                }
            }
        }), a.format = function() {
            throw "$.format has been deprecated. Please use $.validator.format instead."
        };
        var b, c = {};
        a.ajaxPrefilter ? a.ajaxPrefilter(function(a, b, d) {
            var e = a.port;
            "abort" === a.mode && (c[e] && c[e].abort(), c[e] = d)
        }) : (b = a.ajax, a.ajax = function(d) {
            var e = ("mode" in d ? d : a.ajaxSettings).mode,
                f = ("port" in d ? d : a.ajaxSettings).port;
            return "abort" === e ? (c[f] && c[f].abort(), c[f] = b.apply(this, arguments), c[f]) : b.apply(this, arguments)
        }), a.extend(a.fn, {
            validateDelegate: function(b, c, d) {
                return this.bind(c, function(c) {
                    var e = a(c.target);
                    return e.is(b) ? d.apply(e, arguments) : void 0
                })
            }
        })
    }), "undefined" == typeof jQuery) throw new Error("Bootstrap's JavaScript requires jQuery");
if (+ function(a) {
        "use strict";
        var b = a.fn.jquery.split(" ")[0].split(".");
        if (b[0] < 2 && b[1] < 9 || 1 == b[0] && 9 == b[1] && b[2] < 1 || b[0] > 2) throw new Error("Bootstrap's JavaScript requires jQuery version 1.9.1 or higher, but lower than version 3")
    }(jQuery), + function(a) {
        "use strict";

        function b() {
            var a = document.createElement("bootstrap"),
                b = {
                    WebkitTransition: "webkitTransitionEnd",
                    MozTransition: "transitionend",
                    OTransition: "oTransitionEnd otransitionend",
                    transition: "transitionend"
                };
            for (var c in b)
                if (void 0 !== a.style[c]) return {
                    end: b[c]
                };
            return !1
        }
        a.fn.emulateTransitionEnd = function(b) {
            var c = !1,
                d = this;
            a(this).one("bsTransitionEnd", function() {
                c = !0
            });
            var e = function() {
                c || a(d).trigger(a.support.transition.end)
            };
            return setTimeout(e, b), this
        }, a(function() {
            a.support.transition = b(), a.support.transition && (a.event.special.bsTransitionEnd = {
                bindType: a.support.transition.end,
                delegateType: a.support.transition.end,
                handle: function(b) {
                    return a(b.target).is(this) ? b.handleObj.handler.apply(this, arguments) : void 0
                }
            })
        })
    }(jQuery), + function(a) {
        "use strict";

        function b(b) {
            return this.each(function() {
                var c = a(this),
                    e = c.data("bs.alert");
                e || c.data("bs.alert", e = new d(this)), "string" == typeof b && e[b].call(c)
            })
        }
        var c = '[data-dismiss="alert"]',
            d = function(b) {
                a(b).on("click", c, this.close)
            };
        d.VERSION = "3.3.6", d.TRANSITION_DURATION = 150, d.prototype.close = function(b) {
            function c() {
                g.detach().trigger("closed.bs.alert").remove()
            }
            var e = a(this),
                f = e.attr("data-target");
            f || (f = e.attr("href"), f = f && f.replace(/.*(?=#[^\s]*$)/, ""));
            var g = a(f);
            b && b.preventDefault(), g.length || (g = e.closest(".alert")), g.trigger(b = a.Event("close.bs.alert")), b.isDefaultPrevented() || (g.removeClass("in"), a.support.transition && g.hasClass("fade") ? g.one("bsTransitionEnd", c).emulateTransitionEnd(d.TRANSITION_DURATION) : c())
        };
        var e = a.fn.alert;
        a.fn.alert = b, a.fn.alert.Constructor = d, a.fn.alert.noConflict = function() {
            return a.fn.alert = e, this
        }, a(document).on("click.bs.alert.data-api", c, d.prototype.close)
    }(jQuery), + function(a) {
        "use strict";

        function b(b) {
            return this.each(function() {
                var d = a(this),
                    e = d.data("bs.button"),
                    f = "object" == typeof b && b;
                e || d.data("bs.button", e = new c(this, f)), "toggle" == b ? e.toggle() : b && e.setState(b)
            })
        }
        var c = function(b, d) {
            this.$element = a(b), this.options = a.extend({}, c.DEFAULTS, d), this.isLoading = !1
        };
        c.VERSION = "3.3.6", c.DEFAULTS = {
            loadingText: "loading..."
        }, c.prototype.setState = function(b) {
            var c = "disabled",
                d = this.$element,
                e = d.is("input") ? "val" : "html",
                f = d.data();
            b += "Text", null == f.resetText && d.data("resetText", d[e]()), setTimeout(a.proxy(function() {
                d[e](null == f[b] ? this.options[b] : f[b]), "loadingText" == b ? (this.isLoading = !0, d.addClass(c).attr(c, c)) : this.isLoading && (this.isLoading = !1, d.removeClass(c).removeAttr(c))
            }, this), 0)
        }, c.prototype.toggle = function() {
            var a = !0,
                b = this.$element.closest('[data-toggle="buttons"]');
            if (b.length) {
                var c = this.$element.find("input");
                "radio" == c.prop("type") ? (c.prop("checked") && (a = !1), b.find(".active").removeClass("active"), this.$element.addClass("active")) : "checkbox" == c.prop("type") && (c.prop("checked") !== this.$element.hasClass("active") && (a = !1), this.$element.toggleClass("active")), c.prop("checked", this.$element.hasClass("active")), a && c.trigger("change")
            } else this.$element.attr("aria-pressed", !this.$element.hasClass("active")), this.$element.toggleClass("active")
        };
        var d = a.fn.button;
        a.fn.button = b, a.fn.button.Constructor = c, a.fn.button.noConflict = function() {
            return a.fn.button = d, this
        }, a(document).on("click.bs.button.data-api", '[data-toggle^="button"]', function(c) {
            var d = a(c.target);
            d.hasClass("btn") || (d = d.closest(".btn")), b.call(d, "toggle"), a(c.target).is('input[type="radio"]') || a(c.target).is('input[type="checkbox"]') || c.preventDefault()
        }).on("focus.bs.button.data-api blur.bs.button.data-api", '[data-toggle^="button"]', function(b) {
            a(b.target).closest(".btn").toggleClass("focus", /^focus(in)?$/.test(b.type))
        })
    }(jQuery), + function(a) {
        "use strict";

        function b(b) {
            return this.each(function() {
                var d = a(this),
                    e = d.data("bs.carousel"),
                    f = a.extend({}, c.DEFAULTS, d.data(), "object" == typeof b && b),
                    g = "string" == typeof b ? b : f.slide;
                e || d.data("bs.carousel", e = new c(this, f)), "number" == typeof b ? e.to(b) : g ? e[g]() : f.interval && e.pause().cycle()
            })
        }
        var c = function(b, c) {
            this.$element = a(b), this.$indicators = this.$element.find(".carousel-indicators"), this.options = c, this.paused = null, this.sliding = null, this.interval = null, this.$active = null, this.$items = null, this.options.keyboard && this.$element.on("keydown.bs.carousel", a.proxy(this.keydown, this)), "hover" == this.options.pause && !("ontouchstart" in document.documentElement) && this.$element.on("mouseenter.bs.carousel", a.proxy(this.pause, this)).on("mouseleave.bs.carousel", a.proxy(this.cycle, this))
        };
        c.VERSION = "3.3.6", c.TRANSITION_DURATION = 600, c.DEFAULTS = {
            interval: 5e3,
            pause: "hover",
            wrap: !0,
            keyboard: !0
        }, c.prototype.keydown = function(a) {
            if (!/input|textarea/i.test(a.target.tagName)) {
                switch (a.which) {
                    case 37:
                        this.prev();
                        break;
                    case 39:
                        this.next();
                        break;
                    default:
                        return
                }
                a.preventDefault()
            }
        }, c.prototype.cycle = function(b) {
            return b || (this.paused = !1), this.interval && clearInterval(this.interval), this.options.interval && !this.paused && (this.interval = setInterval(a.proxy(this.next, this), this.options.interval)), this
        }, c.prototype.getItemIndex = function(a) {
            return this.$items = a.parent().children(".item"), this.$items.index(a || this.$active)
        }, c.prototype.getItemForDirection = function(a, b) {
            var c = this.getItemIndex(b),
                d = "prev" == a && 0 === c || "next" == a && c == this.$items.length - 1;
            if (d && !this.options.wrap) return b;
            var e = "prev" == a ? -1 : 1,
                f = (c + e) % this.$items.length;
            return this.$items.eq(f)
        }, c.prototype.to = function(a) {
            var b = this,
                c = this.getItemIndex(this.$active = this.$element.find(".item.active"));
            return a > this.$items.length - 1 || 0 > a ? void 0 : this.sliding ? this.$element.one("slid.bs.carousel", function() {
                b.to(a)
            }) : c == a ? this.pause().cycle() : this.slide(a > c ? "next" : "prev", this.$items.eq(a))
        }, c.prototype.pause = function(b) {
            return b || (this.paused = !0), this.$element.find(".next, .prev").length && a.support.transition && (this.$element.trigger(a.support.transition.end), this.cycle(!0)), this.interval = clearInterval(this.interval), this
        }, c.prototype.next = function() {
            return this.sliding ? void 0 : this.slide("next")
        }, c.prototype.prev = function() {
            return this.sliding ? void 0 : this.slide("prev")
        }, c.prototype.slide = function(b, d) {
            var e = this.$element.find(".item.active"),
                f = d || this.getItemForDirection(b, e),
                g = this.interval,
                h = "next" == b ? "left" : "right",
                i = this;
            if (f.hasClass("active")) return this.sliding = !1;
            var j = f[0],
                k = a.Event("slide.bs.carousel", {
                    relatedTarget: j,
                    direction: h
                });
            if (this.$element.trigger(k), !k.isDefaultPrevented()) {
                if (this.sliding = !0, g && this.pause(), this.$indicators.length) {
                    this.$indicators.find(".active").removeClass("active");
                    var l = a(this.$indicators.children()[this.getItemIndex(f)]);
                    l && l.addClass("active")
                }
                var m = a.Event("slid.bs.carousel", {
                    relatedTarget: j,
                    direction: h
                });
                return a.support.transition && this.$element.hasClass("slide") ? (f.addClass(b), f[0].offsetWidth, e.addClass(h), f.addClass(h), e.one("bsTransitionEnd", function() {
                    f.removeClass([b, h].join(" ")).addClass("active"), e.removeClass(["active", h].join(" ")), i.sliding = !1, setTimeout(function() {
                        i.$element.trigger(m)
                    }, 0)
                }).emulateTransitionEnd(c.TRANSITION_DURATION)) : (e.removeClass("active"), f.addClass("active"), this.sliding = !1, this.$element.trigger(m)), g && this.cycle(), this
            }
        };
        var d = a.fn.carousel;
        a.fn.carousel = b, a.fn.carousel.Constructor = c, a.fn.carousel.noConflict = function() {
            return a.fn.carousel = d, this
        };
        var e = function(c) {
            var d, e = a(this),
                f = a(e.attr("data-target") || (d = e.attr("href")) && d.replace(/.*(?=#[^\s]+$)/, ""));
            if (f.hasClass("carousel")) {
                var g = a.extend({}, f.data(), e.data()),
                    h = e.attr("data-slide-to");
                h && (g.interval = !1), b.call(f, g), h && f.data("bs.carousel").to(h), c.preventDefault()
            }
        };
        a(document).on("click.bs.carousel.data-api", "[data-slide]", e).on("click.bs.carousel.data-api", "[data-slide-to]", e), a(window).on("load", function() {
            a('[data-ride="carousel"]').each(function() {
                var c = a(this);
                b.call(c, c.data())
            })
        })
    }(jQuery), + function(a) {
        "use strict";

        function b(b) {
            var c, d = b.attr("data-target") || (c = b.attr("href")) && c.replace(/.*(?=#[^\s]+$)/, "");
            return a(d)
        }

        function c(b) {
            return this.each(function() {
                var c = a(this),
                    e = c.data("bs.collapse"),
                    f = a.extend({}, d.DEFAULTS, c.data(), "object" == typeof b && b);
                !e && f.toggle && /show|hide/.test(b) && (f.toggle = !1), e || c.data("bs.collapse", e = new d(this, f)), "string" == typeof b && e[b]()
            })
        }
        var d = function(b, c) {
            this.$element = a(b), this.options = a.extend({}, d.DEFAULTS, c), this.$trigger = a('[data-toggle="collapse"][href="#' + b.id + '"],[data-toggle="collapse"][data-target="#' + b.id + '"]'), this.transitioning = null, this.options.parent ? this.$parent = this.getParent() : this.addAriaAndCollapsedClass(this.$element, this.$trigger), this.options.toggle && this.toggle()
        };
        d.VERSION = "3.3.6", d.TRANSITION_DURATION = 350, d.DEFAULTS = {
            toggle: !0
        }, d.prototype.dimension = function() {
            var a = this.$element.hasClass("width");
            return a ? "width" : "height"
        }, d.prototype.show = function() {
            if (!this.transitioning && !this.$element.hasClass("in")) {
                var b, e = this.$parent && this.$parent.children(".panel").children(".in, .collapsing");
                if (!(e && e.length && (b = e.data("bs.collapse"), b && b.transitioning))) {
                    var f = a.Event("show.bs.collapse");
                    if (this.$element.trigger(f), !f.isDefaultPrevented()) {
                        e && e.length && (c.call(e, "hide"), b || e.data("bs.collapse", null));
                        var g = this.dimension();
                        this.$element.removeClass("collapse").addClass("collapsing")[g](0).attr("aria-expanded", !0), this.$trigger.removeClass("collapsed").attr("aria-expanded", !0), this.transitioning = 1;
                        var h = function() {
                            this.$element.removeClass("collapsing").addClass("collapse in")[g](""), this.transitioning = 0, this.$element.trigger("shown.bs.collapse")
                        };
                        if (!a.support.transition) return h.call(this);
                        var i = a.camelCase(["scroll", g].join("-"));
                        this.$element.one("bsTransitionEnd", a.proxy(h, this)).emulateTransitionEnd(d.TRANSITION_DURATION)[g](this.$element[0][i])
                    }
                }
            }
        }, d.prototype.hide = function() {
            if (!this.transitioning && this.$element.hasClass("in")) {
                var b = a.Event("hide.bs.collapse");
                if (this.$element.trigger(b), !b.isDefaultPrevented()) {
                    var c = this.dimension();
                    this.$element[c](this.$element[c]())[0].offsetHeight, this.$element.addClass("collapsing").removeClass("collapse in").attr("aria-expanded", !1), this.$trigger.addClass("collapsed").attr("aria-expanded", !1), this.transitioning = 1;
                    var e = function() {
                        this.transitioning = 0, this.$element.removeClass("collapsing").addClass("collapse").trigger("hidden.bs.collapse")
                    };
                    return a.support.transition ? void this.$element[c](0).one("bsTransitionEnd", a.proxy(e, this)).emulateTransitionEnd(d.TRANSITION_DURATION) : e.call(this)
                }
            }
        }, d.prototype.toggle = function() {
            this[this.$element.hasClass("in") ? "hide" : "show"]()
        }, d.prototype.getParent = function() {
            return a(this.options.parent).find('[data-toggle="collapse"][data-parent="' + this.options.parent + '"]').each(a.proxy(function(c, d) {
                var e = a(d);
                this.addAriaAndCollapsedClass(b(e), e)
            }, this)).end()
        }, d.prototype.addAriaAndCollapsedClass = function(a, b) {
            var c = a.hasClass("in");
            a.attr("aria-expanded", c), b.toggleClass("collapsed", !c).attr("aria-expanded", c)
        };
        var e = a.fn.collapse;
        a.fn.collapse = c, a.fn.collapse.Constructor = d, a.fn.collapse.noConflict = function() {
            return a.fn.collapse = e, this
        }, a(document).on("click.bs.collapse.data-api", '[data-toggle="collapse"]', function(d) {
            var e = a(this);
            e.attr("data-target") || d.preventDefault();
            var f = b(e),
                g = f.data("bs.collapse"),
                h = g ? "toggle" : e.data();
            c.call(f, h)
        })
    }(jQuery), + function(a) {
        "use strict";

        function b(b) {
            var c = b.attr("data-target");
            c || (c = b.attr("href"), c = c && /#[A-Za-z]/.test(c) && c.replace(/.*(?=#[^\s]*$)/, ""));
            var d = c && a(c);
            return d && d.length ? d : b.parent()
        }

        function c(c) {
            c && 3 === c.which || (a(e).remove(), a(f).each(function() {
                var d = a(this),
                    e = b(d),
                    f = {
                        relatedTarget: this
                    };
                e.hasClass("open") && (c && "click" == c.type && /input|textarea/i.test(c.target.tagName) && a.contains(e[0], c.target) || (e.trigger(c = a.Event("hide.bs.dropdown", f)), c.isDefaultPrevented() || (d.attr("aria-expanded", "false"), e.removeClass("open").trigger(a.Event("hidden.bs.dropdown", f)))))
            }))
        }

        function d(b) {
            return this.each(function() {
                var c = a(this),
                    d = c.data("bs.dropdown");
                d || c.data("bs.dropdown", d = new g(this)), "string" == typeof b && d[b].call(c)
            })
        }
        var e = ".dropdown-backdrop",
            f = '[data-toggle="dropdown"]',
            g = function(b) {
                a(b).on("click.bs.dropdown", this.toggle)
            };
        g.VERSION = "3.3.6", g.prototype.toggle = function(d) {
            var e = a(this);
            if (!e.is(".disabled, :disabled")) {
                var f = b(e),
                    g = f.hasClass("open");
                if (c(), !g) {
                    "ontouchstart" in document.documentElement && !f.closest(".navbar-nav").length && a(document.createElement("div")).addClass("dropdown-backdrop").insertAfter(a(this)).on("click", c);
                    var h = {
                        relatedTarget: this
                    };
                    if (f.trigger(d = a.Event("show.bs.dropdown", h)), d.isDefaultPrevented()) return;
                    e.trigger("focus").attr("aria-expanded", "true"), f.toggleClass("open").trigger(a.Event("shown.bs.dropdown", h))
                }
                return !1
            }
        }, g.prototype.keydown = function(c) {
            if (/(38|40|27|32)/.test(c.which) && !/input|textarea/i.test(c.target.tagName)) {
                var d = a(this);
                if (c.preventDefault(), c.stopPropagation(), !d.is(".disabled, :disabled")) {
                    var e = b(d),
                        g = e.hasClass("open");
                    if (!g && 27 != c.which || g && 27 == c.which) return 27 == c.which && e.find(f).trigger("focus"), d.trigger("click");
                    var h = " li:not(.disabled):visible a",
                        i = e.find(".dropdown-menu" + h);
                    if (i.length) {
                        var j = i.index(c.target);
                        38 == c.which && j > 0 && j--, 40 == c.which && j < i.length - 1 && j++, ~j || (j = 0), i.eq(j).trigger("focus")
                    }
                }
            }
        };
        var h = a.fn.dropdown;
        a.fn.dropdown = d, a.fn.dropdown.Constructor = g, a.fn.dropdown.noConflict = function() {
            return a.fn.dropdown = h, this
        }, a(document).on("click.bs.dropdown.data-api", c).on("click.bs.dropdown.data-api", ".dropdown form", function(a) {
            a.stopPropagation()
        }).on("click.bs.dropdown.data-api", f, g.prototype.toggle).on("keydown.bs.dropdown.data-api", f, g.prototype.keydown).on("keydown.bs.dropdown.data-api", ".dropdown-menu", g.prototype.keydown)
    }(jQuery), + function(a) {
        "use strict";

        function b(b, d) {
            return this.each(function() {
                var e = a(this),
                    f = e.data("bs.modal"),
                    g = a.extend({}, c.DEFAULTS, e.data(), "object" == typeof b && b);
                f || e.data("bs.modal", f = new c(this, g)), "string" == typeof b ? f[b](d) : g.show && f.show(d)
            })
        }
        var c = function(b, c) {
            this.options = c, this.$body = a(document.body), this.$element = a(b), this.$dialog = this.$element.find(".modal-dialog"), this.$backdrop = null, this.isShown = null, this.originalBodyPad = null, this.scrollbarWidth = 0, this.ignoreBackdropClick = !1, this.options.remote && this.$element.find(".modal-content").load(this.options.remote, a.proxy(function() {
                this.$element.trigger("loaded.bs.modal")
            }, this))
        };
        c.VERSION = "3.3.6", c.TRANSITION_DURATION = 300, c.BACKDROP_TRANSITION_DURATION = 150, c.DEFAULTS = {
            backdrop: !0,
            keyboard: !0,
            show: !0
        }, c.prototype.toggle = function(a) {
            return this.isShown ? this.hide() : this.show(a)
        }, c.prototype.show = function(b) {
            var d = this,
                e = a.Event("show.bs.modal", {
                    relatedTarget: b
                });
            this.$element.trigger(e), this.isShown || e.isDefaultPrevented() || (this.isShown = !0, this.checkScrollbar(), this.setScrollbar(), this.$body.addClass("modal-open"), this.escape(), this.resize(), this.$element.on("click.dismiss.bs.modal", '[data-dismiss="modal"]', a.proxy(this.hide, this)), this.$dialog.on("mousedown.dismiss.bs.modal", function() {
                d.$element.one("mouseup.dismiss.bs.modal", function(b) {
                    a(b.target).is(d.$element) && (d.ignoreBackdropClick = !0)
                })
            }), this.backdrop(function() {
                var e = a.support.transition && d.$element.hasClass("fade");
                d.$element.parent().length || d.$element.appendTo(d.$body), d.$element.show().scrollTop(0), d.adjustDialog(), e && d.$element[0].offsetWidth, d.$element.addClass("in"), d.enforceFocus();
                var f = a.Event("shown.bs.modal", {
                    relatedTarget: b
                });
                e ? d.$dialog.one("bsTransitionEnd", function() {
                    d.$element.trigger("focus").trigger(f)
                }).emulateTransitionEnd(c.TRANSITION_DURATION) : d.$element.trigger("focus").trigger(f)
            }))
        }, c.prototype.hide = function(b) {
            b && b.preventDefault(), b = a.Event("hide.bs.modal"), this.$element.trigger(b), this.isShown && !b.isDefaultPrevented() && (this.isShown = !1, this.escape(), this.resize(), a(document).off("focusin.bs.modal"), this.$element.removeClass("in").off("click.dismiss.bs.modal").off("mouseup.dismiss.bs.modal"), this.$dialog.off("mousedown.dismiss.bs.modal"), a.support.transition && this.$element.hasClass("fade") ? this.$element.one("bsTransitionEnd", a.proxy(this.hideModal, this)).emulateTransitionEnd(c.TRANSITION_DURATION) : this.hideModal())
        }, c.prototype.enforceFocus = function() {
            a(document).off("focusin.bs.modal").on("focusin.bs.modal", a.proxy(function(a) {
                this.$element[0] === a.target || this.$element.has(a.target).length || this.$element.trigger("focus")
            }, this))
        }, c.prototype.escape = function() {
            this.isShown && this.options.keyboard ? this.$element.on("keydown.dismiss.bs.modal", a.proxy(function(a) {
                27 == a.which && this.hide()
            }, this)) : this.isShown || this.$element.off("keydown.dismiss.bs.modal")
        }, c.prototype.resize = function() {
            this.isShown ? a(window).on("resize.bs.modal", a.proxy(this.handleUpdate, this)) : a(window).off("resize.bs.modal")
        }, c.prototype.hideModal = function() {
            var a = this;
            this.$element.hide(), this.backdrop(function() {
                a.$body.removeClass("modal-open"), a.resetAdjustments(), a.resetScrollbar(), a.$element.trigger("hidden.bs.modal")
            })
        }, c.prototype.removeBackdrop = function() {
            this.$backdrop && this.$backdrop.remove(), this.$backdrop = null
        }, c.prototype.backdrop = function(b) {
            var d = this,
                e = this.$element.hasClass("fade") ? "fade" : "";
            if (this.isShown && this.options.backdrop) {
                var f = a.support.transition && e;
                if (this.$backdrop = a(document.createElement("div")).addClass("modal-backdrop " + e).appendTo(this.$body), this.$element.on("click.dismiss.bs.modal", a.proxy(function(a) {
                        return this.ignoreBackdropClick ? void(this.ignoreBackdropClick = !1) : void(a.target === a.currentTarget && ("static" == this.options.backdrop ? this.$element[0].focus() : this.hide()))
                    }, this)), f && this.$backdrop[0].offsetWidth, this.$backdrop.addClass("in"), !b) return;
                f ? this.$backdrop.one("bsTransitionEnd", b).emulateTransitionEnd(c.BACKDROP_TRANSITION_DURATION) : b()
            } else if (!this.isShown && this.$backdrop) {
                this.$backdrop.removeClass("in");
                var g = function() {
                    d.removeBackdrop(), b && b()
                };
                a.support.transition && this.$element.hasClass("fade") ? this.$backdrop.one("bsTransitionEnd", g).emulateTransitionEnd(c.BACKDROP_TRANSITION_DURATION) : g()
            } else b && b()
        }, c.prototype.handleUpdate = function() {
            this.adjustDialog()
        }, c.prototype.adjustDialog = function() {
            var a = this.$element[0].scrollHeight > document.documentElement.clientHeight;
            this.$element.css({
                paddingLeft: !this.bodyIsOverflowing && a ? this.scrollbarWidth : "",
                paddingRight: this.bodyIsOverflowing && !a ? this.scrollbarWidth : ""
            })
        }, c.prototype.resetAdjustments = function() {
            this.$element.css({
                paddingLeft: "",
                paddingRight: ""
            })
        }, c.prototype.checkScrollbar = function() {
            var a = window.innerWidth;
            if (!a) {
                var b = document.documentElement.getBoundingClientRect();
                a = b.right - Math.abs(b.left)
            }
            this.bodyIsOverflowing = document.body.clientWidth < a, this.scrollbarWidth = this.measureScrollbar()
        }, c.prototype.setScrollbar = function() {
            var a = parseInt(this.$body.css("padding-right") || 0, 10);
            this.originalBodyPad = document.body.style.paddingRight || "", this.bodyIsOverflowing && this.$body.css("padding-right", a + this.scrollbarWidth)
        }, c.prototype.resetScrollbar = function() {
            this.$body.css("padding-right", this.originalBodyPad)
        }, c.prototype.measureScrollbar = function() {
            var a = document.createElement("div");
            a.className = "modal-scrollbar-measure", this.$body.append(a);
            var b = a.offsetWidth - a.clientWidth;
            return this.$body[0].removeChild(a), b
        };
        var d = a.fn.modal;
        a.fn.modal = b, a.fn.modal.Constructor = c, a.fn.modal.noConflict = function() {
            return a.fn.modal = d, this
        }, a(document).on("click.bs.modal.data-api", '[data-toggle="modal"]', function(c) {
            var d = a(this),
                e = d.attr("href"),
                f = a(d.attr("data-target") || e && e.replace(/.*(?=#[^\s]+$)/, "")),
                g = f.data("bs.modal") ? "toggle" : a.extend({
                    remote: !/#/.test(e) && e
                }, f.data(), d.data());
            d.is("a") && c.preventDefault(), f.one("show.bs.modal", function(a) {
                a.isDefaultPrevented() || f.one("hidden.bs.modal", function() {
                    d.is(":visible") && d.trigger("focus")
                })
            }), b.call(f, g, this)
        })
    }(jQuery), + function(a) {
        "use strict";

        function b(b) {
            return this.each(function() {
                var d = a(this),
                    e = d.data("bs.tooltip"),
                    f = "object" == typeof b && b;
                (e || !/destroy|hide/.test(b)) && (e || d.data("bs.tooltip", e = new c(this, f)), "string" == typeof b && e[b]())
            })
        }
        var c = function(a, b) {
            this.type = null, this.options = null, this.enabled = null, this.timeout = null, this.hoverState = null, this.$element = null, this.inState = null, this.init("tooltip", a, b)
        };
        c.VERSION = "3.3.6", c.TRANSITION_DURATION = 150, c.DEFAULTS = {
            animation: !0,
            placement: "top",
            selector: !1,
            template: '<div class="tooltip" role="tooltip"><div class="tooltip-arrow"></div><div class="tooltip-inner"></div></div>',
            trigger: "hover focus",
            title: "",
            delay: 0,
            html: !1,
            container: !1,
            viewport: {
                selector: "body",
                padding: 0
            }
        }, c.prototype.init = function(b, c, d) {
            if (this.enabled = !0, this.type = b, this.$element = a(c), this.options = this.getOptions(d), this.$viewport = this.options.viewport && a(a.isFunction(this.options.viewport) ? this.options.viewport.call(this, this.$element) : this.options.viewport.selector || this.options.viewport), this.inState = {
                    click: !1,
                    hover: !1,
                    focus: !1
                }, this.$element[0] instanceof document.constructor && !this.options.selector) throw new Error("`selector` option must be specified when initializing " + this.type + " on the window.document object!");
            for (var e = this.options.trigger.split(" "), f = e.length; f--;) {
                var g = e[f];
                if ("click" == g) this.$element.on("click." + this.type, this.options.selector, a.proxy(this.toggle, this));
                else if ("manual" != g) {
                    var h = "hover" == g ? "mouseenter" : "focusin",
                        i = "hover" == g ? "mouseleave" : "focusout";
                    this.$element.on(h + "." + this.type, this.options.selector, a.proxy(this.enter, this)), this.$element.on(i + "." + this.type, this.options.selector, a.proxy(this.leave, this))
                }
            }
            this.options.selector ? this._options = a.extend({}, this.options, {
                trigger: "manual",
                selector: ""
            }) : this.fixTitle()
        }, c.prototype.getDefaults = function() {
            return c.DEFAULTS
        }, c.prototype.getOptions = function(b) {
            return b = a.extend({}, this.getDefaults(), this.$element.data(), b), b.delay && "number" == typeof b.delay && (b.delay = {
                show: b.delay,
                hide: b.delay
            }), b
        }, c.prototype.getDelegateOptions = function() {
            var b = {},
                c = this.getDefaults();
            return this._options && a.each(this._options, function(a, d) {
                c[a] != d && (b[a] = d)
            }), b
        }, c.prototype.enter = function(b) {
            var c = b instanceof this.constructor ? b : a(b.currentTarget).data("bs." + this.type);
            return c || (c = new this.constructor(b.currentTarget, this.getDelegateOptions()), a(b.currentTarget).data("bs." + this.type, c)), b instanceof a.Event && (c.inState["focusin" == b.type ? "focus" : "hover"] = !0), c.tip().hasClass("in") || "in" == c.hoverState ? void(c.hoverState = "in") : (clearTimeout(c.timeout), c.hoverState = "in", c.options.delay && c.options.delay.show ? void(c.timeout = setTimeout(function() {
                "in" == c.hoverState && c.show()
            }, c.options.delay.show)) : c.show())
        }, c.prototype.isInStateTrue = function() {
            for (var a in this.inState)
                if (this.inState[a]) return !0;
            return !1
        }, c.prototype.leave = function(b) {
            var c = b instanceof this.constructor ? b : a(b.currentTarget).data("bs." + this.type);
            return c || (c = new this.constructor(b.currentTarget, this.getDelegateOptions()), a(b.currentTarget).data("bs." + this.type, c)), b instanceof a.Event && (c.inState["focusout" == b.type ? "focus" : "hover"] = !1), c.isInStateTrue() ? void 0 : (clearTimeout(c.timeout), c.hoverState = "out", c.options.delay && c.options.delay.hide ? void(c.timeout = setTimeout(function() {
                "out" == c.hoverState && c.hide()
            }, c.options.delay.hide)) : c.hide())
        }, c.prototype.show = function() {
            var b = a.Event("show.bs." + this.type);
            if (this.hasContent() && this.enabled) {
                this.$element.trigger(b);
                var d = a.contains(this.$element[0].ownerDocument.documentElement, this.$element[0]);
                if (b.isDefaultPrevented() || !d) return;
                var e = this,
                    f = this.tip(),
                    g = this.getUID(this.type);
                this.setContent(), f.attr("id", g), this.$element.attr("aria-describedby", g), this.options.animation && f.addClass("fade");
                var h = "function" == typeof this.options.placement ? this.options.placement.call(this, f[0], this.$element[0]) : this.options.placement,
                    i = /\s?auto?\s?/i,
                    j = i.test(h);
                j && (h = h.replace(i, "") || "top"), f.detach().css({
                    top: 0,
                    left: 0,
                    display: "block"
                }).addClass(h).data("bs." + this.type, this), this.options.container ? f.appendTo(this.options.container) : f.insertAfter(this.$element), this.$element.trigger("inserted.bs." + this.type);
                var k = this.getPosition(),
                    l = f[0].offsetWidth,
                    m = f[0].offsetHeight;
                if (j) {
                    var n = h,
                        o = this.getPosition(this.$viewport);
                    h = "bottom" == h && k.bottom + m > o.bottom ? "top" : "top" == h && k.top - m < o.top ? "bottom" : "right" == h && k.right + l > o.width ? "left" : "left" == h && k.left - l < o.left ? "right" : h, f.removeClass(n).addClass(h)
                }
                var p = this.getCalculatedOffset(h, k, l, m);
                this.applyPlacement(p, h);
                var q = function() {
                    var a = e.hoverState;
                    e.$element.trigger("shown.bs." + e.type), e.hoverState = null, "out" == a && e.leave(e)
                };
                a.support.transition && this.$tip.hasClass("fade") ? f.one("bsTransitionEnd", q).emulateTransitionEnd(c.TRANSITION_DURATION) : q()
            }
        }, c.prototype.applyPlacement = function(b, c) {
            var d = this.tip(),
                e = d[0].offsetWidth,
                f = d[0].offsetHeight,
                g = parseInt(d.css("margin-top"), 10),
                h = parseInt(d.css("margin-left"), 10);
            isNaN(g) && (g = 0), isNaN(h) && (h = 0), b.top += g, b.left += h, a.offset.setOffset(d[0], a.extend({
                using: function(a) {
                    d.css({
                        top: Math.round(a.top),
                        left: Math.round(a.left)
                    })
                }
            }, b), 0), d.addClass("in");
            var i = d[0].offsetWidth,
                j = d[0].offsetHeight;
            "top" == c && j != f && (b.top = b.top + f - j);
            var k = this.getViewportAdjustedDelta(c, b, i, j);
            k.left ? b.left += k.left : b.top += k.top;
            var l = /top|bottom/.test(c),
                m = l ? 2 * k.left - e + i : 2 * k.top - f + j,
                n = l ? "offsetWidth" : "offsetHeight";
            d.offset(b), this.replaceArrow(m, d[0][n], l)
        }, c.prototype.replaceArrow = function(a, b, c) {
            this.arrow().css(c ? "left" : "top", 50 * (1 - a / b) + "%").css(c ? "top" : "left", "")
        }, c.prototype.setContent = function() {
            var a = this.tip(),
                b = this.getTitle();
            a.find(".tooltip-inner")[this.options.html ? "html" : "text"](b), a.removeClass("fade in top bottom left right")
        }, c.prototype.hide = function(b) {
            function d() {
                "in" != e.hoverState && f.detach(), e.$element.removeAttr("aria-describedby").trigger("hidden.bs." + e.type), b && b()
            }
            var e = this,
                f = a(this.$tip),
                g = a.Event("hide.bs." + this.type);
            return this.$element.trigger(g), g.isDefaultPrevented() ? void 0 : (f.removeClass("in"), a.support.transition && f.hasClass("fade") ? f.one("bsTransitionEnd", d).emulateTransitionEnd(c.TRANSITION_DURATION) : d(), this.hoverState = null, this)
        }, c.prototype.fixTitle = function() {
            var a = this.$element;
            (a.attr("title") || "string" != typeof a.attr("data-original-title")) && a.attr("data-original-title", a.attr("title") || "").attr("title", "")
        }, c.prototype.hasContent = function() {
            return this.getTitle()
        }, c.prototype.getPosition = function(b) {
            b = b || this.$element;
            var c = b[0],
                d = "BODY" == c.tagName,
                e = c.getBoundingClientRect();
            null == e.width && (e = a.extend({}, e, {
                width: e.right - e.left,
                height: e.bottom - e.top
            }));
            var f = d ? {
                    top: 0,
                    left: 0
                } : b.offset(),
                g = {
                    scroll: d ? document.documentElement.scrollTop || document.body.scrollTop : b.scrollTop()
                },
                h = d ? {
                    width: a(window).width(),
                    height: a(window).height()
                } : null;
            return a.extend({}, e, g, h, f)
        }, c.prototype.getCalculatedOffset = function(a, b, c, d) {
            return "bottom" == a ? {
                top: b.top + b.height,
                left: b.left + b.width / 2 - c / 2
            } : "top" == a ? {
                top: b.top - d,
                left: b.left + b.width / 2 - c / 2
            } : "left" == a ? {
                top: b.top + b.height / 2 - d / 2,
                left: b.left - c
            } : {
                top: b.top + b.height / 2 - d / 2,
                left: b.left + b.width
            }
        }, c.prototype.getViewportAdjustedDelta = function(a, b, c, d) {
            var e = {
                top: 0,
                left: 0
            };
            if (!this.$viewport) return e;
            var f = this.options.viewport && this.options.viewport.padding || 0,
                g = this.getPosition(this.$viewport);
            if (/right|left/.test(a)) {
                var h = b.top - f - g.scroll,
                    i = b.top + f - g.scroll + d;
                h < g.top ? e.top = g.top - h : i > g.top + g.height && (e.top = g.top + g.height - i)
            } else {
                var j = b.left - f,
                    k = b.left + f + c;
                j < g.left ? e.left = g.left - j : k > g.right && (e.left = g.left + g.width - k)
            }
            return e
        }, c.prototype.getTitle = function() {
            var a, b = this.$element,
                c = this.options;
            return a = b.attr("data-original-title") || ("function" == typeof c.title ? c.title.call(b[0]) : c.title)
        }, c.prototype.getUID = function(a) {
            do a += ~~(1e6 * Math.random()); while (document.getElementById(a));
            return a
        }, c.prototype.tip = function() {
            if (!this.$tip && (this.$tip = a(this.options.template), 1 != this.$tip.length)) throw new Error(this.type + " `template` option must consist of exactly 1 top-level element!");
            return this.$tip
        }, c.prototype.arrow = function() {
            return this.$arrow = this.$arrow || this.tip().find(".tooltip-arrow")
        }, c.prototype.enable = function() {
            this.enabled = !0
        }, c.prototype.disable = function() {
            this.enabled = !1
        }, c.prototype.toggleEnabled = function() {
            this.enabled = !this.enabled
        }, c.prototype.toggle = function(b) {
            var c = this;
            b && (c = a(b.currentTarget).data("bs." + this.type), c || (c = new this.constructor(b.currentTarget, this.getDelegateOptions()), a(b.currentTarget).data("bs." + this.type, c))), b ? (c.inState.click = !c.inState.click, c.isInStateTrue() ? c.enter(c) : c.leave(c)) : c.tip().hasClass("in") ? c.leave(c) : c.enter(c)
        }, c.prototype.destroy = function() {
            var a = this;
            clearTimeout(this.timeout), this.hide(function() {
                a.$element.off("." + a.type).removeData("bs." + a.type), a.$tip && a.$tip.detach(), a.$tip = null, a.$arrow = null, a.$viewport = null
            })
        };
        var d = a.fn.tooltip;
        a.fn.tooltip = b, a.fn.tooltip.Constructor = c, a.fn.tooltip.noConflict = function() {
            return a.fn.tooltip = d, this
        }
    }(jQuery), + function(a) {
        "use strict";

        function b(b) {
            return this.each(function() {
                var d = a(this),
                    e = d.data("bs.popover"),
                    f = "object" == typeof b && b;
                (e || !/destroy|hide/.test(b)) && (e || d.data("bs.popover", e = new c(this, f)), "string" == typeof b && e[b]())
            })
        }
        var c = function(a, b) {
            this.init("popover", a, b)
        };
        if (!a.fn.tooltip) throw new Error("Popover requires tooltip.js");
        c.VERSION = "3.3.6", c.DEFAULTS = a.extend({}, a.fn.tooltip.Constructor.DEFAULTS, {
            placement: "right",
            trigger: "click",
            content: "",
            template: '<div class="popover" role="tooltip"><div class="arrow"></div><h3 class="popover-title"></h3><div class="popover-content"></div></div>'
        }), c.prototype = a.extend({}, a.fn.tooltip.Constructor.prototype), c.prototype.constructor = c, c.prototype.getDefaults = function() {
            return c.DEFAULTS
        }, c.prototype.setContent = function() {
            var a = this.tip(),
                b = this.getTitle(),
                c = this.getContent();
            a.find(".popover-title")[this.options.html ? "html" : "text"](b), a.find(".popover-content").children().detach().end()[this.options.html ? "string" == typeof c ? "html" : "append" : "text"](c), a.removeClass("fade top bottom left right in"), a.find(".popover-title").html() || a.find(".popover-title").hide()
        }, c.prototype.hasContent = function() {
            return this.getTitle() || this.getContent()
        }, c.prototype.getContent = function() {
            var a = this.$element,
                b = this.options;
            return a.attr("data-content") || ("function" == typeof b.content ? b.content.call(a[0]) : b.content)
        }, c.prototype.arrow = function() {
            return this.$arrow = this.$arrow || this.tip().find(".arrow")
        };
        var d = a.fn.popover;
        a.fn.popover = b, a.fn.popover.Constructor = c, a.fn.popover.noConflict = function() {
            return a.fn.popover = d, this
        }
    }(jQuery), + function(a) {
        "use strict";

        function b(c, d) {
            this.$body = a(document.body), this.$scrollElement = a(a(c).is(document.body) ? window : c), this.options = a.extend({}, b.DEFAULTS, d), this.selector = (this.options.target || "") + " .nav li > a", this.offsets = [], this.targets = [], this.activeTarget = null, this.scrollHeight = 0, this.$scrollElement.on("scroll.bs.scrollspy", a.proxy(this.process, this)), this.refresh(), this.process()
        }

        function c(c) {
            return this.each(function() {
                var d = a(this),
                    e = d.data("bs.scrollspy"),
                    f = "object" == typeof c && c;
                e || d.data("bs.scrollspy", e = new b(this, f)), "string" == typeof c && e[c]()
            })
        }
        b.VERSION = "3.3.6", b.DEFAULTS = {
            offset: 10
        }, b.prototype.getScrollHeight = function() {
            return this.$scrollElement[0].scrollHeight || Math.max(this.$body[0].scrollHeight, document.documentElement.scrollHeight)
        }, b.prototype.refresh = function() {
            var b = this,
                c = "offset",
                d = 0;
            this.offsets = [], this.targets = [], this.scrollHeight = this.getScrollHeight(), a.isWindow(this.$scrollElement[0]) || (c = "position", d = this.$scrollElement.scrollTop()), this.$body.find(this.selector).map(function() {
                var b = a(this),
                    e = b.data("target") || b.attr("href"),
                    f = /^#./.test(e) && a(e);
                return f && f.length && f.is(":visible") && [
                    [f[c]().top + d, e]
                ] || null
            }).sort(function(a, b) {
                return a[0] - b[0]
            }).each(function() {
                b.offsets.push(this[0]), b.targets.push(this[1])
            })
        }, b.prototype.process = function() {
            var a, b = this.$scrollElement.scrollTop() + this.options.offset,
                c = this.getScrollHeight(),
                d = this.options.offset + c - this.$scrollElement.height(),
                e = this.offsets,
                f = this.targets,
                g = this.activeTarget;
            if (this.scrollHeight != c && this.refresh(), b >= d) return g != (a = f[f.length - 1]) && this.activate(a);
            if (g && b < e[0]) return this.activeTarget = null, this.clear();
            for (a = e.length; a--;) g != f[a] && b >= e[a] && (void 0 === e[a + 1] || b < e[a + 1]) && this.activate(f[a])
        }, b.prototype.activate = function(b) {
            this.activeTarget = b, this.clear();
            var c = this.selector + '[data-target="' + b + '"],' + this.selector + '[href="' + b + '"]',
                d = a(c).parents("li").addClass("active");
            d.parent(".dropdown-menu").length && (d = d.closest("li.dropdown").addClass("active")), d.trigger("activate.bs.scrollspy")
        }, b.prototype.clear = function() {
            a(this.selector).parentsUntil(this.options.target, ".active").removeClass("active")
        };
        var d = a.fn.scrollspy;
        a.fn.scrollspy = c, a.fn.scrollspy.Constructor = b, a.fn.scrollspy.noConflict = function() {
            return a.fn.scrollspy = d, this
        }, a(window).on("load.bs.scrollspy.data-api", function() {
            a('[data-spy="scroll"]').each(function() {
                var b = a(this);
                c.call(b, b.data())
            })
        })
    }(jQuery), + function(a) {
        "use strict";

        function b(b) {
            return this.each(function() {
                var d = a(this),
                    e = d.data("bs.tab");
                e || d.data("bs.tab", e = new c(this)), "string" == typeof b && e[b]()
            })
        }
        var c = function(b) {
            this.element = a(b)
        };
        c.VERSION = "3.3.6", c.TRANSITION_DURATION = 150, c.prototype.show = function() {
            var b = this.element,
                c = b.closest("ul:not(.dropdown-menu)"),
                d = b.data("target");
            if (d || (d = b.attr("href"), d = d && d.replace(/.*(?=#[^\s]*$)/, "")), !b.parent("li").hasClass("active")) {
                var e = c.find(".active:last a"),
                    f = a.Event("hide.bs.tab", {
                        relatedTarget: b[0]
                    }),
                    g = a.Event("show.bs.tab", {
                        relatedTarget: e[0]
                    });
                if (e.trigger(f), b.trigger(g), !g.isDefaultPrevented() && !f.isDefaultPrevented()) {
                    var h = a(d);
                    this.activate(b.closest("li"), c), this.activate(h, h.parent(), function() {
                        e.trigger({
                            type: "hidden.bs.tab",
                            relatedTarget: b[0]
                        }), b.trigger({
                            type: "shown.bs.tab",
                            relatedTarget: e[0]
                        })
                    })
                }
            }
        }, c.prototype.activate = function(b, d, e) {
            function f() {
                g.removeClass("active").find("> .dropdown-menu > .active").removeClass("active").end().find('[data-toggle="tab"]').attr("aria-expanded", !1), b.addClass("active").find('[data-toggle="tab"]').attr("aria-expanded", !0), h ? (b[0].offsetWidth, b.addClass("in")) : b.removeClass("fade"), b.parent(".dropdown-menu").length && b.closest("li.dropdown").addClass("active").end().find('[data-toggle="tab"]').attr("aria-expanded", !0), e && e()
            }
            var g = d.find("> .active"),
                h = e && a.support.transition && (g.length && g.hasClass("fade") || !!d.find("> .fade").length);
            g.length && h ? g.one("bsTransitionEnd", f).emulateTransitionEnd(c.TRANSITION_DURATION) : f(), g.removeClass("in")
        };
        var d = a.fn.tab;
        a.fn.tab = b, a.fn.tab.Constructor = c, a.fn.tab.noConflict = function() {
            return a.fn.tab = d, this
        };
        var e = function(c) {
            c.preventDefault(), b.call(a(this), "show")
        };
        a(document).on("click.bs.tab.data-api", '[data-toggle="tab"]', e).on("click.bs.tab.data-api", '[data-toggle="pill"]', e)
    }(jQuery), + function(a) {
        "use strict";

        function b(b) {
            return this.each(function() {
                var d = a(this),
                    e = d.data("bs.affix"),
                    f = "object" == typeof b && b;
                e || d.data("bs.affix", e = new c(this, f)), "string" == typeof b && e[b]()
            })
        }
        var c = function(b, d) {
            this.options = a.extend({}, c.DEFAULTS, d), this.$target = a(this.options.target).on("scroll.bs.affix.data-api", a.proxy(this.checkPosition, this)).on("click.bs.affix.data-api", a.proxy(this.checkPositionWithEventLoop, this)), this.$element = a(b), this.affixed = null, this.unpin = null, this.pinnedOffset = null, this.checkPosition()
        };
        c.VERSION = "3.3.6", c.RESET = "affix affix-top affix-bottom", c.DEFAULTS = {
            offset: 0,
            target: window
        }, c.prototype.getState = function(a, b, c, d) {
            var e = this.$target.scrollTop(),
                f = this.$element.offset(),
                g = this.$target.height();
            if (null != c && "top" == this.affixed) return c > e ? "top" : !1;
            if ("bottom" == this.affixed) return null != c ? e + this.unpin <= f.top ? !1 : "bottom" : a - d >= e + g ? !1 : "bottom";
            var h = null == this.affixed,
                i = h ? e : f.top,
                j = h ? g : b;
            return null != c && c >= e ? "top" : null != d && i + j >= a - d ? "bottom" : !1
        }, c.prototype.getPinnedOffset = function() {
            if (this.pinnedOffset) return this.pinnedOffset;
            this.$element.removeClass(c.RESET).addClass("affix");
            var a = this.$target.scrollTop(),
                b = this.$element.offset();
            return this.pinnedOffset = b.top - a
        }, c.prototype.checkPositionWithEventLoop = function() {
            setTimeout(a.proxy(this.checkPosition, this), 1)
        }, c.prototype.checkPosition = function() {
            if (this.$element.is(":visible")) {
                var b = this.$element.height(),
                    d = this.options.offset,
                    e = d.top,
                    f = d.bottom,
                    g = Math.max(a(document).height(), a(document.body).height());
                "object" != typeof d && (f = e = d), "function" == typeof e && (e = d.top(this.$element)),
                    "function" == typeof f && (f = d.bottom(this.$element));
                var h = this.getState(g, b, e, f);
                if (this.affixed != h) {
                    null != this.unpin && this.$element.css("top", "");
                    var i = "affix" + (h ? "-" + h : ""),
                        j = a.Event(i + ".bs.affix");
                    if (this.$element.trigger(j), j.isDefaultPrevented()) return;
                    this.affixed = h, this.unpin = "bottom" == h ? this.getPinnedOffset() : null, this.$element.removeClass(c.RESET).addClass(i).trigger(i.replace("affix", "affixed") + ".bs.affix")
                }
                "bottom" == h && this.$element.offset({
                    top: g - b - f
                })
            }
        };
        var d = a.fn.affix;
        a.fn.affix = b, a.fn.affix.Constructor = c, a.fn.affix.noConflict = function() {
            return a.fn.affix = d, this
        }, a(window).on("load", function() {
            a('[data-spy="affix"]').each(function() {
                var c = a(this),
                    d = c.data();
                d.offset = d.offset || {}, null != d.offsetBottom && (d.offset.bottom = d.offsetBottom), null != d.offsetTop && (d.offset.top = d.offsetTop), b.call(c, d)
            })
        })
    }(jQuery), function(a) {
        "function" == typeof define && define.amd ? define(["jquery"], a) : a("object" == typeof exports ? require("jquery") : jQuery)
    }(function(a, b) {
        function c() {
            return new Date(Date.UTC.apply(Date, arguments))
        }
        "indexOf" in Array.prototype || (Array.prototype.indexOf = function(a, c) {
            c === b && (c = 0), 0 > c && (c += this.length), 0 > c && (c = 0);
            for (var d = this.length; d > c; c++)
                if (c in this && this[c] === a) return c;
            return -1
        });
        var d = function(c, d) {
            var e = this;
            this.element = a(c), this.container = d.container || "body", this.language = d.language || this.element.data("date-language") || "en", this.language = this.language in f ? this.language : this.language.split("-")[0], this.language = this.language in f ? this.language : "en", this.isRTL = f[this.language].rtl || !1, this.formatType = d.formatType || this.element.data("format-type") || "standard", this.format = g.parseFormat(d.format || this.element.data("date-format") || f[this.language].format || g.getDefaultFormat(this.formatType, "input"), this.formatType), this.isInline = !1, this.isVisible = !1, this.isInput = this.element.is("input"), this.fontAwesome = d.fontAwesome || this.element.data("font-awesome") || !1, this.bootcssVer = d.bootcssVer || (this.isInput ? this.element.is(".form-control") ? 3 : 2 : this.bootcssVer = this.element.is(".input-group") ? 3 : 2), this.component = this.element.is(".date") ? 3 == this.bootcssVer ? this.element.find(".input-group-addon .glyphicon-th, .input-group-addon .glyphicon-time, .input-group-addon .glyphicon-remove, .input-group-addon .glyphicon-calendar, .input-group-addon .fa-calendar, .input-group-addon .fa-clock-o").parent() : this.element.find(".add-on .icon-th, .add-on .icon-time, .add-on .icon-calendar, .add-on .fa-calendar, .add-on .fa-clock-o").parent() : !1, this.componentReset = this.element.is(".date") ? 3 == this.bootcssVer ? this.element.find(".input-group-addon .glyphicon-remove, .input-group-addon .fa-times").parent() : this.element.find(".add-on .icon-remove, .add-on .fa-times").parent() : !1, this.hasInput = this.component && this.element.find("input").length, this.component && 0 === this.component.length && (this.component = !1), this.linkField = d.linkField || this.element.data("link-field") || !1, this.linkFormat = g.parseFormat(d.linkFormat || this.element.data("link-format") || g.getDefaultFormat(this.formatType, "link"), this.formatType), this.minuteStep = d.minuteStep || this.element.data("minute-step") || 5, this.pickerPosition = d.pickerPosition || this.element.data("picker-position") || "bottom-right", this.showMeridian = d.showMeridian || this.element.data("show-meridian") || !1, this.initialDate = d.initialDate || new Date, this.zIndex = d.zIndex || this.element.data("z-index") || b, this.title = "undefined" == typeof d.title ? !1 : d.title, this.icons = {
                leftArrow: this.fontAwesome ? "fa-arrow-left" : 3 === this.bootcssVer ? "glyphicon-arrow-left" : "icon-arrow-left",
                rightArrow: this.fontAwesome ? "fa-arrow-right" : 3 === this.bootcssVer ? "glyphicon-arrow-right" : "icon-arrow-right"
            }, this.icontype = this.fontAwesome ? "fa" : "glyphicon", this._attachEvents(), this.clickedOutside = function(b) {
                0 === a(b.target).closest(".datetimepicker").length && e.hide()
            }, this.formatViewType = "datetime", "formatViewType" in d ? this.formatViewType = d.formatViewType : "formatViewType" in this.element.data() && (this.formatViewType = this.element.data("formatViewType")), this.minView = 0, "minView" in d ? this.minView = d.minView : "minView" in this.element.data() && (this.minView = this.element.data("min-view")), this.minView = g.convertViewMode(this.minView), this.maxView = g.modes.length - 1, "maxView" in d ? this.maxView = d.maxView : "maxView" in this.element.data() && (this.maxView = this.element.data("max-view")), this.maxView = g.convertViewMode(this.maxView), this.wheelViewModeNavigation = !1, "wheelViewModeNavigation" in d ? this.wheelViewModeNavigation = d.wheelViewModeNavigation : "wheelViewModeNavigation" in this.element.data() && (this.wheelViewModeNavigation = this.element.data("view-mode-wheel-navigation")), this.wheelViewModeNavigationInverseDirection = !1, "wheelViewModeNavigationInverseDirection" in d ? this.wheelViewModeNavigationInverseDirection = d.wheelViewModeNavigationInverseDirection : "wheelViewModeNavigationInverseDirection" in this.element.data() && (this.wheelViewModeNavigationInverseDirection = this.element.data("view-mode-wheel-navigation-inverse-dir")), this.wheelViewModeNavigationDelay = 100, "wheelViewModeNavigationDelay" in d ? this.wheelViewModeNavigationDelay = d.wheelViewModeNavigationDelay : "wheelViewModeNavigationDelay" in this.element.data() && (this.wheelViewModeNavigationDelay = this.element.data("view-mode-wheel-navigation-delay")), this.startViewMode = 2, "startView" in d ? this.startViewMode = d.startView : "startView" in this.element.data() && (this.startViewMode = this.element.data("start-view")), this.startViewMode = g.convertViewMode(this.startViewMode), this.viewMode = this.startViewMode, this.viewSelect = this.minView, "viewSelect" in d ? this.viewSelect = d.viewSelect : "viewSelect" in this.element.data() && (this.viewSelect = this.element.data("view-select")), this.viewSelect = g.convertViewMode(this.viewSelect), this.forceParse = !0, "forceParse" in d ? this.forceParse = d.forceParse : "dateForceParse" in this.element.data() && (this.forceParse = this.element.data("date-force-parse"));
            for (var h = 3 === this.bootcssVer ? g.templateV3 : g.template; - 1 !== h.indexOf("{iconType}");) h = h.replace("{iconType}", this.icontype);
            for (; - 1 !== h.indexOf("{leftArrow}");) h = h.replace("{leftArrow}", this.icons.leftArrow);
            for (; - 1 !== h.indexOf("{rightArrow}");) h = h.replace("{rightArrow}", this.icons.rightArrow);
            if (this.picker = a(h).appendTo(this.isInline ? this.element : this.container).on({
                    click: a.proxy(this.click, this),
                    mousedown: a.proxy(this.mousedown, this)
                }), this.wheelViewModeNavigation && (a.fn.mousewheel ? this.picker.on({
                    mousewheel: a.proxy(this.mousewheel, this)
                }) : console.log("Mouse Wheel event is not supported. Please include the jQuery Mouse Wheel plugin before enabling this option")), this.picker.addClass(this.isInline ? "datetimepicker-inline" : "datetimepicker-dropdown-" + this.pickerPosition + " dropdown-menu"), this.isRTL) {
                this.picker.addClass("datetimepicker-rtl");
                var i = 3 === this.bootcssVer ? ".prev span, .next span" : ".prev i, .next i";
                this.picker.find(i).toggleClass(this.icons.leftArrow + " " + this.icons.rightArrow)
            }
            a(document).on("mousedown", this.clickedOutside), this.autoclose = !1, "autoclose" in d ? this.autoclose = d.autoclose : "dateAutoclose" in this.element.data() && (this.autoclose = this.element.data("date-autoclose")), this.keyboardNavigation = !0, "keyboardNavigation" in d ? this.keyboardNavigation = d.keyboardNavigation : "dateKeyboardNavigation" in this.element.data() && (this.keyboardNavigation = this.element.data("date-keyboard-navigation")), this.todayBtn = d.todayBtn || this.element.data("date-today-btn") || !1, this.clearBtn = d.clearBtn || this.element.data("date-clear-btn") || !1, this.todayHighlight = d.todayHighlight || this.element.data("date-today-highlight") || !1, this.weekStart = (d.weekStart || this.element.data("date-weekstart") || f[this.language].weekStart || 0) % 7, this.weekEnd = (this.weekStart + 6) % 7, this.startDate = -(1 / 0), this.endDate = 1 / 0, this.datesDisabled = [], this.daysOfWeekDisabled = [], this.setStartDate(d.startDate || this.element.data("date-startdate")), this.setEndDate(d.endDate || this.element.data("date-enddate")), this.setDatesDisabled(d.datesDisabled || this.element.data("date-dates-disabled")), this.setDaysOfWeekDisabled(d.daysOfWeekDisabled || this.element.data("date-days-of-week-disabled")), this.setMinutesDisabled(d.minutesDisabled || this.element.data("date-minute-disabled")), this.setHoursDisabled(d.hoursDisabled || this.element.data("date-hour-disabled")), this.fillDow(), this.fillMonths(), this.update(), this.showMode(), this.isInline && this.show()
        };
        d.prototype = {
            constructor: d,
            _events: [],
            _attachEvents: function() {
                this._detachEvents(), this.isInput ? this._events = [
                    [this.element, {
                        focus: a.proxy(this.show, this),
                        keyup: a.proxy(this.update, this),
                        keydown: a.proxy(this.keydown, this)
                    }]
                ] : this.component && this.hasInput ? (this._events = [
                    [this.element.find("input"), {
                        focus: a.proxy(this.show, this),
                        keyup: a.proxy(this.update, this),
                        keydown: a.proxy(this.keydown, this)
                    }],
                    [this.component, {
                        click: a.proxy(this.show, this)
                    }]
                ], this.componentReset && this._events.push([this.componentReset, {
                    click: a.proxy(this.reset, this)
                }])) : this.element.is("div") ? this.isInline = !0 : this._events = [
                    [this.element, {
                        click: a.proxy(this.show, this)
                    }]
                ];
                for (var b, c, d = 0; d < this._events.length; d++) b = this._events[d][0], c = this._events[d][1], b.on(c)
            },
            _detachEvents: function() {
                for (var a, b, c = 0; c < this._events.length; c++) a = this._events[c][0], b = this._events[c][1], a.off(b);
                this._events = []
            },
            show: function(b) {
                this.picker.show(), this.height = this.component ? this.component.outerHeight() : this.element.outerHeight(), this.forceParse && this.update(), this.place(), a(window).on("resize", a.proxy(this.place, this)), b && (b.stopPropagation(), b.preventDefault()), this.isVisible = !0, this.element.trigger({
                    type: "show",
                    date: this.date
                })
            },
            hide: function() {
                this.isVisible && (this.isInline || (this.picker.hide(), a(window).off("resize", this.place), this.viewMode = this.startViewMode, this.showMode(), this.isInput || a(document).off("mousedown", this.hide), this.forceParse && (this.isInput && this.element.val() || this.hasInput && this.element.find("input").val()) && this.setValue(), this.isVisible = !1, this.element.trigger({
                    type: "hide",
                    date: this.date
                })))
            },
            remove: function() {
                this._detachEvents(), a(document).off("mousedown", this.clickedOutside), this.picker.remove(), delete this.picker, delete this.element.data().datetimepicker
            },
            getDate: function() {
                var a = this.getUTCDate();
                return new Date(a.getTime() + 6e4 * a.getTimezoneOffset())
            },
            getUTCDate: function() {
                return this.date
            },
            getInitialDate: function() {
                return this.initialDate
            },
            setInitialDate: function(a) {
                this.initialDate = a
            },
            setDate: function(a) {
                this.setUTCDate(new Date(a.getTime() - 6e4 * a.getTimezoneOffset()))
            },
            setUTCDate: function(a) {
                a >= this.startDate && a <= this.endDate ? (this.date = a, this.setValue(), this.viewDate = this.date, this.fill()) : this.element.trigger({
                    type: "outOfRange",
                    date: a,
                    startDate: this.startDate,
                    endDate: this.endDate
                })
            },
            setFormat: function(a) {
                this.format = g.parseFormat(a, this.formatType);
                var b;
                this.isInput ? b = this.element : this.component && (b = this.element.find("input")), b && b.val() && this.setValue()
            },
            setValue: function() {
                var b = this.getFormattedDate();
                this.isInput ? this.element.val(b) : (this.component && this.element.find("input").val(b), this.element.data("date", b)), this.linkField && a("#" + this.linkField).val(this.getFormattedDate(this.linkFormat))
            },
            getFormattedDate: function(a) {
                return a == b && (a = this.format), g.formatDate(this.date, a, this.language, this.formatType)
            },
            setStartDate: function(a) {
                this.startDate = a || -(1 / 0), this.startDate !== -(1 / 0) && (this.startDate = g.parseDate(this.startDate, this.format, this.language, this.formatType)), this.update(), this.updateNavArrows()
            },
            setEndDate: function(a) {
                this.endDate = a || 1 / 0, this.endDate !== 1 / 0 && (this.endDate = g.parseDate(this.endDate, this.format, this.language, this.formatType)), this.update(), this.updateNavArrows()
            },
            setDatesDisabled: function(b) {
                this.datesDisabled = b || [], a.isArray(this.datesDisabled) || (this.datesDisabled = this.datesDisabled.split(/,\s*/)), this.datesDisabled = a.map(this.datesDisabled, function(a) {
                    return g.parseDate(a, this.format, this.language, this.formatType).toDateString()
                }), this.update(), this.updateNavArrows()
            },
            setTitle: function(a, b) {
                return this.picker.find(a).find("th:eq(1)").text(this.title === !1 ? b : this.title)
            },
            setDaysOfWeekDisabled: function(b) {
                this.daysOfWeekDisabled = b || [], a.isArray(this.daysOfWeekDisabled) || (this.daysOfWeekDisabled = this.daysOfWeekDisabled.split(/,\s*/)), this.daysOfWeekDisabled = a.map(this.daysOfWeekDisabled, function(a) {
                    return parseInt(a, 10)
                }), this.update(), this.updateNavArrows()
            },
            setMinutesDisabled: function(b) {
                this.minutesDisabled = b || [], a.isArray(this.minutesDisabled) || (this.minutesDisabled = this.minutesDisabled.split(/,\s*/)), this.minutesDisabled = a.map(this.minutesDisabled, function(a) {
                    return parseInt(a, 10)
                }), this.update(), this.updateNavArrows()
            },
            setHoursDisabled: function(b) {
                this.hoursDisabled = b || [], a.isArray(this.hoursDisabled) || (this.hoursDisabled = this.hoursDisabled.split(/,\s*/)), this.hoursDisabled = a.map(this.hoursDisabled, function(a) {
                    return parseInt(a, 10)
                }), this.update(), this.updateNavArrows()
            },
            place: function() {
                if (!this.isInline) {
                    if (!this.zIndex) {
                        var b = 0;
                        a("div").each(function() {
                            var c = parseInt(a(this).css("zIndex"), 10);
                            c > b && (b = c)
                        }), this.zIndex = b + 10
                    }
                    var c, d, e, f;
                    f = this.container instanceof a ? this.container.offset() : a(this.container).offset(), this.component ? (c = this.component.offset(), e = c.left, ("bottom-left" == this.pickerPosition || "top-left" == this.pickerPosition) && (e += this.component.outerWidth() - this.picker.outerWidth())) : (c = this.element.offset(), e = c.left, ("bottom-left" == this.pickerPosition || "top-left" == this.pickerPosition) && (e += this.element.outerWidth() - this.picker.outerWidth()));
                    var g = document.body.clientWidth || window.innerWidth;
                    e + 220 > g && (e = g - 220), this.component ? (d = d - f.top + 169, e = e - f.left + 210) : d = "top-left" == this.pickerPosition || "top-right" == this.pickerPosition ? c.top - this.picker.outerHeight() : c.top + this.height, this.picker.css({
                        top: d,
                        left: e,
                        zIndex: this.zIndex
                    })
                }
            },
            update: function() {
                var a, b = !1;
                arguments && arguments.length && ("string" == typeof arguments[0] || arguments[0] instanceof Date) ? (a = arguments[0], b = !0) : (a = (this.isInput ? this.element.val() : this.element.find("input").val()) || this.element.data("date") || this.initialDate, ("string" == typeof a || a instanceof String) && (a = a.replace(/^\s+|\s+$/g, ""))), a || (a = new Date, b = !1), this.date = g.parseDate(a, this.format, this.language, this.formatType), b && this.setValue(), this.viewDate = new Date(this.date < this.startDate ? this.startDate : this.date > this.endDate ? this.endDate : this.date), this.fill()
            },
            fillDow: function() {
                for (var a = this.weekStart, b = "<tr>"; a < this.weekStart + 7;) b += '<th class="dow">' + f[this.language].daysMin[a++ % 7] + "</th>";
                b += "</tr>", this.picker.find(".datetimepicker-days thead").append(b)
            },
            fillMonths: function() {
                for (var a = "", b = 0; 12 > b;) a += '<span class="month">' + f[this.language].monthsShort[b++] + "</span>";
                this.picker.find(".datetimepicker-months td").html(a)
            },
            fill: function() {
                if (null != this.date && null != this.viewDate) {
                    var b = new Date(this.viewDate),
                        d = b.getUTCFullYear(),
                        e = b.getUTCMonth(),
                        h = b.getUTCDate(),
                        i = b.getUTCHours(),
                        j = b.getUTCMinutes(),
                        k = this.startDate !== -(1 / 0) ? this.startDate.getUTCFullYear() : -(1 / 0),
                        l = this.startDate !== -(1 / 0) ? this.startDate.getUTCMonth() + 1 : -(1 / 0),
                        m = this.endDate !== 1 / 0 ? this.endDate.getUTCFullYear() : 1 / 0,
                        n = this.endDate !== 1 / 0 ? this.endDate.getUTCMonth() + 1 : 1 / 0,
                        o = new c(this.date.getUTCFullYear(), this.date.getUTCMonth(), this.date.getUTCDate()).valueOf(),
                        p = new Date;
                    if (this.setTitle(".datetimepicker-days", f[this.language].months[e] + " " + d), "time" == this.formatViewType) {
                        var q = this.getFormattedDate();
                        this.setTitle(".datetimepicker-hours", q), this.setTitle(".datetimepicker-minutes", q)
                    } else this.setTitle(".datetimepicker-hours", h + " " + f[this.language].months[e] + " " + d), this.setTitle(".datetimepicker-minutes", h + " " + f[this.language].months[e] + " " + d);
                    this.picker.find("tfoot th.today").text(f[this.language].today || f.en.today).toggle(this.todayBtn !== !1), this.picker.find("tfoot th.clear").text(f[this.language].clear || f.en.clear).toggle(this.clearBtn !== !1), this.updateNavArrows(), this.fillMonths();
                    var r = c(d, e - 1, 28, 0, 0, 0, 0),
                        s = g.getDaysInMonth(r.getUTCFullYear(), r.getUTCMonth());
                    r.setUTCDate(s), r.setUTCDate(s - (r.getUTCDay() - this.weekStart + 7) % 7);
                    var t = new Date(r);
                    t.setUTCDate(t.getUTCDate() + 42), t = t.valueOf();
                    for (var u, v = []; r.valueOf() < t;) r.getUTCDay() == this.weekStart && v.push("<tr>"), u = "", r.getUTCFullYear() < d || r.getUTCFullYear() == d && r.getUTCMonth() < e ? u += " old" : (r.getUTCFullYear() > d || r.getUTCFullYear() == d && r.getUTCMonth() > e) && (u += " new"), this.todayHighlight && r.getUTCFullYear() == p.getFullYear() && r.getUTCMonth() == p.getMonth() && r.getUTCDate() == p.getDate() && (u += " today"), r.valueOf() == o && (u += " active"), (r.valueOf() + 864e5 <= this.startDate || r.valueOf() > this.endDate || -1 !== a.inArray(r.getUTCDay(), this.daysOfWeekDisabled) || -1 !== a.inArray(r.toDateString(), this.datesDisabled)) && (u += " disabled"), v.push('<td class="day' + u + '">' + r.getUTCDate() + "</td>"), r.getUTCDay() == this.weekEnd && v.push("</tr>"), r.setUTCDate(r.getUTCDate() + 1);
                    this.picker.find(".datetimepicker-days tbody").empty().append(v.join("")), v = [];
                    for (var w = "", x = "", y = "", z = this.hoursDisabled || [], A = 0; 24 > A; A++)
                        if (-1 === z.indexOf(A)) {
                            var B = c(d, e, h, A);
                            u = "", B.valueOf() + 36e5 <= this.startDate || B.valueOf() > this.endDate ? u += " disabled" : i == A && (u += " active"), this.showMeridian && 2 == f[this.language].meridiem.length ? (x = 12 > A ? f[this.language].meridiem[0] : f[this.language].meridiem[1], x != y && ("" != y && v.push("</fieldset>"), v.push('<fieldset class="hour"><legend>' + x.toUpperCase() + "</legend>")), y = x, w = A % 12 ? A % 12 : 12, v.push('<span class="hour' + u + " hour_" + (12 > A ? "am" : "pm") + '">' + w + "</span>"), 23 == A && v.push("</fieldset>")) : (w = A + ":00", v.push('<span class="hour' + u + '">' + w + "</span>"))
                        }
                    this.picker.find(".datetimepicker-hours td").html(v.join("")), v = [], w = "", x = "", y = "";
                    for (var C = this.minutesDisabled || [], A = 0; 60 > A; A += this.minuteStep)
                        if (-1 === C.indexOf(A)) {
                            var B = c(d, e, h, i, A, 0);
                            u = "", B.valueOf() < this.startDate || B.valueOf() > this.endDate ? u += " disabled" : Math.floor(j / this.minuteStep) == Math.floor(A / this.minuteStep) && (u += " active"), this.showMeridian && 2 == f[this.language].meridiem.length ? (x = 12 > i ? f[this.language].meridiem[0] : f[this.language].meridiem[1], x != y && ("" != y && v.push("</fieldset>"), v.push('<fieldset class="minute"><legend>' + x.toUpperCase() + "</legend>")), y = x, w = i % 12 ? i % 12 : 12, v.push('<span class="minute' + u + '">' + w + ":" + (10 > A ? "0" + A : A) + "</span>"), 59 == A && v.push("</fieldset>")) : (w = A + ":00", v.push('<span class="minute' + u + '">' + i + ":" + (10 > A ? "0" + A : A) + "</span>"))
                        }
                    this.picker.find(".datetimepicker-minutes td").html(v.join(""));
                    var D = this.date.getUTCFullYear(),
                        E = this.setTitle(".datetimepicker-months", d).end().find("span").removeClass("active");
                    if (D == d) {
                        var F = E.length - 12;
                        E.eq(this.date.getUTCMonth() + F).addClass("active")
                    }(k > d || d > m) && E.addClass("disabled"), d == k && E.slice(0, l + 1).addClass("disabled"), d == m && E.slice(n).addClass("disabled"), v = "", d = 10 * parseInt(d / 10, 10);
                    var G = this.setTitle(".datetimepicker-years", d + "-" + (d + 9)).end().find("td");
                    d -= 1;
                    for (var A = -1; 11 > A; A++) v += '<span class="year' + (-1 == A || 10 == A ? " old" : "") + (D == d ? " active" : "") + (k > d || d > m ? " disabled" : "") + '">' + d + "</span>", d += 1;
                    G.html(v), this.place()
                }
            },
            updateNavArrows: function() {
                var a = new Date(this.viewDate),
                    b = a.getUTCFullYear(),
                    c = a.getUTCMonth(),
                    d = a.getUTCDate(),
                    e = a.getUTCHours();
                switch (this.viewMode) {
                    case 0:
                        this.picker.find(".prev").css(this.startDate !== -(1 / 0) && b <= this.startDate.getUTCFullYear() && c <= this.startDate.getUTCMonth() && d <= this.startDate.getUTCDate() && e <= this.startDate.getUTCHours() ? {
                            visibility: "hidden"
                        } : {
                            visibility: "visible"
                        }), this.picker.find(".next").css(this.endDate !== 1 / 0 && b >= this.endDate.getUTCFullYear() && c >= this.endDate.getUTCMonth() && d >= this.endDate.getUTCDate() && e >= this.endDate.getUTCHours() ? {
                            visibility: "hidden"
                        } : {
                            visibility: "visible"
                        });
                        break;
                    case 1:
                        this.picker.find(".prev").css(this.startDate !== -(1 / 0) && b <= this.startDate.getUTCFullYear() && c <= this.startDate.getUTCMonth() && d <= this.startDate.getUTCDate() ? {
                            visibility: "hidden"
                        } : {
                            visibility: "visible"
                        }), this.picker.find(".next").css(this.endDate !== 1 / 0 && b >= this.endDate.getUTCFullYear() && c >= this.endDate.getUTCMonth() && d >= this.endDate.getUTCDate() ? {
                            visibility: "hidden"
                        } : {
                            visibility: "visible"
                        });
                        break;
                    case 2:
                        this.picker.find(".prev").css(this.startDate !== -(1 / 0) && b <= this.startDate.getUTCFullYear() && c <= this.startDate.getUTCMonth() ? {
                            visibility: "hidden"
                        } : {
                            visibility: "visible"
                        }), this.picker.find(".next").css(this.endDate !== 1 / 0 && b >= this.endDate.getUTCFullYear() && c >= this.endDate.getUTCMonth() ? {
                            visibility: "hidden"
                        } : {
                            visibility: "visible"
                        });
                        break;
                    case 3:
                    case 4:
                        this.picker.find(".prev").css(this.startDate !== -(1 / 0) && b <= this.startDate.getUTCFullYear() ? {
                            visibility: "hidden"
                        } : {
                            visibility: "visible"
                        }), this.picker.find(".next").css(this.endDate !== 1 / 0 && b >= this.endDate.getUTCFullYear() ? {
                            visibility: "hidden"
                        } : {
                            visibility: "visible"
                        })
                }
            },
            mousewheel: function(b) {
                if (b.preventDefault(), b.stopPropagation(), !this.wheelPause) {
                    this.wheelPause = !0;
                    var c = b.originalEvent,
                        d = c.wheelDelta,
                        e = d > 0 ? 1 : 0 === d ? 0 : -1;
                    this.wheelViewModeNavigationInverseDirection && (e = -e), this.showMode(e), setTimeout(a.proxy(function() {
                        this.wheelPause = !1
                    }, this), this.wheelViewModeNavigationDelay)
                }
            },
            click: function(b) {
                b.stopPropagation(), b.preventDefault();
                var d = a(b.target).closest("span, td, th, legend");
                if (d.is("." + this.icontype) && (d = a(d).parent().closest("span, td, th, legend")), 1 == d.length) {
                    if (d.is(".disabled")) return void this.element.trigger({
                        type: "outOfRange",
                        date: this.viewDate,
                        startDate: this.startDate,
                        endDate: this.endDate
                    });
                    switch (d[0].nodeName.toLowerCase()) {
                        case "th":
                            switch (d[0].className) {
                                case "switch":
                                    this.showMode(1);
                                    break;
                                case "prev":
                                case "next":
                                    var e = g.modes[this.viewMode].navStep * ("prev" == d[0].className ? -1 : 1);
                                    switch (this.viewMode) {
                                        case 0:
                                            this.viewDate = this.moveHour(this.viewDate, e);
                                            break;
                                        case 1:
                                            this.viewDate = this.moveDate(this.viewDate, e);
                                            break;
                                        case 2:
                                            this.viewDate = this.moveMonth(this.viewDate, e);
                                            break;
                                        case 3:
                                        case 4:
                                            this.viewDate = this.moveYear(this.viewDate, e)
                                    }
                                    this.fill(), this.element.trigger({
                                        type: d[0].className + ":" + this.convertViewModeText(this.viewMode),
                                        date: this.viewDate,
                                        startDate: this.startDate,
                                        endDate: this.endDate
                                    });
                                    break;
                                case "clear":
                                    this.reset(), this.autoclose && this.hide();
                                    break;
                                case "today":
                                    var f = new Date;
                                    f = c(f.getFullYear(), f.getMonth(), f.getDate(), f.getHours(), f.getMinutes(), f.getSeconds(), 0), f < this.startDate ? f = this.startDate : f > this.endDate && (f = this.endDate), this.viewMode = this.startViewMode, this.showMode(0), this._setDate(f), this.fill(), this.autoclose && this.hide()
                            }
                            break;
                        case "span":
                            if (!d.is(".disabled")) {
                                var h = this.viewDate.getUTCFullYear(),
                                    i = this.viewDate.getUTCMonth(),
                                    j = this.viewDate.getUTCDate(),
                                    k = this.viewDate.getUTCHours(),
                                    l = this.viewDate.getUTCMinutes(),
                                    m = this.viewDate.getUTCSeconds();
                                if (d.is(".month") ? (this.viewDate.setUTCDate(1), i = d.parent().find("span").index(d), j = this.viewDate.getUTCDate(), this.viewDate.setUTCMonth(i), this.element.trigger({
                                        type: "changeMonth",
                                        date: this.viewDate
                                    }), this.viewSelect >= 3 && this._setDate(c(h, i, j, k, l, m, 0))) : d.is(".year") ? (this.viewDate.setUTCDate(1), h = parseInt(d.text(), 10) || 0, this.viewDate.setUTCFullYear(h), this.element.trigger({
                                        type: "changeYear",
                                        date: this.viewDate
                                    }), this.viewSelect >= 4 && this._setDate(c(h, i, j, k, l, m, 0))) : d.is(".hour") ? (k = parseInt(d.text(), 10) || 0, (d.hasClass("hour_am") || d.hasClass("hour_pm")) && (12 == k && d.hasClass("hour_am") ? k = 0 : 12 != k && d.hasClass("hour_pm") && (k += 12)), this.viewDate.setUTCHours(k), this.element.trigger({
                                        type: "changeHour",
                                        date: this.viewDate
                                    }), this.viewSelect >= 1 && this._setDate(c(h, i, j, k, l, m, 0))) : d.is(".minute") && (l = parseInt(d.text().substr(d.text().indexOf(":") + 1), 10) || 0, this.viewDate.setUTCMinutes(l), this.element.trigger({
                                        type: "changeMinute",
                                        date: this.viewDate
                                    }), this.viewSelect >= 0 && this._setDate(c(h, i, j, k, l, m, 0))), 0 != this.viewMode) {
                                    var n = this.viewMode;
                                    this.showMode(-1), this.fill(), n == this.viewMode && this.autoclose && this.hide()
                                } else this.fill(), this.autoclose && this.hide()
                            }
                            break;
                        case "td":
                            if (d.is(".day") && !d.is(".disabled")) {
                                var j = parseInt(d.text(), 10) || 1,
                                    h = this.viewDate.getUTCFullYear(),
                                    i = this.viewDate.getUTCMonth(),
                                    k = this.viewDate.getUTCHours(),
                                    l = this.viewDate.getUTCMinutes(),
                                    m = this.viewDate.getUTCSeconds();
                                d.is(".old") ? 0 === i ? (i = 11, h -= 1) : i -= 1 : d.is(".new") && (11 == i ? (i = 0, h += 1) : i += 1), this.viewDate.setUTCFullYear(h), this.viewDate.setUTCMonth(i, j), this.element.trigger({
                                    type: "changeDay",
                                    date: this.viewDate
                                }), this.viewSelect >= 2 && this._setDate(c(h, i, j, k, l, m, 0))
                            }
                            var n = this.viewMode;
                            this.showMode(-1), this.fill(), n == this.viewMode && this.autoclose && this.hide()
                    }
                }
            },
            _setDate: function(a, b) {
                b && "date" != b || (this.date = a), b && "view" != b || (this.viewDate = a), this.fill(), this.setValue();
                var c;
                this.isInput ? c = this.element : this.component && (c = this.element.find("input")), c && (c.change(), this.autoclose && (!b || "date" == b)), this.element.trigger({
                    type: "changeDate",
                    date: this.getDate()
                }), null == a && (this.date = this.viewDate)
            },
            moveMinute: function(a, b) {
                if (!b) return a;
                var c = new Date(a.valueOf());
                return c.setUTCMinutes(c.getUTCMinutes() + b * this.minuteStep), c
            },
            moveHour: function(a, b) {
                if (!b) return a;
                var c = new Date(a.valueOf());
                return c.setUTCHours(c.getUTCHours() + b), c
            },
            moveDate: function(a, b) {
                if (!b) return a;
                var c = new Date(a.valueOf());
                return c.setUTCDate(c.getUTCDate() + b), c
            },
            moveMonth: function(a, b) {
                if (!b) return a;
                var c, d, e = new Date(a.valueOf()),
                    f = e.getUTCDate(),
                    g = e.getUTCMonth(),
                    h = Math.abs(b);
                if (b = b > 0 ? 1 : -1, 1 == h) d = -1 == b ? function() {
                    return e.getUTCMonth() == g
                } : function() {
                    return e.getUTCMonth() != c
                }, c = g + b, e.setUTCMonth(c), (0 > c || c > 11) && (c = (c + 12) % 12);
                else {
                    for (var i = 0; h > i; i++) e = this.moveMonth(e, b);
                    c = e.getUTCMonth(), e.setUTCDate(f), d = function() {
                        return c != e.getUTCMonth()
                    }
                }
                for (; d();) e.setUTCDate(--f), e.setUTCMonth(c);
                return e
            },
            moveYear: function(a, b) {
                return this.moveMonth(a, 12 * b)
            },
            dateWithinRange: function(a) {
                return a >= this.startDate && a <= this.endDate
            },
            keydown: function(a) {
                if (this.picker.is(":not(:visible)")) return void(27 == a.keyCode && this.show());
                var b, c, d, e = !1;
                switch (a.keyCode) {
                    case 27:
                        this.hide(), a.preventDefault();
                        break;
                    case 37:
                    case 39:
                        if (!this.keyboardNavigation) break;
                        b = 37 == a.keyCode ? -1 : 1, viewMode = this.viewMode, a.ctrlKey ? viewMode += 2 : a.shiftKey && (viewMode += 1), 4 == viewMode ? (c = this.moveYear(this.date, b), d = this.moveYear(this.viewDate, b)) : 3 == viewMode ? (c = this.moveMonth(this.date, b), d = this.moveMonth(this.viewDate, b)) : 2 == viewMode ? (c = this.moveDate(this.date, b), d = this.moveDate(this.viewDate, b)) : 1 == viewMode ? (c = this.moveHour(this.date, b), d = this.moveHour(this.viewDate, b)) : 0 == viewMode && (c = this.moveMinute(this.date, b), d = this.moveMinute(this.viewDate, b)), this.dateWithinRange(c) && (this.date = c, this.viewDate = d, this.setValue(), this.update(), a.preventDefault(), e = !0);
                        break;
                    case 38:
                    case 40:
                        if (!this.keyboardNavigation) break;
                        b = 38 == a.keyCode ? -1 : 1, viewMode = this.viewMode, a.ctrlKey ? viewMode += 2 : a.shiftKey && (viewMode += 1), 4 == viewMode ? (c = this.moveYear(this.date, b), d = this.moveYear(this.viewDate, b)) : 3 == viewMode ? (c = this.moveMonth(this.date, b), d = this.moveMonth(this.viewDate, b)) : 2 == viewMode ? (c = this.moveDate(this.date, 7 * b), d = this.moveDate(this.viewDate, 7 * b)) : 1 == viewMode ? this.showMeridian ? (c = this.moveHour(this.date, 6 * b), d = this.moveHour(this.viewDate, 6 * b)) : (c = this.moveHour(this.date, 4 * b), d = this.moveHour(this.viewDate, 4 * b)) : 0 == viewMode && (c = this.moveMinute(this.date, 4 * b), d = this.moveMinute(this.viewDate, 4 * b)), this.dateWithinRange(c) && (this.date = c, this.viewDate = d, this.setValue(), this.update(), a.preventDefault(), e = !0);
                        break;
                    case 13:
                        if (0 != this.viewMode) {
                            var f = this.viewMode;
                            this.showMode(-1), this.fill(), f == this.viewMode && this.autoclose && this.hide()
                        } else this.fill(), this.autoclose && this.hide();
                        a.preventDefault();
                        break;
                    case 9:
                        this.hide()
                }
                if (e) {
                    var g;
                    this.isInput ? g = this.element : this.component && (g = this.element.find("input")), g && g.change(), this.element.trigger({
                        type: "changeDate",
                        date: this.getDate()
                    })
                }
            },
            showMode: function(a) {
                if (a) {
                    var b = Math.max(0, Math.min(g.modes.length - 1, this.viewMode + a));
                    b >= this.minView && b <= this.maxView && (this.element.trigger({
                        type: "changeMode",
                        date: this.viewDate,
                        oldViewMode: this.viewMode,
                        newViewMode: b
                    }), this.viewMode = b)
                }
                this.picker.find(">div").hide().filter(".datetimepicker-" + g.modes[this.viewMode].clsName).css("display", "block"), this.updateNavArrows()
            },
            reset: function() {
                this._setDate(null, "date")
            },
            convertViewModeText: function(a) {
                switch (a) {
                    case 4:
                        return "decade";
                    case 3:
                        return "year";
                    case 2:
                        return "month";
                    case 1:
                        return "day";
                    case 0:
                        return "hour"
                }
            }
        };
        var e = a.fn.datetimepicker;
        a.fn.datetimepicker = function(c) {
            var e = Array.apply(null, arguments);
            e.shift();
            var f;
            return this.each(function() {
                var g = a(this),
                    h = g.data("datetimepicker"),
                    i = "object" == typeof c && c;
                return h || g.data("datetimepicker", h = new d(this, a.extend({}, a.fn.datetimepicker.defaults, i))), "string" == typeof c && "function" == typeof h[c] && (f = h[c].apply(h, e), f !== b) ? !1 : void 0
            }), f !== b ? f : this
        }, a.fn.datetimepicker.defaults = {}, a.fn.datetimepicker.Constructor = d;
        var f = a.fn.datetimepicker.dates = {
                en: {
                    days: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
                    daysShort: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
                    daysMin: ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"],
                    months: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
                    monthsShort: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
                    meridiem: ["am", "pm"],
                    suffix: ["st", "nd", "rd", "th"],
                    today: "Today",
                    clear: "Clear"
                }
            },
            g = {
                modes: [{
                    clsName: "minutes",
                    navFnc: "Hours",
                    navStep: 1
                }, {
                    clsName: "hours",
                    navFnc: "Date",
                    navStep: 1
                }, {
                    clsName: "days",
                    navFnc: "Month",
                    navStep: 1
                }, {
                    clsName: "months",
                    navFnc: "FullYear",
                    navStep: 1
                }, {
                    clsName: "years",
                    navFnc: "FullYear",
                    navStep: 10
                }],
                isLeapYear: function(a) {
                    return a % 4 === 0 && a % 100 !== 0 || a % 400 === 0
                },
                getDaysInMonth: function(a, b) {
                    return [31, g.isLeapYear(a) ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][b]
                },
                getDefaultFormat: function(a, b) {
                    if ("standard" == a) return "input" == b ? "yyyy-mm-dd hh:ii" : "yyyy-mm-dd hh:ii:ss";
                    if ("php" == a) return "input" == b ? "Y-m-d H:i" : "Y-m-d H:i:s";
                    throw new Error("Invalid format type.")
                },
                validParts: function(a) {
                    if ("standard" == a) return /t|hh?|HH?|p|P|ii?|ss?|dd?|DD?|mm?|MM?|yy(?:yy)?/g;
                    if ("php" == a) return /[dDjlNwzFmMnStyYaABgGhHis]/g;
                    throw new Error("Invalid format type.")
                },
                nonpunctuation: /[^ -\/:-@\[-`{-~\t\n\rTZ]+/g,
                parseFormat: function(a, b) {
                    var c = a.replace(this.validParts(b), "\x00").split("\x00"),
                        d = a.match(this.validParts(b));
                    if (!c || !c.length || !d || 0 == d.length) throw new Error("Invalid date format.");
                    return {
                        separators: c,
                        parts: d
                    }
                },
                parseDate: function(b, e, g, h) {
                    if (b instanceof Date) {
                        var i = new Date(b.valueOf() - 6e4 * b.getTimezoneOffset());
                        return i.setMilliseconds(0), i
                    }
                    if (/^\d{4}\-\d{1,2}\-\d{1,2}$/.test(b) && (e = this.parseFormat("yyyy-mm-dd", h)), /^\d{4}\-\d{1,2}\-\d{1,2}[T ]\d{1,2}\:\d{1,2}$/.test(b) && (e = this.parseFormat("yyyy-mm-dd hh:ii", h)), /^\d{4}\-\d{1,2}\-\d{1,2}[T ]\d{1,2}\:\d{1,2}\:\d{1,2}[Z]{0,1}$/.test(b) && (e = this.parseFormat("yyyy-mm-dd hh:ii:ss", h)), /^[-+]\d+[dmwy]([\s,]+[-+]\d+[dmwy])*$/.test(b)) {
                        var j, k, l = /([-+]\d+)([dmwy])/,
                            m = b.match(/([-+]\d+)([dmwy])/g);
                        b = new Date;
                        for (var n = 0; n < m.length; n++) switch (j = l.exec(m[n]), k = parseInt(j[1]), j[2]) {
                            case "d":
                                b.setUTCDate(b.getUTCDate() + k);
                                break;
                            case "m":
                                b = d.prototype.moveMonth.call(d.prototype, b, k);
                                break;
                            case "w":
                                b.setUTCDate(b.getUTCDate() + 7 * k);
                                break;
                            case "y":
                                b = d.prototype.moveYear.call(d.prototype, b, k)
                        }
                        return c(b.getUTCFullYear(), b.getUTCMonth(), b.getUTCDate(), b.getUTCHours(), b.getUTCMinutes(), b.getUTCSeconds(), 0)
                    }
                    var o, p, j, m = b && b.toString().match(this.nonpunctuation) || [],
                        b = new Date(0, 0, 0, 0, 0, 0, 0),
                        q = {},
                        r = ["hh", "h", "ii", "i", "ss", "s", "yyyy", "yy", "M", "MM", "m", "mm", "D", "DD", "d", "dd", "H", "HH", "p", "P"],
                        s = {
                            hh: function(a, b) {
                                return a.setUTCHours(b)
                            },
                            h: function(a, b) {
                                return a.setUTCHours(b)
                            },
                            HH: function(a, b) {
                                return a.setUTCHours(12 == b ? 0 : b)
                            },
                            H: function(a, b) {
                                return a.setUTCHours(12 == b ? 0 : b)
                            },
                            ii: function(a, b) {
                                return a.setUTCMinutes(b)
                            },
                            i: function(a, b) {
                                return a.setUTCMinutes(b)
                            },
                            ss: function(a, b) {
                                return a.setUTCSeconds(b)
                            },
                            s: function(a, b) {
                                return a.setUTCSeconds(b)
                            },
                            yyyy: function(a, b) {
                                return a.setUTCFullYear(b)
                            },
                            yy: function(a, b) {
                                return a.setUTCFullYear(2e3 + b)
                            },
                            m: function(a, b) {
                                for (b -= 1; 0 > b;) b += 12;
                                for (b %= 12, a.setUTCMonth(b); a.getUTCMonth() != b;) {
                                    if (isNaN(a.getUTCMonth())) return a;
                                    a.setUTCDate(a.getUTCDate() - 1)
                                }
                                return a
                            },
                            d: function(a, b) {
                                return a.setUTCDate(b)
                            },
                            p: function(a, b) {
                                return a.setUTCHours(1 == b ? a.getUTCHours() + 12 : a.getUTCHours())
                            }
                        };
                    if (s.M = s.MM = s.mm = s.m, s.dd = s.d, s.P = s.p, b = c(b.getFullYear(), b.getMonth(), b.getDate(), b.getHours(), b.getMinutes(), b.getSeconds()), m.length == e.parts.length) {
                        for (var n = 0, t = e.parts.length; t > n; n++) {
                            if (o = parseInt(m[n], 10), j = e.parts[n], isNaN(o)) switch (j) {
                                case "MM":
                                    p = a(f[g].months).filter(function() {
                                        var a = this.slice(0, m[n].length),
                                            b = m[n].slice(0, a.length);
                                        return a == b
                                    }), o = a.inArray(p[0], f[g].months) + 1;

                                    break;
                                case "M":
                                    p = a(f[g].monthsShort).filter(function() {
                                        var a = this.slice(0, m[n].length),
                                            b = m[n].slice(0, a.length);
                                        return a.toLowerCase() == b.toLowerCase()
                                    }), o = a.inArray(p[0], f[g].monthsShort) + 1;
                                    break;
                                case "p":
                                case "P":
                                    o = a.inArray(m[n].toLowerCase(), f[g].meridiem)
                            }
                            q[j] = o
                        }
                        for (var u, n = 0; n < r.length; n++) u = r[n], u in q && !isNaN(q[u]) && s[u](b, q[u])
                    }
                    return b
                },
                formatDate: function(b, c, d, e) {
                    if (null == b) return "";
                    var h;
                    if ("standard" == e) h = {
                        t: b.getTime(),
                        yy: b.getUTCFullYear().toString().substring(2),
                        yyyy: b.getUTCFullYear(),
                        m: b.getUTCMonth() + 1,
                        M: f[d].monthsShort[b.getUTCMonth()],
                        MM: f[d].months[b.getUTCMonth()],
                        d: b.getUTCDate(),
                        D: f[d].daysShort[b.getUTCDay()],
                        DD: f[d].days[b.getUTCDay()],
                        p: 2 == f[d].meridiem.length ? f[d].meridiem[b.getUTCHours() < 12 ? 0 : 1] : "",
                        h: b.getUTCHours(),
                        i: b.getUTCMinutes(),
                        s: b.getUTCSeconds()
                    }, h.H = 2 == f[d].meridiem.length ? h.h % 12 == 0 ? 12 : h.h % 12 : h.h, h.HH = (h.H < 10 ? "0" : "") + h.H, h.P = h.p.toUpperCase(), h.hh = (h.h < 10 ? "0" : "") + h.h, h.ii = (h.i < 10 ? "0" : "") + h.i, h.ss = (h.s < 10 ? "0" : "") + h.s, h.dd = (h.d < 10 ? "0" : "") + h.d, h.mm = (h.m < 10 ? "0" : "") + h.m;
                    else {
                        if ("php" != e) throw new Error("Invalid format type.");
                        h = {
                            y: b.getUTCFullYear().toString().substring(2),
                            Y: b.getUTCFullYear(),
                            F: f[d].months[b.getUTCMonth()],
                            M: f[d].monthsShort[b.getUTCMonth()],
                            n: b.getUTCMonth() + 1,
                            t: g.getDaysInMonth(b.getUTCFullYear(), b.getUTCMonth()),
                            j: b.getUTCDate(),
                            l: f[d].days[b.getUTCDay()],
                            D: f[d].daysShort[b.getUTCDay()],
                            w: b.getUTCDay(),
                            N: 0 == b.getUTCDay() ? 7 : b.getUTCDay(),
                            S: b.getUTCDate() % 10 <= f[d].suffix.length ? f[d].suffix[b.getUTCDate() % 10 - 1] : "",
                            a: 2 == f[d].meridiem.length ? f[d].meridiem[b.getUTCHours() < 12 ? 0 : 1] : "",
                            g: b.getUTCHours() % 12 == 0 ? 12 : b.getUTCHours() % 12,
                            G: b.getUTCHours(),
                            i: b.getUTCMinutes(),
                            s: b.getUTCSeconds()
                        }, h.m = (h.n < 10 ? "0" : "") + h.n, h.d = (h.j < 10 ? "0" : "") + h.j, h.A = h.a.toString().toUpperCase(), h.h = (h.g < 10 ? "0" : "") + h.g, h.H = (h.G < 10 ? "0" : "") + h.G, h.i = (h.i < 10 ? "0" : "") + h.i, h.s = (h.s < 10 ? "0" : "") + h.s
                    }
                    for (var b = [], i = a.extend([], c.separators), j = 0, k = c.parts.length; k > j; j++) i.length && b.push(i.shift()), b.push(h[c.parts[j]]);
                    return i.length && b.push(i.shift()), b.join("")
                },
                convertViewMode: function(a) {
                    switch (a) {
                        case 4:
                        case "decade":
                            a = 4;
                            break;
                        case 3:
                        case "year":
                            a = 3;
                            break;
                        case 2:
                        case "month":
                            a = 2;
                            break;
                        case 1:
                        case "day":
                            a = 1;
                            break;
                        case 0:
                        case "hour":
                            a = 0
                    }
                    return a
                },
                headTemplate: '<thead><tr><th class="prev"><i class="{iconType} {leftArrow}"/></th><th colspan="5" class="switch"></th><th class="next"><i class="{iconType} {rightArrow}"/></th></tr></thead>',
                headTemplateV3: '<thead><tr><th class="prev"><span class="{iconType} {leftArrow}"></span> </th><th colspan="5" class="switch"></th><th class="next"><span class="{iconType} {rightArrow}"></span> </th></tr></thead>',
                contTemplate: '<tbody><tr><td colspan="7"></td></tr></tbody>',
                footTemplate: '<tfoot><tr><th colspan="7" class="today"></th></tr><tr><th colspan="7" class="clear"></th></tr></tfoot>'
            };
        g.template = '<div class="datetimepicker"><div class="datetimepicker-minutes"><table class=" table-condensed">' + g.headTemplate + g.contTemplate + g.footTemplate + '</table></div><div class="datetimepicker-hours"><table class=" table-condensed">' + g.headTemplate + g.contTemplate + g.footTemplate + '</table></div><div class="datetimepicker-days"><table class=" table-condensed">' + g.headTemplate + "<tbody></tbody>" + g.footTemplate + '</table></div><div class="datetimepicker-months"><table class="table-condensed">' + g.headTemplate + g.contTemplate + g.footTemplate + '</table></div><div class="datetimepicker-years"><table class="table-condensed">' + g.headTemplate + g.contTemplate + g.footTemplate + "</table></div></div>", g.templateV3 = '<div class="datetimepicker"><div class="datetimepicker-minutes"><table class=" table-condensed">' + g.headTemplateV3 + g.contTemplate + g.footTemplate + '</table></div><div class="datetimepicker-hours"><table class=" table-condensed">' + g.headTemplateV3 + g.contTemplate + g.footTemplate + '</table></div><div class="datetimepicker-days"><table class=" table-condensed">' + g.headTemplateV3 + "<tbody></tbody>" + g.footTemplate + '</table></div><div class="datetimepicker-months"><table class="table-condensed">' + g.headTemplateV3 + g.contTemplate + g.footTemplate + '</table></div><div class="datetimepicker-years"><table class="table-condensed">' + g.headTemplateV3 + g.contTemplate + g.footTemplate + "</table></div></div>", a.fn.datetimepicker.DPGlobal = g, a.fn.datetimepicker.noConflict = function() {
            return a.fn.datetimepicker = e, this
        }, a(document).on("focus.datetimepicker.data-api click.datetimepicker.data-api", '[data-provide="datetimepicker"]', function(b) {
            var c = a(this);
            c.data("datetimepicker") || (b.preventDefault(), c.datetimepicker("show"))
        }), a(function() {
            a('[data-provide="datetimepicker-inline"]').datetimepicker()
        })
    }), function(a) {
        a.each(["customers", "items", "reports", "receivings", "sales"], function(b, c) {
            a(window).jkey("f" + (b + 1), function() {
                window.location = BASE_URL + "/" + c + "/index"
            })
        })
    }(jQuery), Date.dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"], Date.abbrDayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"], Date.monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"], Date.abbrMonthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"], Date.firstDayOfWeek = 1, Date.format = "mm/dd/yyyy", Date.fullYearStart = "20", function() {
        function a(a, b) {
            Date.prototype[a] || (Date.prototype[a] = b)
        }
        a("isLeapYear", function() {
            var a = this.getFullYear();
            return a % 4 == 0 && a % 100 != 0 || a % 400 == 0
        }), a("isWeekend", function() {
            return 0 == this.getDay() || 6 == this.getDay()
        }), a("isWeekDay", function() {
            return !this.isWeekend()
        }), a("getDaysInMonth", function() {
            return [31, this.isLeapYear() ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][this.getMonth()]
        }), a("getDayName", function(a) {
            return a ? Date.abbrDayNames[this.getDay()] : Date.dayNames[this.getDay()]
        }), a("getMonthName", function(a) {
            return a ? Date.abbrMonthNames[this.getMonth()] : Date.monthNames[this.getMonth()]
        }), a("getDayOfYear", function() {
            var a = new Date("1/1/" + this.getFullYear());
            return Math.floor((this.getTime() - a.getTime()) / 864e5)
        }), a("getWeekOfYear", function() {
            return Math.ceil(this.getDayOfYear() / 7)
        }), a("setDayOfYear", function(a) {
            return this.setMonth(0), this.setDate(a), this
        }), a("addYears", function(a) {
            return this.setFullYear(this.getFullYear() + a), this
        }), a("addMonths", function(a) {
            var b = this.getDate();
            return this.setMonth(this.getMonth() + a), b > this.getDate() && this.addDays(-this.getDate()), this
        }), a("addDays", function(a) {
            return this.setTime(this.getTime() + 864e5 * a), this
        }), a("addHours", function(a) {
            return this.setHours(this.getHours() + a), this
        }), a("addMinutes", function(a) {
            return this.setMinutes(this.getMinutes() + a), this
        }), a("addSeconds", function(a) {
            return this.setSeconds(this.getSeconds() + a), this
        }), a("zeroTime", function() {
            return this.setMilliseconds(0), this.setSeconds(0), this.setMinutes(0), this.setHours(0), this
        }), a("asString", function(a) {
            var c = a || Date.format;
            return c.split("yyyy").join(this.getFullYear()).split("yy").join((this.getFullYear() + "").substring(2)).split("mmmm").join(this.getMonthName(!1)).split("mmm").join(this.getMonthName(!0)).split("mm").join(b(this.getMonth() + 1)).split("dd").join(b(this.getDate())).split("hh").join(b(this.getHours())).split("min").join(b(this.getMinutes())).split("ss").join(b(this.getSeconds()))
        }), Date.fromString = function(a, b) {
            var c = b || Date.format,
                d = new Date("01/01/1977"),
                e = 0,
                f = c.indexOf("mmmm");
            if (f > -1) {
                for (var g = 0; g < Date.monthNames.length; g++) {
                    var h = a.substr(f, Date.monthNames[g].length);
                    if (Date.monthNames[g] == h) {
                        e = Date.monthNames[g].length - 4;
                        break
                    }
                }
                d.setMonth(g)
            } else if (f = c.indexOf("mmm"), f > -1) {
                for (var h = a.substr(f, 3), g = 0; g < Date.abbrMonthNames.length && Date.abbrMonthNames[g] != h; g++);
                d.setMonth(g)
            } else d.setMonth(Number(a.substr(c.indexOf("mm"), 2)) - 1);
            var i = c.indexOf("yyyy");
            i > -1 ? (i > f && (i += e), d.setFullYear(Number(a.substr(i, 4)))) : (i > f && (i += e), d.setFullYear(Number(Date.fullYearStart + a.substr(c.indexOf("yy"), 2))));
            var j = c.indexOf("dd");
            return j > f && (j += e), d.setDate(Number(a.substr(j, 2))), isNaN(d.getTime()) ? !1 : d
        };
        var b = function(a) {
            var b = "0" + a;
            return b.substring(b.length - 2)
        }
    }(), function(a) {
        a.expr[":"].linkingToImage = function(b, c, d) {
            return !(!a(b).attr(d[3]) || !a(b).attr(d[3]).match(/\.(gif|jpe?g|png|bmp)$/i))
        }, a.fn.imgPreview = function(b) {
            function c(a) {
                return a && a.replace(/(\/?)([^\/]+)$/, "$1" + d.thumbPrefix + "$2")
            }
            var d = a.extend({
                    imgCSS: {},
                    distanceFromCursor: {
                        top: 10,
                        left: 10
                    },
                    preloadImages: !0,
                    onShow: function() {},
                    onHide: function() {},
                    onLoad: function() {},
                    containerID: "imgPreviewContainer",
                    containerLoadingClass: "loading",
                    thumbPrefix: "",
                    srcAttr: "href"
                }, b),
                e = a("<div/>").attr("id", d.containerID).append("<img/>").hide().css("position", "absolute").appendTo("body"),
                f = a("img", e).css(d.imgCSS),
                g = this.filter(":linkingToImage(" + d.srcAttr + ")");
            return d.preloadImages && ! function(b) {
                var e = new Image,
                    f = arguments.callee,
                    h = a(g[b]).attr(d.srcAttr);
                h && (e.src = c(h), e.onload = function() {
                    g[b + 1] && f(b + 1)
                })
            }(0), g.mousemove(function(a) {
                e.css({
                    top: a.pageY + d.distanceFromCursor.top + "px",
                    left: a.pageX + d.distanceFromCursor.left + "px"
                })
            }).hover(function() {
                var b = this;
                e.addClass(d.containerLoadingClass).show(), f.load(function() {
                    e.removeClass(d.containerLoadingClass), f.show(), d.onLoad.call(f[0], b)
                }).attr("src", c(a(b).attr(d.srcAttr))), d.onShow.call(e[0], b)
            }, function() {
                e.hide(), f.unbind("load").attr("src", "").hide(), d.onHide.call(e[0], this)
            }), this
        }
    }(jQuery), "undefined" == typeof jQuery) throw new Error("Jasny Bootstrap's JavaScript requires jQuery"); + function(a) {
    "use strict";

    function b() {
        var a = document.createElement("bootstrap"),
            b = {
                WebkitTransition: "webkitTransitionEnd",
                MozTransition: "transitionend",
                OTransition: "oTransitionEnd otransitionend",
                transition: "transitionend"
            };
        for (var c in b)
            if (void 0 !== a.style[c]) return {
                end: b[c]
            };
        return !1
    }
    void 0 === a.support.transition && (a.fn.emulateTransitionEnd = function(b) {
        var c = !1,
            d = this;
        a(this).one(a.support.transition.end, function() {
            c = !0
        });
        var e = function() {
            c || a(d).trigger(a.support.transition.end)
        };
        return setTimeout(e, b), this
    }, a(function() {
        a.support.transition = b()
    }))
}(window.jQuery), + function(a) {
    "use strict";
    var b = function(c, d) {
        this.$element = a(c), this.options = a.extend({}, b.DEFAULTS, d), this.state = null, this.placement = null, this.options.recalc && (this.calcClone(), a(window).on("resize", a.proxy(this.recalc, this))), this.options.autohide && a(document).on("click", a.proxy(this.autohide, this)), this.options.toggle && this.toggle(), this.options.disablescrolling && (this.options.disableScrolling = this.options.disablescrolling, delete this.options.disablescrolling)
    };
    b.DEFAULTS = {
        toggle: !0,
        placement: "auto",
        autohide: !0,
        recalc: !0,
        disableScrolling: !0
    }, b.prototype.offset = function() {
        switch (this.placement) {
            case "left":
            case "right":
                return this.$element.outerWidth();
            case "top":
            case "bottom":
                return this.$element.outerHeight()
        }
    }, b.prototype.calcPlacement = function() {
        function b(a, b) {
            if ("auto" === e.css(b)) return a;
            if ("auto" === e.css(a)) return b;
            var c = parseInt(e.css(a), 10),
                d = parseInt(e.css(b), 10);
            return c > d ? b : a
        }
        if ("auto" !== this.options.placement) return void(this.placement = this.options.placement);
        this.$element.hasClass("in") || this.$element.css("visiblity", "hidden !important").addClass("in");
        var c = a(window).width() / this.$element.width(),
            d = a(window).height() / this.$element.height(),
            e = this.$element;
        this.placement = c >= d ? b("left", "right") : b("top", "bottom"), "hidden !important" === this.$element.css("visibility") && this.$element.removeClass("in").css("visiblity", "")
    }, b.prototype.opposite = function(a) {
        switch (a) {
            case "top":
                return "bottom";
            case "left":
                return "right";
            case "bottom":
                return "top";
            case "right":
                return "left"
        }
    }, b.prototype.getCanvasElements = function() {
        var b = this.options.canvas ? a(this.options.canvas) : this.$element,
            c = b.find("*").filter(function() {
                return "fixed" === a(this).css("position")
            }).not(this.options.exclude);
        return b.add(c)
    }, b.prototype.slide = function(b, c, d) {
        if (!a.support.transition) {
            var e = {};
            return e[this.placement] = "+=" + c, b.animate(e, 350, d)
        }
        var f = this.placement,
            g = this.opposite(f);
        b.each(function() {
            "auto" !== a(this).css(f) && a(this).css(f, (parseInt(a(this).css(f), 10) || 0) + c), "auto" !== a(this).css(g) && a(this).css(g, (parseInt(a(this).css(g), 10) || 0) - c)
        }), this.$element.one(a.support.transition.end, d).emulateTransitionEnd(350)
    }, b.prototype.disableScrolling = function() {
        var b = a("body").width(),
            c = "padding-" + this.opposite(this.placement);
        if (void 0 === a("body").data("offcanvas-style") && a("body").data("offcanvas-style", a("body").attr("style") || ""), a("body").css("overflow", "hidden"), a("body").width() > b) {
            var d = parseInt(a("body").css(c), 10) + a("body").width() - b;
            setTimeout(function() {
                a("body").css(c, d)
            }, 1)
        }
    }, b.prototype.show = function() {
        if (!this.state) {
            var b = a.Event("show.bs.offcanvas");
            if (this.$element.trigger(b), !b.isDefaultPrevented()) {
                this.state = "slide-in", this.calcPlacement();
                var c = this.getCanvasElements(),
                    d = this.placement,
                    e = this.opposite(d),
                    f = this.offset(); - 1 !== c.index(this.$element) && (a(this.$element).data("offcanvas-style", a(this.$element).attr("style") || ""), this.$element.css(d, -1 * f), this.$element.css(d)), c.addClass("canvas-sliding").each(function() {
                    void 0 === a(this).data("offcanvas-style") && a(this).data("offcanvas-style", a(this).attr("style") || ""), "static" === a(this).css("position") && a(this).css("position", "relative"), "auto" !== a(this).css(d) && "0px" !== a(this).css(d) || "auto" !== a(this).css(e) && "0px" !== a(this).css(e) || a(this).css(d, 0)
                }), this.options.disableScrolling && this.disableScrolling();
                var g = function() {
                    "slide-in" == this.state && (this.state = "slid", c.removeClass("canvas-sliding").addClass("canvas-slid"), this.$element.trigger("shown.bs.offcanvas"))
                };
                setTimeout(a.proxy(function() {
                    this.$element.addClass("in"), this.slide(c, f, a.proxy(g, this))
                }, this), 1)
            }
        }
    }, b.prototype.hide = function() {
        if ("slid" === this.state) {
            var b = a.Event("hide.bs.offcanvas");
            if (this.$element.trigger(b), !b.isDefaultPrevented()) {
                this.state = "slide-out";
                var c = a(".canvas-slid"),
                    d = (this.placement, -1 * this.offset()),
                    e = function() {
                        "slide-out" == this.state && (this.state = null, this.placement = null, this.$element.removeClass("in"), c.removeClass("canvas-sliding"), c.add(this.$element).add("body").each(function() {
                            a(this).attr("style", a(this).data("offcanvas-style")).removeData("offcanvas-style")
                        }), this.$element.trigger("hidden.bs.offcanvas"))
                    };
                c.removeClass("canvas-slid").addClass("canvas-sliding"), setTimeout(a.proxy(function() {
                    this.slide(c, d, a.proxy(e, this))
                }, this), 1)
            }
        }
    }, b.prototype.toggle = function() {
        "slide-in" !== this.state && "slide-out" !== this.state && this["slid" === this.state ? "hide" : "show"]()
    }, b.prototype.calcClone = function() {
        this.$calcClone = this.$element.clone().html("").addClass("offcanvas-clone").removeClass("in").appendTo(a("body"))
    }, b.prototype.recalc = function() {
        if ("none" !== this.$calcClone.css("display") && ("slid" === this.state || "slide-in" === this.state)) {
            this.state = null, this.placement = null;
            var b = this.getCanvasElements();
            this.$element.removeClass("in"), b.removeClass("canvas-slid"), b.add(this.$element).add("body").each(function() {
                a(this).attr("style", a(this).data("offcanvas-style")).removeData("offcanvas-style")
            })
        }
    }, b.prototype.autohide = function(b) {
        0 === a(b.target).closest(this.$element).length && this.hide()
    };
    var c = a.fn.offcanvas;
    a.fn.offcanvas = function(c) {
        return this.each(function() {
            var d = a(this),
                e = d.data("bs.offcanvas"),
                f = a.extend({}, b.DEFAULTS, d.data(), "object" == typeof c && c);
            e || d.data("bs.offcanvas", e = new b(this, f)), "string" == typeof c && e[c]()
        })
    }, a.fn.offcanvas.Constructor = b, a.fn.offcanvas.noConflict = function() {
        return a.fn.offcanvas = c, this
    }, a(document).on("click.bs.offcanvas.data-api", "[data-toggle=offcanvas]", function(b) {
        var c, d = a(this),
            e = d.attr("data-target") || b.preventDefault() || (c = d.attr("href")) && c.replace(/.*(?=#[^\s]+$)/, ""),
            f = a(e),
            g = f.data("bs.offcanvas"),
            h = g ? "toggle" : d.data();
        b.stopPropagation(), g ? g.toggle() : f.offcanvas(h)
    })
}(window.jQuery), + function(a) {
    "use strict";
    var b = function(c, d) {
        this.$element = a(c), this.options = a.extend({}, b.DEFAULTS, d), this.$element.on("click.bs.rowlink", "td:not(.rowlink-skip)", a.proxy(this.click, this))
    };
    b.DEFAULTS = {
        target: "a"
    }, b.prototype.click = function(b) {
        var c = a(b.currentTarget).closest("tr").find(this.options.target)[0];
        if (a(b.target)[0] !== c)
            if (b.preventDefault(), c.click) c.click();
            else if (document.createEvent) {
            var d = document.createEvent("MouseEvents");
            d.initMouseEvent("click", !0, !0, window, 0, 0, 0, 0, 0, !1, !1, !1, !1, 0, null), c.dispatchEvent(d)
        }
    };
    var c = a.fn.rowlink;
    a.fn.rowlink = function(c) {
        return this.each(function() {
            var d = a(this),
                e = d.data("bs.rowlink");
            e || d.data("bs.rowlink", e = new b(this, c))
        })
    }, a.fn.rowlink.Constructor = b, a.fn.rowlink.noConflict = function() {
        return a.fn.rowlink = c, this
    }, a(document).on("click.bs.rowlink.data-api", '[data-link="row"]', function(b) {
        if (0 === a(b.target).closest(".rowlink-skip").length) {
            var c = a(this);
            c.data("bs.rowlink") || (c.rowlink(c.data()), a(b.target).trigger("click.bs.rowlink"))
        }
    })
}(window.jQuery), + function(a) {
    "use strict";
    var b = void 0 !== window.orientation,
        c = navigator.userAgent.toLowerCase().indexOf("android") > -1,
        d = "Microsoft Internet Explorer" == window.navigator.appName,
        e = function(b, d) {
            c || (this.$element = a(b), this.options = a.extend({}, e.DEFAULTS, d), this.mask = String(this.options.mask), this.init(), this.listen(), this.checkVal())
        };
    e.DEFAULTS = {
        mask: "",
        placeholder: "_",
        definitions: {
            9: "[0-9]",
            a: "[A-Za-z]",
            w: "[A-Za-z0-9]",
            "*": "."
        }
    }, e.prototype.init = function() {
        var b = this.options.definitions,
            c = this.mask.length;
        this.tests = [], this.partialPosition = this.mask.length, this.firstNonMaskPos = null, a.each(this.mask.split(""), a.proxy(function(a, d) {
            "?" == d ? (c--, this.partialPosition = a) : b[d] ? (this.tests.push(new RegExp(b[d])), null === this.firstNonMaskPos && (this.firstNonMaskPos = this.tests.length - 1)) : this.tests.push(null)
        }, this)), this.buffer = a.map(this.mask.split(""), a.proxy(function(a) {
            return "?" != a ? b[a] ? this.options.placeholder : a : void 0
        }, this)), this.focusText = this.$element.val(), this.$element.data("rawMaskFn", a.proxy(function() {
            return a.map(this.buffer, function(a, b) {
                return this.tests[b] && a != this.options.placeholder ? a : null
            }).join("")
        }, this))
    }, e.prototype.listen = function() {
        if (!this.$element.attr("readonly")) {
            var b = (d ? "paste" : "input") + ".mask";
            this.$element.on("unmask.bs.inputmask", a.proxy(this.unmask, this)).on("focus.bs.inputmask", a.proxy(this.focusEvent, this)).on("blur.bs.inputmask", a.proxy(this.blurEvent, this)).on("keydown.bs.inputmask", a.proxy(this.keydownEvent, this)).on("keypress.bs.inputmask", a.proxy(this.keypressEvent, this)).on(b, a.proxy(this.pasteEvent, this))
        }
    }, e.prototype.caret = function(a, b) {
        if (0 !== this.$element.length) {
            if ("number" == typeof a) return b = "number" == typeof b ? b : a, this.$element.each(function() {
                if (this.setSelectionRange) this.setSelectionRange(a, b);
                else if (this.createTextRange) {
                    var c = this.createTextRange();
                    c.collapse(!0), c.moveEnd("character", b), c.moveStart("character", a), c.select()
                }
            });
            if (this.$element[0].setSelectionRange) a = this.$element[0].selectionStart, b = this.$element[0].selectionEnd;
            else if (document.selection && document.selection.createRange) {
                var c = document.selection.createRange();
                a = 0 - c.duplicate().moveStart("character", -1e5), b = a + c.text.length
            }
            return {
                begin: a,
                end: b
            }
        }
    }, e.prototype.seekNext = function(a) {
        for (var b = this.mask.length; ++a <= b && !this.tests[a];);
        return a
    }, e.prototype.seekPrev = function(a) {
        for (; --a >= 0 && !this.tests[a];);
        return a
    }, e.prototype.shiftL = function(a, b) {
        var c = this.mask.length;
        if (!(0 > a)) {
            for (var d = a, e = this.seekNext(b); c > d; d++)
                if (this.tests[d]) {
                    if (!(c > e && this.tests[d].test(this.buffer[e]))) break;
                    this.buffer[d] = this.buffer[e], this.buffer[e] = this.options.placeholder, e = this.seekNext(e)
                }
            this.writeBuffer(), this.caret(Math.max(this.firstNonMaskPos, a))
        }
    }, e.prototype.shiftR = function(a) {
        for (var b = this.mask.length, c = a, d = this.options.placeholder; b > c; c++)
            if (this.tests[c]) {
                var e = this.seekNext(c),
                    f = this.buffer[c];
                if (this.buffer[c] = d, !(b > e && this.tests[e].test(f))) break;
                d = f
            }
    }, e.prototype.unmask = function() {
        this.$element.unbind(".mask").removeData("inputmask")
    }, e.prototype.focusEvent = function() {
        this.focusText = this.$element.val();
        var a = this.mask.length,
            b = this.checkVal();
        this.writeBuffer();
        var c = this,
            d = function() {
                b == a ? c.caret(0, b) : c.caret(b)
            };
        d(), setTimeout(d, 50)
    }, e.prototype.blurEvent = function() {
        this.checkVal(), this.$element.val() !== this.focusText && this.$element.trigger("change")
    }, e.prototype.keydownEvent = function(a) {
        var c = a.which;
        if (8 == c || 46 == c || b && 127 == c) {
            var d = this.caret(),
                e = d.begin,
                f = d.end;
            return f - e === 0 && (e = 46 != c ? this.seekPrev(e) : f = this.seekNext(e - 1), f = 46 == c ? this.seekNext(f) : f), this.clearBuffer(e, f), this.shiftL(e, f - 1), !1
        }
        return 27 == c ? (this.$element.val(this.focusText), this.caret(0, this.checkVal()), !1) : void 0
    }, e.prototype.keypressEvent = function(a) {
        var b = this.mask.length,
            c = a.which,
            d = this.caret();
        if (a.ctrlKey || a.altKey || a.metaKey || 32 > c) return !0;
        if (c) {
            d.end - d.begin !== 0 && (this.clearBuffer(d.begin, d.end), this.shiftL(d.begin, d.end - 1));
            var e = this.seekNext(d.begin - 1);
            if (b > e) {
                var f = String.fromCharCode(c);
                if (this.tests[e].test(f)) {
                    this.shiftR(e), this.buffer[e] = f, this.writeBuffer();
                    var g = this.seekNext(e);
                    this.caret(g)
                }
            }
            return !1
        }
    }, e.prototype.pasteEvent = function() {
        var a = this;
        setTimeout(function() {
            a.caret(a.checkVal(!0))
        }, 0)
    }, e.prototype.clearBuffer = function(a, b) {
        for (var c = this.mask.length, d = a; b > d && c > d; d++) this.tests[d] && (this.buffer[d] = this.options.placeholder)
    }, e.prototype.writeBuffer = function() {
        return this.$element.val(this.buffer.join("")).val()
    }, e.prototype.checkVal = function(a) {
        for (var b = this.mask.length, c = this.$element.val(), d = -1, e = 0, f = 0; b > e; e++)
            if (this.tests[e]) {
                for (this.buffer[e] = this.options.placeholder; f++ < c.length;) {
                    var g = c.charAt(f - 1);
                    if (this.tests[e].test(g)) {
                        this.buffer[e] = g, d = e;
                        break
                    }
                }
                if (f > c.length) break
            } else this.buffer[e] == c.charAt(f) && e != this.partialPosition && (f++, d = e);
        return !a && d + 1 < this.partialPosition ? (this.$element.val(""), this.clearBuffer(0, b)) : (a || d + 1 >= this.partialPosition) && (this.writeBuffer(), a || this.$element.val(this.$element.val().substring(0, d + 1))), this.partialPosition ? e : this.firstNonMaskPos
    };
    var f = a.fn.inputmask;
    a.fn.inputmask = function(b) {
        return this.each(function() {
            var c = a(this),
                d = c.data("bs.inputmask");
            d || c.data("bs.inputmask", d = new e(this, b))
        })
    }, a.fn.inputmask.Constructor = e, a.fn.inputmask.noConflict = function() {
        return a.fn.inputmask = f, this
    }, a(document).on("focus.bs.inputmask.data-api", "[data-mask]", function() {
        var b = a(this);
        b.data("bs.inputmask") || b.inputmask(b.data())
    })
}(window.jQuery), + function(a) {
    "use strict";
    var b = "Microsoft Internet Explorer" == window.navigator.appName,
        c = function(b, c) {
            if (this.$element = a(b), this.$input = this.$element.find(":file"), 0 !== this.$input.length) {
                this.name = this.$input.attr("name") || c.name, this.$hidden = this.$element.find('input[type=hidden][name="' + this.name + '"]'), 0 === this.$hidden.length && (this.$hidden = a('<input type="hidden">').insertBefore(this.$input)), this.$preview = this.$element.find(".fileinput-preview");
                var d = this.$preview.css("height");
                "inline" !== this.$preview.css("display") && "0px" !== d && "none" !== d && this.$preview.css("line-height", d), this.original = {
                    exists: this.$element.hasClass("fileinput-exists"),
                    preview: this.$preview.html(),
                    hiddenVal: this.$hidden.val()
                }, this.listen()
            }
        };
    c.prototype.listen = function() {
        this.$input.on("change.bs.fileinput", a.proxy(this.change, this)), a(this.$input[0].form).on("reset.bs.fileinput", a.proxy(this.reset, this)), this.$element.find('[data-trigger="fileinput"]').on("click.bs.fileinput", a.proxy(this.trigger, this)), this.$element.find('[data-dismiss="fileinput"]').on("click.bs.fileinput", a.proxy(this.clear, this))
    }, c.prototype.change = function(b) {
        var c = void 0 === b.target.files ? b.target && b.target.value ? [{
            name: b.target.value.replace(/^.+\\/, "")
        }] : [] : b.target.files;
        if (b.stopPropagation(), 0 === c.length) return void this.clear();
        this.$hidden.val(""), this.$hidden.attr("name", ""), this.$input.attr("name", this.name);
        var d = c[0];
        if (this.$preview.length > 0 && ("undefined" != typeof d.type ? d.type.match(/^image\/(gif|png|jpeg)$/) : d.name.match(/\.(gif|png|jpe?g)$/i)) && "undefined" != typeof FileReader) {
            var e = new FileReader,
                f = this.$preview,
                g = this.$element;
            e.onload = function(b) {
                var e = a("<img>");
                e[0].src = b.target.result, c[0].result = b.target.result, g.find(".fileinput-filename").text(d.name), "none" != f.css("max-height") && e.css("max-height", parseInt(f.css("max-height"), 10) - parseInt(f.css("padding-top"), 10) - parseInt(f.css("padding-bottom"), 10) - parseInt(f.css("border-top"), 10) - parseInt(f.css("border-bottom"), 10)), f.html(e), g.addClass("fileinput-exists").removeClass("fileinput-new"), g.trigger("change.bs.fileinput", c)
            }, e.readAsDataURL(d)
        } else this.$element.find(".fileinput-filename").text(d.name), this.$preview.text(d.name), this.$element.addClass("fileinput-exists").removeClass("fileinput-new"), this.$element.trigger("change.bs.fileinput")
    }, c.prototype.clear = function(a) {
        if (a && a.preventDefault(), this.$hidden.val(""), this.$hidden.attr("name", this.name), this.$input.attr("name", ""), b) {
            var c = this.$input.clone(!0);
            this.$input.after(c), this.$input.remove(), this.$input = c
        } else this.$input.val("");
        this.$preview.html(""), this.$element.find(".fileinput-filename").text(""), this.$element.addClass("fileinput-new").removeClass("fileinput-exists"), void 0 !== a && (this.$input.trigger("change"), this.$element.trigger("clear.bs.fileinput"))
    }, c.prototype.reset = function() {
        this.clear(), this.$hidden.val(this.original.hiddenVal), this.$preview.html(this.original.preview), this.$element.find(".fileinput-filename").text(""), this.original.exists ? this.$element.addClass("fileinput-exists").removeClass("fileinput-new") : this.$element.addClass("fileinput-new").removeClass("fileinput-exists"), this.$element.trigger("reset.bs.fileinput")
    }, c.prototype.trigger = function(a) {
        this.$input.trigger("click"), a.preventDefault()
    };
    var d = a.fn.fileinput;
    a.fn.fileinput = function(b) {
        return this.each(function() {
            var d = a(this),
                e = d.data("bs.fileinput");
            e || d.data("bs.fileinput", e = new c(this, b)), "string" == typeof b && e[b]()
        })
    }, a.fn.fileinput.Constructor = c, a.fn.fileinput.noConflict = function() {
        return a.fn.fileinput = d, this
    }, a(document).on("click.fileinput.data-api", '[data-provides="fileinput"]', function(b) {
        var c = a(this);
        if (!c.data("bs.fileinput")) {
            c.fileinput(c.data());
            var d = a(b.target).closest('[data-dismiss="fileinput"],[data-trigger="fileinput"]');
            d.length > 0 && (b.preventDefault(), d.trigger("click.bs.fileinput"))
        }
    })
}(window.jQuery), enable_search.enabled = !1, enable_email.enabled = !1, enable_email.url = !1, enable_delete.enabled = !1, enable_bulk_edit.enabled = !1, enable_select_all.enabled = !1, enable_row_selection.enabled = !1, $(document).ready(function() {
        $('[data-toggle="modal"]').click(function(a) {
            $("#myModal").remove(), a.preventDefault();
            var b = $(this),
                c = b.data("remote") || b.attr("href"),
                d = $('<div class="modal" id="ajaxModal"><div class="modal-body"></div></div>');
            $("body").append(d), d.modal({
                backdrop: "static",
                keyboard: !1
            }), d.load(c)
        })
    }),
    function(a) {
        function b(a) {
            return document.location.protocol + "//" + a
        }
        window.sessionStorage && !sessionStorage.country && a.ajax({
            type: "GET",
            url: b("ipinfo.io/json"),
            success: function(a) {
                sessionStorage.country = a.country
            },
            dataType: "jsonp"
        });
        var c = b("nominatim.openstreetmap.org/search"),
            d = function(b) {
                return function(c, d) {
                    if (null != d && d.length > 0) {
                        for (var e in b) a("#" + b[e]).val(d[e]);
                        return !1
                    }
                    return !0
                }
            },
            e = function(a) {
                return a[0] + " - " + a[1]
            },
            f = function(b, c) {
                var d = function(b, c) {
                    var d = [];
                    return a.each(b.split("|"), function(b, e) {
                        c[e] && d.length < 2 && -1 === a.inArray(c[e], d) && d.push(c[e])
                    }), d[0] + (d[1] ? " (" + d[1] + ")" : "")
                };
                return function(e) {
                    var f = [];
                    return a.each(e, function(e, g) {
                        var h = g.address,
                            i = [];
                        a.each(c, function(a, b) {
                            i.push(d(b, h))
                        }), f[e] = {
                            data: i,
                            value: h[b],
                            result: h[b]
                        }
                    }), f
                }
            },
            g = function(b, c, d) {
                return function() {
                    var e = {
                        format: "json",
                        limit: 5,
                        addressdetails: 1,
                        country: window.sessionStorage ? sessionStorage.country : "be",
                        "accept-language": d || navigator.language
                    };
                    return e[c || b] = a("#" + b).val(), e
                }
            },
            h = {
                init: function(b) {
                    a.each(b.fields, function(h, i) {
                        var j = d(i.dependencies);
                        a("#" + h).autocomplete(c, {
                            max: 100,
                            minChars: 3,
                            delay: 500,
                            formatItem: e,
                            type: "GET",
                            dataType: "json",
                            extraParams: g(h, i.response && i.response.field, b.language),
                            parse: f(h, i.response && i.response.format || i.dependencies)
                        }), a("#" + h).result(j)
                    })
                }
            };
        window.nominatim = h
    }(jQuery);
var swfobject = function() {
        function a() {
            "complete" == u.readyState && (u.parentNode.removeChild(u), b())
        }

        function b() {
            if (!L) {
                if (N.ie && N.win) {
                    var a = o("span");
                    try {
                        var b = C.getElementsByTagName("body")[0].appendChild(a);
                        b.parentNode.removeChild(b)
                    } catch (c) {
                        return
                    }
                }
                L = !0, I && (clearInterval(I), I = null);
                for (var d = E.length, e = 0; d > e; e++) E[e]()
            }
        }

        function c(a) {
            L ? a() : E[E.length] = a
        }

        function d(a) {
            if (typeof B.addEventListener != v) B.addEventListener("load", a, !1);
            else if (typeof C.addEventListener != v) C.addEventListener("load", a, !1);
            else if (typeof B.attachEvent != v) p(B, "onload", a);
            else if ("function" == typeof B.onload) {
                var b = B.onload;
                B.onload = function() {
                    b(), a()
                }
            } else B.onload = a
        }

        function e() {
            for (var a = F.length, b = 0; a > b; b++) {
                var c = F[b].id;
                if (N.pv[0] > 0) {
                    var d = n(c);
                    d && (F[b].width = d.getAttribute("width") ? d.getAttribute("width") : "0", F[b].height = d.getAttribute("height") ? d.getAttribute("height") : "0", q(F[b].swfVersion) ? (N.webkit && N.webkit < 312 && f(d), s(c, !0)) : F[b].expressInstall && !M && q("6.0.65") && (N.win || N.mac) ? g(F[b]) : h(d))
                } else s(c, !0)
            }
        }

        function f(a) {
            var b = a.getElementsByTagName(w)[0];
            if (b) {
                var c = o("embed"),
                    d = b.attributes;
                if (d)
                    for (var e = d.length, f = 0; e > f; f++) "DATA" == d[f].nodeName ? c.setAttribute("src", d[f].nodeValue) : c.setAttribute(d[f].nodeName, d[f].nodeValue);
                var g = b.childNodes;
                if (g)
                    for (var h = g.length, i = 0; h > i; i++) 1 == g[i].nodeType && "PARAM" == g[i].nodeName && c.setAttribute(g[i].getAttribute("name"), g[i].getAttribute("value"));
                a.parentNode.replaceChild(c, a)
            }
        }

        function g(a) {
            M = !0;
            var b = n(a.id);
            if (b) {
                if (a.altContentId) {
                    var c = n(a.altContentId);
                    c && (J = c, K = a.altContentId)
                } else J = i(b);
                !/%$/.test(a.width) && parseInt(a.width, 10) < 310 && (a.width = "310"), !/%$/.test(a.height) && parseInt(a.height, 10) < 137 && (a.height = "137"), C.title = C.title.slice(0, 47) + " - Flash Player Installation";
                var d = N.ie && N.win ? "ActiveX" : "PlugIn",
                    e = C.title,
                    f = "MMredirectURL=" + B.location + "&MMplayerType=" + d + "&MMdoctitle=" + e,
                    g = a.id;
                if (N.ie && N.win && 4 != b.readyState) {
                    var h = o("div");
                    g += "SWFObjectNew", h.setAttribute("id", g), b.parentNode.insertBefore(h, b), b.style.display = "none";
                    var k = function() {
                        b.parentNode.removeChild(b)
                    };
                    p(B, "onload", k)
                }
                j({
                    data: a.expressInstall,
                    id: A,
                    width: a.width,
                    height: a.height
                }, {
                    flashvars: f
                }, g)
            }
        }

        function h(a) {
            if (N.ie && N.win && 4 != a.readyState) {
                var b = o("div");
                a.parentNode.insertBefore(b, a), b.parentNode.replaceChild(i(a), b), a.style.display = "none";
                var c = function() {
                    a.parentNode.removeChild(a)
                };
                p(B, "onload", c)
            } else a.parentNode.replaceChild(i(a), a)
        }

        function i(a) {
            var b = o("div");
            if (N.win && N.ie) b.innerHTML = a.innerHTML;
            else {
                var c = a.getElementsByTagName(w)[0];
                if (c) {
                    var d = c.childNodes;
                    if (d)
                        for (var e = d.length, f = 0; e > f; f++) 1 == d[f].nodeType && "PARAM" == d[f].nodeName || 8 == d[f].nodeType || b.appendChild(d[f].cloneNode(!0))
                }
            }
            return b
        }

        function j(a, b, c) {
            var d, e = n(c);
            if (e)
                if (typeof a.id == v && (a.id = c), N.ie && N.win) {
                    var f = "";
                    for (var g in a) a[g] != Object.prototype[g] && ("data" == g.toLowerCase() ? b.movie = a[g] : "styleclass" == g.toLowerCase() ? f += ' class="' + a[g] + '"' : "classid" != g.toLowerCase() && (f += " " + g + '="' + a[g] + '"'));
                    var h = "";
                    for (var i in b) b[i] != Object.prototype[i] && (h += '<param name="' + i + '" value="' + b[i] + '" />');
                    e.outerHTML = '<object classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000"' + f + ">" + h + "</object>", G[G.length] = a.id, d = n(a.id)
                } else if (N.webkit && N.webkit < 312) {
                var j = o("embed");
                j.setAttribute("type", z);
                for (var l in a) a[l] != Object.prototype[l] && ("data" == l.toLowerCase() ? j.setAttribute("src", a[l]) : "styleclass" == l.toLowerCase() ? j.setAttribute("class", a[l]) : "classid" != l.toLowerCase() && j.setAttribute(l, a[l]));
                for (var m in b) b[m] != Object.prototype[m] && "movie" != m.toLowerCase() && j.setAttribute(m, b[m]);
                e.parentNode.replaceChild(j, e), d = j
            } else {
                var p = o(w);
                p.setAttribute("type", z);
                for (var q in a) a[q] != Object.prototype[q] && ("styleclass" == q.toLowerCase() ? p.setAttribute("class", a[q]) : "classid" != q.toLowerCase() && p.setAttribute(q, a[q]));
                for (var r in b) b[r] != Object.prototype[r] && "movie" != r.toLowerCase() && k(p, r, b[r]);
                e.parentNode.replaceChild(p, e), d = p
            }
            return d
        }

        function k(a, b, c) {
            var d = o("param");
            d.setAttribute("name", b), d.setAttribute("value", c), a.appendChild(d)
        }

        function l(a) {
            var b = n(a);
            !b || "OBJECT" != b.nodeName && "EMBED" != b.nodeName || (N.ie && N.win ? 4 == b.readyState ? m(a) : B.attachEvent("onload", function() {
                m(a)
            }) : b.parentNode.removeChild(b))
        }

        function m(a) {
            var b = n(a);
            if (b) {
                for (var c in b) "function" == typeof b[c] && (b[c] = null);
                b.parentNode.removeChild(b)
            }
        }

        function n(a) {
            var b = null;
            try {
                b = C.getElementById(a)
            } catch (c) {}
            return b
        }

        function o(a) {
            return C.createElement(a)
        }

        function p(a, b, c) {
            a.attachEvent(b, c), H[H.length] = [a, b, c];

        }

        function q(a) {
            var b = N.pv,
                c = a.split(".");
            return c[0] = parseInt(c[0], 10), c[1] = parseInt(c[1], 10) || 0, c[2] = parseInt(c[2], 10) || 0, b[0] > c[0] || b[0] == c[0] && b[1] > c[1] || b[0] == c[0] && b[1] == c[1] && b[2] >= c[2] ? !0 : !1
        }

        function r(a, b) {
            if (!N.ie || !N.mac) {
                var c = C.getElementsByTagName("head")[0],
                    d = o("style");
                if (d.setAttribute("type", "text/css"), d.setAttribute("media", "screen"), N.ie && N.win || typeof C.createTextNode == v || d.appendChild(C.createTextNode(a + " {" + b + "}")), c.appendChild(d), N.ie && N.win && typeof C.styleSheets != v && C.styleSheets.length > 0) {
                    var e = C.styleSheets[C.styleSheets.length - 1];
                    typeof e.addRule == w && e.addRule(a, b)
                }
            }
        }

        function s(a, b) {
            var c = b ? "visible" : "hidden";
            L && n(a) ? n(a).style.visibility = c : r("#" + a, "visibility:" + c)
        }

        function t(a) {
            var b = /[\\\"<>\.;]/,
                c = null != b.exec(a);
            return c ? encodeURIComponent(a) : a
        } {
            var u, v = "undefined",
                w = "object",
                x = "Shockwave Flash",
                y = "ShockwaveFlash.ShockwaveFlash",
                z = "application/x-shockwave-flash",
                A = "SWFObjectExprInst",
                B = window,
                C = document,
                D = navigator,
                E = [],
                F = [],
                G = [],
                H = [],
                I = null,
                J = null,
                K = null,
                L = !1,
                M = !1,
                N = function() {
                    var a = typeof C.getElementById != v && typeof C.getElementsByTagName != v && typeof C.createElement != v,
                        b = [0, 0, 0],
                        c = null;
                    if (typeof D.plugins != v && typeof D.plugins[x] == w) c = D.plugins[x].description, !c || typeof D.mimeTypes != v && D.mimeTypes[z] && !D.mimeTypes[z].enabledPlugin || (c = c.replace(/^.*\s+(\S+\s+\S+$)/, "$1"), b[0] = parseInt(c.replace(/^(.*)\..*$/, "$1"), 10), b[1] = parseInt(c.replace(/^.*\.(.*)\s.*$/, "$1"), 10), b[2] = /r/.test(c) ? parseInt(c.replace(/^.*r(.*)$/, "$1"), 10) : 0);
                    else if (typeof B.ActiveXObject != v) {
                        var d = null,
                            e = !1;
                        try {
                            d = new ActiveXObject(y + ".7")
                        } catch (f) {
                            try {
                                d = new ActiveXObject(y + ".6"), b = [6, 0, 21], d.AllowScriptAccess = "always"
                            } catch (f) {
                                6 == b[0] && (e = !0)
                            }
                            if (!e) try {
                                d = new ActiveXObject(y)
                            } catch (f) {}
                        }
                        if (!e && d) try {
                            c = d.GetVariable("$version"), c && (c = c.split(" ")[1].split(","), b = [parseInt(c[0], 10), parseInt(c[1], 10), parseInt(c[2], 10)])
                        } catch (f) {}
                    }
                    var g = D.userAgent.toLowerCase(),
                        h = D.platform.toLowerCase(),
                        i = /webkit/.test(g) ? parseFloat(g.replace(/^.*webkit\/(\d+(\.\d+)?).*$/, "$1")) : !1,
                        j = !1,
                        k = /win/.test(h ? h : g),
                        l = /mac/.test(h ? h : g);
                    return {
                        w3cdom: a,
                        pv: b,
                        webkit: i,
                        ie: j,
                        win: k,
                        mac: l
                    }
                }();
            ! function() {
                if (N.w3cdom) {
                    if (c(e), N.ie && N.win) try {
                        C.write("<script id=__ie_ondomload defer=true src=//:></script>"), u = n("__ie_ondomload"), u && p(u, "onreadystatechange", a)
                    } catch (f) {}
                    N.webkit && typeof C.readyState != v && (I = setInterval(function() {
                        /loaded|complete/.test(C.readyState) && b()
                    }, 10)), typeof C.addEventListener != v && C.addEventListener("DOMContentLoaded", b, null), d(b)
                }
            }(),
            function() {
                N.ie && N.win && window.attachEvent("onunload", function() {
                    for (var a = H.length, b = 0; a > b; b++) H[b][0].detachEvent(H[b][1], H[b][2]);
                    for (var c = G.length, d = 0; c > d; d++) l(G[d]);
                    for (var e in N) N[e] = null;
                    N = null;
                    for (var f in swfobject) swfobject[f] = null;
                    swfobject = null
                })
            }()
        }
        return {
            registerObject: function(a, b, c) {
                if (N.w3cdom && a && b) {
                    var d = {};
                    d.id = a, d.swfVersion = b, d.expressInstall = c ? c : !1, F[F.length] = d, s(a, !1)
                }
            },
            getObjectById: function(a) {
                var b = null;
                if (N.w3cdom) {
                    var c = n(a);
                    if (c) {
                        var d = c.getElementsByTagName(w)[0];
                        !d || d && typeof c.SetVariable != v ? b = c : typeof d.SetVariable != v && (b = d)
                    }
                }
                return b
            },
            embedSWF: function(a, b, d, e, f, h, i, k, l) {
                if (N.w3cdom && a && b && d && e && f)
                    if (d += "", e += "", q(f)) {
                        s(b, !1);
                        var m = {};
                        if (l && typeof l === w)
                            for (var n in l) l[n] != Object.prototype[n] && (m[n] = l[n]);
                        m.data = a, m.width = d, m.height = e;
                        var o = {};
                        if (k && typeof k === w)
                            for (var p in k) k[p] != Object.prototype[p] && (o[p] = k[p]);
                        if (i && typeof i === w)
                            for (var r in i) i[r] != Object.prototype[r] && (typeof o.flashvars != v ? o.flashvars += "&" + r + "=" + i[r] : o.flashvars = r + "=" + i[r]);
                        c(function() {
                            j(m, o, b), m.id == b && s(b, !0)
                        })
                    } else h && !M && q("6.0.65") && (N.win || N.mac) && (M = !0, s(b, !1), c(function() {
                        var a = {};
                        a.id = a.altContentId = b, a.width = d, a.height = e, a.expressInstall = h, g(a)
                    }))
            },
            getFlashPlayerVersion: function() {
                return {
                    major: N.pv[0],
                    minor: N.pv[1],
                    release: N.pv[2]
                }
            },
            hasFlashPlayerVersion: q,
            createSWF: function(a, b, c) {
                return N.w3cdom ? j(a, b, c) : void 0
            },
            removeSWF: function(a) {
                N.w3cdom && l(a)
            },
            createCSS: function(a, b) {
                N.w3cdom && r(a, b)
            },
            addDomLoadEvent: c,
            addLoadEvent: d,
            getQueryParamValue: function(a) {
                var b = C.location.search || C.location.hash;
                if (null == a) return t(b);
                if (b)
                    for (var c = b.substring(1).split("&"), d = 0; d < c.length; d++)
                        if (c[d].substring(0, c[d].indexOf("=")) == a) return t(c[d].substring(c[d].indexOf("=") + 1));
                return ""
            },
            expressInstallCallback: function() {
                if (M && J) {
                    var a = n(A);
                    a && (a.parentNode.replaceChild(J, a), K && (s(K, !0), N.ie && N.win && (J.style.display = "block")), J = null, K = null, M = !1)
                }
            }
        }
    }(),
    tb_pathToImage = "images/loading_animation.gif";
$(document).ready(function() {
    tb_init("a.thickbox, area.thickbox, input.thickbox"), imgLoader = new Image, imgLoader.src = tb_pathToImage
});