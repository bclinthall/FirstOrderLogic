<?php
    $mysql_host = "mysql4.000webhost.com";
    $mysql_database = "a1344409_sum2012";
    $mysql_user = "a1344409_bch24";
    $mysql_password = "222webhost";
    $name = $_POST["studentName"];
    $asgn = $_POST["asgn"];
    $prb = $_POST["prb"];
    $date = date("y-m-d");
    $time = date("H:i:s");
    $proof = urldecode($_POST["proofHTML"]);
    $html = '<div class="nameTime"><span class="name">'.$name.'</span><br><span class="date">'.$date.'</span><br><span class="time">'.$time.'</span></div>'.$proof;
     
    $con = mysql_connect($mysql_host,$mysql_user,$mysql_password);
    if (!$con)
      {
      die('Could not connect: ' . mysql_error());
      }
    
    mysql_select_db($mysql_database, $con);
    
    $sql = 'INSERT INTO `a1344409_sum2012`.`Proofs` (`ProofID`, `Name`, `Date`, `Time`, `Proof`,`Assignment`, `Problem`) VALUES (NULL, \''.$name.'\', CURDATE(), CURTIME(), \''.$html.'\', \''.$asgn.'\', \''.$prb.'\');'; 
    
    mysql_query($sql);

    mysql_close($con);
?>