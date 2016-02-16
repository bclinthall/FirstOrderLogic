function folStringToHtml(s, div) {
    //s is the string, div is the .x span where it will go.
    var id = div.attr('id')
    s = folStand(s)
    if (illegalCharacters(s, div)) {
        return
    }
    s = newFixNegations(s, 0)
    s = newFixParens(s)
    s = newFixLiterals(s)
    s = fixCont(s)
    s = fixOperators(s)
    s = restoreSymbols(s)
    div.append(s)
    if (div = verifyAndName(div)) {
        addIds(div, id)
    }
    return div
}

function folStand(s) {
    s = s.replace(/\s/g, "")
    s = s.replace(/>/g, "%")
    s = s.toUpperCase()
    return s
}

function illegalCharacters(s, div) {
    s = s.replace(/[0-9]/g, "#")
    var m = s.match(/[^A-Z\~\&\%\|\(\)\*]/g)
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

function newFixNegations(s, i) {
    if (s[i] == "~") { //see what comes after the negation
        //If it's another negation, keep looking (let the loop playthrough).
        //If you come to a literal, wrap it, and look for the next ~
        //If you come to a (, look for its mate, and wrap the
        //    whole thing.Then look for the next ~.
        if (s[i + 1]) {
            for (var j = i + 1; j < s.length; j++) {
                if(s[j]=="~"){  //if you hit another negation, look to next character.
                    continue;
                }
                if(/[\|\&\>\)]/.test(s[j])){
                    //We shouldn't hit a |, &, >, or ) before a literal or (.
                    //If we do, leave things alone.
                    break;
                }
                if (/[A-Z\*]/.test(s[j])) { //we've hit a literal.  Wrap it and seek next ~
                    s = s.slice(0, i) + "<span data-substype='neg' class='subs'>@" + s.slice(i + 1, j + 1) + "</span>" + s.slice(j + 1);
                    break;
                }
                if (s[j] == "(") { //we've hit a parenth.  Look for it's mate.
                    var d = -1
                    for (var k = j + 1; k < s.length; k++) {
                        if (s[k] == "(") {
                            d--
                        }
                        if (s[k] == ")") {
                            d++
                        }
                        if (d == "0") { //we've fount the mate.  Wrap it and seek next ~
                            s = s.slice(0, i) + "<span data-substype='neg' class='subs'>@" + s.slice(i + 1, k + 1) + "</span>" + s.slice(k + 1);
                            break;
                        }
                    }
                    break;
                }
            }
        }
    }
    if (s[i + 1]) {
        s = newFixNegations(s, i + 1)
    }
    return s
}

function newFixParens(s) {
    s = s.replace(/\(/g, "<span class='subs'><span class='lparen'>(</span>")
    s = s.replace(/\)/g, "<span class='rparen'>)</span></span>")
    return s
}
var toChar = String.fromCharCode

function fromChar(str) {
    return str.charCodeAt()
}

function newFixLiterals(s) {
    var m = s.match(/[A-Z]/g)
    if (m) {
        for (var i = 0; i < m.length; i++) {
            s = s.replace(m[i], "<span data-substype='lit' class='subs'>" + fromChar(m[i]) + "</span>")
        }
    }
    return s
}

function fixCont(s) {
    m = s.match(/\*/g)
    if (m) {
        for (var i = 0; i < m.length; i++) {
            s = s.replace(m[i], "<span data-substype='cont' class='subs'>" + fromChar(m[i]) + "</span>")
        }

    }
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
    s = s.replace(/\~/g, "@")
    s = s.replace(/\@/g, "<span class='neg'>~</span>")
    return s
}

function verifyAndName(e) {
    var id = e.attr('id')
    var bad = false
    var lit = e.find("[data-substype='lit'],[data-substype='cont']")

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

    function z(e, substype, ccObj) {
        //takes the element, the substype of sentence,
        //and an object that tells the program which children are a and b subsentences.
        //Assigns the substype, and a and b classes.
        var cs = e.children()
        e.attr('data-substype', substype)
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
            //There are five good subsentence forms: p@q (whole sentence only), p, *, ~p,(p@q),
            //If it has one of those forms, check the parent.
            if (cs.length == 0 && (e.attr('data-substype') == 'lit' || e.attr('data-substype') == 'cont')) {  //If its an only child and a lit or a cont, continue up.
                e = e.parent();
                continue
            }
            if (x(cs, ['subs'])) {
                //Some operations will wrap a sentence in a frivolous element.
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
