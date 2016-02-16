function setCookie(c_name,value,exdays){
    var exdate=new Date();
    exdate.setDate(exdate.getDate() + exdays);
    var c_value=escape(value) + ((exdays==null) ? "" : "; expires="+exdate.toUTCString());
    document.cookie=c_name + "=" + c_value;
}
function getCookie(c_name)
{
    var i,x,y,ARRcookies=document.cookie.split(";");
    for (i=0;i<ARRcookies.length;i++)
    {
        x=ARRcookies[i].substr(0,ARRcookies[i].indexOf("="));
        y=ARRcookies[i].substr(ARRcookies[i].indexOf("=")+1);
        x=x.replace(/^\s+|\s+$/g,"");
        if (x==c_name){
            return unescape(y);
        }
    }
}

function checkCookie(){
var username=getCookie("username");
    if (username!=null && username!=""){
        $("#studentName").val(username);
    }else{
        username=prompt("Please enter your name:","");
        if (username!=null && username!="")    {
            setCookie("username",username,365);
            $("#studentName").val(username);
        }
    }
}
function confirmSubmit(){
    var proofHtml = $("#proof").html()
    ////console.log(proofHtml)
    proofHtml = escape(proofHtml)
    //console.log(proofHtml)
    var r = confirm("Submit your proof to Clint now?")
    if(r){
        var myAsgn = prompt("Enter the assgnment date in dd-mm format.","06-01")
        var myPrb = prompt("Enter the problem number, for example 3.")
        $.ajax({
            type: "POST",
            url: "../proofSubmitted2.php",
            async: "false",
            data: {
                proofHTML: proofHtml,
                asgn: myAsgn,
                prb: myPrb,
                studentName: $("#studentName").val()
            },
            error: function (data){
                alert("Proof submission did not work.  Try again.");
            },
            success: function (data){
                alert("Proof submitted successfully!");
            }
        })
    }
    setTimeout(showSubmitted,1000)
    return false
}
function showSubmitted(){
    if($("#studentName").val()!="homework"){
        $.ajax({
                type: "POST",
                url: "../showSubmitted.php",
                data: {
                    studentName: $("#studentName").val()
                },
                error: function (data){
                    alert("Proof submission did not work.  Try again.");
                },
                success: function (data){
                    $("#submitted").html(data);
                }
      
        })
    }
}
function updateAsgn(id){
    $.ajax({
        type:"POST",
        url: "../updateAsgn.php",
        data:{
            proofID: id,
            asgn: $("#asgn"+id).val(),
            prb: $("#prb"+id).val()
        },
        success: function (data){
            //console.log(data)
            setTimeout(showSubmitted,1000)
        }
    })
}

function showHelp(){
    $(".help").show()
    $(".showHelp").hide()
}
function hideHelp(){
    $(".help").hide()
    $(".showHelp").show()
}



