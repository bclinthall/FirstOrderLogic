<?php
$mysql_host = "mysql4.000webhost.com";
$mysql_database = "a1344409_sum2012";
$mysql_user = "a1344409_bch24";
$mysql_password = "222webhost";
$table_name = "a1344409_sum2012";
$con = mysql_connect($mysql_host,$mysql_user,$mysql_password);
if (!$con)
  {
  die('Could not connect: ' . mysql_error());
  }

// Create table
mysql_select_db("summer2012", $con);
$sql = "CREATE TABLE Proofs 
(
proofID int NOT NULL AUTO_INCREMENT,
PRIMARY KEY(proofID),
Name varchar(15),
Date DATE(),
Time TIME(),
Proofhtml TEXT()
)";

// Execute query
mysql_query($sql,$con);

mysql_close($con);
?>