<?php
$link<%=field.key%> = $this->controller->getPageLink($<%=field.key%>);
Loader::packageElement('link','sb_links', array('link' => $link<%=field.key%>));
?>
