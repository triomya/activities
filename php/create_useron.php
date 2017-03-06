<?php
header('Content-type: text/html; charset=utf-8');

// HERE add your data for connecting to MySQ database
$host = 'localhost';           // MySQL server address
$user = 'root';                // User name
$pass = 'password';            // User`s password
$dbname = 'database';          // Database name

// connect to the MySQL server
$conn = new mysqli($host, $user, $pass, $dbname);

// check connection
if (mysqli_connect_errno()) exit('Connect failed: '. mysqli_connect_error());

// sql query for CREATE "userson" TABLE
$sql = "CREATE TABLE `userson` (
 `uvon` VARCHAR(32) PRIMARY KEY,
 `dt` INT(10) UNSIGNED NOT NULL
 ) CHARACTER SET utf8 COLLATE utf8_general_ci"; 

// Performs the $sql query on the server to create the table
if ($conn->query($sql) === TRUE) echo 'Table "userson" successfully created';
else echo 'Error: '. $conn->error;

$conn->close();
?>

2. - Now we create the script that Inserts, Deletes, and Selects data in the "userson" table (For explanations about the code, see the comments in script).
- Add the code below in another php file (named "usersmysql.php"):
In both file you must add your personal data for connecting to MySQL database, in the variables: $host, $user, $pass, and $dbname .
The code for usersmysql.php

<?php
// Script Online Users and Visitors - coursesweb.net/php-mysql/
if(!isset($_SESSION)) session_start();         // start Session, if not already started

// HERE add your data for connecting to MySQ database
$host = 'localhost';           // MySQL server address
$user = 'root';                // User name
$pass = 'password';            // User`s password
$dbname = 'database';          // Database name

/*
 If you have an user registration script,
 replace $_SESSION['nume'] with the variable in which the user name is stored.
 You can get a free registration script from:  http://coursesweb.net/php-mysql/register-login-script-users-online_s2
*/

// get the user name if it is logged, or the visitors IP (and add the identifier)
$vst_id = '-vst-';         // an identifier to know that it is a visitor, not logged user
$uvon = isset($_SESSION['nume']) ? $_SESSION['nume'] : $_SERVER['SERVER_ADDR']. $vst_id;

$rgxvst = '/^([0-9\.]*)'. $vst_id. '/i';         // regexp to recognize the rows with visitors
$dt = time();                                    // current timestamp
$timeon = 120;             // number of secconds to keep a user online
$nrvst = 0;                                     // to store the number of visitors
$nrusr = 0;                                     // to store the number of usersrs
$usron = '';                                    // to store the name of logged users

// connect to the MySQL server
$conn = new mysqli($host, $user, $pass, $dbname);

// Define and execute the Delete, Insert/Update, and Select queries
$sqldel = "DELETE FROM `userson` WHERE `dt`<". ($dt - $timeon);
$sqliu = "INSERT INTO `userson` (`uvon`, `dt`) VALUES ('$uvon', $dt) ON DUPLICATE KEY UPDATE `dt`=$dt";
$sqlsel = "SELECT * FROM `userson`";

// Execute each query
if(!$conn->query($sqldel)) echo 'Error: '. $conn->error;
if(!$conn->query($sqliu)) echo 'Error: '. $conn->error;
$result = $conn->query($sqlsel);

// if the $result contains at least one row
if ($result->num_rows > 0) {
  // traverse the sets of results and set the number of online visitors and users ($nrvst, $nrusr)
  while($row = $result->fetch_assoc()) {
    if(preg_match($rgxvst, $row['uvon'])) $nrvst++;       // increment the visitors
    else {
      $nrusr++;                   // increment the users
      $usron .= '<br/> - <i>'.$row['uvon']. '</i>';          // stores the user's name
    }
  }
}

$conn->close();                  // close the MySQL connection

// the HTML code with data to be displayed
$reout = '<div id="uvon"><h4>Online: '. ($nrusr+$nrvst). '</h4>Visitors: '. $nrvst. '<br/>Users: '. $nrusr. $usron. '</div>';

// if access from <script>, with GET 'uvon=showon', adds the string to return into a JS statement
// in this way the script can also be included in .html files
if(isset($_GET['uvon']) && $_GET['uvon']=='showon') $reout = "document.write('$reout');";

echo $reout;             // output /display the result
?>