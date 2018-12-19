<?php
$filexml='phones.xml';
if (file_exists($filexml)) {
  $xml = simplexml_load_file($filexml);
  $f = fopen('phones.csv', 'w');
  foreach ($xml->phone as $phone) {
    fputcsv($f, get_object_vars($phone),',','"');
  }
  fclose($f);
}

?>
