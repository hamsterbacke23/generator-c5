<?php
//// <%=field.type%> <%=field.key%> ////
$link<%=field.key%> = $<%=field.key%> ? $this->controller->getPageLink($<%=field.key%>) : array();

if($link<%=field.key%>['showError'] && $link<%=field.key%>['errorMsg']) {
  echo $link<%=field.key%>['errorMsg'];
}

if($link<%=field.key%>) {
  echo '<a href="' . $link<%=field.key%>['url'] . '">';
  echo $link<%=field.key%>['displayLinkText'];
  echo '</a>';
}
?>
