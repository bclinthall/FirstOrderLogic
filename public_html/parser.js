/*each sentence is an object.
The object name is the sentence string.
Each object has a 'type' property.  The type of the object is the type of the sentence (negation, conjunction, etc.)
Each object has a subst property which is the simpler sentence(s) that the object is composed of.
The type property has methods, corresponding to the various rules that can be applied to a sentence of that type.
I need a parser function, that first finds the type of the sentence.
Then finds the subsentences,
then finds the type of the subsentences,
and repeats.
I need a validator function that puts things in standard form.
*/

var spId = 0
activeSp = null
var premise = true



function folStringToHtml(s, div) {
    //s is the string, div is the .x span where it will go.
    var id = div.attr('id')
    s = folStand(s)
    if (illegalCharacters(s, div)) {
        return
    }
    //s = newFixNegations(s, 0)
    s = toGreek(s)
    s = fixLiterals(s)
    s = fixIndivs(s)
    s = fixPredicates(s)
    s = wrapQuantifiers(s)
    s = wrapNegations(s)
    s = newFixParens(s)
    s = fixCont(s)
    s = fixOperators(s)
    s = restoreSymbols(s)
    div.append(s)
    fixNegAndQuant(div)
    if (div = verifyAndName(div)) {
        addIds(div, id)
    }
    return div
}

function folStand(s) {
    s = s.replace(/\s/g, "")
    s = s.replace(/>/g, "%")
    return s
}

function illegalCharacters(s, div) {
    s = s.replace(/[0-9]/g, "#")
    var m = s.match(/[^A-Za-z\~\&\%\|\(\)\*\u2200\u2203]/g)
    if (m) {
        for (var i = 0; i < m.length; i++) {
            s = s.replace(m[i], "<span class='error'>" + fromChar(m[i]) + "</span>")
        }
        m = s.match(/[0-9]+/g)
        if (m) {
            for (var i = 0; i < m.length; i++) {
                s = s.replace(m[i], toChar(m[i]))
            }
        }
        s = s.replace(/\%/g, ">")
        div.append(s)
        alert("Illegal characters found.  Delete the sentence and try again.")
        return true
    }
    return false
}


function newFixParens(s) {
    s = s.replace(/\(/g, "<span class='subs'><span class='lparen'>(</span>")
    s = s.replace(/\)/g, "<span class='rparen'>)</span></span>")
    return s
}
var toChar = String.fromCharCode

function fromChar(str) {
    return str.charCodeAt(0)
}
function grkChar(str){
    return toChar(fromChar(str)+848)
}
function latinChar(str){
    toChar(fromChar(str)-848)
}
function toGreek(s){
    var m = s.match(/[A-Za-z]/g)
    if(m){
        for (var i=0;i<m.length;i++){
            s = s.replace(m[i],grkChar(m[i]))
        }
    }
    return s
}

function fixLiterals(s){
    var m = s.match(/[\u0391-\u03AA][\u03b1-\u03CA]*/g)
    if(m){
        for (var i=0;i<m.length;i++){
            s = s.replace(m[i],"<span name='lit' class='subs'>"+m[i]+"</span>")
        }
    }
    return s
}

function fixPredicates(s) {
    var m = s.match(/[\u0391-\u03AA]/g)
    if (m) {
        for (var i = 0; i < m.length; i++) {
            s = s.replace(m[i], "<span name='pred'>" + (fromChar(m[i])-848) + "</span>")
        }
    }
    return s
}


function wrapQuantifiers(s){
    s = s.replace(/[\u2200]/g,"<span class='quantr univQuantr'>"+fromChar("\u2200")+"</span>")
    s = s.replace(/[\u2203]/g,"<span class='quantr exisQuantr'>"+fromChar("\u2203")+"</span>")
    return s
}

function fixIndivs(s) {
    var m = s.match(/[\u03b1-\u03CA]/g)
    if (m) {
        for (var i = 0; i < m.length; i++) {
            s = s.replace(m[i], "<span class='indiv'>" + (fromChar(m[i])-848) + "</span>")
        }
    }
    return s
}

function wrapNegations(s) {
    s = s.replace(/\~/g,"<span class='neg'>"+fromChar("~")+"</span>")
    return s
}

function fixCont(s) {
    s = s.replace(/\*/g,"<span name='cont' class='subs'>"+fromChar("*")+"</span>")
    return s
}

function fixOperators(s) {
    var m = s.match(/[\&\|\%]/g)
    if (m) {
        for (var i = 0; i < m.length; i++) {
            s = s.replace(m[i], "<span class='oper'>" + fromChar(m[i]) + "</span>")
        }
    }
    return s
}

function restoreSymbols(s) {
    m = s.match(/[0-9]+/g)
    if (m) {
        for (var i = 0; i < m.length; i++) {
            s = s.replace(m[i], toChar(m[i]))
        }
    }
    s = s.replace(/\%/g, ">")
    return s
}

function fixNegAndQuant(e) {
    var id = e.attr('id')
    var lit = e.find("[name='lit'],[name='cont']")

    for (var i = 0; i < lit.length; i++) {  //We'll cycle through the literals, and for each literal cycle through its parents.
        e = lit.eq(i)//e is the relevant literal
        while (!(e.hasClass("fol"))) {  //Cycle through the parents till you get to the top.
            var p = e.prev()
            var pp = p.prev()
            if (p.hasClass("neg")){
                var subs = document.createElement("span")
                $(subs).addClass("subs")
                p.before(subs)
                $(subs).append(p, e)
            }else if (p.hasClass("indiv") && pp.hasClass("quantr")){
                var subs = document.createElement("span")
                $(subs).addClass("subs")
                p.before(subs)
                $(subs).append(pp, p, e)                
            }
            e = e.parent()    
        }
    }
}



function verifyAndName(e) {
    var id = e.attr('id')
    var bad = false
    var lit = e.find("[name='lit'],[name='cont']")

    function reject(e, msg, err) {
            if(err){
                err.addClass("error")
            }else{
                e.addClass("error")
            }
            if (msg) {
                alert(msg)
            } else {
                alert("Bad subsentence. \n Delete the sentence and try again.")
            }
        }

    function x(cs, ary) {
        //cs is the children of an element.
        //Ary is an array on the classes the children should have, in order.
        //function x checks to make sure that there are the right number of children
            //and that they have the right classes.
        if (cs.length != ary.length) {
            return false
        }
        for (var i = 0; i < ary.length; i++) {
            if (!(cs.eq(i).hasClass(ary[i]))) {
                return false
            }
        }
        return true
    }

    function z(e, name, ccObj) {
        //takes the element, the name (type) of sentence,
        //and an object that tells the program which children are a and b subsentences.
        //Assigns the name, and a and b classes.
        var cs = e.children()
        if(name){e.attr('name', name)}
        for (var i in ccObj) {
            cs.eq(i).addClass(ccObj[i])
        }
    }
    if(lit.length==0){
        reject(e,"Ungrammatical Sentence.  A grammatical sentence will have at least one literal or contradiction symbol.  Delete Sentence and try again.")
    }
    for (var i = 0; i < lit.length; i++) {  //We'll cycle through the literals, and for each literal cycle through its parents.
        e = lit.eq(i)//e is the relevant literal
        while (!(e.hasClass("fol"))) {  //Cycle through the parents till you get to the top.
            var cs = e.children()
            //There are six good subsentence forms: p|q (whole sentence only), p, *, ~p,(p|q),@ x p
            //If it has one of those forms, check the parent.
            if (e.attr('name') == 'lit' || e.attr('name') == 'cont') {  //If its a lit or a cont, continue up.
                e = e.parent();
                continue
            }
            if (x(cs, ['subs'])) {
                //Some operations may wrap a sentence in a frivolous element.
                //This checks for and corrects the problem.
                if (e.hasClass("x")) {
                    cs.addClass("x")
                }
                cs.attr('id', e.attr('id'))
                e.replaceWith(cs)
                e = cs
                e = e.parent();
                continue
            }
            if (x(cs, ['lparen', 'subs', 'rparen'])) {  //check for useless parenths.
                reject(e, "Useless Parentheses Found.  Delete the sentence and try again.")
                break;
            }
            if (x(cs, ['neg', 'subs'])) {  //check for grammatical neg.
                z(e, 'neg', {
                    1: 'a'
                });
                e = e.parent();
                continue
            }
            if(x(cs, ['quantr','indiv','subs'])) { //check for grammatical quantifications
                var quantr = cs.eq(0).text()
                var typeObj = {
                    "\u2200": "univQuantn",
                    "\u2203": "exisQuantn"
                }
                z(e, typeObj[quantr], {
                    2: 'a'
                }),
                e = e.parent();
                continue
            }
            if (x(cs, ['lparen', 'subs', 'oper', 'subs', 'rparen'])) {  //check for grammatical &, |, or >
                var op = cs.eq(2).text();
                var typeObj = {
                    "&": "conj",
                    "|": "disj",
                    ">": "cond"
                };
                z(e, typeObj[op], {
                    1: 'a',
                    3: 'b'
                })
                e, e = e.parent();
                continue
            }
            if (e.hasClass('x') && x(cs, ['subs', 'oper', 'subs'])) {  //check for grammatical whole sentence &, |, or > w/o parenths.
                var op = cs.eq(1).text();
                var typeObj = {
                    "&": "conj",
                    "|": "disj",
                    ">": "cond"
                };
                z(e, typeObj[op], {
                    0: 'a',
                    2: 'b'
                })
                e = e.parent();
                continue
            }
            
            //All the grammatical possibilities have been covered.
            //Check for what's ungrammatical to taylor message.
            bad = true
            var c = e.children(".oper,.neg")
            if (c.length > 1){
                reject(e, "Ungrammatical Sentence.  Multiple operators in one subsentence.  Delete Sentence and try again.", e.children(".oper,.neg")) 
                break
            }
            var lp =e.children(".lparen")
            var rp =e.children(".rparen")
            if (lp.length!=rp.length){
                reject(e, "Ungrammatical Sentence.  Unbalanced Parentheses.  Delete Sentence and try again.", e.children(".lparen,.rparen"))
                break
            }
            if(e.children(".subs").next(".subs").length>0){
                reject(e, "Ungrammatical Sentence.  Subsentence immediately following another subsentence.  Delete Sentence and try again.", e.children(".subs").next(".subs"))
                break
            }
            reject(e)
            break
        }
        if (bad) {
            break
        }
    }
    if (bad) {
        return false
    } else {
        return $("#" + id)
    }
}



function addIds(e, n) {
    var a = e.children('.a')
    var b = e.children('.b')
    if (a.length > 0) {
        ////console.log(a)
        ////console.log(n+"a")
        a.attr("id", n + "a")
        a.addClass("subs")
        addIds(a, n + "a")
    }
    if (b.length > 0) {
        ////console.log(b)
        ////console.log(n+"b")
        b.attr("id", n + "b")
        b.addClass("subs")
        addIds(b, n + "b")
    }
}
var sym = {
    "conj": "&",
    "disj": "|",
    "cond": ">"
}
//////////////////////End functions for turning fol string to html