<?php
    $pw = $_POST['pass'];
    if($pw=="222webhost"){
        $mysql_host = "mysql4.000webhost.com";
        $mysql_database = "a1344409_sum2012";
        $mysql_user = "a1344409_bch24";
        $mysql_password = "222webhost";
         
        $con = mysql_connect($mysql_host,$mysql_user,$mysql_password);
        if (!$con)
          {
          die('Could not connect: ' . mysql_error());
          }
        
        mysql_select_db($mysql_database, $con);
        
        $result = mysql_query("SELECT * FROM Proofs ORDER BY Name, Assignment, Problem, Date, Time");
        
        while($row = mysql_fetch_array($result)){
            $proofId = $row['ProofID'];
            $problem = $row['Problem'];
            $assignment = $row["Assignment"];
            $problem = $row["Problem"];
            $input =   "<label for='asgn".$proofId."'>Assignment ('mm-dd'): </label><input type='text' id='asgn".$proofId."' class='asgnInput' value='".$assignment."'><br>
                        <label for='prb".$proofId."'>Problem Number: </label><input type='text' id='prb".$proofId."' class='asgnInput' value='".$problem."'> 
                        <input type='button' value='OK' onClick='updateAsgn(".$proofId.")'>";
            echo "<br><br><div class='asgnInfo asgnInfo".$proofId."'>";
            echo $input."<br>" ;
            echo "</div>";
            echo $row['Proof'];
            echo "</span></span></div>";
        }
        mysql_close($con);
    }else{
        echo "Wrong Password.  Try again.";
    }
?>