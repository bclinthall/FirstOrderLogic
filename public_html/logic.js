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
    for (var i=0;i<s.length;i++){
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
    if(a) {
        $(a).attr("id",n+"a")
        addIds(a,n+"a")
    }
    if(b) {
        $(b).attr("id",n+"b")
        addIds(b,n+"b")
    }
}
 

//////////////////////End functions for turning fol string to html
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
            $(event.data.subsent).text(txt)
            $(event.data.subsentType).text(type)
            $(event.data.sentId).text(mouseOnObj.n.id)
        }
    }
}
function addListeners(div){
    subsent = document.getElementById("subsent")
    subsentType = document.getElementById("subsentType")
    sentId = document.getElementById("sentId")
    $(div).on("mousemove",{"subsent":subsent,"subsentType":subsentType,"sentId":sentId},mouseOnFunc)

}
/////////////////////////End functions for mouseMove

////////////////////////Functions for html to json and back
function htmlToJson(el,obj){
    var type = $(el).attr("name")
    switch (type){
        case "neg":
            obj.type = "neg"
            obj.a = {}
            htmlToJson($(el).children()[0],obj.a)
            break;
        case "lit":
            obj.type = "lit"
            obj.lit = el.textContent
            break;
        default:
            if($(el).attr("name")){obj.type = $(el).attr("name") } else {obj.type=""}
            var a = $(el).children()[0]
            var b = $(el).children()[1]
            if(a){
                obj.a={}
                htmlToJson(a,obj.a)
            }
            if(b){
                obj.b={}
                htmlToJson(b,obj.b)
            }
            break;
    }
}
function jsonToHtml(obj,el,n){
    switch(obj.type){
        case "neg":
            $(el).attr("name","neg")
            $(el).attr("id",n)
            $(el).html("~<span></span>")
            jsonToHtml(obj.a,$(el).children()[0],n+"a")
            break;
        case "":
            $(el).attr("id",n)
            $(el).html("<span></span>")
            jsonToHtml(obj.a,$(el).children()[0],n+"a")
            break;
        case "lit":
            $(el).attr("name","lit")
            $(el).attr("id",n)
            $(el).text(obj.lit)
            break;
        default:
            var t = obj.type
            $(el).attr("name",t)
            $(el).attr("id",n)
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


function run(){
    $("#d1-").remove()
    $("body").append("<div id='d1-' class = 'fol'></div>")
    var myHtmlDiv = document.getElementById("d1-")
    var s = $("#formula").val()
    folStringToHtml(s,myHtmlDiv)
    
    var obj = {}
    htmlToJson(myHtmlDiv,obj)
    console.log(obj)
    console.log(JSON.stringify(obj))
    $("#d2-").remove()
    $("body").append("<div id='d2-' class = 'fol'></div>")
    var fromJson = document.getElementById("d2-")
    jsonToHtml(obj,fromJson,"d2-")
    
    var obj2 = {}
    htmlToJson(fromJson,obj2)
    console.log(obj2)
    console.log(JSON.stringify(obj2))
    $("#d3-").remove()
    $("body").append("<div id='d3-' class = 'fol'></div>")
    var thereAndBack = document.getElementById("d3-")
    jsonToHtml(obj2,thereAndBack,"d3-")
    
    $(".fol").each(function(){
        addListeners(this)
    })
    
    //var myObj = folParse(s)
    //console.log(myObj)
}