<?php
    $mysql_host = "mysql4.000webhost.com";
    $mysql_database = "a1344409_sum2012";
    $mysql_user = "a1344409_bch24";
    $mysql_password = "222webhost";
    $asgn = $_POST["asgn"];
    $prb = $_POST["prb"];
    $proofID = $_POST["proofID"];
     
    $con = mysql_connect($mysql_host,$mysql_user,$mysql_password);
    if (!$con)
      {
      die('Could not connect: ' . mysql_error());
      }
    
    mysql_select_db($mysql_database, $con);
    
    $sql = "UPDATE Proofs SET Assignment='".$asgn."', Problem='".$prb."' WHERE ProofID='".$proofID."'"; 
    
    mysql_query($sql);

    mysql_close($con);
    
    echo $sql
?>