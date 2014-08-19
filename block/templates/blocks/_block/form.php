<?php defined('C5_EXECUTE') or die("Access Denied.");
<% if(linkintern ) { %>$pageSelector = Loader::helper('form/page_selector');<% } %>
<% if(fileselector ) { %>$al = Loader::helper('concrete/asset_library');<% } %>
<% if(tiny ) { %>Loader::packageElement('editor_config', $this->controller->getPkgHandle(), array('textEditorHeight'=>250));<% } %>
?>
<% if(!tabs) {%>
<% _.each(fields, function(field) { %>
<%=field.formhtml %>
<% }); %>
<%}%>

<% if(om) {%>
<?php $this->inc('om_form.php', array('controller'=>$controller)); ?>
<%}%>

<% // TABS %>
<% if(tabs) {%>
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
  echo Loader::helper('concrete/interface')->tabs($tabs);
?>

<div class="tab-content">
<% _.each(tabfields, function(tab, index) { %>
<section id="ccm-tab-content-<%='tab'+index%>" style="display:none">
<% _.each(tab, function(field) { %>
<%=field.formhtml %>
<% }); %>
</section>
<% }); %>
</div>

<%}//tabs true%>

<% if(datetime) { %>
<?php
///////////////////////////////////////////////////////////////////////////
// DATEPICKER                                                            //
// move this to site/config.php and uncomment                            //
// define('DATE_FORM_HELPER_FORMAT_HOUR', 24);                           //
// define('DATE_APP_GENERIC_MDY', 'd.m.Y'); // fuer PHP Ausgaben         //
// define('DATE_APP_DATE_PICKER', 'dd.mm.yy'); // fuer jQuery Datepicker //
///////////////////////////////////////////////////////////////////////////
 ?>
<%}//datetime true%>
