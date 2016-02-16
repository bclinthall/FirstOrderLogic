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
String.prototype.replaceAt=function(index, x) {
      return this.substr(0, index) + x + this.substr(index+x.length);
}





//////////////////functions for turning fol string into html
function toChr(num){
    return String.fromCharCode(num+913)
}
function frmChr(str){
    return str.charCodeAt()-913
}
function folStringToHtml(s,div){
    s=folStand(s)
    var htmlString = folStringToHtmlString(s)
    $(div).html(htmlString)
    addNames(div)
    addIds(div,div.id)
}
    function folStand(s){
    s = s.replace(/\s/g,"")
    s = s.toUpperCase()
    var p=""
    for (var i=0;i<s.length;i++){  //remove parenth's around literals
        if(s[i]=="("){ 
            if(s[i+1]&&/[A-Z]/.test(s[i+1])&&s[i+2]&&s[i+2]==")"){
                p+=s[i+1]
                i=i+2
            }else{
                p+=s[i]
            }
        }else{
            p+=s[i]
        }
    }
    return p  
}
    function folStringToHtmlString(s){
        var html = ""
        for (var i=0;i<s.length;i++){
            switch(s[i]){
                case "~":
                    if(/[A-Z]/.test(s[i+1])){
                        s=s.replaceAt(i+1,s[i+1].toLowerCase())
                    }
                    if(s[i+1]=="("){
                        var n = 0 
                        for(var j=(i+1);j<s.length;j++){
                            switch(s[j]){
                                case "(":
                                    n--;
                                    break;
                                case ")":
                                    n++;
                                    break;
                            }
                            if (n==0){
                                s=s.replaceAt(j,"}")
                                break;
                            }
                        }   
                    }
                    html+="<span name='neg'>~"
                    break;
                case "(":
                    html+="(<span>";
                    break;
                case ")":
                    html+="</span>)";
                    break;
                case "}":
                    html+="</span>)</span>"
                    break;
                default:
                    if (/[A-Z]/.test(s[i])){
                        html+="<span name='lit'>"+s[i]+"</span>"
                    }else if(/[a-z]/.test(s[i])){
                        html+="<span name='lit'>"+s[i].toUpperCase()+"</span></span>"
                    }else{
                        html+=s[i]
                    }
            }
        }
        return html
    }
function addNames(html) {  
  $(html).contents().each(function(){
    if(this.nodeType==3){
        var a = this.textContent
        switch (this.textContent.replace("(","").replace(")","")){
            case "&":
                $(this).parent().attr("name","conj")
                break;
            case "|":
                $(this).parent().attr("name","disj")
                break;
            case ">":
                $(this).parent().attr("name","cond")
                break;
            default:
/*                  if($(this).parent().attr("name")!="neg"&& !$(this).parent().hasClass('.fol')){  //remove senseless paren's
                        var e = $(this)
                        var p = e.parent()
                        var gp = e.parent().parent()
                        e.detach()
                        p.remove()
                        gp.append(e)
                        
                  }*/
        }
    }
    if($(this).contents()){
        addNames(this)
    }
  })
};
function addIds(e,n) {  
    var a=$(e).children()[0]
    var b=$(e).children()[1]
    if($(e).parent().hasClass("fol")){$(e).addClass("x")}
    if(a) {
        $(a).attr("id",n+"a")
        $(a).addClass("a")
        addIds(a,n+"a")
    }
    if(b) {
        $(b).attr("id",n+"b")
        $(b).addClass("b")
        addIds(b,n+"b")
    }
}
 

//////////////////////End functions for turning fol string to html


////////////////////////Functions for html to json and back
function htmlToJson(el){
      var obj = {}
      var c = $(el).children()
      if($(el).hasClass("fol")){
              obj.a = htmlToJson(c[0])
              if(c[1]){obj.b=htmlToJson(c[1])}
      }
      var type = $(el).attr("name")
      switch (type){
          case "neg":
              obj.type = "neg"
              obj.a = htmlToJson(c[0])
              break;
          case "lit":
              obj.type = "lit"
              obj.lit = el.textContent
              break;
          default:
              if($(el).attr("name")){obj.type = $(el).attr("name") } else {obj.type=""}
              var a = c[0]
              var b = c[1]
              if(a){
                  obj.a=htmlToJson(a)
              }
              if(b){
                  obj.b=htmlToJson(b)
              }
              break;
      }
      return obj
}
function jsonToHtml(obj,el,n){
    var index = n[n.length-1]
    $(el).attr("id",n)
    $(el).addClass(index)
    switch(obj.type){
        case "neg":
            $(el).attr("name","neg")
            $(el).html("~<span></span>")
            jsonToHtml(obj.a,$(el).children()[0],n+"a")
            break;
        case "":
            $(el).html("<span></span>")
            jsonToHtml(obj.a,$(el).children()[0],n+"a")
            break;
        case "lit":
            $(el).attr("name","lit")
            $(el).text(obj.lit)
            break;
        default:
            var t = obj.type
            $(el).attr("id",n)
            $(el).attr("name",t)
            $(el).html("(<span></span>"+sym[t]+"<span></span>)")
            jsonToHtml(obj.a,$(el).children()[0],n+"a")
            jsonToHtml(obj.b,$(el).children()[1],n+"b")
            break;
    }
}
var sym={
    "conj":"&",
    "disj":"|",
    "cond":">"
}
////////////////////////end functions for html to json and back


///////////////////////functions for UI management
function newLine(){
      $("#folTable").append("<tr class='line l"+n+"'><td class='edit'><td class='lineNo'>"+n+".</td><td class = 'fol'><span id='s"+n+"x' ></span></td><td class='attribution'><td><td class='delete'></td><td class='editCell'></td></tr>")
      var el = $("#s"+n+"x")[0]
      var myTop = $(el).offset().top
      addDelete(n)
      if(n>1){removeDelete(n-1)}
      n++
      return el
}
function deleteLastLine(){
      n--
      $(".l"+(n)).remove()
      addDelete(n-1)
      supporting.splice(supporting.indexOf(n),1)
      for(var i = 1;i<=n;i++){
            if(supporting.indexOf(i)==-1){
                  console.log(i+", "+supporting.indexOf(i))
                  showEdit(i)
            }
      }
      console.log(supporting)
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
            $(".l"+m+" .editCell").append("new Formula: <input type=text class='editInput' value='"+$("#s"+m+"x").text()+"'></input><input type='button' value='done' class='doneEditing' onClick='doneEditing("+m+")'></input>")
      }
}
function doneEditing(m){
      var f = $("#s"+m+"x")[0]
      var s = $(".l"+m+" .editInput").val()
      folStringToHtml(s,f)
      $(".l"+m+" .editCell").html("")
}
function formulaInput(event){
      if(event.keyCode == 13){
            run()
      }
}
/////////////////////// end functions for UI management

//////////////////////Functions for mouseMove
var mouseOnObj = {
    n: null,
    o:null
}
var mouseOnFunc = function(event){
      if(event.shiftKey==1){
            mouseOnObj.n = event.target
            if(mouseOnObj.n!=mouseOnObj.o){
                  mouseOnObj.n.classList.add('mouseOn')
                  if(mouseOnObj.o){mouseOnObj.o.classList.remove('mouseOn')}
                  mouseOnObj.o=mouseOnObj.n
                  var txt = $(mouseOnObj.n).text()
                  var type = $(mouseOnObj.n).attr("name")
                  var subsentId = mouseOnObj.n.id
                  $("#subsent").text(txt)
                  $("#subsentType").text(type)
                  $("#subsentId").text(mouseOnObj.n.id)
                  $("#operations").html("")
                  setupOperations(mouseOnObj.n,type)
            }
      }
}

function addListeners(div){
    subsent = document.getElementById("subsent")
    subsentType = document.getElementById("subsentType")
    sentId = document.getElementById("sentId")
    $(div).on("mousemove",mouseOnFunc)
}
function messageOn($elems,func){
      $("#display").hide()
      $("#message").show()
      $("#message").prepend("<div class='instructions'>To select an element, role your mouse over it to highlight it, and then click it.</div>")
      $(".fol").children().off("mousemove",mouseOnFunc)
      $elems.on("mousemove",{'func':func},seekingResponse)
      $elems.addClass("responseOpts")
}
function messageOff(){
      $("#display").show()
      $("#message").hide()
      $(".msgTarget").removeClass("msgTarget")
      $(".fol").children().on("mousemove",mouseOnFunc)
      $(".responseOpts").off("mousemove",seekingResponse)
      $(".responseOpts").removeClass("responseOpts")
      $("#message").html("")
}
var oldResp = null
function seekingResponse(event){
      var t = event.target
      if(t!=oldResp){
            var func = event.data.func
            $(t).addClass("msgTarget")
            $(t).on("click",{'func':func},msgResponse)
            if(oldResp){
                  $(oldResp).removeClass("msgTarget")
                  $(oldResp).off("click",msgResponse)
            }
            oldResp = t
      }
}
function msgResponse(event){
      event.data.func(event.target)
      event.stopPropagation()
}
function myMsg(){
      $("#message").append("<div>Select an Element</div>")
      messageOn(function(elem){console.log(elem)},$(".fol").children())
}

/////////////////////////End functions for mouseMove

///////////////////////functions for logical operations
function setupOperations(el,type){
      addOperation("addDoubleNegation",el)
      if(type=="conj"||type=="disj"){
            ttype = toggleType(type)
            addOperation("commutation",el)
            addOperation("deMorganOut",el)
            if($(el).children('[name="'+ttype+'"]').length>0){
                  addOperation("distributeIn",el)
            }
            if($(el).children('[name="'+ttype+'"]').length==2){
                  if($(el).children('.a').children('.a').text()==$(el).children('.b').children('.a').text()){
                        addOperation("distributeOut",el)
                  }
            }
            if($(el).children('[name="'+type+'"]').length>0){
                  addOperation("associative",el)
            }
      }
      switch(type){
            case "conj":
                  break;
            case "disj":
                  
                  break;
            case "neg":
                  if($(el).children().attr("name")=="neg"){
                        addOperation("removeDoubleNegation",el)
                  }
                  if($(el).children().attr("name")=="conj"||$(el).children().attr("name")=="disj"){
                        addOperation("deMorganIn",el)
                  }
                  break;
      }
      if($(el).hasClass("x")){
            addOperation("conjIntro",el)
            switch(type){
                  case "conj":
                        addOperation("conjElim",el)
                        break;
                  case "disj":
                        
                        break;
                  case "neg":

                        break;

            }
      }
}

var citeData = new Object()            
function addOperation(title,el){      
      $("#operations").append("<div class='operation "+title+"'>"+title+"</div>")
      $("#operations ."+title).click(function(){
            var s  = $(el).parents(".fol").clone()
            $("#temp").append(s)
            var e  = s.find("#"+el.id)
            e = ops[title](e);
            citeData.rule = title
            citeData.a = $(el)
            citeData.b = null
            console.log(citeData)
            if(e){infer(e)}
      })     
}
function lineNum(e){
      return parseInt(e[0].id.split("x")[0].replace("s",""))
}
var supporting=[]
function infer(e){
      console.log(citeData)
      var nl = newLine()
      var num = lineNum($(nl))
      var cite = $(".l"+num+" .attribution")
      var cited = $(citeData.a)
      var l1 = lineNum(citeData.a)
      cite.append(citeData.rule+" "+lineNum(citeData.a))
      hideEdit(l1)
      supporting.push(l1)
      if(citeData.b){
            cited=cited.add(citeData.b)
            var l2 = lineNum(citeData.a)
            cite.append(","+lineNum(citeData.b))
            supporting.push(l2)
      }
      console.log(supporting)
      cite.data({rule:citeData.rule,a:citeData.a,b:citeData.b})
      cite.on("mouseenter",function(){cited.addClass("cited")})
      cite.on("mouseleave",function(){cited.removeClass("cited")})
      var newSentId = "s"+(n-1)+"x"
      var throughJson = true
      if(throughJson){
            console.log(e.parents(".fol"))
            console.log(e.parents(".fol").children())
            var s = e.parents(".fol").children()
            var obj = htmlToJson(s[0])
            jsonToHtml(obj,nl,newSentId)
      }else{
            $(nl).append(s)
      }
      addListeners(nl)
      $("#temp").html("")
}
var ops = {
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
      removeDoubleNegation: function(e){
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
      }
}
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
      var myHtmlDiv = newLine()
      addEdit(n-1)
      var s = $("#formula").val()
      folStringToHtml(s,myHtmlDiv)
      addListeners(myHtmlDiv)
}