var level = 0 
var added=[]
var activeSp = null
var n = 0
var premise = true 

function bodyLoaded() {
    initialUi()
    $(".help").hide()
    n=0
    activeSp = $("#folTable")
    checkCookie()
    $("#studentName").on("input",function(){
        setCookie("username",$("#studentName").val(),365);
        ////console.log($("#studentName").val())
    })
    setLevel()
    
    document.addEventListener("input",function(e){
        var inp = e.target
        var val = inp.value
        if(val.indexOf("}")>-1||(val.indexOf("@")>-1)){
            val = val.replace("}","\u2203")
            val = val.replace("@","\u2200")
        }
        inp.value = val
    })

}

//general functions
function listenersOff(){
    $("#formula").off()
    $("#formula").val("")
    $(".done").off()
    $(".cancelAdd").off()
    
}

function initialUi(){
        listenersOff()
        $("#addPremise,#addConclusion,#editLine").show()
        $("#formula,.done,.cancelAdd,.spButton,.addConst,#addLine").hide()
        $("#formula").val("")
        $("#addPremise").focus()
        if(added[0]){
            $(".changeLast").show()
        }else{
            $(".changeLast").hide()
        }
        $("#dispInstructions").text("Click 'add premise' or 'add conclusion'.")
        $("#addPremise").focus()
}

function addLine(){
    n++
    activeSp.append("<div class='line l" + n + " cell fol'><span id='s" + n + "x' class='x subs'></span></div>")
    $("#lineNo").append("<div class='line l" + n + " cell'>"+n+".</div>")
    $("#attribution").append("<div class='line l" + n + " cell'><span class='attribution'></span></div>")
    var div = $(".l"+n)
    div.find(".x").addClass("working")
    added.push($(".l"+n))
}

//listeners
function formulaKeyup(event){
    event.stopPropagation()
    if (event.keyCode == 13) {
        $(".done").click()
    }
}
function formulaPremiseOrLineInput(){
        $(".l"+n).find(".x").text($("#formula").val())
}

function formulaConclusionInput(){
        $(".conclusion .x").text($("#formula").val())
}



//add premise stuff

function addPremiseUi(){
    listenersOff()
    $("#addPremise,#addConclusion,.changeLast,#editLine").hide()
    $("#formula").show();$("#formula").focus()
    $("#formula").on('input',formulaPremiseOrLineInput)
    $(".done").show()
    $(".done").on('click',premiseDone)
    $(".cancelAdd").show()
    $(".cancelAdd").on('click',premiseCancel)
    $("#dispInstructions").text("Type the premise you wish to add, then click 'done' or press 'enter'")
}
function addPremise(){
    addPremiseUi()
    addLine()
}

function premiseDone(event){
    event.stopPropagation()
    var s = $("#formula").val()
    if (s) {
        $(".working").removeClass("working")
        initialUi()
        var div = $('#s' + n + 'x')
        div.text("")
        div = folStringToHtml(s, div)
    }   
}
function premiseCancel(){
    var last = added.pop()
    last.remove()
    n--
    initialUi()
}

//conclusion stuff



function addConclusionUi(){
    listenersOff()
    $("#addPremise,#addConclusion,.changeLast,#editLine").hide()
    $("#formula").show();$("#formula").focus()
    $("#formula").on('input',formulaConclusionInput)
    $(".done").show()
    $(".done").on('click',conclusionDone)
    $(".cancelAdd").show()
    $(".cancelAdd").on('click',conclusionCancel)
    $("#dispInstructions").text("Type the conclusion, then click 'done' or press 'enter'")
}


function addConclusion(){
    addConclusionUi()
    $(".l"+n).find(".attribution").append("<div class='conclusion line l" + n + " cell fol'><span class='x subs'></span></div>")
    $(".conclusion").addClass("working")
    added.push($(".conclusion"))
}
function conclusionDone(){
    var s = $("#formula").val()
    if (s) {
        $(".working").removeClass("working")
        premise=false
        var div = $('.conclusion .x')
        div.text("")
        div = folStringToHtml(s, div)
        $(".conclusion").find(".subs").removeClass("subs")
        readyForStep() 
    }
}
function conclusionCancel(){
    var last = added.pop()
    last.remove()
    initialUi()
}


//adding steps
function citeUiReset(){
    $(".sentInfo").text("")
    $("#temp").html("")
    $("#msgTemp").html("<span id='sx0' class = 'x subs'></span>")
    citeData.rule = null
    citeData.a = null
    citeData.b = null
    //display 1/E1 stuff
    $("#dispInstructions").text("")
    $(".operationsL1").hide()
    $(".operationsL24").hide()
    $(".operationsEasy").hide()
    $(".equi,.introElim").html("")
    $("#displayCancel").hide()
    $("*").off("mousemove", seekingE1L1)
    $("*").off("mousemove", seekingE1L24)
    $("*").off("click", e1PickedL24)
    $(".E1Resp").removeClass("E1Resp")
    oldE1Resp = null
    //display 2/E2 stuff
    $("#display2").hide("")
    $("#message").html("")
    $("*").off("mousemove",seekingE2L14)
    $("*").off("mousemove",disjElimSeekingSp1L14)
    $(".E2Resp").removeClass("E2Resp")
    $(".Sp1Resp").removeClass("Sp1Resp")
    $("*").off("click",e2L14Click)
    $("*").off("click",disjElimSp1L14Click)
    $(".addConst").hide()
    oldE2Resp = null
}

function readyForStep(){
    listenersOff()
    $("#newSubProof,.changeLast,#editLine").show()
    if(activeSp[0] == $("#folTable")[0]){
        $("#endSp").hide()
    }else{
        $("#endSp").show()
    }
    citeUiReset()
    readyForStepL[level]()
}

var readyForStepL = [
    function(){return false},
    function(){     //level 1
        //offs
        $("#formula").hide()
        $("#formula").val("")
        $(".done").hide()
        $(".cancelAdd").hide()
        
        //ons
        $(".subs,.sp.closed").on("mousemove", seekingE1L1)
        $("#dispInstructions").text("Hold 'shift' key and roll your mouse over sentences to highligh the first sentence, subsentence, or subproof you wish to use for an inference.  Then release 'shift' and click the inference rule you wish to use.").hide().fadeIn("slow")
    },
    function(){     //level 2
        //offs
        $("#formula").hide()
        $("#formula").val("")
        $(".done").hide()
        $(".cancelAdd").hide()
        //ons
        $(".operationsL24").show()
        $("#displayCancel").show()
        $("#dispInstructions").text("Select the rule you wish to use below, then click with your mouse to select the first sentence, subsentence, or subproof you wish to use for an inference.").hide().fadeIn("slow")
        $(".ui-combobox-input").val("").focus()
    },
    function(){     //level 3
        addLineUi()
        addLine()
    },
    function(){     //level 4
        
    },
]

function lineDone(){
    var s = $("#formula").val()
    if (s) {
        $(".working").removeClass('working')
        var div = $('#s' + n + 'x')
        div.text("")
        div = folStringToHtml(s, div)
        lineDoneL[level]()
    }
}

var lineDoneL = [
    function(){return false},
    function(){     //level 1
        readyForStep()
    },
    function(){     //level 2
        readyForStep()
    },
    function(){     //level 3
        addCiteUi()
    },
    function(){     //level 4
        addCiteUi()
    }
]

function lineCancel(){
    deleteLast()
    readyForStep()    
}

function addLineUi(){
    listenersOff()
    citeUiReset()
    $("#dispInstructions").text("Type the sentence to add for the next line and press 'done' or 'enter'.").hide().fadeIn("slow")
    $("#addPremise,#addConclusion,.addConst,.changeLast,#editLine").hide()
    $("#formula").show();
    $("#formula").val("");
    $("#formula").focus()
    $("#formula").on('input',formulaPremiseOrLineInput)
    $(".cancelAdd").hide()
    $(".done").show()
    $(".done").on('click',lineDone)
    $(".changeLast").show()
}

function addCiteUi(){
    listenersOff()
    citeUiReset()
    $(".operationsL24").show()
    $(".ui-combobox-input").val("").focus()
    $("#displayCancel").show()
    $("#dispInstructions").text("In the box below, select the rule you've used in your inference.").hide().fadeIn("slow")
    $("#addPremise,#addConclusion,#editLine,#formula,.done,.cancelAdd,.spButton,#addLine,.changeLast").hide()
    $("#formula").val("")    
}

//subproof stuff

function newSubProof(){
    if(level>2){
        var last = added.pop()
        n--
        last.remove()
    }
    spId++
    var lNum = n
    var thisSp = spId
    activeSp.append("<div class='sp' id='spId"+spId+"'></div>")
    activeSp = $("#spId"+spId)
    $(".spButton").hide()
    addSpPremiseUi()
    addLine()
    added.push(activeSp)
}

function addSpPremiseUi(){
    listenersOff()
    $("#addPremise,#addConclusion,.changeLast,#editLine").hide()
    $("#formula").show();$("#formula").focus()
    $("#formula").on('input',formulaPremiseOrLineInput)
    $(".done").show()
    $(".done").on('click',spPremiseDone)
    $(".cancelAdd").show()
    $(".cancelAdd").on('click',spPremiseCancel)
    $(".addConst").show()
}
function spPremiseCancel(){
    var last = added.pop()
    n--
    activeSp = last.parent()
    var l = added.pop()
    l.remove()
    last.remove()
    readyForStep()
}
function spPremiseDone(event){
    event.stopPropagation()
    var s = $("#formula").val()
    if (s) {
        $(".working").removeClass("working")
        var div = $('#s' + n + 'x')
        div.text("")
        div = folStringToHtml(s, div)
        readyForStep()
    }   
}
function spPremiseDoneArbConst(event){
    event.stopPropagation()
    var s = $("#formula").val()
    $(".working").removeClass("working")
    var div = $('#s' + n + 'x')
    div.text("")
    if (s) {
        div = folStringToHtml(s, div)
    }
    readyForStep()
}
function addArbConst(){
    var arbConst = prompt("Please enter an arbitrary constant (one not used elsewhere in your proof).","a")
    if (name != null){
        if(/^[a-z]$/.test(arbConst)){
            $("div.l"+n+".cell.fol").prepend("<span class='arbConst'>"+arbConst+"<span>")
            $(".done").off()
            $(".done").on('click',spPremiseDoneArbConst)
        }else{
            alert("Your constant must be a single lowercase letter.")
        }
    }
}
function endSp(){
    if(activeSp.hasClass("sp")){
       if(level>2){
            var last = added.pop()
            n--
            last.remove()
        }
        var lNum = n
        activeSp.find(".subs").removeClass('subs')
        activeSp.find(".sp").addClass('dead')
        activeSp.find(".sp").removeClass('closed')
        activeSp.addClass('closed')
        added.push(activeSp)
        activeSp = activeSp.parent()
        readyForStep()
    }else{
        alert("Error: No subproof is active.")
    }
}

var shell = [
    function(){return false},
    function(){     //level 1
        
    },
    function(){     //level 2
        
    },
    function(){     //level 3
        
    },
    function(){     //level 4
        
    },
]


//delete last

function deleteLast(){
    var last=added.pop()
    if(!premise && level>2){
        n--
        last.remove()
        last = added.pop()
    }
    if(last.hasClass("closed")){
        last.removeClass("closed")
        last.find(".x,.a,.b").addClass("subs")
        last.find(".dead").addClass("closed")
        last.find(".dead").removeClass("dead")
        activeSp = last
        readyForStep()
    }else if(last.hasClass("sp")){
        n--
        activeSp = last.parent()
        var l = added.pop()
        l.remove()
        last.remove()
        readyForStep()
    } else if(last.hasClass("conclusion")){
        premise=true
        $("#addLine,.spButton").hide()
        $("#addPremise,#addConclusion").show()
        last.remove()
        initialUi()
    }else{
        n--
        last.remove()
        if(premise){
            initialUi()
        }else{
            readyForStep()
        }
    }
}

function displayCancel(){
    displayCancelL[level]()
}
var displayCancelL = [
        function(){return false},
    function(){     //level 1
        readyForStep()
    },
    function(){     //level 2
        readyForStep()
    },
    function(){     //level 3
        var last = added.pop()
        var lastTxt = $("#s"+n+"x").text()
        n--
        last.remove()
        readyForStep()
        $("#formula").val(lastTxt)
        formulaPremiseOrLineInput()
    },
    function(){     //level 4
        displayCancel[3]()
    },
]