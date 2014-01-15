<?php defined('C5_EXECUTE') or die("Access Denied.");
<% if(linkintern == true ) { %>$pageSelector = Loader::helper('form/page_selector');<% } %>
<% if(fileselector == true ) { %>$al = Loader::helper('concrete/asset_library');<% } %>
<% if(tiny == true ) { %>Loader::packageElement('editor_config', 'sb_texteditor', array('textEditorHeight'=>250));<% } %>
?>
<% if(tabs != true ) {%>
<% _.each(fields, function(field) { %>
<%=field.formhtml %>
<% }); %>
<%}%>

<% if(om == true ) {%>
<?php $this->inc('om_form.php', array('controller'=>$controller)); ?>
<%}%>

<% // TABS %>
<% if(tabs == true ) {%>
<h4 class="kacheltitel"><?php echo t('tile.entertitle')?></h4>
<?php
  $tabs = array(
    array('tab0', t('Tab 0'), true),
    <% _.each(tabfields, function(tab, index) { %>
    <% if(index > 0) {%>
    array('<%='tab'+index%>', t('<%='Tab '+index%>')),
    <%}%>
    <% }); %>
  );

  if (isset($canUserEditEtrackerElements) && $canUserEditEtrackerElements === true) {
    $tabs[] = array('etracker', t('Etracker'));
  }
  echo Loader::helper('concrete/interface')->tabs($tabs);
?>

<div class="tab-content">
<% _.each(tabfields, function(tab, index) { %>
<section id="ccm-tab-content-<%='tab'+index%>">
<% _.each(tab, function(field) { %>
<%=field.formhtml %>
<% }); %>
</section>
<% }); %>
</div>

<%}//tabs true%>
