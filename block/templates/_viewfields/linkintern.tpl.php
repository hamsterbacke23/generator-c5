<?php
//// <%=field.type%> <%=field.key%> ////
$link<%=field.key%> = $<%=field.key%> ? $this->controller->getPageLink($<%=field.key%>) : array();
Loader::packageElement('link','sb_links', array('link' => $link<%=field.key%>));
?>
