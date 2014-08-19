<?php
//// <%=field.type%> <%=field.key%> ////
if($<%=field.key%>) {
$imgWidth = 640;
$imgHeight = 480;
$<%=field.key%>f  = File::getByID($<%=field.key%>);
$fv = $<%=field.key%>f->getApprovedVersion();
$alt = $attrh->get($fv,'alt');
echo $im->outputThumbnail($<%=field.key%>f, $imgWidth, $imgHeight, $alt);
}
?>
