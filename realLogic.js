
alert('boo')

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
    var a1 = wrap(a)
    a.replaceWith(a1)
    a=a1
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

function toggleType(type) {
    if (type == "conj") {
        return "disj"
    }
    if (type == "disj") {
        return "conj"
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
    reiteration: "introElim",
    exisIntro: "introElim",
    exisElim: "introElim",
    univIntro: "introElim",
    univElim: "introElim",
}
var longTitle = {
    commutation: "commutation",
    association: "association",
    addDoubleNegation: "addDoubleNegation",
    removeDblNegation: "removeDblNegation (negElim)",
    deMorganOut: "deMorganOut",
    deMorganIn: "deMorganIn",
    distributionIn: "distributionIn",
    distributionOut: "distributionOut",
    contraposition: "contraposition",
    disjToCond: "disjToCond",
    condToDisj: "condToDisj",
    condElim: "condElim (modus ponens)",
    condIntro: "condIntro (conditional proof)",
    conjElim: "conjElim (simplification)",
    conjIntro: "conjIntro (conjunction)",
    disjElim: "disjElim (proof by cases)",
    disjIntro: "disjIntro (addition)",
    contElim: "contElim",
    contIntro: "contIntro",
    negIntro: "negIntro (reductio ad absurdum)",
    reiteration: "reiteration",
    exisIntro: "exisIntro (existential generalization)",
    exisElim: "exisElim (existential instantiation)",
    univIntro: "univIntro (universal generalization)",
    univElim: "univElim (universal instantiation)"
}
var test1 = {
    commutation: function (e) {
        var test = {
            "disj": true,
            "conj": true
        }
        return e.hasClass("subs") && test[e.attr("name")] && e.hasClass("subs")
    },
    association: function (e) {
        var type = e.attr("name")
        var test = {
            "disj": true,
            "conj": true
        }
        return e.hasClass("subs") && (test[type] && (e.children(".a").attr("name") == type || e.children(".b").attr("name") == type))  
    },
    addDoubleNegation: function (e) {
        return e.hasClass("subs")
    },
    removeDblNegation: function (e) {
        return e.hasClass("subs") && e.attr('name') == "neg" && e.children(".a").attr('name') == "neg"
    },
    deMorganOut: function (e) {
        var test = {
            "disj": true,
            "conj": true
        }
        return e.hasClass("subs") &&  test[e.attr("name")]
    },
    deMorganIn: function (e) {
        var test = {
            "disj": true,
            "conj": true
        }
        return e.hasClass("subs") && e.attr('name') == "neg" && test[e.children(".a").attr("name")]
    },
    distributionIn: function (e) {
        var test = {
            "disj": true,
            "conj": true
        }
        var type = e.attr("name")
        return e.hasClass("subs") && test[type] && (e.children(".a").attr("name") == tt[type] || e.children(".b").attr("name") == tt[type])
    },
    distributionOut: function (e) {
        var test = {
            "disj": true,
            "conj": true
        }
        var type = e.attr("name")
        return e.hasClass("subs") && test[type] && (e.children(".a").attr("name") == tt[type] && e.children(".b").attr("name") == tt[type])
    },
    contraposition: function (e) {
        return e.hasClass("subs") && e.attr("name") == "cond"
    },
    disjToCond: function (e) {
        return e.hasClass("subs") && e.attr("name") == "disj"
    },
    condToDisj: function (e) {
        return e.hasClass("subs") && e.attr("name") == "cond"
    },
    conjElim: function (e) {
        return e.hasClass("subs") && e.attr("name") == "conj"&&e.hasClass("x")
    },
    conjIntro: function (e) {
        return e.hasClass("subs") && e.hasClass("x")
    },
    condElim: function (e) {
        return e.hasClass("subs") && e.hasClass("x") && e.attr("name") == "cond"
    },
    contIntro: function (e) {
        return e.hasClass("subs") && e.hasClass("x")
    },
    disjIntro: function (e) {
        return e.hasClass("subs") && e.hasClass("x")
    },
    contElim: function (e) {
        return e.hasClass("subs") && e.attr("name") == "cont"
    },
    disjElim: function(e){
        return e.hasClass("subs") && e.hasClass("x")&&e.attr("name")=="disj"
    },
    reiteration: function(e){
        return e.hasClass("subs") && e.hasClass("x")
    },
    condIntro: function($sp){
        return $sp.hasClass("sp") && $sp.hasClass("closed") && !$sp.hasClass("dead")
    },
    negIntro: function($sp){
        var lastSent = $sp.children().last().find(".x").text()
        return $sp.hasClass("sp") && $sp.hasClass("closed") && !$sp.hasClass("dead") && lastSent=="*"
    },
    exisIntro: function(e){
        return e.hasClass("subs") && e.hasClass("x")
    },
    exisElim: function(e){
        return e.hasClass("subs") && e.hasClass("x")&&e.attr("name")=="exisQuantn"
    },
    univIntro: function($sp){
        return $sp.hasClass("sp") && $sp.hasClass("closed") && !$sp.hasClass("dead") && $sp.children().first().find(".arbConst").length>0
    },
    univElim: function(e){
        return e.hasClass("subs") && e.hasClass("x") && e.attr("name") == "univQuantn"
    },
        
}
/*
    exisIntro: ,
    exisElim: ,
    univIntro: ,
    univElim: ,
*/    
var test2msg = {
    conjIntro: "<div>Select the sentence to conjoin to the green sentence.</div>",
    conjElim: "<div>Select the subsentence that you wish to infer from the conjunction in green.  Either of its conjuncts will do.",
    condElim: "<div>Select the sentence to use with the green conditional for a condElim (Modus Ponens)</div>",
    contIntro: "<div>Select the sentence to use with the green sentence to introduce *.</div",
    disjIntro: "<div>What sentence do you want to infer from the sentence in green?  Type the sentence below.  It must be a disjunction, and the sentence in green must be one of its disjuncts.</div><input id='msgRespInput' type='text'></input><input type='button' value='enter' id='msgRespEnter'></input>",
    contElim: "<div>What sentence do you want to infer from the * in green?  Type a sentence below.</div><input id='msgRespInput' type='text'></input><input type='button' value='enter' id='msgRespEnter'></input>",
    disjElim: "<div>Select the second subproof to use with for disjElim (proof by cases).",
    exisElim: "<div>Select the subproof to use with exisElim.</div>"
}
var test2 = {
    conjIntro: function (e1, e2) {
        return e2.hasClass("x")
    },
    conjElim: function(e1,e2){
        var a = e1.children(".a")
        var b= e1.children(".b")
        return e2[0].id==a[0].id || e2[0].id==b[0].id
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
            var disjunct = wrap(e1).text()
            return e2.children(".a").text()==disjunct||e2.children(".b").text()==disjunct
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
    },
    disjElim: function(a,sp2){
        var e = a.e
        var sp1 = a.sp1
        var sp1Last = wrap(sp1.children().last().find(".x")).text()
        var secondDisjunct = e.children(".b").text()
        var sp2First = sp2.children().first().find(".x")
        sp2First = wrap(sp2First).text()
        var sp2Last = wrap(sp2.children().last().find(".x")).text()
        return secondDisjunct==sp2First&&sp1Last==sp2Last
    },
    exisElim: function(e1,$sp){
        if($sp.hasClass("sp") && $sp.hasClass("closed") && !$sp.hasClass("dead") && $sp.children().first().find(".arbConst").length>0){
            var good = true
            var arbConst = $sp.children().first().find(".arbConst").text()
            $(".indiv").each(function(index,element){
                element = $(element)
                if(element.text() == arbConst){
                    if(!element.parents().is($sp)){
                        good = false
                    }
                }
            })
            if (good == false) {return false}
            var first = $sp.children().first().find(".x").text()
            var subs = e1.children(".subs").text()
            var indiv = e1.children(".indiv").text()
            var re = RegExp(indiv,"g")
            return subs.replace(re, arbConst) == first
        }else{
            return false
        }
        //make sure first line of sp is identical to quantified sentence in e1 (replacing bound variable with arbConst).
    }
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
        r = negate(e)
        r = negate(r)
        r.removeClass("a b x")
        r.addClass(eClass)
        e.replaceWith(r)
        return r
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
    distributionIn: function (e) {
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
    distributionOut: function (e) {
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
    conjElim: function (e1,e2) {
        var r = e2.clone()
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
        e2.addClass('x')
        $("#temp").append(e2)
        return e2
    },
    contElim: function (e1, e2) {
        r = e2.clone()
        r.removeClass("a b")
        r.addClass("x")
        $("#temp").append(r)
        return r
    },
    condIntro: function($sp){
        $sp=$sp.children()
        var a = wrap($sp.first().children(".x").clone())
        var b= wrap($sp.last().children(".x").clone())
        r = operate("cond",a,b)
        r.addClass("x")
        $("#temp").append(r)
        return r
    },
    negIntro: function($sp){
        $sp=$sp.children()
        var a = wrap($sp.first().children(".x").clone())
        r = negate(a)
        r.addClass("x")
        $("#temp").append(r)
        return r
    },
    disjElim: function(a,sp2){
        var sp2Last = sp2.children().last().find(".x")
        var r = sp2Last.clone()
        $("#temp").append(r)
        return r
    },
    reiteration: function(e){
        var r = e.clone()
        $("#temp").append(r)
        return r
    },
    exisIntro: function(e){
        return $("#s"+n+"x")
    },
    exisElim: function(e,$sp){
        var spLast = $sp.children().last().find(".x")
        r = spLast.clone()
        $("#temp").append(r)
        return r
    },
    univIntro: function($sp){
        return $("#s"+n+"x")
    },
    univElim: function(e){
        return $("#s"+n+"x")
    }
}

var quantRule = {
    exisIntro: true,
    //exisElim: true,
    univIntro: true,
    univElim: true
}

var symbols = ["(",")","*","|","&",">","~"]

var checkQuantInf = {
    exisIntro: function(yourAnswer, e){
        var orig = e.text()
        var subs = yourAnswer.children(".subs").text()
        var re = subs
        var variable = yourAnswer.children(".indiv").text()
        for (var i=0;i<symbols.length;i++){
            var sRe = new RegExp("\\"+symbols[i],"g")
            re = re.replace(sRe,"\\"+symbols[i])
        }
        re = re.replace(variable,"([\\141-\\172])")
        var varRegEx = new RegExp(variable,"g")
        re = re.replace(varRegEx, "\\1")
        re = "^" + re + "$"
        re = new RegExp(re)
        if(re.test(orig)){
            return yourAnswer.text()
        }else{
            return false
        }
    },
    exisElim: function(yourAnswer, e){
        //be sure constant neither previously used nor used in conclusion
        var orig = e.text()
        
    },
    univIntro:  function(yourAnswer, e){
        
    },
    univElim:  function(yourAnswer, e){
        yourAnswer = yourAnswer.text()
        var subs = e.children(".subs").text()
        var re = subs
        var variable = e.children(".indiv").text()
        for (var i=0;i<symbols.length;i++){
            var sRe = new RegExp("\\"+symbols[i],"g")
            re = re.replace(sRe,"\\"+symbols[i])
        }
        re = re.replace(variable,"([\\141-\\172])")
        var varRegEx = new RegExp(variable,"g")
        re = re.replace(varRegEx, "\\1")
        re = "^" + re + "$"
        re = new RegExp(re)
        if(re.test(yourAnswer)){
            return yourAnswer
        }else{
            return false
        }
    }
}


///////////////////////end functions for logical operations

