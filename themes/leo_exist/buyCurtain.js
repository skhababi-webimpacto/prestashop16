function checkIfDeviceIsiOS() {
    var t = ["iPad Simulator", "iPhone Simulator", "iPod Simulator", "iPad", "iPhone", "iPod", "MacIntel"];
    if (navigator.platform)
        for (; t.length;)
            if (navigator.platform === t.pop()) return !0;
    return !1
}

function checkIfDeviceIsWindows() {
    return !!(window.navigator.userAgent.indexOf("MSIE ") > 0 || navigator.userAgent.match(/Trident.*rv\:11\./))
}

function executeTemplate(t, a, e) {
    doT.templateSettings.interpolate = /#\{=([\s\S]+?)\}#/g, doT.templateSettings.iterate = /#\{~\s*(?:\}#|([\s\S]+?)\s*\:\s*([\w$]+)\s*(?:\:\s*([\w$]+))?\s*\}#)/g, doT.templateSettings.conditional = /\#\{\?(\?)?\s*([\s\S]*?)\s*\}\#/g;
    var o = $(t).text(),
        n = doT.template(o)({
            recommended: e
        });
    $(a).append(n)
}
if ($.urlParam = function(t) {
        var a = new RegExp("[?&]" + t + "=([^&#]*)").exec(window.location.href);
        return null == a ? null : a[1] || 0
    }, checkIfDeviceIsWindows())(eventCartModified = document.createEvent("Event")).initEvent("cartModified", !1, !0);
else var eventCartModified = new CustomEvent("cartModified", {
    detail: {}
});
$(document).ready(function() {
    function t() {
        $('form[name="cheaperAdvise"]').validate({
            errorClass: "aviso-de-error",
            rules: {
                "cheaperAdvise[price]": {
                    required: !0,
                    pattern: /^(\d+)(\.\d{1,2})?$/
                },
                "cheaperAdvise[url]": {
                    required: !0,
                    url: !0
                }
            },
            messages: {
                "cheaperAdvise[price]": "El precio debe ser numÃ©rico y sÃ³lo puede contener dos decimales, separados por punto (.)"
            }
        })
    }

    function a(t) {
        $('form[name="cheaperAdvise"]').submit(function(a) {
            if (a.preventDefault(), $(this).valid()) {
                var e = $(this).serializeArray();
                $.ajax({
                    url: t,
                    data: e,
                    method: "POST",
                    dataType: "json"
                }).done(function(t) {
                    d((t = JSON.parse(t)).message)
                }), dataLayer.push({
                    event: "envio-formulario",
                    formulario: "masBaratoGTM"
                })
            }
        })
    }

    function e() {
        $.ajax({
            url: Routing.generate("pcc_pay_paypal_express_init")
        }).done(function(t) {
            t.url && window.location.replace(t.url)
        }).fail(function(t) {})
    }

    function o(t, a) {
        var e = $("#article-quantity"),
            o = $("#insurance"),
            n = "",
            i = {};
        $("body").hasClass("ficha-producto-pccom") ? (n = Routing.generate("pcc_cart_add_item_pccom_variation", {
            idArticle: e.data("id")
        }), (i = {
            units: parseInt(e.val(), 10),
            warranty: o.is(":checked") ? 1 : 0
        }).variations = [], $.each(Object.keys(window.variations), function(t, a) {
            i.variations.push(parseInt(a))
        })) : (n = Routing.generate("pcc_cart_add_item_ajax", {
            idArticle: e.data("id")
        }), i = {
            units: parseInt(e.val(), 10),
            warranty: o.is(":checked") ? 1 : 0,
            pickup: $(".js-modal-pickup:checked").length ? 1 : 0,
            installation: $(".js-modal-installation:checked").length ? 1 : 0
        }), t.data("offer") && (i.idOffer = t.data("offer")), $.post(n, i, function(t) {
            "function" == typeof a && a.call(this, e.val()), document.dispatchEvent(eventCartModified)
        }).fail(function(t) {
            window.location.href.indexOf("/rastrillo/") > -1 && 400 === t.status && 1124 === t.responseJSON.code && (d("Lo sentimos pero no es posible adquirir de nuevo este producto porque cada artÃ­culo de rastrillo es una unidad Ãºnica."), $(".modal-backdrop").css("background-color", "black"), setTimeout(function() {
                location.reload()
            }, 3e3))
        })
    }

    function n() {
        var t = $("#ficha-producto-opinones"),
            a = {
                page: t.attr("data-page"),
                order: t.attr("data-order"),
                idArticle: t.attr("data-id-article"),
                total: t.attr("data-count")
            },
            e = t.attr("data-href");
        $.ajax(e, i(t, {
            data: a
        })).done(function(e) {
            $("#article-opinion-scroll").show(), t.attr("data-page", parseInt(a.page) + 1), t.children("#comment-list").append(e), t.attr("data-loaded", 1), PccStars.load({
                parentSelector: "#comment-list"
            }), 15 * (parseInt(a.page) + 1) > a.total && $("#article-opinion-scroll").hide()
        })
    }

    function i(t, a) {
        return $.extend(a, {
            beforeSend: function() {
                var a = $("#ajax-loadin-container").html();
                t.hide().append(a).fadeIn(600)
            },
            complete: function() {
                t.children("#ajax-loading").remove()
            }
        })
    }

    function r() {
        var t = $("#ficha-producto-preguntas"),
            a = {
                idArticle: t.attr("data-id-article"),
                idCategory: $("#question-categories").val()
            },
            e = t.attr("data-href");
        $.ajax(e, i(t, {
            data: a
        })).done(function(e) {
            t.attr("data-page", parseInt(a.page) + 1), t.children("#qaa-list").html(e), t.attr("data-loaded", 1)
        })
    }

    function c(t) {
        var a = parseInt(t.data("max"), 10);
        return parseInt(t.val(), 10) > a ? (t.data("refubrished") || $(".max-units-modal").modal(), t.val(1), !0) : 0 === parseInt(t.val(), 10) ? (t.val(1), !1) : void 0
    }

    function d(t) {
        var a = $("#modalpcc");
        a.find('div[class="modal-body"]').html("<p>" + t + "</p>"), a.find('div[class="modal-footer"]').html('<button type="button" class="btn btn-primary" data-dismiss="modal">Cerrar</button>'), a.modal("show")
    }

    function l() {
        var t = $("#codigo-articulo-pc").text();
        if (t) {
            var a = Routing.generate("pcc_web_dropshipping_delivery", {
                idArticle: t
            });
            $.ajax({
                url: a,
                dataType: "json",
                method: "get",
                success: function(t) {
                    t.error || $(".js-dropshipping-article-delivery-date").html(t.deliveryString)
                },
                error: function(t) {},
                cache: !1
            })
        }
    }

    function s(t) {
        window.dataLayer = window.dataLayer || [], dataLayer.push({
            event: "addToCart",
            ecommerce: {
                currencyCode: "EUR",
                add: {
                    products: [{
                        name: t.data("name"),
                        id: t.data("id"),
                        price: t.data("price"),
                        brand: t.data("brand"),
                        category: t.data("category"),
                        quantity: t.data("qty")
                    }]
                }
            }
        })
    }
    var u = document.querySelector(".js-article-data-info").dataset;
    PCC.Articles.getPriceAndAvailability(replacePriceAndAvailability);
    var m = document,
        p = m.getElementsByTagName("head")[0],
        f = $(".fancybox");
    "function" == typeof f.fancybox && !checkIfDeviceIsiOS() && f.fancybox(), $("#popover-paack2h").length > 0 && ($.cookie("firstTime") || (document.cookie = "firstTime=yes", $(".js-trigger-open").trigger("click")));
    var v = $("#js-article-detail"),
        h = m.createElement("script");
    h.async = !0, h.src = v.data("extra-js"), p.appendChild(h), $(window).on("load", function() {
        "drop-shipping" === u.type && l(), $("#article-detail-tabs").easyResponsiveTabs({
            type: "default",
            width: "auto",
            fit: !0,
            closed: "accordion",
            activate: function(t) {
                var a = $(this),
                    e = $("#tabInfo"),
                    o = $("span", e),
                    n = $("#article-detail-tabs .resp-tabs-list").find("[aria-controls='" + a.attr("aria-controls") + "']"),
                    r = $("#" + n.data("target"));
                "" == r.text().trim() && $.ajax(n.data("url"), i(r)).done(function(t) {
                    r.html(t), r.find(".iframe-creator").length && pccVideo(), "comment-list" === r.attr("id") && $("#article-comment-order").trigger("change")
                }), o.text(a.text()), e.show()
            }
        })
    }), $(".enlace-secundario").click(function(t) {
        t.preventDefault();
        var a = $(this).attr("data-href"),
            e = $(this).attr("data-tab");
        $("html, body").animate({
            scrollTop: $(a).offset().top - $(".c-main-header").height()
        }, 700), $(e).click()
    }), $("#article-opinion-scroll").click(function() {
        n()
    }), $(document).on("change", "#article-comment-order", function(t) {
        var a = $("#ficha-producto-opinones");
        a.attr("data-order", $(t.target).val()), $("#comment-list").empty(), a.attr("data-page", 0), n()
    }), $.validator.addMethod("regex", function(t, a, e) {
        return e.constructor != RegExp ? e = new RegExp(e) : e.global && (e.lastIndex = 0), this.optional(a) || e.test(t)
    }), $.validator.addMethod("minStrict", function(t, a, e) {
        return t > e
    }), $(document).on("click", "#valoration-form .btn.btn-secondary", function() {
        $("#valoration-form").find(".has-success").removeClass("has-success")
    }), $(".new-article-comment").click(function(t) {
        function a() {
            "new-article-comment" != e.attr("id") ? o.addClass("in") : o.toggleClass("in"), o.find("#valoration-" + i).trigger("click"), void 0 != window.grecaptcha && window.grecaptcha.reset(), "" != document.querySelectorAll("#valoration_email")[0].value && (document.querySelectorAll("#valoration_nick")[0].parentNode.style.display = "none", document.querySelectorAll("#valoration_email")[0].parentNode.style.display = "none"), jQuery.validator.addMethod("wordCounter", function(t, a) {
                return 0 === t.length || t.length >= 100
            }, function(a, e) {
                return t("valoration_text", Math.abs(e.value.length - 100))
            }), jQuery.validator.addMethod("override", function(t, a) {
                return !0
            }), jQuery.validator.addMethod("notEmpty", function(t, a) {
                return $("#valoration_Valorar").data("clicked") || t.length > 0
            });
            var t = function(t, a) {
                    var e = document.documentElement.lang;
                    return {
                        valoration_text: {
                            es: "Vaya, te faltan " + (a = a) + " caracteres hasta el mÃ­nimo. Â¡Por favor no pares ahora, los demÃ¡s te lo agradecerÃ¡n!",
                            pt: "Vamos, faltam " + a + " carateres atÃ© ao mÃ­nimo. NÃ£o pares agora, por favor. Os outros utilizadores agradecem!"
                        }
                    } [t][e]
                },
                a = function(t) {
                    t.classList.remove("form-control-danger"), t.classList.remove("form-control-success"), t.parentNode.classList.remove("has-danger"), t.parentNode.classList.remove("has-success")
                };
            $("#valoration-form").validate({
                errorClass: "aviso-de-error",
                ignore: [],
                rules: {
                    "valoration[email]": {
                        required: !0,
                        email: !0,
                        regex: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
                    },
                    "valoration[text]": {
                        wordCounter: !0
                    },
                    "valoration[advantages]": {
                        notEmpty: !0,
                        required: !1
                    },
                    "valoration[disadvantages]": {
                        notEmpty: !0,
                        required: !1
                    },
                    "valoration[recommend]": {
                        required: !0
                    },
                    "valoration[valoration]": {
                        required: !0,
                        digits: !0,
                        minStrict: 0
                    },
                    "valoration[priceValoration]": {
                        required: !0,
                        digits: !0,
                        minStrict: 0
                    }
                },
                errorPlacement: function(t, e) {
                    e.is(":radio") ? t.appendTo("#valoration-recommend-div") : "valoration[valoration]" == e[0].name ? t.appendTo("#valoration-stars-div") : "valoration[priceValoration]" == e[0].name ? t.appendTo("#valoration-stars-price-div") : "valoration[advantages]" == e[0].name ? a(document.querySelectorAll("#valoration_advantages")[0]) : "valoration[disadvantages]" == e[0].name ? a(document.querySelectorAll("#valoration_disadvantages")[0]) : t.insertAfter(e), $("#valoration_Valorar").data("clicked", !1)
                },
                messages: {
                    "valoration[email]": "Por favor, escribe una direcciÃ³n de correo vÃ¡lida.",
                    "valoration[recommend]": "Selecciona sÃ­ o no",
                    "valoration[valoration]": "Por favor, introduce una valoraciÃ³n para el artÃ­culo",
                    "valoration[priceValoration]": "Por favor, introduce una valoraciÃ³n calidad/precio"
                }
            })
        }
        t.preventDefault();
        var e = $(this),
            o = $("#opnion-form-drop"),
            n = e.data("href"),
            i = $(t.target).data("type");
        $(document).on("click", "#valoration_Valorar", function() {
            $(this).data("clicked", !0)
        }), o.children().length ? a() : $.get(n, function(t) {
            o.html(t), a()
        })
    });
    var g = $("#cheaper-form-modal");
    g.click(function() {
        var e = $(this).attr("data-href");
        $.ajax(e).done(function(o) {
            if (1 == (o = JSON.parse(o)).sesionStatus) {
                var n = $("#modalpcc"),
                    r = n.find(".modal-content");
                r.html(""), n.modal("show"), $.ajax(e, i(r)).done(function(o) {
                    "alert" == (o = JSON.parse(o)).type ? (n.modal("hide"), g.nextAll().remove(), setTimeout(function() {
                        g.after(o.content)
                    }, 200)) : (r.html(o.content), t(), a(e))
                })
            } else "alert" == o.type && (g.nextAll().remove(), setTimeout(function() {
                g.after(o.content)
            }, 100))
        })
    }), $("#buy-buttons-section, #buyCurtain").delegate(".buy-button", "click", function(t) {
        $(this).stateButton("loading");
        var a = $(this);
        if (o($(this), function(t) {
                if (t > 0) {
                    s(a);
                    var e = Routing.generate("pcc_cart_detail");
                    $(location).attr("href", e)
                }
            }), PCC.loadCometHunter) {
            var e = Routing.generate("pcc_web_comethunter"),
                n = {
                    event: "addToCart",
                    quantity: a.data("qty"),
                    id_item: a.data("id"),
                    price: a.data("price"),
                    brand: a.data("brand"),
                    category: a.data("category"),
                    name: a.data("name")
                };
            $.post(e, n, function(t) {})
        }
    }), $("#buy-mobile-buttons-section").delegate(".buy-button", "click", function(t) {
        var a = $(this);
        if (o($(this), function(t) {
                if (t > 0) {
                    s(a);
                    var e = Routing.generate("pcc_cart_detail");
                    $(location).attr("href", e)
                }
            }), PCC.loadCometHunter) {
            var e = Routing.generate("pcc_web_comethunter"),
                n = {
                    event: "addToCart",
                    quantity: a.data("qty"),
                    id_item: a.data("id"),
                    price: a.data("price"),
                    brand: a.data("brand"),
                    category: a.data("category"),
                    name: a.data("name")
                };
            $.post(e, n, function(t) {})
        }
    }), $("#buy-mobile-buttons-section, .notify-me").delegate("#notify-me", "click", function() {
        var t = $(this).data("href"),
            a = t.split("/");
        isNaN(a[a.length - 1]) || (t += u.idarticle), $.get(t, function(t) {
            $("#avisame-drop-down").html(t), $("#avisame-drop-down").collapse()
        })
    }), $("#buy-buttons-section, .buy-buttons-section").delegate("#add-cart , .js-marketplace-addCar", "click", function() {
        console.log("AÃ±adiendo Al Carrito");
        var t = $(this);
        $(".modal-buy-appliance").modal("hide"), $carritoHeader = $(".js-user-cart"), $pcComBasket = $("#pccom-basket"), t.attr("disabled", !0), t.stateButton("loading"), $carritoHeader.parent().addClass("is-active"), clearTimeout(cartTimeout);
        var a = $("<div></div>").html($("#ajax-loadin-container").html());
        if (a.find("#ajax-loading").css({
                margin: 0
            }).find(".overlay-spin").css({
                top: 0,
                position: "static",
                display: "block",
                width: "100%"
            }).find(".spinner").css({
                margin: "0 auto 10px",
                "box-shadow": "none"
            }), $pcComBasket.prepend($("<li></li>").append(a).append($("<hr/>"))), o($(this), function(a) {
                if (t.stateButton("reset"), t.removeAttr("disabled"), window.dataLayer = window.dataLayer || [], dataLayer.push({
                        event: "addToCart",
                        ecommerce: {
                            currencyCode: "EUR",
                            add: {
                                products: [{
                                    name: t.attr("data-name"),
                                    id: t.attr("data-id"),
                                    price: parseInt(t.attr("data-price")),
                                    brand: t.attr("data-brand"),
                                    category: t.attr("data-category"),
                                    quantity: parseInt($("#article-quantity").val(), 10)
                                }]
                            }
                        }
                    }), $(".js-modal-pickup, .js-modal-installation").prop("checked", !1), t.parent().hasClass("buy-buttons-section") && !t.hasClass("inPage")) {
                    var e = Routing.generate("pcc_cart_detail");
                    $(location).attr("href", e)
                } else updateUserLayer(!0)
            }), PCC.loadCometHunter) {
            var e = Routing.generate("pcc_web_comethunter"),
                n = {
                    event: "addToCart",
                    quantity: parseInt($("#article-quantity").val(), 10),
                    id_item: t.attr("data-id"),
                    price: parseInt(t.attr("data-price")),
                    brand: t.attr("data-brand"),
                    category: t.attr("data-category"),
                    name: t.attr("data-name")
                };
            $.post(e, n, function(t) {})
        }
    }), $(document).on("click", "#new-article-review", function() {
        var t = $(this).data("href"),
            a = $("#add-review");
        a.css("display", "block"), a.hasClass("in") && setTimeout(function() {
            "block" == a.css("display") && "26px" == a.css("height") && a.css("display", "none")
        }, 300), 0 == a.data("loaded") && (a.data("loaded", 1), $.ajax(t, i(a)).done(function(t) {
            a.html(t)
        }))
    }), $(document).on("click", "#new-article-video", function() {
        var t = $(this).data("href"),
            a = $("#add-video");
        0 == a.data("loaded") && (a.data("loaded", 1), $.ajax(t, i(a)).done(function(t) {
            a.html(t)
        }))
    }), $(document).on("click", ".cancel-review-video", function() {
        $($(this).data("href")).trigger("click")
    }), $(document).on("click", "#new-article-question", function() {
        var t = $(this).data("href");
        $.get(t, function(t) {
            $("#hacer-pregunta").html(t), $("#hacer-pregunta").collapse()
        })
    }), $(document).on("click", "#qaa-list .add-answer", function() {
        var t = $(this),
            a = t.attr("data-href");
        $.get(a, function(a) {
            $(t.attr("href")).html(a), $(t.attr("href")).collapse()
        })
    }), $(document).on("click", "#qaa-list .add-answer-comment", function() {
        var t = $(this),
            a = t.attr("data-href");
        $.get(a, function(a) {
            $(t.attr("href")).html(a), $(t.attr("href")).collapse()
        })
    }), $(document).on("change", "#question-categories", function() {
        r()
    }), $("#financing-month").change(function() {
        var t = $(this).children("option:selected");
        if (0 != t.val()) {
            var a = $(this).attr("data-price"),
                e = parseFloat(t.attr("data-ratio")),
                o = Math.round(a * e * 100) / 100,
                n = 15,
                i = 16.08,
                r = t.val(),
                c = Math.round(a * e * r * 100) / 100;
            Math.round(100 * (c - a));
            o = parseFloat(o).toFixed(2), $("#financing-fee").val(o), 12 == r && (n = 0, i = 0), $("#tin").html(n), $("#tae").html(i), $("#total").html(parseFloat(c).toFixed(2)), $(".financing").show("fast")
        } else $(".financing").hide("fast"), $("#financing-fee").val("")
    }), $(".pay-paypal-express").click(function() {
        o(null, e)
    }), $("#opnion-form-drop").on("submit", "#valoration-form", function(t) {
        t.preventDefault();
        var a = $(this),
            e = a.attr("action"),
            o = $(this).serialize();
        a.attr("action").split("/")[3];
        $.post(e, o, function(t) {
            "alert-warning" != t.class && "alert-danger" != t.class ? ($("#opnion-form-drop").html(t), window.dataLayer = window.dataLayer || [], dataLayer.push({
                event: "gaEvent",
                gaEventCategory: "ficha producto",
                gaEventAction: "escribir opinion",
                gaEventLabel: void 0,
                gaEventValue: void 0,
                gaEventNonInteraction: !0
            })) : d(t.message)
        })
    }), $(document).on("click", ".btn-collapse-form", function() {
        $(this).parents("form").parent().removeClass("in")
    }), $(document).on("click", ".reply-comment", function() {
        var t = $(this).data("href"),
            a = $(this).data("id");
        $.ajax(t).done(function(t) {
            $("#" + a).html(t)
        })
    }), $(document).on("submit", "#valoration-reply-form", function(t) {
        t.preventDefault();
        var a = $(this),
            e = a.attr("action"),
            o = $(this).serialize();
        $.post(e, o, function(t) {
            "alert-warning" != t.class && "alert-danger" != t.class ? a.html(t) : d(t.message)
        })
    }), $(document).on("click", ".complaint", function() {
        var t = $(this),
            a = $(this).data("href"),
            e = $(this).data("id");
        $.ajax(a).done(function(a) {
            $(".alert-warning, .alert-danger, .alert-success").remove(), t.parents(".respuesta-" + e).length ? t.parents(".respuesta-" + e).prepend(a).find(".alert p").css("background-color", "#fcf8e3") : t.parents(".opinion-" + e).before(a).find(".alert p").css("background-color", "#fcf8e3")
        })
    }), $(document).on("click", ".read-more", function() {
        var t = $(this).data("id"),
            a = $(".comment-text-" + t);
        "inline" == a.css("display") ? a.fadeToggle().parent().addClass("unshowed") : a.css("display", "inline").parent().removeClass("unshowed")
    }), $("#article-quantity").on("keypress", function(t) {
        (t.keyCode < 48 || t.keyCode > 57) && t.preventDefault()
    }).on("change", function() {
        c($(this)), $(".js-modal-units").text($("#article-quantity").val())
    }), $(".quantity-modify").click(function() {
        var t = $(this).hasClass("quantity-add") ? 1 : -1,
            a = $("#article-quantity");
        parseInt(a.val()) + t > 0 && (a.val(parseInt(a.val()) + t), $(".js-modal-units").text($("#article-quantity").val())), c(a)
    }), $("#ficha-producto-preguntas").delegate("#new-question", "submit", function(t) {
        t.preventDefault();
        var a = $(this).attr("action"),
            e = $(this).serialize();
        $.post(a, e, function(t) {
            $("#hacer-pregunta").html(t), window.dataLayer = window.dataLayer || [], dataLayer.push({
                event: "envio-formulario",
                formulario: "enviarPreguntaGTM"
            })
        })
    }).delegate("#new-answer", "submit", function(t) {
        t.preventDefault();
        var a = $(this),
            e = a.attr("action"),
            o = $(this).serialize();
        $.post(e, o, function(t) {
            a.parent().html(t), window.dataLayer = window.dataLayer || [], dataLayer.push({
                event: "envio-formulario",
                formulario: "enviarRespuestaGTM"
            })
        })
    }).delegate("#new-answer-comment", "submit", function(t) {
        t.preventDefault();
        var a = $(this),
            e = a.attr("action"),
            o = $(this).serialize();
        $.post(e, o, function(t) {
            a.parent().html(t), window.dataLayer = window.dataLayer || [], dataLayer.push({
                event: "envio-formulario",
                formulario: "enviarRespuestaGTM"
            })
        })
    }).delegate(".valorate-question", "click", function() {
        var t = $(this).parents(".question-section").attr("data-id"),
            a = $(this).attr("data-valoration"),
            e = $(this).siblings(".big-momma"),
            o = "positive" == a ? 1 : -1,
            n = Routing.generate("pcc_web_article_question_valorate", {
                idQuestion: t,
                valoration: a
            });
        $.get(n, function(t) {
            d(t.message), "alert-warning" != t.class && "alert-danger" != t.class && e.text(parseInt(e.text()) + o)
        })
    }), $("#ficha-producto-opinones").delegate(".valorate-comment", "click", function(t) {
        t.preventDefault();
        var a = $(this).parents(".opinion-contenedor ").attr("data-id"),
            e = $(this).attr("data-valoration"),
            o = Routing.generate("pcc_web_article_comment_valorate", {
                idComment: a,
                valoration: e
            });
        $.get(o, function(t) {
            d(t.message)
        }), window.dataLayer = window.dataLayer || [], dataLayer.push({
            event: "envio-formulario",
            formulario: "valorarComentarioProductoFichaGTM"
        })
    }), $(document).on("click", ".complaint-qaa", function() {
        url = $(this).data("href"), id = $(this).data("id"), tab = $(".comment-" + id), $.ajax(url).done(function(t) {
            $(".alert-warning").remove(), $(".alert-danger").remove(), $(".alert-success").remove(), $(".comment-" + id).before(t)
        })
    }), $("#ficha-producto-videos").delegate("#review-form", "submit", function(t) {
        t.preventDefault();
        var a = $(this),
            e = a.attr("action"),
            o = a.serialize();
        $.post(e, o, function(t) {
            a.parent().html(t)
        }), window.dataLayer = window.dataLayer || [], dataLayer.push({
            event: "gaEvent",
            gaEventCategory: "ficha producto",
            gaEventAction: "video review",
            gaEventLabel: void 0,
            gaEventValue: void 0,
            gaEventNonInteraction: !0
        })
    }).delegate(".valorate-video", "click", function() {
        var t = $(this).attr("data-id"),
            a = $(this).attr("data-valoration"),
            e = $(this).attr("data-article"),
            o = Routing.generate("pcc_web_article_video_valorate", {
                idVideo: t,
                valoration: a,
                idArticle: e
            });
        $.get(o, function(t) {
            d(t.message)
        })
    }), $("#buy-buttons-section").delegate(".reserve-button", "click", function(t) {
        var a = $("#contenedor-principal").attr("data-id"),
            e = Routing.generate("pcc_web_article_booking", {
                idArticle: a
            });
        window.location.href = e
    }), $(".do-reserve-button").click(function() {
        var t = $("#contenedor-principal").attr("data-id"),
            a = Routing.generate("pcc_web_article_booking", {
                idArticle: t
            });
        $.post(a, function(a) {
            if (a.booked) {
                window.dataLayer = window.dataLayer || [], dataLayer.push({
                    event: "envio-formulario",
                    formulario: "realizarReservaGTM",
                    "campo-formulario1": t
                });
                var e = Routing.generate("pcc_user_panel_booking");
                window.location.href = e
            }
        }, "json").fail(function(t) {
            console.log(t)
        })
    }), $(".capa-pregunta").click(function() {
        $(this).parent().parent().toggleClass("fondo-activo")
    }), $(document).on("click", ".load-answer-comment", function() {
        $_invoker = $(this);
        var t = $_invoker.attr("data-href"),
            a = $_invoker.attr("href");
        $.get(t, function(t) {
            $(a).html(t)
        })
    });
    var y = new Date;
    if ($.cookie("sameDayZone") && y.getHours() < 13) {
        var b = $("#GTM-desplegableFicha-disponibilidad"),
            w = $("#accp-002 > .acc-block-body");
        b.length && w.length && (replaced = b.html().replace("esta tarde", "esta tarde en " + $.cookie("sameDayZone")), b.html(replaced), replaced = w.html().replace("modalidad de envÃ­o de 24 horas laborables", "agencia Redyser Same Day"), replaced = replaced.replace("EspaÃ±a Peninsular", $.cookie("sameDayZone")), w.html(replaced))
    }
    $(document).on("click", "#notify-me", function() {
        var t = $(this).data("href"),
            a = t.split("/");
        isNaN(a[a.length - 1]) || (t += u.idarticle), $.get(t, function(t) {
            $("#avisame-drop-down").html(t), $("#avisame-drop-down").collapse()
        })
    }), $(document).on("click", "#notify-me-top", function() {
        $("#notify-me").trigger("click"), $("html, body").animate({
            scrollTop: 0
        }, "fast")
    }), $("#avisame-drop-down").delegate("form", "submit", function(t) {
        t.preventDefault();
        var a = $("#contenedor-principal").attr("data-id"),
            e = $(this).attr("action"),
            o = $(this).serialize();
        $.post(e, o, function(t) {
            $("#avisame-drop-down").html(t), window.dataLayer = window.dataLayer || [], dataLayer.push({
                event: "envio-formulario",
                formulario: "notificarEntradaProductoGTM",
                "campo-formulario1": a
            })
        })
    }), "av" == $.urlParam("acc") && $("#notify-me").trigger("click"), document.cookie.indexOf("shopVersion") > -1 && ($("#GTM-desplegableFicha-disponibilidadTienda").data("expanded", !0), $("#accp-012").addClass("in")), $(document).on("change", "#storeselect", function() {
        $("#storeselect").find(":selected").data("storeavailability") ? $("#availabilityText").html($("#shopStock").attr("data-stock")) : $("#availabilityText").html($("#shopStock").attr("data-nostock"))
    }), $(document).on("click", ".paack2h-modal", function() {
        $(this).attr("data-text"), $(this).attr("data-article");
        var t = $("#paack2h-modal");
        t.modal({
            backdrop: "static",
            keyboard: !1
        }), t.modal("show")
    }), $(document).on("click", "#checkPostalcodeButton", function() {
        var t = $("#postalCodeField").val();
        $.ajax({
            url: Routing.generate("pcc_user_provinces_postalCode"),
            data: "country=ES&postalCode=" + t,
            method: "post",
            dataType: "json",
            async: !1
        }).done(function(a) {
            a.idProvince ? $.ajax({
                url: Routing.generate("pcc_web_article_agencies_2h_postalcodes"),
                data: "country=ES&postalCode=" + t,
                method: "post",
                dataType: "json",
                async: !1
            }).done(function(a) {
                $("#alertMessage").addClass("alert alert-success"), 1 == a.isValid ? ($("#alertMessage").removeClass("alert-danger").addClass("alert-dismissible fade in"), $("#messageText").html($("#alertMessage").attr("data-text1") + t + "."), $("#buttonX").show()) : ($("#alertMessage").removeClass("alert-dismissible").addClass("alert-danger fade in"), $("#messageText").html($("#alertMessage").attr("data-text2") + t + "."), $("#buttonX").show())
            }) : a.error && ($("#alertMessage").removeClass("alert-dismissible").addClass("alert-danger fade in"), $("#messageText").html($("#alertMessage").attr("data-text3")), $("#buttonX").show())
        })
    }), $(".addCar").on("click", function() {
        $("#add-cart").addClass("inPage")
    }), $(".buy").on("click", function() {
        $("#add-cart").removeClass("inPage")
    })
});
var replacePriceAndAvailability = {
    run: function(t) {
        function a(a, e) {
            var o = document.createElement("button");
            o.setAttribute("type", "button"), o.setAttribute("data-loading-text", "AÃ±adiendo..."), o.setAttribute("data-name", a.getAttribute("data-name")), o.setAttribute("data-id", a.getAttribute("data-id")), o.setAttribute("data-price", (t.priceIntegerPart + t.priceDecimalPart).replace(",", ".")), o.setAttribute("data-brand", a.getAttribute("data-brand")), o.setAttribute("data-category", a.getAttribute("data-category")), o.setAttribute("data-qty", a.getAttribute("data-qty")), o.setAttribute("data-offer", a.getAttribute("data-offer")), o.className += "btn js-article-buy btn-primary btn-lg buy GTM-addToCart buy-button";
            var n = document.createElement("strong");
            n.innerText = "Comprar", o.appendChild(n);
            var i = document.createElement("i");
            i.innerText = "]", i.className += "pccom-icon", o.appendChild(i), e.appendChild(o)
        }

        function e(t, a) {
            var e = document.createElement("button");
            e.setAttribute("type", "button"), e.setAttribute("data-toggle", "collapse"), e.setAttribute("href", "#avisame-drop-down"), e.setAttribute("data-href", t.getAttribute("data-href")), e.setAttribute("id", "notify-me"), e.setAttribute("data-offer", t.getAttribute("data-offer")), e.className += "btn js-article-buy btn-primary btn-lg buy GTM-addToCart notify-me";
            var o = document.createElement("strong");
            o.innerText = "AvÃ­same", e.appendChild(o);
            var n = document.createElement("i");
            n.innerText = "]", n.className += "pccom-icon", e.appendChild(n), a.appendChild(e)
        }
        for (var o = parseInt($("#article-availability").attr("data-id")), n = t.buyBox[0], i = document.querySelector(".js-article-buy").dataset, r = t.availability.code, c = document.documentElement.lang, d = 0, l = t.buyBox.length; d != l; d++)
            if (0 == t.buyBox[d].idOffer) {
                !0;
                break
            } if (i.offer || (i.offer = 0), 0 == n.idOffer && 0 == i.offer) {
            r !== o && (Array.from(document.querySelectorAll(".js-article-buy")).map(function(t) {
                r <= 3 ? a(t, t.parentElement) : e(t, t.parentElement), t.parentNode.removeChild(t)
            }), Array.from(document.querySelectorAll(".js-article-add-to-cart")).map(function(t) {
                r <= 3 ? t.classList.remove("disabled") : t.className += " disabled"
            }));
            var s = "";
            1 === r ? (s = "es" === c ? "Â¡En stock! Â¡RecÃ­belo " : "Em stock! Recebe-o ", $("#enstock").html(s + t.deliveryDate + "!"), $("#articleOutOfStock").hide(), $("#articleInStock").show(), $("#availabilityBlock").removeClass("warning-disponibility"), $("#recibelo").hide(), $("#enstock").show()) : 2 === r || 3 === r ? (s = "es" === c ? "RecÃ­belo " : "Recebe-o ", $("#articleOutOfStock").hide(), $("#articleInStock").show(), $("#availabilityBlock").addClass("warning-disponibility"), $("#recibelo").html(s + t.deliveryDate), $("#enstock").hide(), $("#recibelo").show()) : ($("#articleInStock").hide(), $("#articleOutOfStock").show())
        }
    }
};
$(document).ready(function() {
    var t = document.getElementById("contenedor-principal").dataset.id;
    document.getElementById("contenedor-principal").dataset.availability < 4 && PCC.recommender && PCC.recommender.getRecommendedArticles(t, {
        success: function(t) {
            PCC.recommender.zona1.addZona1(t), PCC.recommender.zona4.addZona4(t)
        },
        errors: function(t) {
            $("#pcc-main-accesory").remove(), console.error("ERROR: ", t)
        }
    })
}), $(window).scroll(function() {
    if (document.querySelector("#add-main-pack-button")) {
        var t = $("#add-main-pack-button").offset().top,
            a = $("#add-main-pack-button").offset().top + $("#add-main-pack-button").outerHeight(),
            e = $(window).scrollTop() + window.innerHeight,
            o = $(window).scrollTop();
        e > t && o < a ? $("#action-bar-movil").slideUp() : $("#action-bar-movil").slideDown()
    }
});