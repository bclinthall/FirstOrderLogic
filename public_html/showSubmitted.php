<?php
    $mysql_host = "mysql4.000webhost.com";
    $mysql_database = "a1344409_sum2012";
    $mysql_user = "a1344409_bch24";
    $mysql_password = "222webhost";
    $name = $_POST["studentName"];
    $asgnDate = $_POST["asgn"];
    $password = $_POST["password"];
    $ok = false;
     
    if($name=="homework"){
        switch($asgnDate){
            case "06-07":
                if ($password=="0607Hobbes"){$ok=true;}
                break;
            case "06-11":
                if ($password=="0611Protagoras"){$ok=true;}
                break;
            case "06-12":
                if ($password=="0611Hegel"){$ok=true;}
                break;
            case "06-14":
                if ($password=="0614Spinoza"){$ok=true;}
                break;
            case "07-03":
                if ($password=="0703Thales"){$ok=true;}
                break;
        }
    }else{
        $ok=true;
    }
    if($ok==false){echo "invalid password";}else{
        $con = mysql_connect($mysql_host,$mysql_user,$mysql_password);
        if (!$con)
          {
          die('Could not connect: ' . mysql_error());
          }
        
        mysql_select_db($mysql_database, $con);
        
        $qry = "SELECT * FROM Proofs WHERE Name='".$name."'";
        if($asgnDate){
            $qry = $qry."AND Assignment='".$asgnDate."'";
        }
        
        
        $result = mysql_query($qry);
        
        while($row = mysql_fetch_array($result))
        {
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
    }
?>