var citeForLine = 0
var citeData = {
    a:null,
    b:null,
    rule:null
}
var supporting = []
var oldE1Resp = null
var oldE2Resp = null

//general functions
function setDisplay(){
    return false;
}
function lineNum(e) {
    var id = e[0].id
    var idSplit = id.split("x")
    var first = idSplit[0]
    var num = first.replace("s", "")
    num = parseInt(num)
    return num
}


//L2-4 Awaiting Rule stuff
function awaitingRuleL24ooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooo(){;}

function ruleSelectedL24(title,opLevel) {  //
    $("#dispInstructions").fadeOut('slow',function(){
        $("#dispInstructions").text("Select the first sentence to use with " + title + ".")
        $("#dispInstructions").fadeIn('slow')
        citeData.rule = title
        citeData.a = null
        citeData.b = null
        $(".subs,.sp.closed").off()
        $(".subs,.sp.closed").on("mousemove", {'title': title,'opLevel':opLevel}, seekingE1L24)
        $(".subs,.sp.closed").on("click", {'title': title,'opLevel':opLevel}, e1PickedL24)
    })
}

//L1 awaiting E1 stuff
function awaitingE1L1ooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooo(){;}

function seekingE1L1(event) { //fires on mousemove over .subs or .sp.  Turned on by addStepL[1] in proofFlow.
    if (event.shiftKey == 1) {
        var t = this
        if (t != oldE1Resp) {
            $(".E1Resp").removeClass("E1Resp")
            $(t).addClass('E1Resp')
            oldE1Resp = t
            setDisplay(t)
            setupOperationsL1(t)
        }
    }
    event.stopPropagation()
}

function setupOperationsL1(el) {  //called by seekingE1L1.  
    $(".operations.equi").html("")
    $(".operations.introElim").html("")
    $(".operationsL1").show()
    $("#displayCancel").show()
    for (i in test1) {
        if (test1[i]($(el))) {
            addOperationL1(i, $(el))
        }
    }
}

function addOperationL1(title, e) {
    var opType = ruleType[title]
    if(opType=="equi"){
        $(".operations" + "." + opType).append("<div class='operation " + title + "'>" + title + "</div>")
        $(".operation." + title).on("click", {'title': title,'e': e}, opClickedL1)        
    }else{
        $(".operations" + "." + opType).append("<div class='operation " + title + "'>" + longTitle[title] + "</div>")
        $(".operation." + title).on("click", {'title': title,'e': e}, opClickedL1)
    }
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
        }
        oldE1Resp = t
        setDisplay(t)
    }
    event.stopPropagation()
}

function e1PickedL24(event) {
    event.stopPropagation()
    var e = $(this)
    ////console.log(e)
    var title = event.data.title
    var opLevel = event.data.opLevel
    if (test1[title](e)) {
        citeData.a = e
        e.off("click", e1PickedL24)
        $("*").off("mousemove", seekingE1L24)
        $("*").off("click", e1PickedL24)
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
    processE1L14Ui()
    if(title=="disjElim"){ //disjElim is a special case.
        disjElimSeekingSp1SetUpL14(e,opLevel,title)
    } else if (test2[title]){
    //check to see if another sentence is needed.
       seekingE2setupL14(e,opLevel,title)
    } else {
       e = ops[title](e);
       if (e) {
           finish(e,opLevel,title)
       }
    }
}
function processE1L14Ui(){
    $("#dispInstructions").text("")
    $(".operationsL1").hide()
    $(".equi,.introElim").html("")
    $("*").off("mousemove", seekingE1L1)
    $("*").off("mousemove", seekingE1L24)
    $("*").off("click", e1PickedL24)
}

//L1-L4 awaiting E2 stuff
function awaitingE2L14ooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooo(){;}

//disj Elim sp1 stuff
    function disjElimSeekingSp1SetUpL14(e,opLevel,title){  //called by processE1L14 when title==disjElim
        $("#display2").show("")
        $("#message").prepend("<div>Select the first subproof to use with disjElim.</div>")
        $("#message").prepend("<div class='instructions'>To select an element, role your mouse over it to highlight it, and then click it.</div>")
        $(".subs,.sp.closed").on("mousemove", {'e': e,'opLevel':opLevel, 'title':title}, disjElimSeekingSp1L14)
        $(".subs,.sp.closed").on("click",{'e': e,'opLevel':opLevel, 'title':title}, disjElimSp1L14Click) 
    }

    function disjElimSeekingSp1L14(event){
        var e = event.data.e
        var opLevel = event.data.opLevel
        var title=event.data.title
        var t = this
        if (t != oldE2Resp) {
            $(t).addClass("Sp1Resp")
            if (oldE2Resp) {
                $(oldE2Resp).removeClass("Sp1Resp")
            }
            oldE2Resp = t
            setDisplay(t)
        }
        event.stopPropagation()
    
    }
    function disjElimSp1L14Click(event){
        event.stopPropagation()
        $("#message").html("")
        var e = event.data.e
        var title = event.data.title
        var opLevel = event.data.opLevel
        var sp1 = $(this)
        var a = {}
        a.e=e
        a.sp1=sp1
        if (e.children(".a").text()==wrap(sp1.children().first().find(".x")).text()) {
            processSp1L14Ui()
            citeData.a = a
            seekingE2setupL14(a,opLevel,title)
        } else {
            alert("That subproof doesn't work. You need a subproof whose first line is the same as the first disjunct of your disjunction.  Try again.")
        }
    }
    function processSp1L14Ui(){
        $("*").off("click", disjElimSp1L14Click)
        $("*").off("mousemove",disjElimSeekingSp1L14)
        $("#message").html("")
    }
//end disj Elim sp1 stuff


function seekingE2setupL14(e,opLevel,title)  {
    $("#display2").show("")
    $("#message").prepend(test2msg[title])
    console.log(test2msg[title])
    console.log(opLevel)
    if ($("#msgRespEnter").length > 0) {
        if(title=="disjIntro"){
            $("#msgRespInput").val(wrap(e).text())
        }
        $("#msgRespEnter").on("click", {'e': e,'opLevel':opLevel,'title':title}, e2L14Click) //add a listener to the e2responseL14 button (if one was added in msg).
        $("#msgRespInput").on("keydown", function (event) { //add a listener to click #msgRespEnter when the enter key is pressed in #msgRespEnter (if #msgRespEnter and #msgRespEnter were added in msg)
            if (event.keyCode == 13) {
                $("#msgRespEnter").click()
            }
        })
        if(level>2){
            $("#msgRespInput").val($("#s"+n+"x").text())
            $("#msgRespEnter").click()
        }else{
            $("#msgRespInput").focus()
        }
    } else {
        $("#message").prepend("<div class='instructions'>To select an element, role your mouse over it to highlight it, and then click it.</div>")
        $(".subs,.sp.closed").on("mousemove",{'e': e,'opLevel':opLevel, 'title':title}, seekingE2L14)
        $(".subs,.sp.closed").on("click",{'e': e,'opLevel':opLevel,'title':title}, e2L14Click)
        
    }
}

var seekingE2L14 = function (event) {  //called on mouseover when seeking e2.  Setup by seekingE2setupL14.
    var e = event.data.e
    var opLevel = event.data.opLevel
    var title=event.data.title
    var t = this
    if (t != oldE2Resp) {
        $(t).addClass("E2Resp")
        if (oldE2Resp) {
            $(oldE2Resp).removeClass("E2Resp")
        }
        oldE2Resp = t
        setDisplay(t)
    }
    event.stopPropagation()
}


function e2L14Click (event){    //called on element click when seeking e2.  Setup by seekingE2setupL14.
    event.stopPropagation()
    var e = event.data.e
    var title = event.data.title
    var opLevel = event.data.opLevel
    var e2 = $(this)
    if (e2.attr('id') == 'msgRespEnter') {
        //if the user entered a new sentence and clicked the enter button,
        //get the string from text input.
        var s = $("#msgRespInput").val()
        //turn it to html. call the result e2.
        e2 = folStringToHtml(s, $("#msgTemp .x"))
        if (e2.length>0) {
            if (test2[title](e, wrap(e2))) {
                e = ops[title](e, e2);
                if (e) {
                    finish(e,opLevel,title)
                }
            } else {
                alert(e2Alert[title])
                $("#msgTemp").html('<span id="sx0" class = "x subs"></span>')
            }
        } else {
            $("#msgTemp").html('<span id="sx0" class = "x subs"></span>')
        }
    } else {  //if a .subs or .sp element was clicked
        if (test2[title](e, e2)) {
            citeData.b = e2
            e = ops[title](e, e2);
            if (e) {
                finish(e,opLevel,title)
            }
        } else {
            alert(e2Alert[title])
        }
    }
}
var e2Alert = {
    conjIntro: "A subsentence will not work. \nOne way rules only work on whole sentences and subproofs.  \sIn this case, a subproof won't work either.  Make sure you're not trying to cite something in a closed subproof.\nTry again.",
    conjElim: "You must select one of your conjunction's two conjuncts.  \nAnything deeper in the sentence or in another sentence will not work.\nTry again.",
    condElim: "That sentence or subsentence doesn't work. \nOne way rules only work on whole sentences.  \nYou need a whole sentence that is the same as the antecedent of the conditional in green.  \nA subproof won't work either.  Make sure you're not trying to cite something in a closed subproof.\nTry again.",
    contIntro: "That sentence or subsentence doesn't work. \nOne way rules only work on whole sentences.  \nYou need a whole sentence that is the opposite of the sentence in green (P and ~P are opposites).\nA subproof won't work either.  Make sure you're not trying to cite something in a closed subproof.  \nTry again.",
    disjIntro: "Your sentence must be a disjunction, and one of its disjuncts must be the same as the sentence in green.\nTry again.",
    contElim: "Any well formed sentence will work. \nIf your sentence is well formed, but you're still getting this message, let me know.",
    disjElim: "You need to select a subproof, \n(1) whose first line is the same as second disjunct of the disjunction you've selected and \n(2) whose last line is the same as the last line of the first subproof you've selected.  Try again."

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
}

function infer(e) {
    n++
    activeSp.append("<div class='line l" + n + " cell fol'><span id='s" + n + "x' class='x subs'></span></div>")
    $("#lineNo").append("<div class='line l" + n + " cell'>"+n+".</div>")
    $("#attribution").append("<div class='line l" + n + " cell'><span class='attribution'></span></div>")
    $(".l"+n).find(".x").addClass("working")
    var newSentId = "s" + n + "x"
    var nl = $("#"+newSentId)
    added.push($(".l"+n))
    doCitation(e, n)
    var s = e.parents('.fol').find(".x")
    s.attr('id', newSentId)
    s.addClass("subs")
    addIds(s, newSentId)
    nl.replaceWith(s)
    if(activeSp[0] == $("#folTable")[0]&&wrap(s).text()==wrap($(".conclusion .x")).text()){
        alert("Congratulations! You proved the conclusion!")
    }
    citeUiReset()
    readyForStep()
}

function foundEsL34ooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooo(){;}

function finishL34(e, title) {
    var line = n
    var yourAnswer = wrap($("#s" + line + "x")).text()
    theAnswer = wrap(e).text()
    console.log(yourAnswer)
    console.log(theAnswer)
    if ((yourAnswer != theAnswer) && level == 3) {
        if (citeData.b) {
            alert("Line " + line + " does not follow from lines " + lineNum(citeData.a) + " and " + lineNum(citeData.b) + " by " + title + ".")
        } else {
            alert("Line " + line + " does not follow from line " + lineNum(citeData.a) + " by " + title + ".")
        }
        return
    }else{
        doCitation(e, line)
        $("#citeButton" + citeForLine).hide()
        $("#opSelect,#opSelectLabel").hide()
        $("#dispInstructions").text("")
        $("#commutation,#association,#removeDblNeg").show()
        $(".sentInfo").text("")
        var cite = $(".l" + line + " .attribution")
        
        var s = e.parents('.fol').find(".x")
        if(activeSp[0] == $("#folTable")[0]&&yourAnswer==wrap($(".conclusion .x")).text()){
            alert("Congratulations! You proved the conclusion!")
        }
        citeUiReset()
        readyForStep()
    }    
    ////console.log(cite.data())
}


function foundEsL14ooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooo(){;}

function doCitation(e, line) { //called from finishL34 or from Infer (L1 and L2).
    var cite = $(".l" + line + " .attribution")
    //take care of citation stuff for citeData.a

    if(citeData.a.e){ //we've been dealing with a disjElim.  Handle accordingly.
        var disj = citeData.a.e
        var sp1 = citeData.a.sp1
        var cited = disj
        cited = cited.add(sp1)
        var l1 = lineNum(disj)+","+lineNum(sp1.children().first().find(".x"))+"-"+lineNum(sp1.children().last().find(".x"))        
    }else if(citeData.a.hasClass("sp")){
        var cited = citeData.a
        l1 = lineNum(citeData.a.children().first().find(".x"))+"-"+lineNum(citeData.a.children().last().find(".x"))        
    }else{
        var cited = citeData.a
        var l1 = lineNum(citeData.a)
        supporting.push(l1)
    }
    cite.append(citeData.rule + " " + l1)
    if (citeData.b) { //take care of citation stuff for citeData.b
        cited = cited.add(citeData.b)
        if(citeData.b.hasClass("sp")){
            l2 = lineNum(citeData.b.children().first().find(".x"))+"-"+lineNum(citeData.b.children().last().find(".x"))
        }else{
            var l2 = lineNum(citeData.b)
            supporting.push(l2)   
        }
        if (l2 != "0") {
            cite.append("," + l2)
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
//Need to fix citation function to account for subproof inferences
//need to fix delete line behavior: needs to delete subproof divs.
//we need to fix conjElim
//Need to fix cancel buttons for display and messageBox
//Need to test delete line and edit line buttons

/*Listeners: click: .subs,.sp.closed,#msgRespEnter
                Pick
            mousemove: .subs,.sp.closed
                seekingE1L1, seekingE2L14,disjElimSeekingSp1L14
*/