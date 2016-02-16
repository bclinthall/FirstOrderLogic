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
function test(){
      document.getElementById("formula").value="(A|B)>(A&D)"
}
String.prototype.replaceAt=function(index, x) {
      return this.substr(0, index) + x + this.substr(index+x.length);
}

function bodyLoaded(){
      document.getElementById("levelSelect").selectedIndex=0
      $("input").attr("disabled",true)
      $("#levelSelect").attr("disabled",false)
}
function folStringToHtml(s,div){
      //s is the string, div is the .x span where it will go.
      var id = div.attr('id')
      s=folStand(s)
      if(illegalCharacters(s,div)){return}
      s=newFixNegations(s,0)
      s=newFixParens(s)
      s=newFixLiterals(s)
      s=fixCont(s)
      s=fixOperators(s)
      s=restoreSymbols(s)
      div.append(s)     
      if(div = verifyAndName(div)){
            addIds(div,id)
      }
      return div
}
function folStand(s){
      s = s.replace(/\s/g,"")
      s = s.replace(/>/g,"%")
      s = s.toUpperCase()
      return s
}
function illegalCharacters(s,div){
      s=s.replace(/[0-9]/g,"#")
      var m = s.match(/[^A-Z\~\&\%\|\(\)\*]/g)
      if(m){
            for(var i=0;i<m.length;i++){
                  s=s.replace(m[i],"<span class='error'>"+fromChar(m[i])+"</span>")
            }
            m = s.match(/[0-9]+/g)
            if(m){
                  for(var i=0;i<m.length;i++){
                        s=s.replace(m[i],toChar(m[i]))
                  }
            }
            s=s.replace(/\%/g,">")
            div.append(s)
            alert("Illegal characters found.  Delete the sentence and try again.")
            return true
      }
      return false
}
function newFixNegations(s,i){
      if(s[i]=="~"){    //see what comes after the negation
                        //If it's another connector, keep looking (let the loop playthrough).
                        //If you come to a literal, wrap it, and look for the next ~
                        //If you come to a (, look for its mate, and wrap the 
                        //    whole thing.Then look for the next ~.
            if(s[i+1]){
                  for(var j=i+1;j<s.length;j++){
                        if(/[A-Z]/.test(s[j])) {      //we've hit a literal.  Wrap it and seek next ~
                              s = s.slice(0,i)+"<span name='neg' class='subs'>@"+s.slice(i+1,j+1)+"</span>"+s.slice(j+1);
                              break;
                        }
                        if(s[j]=="("){                //we've hit a parenth.  Look for it's mate.
                              var n = -1
                              for(var k=j+1;k<s.length;k++){
                                    if(s[k]=="("){n--}
                                    if(s[k]==")"){n++}
                                    if(n=="0"){       //we've fount the mate.  Wrap it and seek next ~
                                          s = s.slice(0,i)+"<span name='neg' class='subs'>@"+s.slice(i+1,k+1)+"</span>"+s.slice(k+1);
                                          break;
                                    }
                              }
                              break;
                        }
                  }
            }
      }
      if(s[i+1]){
            s = newFixNegations(s,i+1)
      }
      return s
}
function newFixParens(s){
      s=s.replace(/\(/g,"<span class='subs'><span class='lparen'>(</span>")
      s=s.replace(/\)/g,"<span class='rparen'>)</span></span>")
      return s
}
var toChar=String.fromCharCode
function fromChar(str){
      return str.charCodeAt()
}
function newFixLiterals(s){
      var m = s.match(/[A-Z]/g)
      if(m){
            for(var i=0;i<m.length;i++){
                  s=s.replace(m[i],"<span name='lit' class='subs'>"+fromChar(m[i])+"</span>")
            }
            m = s.match(/[0-9]+/g)
            if(m){
                  for(var i=0;i<m.length;i++){
                        s=s.replace(m[i],toChar(m[i]))
                  }
            }
      }
      return s
}
function fixCont(s){
      m = s.match(/\*/g)
      if(m){
            for(var i=0;i<m.length;i++){
                  s=s.replace(m[i],"<span name='cont' class='subs'>"+fromChar(m[i])+"</span>")
            }
            m = s.match(/[0-9]+/g)
            if(m){
                  for(var i=0;i<m.length;i++){
                        s=s.replace(m[i],toChar(m[i]))
                  }
            }
      }
      return s
}
function fixOperators(s){
      var m = s.match(/[\&\|\%]/g)
      if(m){
            for(var i=0;i<m.length;i++){
                  s=s.replace(m[i],"<span class='oper'>"+fromChar(m[i])+"</span>")
            }
            m = s.match(/[0-9]+/g)
            if(m){
                  for(var i=0;i<m.length;i++){
                        s=s.replace(m[i],toChar(m[i]))
                  }
            }
      }
      return s
}
function restoreSymbols(s){
      s=s.replace(/\%/g,">")
      s=s.replace(/\@/g,"<span class='neg'>~</span>")
      return s
}

function verifyAndName(e){
      var id = e.attr('id')
      var bad = false
      var lit = e.find("[name='lit'],[name='cont']")
      function reject(e,msg){
            e.addClass("error")
            if(msg){
                  alert(msg)
            }else{
                  alert("Bad subsentence. \n Delete the sentence and try again.")
            }
      }
      function x(cs,ary){
            if (cs.length!=ary.length){return false}
            for(var i=0;i<ary.length;i++){
                  if(!(cs.eq(i).hasClass(ary[i]))){
                        return false
                  }
            }
            return true
      }
      function y(e,type){
            //console.log(e.text()+", "+type)
      }
      function z(e,name,ccObj){
            var cs = e.children()
            e.attr('name',name)
            for(var i in ccObj){
                  cs.eq(i).addClass(ccObj[i])
            }
      }
      for(var i=0;i<lit.length;i++){
            //console.log("======new lit")
            e = lit.eq(i)
            while(!(e.hasClass("fol"))){
                  var cs = e.children()
                  //There are five good subsentence forms: p|q (whole sentence only), p, (p),~p,(p|q),
                  //If it has one of those forms, check the parent.
                  if(cs.length==0&&(e.attr('name')=='lit'||e.attr('name')=='cont'))               {y(e,'lit');e=e.parent();continue}
                  if(x(cs,['subs']))                                    {y(e,'oneSubsentence');
                        if(e.hasClass("x")){cs.addClass("x")}
                        cs.attr('id',e.attr('id'))
                        e.replaceWith(cs)
                        e=cs
                        e=e.parent();
                        continue
                  }
                  if(x(cs,['lparen','subs','rparen']))                  {y(e,'uselessParens');
                        reject(e,"Useless Parentheses Found.  Delete the sentence and try again.")
                        break;
                  }
                  if(x(cs,['neg','subs']))                              {y(e,'neg');
                        z(e,'neg',{1:'a'});
                        e=e.parent();
                        continue
                  }
                  if(x(cs,['lparen','subs','oper','subs','rparen']))    {y(e,'oper');
                        var op = cs.eq(2).text();
                        var typeObj={"&":"conj","|":"disj",">":"cond"};
                        z(e,typeObj[op],{1:'a',3:'b'})
                        e,e=e.parent();
                        continue
                  }
                  if(e.hasClass('x')&&x(cs,['subs','oper','subs']))     {y(e,'topOper');
                        var op = cs.eq(1).text();
                        var typeObj={"&":"conj","|":"disj",">":"cond"};
                        z(e,typeObj[op],{0:'a',2:'b'})
                        e=e.parent();
                        continue
                  }
                  bad = true
                  reject(e)
                  break
            }
            if(bad){
                  break
            }
      }
      if(bad){
            return false
      }else{
            return $("#"+id)
      }
}
function addIds(e,n) {  
      var a=e.children('.a')
      var b=e.children('.b')
      if(a.length>0) {
            //console.log(a)
            //console.log(n+"a")
            a.attr("id",n+"a")
            addIds(a,n+"a")
      }
      if(b.length>0) {
            //console.log(b)
            //console.log(n+"b")
            b.attr("id",n+"b")
            addIds(b,n+"b")
      }
}
var sym={
    "conj":"&",
    "disj":"|",
    "cond":">"
}

//////////////////////End functions for turning fol string to html


///////////////////////functions for UI management
function newLine(){
      var a = $("#folTable").append("<tr class='line l"+n+"'><td class='edit'><td class='lineNo'>"+n+".</td><td class = 'fol live'><span id='s"+n+"x' class='x subs'></span></td><td class='attribution'><td><td class='delete'></td><td class='editCell'></td></tr>")
      var e = $('#s'+n+'x')
      if(level==3||level==4){
            $(".l"+n+" .attribution").append("<input type='button' value='cite' id='citeButton"+n+"'>")
            $("#citeButton"+n).click(enterCitation)
      }
      addDelete(n)
      if(n>1){removeDelete(n-1)}
      n++
      return e
}

function deleteLastLine(){
      n--
      $(".l"+(n)).remove()
      addDelete(n-1)
      supporting.splice(supporting.indexOf(n),1)
      for(var i = 1;i<=n;i++){
            if(supporting.indexOf(i)==-1){
                  showEdit(i)
            }
      }
}
function addEdit(m){
      $(".l"+m+" .edit").append("<input type='button' name='d"+m+"x' value='edit' class='editButton' onClick='editLine("+m+")'></input>")
}
function hideEdit(m){
      $(".l"+m+" .editButton").hide()
}
function showEdit(m){
      $(".l"+m+" .editButton").show()     
}
function addDelete(m){
      $(".l"+m+" .delete").append("<input type='button' name='d"+m+"x' value='delete' class='deleteButton' onClick='deleteLastLine()'></input>")
}
function removeDelete(m){
      $(".l"+m+" .deleteButton").remove()
}
function editLine(m){
      if($(".l"+m+" .editInput").length==0){
            $(".l"+m+" .editCell").append("new Formula: <input type=text class='formula' value='"+$("#s"+m+"x").text()+"'></input><input type='button' value='done' class='doneEditing' onClick='doneEditing("+m+")'></input>")
      }
}
function doneEditing(m){
      var p = $(".l"+m+" .fol")
      p.html("<span id='s"+m+"x' class='x subs'></span>")
      var f = p.children()
      var s = $(".l"+m+" .editInput").val()
      folStringToHtml(s,f)
      $(".l"+m+" .editCell").html("")
}
function formulaInput(event){
      if(event.keyCode == 13){
            run()
      }
}
var level="0"
function levelChange(event){
      $(event.target).attr("disabled",true)
      $("input").attr("disabled",false)
      console.log("levelChange")
      console.log(event.target.selectedIndex)
      level = event.target.selectedIndex
      var test = {1:0,2:1,3:1,4:1}
      if(test[level]){
            for(i in ruleType){
                  opType = ruleType[i]
                  $("#opSelect").append("<option class='operation'>"+i)
            }
            $("#opSelect").change(function(event){
                  $("#displayCancel").show()
                  $("#displayCancel").click(displayCancel)
                  console.log(this.selectedIndex)
                  var title = $("#opSelect").children("option").eq(this.selectedIndex).text()
                  if(level==2){
                        ruleSelectedL2(title)
                  }else{
                        ruleSelectedL34(title)
                  }
            })
            
      }
      switch (level){
            case 1:
                  $("#folTable").off("mousemove",mouseOnFuncL1)
                  $("#folTable").on("mousemove",".subs",mouseOnFuncL1)
                  break;
            case 2:
                  $("#opSelect,#opSelectLabel").show()
      }
}
function displayCancel(){
      $("#folTable").off("mousemove",seekingE1L2)
      $("#folTable").off("click",e1PickedL2)
      $("#folTable").off("mousemove",seekingE1L34)
      $("#folTable").off("click",e1PickedL34)
      $("#dispInstructions").text("")
      citeData.rule = null
      citeData.a = null
      citeData.b = null
      if(level!=1){$("#commutation,#association,#removeDblNeg").show()}
}
function ruleSelectedL2(title){
      $("#commutation,#association,#removeDblNeg").hide()
      $("#folTable").off("mousemove",seekingE1L2)
      $("#folTable").off("click",e1PickedL2)
      $("#dispInstructions").text("Select the first sentence to use with "+title+".")
      citeData.rule = title
      citeData.a = null
      citeData.b = null
      $("#folTable").on("mousemove",".subs",{'title':title},seekingE1L2)
}
function ruleSelectedL34(title){
      $("#commutation,#association,#removeDblNeg").hide()
      $("#folTable").off("mousemove",seekingE1L34)
      $("#folTable").off("click",e1PickedL34)
      $("#dispInstructions").text("Select the first sentence to use with "+title+".")
      citeData.rule = title
      citeData.a = null
      citeData.b = null
      $("#folTable").on("mousemove",".subs",{'title':title},seekingE1L34)
}
function seekingE1L2(event){
      var t = this
      var title=event.data.title
      if(t!=oldMouseOn){
            $(t).addClass('mouseOn')
            if(oldMouseOn){
                  $(oldMouseOn).removeClass('mouseOn')
                  $("#folTable").off("click",e1PickedL2)
            }
            $("#folTable").on("click",".subs",{'title':title},e1PickedL2)
            oldMouseOn=t
            setDisplay(t)
      }
      event.stopPropagation()
}
function seekingE1L34(event){
      var t = this
      var title=event.data.title
      if(t!=oldMouseOn){
            $(t).addClass('mouseOn')
            if(oldMouseOn){
                  $(oldMouseOn).removeClass('mouseOn')
                  $("#folTable").off("click",e1PickedL34)
            }
            $("#folTable").on("click",".subs",{'title':title},e1PickedL34)
            oldMouseOn=t
            setDisplay(t)
      }
      event.stopPropagation()
}
function e1PickedL2(event){
      var e=$(this)
      console.log(e)
      var title = event.data.title
      if(test1[title](e)){
            citeData.a=e
            e.off("click",e1Picked)
            $("#folTable").off("mousemove",seekingE1L2)
            $("#folTable").off("click",e1PickedL2)            
            processE1L12(title,e)
      } else {
            alert("That sentence or subsentence doesn't work.  Try again.")
      }
}
function e1PickedL34(event){
      var e=$(this)
      console.log(e)
      var title = event.data.title
      if(test1[title](e)){  
            citeData.a=e
            e.off("click",e1Picked)
            $("#folTable").off("mousemove",seekingE1L34)
            $("#folTable").off("click",e1PickedL34)            
            processE1L34(title,e)
      } else {
            alert("That sentence or subsentence doesn't work.  Try again.")
      }
}
/////////////////////// end functions for UI management

//////////////////////Functions for mouseMove

function messageOn(msg,$elems,func){
      $("#message").prepend(msg)
      $("#message").prepend("<div class='instructions'>To select an element, role your mouse over it to highlight it, and then click it.</div>")
      $("#display").hide()
      $("#message").show()
      $("#folTable").off("mousemove",mouseOnFuncL1)
      if($("#msgRespEnter").length>0){
            $("#msgRespEnter").on("click",{'func':func},msgResponse) //add a listener to the msgResponse button (if one was added in msg).
            $("#msgRespInput").on("keydown",function(event){ //add a listener to click #msgRespEnter when the inter key is pressed in #msgRespEnter (if #msgRespEnter and #msgRespEnter were added in msg)
                  if(event.keyCode == 13){
                        $("#msgRespEnter").click()
                  }
            })
      }else{
            $("#folTable").on("mousemove",".subs",{'func':func},seekingResponse)
      }
}
function messageOff(){
      $("#display").show()
      $("#message").hide()
      $(".msgTarget").removeClass("msgTarget")
      if(level==1){
            $("#folTable").on("mousemove",".subs",mouseOnFuncL1)
      }
      $("#folTable").off("mousemove",seekingResponse)
      //reset #message
      $("#message").html('<div id="msgTemp" class="fol"><span id="sx0" class = "x subs"></span></div><div><span class="subsent"></span><br/><span class="subsentType"></span><br/><span class="subsentId"></span></div><input type="button" value="Cancel" onclick="messageOff()"></input>')
}
function setDisplay(e){
      var txt = $(e).text()
      var type = $(e).attr("name")
      var subsentId = e.id
      $(".subsent").text(txt)
      $(".subsentType").text(type)
      $(".subsentId").text(e.id)
}
//consider adding a param to setDisplay so that it can be used to output elem info to #message,
//then move setUpOperations out of setDisplay and into mouseOnFuncL1.
//maybe a seeking response 1 and seeking response 2 would be good, so that I can have the e1 highlighted while selecting e2.

var oldMouseOn

function mouseOnFuncL1(event){  //
      if(event.shiftKey==1){
            var t = this
            if(t!=oldMouseOn){
                  $(t).addClass('mouseOn')
                  if(oldMouseOn){$(oldMouseOn).removeClass('mouseOn')}
                  oldMouseOn=t
                  setDisplay(t)                  
                  setupOperations(t)
            }
      }
      event.stopPropagation()
}

var oldResp = null
var seekingResponse = function(event){
      var t = this
      if(t!=oldResp){
            var func = event.data.func
            $(t).addClass("msgTarget")
            if(oldResp){
                  $(oldResp).removeClass("msgTarget")
                  $(oldResp).off("click",msgResponse)
            }
            $(t).on("click",{'func':func},msgResponse)            
            oldResp = t
            setDisplay(t)
      }
      event.stopPropagation()
}
var mouseOnObj = {
    n: null,
    o:null
}

function msgResponse(event){
      event.data.func(this)
      event.stopPropagation()
}
function myMsg(){
      var msg = "<div>Select an Element for my message</div>"
      messageOn(msg,$(".fol").find('.subs'),function(elem){console.log(elem)})
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

function setupOperations(el){                  
      $(".operations.equi").html("")          
      $(".operations.introElim").html("")
      for(i in test1){
            if(test1[i]($(el))){
                  addOperation(i,$(el))
            }
      }
}
var citeData = new Object()

function addOperation(title,e){      
      var opType = ruleType[title]
      $(".operations"+"."+opType).append("<div class='operation "+title+"'>"+title+"</div>")
      $(".operation."+title).on("click",{'title':title,'e':e},opClickedL1)
}
function opClickedL1(event){ //Called when an op button is clicked, level one.  Assigned by addOperation.
      var title = event.data.title
      var e = event.data.e
      processE1L12(title,e)
}

function processE1L12(title,e,line){  //Called by opClickL1 or e1PickedL2
      citeData.rule = title
      citeData.a = e
      citeData.b = null
      if(test2[title]){
            messageOn(test2msg[title],$(".fol").find('.subs'),function(elem){
                  //this is the function that will be called when an element is clicked
                  //in response to the message.
                  var e2 = $(elem)
                  if(e2.attr('id')=='msgRespEnter'){
                        //if the user entered a new sentence and clicked the enter button,
                        //get the string from text input.
                        var s = $("#msgRespInput").val()
                        //turn it to html. call the result e2.
                        e2=folStringToHtml(s,$("#msgTemp .x"))
                        if(e2){
                              if(test2[title](e,e2)){  
                                    e = ops[title](e,e2);
                                    messageOff()
                                    if(e){
                                          infer(e)
                                    }
                              }else{
                                    $("#msgTemp").html('<span id="sx0" class = "x subs"></span>')
                              }
                        }else{
                              $("#msgTemp").html('<span id="sx0" class = "x subs"></span>')
                        }
                  }else{
                        if(test2[title](e,e2)){  
                              citeData.b=e2
                              e = ops[title](e,e2);
                              messageOff()
                              if(e){      
                                    infer(e)
                              }
                        }else{
                              alert("that elem doens't work.")
                        }
                  }
            })
      }else{
            e = ops[title](e);
            if(e){
                  infer(e)

            }
      }
}

function processE1L34(title,e,line){
      citeData.rule = title
      citeData.a = e
      citeData.b = null
      if(test2[title]){
            messageOn(test2msg[title],$(".fol").find('.subs'),function(elem){
                  //this is the function that will be called when an element is clicked
                  //in response to the message.
                  var e2 = $(elem)
                  if(e2.attr('id')=='msgRespEnter'){
                        //if the user entered a new sentence and clicked the enter button,
                        //get the string from text input.
                        var s = $("#msgRespInput").val()
                        //turn it to html. call the result e2.
                        e2=folStringToHtml(s,$("#msgTemp .x"))
                        if(e2){
                              if(test2[title](e,e2)){  
                                    e = ops[title](e,e2);
                                    messageOff()
                                    if(e){
                                          finishL34(e,title)
                                    }
                              }else{
                                    $("#msgTemp").html('<span id="sx0" class = "x subs"></span>')
                              }
                        }else{
                              $("#msgTemp").html('<span id="sx0" class = "x subs"></span>')
                        }
                  }else{
                        if(test2[title](e,e2)){  
                              citeData.b=e2
                              e = ops[title](e,e2);
                              messageOff()
                              if(e){
                                    finishL34(e,title)
                              }
                        }else{
                              alert("that elem doens't work.")
                        }
                  }
            })
      }else{
            e = ops[title](e);
            if(e){
                  finishL34(e,title)
            }
      }
}


var citeForLine = 0
function enterCitation(event){  //called when the cite button is clicked. (Levels 3 and 4)
      var id=this.id
      citeForLine = id.slice(10)
      $("#opSelect,#opSelectLabel").show()
}

function finishL34(e,title){
      var line = citeForLine
      var yourAnswer= $(".l"+line+" * .x").text()
      theAnswer=e.text()
      if ((yourAnswer!=theAnswer)&&level==3){
            if(citeData.b){
                  alert("Line "+line+" does not follow from lines "+lineNum(citeData.a)+" and "+lineNum(citeData.b)+" by "+title+".")
            }else{
                  alert("Line "+line+" does not follow from line "+lineNum(citeData.a)+" by "+title+".")
            }
            return
      }
      doCitation(e, citeForLine)
      $("#citeButton"+citeForLine).hide()
      $("#opSelect,#opSelectLabel").hide()
      $("#dispInstructions").text("")
      $("#commutation,#association,#removeDblNeg").show()
      $(".sentInfo").text("")
      var cite = $(".l"+citeForLine+" .attribution")
      console.log(cite.data())                              
}

function doCitation(e,line){  //called after citation data is collected (L3 and L4) or from Infer (L1 and L2).
      
      var cite = $(".l"+line+" .attribution")
      
      //take care of citation stuff for citeData.a
      var cited = $(citeData.a)
      var l1 = lineNum(citeData.a)
      cite.append(citeData.rule+" "+lineNum(citeData.a))
      hideEdit(l1)
      supporting.push(l1)
      if(citeData.b){        //take care of citation stuff for citeData.b
            cited=cited.add(citeData.b)
            var l2 = lineNum(citeData.b)
            if(l2!="0"){cite.append(","+lineNum(citeData.b))}
            hideEdit(l2)
            supporting.push(l2)
      }
      cite.data({rule:citeData.rule,a:citeData.a,b:citeData.b})
      cite.on("mouseenter",function(){cited.addClass("cited")})
      cite.on("mouseleave",function(){cited.removeClass("cited")})
}

function infer(e){
      var nl = newLine()
      var num = lineNum(nl)
      
      doCitation(e,num)
      
      var newSentId = "s"+(n-1)+"x"
      var s = e.parents('.fol').find(".x")
      s.attr('id',newSentId)
      addIds(s,newSentId)
      nl.replaceWith(s)

      s.parents('.fol').find(".mouseOn").removeClass("mouseOn")

      $("#temp").html("")
      if(level==1){
            setDisplay($(".mouseOn")[0])
            setupOperations($(".mouseOn")[0])
      }
      if(level!=1){
            $(".mouseOn").removeClass("mouseOn")
            $("#dispInstructions,.sentInfo").text("")
            $("#commutation,#association,#removeDblNeg").show()
      }
}

function equivalenceRule(e){
      var s = e.parents(".fol").find(".x").clone()
      $("#temp").append(s)
      e  = s.parents(".fol").find("#"+e.attr('id'))
      return e
}
function operate(type,a,b){
      a.removeClass("a b x")
      b.removeClass("a b x")
      a.addClass('a')
      b.addClass('b')
      var operObj = {"conj":"&","disj":"|","cond":">"}
      var e = $(document.createElement("span"))
      e.attr('name',type)
      e.addClass("subs")
      e.html("<span class='lparen'>(</span><span class='oper'>"+operObj[type]+"</span><span class='rparen'>)</span>")
      var oper = e.children(".oper")
      a.insertBefore(oper)
      b.insertAfter(oper)
      return e
}
function negate(a){
      a.removeClass("b x")
      a.addClass('a')
      var e = $(document.createElement("span"))
      e.attr('name',"neg")
      e.addClass("subs")
      e.html("<span class='neg'>~</span>")
      var oper = e.children(".neg")
      a.clone().insertAfter(oper)
      a.replaceWith(e)
      return e
}
function toggle(a){
      if(a.attr('name')=='neg'){
            var eClass = sClass(a)
            var r = a.children(".a")
            a.replaceWith(r)
            r.removeClass("a b x")
            r.addClass(eClass)
      }else{
            var r = negate(a)
      }
      r.addClass(eClass)
      return r
}
function sClass(e){
      if(e.hasClass("a")){var eClass="a"}
      if(e.hasClass("b")){var eClass="b"}
      if(e.hasClass("x")){var eClass="x"}
      return eClass
}
var tt = {'conj':'disj','disj':'conj'}
function wrap(e){
      e=e.clone()
      //if e is conj, disj, or cond w/o parenths, put parenths around it.
      var biOp={
            "conj":true,
            "disj":true,
            "cond":true
      }
      if(biOp[e.attr("name")]&&e.children(".lparen").length==0){
            e.prepend("<span class='lparen'>(</span>")
            e.append("<span class='rparen'>)</span>")
      }
      return e
}
            
var ops={
      commutation: function(e){
            var eClass = sClass(e)
            e=equivalenceRule(e)
            var type = e.attr("name")

            var a = e.children(".a")
            var b = e.children(".b")
            var r = operate(type,b,a)

            r.removeClass("a b x")
            r.addClass(eClass)
            e.replaceWith(r)
            return r
      },
      removeDblNegation: function(e){
            var eClass = sClass(e)
            e=equivalenceRule(e)
            var type = e.attr("name")

            var r = e.children('.a').children('.a')

            r.removeClass("a b x")
            r.addClass(eClass)
            e.replaceWith(r)
            return r
      },
      addDoubleNegation: function(e){
            var eClass = sClass(e)
            e=equivalenceRule(e)
            var type = e.attr("name")

            e=negate(e)
            e=negate(e)

            e.removeClass("a b x")
            e.addClass(eClass)
            //e.replaceWith(r)
            return e
      },
      deMorganOut: function(e){
            var eClass = sClass(e)
            e=equivalenceRule(e)
            var type = e.attr("name")

            var a = e.children(".a")
            var b = e.children(".b")
            a = toggle(a)
            b = toggle(b)
            var f = operate(tt[type],a,b)
            
            e.replaceWith(f)
            
            f=toggle(f)
            f.removeClass("a b x")
            f.addClass(eClass)
            return f
      },
      deMorganIn: function(e){
            var eClass = sClass(e)
            e=equivalenceRule(e)
            var type = e.children(".a").attr("name")

            var gca = e.children(".a").children(".a")
            var gcb = e.children(".a").children(".b")
            gca = toggle(gca)
            gcb = toggle(gcb)
            var r = operate(tt[type],gca,gcb)
            
            e.replaceWith(r)
            
            r.removeClass("a b x")
            r.addClass(eClass)
            return r
      },
      association: function(e){
            var eClass = sClass(e)
            e=equivalenceRule(e)
            var type = e.attr("name")
            
            if(e.children(".a").attr("name")==type){
                  var a = e.children(".a").children(".a")
                  var b = e.children(".a").children(".b")
                  var c = e.children('.b')
                  var r=operate(type,b,c)
                  r=operate(type,a,r)
            }else{
                  var a = e.children('.a')
                  var b = e.children(".b").children(".a")
                  var c = e.children(".b").children(".b")
                  var r=operate(type,a,b)
                  r=operate(type,r,c)
            }

            r.removeClass("a b x")
            r.addClass(eClass)
            e.replaceWith(r)
            return r
      },
      distributeIn: function(e){
            var eClass = sClass(e)
            e=equivalenceRule(e)
            var type = e.attr("name")
            
            if(e.children(".a").attr("name")==tt[type]){
                  var a = e.children(".a").children(".a")
                  var b = e.children(".a").children(".b")
                  var c = e.children('.b')
                  var f=operate(type,a,c)
                  var g=operate(type,b,c.clone())
                  var h=operate(tt[type],f,g)
            }else{
                  var a = e.children('.a')
                  var b = e.children(".b").children(".a")
                  var c = e.children(".b").children(".b")
                  var f=operate(type,a,b)
                  var g=operate(type,a.clone(),c)
                  var h=operate(tt[type],f,g)
            }

            h.removeClass("a b x")
            h.addClass(eClass)
            e.replaceWith(h)
            return h
      },
      distributeOut: function(e){
            var eClass = sClass(e)
            e=equivalenceRule(e)
            var type = e.attr("name")
            
            var a = e.children('.a').children('.a')
            var b = e.children('.a').children('.b')
            var c = e.children('.b').children('.b')
            
            var f = operate(type,b,c)
            var g= operate(tt[type],a,f)
            
            g.removeClass("a b x")
            g.addClass(eClass)
            e.replaceWith(g)
            return g
      },
      contraposition: function(e){
            var eClass = sClass(e)
            e=equivalenceRule(e)
            
            var a=e.children('.a')
            var b=e.children('.b')
            a=toggle(a)
            b=toggle(b)
            var r = operate("cond",b,a)
            
            r.removeClass("a b x")
            r.addClass(eClass)
            e.replaceWith(r)
            return r
      },
      condToDisj: function(e){
            var eClass = sClass(e)
            e=equivalenceRule(e)
            
            var a=e.children('.a')
            var b=e.children('.b')
            a=toggle(a)
            var r = operate("disj",b,a)
            
            r.removeClass("a b x")
            r.addClass(eClass)
            e.replaceWith(r)
            return r
      },
      disjToCond: function(e){
            var eClass = sClass(e)
            e=equivalenceRule(e)
            
            var a=e.children('.a')
            var b=e.children('.b')
            b=toggle(b)
            var r = operate("cond",b,a)
            
            r.removeClass("a b x")
            r.addClass(eClass)
            e.replaceWith(r)
            return r
      },
      conjElim: function(e){
            r=e.children(".a").clone()
            r.removeClass("a b")
            r.addClass("x")
            $("#temp").append(r)
            return r
      },
      conjIntro: function(e1,e2){
            e1=wrap(e1)
            e2=wrap(e2)
            e1.removeClass("a b x")
            e2.removeClass("a b x")
            e1.addClass('a')
            e2.addClass('b')
            r=operate("conj",e1,e2)
            r.addClass('x')
            $("#temp").append(r)
            return r
      },
      condElim: function(e1,e2){
            r = e1.children(".b").clone()
            r.removeClass("a b")
            r.addClass('x')
            $("#temp").append(r)
            return r
      },
      contIntro: function(e1,e2){
            $("#temp").append("<span class='subs x' name='cont'>*</span>")
            r=$("#temp").children(".x")
            return r
      },
      disjIntro: function(e1,e2){
            e1=wrap(e1)
            e2=wrap(e2)
            e1.removeClass("a b x")
            e2.removeClass("a b x")
            e1.addClass('a')
            e2.addClass('b')
            r=operate("disj",e1,e2)
            r.addClass('x')
            $("#temp").append(r)
            return r
      },
      contElim: function(e1,e2){
            r=e2.clone()
            r.removeClass("a b")
            r.addClass("x")
            $("#temp").append(r)
            return r
      }
      
}
var ruleType ={
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
      condIntro:"introElim",
      conjElim: "introElim",
      conjIntro: "introElim",
      disjElim: "introElim",
      disjIntro: "introElim",
      contElim: "introElim",
      contIntro: "introElim",
      negIntro: "introElim"
}
var test1 = {
      commutation: function(e){
            var test = {"disj":true,"conj":true}
            return test[e.attr("name")]
      },
      association: function(e){
            var type = e.attr("name")
            var test = {"disj":true,"conj":true}
            return test[type]&&(e.children(".a").attr("name")==type||e.children(".b").attr("name")==type)
      },
      addDoubleNegation: function(e){
            return true
      },
      removeDblNegation: function(e){
            return e.attr('name')=="neg"&&e.children(".a").attr('name')=="neg"
      },
      deMorganOut: function(e){
            var test = {"disj":true,"conj":true}
            return(test[e.attr("name")])
      },
      deMorganIn: function(e){
            var test = {"disj":true,"conj":true}
            return e.attr('name')=="neg"&&test[e.children(".a").attr("name")]
      },
      distributionIn: function(e){
            var test = {"disj":true,"conj":true}
            var type = e.attr("name")
            return test[type]&&(e.children(".a").attr("name")==tt[type]||e.children(".b").attr("name")==tt[type])
      },
      distributionOut: function(e){
            var test = {"disj":true,"conj":true}
            var type = e.attr("name")
            return test[type]&&(e.children(".a").attr("name")==tt[type]&&e.children(".b").attr("name")==tt[type])
      },
      contraposition: function(e){
            return e.attr("name")=="cond"
      },
      disjToCond: function(e){
            return e.attr("name")=="disj"
      },
      condToDisj: function(e){
            return e.attr("name")=="cond"
      },
      conjElim: function(e){
            return e.attr("name")=="conj"
      },
      conjIntro: function(e){
            return e.hasClass("x")
      },
      condElim: function(e){
            return e.hasClass("x")&&e.attr("name")=="cond"
      },
      contIntro: function(e){
            return e.hasClass("x")
      },
      disjIntro: function(e){
            return e.hasClass("x")
      },
      contElim: function(e){
            return e.attr("name")=="cont"
      }
}
var test2msg={
      conjIntro: "<div>Select the sentence to conjoin to the green sentence.</div>",
      condElim: "<div>Select the sentence to use with the green conditional for a condElim (Modus Ponens)</div>",
      contIntro: "<div>Select the sentence to use with the green sentence to introduce *.</div",
      disjIntro: "<div>Which sentence do you want to disjoin to the green sentence?  Type a sentence below.</div><input id='msgRespInput' type='text'></input><input type='button' value='enter' id='msgRespEnter'></input>",
      contElim: "<div>What sentence do you want to infer from the * in green?  Type a sentence below.</div><input id='msgRespInput' type='text'></input><input type='button' value='enter' id='msgRespEnter'></input>",
}
var test2={
      conjIntro: function(e1,e2){
            return e2.hasClass("x")
      },
      condElim: function(e1,e2){
            e2=wrap(e2)
            return e2.hasClass('x')&&(e2.text()==e1.children('.a').text())
      },
      contIntro: function(e1,e2){
            e1=wrap(e1)
            e2=wrap(e2)
            if(e2.hasClass("x")){
                  if(e1.attr('name')=="neg"){
                        return e1.children(".a").text()==e2.text()
                  } else if(e2.attr('name')=="neg"){
                        return e1.text()==e2.children(".a").text()
                  } else {
                        return false 
                  }
            }else{return false}
      },
      disjIntro: function(e1,e2){
            if(e2){return true}else{return false}
      },
      contElim: function(e1,e2){
            if(e2){return true}else{return false}
      }
}


function lineNum(e){
      var id = e[0].id
      var idSplit = id.split("x")
      var first = idSplit[0]
      var num = first.replace("s","")
      num = parseInt(num)
      return num
}
var supporting=[]

/*
var ops3 = {
      commutation: function(e){
            e.children(".a").appendTo(e)
            e.children(".b").prependTo(e)
            return e
      },
      negate: function(e){
            var ab = e[0].id[e[0].id.length-1]
            var p = e.parent()
            e.detach()
            if(ab=='b'){
                  p.append("<span class='temp' name='neg'></span>")
            }else{
                  p.prepend("<span class='temp' name='neg'></span>")
            }
            e.appendTo(p.children(".temp"))
            $(".temp").removeClass("temp")
            return e
      },
      deNegate: function(e){
            var ab = e[0].id[e[0].id.length-1]
            var p = e.parent()
            var c = e.children().detach()
            e.remove()
            if(ab=='b'){
                  p.append(c)
            }else{
                  p.prepend(c)
            }
            return c
      },
      toggle: function(e){
            var p = e.parent()
            if(p.attr("name")&&p.attr("name")=="neg"){
                  e = ops.deNegate(p)
            }else if(e.attr("name")=="neg"){
                  e = ops.deNegate(e)
            }else{
                  e = ops.negate(e)
            }
      return e
      },
      toggleType: function(e){
            type = e.attr("name")
            if(type=="conj"){
                  e.attr("name","disj")
            }
            if(type=="disj"){
                  e.attr("name","conj")
            }
            return e
      },
      addDoubleNegation: function(e){
            e = ops.negate(e)
            e = ops.negate(e)
            return e
      },
      removeDblNegation: function(e){
            var c = e.children('.a')
            c = ops.deNegate(c)
            e = ops.deNegate(e)
            return e
      },
      deMorganOut: function(e){
            e = ops.toggleType(e)
            var a = e.children(".a")
            a = ops.toggle(a)
            var b = e.children(".b")
            b = ops.toggle(b)
            e = ops.toggle(e)
            return e
      },
      deMorganIn: function(e){
            var c = e.children(".a")
            var gca = c.children(".a")
            var gcb = c.children(".b")
            gca = ops.toggle(gca)
            gcb = ops.toggle(gcb)
            c = ops.toggleType(c)
            e = ops.toggle(e)
            return e
      },
      distributeIn: function(e,c1Selected){
            var p = e.parent()
            var type = e.attr("name")
            var ttype = toggleType(type)
            var c2 = e.children('[name='+toggleType(type)+']')
            if(c1Selected==undefined){
                  if(c2.length!=1){
                        $("#message").append("<div>This "+type+" is composed of two "+ttype+"'s, so there are two ways you could distribute in.</div><div>Select the "+ttype+" to distribute over the other "+ttype+".")
                                    var s  = $("#temp").find(".fol")
                                    el  = s.find("#"+e[0].id)
                        messageOn(eOrig(e).parents(".fol").children(), function(target){
                               if(eOrig(c2).is(target)){
                                    e=ops.distributeIn(el,target)
                                    messageOff()
                                    infer(e)
                              }else{
                                    alert("Please select one half of the "+type+" highlighted in green")
                              }
                        })
                        return
                  }else{
                        var c1 = e.children('[name!='+ttype+']')
                        var ab = c1[0].id[c1[0].id.length-1]      
                  }
            }else{
                  
                  c1id = c1Selected.id
                  var s = e.parents(".fol").children()
                  c1 = s.find("#"+c1id)
                  ab = c1id[c1id.length-1]
                  if(ab=="b"){
                        c2 = e.children(".a")
                  }else{
                        c2 = e.children(".b")
                  }
            }
            var gca = c2.children(".a")
            var gcb = c2.children(".b")
            e.detach()
            $(".temp").removeClass(".temp")
            p.append("<span class='temp' name="+ttype+"><span class='a'></span><span class='b'></span></span>")
            e=$(".temp")
            $(".temp").removeClass(".temp")
            p.children().children().attr('name',type)
            if(ab=="a"){
                  p.children().children('.a').append(c1,gca)
                  p.children().children('.b').append(c1.clone(),gcb)
            }
            if(ab=="b"){
                  p.children().children('.a').append(gca,c1)
                  p.children().children('.b').append(gcb,c1.clone())
            }
            return e
      },
      distributeOut: function(e){
            var p = e.parent()
            var type = e.attr("name")
            var ttype = toggleType(type)
            var gc = e.children(".a").children(".a")
            var gca = e.children(".a").children(".b")
            var gcb = e.children(".b").children(".b")
            e.detach()
            $(".temp").removeClass("temp")
            p.append("<span class='temp' name="+ttype+"><span class='b'></span></span>")
            e=$(".temp")
            $(".temp").removeClass("temp")
            e.prepend(gc)
            e.children(".b").attr("name",type)
            e.children(".b").append(gca,gcb)
            return e
      },
      associative: function(e){
            var p = e.parent()
            var type = e.attr("name")
            if(e.children(".a").attr("name")==type){
                  var c = e.children(".b")
                  var gca = e.children(".a").children(".a")
                  var gcb = e.children(".a").children(".b")
                  e.detach()
                  $(".temp").removeClass("temp")
                  p.append("<span name='"+type+"'class='temp'><span name='"+type+"' class='b'></span></span")
                  e=$(".temp")
                  $(".temp").removeClass("temp")
                  e.prepend(gca)
                  e.children(".b").append(gcb,c)
            }else{
                  var c = e.children(".a")
                  var gca = e.children(".b").children(".a")
                  var gcb = e.children(".b").children(".b")
                  e.detach()
                  $(".temp").removeClass("temp")
                  p.append("<span name='"+type+"'class='temp'><span name='"+type+"' class='a'></span></span")
                  e=$(".temp")
                  $(".temp").removeClass("temp")
                  e.append(gcb)
                  e.children(".a").append(c,gca)
            }
            return e
      },
      conjElim: function(e){
            var p = e.parent()
            a = e.children(".a")
            e.detach()
            p.append(a)
            e = a
            return e
      },
      conjIntro: function(e){
            $("#message").append("<div>Select the other sentence to conjoin with sentence "+lineNum(e)+".</div>")
            var s  = $("#temp").find(".fol")
            el  = s.find("#"+e[0].id)
            messageOn($(".fol").children(), function(target){
                   if($(target).hasClass("x")){
                        var s  = $(target).parents(".fol").clone()
                        $("#temp").append(s)
                        var e2 = s.find("#"+target.id)
                        citeData.b = e2
                        e=ops.conjIntro2(e,e2)
                        messageOff()
                        infer(e)
                  }else{
                        alert("You must select a whole line. One way rules may not be applied to subsentences.")
                  }
            })

      },
      conjIntro2: function(e1,e2){
            $(".temp").removeClass("temp")
            $("#temp").append("<span class='fol'><span class='temp' name='conj'></span></span>")
            var e = $(".temp")
            $(".temp").removeClass("temp")
            e.append(e1)
            e.append(e2)
            return e
      },
      disjIntro: function(e){
            function disjIntroCallback(target){
                  var s  = $(target).closest(".fol").clone()
                  console.log(s)
                  $("#temp").append(s)
                  var e2 = s.find("#"+target.id)
                  if(lineNum(e2)){citeData.b = e2}
                  messageOff()
                  e=ops.disjIntro2(e,e2)
                  infer(e)
            }
            $("#message").append("<div>Which sentence do you want to disjoin to the green sentence?  Type a new sentence below or selecte a sentence or subsentence on the left.</div>")
            $("#message").append("<input id='msgRespInput' type='text'></input><input type='button' value='enter' id='msgRespEnter'></input>")
            $("#message #disjIntroEnter").on("click",function(){
                  var s = $("#disjIntroInput").val()
                  $(".temp").removeClass("temp")
                  $("#temp").append("<span class='temp fol'></span>")
                  var t = $(".temp")[0]
                  $(".temp").removeClass("temp")                  
                  folStringToHtml(s,t)
                  disjIntroCallback($(t).children()[0])
            })
            var s  = $("#temp").find(".fol")
            el  = s.find("#"+e[0].id)
            messageOn($(".fol").children(), disjIntroCallback)
      },
      disjIntro2: function(e1,e2){
            $(".temp").removeClass("temp")
            $("#temp").append("<span class='fol'><span class='temp' name='disj'></span></span>")
            var e = $(".temp")
            $(".temp").removeClass("temp")
            e.append(e1)
            e.append(e2)
            return e
      }
}
*/

function eOrig(e){
      var orig = null
      e.each(function(){
            if(orig){
                  orig = orig.add($("#folTable").find("#"+this.id))
            }else{
                  orig = $("#folTable").find("#"+this.id)
            }
      })
      return orig
}
function toggleType(type){
      if(type=="conj"){return "disj"}
      if(type=="disj"){return "conj"}
}

///////////////////////end functions for logical operations


var n = 1
function run(){
      var div = newLine()
      addEdit(n-1)
      var s = $("#formula").val()
      $("#formula").val("")
      if(s){div = folStringToHtml(s,div)}
}
