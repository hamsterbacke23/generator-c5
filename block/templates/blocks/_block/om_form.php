<?php defined('C5_EXECUTE') or die("Access Denied.");

<% if (download == true || image == true) { %>
$al = Loader::helper('concrete/asset_library');
<% } %>

<% if (linkintern == true) { %>
$pageSelector = Loader::helper('form/page_selector');
<% } %>

$this->inc('formstyles.inc.css');
?>

<template class="rowtpl"><?=$rowtpl?></template>

<section class="omcontents sortable-links">
  <?php
  $i = 0;
  if(!empty($omcontents)) {
    foreach ($omcontents as $row) {
      $row['index']        = $i;

      <% _.each(omfields, function(field) { %>
      <% if (field.type == 'image' || field.type == 'plainimage') { %>
      $fileobject          = $row['<%=field.key%>'] > 0 ? File::getByID($row['<%=field.key%>']) : 0;
      $row['fileselector<%=field.key%>'] = $al->image('ccm-b-<%=field.type%>'.$i, 'omcontents['.$i.'][<%=field.key%>]', t('choose.<%=field.type%>'), $fileobject);
      <% } %>
      <% if (field.type == 'download') { %>
      $fileobject          = $row['<%=field.key%>'] > 0 ? File::getByID($row['<%=field.key%>']) : 0;
      $row['fileselector<%=field.key%>'] = $al->file('ccm-b-<%=field.type%>'.$i, 'omcontents['.$i.'][<%=field.key%>]', t('choose.<%=field.type%>'), $fileobject);
      <% } %>
      <% if (field.type == 'linkintern') { %>
      $row['pageselector<%=field.key%>'] = $pageSelector->selectPage('omcontents['.$i.'][<%=field.key%>]', $row['<%=field.key%>'],'ccm_selectSitemapNode');
      <% } %>
      <% }); %>

      echo $this->controller->renderMustacheTemplate($rowtpl,$row);
      $i++;
    }//endforeach
  } else {
    $row['index']   = $i;
    $row['heading'] = 'Neue Slide';
    echo $this->controller->renderMustacheTemplate($rowtpl,$row);
  }//endif ?>
</section>

<button class="addrow"><?=t('<%=blockhandle%>.button.addrow')?><img src="<?= ASSETS_URL_IMAGES ?>/icons/add.png" class="addicon" height="14" width="14"></button>

<div class="clearBoth"></div>


