<?php
//// <%=field.type%> <%=field.key%> ////
// Requires responsive.js and var SCREEN_RESOLUTIONS = []
if($<%=field.key%>) {
  $<%=field.key%>Img = $this->controller->buildImage($<%=field.key%>);
  $ih = Loader::helper('image_output', 'sb_images');
  $ih->printEditInlineScript($bID);
  $ih->printImage($<%=field.key%>Img, $bID, true);
}
?>
