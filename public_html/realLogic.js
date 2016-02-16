


function equivalenceRule(e) {
    var s = e.parents(".fol").find(".x").clone()
    $("#temp").append(s)
    e = s.parents(".fol").find("#" + e.attr('id'))
    return e
}

function operate(type, a, b) {
    a.removeClass("a b x")
    b.removeClass("a b x")
    a.addClass('a')
    b.addClass('b')
    var operObj = {
        "conj": "&",
        "disj": "|",
        "cond": ">"
    }
    var e = $(document.createElement("span"))
    e.attr('name', type)
    e.addClass("subs")
    e.html("<span class='lparen'>(</span><span class='oper'>" + operObj[type] + "</span><span class='rparen'>)</span>")
    var oper = e.children(".oper")
    a.insertBefore(oper)
    b.insertAfter(oper)
    return e
}

function negate(a) {
    a.removeClass("b x")
    a.addClass('a')
    var e = $(document.createElement("span"))
    e.attr('name', "neg")
    e.addClass("subs")
    e.html("<span class='neg'>~</span>")
    var oper = e.children(".neg")
    a.clone().insertAfter(oper)
    a.replaceWith(e)
    return e
}

function toggle(a) {
    if (a.attr('name') == 'neg') {
        var eClass = sClass(a)
        var r = a.children(".a")
        a.replaceWith(r)
        r.removeClass("a b x")
        r.addClass(eClass)
    } else {
        var r = negate(a)
    }
    r.addClass(eClass)
    return r
}

function sClass(e) {
    if (e.hasClass("a")) {
        var eClass = "a"
    }
    if (e.hasClass("b")) {
        var eClass = "b"
    }
    if (e.hasClass("x")) {
        var eClass = "x"
    }
    return eClass
}
var tt = {
    'conj': 'disj',
    'disj': 'conj'
}

function wrap(e) {
    e = e.clone()
    //if e is conj, disj, or cond w/o parenths, put parenths around it.
    var biOp = {
        "conj": true,
        "disj": true,
        "cond": true
    }
    if (biOp[e.attr("name")] && e.children(".lparen").length == 0) {
        e.prepend("<span class='lparen'>(</span>")
        e.append("<span class='rparen'>)</span>")
    }
    return e
}
var ops = {
    commutation: function (e) {
        var eClass = sClass(e)
        e = equivalenceRule(e)
        var type = e.attr("name")
        var a = e.children(".a")
        var b = e.children(".b")
        var r = operate(type, b, a)
        r.removeClass("a b x")
        r.addClass(eClass)
        e.replaceWith(r)
        return r
    },
    removeDblNegation: function (e) {
        var eClass = sClass(e)
        e = equivalenceRule(e)
        var type = e.attr("name")
        var r = e.children('.a').children('.a')
        r.removeClass("a b x")
        r.addClass(eClass)
        e.replaceWith(r)
        return r
    },
    addDoubleNegation: function (e) {
        var eClass = sClass(e)
        e = equivalenceRule(e)
        var type = e.attr("name")
        e = negate(e)
        e = negate(e)
        e.removeClass("a b x")
        e.addClass(eClass)
        //e.replaceWith(r)
        return e
    },
    deMorganOut: function (e) {
        var eClass = sClass(e)
        e = equivalenceRule(e)
        var type = e.attr("name")
        var a = e.children(".a")
        var b = e.children(".b")
        a = toggle(a)
        b = toggle(b)
        var f = operate(tt[type], a, b)
        e.replaceWith(f)
        f = toggle(f)
        f.removeClass("a b x")
        f.addClass(eClass)
        return f
    },
    deMorganIn: function (e) {
        var eClass = sClass(e)
        e = equivalenceRule(e)
        var type = e.children(".a").attr("name")
        var gca = e.children(".a").children(".a")
        var gcb = e.children(".a").children(".b")
        gca = toggle(gca)
        gcb = toggle(gcb)
        var r = operate(tt[type], gca, gcb)
        e.replaceWith(r)
        r.removeClass("a b x")
        r.addClass(eClass)
        return r
    },
    association: function (e) {
        var eClass = sClass(e)
        e = equivalenceRule(e)
        var type = e.attr("name")
        if (e.children(".a").attr("name") == type) {
            var a = e.children(".a").children(".a")
            var b = e.children(".a").children(".b")
            var c = e.children('.b')
            var r = operate(type, b, c)
            r = operate(type, a, r)
        } else {
            var a = e.children('.a')
            var b = e.children(".b").children(".a")
            var c = e.children(".b").children(".b")
            var r = operate(type, a, b)
            r = operate(type, r, c)
        }
        r.removeClass("a b x")
        r.addClass(eClass)
        e.replaceWith(r)
        return r
    },
    distributeIn: function (e) {
        var eClass = sClass(e)
        e = equivalenceRule(e)
        var type = e.attr("name")
        if (e.children(".a").attr("name") == tt[type]) {
            var a = e.children(".a").children(".a")
            var b = e.children(".a").children(".b")
            var c = e.children('.b')
            var f = operate(type, a, c)
            var g = operate(type, b, c.clone())
            var h = operate(tt[type], f, g)
        } else {
            var a = e.children('.a')
            var b = e.children(".b").children(".a")
            var c = e.children(".b").children(".b")
            var f = operate(type, a, b)
            var g = operate(type, a.clone(), c)
            var h = operate(tt[type], f, g)
        }
        h.removeClass("a b x")
        h.addClass(eClass)
        e.replaceWith(h)
        return h
    },
    distributeOut: function (e) {
        var eClass = sClass(e)
        e = equivalenceRule(e)
        var type = e.attr("name")
        var a = e.children('.a').children('.a')
        var b = e.children('.a').children('.b')
        var c = e.children('.b').children('.b')
        var f = operate(type, b, c)
        var g = operate(tt[type], a, f)
        g.removeClass("a b x")
        g.addClass(eClass)
        e.replaceWith(g)
        return g
    },
    contraposition: function (e) {
        var eClass = sClass(e)
        e = equivalenceRule(e)
        var a = e.children('.a')
        var b = e.children('.b')
        a = toggle(a)
        b = toggle(b)
        var r = operate("cond", b, a)
        r.removeClass("a b x")
        r.addClass(eClass)
        e.replaceWith(r)
        return r
    },
    condToDisj: function (e) {
        var eClass = sClass(e)
        e = equivalenceRule(e)
        var a = e.children('.a')
        var b = e.children('.b')
        a = toggle(a)
        var r = operate("disj", b, a)
        r.removeClass("a b x")
        r.addClass(eClass)
        e.replaceWith(r)
        return r
    },
    disjToCond: function (e) {
        var eClass = sClass(e)
        e = equivalenceRule(e)
        var a = e.children('.a')
        var b = e.children('.b')
        b = toggle(b)
        var r = operate("cond", b, a)
        r.removeClass("a b x")
        r.addClass(eClass)
        e.replaceWith(r)
        return r
    },
    conjElim: function (e) {
        r = e.children(".a").clone()
        r.removeClass("a b")
        r.addClass("x")
        $("#temp").append(r)
        return r
    },
    conjIntro: function (e1, e2) {
        e1 = wrap(e1)
        e2 = wrap(e2)
        e1.removeClass("a b x")
        e2.removeClass("a b x")
        e1.addClass('a')
        e2.addClass('b')
        r = operate("conj", e1, e2)
        r.addClass('x')
        $("#temp").append(r)
        return r
    },
    condElim: function (e1, e2) {
        r = e1.children(".b").clone()
        r.removeClass("a b")
        r.addClass('x')
        $("#temp").append(r)
        return r
    },
    contIntro: function (e1, e2) {
        $("#temp").append("<span class='subs x' name='cont'>*</span>")
        r = $("#temp").children(".x")
        return r
    },
    disjIntro: function (e1, e2) {
        e1 = wrap(e1)
        e2 = wrap(e2)
        e1.removeClass("a b x")
        e2.removeClass("a b x")
        e1.addClass('a')
        e2.addClass('b')
        r = operate("disj", e1, e2)
        r.addClass('x')
        $("#temp").append(r)
        return r
    },
    contElim: function (e1, e2) {
        r = e2.clone()
        r.removeClass("a b")
        r.addClass("x")
        $("#temp").append(r)
        return r
    },
    condIntro: function($sp){
        var a = $sp.first().children(".x").clone()
        var b= $sp.eq(-2).children(".x").clone()
        r = operate("cond",a,b)
        r.addClass("x")
        $("#temp").append(r)
        return r
    },
    negIntro: function($sp){
        var a = $sp.first().children(".x").clone()
        r = negate(a)
        r.addClass("x")
        $("#temp").append(r)
        return r
    },
    disjElim: function(e,sp1,sp2){
        
    }
}
var ruleType = {
    commutation: "equi",
    association: "equi",
    addDoubleNegation: "equi",
    removeDblNegation: "equi",
    deMorganOut: "equi",
    deMorganIn: "equi",
    distributionIn: "equi",
    distributionOut: "equi",
    contraposition: "equi",
    disjToCond: "equi",
    condToDisj: "equi",
    condElim: "introElim",
    condIntro: "introElim",
    conjElim: "introElim",
    conjIntro: "introElim",
    disjElim: "introElim",
    disjIntro: "introElim",
    contElim: "introElim",
    contIntro: "introElim",
    negIntro: "introElim",
}
var test1 = {
    commutation: function (e) {
        var test = {
            "disj": true,
            "conj": true
        }
        return test[e.attr("name")]
    },
    association: function (e) {
        var type = e.attr("name")
        var test = {
            "disj": true,
            "conj": true
        }
        return test[type] && (e.children(".a").attr("name") == type || e.children(".b").attr("name") == type)
    },
    addDoubleNegation: function (e) {
        return true
    },
    removeDblNegation: function (e) {
        return e.attr('name') == "neg" && e.children(".a").attr('name') == "neg"
    },
    deMorganOut: function (e) {
        var test = {
            "disj": true,
            "conj": true
        }
        return (test[e.attr("name")])
    },
    deMorganIn: function (e) {
        var test = {
            "disj": true,
            "conj": true
        }
        return e.attr('name') == "neg" && test[e.children(".a").attr("name")]
    },
    distributionIn: function (e) {
        var test = {
            "disj": true,
            "conj": true
        }
        var type = e.attr("name")
        return test[type] && (e.children(".a").attr("name") == tt[type] || e.children(".b").attr("name") == tt[type])
    },
    distributionOut: function (e) {
        var test = {
            "disj": true,
            "conj": true
        }
        var type = e.attr("name")
        return test[type] && (e.children(".a").attr("name") == tt[type] && e.children(".b").attr("name") == tt[type])
    },
    contraposition: function (e) {
        return e.attr("name") == "cond"
    },
    disjToCond: function (e) {
        return e.attr("name") == "disj"
    },
    condToDisj: function (e) {
        return e.attr("name") == "cond"
    },
    conjElim: function (e) {
        return e.attr("name") == "conj"
    },
    conjIntro: function (e) {
        return e.hasClass("x")
    },
    condElim: function (e) {
        return e.hasClass("x") && e.attr("name") == "cond"
    },
    contIntro: function (e) {
        return e.hasClass("x")
    },
    disjIntro: function (e) {
        return e.hasClass("x")
    },
    contElim: function (e) {
        return e.attr("name") == "cont"
    },
}
var test2msg = {
    conjIntro: "<div>Select the sentence to conjoin to the green sentence.</div>",
    condElim: "<div>Select the sentence to use with the green conditional for a condElim (Modus Ponens)</div>",
    contIntro: "<div>Select the sentence to use with the green sentence to introduce *.</div",
    disjIntro: "<div>Which sentence do you want to disjoin to the green sentence?  Type a sentence below.</div><input id='msgRespInput' type='text'></input><input type='button' value='enter' id='msgRespEnter'></input>",
    contElim: "<div>What sentence do you want to infer from the * in green?  Type a sentence below.</div><input id='msgRespInput' type='text'></input><input type='button' value='enter' id='msgRespEnter'></input>",
}
var test2 = {
    conjIntro: function (e1, e2) {
        return e2.hasClass("x")
    },
    condElim: function (e1, e2) {
        e2 = wrap(e2)
        return e2.hasClass('x') && (e2.text() == e1.children('.a').text())
    },
    contIntro: function (e1, e2) {
        e1 = wrap(e1)
        e2 = wrap(e2)
        if (e2.hasClass("x")) {
            if (e1.attr('name') == "neg") {
                return e1.children(".a").text() == e2.text()
            } else if (e2.attr('name') == "neg") {
                return e1.text() == e2.children(".a").text()
            } else {
                return false
            }
        } else {
            return false
        }
    },
    disjIntro: function (e1, e2) {
        if (e2) {
            return true
        } else {
            return false
        }
    },
    contElim: function (e1, e2) {
        if (e2) {
            return true
        } else {
            return false
        }
    }
}



function eOrig(e) {
    var orig = null
    e.each(function () {
        if (orig) {
            orig = orig.add($("#folTable").find("#" + this.id))
        } else {
            orig = $("#folTable").find("#" + this.id)
        }
    })
    return orig
}

function toggleType(type) {
    if (type == "conj") {
        return "disj"
    }
    if (type == "disj") {
        return "conj"
    }
}
///////////////////////end functions for logical operations
var n = 2

