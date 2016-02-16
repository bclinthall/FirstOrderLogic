var citeForLine = 0
var citeData = {
    a:null,
    b:null,
    rule:null
}
var supporting = []
level=1

//l3-4 awaiting Cite stuff
function awaitingCiteL34ooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooo(){;}
function enterCitation(event) { //called when the cite button is clicked. (Levels 3 and 4)
    var id = this.id
    citeForLine = id.slice(10)
    levelStates["L"+level][awaitingRule]()
}

//L2-4 Awaiting Rule stuff
function awaitingRuleL24ooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooo(){;}

function ruleSelectedL24(title,opLevel) {  //
    $("#dispInstructions").text("Select the first sentence to use with " + title + ".")
    citeData.rule = title
    citeData.a = null
    citeData.b = null
    $("#folTable").on("mousemove", ".subs", {'title': title,'opLevel':opLevel}, seekingE1L24)
}

//L1 awaiting E1 stuff
function awaitingE1L1ooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooo(){;}

var oldE1Resp = null

function seekingE1L1(event) { //fires on mousemove over .subs.  Turned on by levelState.
    if (event.shiftKey == 1) {
        var t = this
        if (t != oldE1Resp) {
            $(t).addClass('E1Resp')
            if (oldE1Resp) {
                $(oldE1Resp).removeClass('E1Resp')
            }
            oldE1Resp = t
            setDisplay(t)
            setupOperationsL1(t)
        }
    }
    event.stopPropagation()
}

function seekingE1spL1(event){ //fires on mouse enter over td.closed. Turned on by levelState.
    if (event.shiftKey == 1) {
        $(".subProofHighlight").removeClass("subProofHighlight")
        var cl = $(this).attr("class").split(" ")
        var sp = cl.pop()
        if (sp!='fol'){
            $("."+sp).addClass("subProofHighlight")
            setupOperationsSpL1($("."+sp))
        }
    }
}

function setupOperationsL1(el) {  //called by seekingE1L1.  
    $(".operations.equi").html("")
    $(".operations.introElim").html("")
    for (i in test1) {
        if (test1[i]($(el))) {
            addOperationL1(i, $(el))
        }
    }
}
function setupOperationsSpL1($sp){ //called by seekingE1spL1
    $(".operations.equi").html("")
    $(".operations.introElim").html("")
    for (i in test1sp){
        if(test1sp[i]($sp)){
            addOperationL1(i,$sp)
        }
    }
}
var test1sp = {
    condElim: function($sp){
        return true 
    },
    negIntro: function($sp){
        var lastSent = $sp.last().find(".x").text()
        return lastSent=="*"
    }
}
function addOperationL1(title, e) {
    var opType = ruleType[title]
    $(".operations" + "." + opType).append("<div class='operation " + title + "'>" + title + "</div>")
    $(".operation." + title).on("click", {'title': title,'e': e}, opClickedL1)
}
function opClickedL1(event) { //Called when an op button is clicked, level one.  Assigned by addOperationL1.
    var title = event.data.title
    var e =event.data.e
    processE1L14(title, e, 1)
}

//L2-4 awaiting E1 stuff
function awaitingE1L24ooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooo(){;}

function seekingE1L24(event) {   //fires on mousemove.  setup by 
    var t = this
    var title = event.data.title
    var opLevel=event.data.opLevel
    if (t != oldE1Resp) {
        $(t).addClass('E1Resp')
        if (oldE1Resp) {
            $(oldE1Resp).removeClass('E1Resp')
            $("#folTable").off("click", e1PickedL24)
        }
        $("#folTable").on("click", ".subs", {'title': title,'opLevel':opLevel}, e1PickedL24)
        oldE1Resp = t
        setDisplay(t)
    }
    event.stopPropagation()
}

function e1PickedL24(event) {
    var e = $(this)
    console.log(e)
    var title = event.data.title
    var opLevel = event.data.opLevel
    if (test1[title](e)) {
        citeData.a = e
        e.off("click", e1PickedL24)
        $("#folTable").off("mousemove", seekingE1L24)
        $("#folTable").off("click", e1PickedL24)
        processE1L14(title,e,opLevel)
    } else {
        alert("That sentence or subsentence doesn't work.  Try again.")
    }
}

// e1 found L1-2
function foundE1L14ooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooo(){;}

function processE1L14(title, e, opLevel) { //Called by opClickL1 or e1PickedL2
    citeData.rule = title
    citeData.a = e
    citeData.b = null
    if (test2[title]) { //check to see if another sentence is needed.
        console.log(test2msg[title])
        seekingE2setupL14(test2msg[title],e,opLevel,title)
    } else {
        e = ops[title](e);
        if (e) {
            finish(e,opLevel,title)
        }
    }
}


//L1-L4 awaiting E2 stuff
function awaitingE2L14ooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooo(){;}
function seekingE2setupL14(msg,e,opLevel,title)  {
    console.log(e)
    console.log(title)
    levelStates["L"+level]["awaitingE2"]()
    $("#message").prepend(msg)
    $("#message").prepend("<div class='instructions'>To select an element, role your mouse over it to highlight it, and then click it.</div>")
    if ($("#msgRespEnter").length > 0) {
        $("#msgRespEnter").on("click", {'e': e,'opLevel':opLevel,'title':title}, e2L14Click) //add a listener to the e2responseL14 button (if one was added in msg).
        $("#msgRespInput").on("keydown", function (event) { //add a listener to click #msgRespEnter when the inter key is pressed in #msgRespEnter (if #msgRespEnter and #msgRespEnter were added in msg)
            if (event.keyCode == 13) {
                $("#msgRespEnter").click()
            }
        })
    } else {
        $("#folTable").on("mousemove", ".subs", {'e': e,'opLevel':opLevel, 'title':title}, seekingE2L14)
    }
}

var oldE2Resp = null
var seekingE2L14 = function (event) {  //called on mouseover when seeking e2.  Setup by seekingE2setupL14.
    var e = event.data.e
    var opLevel = event.data.opLevel
    var title=event.data.title
    var t = this
    if (t != oldE2Resp) {
        $(t).addClass("E2Resp")
        if (oldE2Resp) {
            $(oldE2Resp).removeClass("E2Resp")
            $(oldE2Resp).off("click", e2L14Click)
        }
        $(t).on("click", {'e': e,'opLevel':opLevel,'title':title}, e2L14Click)
        oldE2Resp = t
        setDisplay(t)
    }
    event.stopPropagation()
}

function e2L14Click (event){
    var e = event.data.e
    var title = event.data.title
    var opLevel = event.data.opLevel
    //this is the function that will be called when an element is clicked
    //in response to the message.
    var e2 = $(this)
    if (e2.attr('id') == 'msgRespEnter') {
        //if the user entered a new sentence and clicked the enter button,
        //get the string from text input.
        var s = $("#msgRespInput").val()
        //turn it to html. call the result e2.
        e2 = folStringToHtml(s, $("#msgTemp .x"))
        if (e2.length>0) {
            if (test2[title](e, e2)) {
                e = ops[title](e, e2);
                if (e) {
                    finish(e,opLevel,title)
                }
            } else {
                $("#msgTemp").html('<span id="sx0" class = "x subs"></span>')
            }
        } else {
            $("#msgTemp").html('<span id="sx0" class = "x subs"></span>')
        }
    } else {
        if (test2[title](e, e2)) {
            citeData.b = e2
            e = ops[title](e, e2);
            if (e) {
                finish(e,opLevel,title)
            }
        } else {
            alert("that elem doens't work.")
        }
    }
}

//E's found stuff

function foundEsL12ooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooo(){;}

function finish(e,opLevel,title){
    if(opLevel<3){
        infer(e)
    }
    else{
        finishL34(e,title)
    }
    switch(level){
        case 1:
            levelStates.L1.awaitingE1()
            break;
        case 2:
            levelStates.L2.awaitingRule()
            break;
        case 3:
            levelStates.L3.awaitingCite()
            break;
        case 4:
            levelStates.L4.awaitingCite()
            break;
    }
}

function infer(e) {
    var newSentId = "s" + n + "x"
    var nl = $("#"+newSentId)
    if(nl.text()!=""){
        n++
        $("#folTable").append("<tr class='line l" + n + "'><td class='lineNo'>" + n + ".</td><td class = 'fol'><span class='sp'></span><span id='s" + n + "x' class='x subs'></span></td><td class='attribution'></td></tr>")
        for(var i=0;i<liveSps.length;i++){
            $(".l"+n+" .fol").addClass("spId"+liveSps[i])
            $(".l"+n+" .fol .sp").append("<div class='l"+n+"sp"+liveSps[i]+"'><div class='spT'></div><div class='spM'></div></div>")
        }
        newSentId = "s" + n + "x"
        nl = $("#"+newSentId)
    }
    doCitation(e, n)
    var s = e.parents('.fol').find(".x")
    s.attr('id', newSentId)
    addIds(s, newSentId)
    nl.replaceWith(s)
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

function foundEsL34ooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooo(){;}

function finishL34(e, title) {
    var line = citeForLine
    var yourAnswer = $(".l" + line + " * .x").text()
    theAnswer = e.text()
    if ((yourAnswer != theAnswer) && level == 3) {
        if (citeData.b) {
            alert("Line " + line + " does not follow from lines " + lineNum(citeData.a) + " and " + lineNum(citeData.b) + " by " + title + ".")
        } else {
            alert("Line " + line + " does not follow from line " + lineNum(citeData.a) + " by " + title + ".")
        }
        return
    }
    doCitation(e, citeForLine)
    $("#citeButton" + citeForLine).hide()
    $("#opSelect,#opSelectLabel").hide()
    $("#dispInstructions").text("")
    $("#commutation,#association,#removeDblNeg").show()
    $(".sentInfo").text("")
    var cite = $(".l" + citeForLine + " .attribution")
    console.log(cite.data())
}


function foundEsL14ooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooo(){;}

function doCitation(e, line) { //called from finishL34 or from Infer (L1 and L2).
    var cite = $(".l" + line + " .attribution")
    //take care of citation stuff for citeData.a
    var cited = citeData.a
    if(citeData.a.length==1){
        var l1 = lineNum(citeData.a)
        supporting.push(l1)
    } else{
        l1 = lineNum(citeData.a.first())+"-"+lineNume(citeData.a.last())
    }
    cite.append(citeData.rule + " " + l1)
    if (citeData.b) { //take care of citation stuff for citeData.b
        cited = cited.add(citeData.b)
        if(citeData.b.length==1){
            var l2 = lineNum(citeData.b)
            supporting.push(l2)
        } else{
            l2 = lineNum(citeData.b.first())+"-"+lineNume(citeData.b.last())
        }
        if (l2 != "0") {
            cite.append("," + lineNum(citeData.b))
        }
    }
    cite.data({
        rule: citeData.rule,
        a: citeData.a,
        b: citeData.b
    })
    cite.on("mouseenter", function () {
        cited.addClass("cited")
    })
    cite.on("mouseleave", function () {
        cited.removeClass("cited")
    })
}

