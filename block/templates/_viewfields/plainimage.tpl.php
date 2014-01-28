<?php
if($<%=field.key%>) {
$imgWidth = 640;
$imgHeight = 480;
$<%=field.key%>f  = File::getByID($<%=field.key%>);
echo $im->outputThumbnail($<%=field.key%>f, $imgWidth, $imgHeight, 'image alt text');
}
?>
