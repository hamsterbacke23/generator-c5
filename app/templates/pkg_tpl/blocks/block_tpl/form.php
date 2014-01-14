<?php defined('C5_EXECUTE') or die("Access Denied.");
<% if(linkintern == true ) { %>$pageSelector = Loader::helper('form/page_selector');<% } %>
<% if(fileselector == true ) { %>$al = Loader::helper('concrete/asset_library');<% } %>
<% if(tiny == true ) { %>Loader::packageElement('editor_config', 'sb_texteditor', array('textEditorHeight'=>250));<% } %>
?>

<% _.each(fields, function(field) { %>
<%=field.formhtml %>
<% }); %>

<% if(om == true ) {%>
<?php $this->inc('om_form.php', array('controller'=>$controller)); ?>
<%}%>
