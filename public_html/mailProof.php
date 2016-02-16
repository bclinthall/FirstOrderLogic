<?php
    
    $mysql_host = "mysql4.000webhost.com";
    $mysql_database = "a1344409_sum2012";
    $mysql_user = "a1344409_bch24";
    $mysql_password = "222webhost";
     
    $to = "bclinthall@gmail.com";
    $subject = "Student Proof";

    $header = '
    <html>
        <head>
            <style type="text/css">
                div.column{
                    display: inline-block;
                    margin-left: 5px;
                    vertical-align: top;
                }
                div.cell{
                    padding-bottom: 6px;
                    height:1em;
                    font-family:monospace;
                    font-size:medium;
                }
                #folTable{
                    margin-bottom:12px;
                }
                .x{
                    letter-spacing: 5px;
                    line-height:100%;
                    padding-left:2px;
                }
                
                div.sp{
                    border-top: 1px dotted purple;
                    margin-top: -1px;
                    border-left: 2px solid purple;
                    padding-left: 4px;
                }
                div.sp .cell:first-child{
                    padding-bottom:0px;
                    border-bottom:1px dashed grey;
                    margin-bottom:5px;
                }
                div.sp.closed{
                    border-bottom: 1px dotted purple;
                    margin-bottom: 5px;	
                }
                div.sp.closed .cell:last-child{
                    padding-bottom: 0px;
                }
                div.sp.closed .cell:only-child{
                    padding-bottom: 0px;
                    border-bottom:0px;
                    margin-bottom: 0px;
                }
                div.sp.dead{
                    border-bottom: 1px dotted purple;
                    margin-bottom: 5px;	
                }
                div.sp.dead .cell:last-child{
                    padding-bottom: 0px;
                }
                div.sp.dead .cell:only-child{
                    padding-bottom: 0px;
                    border-bottom:0px;
                    margin-bottom: 0px;
                }
                #conclusion:before{
                    content: "/ therefore, "
                }
                #attribution{
                    margin-left: 10px;
                }
            </style>
        </head>
    <body>
    Proof Submitted <a href="http://www.bch24.site90.com/FOLLogicProgram11/Level1/logic.html">Return to Logic Program</a>';
    $footer ="</body></html>";
    
    $name = $_POST["studentName"];
    $date = date("y-m-d");
    $time = date("H:i:s");
    $proof = urldecode($_POST["htmlTextarea"]);
    $html = '<div class="nameTime"><span class="name">'.$name.'</span><br><span class="date">'.$date.'<span><br><span class="time">'.$time.'</span><br>'.$proof;
    //$html = str_replace('"','\"',$html);
    $test = "I said 'hi'";
    
    $from = "bch@bch24.site90.com";
    $headers = "From:" . $from;
    mail($to,$subject,$name." has submitted a proof",$headers);

$con = mysql_connect($mysql_host,$mysql_user,$mysql_password);
if (!$con)
  {
  die('Could not connect: ' . mysql_error());
  }

mysql_select_db($mysql_database, $con);

$sql = 'INSERT INTO `a1344409_sum2012`.`Proofs` (`ProofID`, `Name`, `Date`, `Time`, `Proof`) VALUES (NULL, \''.$name.'\', CURDATE(), CURTIME(), \''.$html.'\');'; 

mysql_query($sql);


mysql_select_db($mysql_database, $con);

$result = mysql_query("SELECT * FROM Proofs WHERE Name='".$name."'");

echo $header;
while($row = mysql_fetch_array($result))
  {
  echo $row['Proof']; 
  echo "<br><br>";
  }


mysql_close($con);
echo $footer;
?>
