<?php
$imgWidth = 640;
$imgHeight = 480;
$f  = File::getByID($<%=field.key%>);
$fv = $f->getApprovedVersion();
echo $im->outputThumbnail($f, $imgWidth, $imgHeight, 'image alt text');
?>
