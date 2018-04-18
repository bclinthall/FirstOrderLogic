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
var liveSps = []
var premise = true

function test() {
    document.getElementById("formula").value = "(A|B)>(A&D)"
    $(".fol").on("mouseenter",function(event){
        var cl = $(this).attr("class").split(" ")
        var sp = cl[cl.length-1]
        if (sp!='fol'){
            $("."+sp).addClass("subProofHighlight")
        }
    })
    $('.fol').on('mouseleave',function(event){
        $('.fol').removeClass("subProofHighlight")
    })
}
String.prototype.replaceAt = function (index, x) {
    return this.substr(0, index) + x + this.substr(index + x.length);
}

function bodyLoaded() {
    document.getElementById("levelSelect").selectedIndex = 0
    $("input").attr("disabled", true)
    $("#levelSelect").attr("disabled", false)
}

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
        //If it's another connector, keep looking (let the loop playthrough).
        //If you come to a literal, wrap it, and look for the next ~
        //If you come to a (, look for its mate, and wrap the
        //    whole thing.Then look for the next ~.
        if (s[i + 1]) {
            for (var j = i + 1; j < s.length; j++) {
                if (/[A-Z]/.test(s[j])) { //we've hit a literal.  Wrap it and seek next ~
                    s = s.slice(0, i) + "<span name='neg' class='subs'>@" + s.slice(i + 1, j + 1) + "</span>" + s.slice(j + 1);
                    break;
                }
                if (s[j] == "(") { //we've hit a parenth.  Look for it's mate.
                    var n = -1
                    for (var k = j + 1; k < s.length; k++) {
                        if (s[k] == "(") {
                            n--
                        }
                        if (s[k] == ")") {
                            n++
                        }
                        if (n == "0") { //we've fount the mate.  Wrap it and seek next ~
                            s = s.slice(0, i) + "<span name='neg' class='subs'>@" + s.slice(i + 1, k + 1) + "</span>" + s.slice(k + 1);
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
            s = s.replace(m[i], "<span name='lit' class='subs'>" + fromChar(m[i]) + "</span>")
        }
        m = s.match(/[0-9]+/g)
        if (m) {
            for (var i = 0; i < m.length; i++) {
                s = s.replace(m[i], toChar(m[i]))
            }
        }
    }
    return s
}

function fixCont(s) {
    m = s.match(/\*/g)
    if (m) {
        for (var i = 0; i < m.length; i++) {
            s = s.replace(m[i], "<span name='cont' class='subs'>" + fromChar(m[i]) + "</span>")
        }
        m = s.match(/[0-9]+/g)
        if (m) {
            for (var i = 0; i < m.length; i++) {
                s = s.replace(m[i], toChar(m[i]))
            }
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
        m = s.match(/[0-9]+/g)
        if (m) {
            for (var i = 0; i < m.length; i++) {
                s = s.replace(m[i], toChar(m[i]))
            }
        }
    }
    return s
}

function restoreSymbols(s) {
    s = s.replace(/\%/g, ">")
    s = s.replace(/\@/g, "<span class='neg'>~</span>")
    return s
}

function verifyAndName(e) {
    var id = e.attr('id')
    var bad = false
    var lit = e.find("[name='lit'],[name='cont']")

    function reject(e, msg) {
            e.addClass("error")
            if (msg) {
                alert(msg)
            } else {
                alert("Bad subsentence. \n Delete the sentence and try again.")
            }
        }

    function x(cs, ary) {
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

    function y(e, type) {
        //console.log(e.text()+", "+type)
    }

    function z(e, name, ccObj) {
        var cs = e.children()
        e.attr('name', name)
        for (var i in ccObj) {
            cs.eq(i).addClass(ccObj[i])
        }
    }
    for (var i = 0; i < lit.length; i++) {
        //console.log("======new lit")
        e = lit.eq(i)
        while (!(e.hasClass("fol"))) {
            var cs = e.children()
            //There are five good subsentence forms: p|q (whole sentence only), p, (p),~p,(p|q),
            //If it has one of those forms, check the parent.
            if (cs.length == 0 && (e.attr('name') == 'lit' || e.attr('name') == 'cont')) {
                y(e, 'lit');
                e = e.parent();
                continue
            }
            if (x(cs, ['subs'])) {
                y(e, 'oneSubsentence');
                if (e.hasClass("x")) {
                    cs.addClass("x")
                }
                cs.attr('id', e.attr('id'))
                e.replaceWith(cs)
                e = cs
                e = e.parent();
                continue
            }
            if (x(cs, ['lparen', 'subs', 'rparen'])) {
                y(e, 'uselessParens');
                reject(e, "Useless Parentheses Found.  Delete the sentence and try again.")
                break;
            }
            if (x(cs, ['neg', 'subs'])) {
                y(e, 'neg');
                z(e, 'neg', {
                    1: 'a'
                });
                e = e.parent();
                continue
            }
            if (x(cs, ['lparen', 'subs', 'oper', 'subs', 'rparen'])) {
                y(e, 'oper');
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
            if (e.hasClass('x') && x(cs, ['subs', 'oper', 'subs'])) {
                y(e, 'topOper');
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
            bad = true
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
        //console.log(a)
        //console.log(n+"a")
        a.attr("id", n + "a")
        addIds(a, n + "a")
    }
    if (b.length > 0) {
        //console.log(b)
        //console.log(n+"b")
        b.attr("id", n + "b")
        addIds(b, n + "b")
    }
}
var sym = {
    "conj": "&",
    "disj": "|",
    "cond": ">"
}
//////////////////////End functions for turning fol string to html
///////////////////////functions for UI management


function deleteLastLine() {
    n--;
    var thisSp = liveSps[liveSps.length-1]
    var spFirst = $(".spId"+thisSp).first()[0]
    var toDelete = $(".l" + (n) + " .fol")[0]
    //end subproof if its first line is deleted.
    if(spFirst==toDelete){
        spId--;
        endSp();
    }
    console.log("spId: "+spId)
    $(".l" + (n)).remove()
    addDelete(n - 1)
    supporting.splice(supporting.indexOf(n), 1)
    for (var i = 1; i <= n; i++) {
        if (supporting.indexOf(i) == -1) {
            showEdit(i)
        }
    }
    //Reopen subproof if appropriate
    var cl = $("td.fol").last()[0].className
    cl = cl.split(" ")
    cl = cl[(cl.length-1)]
    if(liveSps.indexOf(cl)==-1){
        liveSps.push(cl);
        $("."+cl).find(".x,.a,.b").addClass('subs')
    }

}

function addEdit(m) {
    $(".l" + m + " .edit").append("<input type='button' name='d" + m + "x' value='edit' class='editButton' onClick='editLine(" + m + ")'></input>")
}

function hideEdit(m) {
    $(".l" + m + " .editButton").hide()
}

function showEdit(m) {
    $(".l" + m + " .editButton").show()
}

function addDelete(m) {
    $(".l" + m + " .delete").append("<input type='button' name='d" + m + "x' value='delete' class='deleteButton' onClick='deleteLastLine()'></input>")
}

function removeDelete(m) {
    $(".l" + m + " .deleteButton").remove()
}

function editLine(m) {
    if ($(".l" + m + " .editInput").length == 0) {
        $(".l" + m + " .editCell").append("new Formula: <input type=text class='formula' value='" + $("#s" + m + "x").text() + "'></input><input type='button' value='done' class='doneEditing' onClick='doneEditing(" + m + ")'></input>")
    }
}

function doneEditing(m) {
    var p = $(".l" + m + " .fol")
    p.html("<span id='s" + m + "x' class='x subs'></span>")
    var f = p.children()
    var s = $(".l" + m + " .editInput").val()
    folStringToHtml(s, f)
    $(".l" + m + " .editCell").html("")
}
function formulaKeyDown(event) {
    if (event.keyCode == 13) {
        addLinePremise()
    }
}

function formulaInput(event){
    var lineNum = n-1
    $(".l"+lineNum).find(".x").text($("#formula").val())
}


function setDisplay(e) {  //sends element info to .sentInfo div's.
    var txt = $(e).text()
    var type = $(e).attr("name")
    var subsentId = e.id
    $(".subsent").text(txt)
    $(".subsentType").text(type)
    $(".subsentId").text(e.id)
}
function displayCancel(){
    switch(level) {
        case 1:
            levelStates.L1.awaitingE1()
            break;
        case 2:
            levelStates.L2.awaitingRule()
            break;
        case3:
            levelStates.L3.awaitingCite()
            break;
        case4:
            levelStates.L3.awaitingCite()
    }
}

function lineNum(e) {
    var id = e[0].id
    var idSplit = id.split("x")
    var first = idSplit[0]
    var num = first.replace("s", "")
    num = parseInt(num)
    return num
}

function newLine() {
    var a = $("#folTable").append("<tr class='line l" + n + "'><td class='edit'><td class='lineNo'>" + n + ".</td><td class = 'fol'><span class='sp'></span><span id='s" + n + "x' class='x subs'></span></td><td class='attribution'><td><td class='delete'></td><td class='editCell'></td></tr>")
    for(var i=0;i<liveSps.length;i++){
        $(".l"+n+" .fol").addClass("spId"+liveSps[i])
        $(".l"+n+" .fol .sp").append("<div class='l"+n+"sp"+liveSps[i]+"'><div class='spT'></div><div class='spM'></div></div>")
    }
    var e = $('#s' + (n-1) + 'x')
    if ((level == 3 || level == 4) && n!=1) {
        $(".l" + n + " .attribution").append("<input type='button' value='cite' id='citeButton" + n + "'>")
        $("#citeButton" + n).click(enterCitation)
    }
    addDelete(n)
    if (n > 1) {
        removeDelete(n - 1)
    }
    n++
    return e
}
function addLinePremise(){
    if(premise){
        addPremise()
    }else{
        addLine()
    }
}
function addLine() {
    $(".l"+(n-1)).find(".x").text("")
    var div = newLine()
    addEdit(n - 1)
    var s = $("#formula").val()
    $("#formula").val("")
    if (s) {
        div = folStringToHtml(s, div)
    }
}
function addPremise(){
    $(".l"+(n-1)).find(".x").text("")
    var a = $("#folTable").append("<tr class='line l" + n + "'><td class='edit'><td class='lineNo'>" + n + ".</td><td class = 'fol'><span class='sp'></span><span id='s" + n + "x' class='x subs'></span></td><td class='attribution'><td><td class='delete'></td><td class='editCell'></td></tr>")
    var e = $('#s' + (n-1) + 'x')
    addDelete(n)
    if (n > 1) {
        removeDelete(n - 1)
    }
    n++
    addEdit(n - 1)
    var s = $("#formula").val()
    $("#formula").val("")
    if (s) {
        e = folStringToHtml(s, e)
    }
}
function newSubProof(){
    spId++
    liveSps.push(spId)
    var lNum = n-1
    var thisSp = spId
    $(".l"+lNum+" .fol").addClass("spId"+spId)
    $(".l"+lNum+" .fol .sp").append("<div class='l"+lNum+"sp"+spId+"'><div class='spT'></div><div class='spM'></div></div>")
    $(".l"+lNum+"sp"+thisSp+" .spT").hide()
    $("#formula").focus()
}
function endSp(){
    var lNum = n-1
    var thisSp = liveSps[(liveSps.length-1)]
    liveSps.splice((liveSps.length-1),1)
    $(".spId"+thisSp).find(".subs").removeClass('subs')
    $(".l"+lNum+"sp"+thisSp).remove()
    $("#formula").focus()
}
function reopenSp(){

}

//Subproof highlight.
function highlightSubproofs(){
    $(".fol").on("mouseenter",function(event){
        var cl = $(this).attr("class").split(" ")
        var sp = cl[cl.length-1]
        if (sp!='fol'){
            $("."+sp).addClass("subProofHighlight")
        }
    })
    $('.fol').on('mouseleave',function(event){
        $('.fol').removeClass("subProofHighlight")
    })
}
function endBeginSubProof(){
    endSp()
    newSubProof()
}