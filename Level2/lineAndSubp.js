
var spId = 0
activeSp = null
var premise = true

function bodyLoaded() {
    levelStates.L1.premises()
    $(".help").hide()
    $("#formula,.done,.cancelAdd,#addLine,.spButton,#deleteLast,#editLine,#citeLast").hide()
    n=0
    $("#formula").text("")
    activeSp = $(".folTable")
    checkCookie()
    $("#studentName").on("input",function(){
        setCookie("username",$("#studentName").val(),365);
        ////console.log($("#studentName").val())
    })
}

function setDisplay(e) {  //sends element info to .sentInfo div's.
    var txt = $(e).text()
    var type = $(e).attr("data-substype")
    var subsentId = e.id
    if($(e).hasClass("sp")){
        lineNums = lineNum($(e).children().first().find(".x"))+"-"+lineNum($(e).children().last().find(".x"))
        $(".subsent").text(lineNums)
        $(".subsentType").text("Subproof")
        //$(".subsentId").text(e.id)
    }else{
        $(".subsent").text(txt)
        $(".subsentType").text(type)
        //$(".subsentId").text(e.id)
    }
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
    $(".done").show()
    $(".done").on('click',premiseDone)
    $(".cancelAdd").show()
    $(".cancelAdd").on('click',premiseCancel)
    n++
    $(".folTable").append("<div class='line l" + n + " cell fol'><span id='s" + n + "x' class='x subs'></span></div>")
    $(".lineNo").append("<div class='line l" + n + " cell'>"+n+".</div>")
    $("[title='attribution']").append("<div class='line l" + n + " cell'><span class='attribution'></span></div>")
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
        $(".done").hide()
        $(".done").off()
        $(".cancelAdd").hide()
        $(".cancelAdd").off()
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
    $(".done").hide()
    $(".done").off()
    $(".cancelAdd").hide()
    $(".cancelAdd").off()
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
    $(".done").show()
    $(".done").on('click',conclusionDone)
    $(".cancelAdd").show()
    $(".cancelAdd").on('click',conclusionCancel)
    $(".l"+n).find(".attribution").append("<div class='conclusion line l" + n + " cell fol'><span class='x subs'></span></div>")
    $(".conclusion").addClass("working")
    added.push($(".conclusion"))
}
function conclusionDone(){
    $(".working").removeClass("working")
    var s = $("#formula").val()
    if (s) {
        $(".spButton,#deleteLast,#editLine").show()
        premise=false
        $("#formula").off()
        $("#formula").val("")
        $("#formula").on('keydown',formulaLineKeydown)
        $("#formula").on('input',formulaLineInput)
        $(".done").off()
        $(".done").on('click',lineDone)
        $("#newSubProof,#endSp").hide()
        $(".cancelAdd").off()
        $(".cancelAdd").on('click',lineCancel)
        n++
        $(".folTable").append("<div class='line l" + n + " cell fol'><span id='s" + n + "x' class='x subs'></span></div>")
        $(".lineNo").append("<div class='line l" + n + " cell'>"+n+".</div>")
        $("[title='attribution']").append("<div class='line l" + n + " cell'><span class='attribution'></span></div>")
        var div = $(".l"+n)
        div.find(".x").addClass("working")
        added.push(div)
        
        div = $('.conclusion .x')
        div.text("")
        div = folStringToHtml(s, div)
        $(".conclusion").find(".subs").removeClass("subs")
        levelStates.L1.awaitingE1()
    }
    
}
function conclusionCancel(){
    $(".conclusion").remove()
    added.pop()
    $("#addPremise,#addConclusion,#deleteLast,#editLine").show()
    $("#formula").hide()
    $("#formula").off()
    $("#formula").val("")
    $(".done").hide()
    $(".done").off()
    $(".cancelAdd").hide()
    $(".cancelAdd").off()
}
function formulaConclusionKeydown(event){
    if (event.keyCode == 13) {
        conclusionDone()
    }
}
function formulaConclusionInput(){
        $(".conclusion .x").text($("#formula").val())
}

//Add line stuff
function lineDone(){
    var s = $("#formula").val()
    if (s) {
        $(".working").removeClass("working")
        $("#deleteLast,#citeLast").show()
        $("#newSubProof,#endSp").hide()
        $("#formula").hide()
        $("#formula").off()
        $("#formula").val("")
        $(".done").hide()
        $(".done").off()
        $(".cancelAdd").off()
        $(".cancelAdd").hide()       
        var div = $('#s' + n + 'x')
        div.text("")
        div = folStringToHtml(s, div)
    }
    
}
function lineCancel(){
    var lineTxt = deleteLast()
    $("#formula").val(lineTxt)
}
function formulaLineKeydown(event){
    if (event.keyCode == 13) {
        lineDone()
    }
}




//Add line stuff
function addLine(){                                           //Varies by level
    levelStates.L1.awaitingE1()
    $("#addLine,#deleteLast,#editLine").hide()
    $("#formula").show();$("#formula").focus()          
    $("#formula").on('keydown',formulaLineKeydown)  
    $("#formula").on('input',formulaPremiseOrLineInput)
    $(".done").show()
    $(".done").on('click',lineDone)                 
    $(".spButton").show()
    $(".cancelAdd").show()
    $(".cancelAdd").on('click',lineCancel)
    n++
    activeSp.append("<div class='line l" + n + " cell fol'><span id='s" + n + "x' class='x subs'></span></div>")
    $(".lineNo").append("<div class='line l" + n + " cell'>"+n+".</div>")
    $("[title='attribution']").append("<div class='line l" + n + " cell'><span class='attribution'></span></div>")
    $(".l"+n).find(".x").addClass("working")
    added.push($(".l"+n))
}
function lineDone(){
    $(".working").removeClass('working')
    var s = $("#formula").val()
    if (s) {
        levelStates.L1.awaitingE1()
        $(".spButton,#deleteLast,#editLine").show()  //varies by level
        $("#formula").hide()
        $("#formula").off()
        $("#formula").val("")
        $(".done").hide()
        $(".done").off()
        $(".spButton").show()
        $(".cancelAdd").hide()
        $(".cancelAdd").off()
        var div = $('#s' + n + 'x')
        div.text("")
        div = folStringToHtml(s, div)
        levelStates.L1.awaitingE1()
    }
    
}
function lineCancel(){
    deleteLast()
    $(".spButton,#deleteLast,#editLine").show()   //varies by level
    $("#formula").hide()
    $("#formula").off()
    $("#formula").val("")
    $(".done").hide()
    $(".done").off()
    $(".spButton").show()
    $(".cancelAdd").hide()
    $(".cancelAdd").off()
}
function formulaLineKeydown(event){
    if (event.keyCode == 13) {
        lineDone()
    }
}

//line management functions
function deleteLast(){
    var last = added.pop()
    var lastTxt = last.text()
    if(last.hasClass("closed")){
        last.removeClass("closed")
        last.find(".x,.a,.b").addClass("subs")
        last.find(".dead").addClass("closed")
        last.find(".dead").removeClass("dead")
        activeSp = last
        levelStates.L1.awaitingE1()
    }else if(last.hasClass("sp")){
        n--
        activeSp = last.parent()
        var l = added.pop()
        l.remove()
        last.remove()
        levelStates.L1.awaitingE1()
    } else if(last.hasClass("conclusion")){
        premise=true
        $("#addLine,.spButton").hide()
        $("#addPremise,#addConclusion").show()
        levelStates.L1.premises()
        last.remove()
    }else{
        n--
        levelStates.L1.awaitingE1()
        last.remove()
    }
    levelStates.L1.awaitingE1()
    return lastTxt
}
function editLine(){
    //add edit instructions.
    $(".instructions.special").text("Click a sentence to edit it.  Only sentences that have not been used to support other sentences are available for editing.")
    $("#addPremise,#addConclusion,#addLine,#deleteLast,#editLine").hide()
    $(".cancelAdd").show()
    $(".cancelAdd").on('click',editCancel)
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
    $(".done").show()
    $(".done").on('click',{'elem':$(this)},editDone)
}
function editDone(event){
    var s = $("#formula").val()
    if (s) {
        var div=event.data.elem
        if(premise){
            $("#addPremise,#addConclusion,#deleteLast,#editLine").show()
        }else{
            $("#deleteLast,#editLine,.spButton").show()
        }
        $("#formula").hide()
        $("#formula").off()
        $("#formula").val("")
        $(".done").hide()
        $(".done").off()
        $(".cancelAdd").hide()
        $(".cancelAdd").off()
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
    $(".done").hide()
    $(".done").off()
    $(".cancelAdd").hide()
    $(".cancelAdd").off()
    var eligible = $(".x")    
    eligible.off()
    $(".toEdit").removeClass('toEdit')
}
function formulaEditKeydown(event){
    ////console.log("edit keydown")
    ////console.log(event.keyCode)
    if (event.keyCode == 13) {
        editDone(event)
    }
}


/////////Subproof stuff
var activeSp = null
function newSubProof(){
    spId++
    var lNum = n
    var thisSp = spId
    activeSp.append("<div class='sp' id='spId"+spId+"'></div>")
    activeSp = $("#spId"+spId)
    addLine()
    added.push(activeSp)
    levelStates.L1.premises()
    $("#formula").show();$("#formula").focus()                   //varies by level
    $("#formula").on('keydown',formulaLineKeydown)  
    $("#formula").on('input',formulaPremiseOrLineInput)
    $("#formula").focus()
    $(".done").show()
    $(".done").on('click',lineDone)                             //end varies by level
    $(".spButton").hide()
}
function endSp(){
    if(activeSp.hasClass("sp")){
        var lNum = n
        activeSp.find(".subs").removeClass('subs')
        activeSp.find(".sp").addClass('dead')
        activeSp.find(".sp").removeClass('closed')
        activeSp.addClass('closed')
        added.push(activeSp)
        activeSp = activeSp.parent()
        $("#formula").focus()
        $("#endSp").hide()
        $("#newSubProof").show()
    }else{
        alert("Error: No subproof is active.")
    }
    levelStates.L1.awaitingE1()
}
////////Cancel Buttons
function msgCancel(){
    levelStates.L1.awaitingE1()
}