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

function bodyLoaded() {
    $("#formula,#done,#cancelAdd,#addLine,.spButton,#deleteLast,#editLine").hide()
    n=0
    $("#formula").text("")
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
                    var d = -1
                    for (var k = j + 1; k < s.length; k++) {
                        if (s[k] == "(") {
                            d--
                        }
                        if (s[k] == ")") {
                            d++
                        }
                        if (d == "0") { //we've fount the mate.  Wrap it and seek next ~
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




//add premise stuff
var added=[]
function addPremise(){
    $("#addPremise,#addConclusion,#deleteLast,#editLine").hide()
    $("#formula").show();$("#formula").focus()
    $("#formula").on('keydown',formulaPremiseKeydown)
    $("#formula").on('input',formulaPremiseOrLineInput)
    $("#done").show()
    $("#done").on('click',premiseDone)
    $("#cancelAdd").show()
    $("#cancelAdd").on('click',premiseCancel)
    n++
    $("#folTable").append("<tr class='line l" + n + "'><td class='lineNo'>" + n + ".</td><td class = 'fol'><span id='s" + n + "x' class='x subs'></span></td><td class='attribution'></td></tr>")
    var div = $(".l"+n)
    div.find(".x").addClass("working")
    added.push(div)
}
function premiseDone(){
    $(".working").removeClass("working")
    var s = $("#formula").val()
    if (s) {
        $("#addPremise,#addConclusion,#deleteLast,#editLine").show()
        $("#formula").hide()
        $("#formula").off()
        $("#formula").val("")
        $("#done").hide()
        $("#done").off()
        $("#cancelAdd").hide()
        $("#cancelAdd").off()
        var div = $('#s' + n + 'x')
        div.text("")
        div = folStringToHtml(s, div)
    }
    
}
function premiseCancel(){
    $(".l"+n).remove()
    added.pop()
    n--
    $("#addPremise,#addConclusion,#deleteLast,#editLine").show()
    $("#formula").hide()
    $("#formula").off()
    $("#formula").val("")
    $("#done").hide()
    $("#done").off()
    $("#cancelAdd").hide()
    $("#cancelAdd").off()
}
function formulaPremiseKeydown(event){
    if (event.keyCode == 13) {
        premiseDone()
    }
}
function formulaPremiseOrLineInput(){
        $(".l"+n).find(".x").text($("#formula").val())
}
//add conclusion stuff
function addConclusion(){
    $("#addPremise,#addConclusion,#deleteLast,#editLine").hide()
    $("#formula").show();$("#formula").focus()
    $("#formula").on('keydown',formulaConclusionKeydown)
    $("#formula").on('input',formulaConclusionInput)
    $("#done").show()
    $("#done").on('click',conclusionDone)
    $("#cancelAdd").show()
    $("#cancelAdd").on('click',conclusionCancel)
    $(".l"+n).find(".attribution").append("<span id='conclusion' class='fol'><span class='x subs'></span></span></td></tr>")
    $("#conclusion").addClass("working")
    added.push($("#conclusion"))
}
function conclusionDone(){
    $(".working").removeClass("working")
    var s = $("#formula").val()
    if (s) {
        $("#addLine,#deleteLast,#editLine").show()
        premise=false
        $("#formula").hide()
        $("#formula").off()
        $("#formula").val("")
        $("#done").hide()
        $("#done").off()
        $("#cancelAdd").hide()
        $("#cancelAdd").off()
        var div = $('#conclusion .x')
        div.text("")
        div = folStringToHtml(s, div)
        levelStates.L1.awaitingE1()
            }
    
}
function conclusionCancel(){
    $("#conclusion").remove()
    added.pop()
    $("#addPremise,#addConclusion,#deleteLast,#editLine").show()
    $("#formula").hide()
    $("#formula").off()
    $("#formula").val("")
    $("#done").hide()
    $("#done").off()
    $("#cancelAdd").hide()
    $("#cancelAdd").off()
}
function formulaConclusionKeydown(event){
    if (event.keyCode == 13) {
        conclusionDone()
    }
}
function formulaConclusionInput(){
        $("#conclusion .x").text($("#formula").val())
}
//Add line stuff
function addLine(){
    levelStates.L1.awaitingE1()
    $("#addLine,#deleteLast,#editLine").hide()
    //$("#formula").show();$("#formula").focus()                            //Varies by level
    //$("#formula").on('keydown',formulaLineKeydown)  
    //$("#formula").on('input',formulaPremiseOrLineInput)
    //$("#done").show()
    //$("#done").on('click',lineDone)                 
    $(".spButton").show()
    $("#cancelAdd").show()
    $("#cancelAdd").on('click',lineCancel)
    n++
    $("#folTable").append("<tr class='line l" + n + "'><td class='lineNo'>" + n + ".</td><td class = 'fol'><span class='sp'></span><span id='s" + n + "x' class='x subs'></span></td><td class='attribution'></td></tr>")
    for(var i=0;i<liveSps.length;i++){
        $(".l"+n+" .fol").addClass("spId"+liveSps[i])
        $(".l"+n+" .fol .sp").append("<div class='l"+n+"sp"+liveSps[i]+"'><div class='spT'></div><div class='spM'></div></div>")
    }
    $(".l"+n).find(".x").addClass("working")
    added.push($(".l"+n))
}
function lineDone(){
    $(".working").removeClass('working')
    var s = $("#formula").val()
    if (s) {
        levelStates.L1.awaitingE1()
        $("#addLine,#deleteLast,#editLine").show() 
        $("#formula").hide()
        $("#formula").off()
        $("#formula").val("")
        $("#done").hide()
        $("#done").off()
        $(".spButton").hide()
        $("#cancelAdd").hide()
        $("#cancelAdd").off()
        var div = $('#s' + n + 'x')
        div.text("")
        div = folStringToHtml(s, div)
    }
    
}
function lineCancel(){
    $(".l"+n).remove()
    added.pop()
//update liveSp
    var prev = $(".l"+(n-1)).find(".fol")
    var prevClass = prev.attr("class")
    prevClass=prevClass.split(" ")
    for(var i = 1;i<prevClass.length;i++){
        liveSps=[]
        liveSps.push(prevClass[i])
        console.log(liveSps)
    }
    n--
    $("#addLine,#deleteLast,#editLine").show() 
    $("#formula").hide()
    $("#formula").off()
    $("#formula").val("")
    $("#done").hide()
    $("#done").off()
    $(".spButton").hide()
    $("#cancelAdd").hide()
    $("#cancelAdd").off()
    levelStates.L1.awaitingE1()
}
function formulaLineKeydown(event){
    if (event.keyCode == 13) {
        lineDone()
    }
}

//line management functions
function deleteLast(){
    console.log(added)
    var last = added.pop()
    if(premise==false){
        var prev = $(".l"+(n-1)).find(".fol")
        var prevClass = prev.attr("class")
        prevClass=prevClass.split(" ")
        for(var i = 1;i<prevClass.length;i++){
            liveSps=[]
            liveSps.push(prevClass[i])
            console.log(liveSps)
        }
    }
    if(last[0].id=="conclusion"){
        premise=true
        $("#addLine").hide()
        $("#addPremise,#addConclusion").show()
        levelStates.L1.premises()
    }else{
        n--
        levelStates.L1.awaitingE1()
    }
    
    last.remove()
}
function editLine(){
    //add edit instructions.
    $(".instructions.special").text("Click a sentence to edit it.  Only sentences that have not been used to support other sentences are available for editing.")
    $("#addPremise,#addConclusion,#addLine,#deleteLast,#editLine").hide()
    $("#cancelAdd").show()
    $("#cancelAdd").on('click',editCancel)
    //add a mouseover listener to highlight elements available for editing.
    var eligible = $(".x")
    for (var i = 0;i<supporting.length;i++){
        eligible = eligible.not("#s"+supporting[i]+"x")
    }
    eligible.on("mouseenter",function(){
        $(this).addClass("toEdit")    
    })
    eligible.on("mouseleave",function(){
        $(this).removeClass("toEdit")
    })
    eligible.on("click",editLine2)
    //add a click listener proceed with editing
    
}
function editLine2(event){
    //remove edit instructions.
    $(".instructions.special").text("")
    //remove listeners
    var eligible = $(".x")
    eligible.off()
    $(".toEdit").removeClass('toEdit')
    //add working class
    //show formula bar, cancel, etc.  It's basically like a line add.
    $("#formula").val($(this).text())
    $("#formula").show();$("#formula").focus()
    $("#formula").on('keydown',{'elem':$(this)},formulaEditKeydown)
    $("#done").show()
    $("#done").on('click',{'elem':$(this)},editDone)
}
function editDone(event){
    var s = $("#formula").val()
    if (s) {
        var div=event.data.elem
        if(premise){
            $("#addPremise,#addConclusion,#deleteLast,#editLine").show()
        }else{
            $("#addLine,#deleteLast,#editLine").show()
        }
        $("#formula").hide()
        $("#formula").off()
        $("#formula").val("")
        $("#done").hide()
        $("#done").off()
        $("#cancelAdd").hide()
        $("#cancelAdd").off()
        div.text("")
        div = folStringToHtml(s, div)
    }  
}
function editCancel(event){
    
    $("#addPremise,#addConclusion,#deleteLast,#editLine").show()
    if(premise){
        $("#addPremise,#addConclusion,#deleteLast,#editLine").show()
    }else{
        $("#addLine,#deleteLast,#editLine").show()
    }
    $("#formula").hide()
    $("#formula").off()
    $("#formula").val("")
    $("#done").hide()
    $("#done").off()
    $("#cancelAdd").hide()
    $("#cancelAdd").off()
    var eligible = $(".x")    
    eligible.off()
    $(".toEdit").removeClass('toEdit')
}
function formulaEditKeydown(event){
    console.log("edit keydown")
    console.log(event.keyCode)
    if (event.keyCode == 13) {
        editDone(event)
    }
}


//////////////////////////////////////////////Old crap

function newSubProof(){
    spId++
    liveSps.push(spId)
    var lNum = n
    var thisSp = spId
    $(".l"+lNum+" .fol").addClass("spId"+spId)
    $(".l"+lNum+" .fol .sp").append("<div class='l"+lNum+"sp"+spId+"'><div class='spT'></div><div class='spM'></div></div>")
    $(".l"+lNum+"sp"+thisSp+" .spT").hide()
    $("#formula").show();$("#formula").focus()                   //varies by level
    $("#formula").on('keydown',formulaLineKeydown)  
    $("#formula").on('input',formulaPremiseOrLineInput)
    $("#formula").focus()
    $("#done").show()
    $("#done").on('click',lineDone)                             //end varies by level
    $("#newSubProof").hide()
    $("#edSp").show()
}
function endSp(){
    var lNum = n
    var thisSp = liveSps.pop()
    $(".spId"+thisSp).find(".subs").removeClass('subs')
    $(".spId"+thisSp).removeClass('closed')
    $(".l"+lNum+"sp"+thisSp).remove()
    $("#formula").focus()
    $("#endSp").hide()
    $("#newSubProof").show()
}
//we need an array of closed subproofs 

