

var levelStates = {
    L1: {
        premises: function(){
            levelStates.opts.display         (false)
            levelStates.opts.dispInstructions(false)
            levelStates.opts.mmE1L1          (false)
            levelStates.opts.mmE1class       (false)
            levelStates.opts.mmE2            (false)
            levelStates.opts.mmE2class       (false)
            levelStates.opts.message         (false)
            levelStates.opts.citeData        (false)
            levelStates.opts.temp            (false)
            levelStates.opts.msgTemp         (false)    
        },
        awaitingE1: function(){
            levelStates.opts.display         (false)
            levelStates.opts.display         (true)
            levelStates.opts.dispInstructions(true)
            levelStates.opts.mmE1L1          (true)
            levelStates.opts.mmE1class       (false)
            levelStates.opts.mmE2            (false)
            levelStates.opts.mmE2class       (false)
            levelStates.opts.message         (false)
            levelStates.opts.citeData        (false)
            levelStates.opts.temp            (false)
            levelStates.opts.msgTemp         (false)
        },
        awaitingRule:function(){
            levelStates.opts.display         (true)
            levelStates.opts.dispInstructions(true)
            levelStates.opts.mmE1L1         (true)
            levelStates.opts.mmE1class       (true)
            levelStates.opts.mmE2            (false)
            levelStates.opts.mmE2class       (false)
            levelStates.opts.message         (false)
            levelStates.opts.citeData        (false)
            levelStates.opts.temp            (false)
            levelStates.opts.msgTemp         (false)
            //on cancel go to awaiting E1.
            ;
        },
        awaitingE2: function(){
            levelStates.opts.display         (false)
            levelStates.opts.dispInstructions(false)
            levelStates.opts.mmE1L1          (false)
            levelStates.opts.mmE1class       (true)
            levelStates.opts.mmE2            (true)
            levelStates.opts.mmE2class       (true)
            levelStates.opts.message         (true)
            levelStates.opts.citeData        (true)
            levelStates.opts.temp            (false)
            levelStates.opts.msgTemp         (false)
            //on cancel, go to awaiting e1
            ;
        }
    },
    L2: {
        awaitingRule: function(){
            levelStates.opts.citeData(false)
            levelStates.opts.display(true)
            levelStates.opts.dispInstructions(false)
            levelStates.opts.mmE1L24(false)
            levelStates.opts.mmE1class(false)
            levelStates.opts.displayCancel(false)
            levelStates.opts.temp(false)
            levelStates.opts.opSelect(true)
            levelStates.opts.easyOps(false)
            levelStates.opts.citeDataB(false)
            levelStates.opts.message(false)
            levelStates.opts.mmE2(false)
            levelStates.opts.mmE2class(false)
            levelStates.opts.msgTemp(false)
        },
        awaitingE1: function(){
            $("#displayCancel").show();
            //on cancel go to awaiting rule.
        },
        awaitingE2: function(){
            $("#display").hide()
            $("#messageBox").show()
            //on cancel go to awaiting E1.
            ;
        }
    },
    L3: {
        awaitingCite: function(){
            $("#displayCancel").hide()
            $("#opSelect,#opSelectLabel").hide()
            $(".subs,.sp.closed").off("mousemove", seekingE1L34)
            $(".subs,.sp.closed").off("click", e1PickedL34)
            $("#dispInstructions").text("")
            citeData.rule = null
            citeData.a = null
            citeData.b = null
            $("#commutation,#association,#removeDblNeg").show()
            ;
        },
        awaitingRule: function(){
            levelStates.L2.awaitingRule()/////;
        },
        awaitingE1: function(){
            ;
        },
        awaitingE2: function(){
            $("#display").hide()
            $("#messageBox").show()            ;
        }
    },
    L4: {
        awaitingCite: function(){
            levelStates.L3.awaitingCite()
            ;
        },
        awaitingRule: function(){
            levelStates.L3.awaitingRule()
            ;
        },
        awaitingE1: function(){
            levelStates.L4.awaitingE1()
            //on cancel, go to awaiting cite.
            ;
        },
        awaitingE2: function(){
            levelStates.L3.awaitingE2()
            //on cancel, go to awaiting E1
            ;
        }
    }
}


levelStates.opts = {
    citeData: function(b){
        if(!b){
            citeData.rule = null
            citeData.a = null
            citeData.b = null
        }
    },
    display: function(b){
        if(b){
            $("#display").show()
        } else {
            $("#display").hide()
            $("#dispInstructions").text("")
            $("#display * .sentInfo").text("")
            $(".equi,.introElim").html("")
        }
    },
    dispInstructions: function(b){
        if(!b){
            $("#dispInstructions").text("")
        }
    },
    mmE1L1: function(b){
        if(b){
            $("*").off("mousemove", seekingE1L1)
            $(".subs,.sp.closed").on("mousemove", seekingE1L1)
        } else {
            $("*").off("mousemove", seekingE1L1)
        }
    },
    mmE1L24: function(b){
        if(!b){
            $("*").off("mousemove", seekingE1L24)
            $("*").off("click", e1PickedL24)
            
        }
    },
    mmE1class: function(b){
        if(!b){
            $(".E1Resp").removeClass("E1Resp")
        }
    },
    displayCancel:function(b){
        if(b){
            $("#displayCancel").show()
        }else{
            $("#displayCancel").hide()
        }
    },
    temp: function(b){
        if(!b){
            $("#temp").html("")
        }
    },
    opSelect: function(b){
        if(b){
            $("#opSelect,#opSelectLabel").show()
        }else{
            $("#opSelect,#opSelectLabel").show()
        }
    },
    easyOps: function(b){
        if(b){
            $(".easy .operation").show()
        }else{
            $(".easy .operation").hide()
        }
    },
    
    citeDataB: function(b){
        if(~b){
            citeData.b=null
        }
    },
    message: function(b){
        if(b){
            $("#messageBox").show()
        } else {
            $("#messageBox").hide()
            $("#message").html("")
            $("#messageBox * .sentInfo").text("")
        }
    },
    mmE2: function(b){
        if(!b){
            $("*").off("mousemove",seekingE2L14)
            $("*").off("mousemove",disjElimSeekingSp1L14)
            $(".E2Resp").removeClass("E2Resp")
            $("*").off("click",e2L14Click)
            $("*").off("click",disjElimSp1L14Click)
        }
    },
    mmE2class: function(b){
        if(!b){
            $(".E2Resp").removeClass("E2Resp")
        }
    },
    msgTemp: function(b){
        if(!b){
            $("#msgTemp").html("<span id='sx0' class = 'x subs'></span>")
        }
    },
}

/*
    levelStates.opts.citeData()
    levelStates.opts.display()
        same for 1-4
    levelStates.opts.dispInstructions()
        same for 1-4  //Don't clear them when waiting for e2, so they show up again on cancel.
    levelStates.opts.mmE1()
        has a click for L2-4
    levelStates.opts.mmE1class()
        same for 1-4
    levelStates.opts.displayCancel
    levelStates.opts.temp
    levelStates.opts.opSelect
    levelStates.opts.easyOps
    
    levelStates.opts.citeDataB()
    levelStates.opts.message()
    levelStates.opts.mmE2()
        same for 1-4
    levelStates.opts.mmE2class()
        same for 1-4
    levelStates.opts.msgTemp
*/




function levelChange(event) {
    $(event.target).attr("disabled", true)
    $("input").attr("disabled", false)
    console.log("levelChange")
    console.log(event.target.selectedIndex)
    level = event.target.selectedIndex
    var test = {1: 0, 2: 1, 3: 1, 4: 1}
    if (test[level]) {  //Setup the dropdown box for L2-4.  Show and hide it by level states.
        for (i in ruleType) {
            opType = ruleType[i]
            $("#opSelect").append("<option class='operation'>" + i)
        }
        $("#opSelect").change(function (event) {
            $("#displayCancel").show()
            $("#displayCancel").click(displayCancel)
            console.log(this.selectedIndex)
            var title = $("#opSelect").children("option").eq(this.selectedIndex).text()
            ruleSelectedL24(title,level)
        })
    }
    switch (level) { //Set initial levelStates
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

function displayCancel() {
    switch (level) {
        case 2:
            levelStates.L2.awaitingE1();
            break;
        case 3:
            levelStates.L3.awaitingCite();
            break;
        case 4:
            levelStates.L4.awaitingCite();
            break;
    }
}




/////////////////////// Not yet Categorized.//////////////////////////////////////////////////////////////////////////////////////////////









function myMsg() {
    var msg = "<div>Select an Element for my message</div>"
    seekingE2setupL14(msg, $(".fol").find('.subs'), function (elem) {
        console.log(elem)
    })
}
/////////////////////////End functions for mouseMove
///////////////////////functions for logical operations
/*      Level one:
            Highlight el 1.
            Click the rule.
            (prompt for el 2
                  Notify if el 2 is inapplicable.)
            Draw the conclusion.
      Level two:
            Click the rule.
            prompt for el 1
                  Notify if el 1 is inapplicable
            (prompt for el 2
                  Notify if el 1 is inapplicable)
            Draw the conclusion.
                  Make all the rules show up when level 2 is selected.
                  Add an 'onClick' listener for the rules.
                        for .subs, that function should attach a mouseover listener
                        and an on click listener.  On click, the element should be validated,
                        then the function called on the element.
      Level 3:
            Type the sentence.
            Click the rule.
            prompt for el 1
                  Notify if el 1 is inapplicable
            (prompt for el 2
                  Notify if el 1 is inapplicable)
            Check whether typed sentence follows.
      Level 4:
            Type the sentence.
            Click the rule.
            prompt for el 1
            prompt for el 2
            Later, check if el1 and el2 are applicable and whether the typed sentence follows.
      mouseMove will have to behave differently depending on the level.
            Level 1: hold shift key to highlight.  (Then click rule button)
            Levels 2-4: (click rule button).  Then mouseOver to highlight, and click to select.
*/














