<?php defined('C5_EXECUTE') or die("Access Denied.");
$form = Loader::helper('form');
<% if(linkintern == true ) { %>$pageSelector = Loader::helper('form/page_selector');<% } %>
<% if(fileselector == true ) { %>$al = Loader::helper('concrete/asset_library');<% } %>
////////////////////////////////////////////////
// Mustache Template to be used in js as well //
////////////////////////////////////////////////
?>

<div class="collection-group">
  <h3 class="handle">row</h3>
  <div class="form-row panel">

    <% _.each(omfields, function(field) { %><%=field.omformhtml %><% }); %>

    {{#id}}
      <input type="hidden" name="omcontents[{{index}}][id]" value="{{id}}">
    {{/id}}

    <input type="hidden" name="omcontents[{{index}}][delete]" class="deleterowinput">

  </div>

  <div class="editactions">
    <a href="#" class="remove_handle ccm-sitemap-clear-selected-page">
      <img src="<?= ASSETS_URL_IMAGES ?>/icons/remove.png"  />
    </a>
    <a href="#" class="sort_handle">
      <img src="<?= ASSETS_URL_IMAGES ?>/icons/up_down.png" class="sort_handle" height="14" width="14" style="cursor:move;">
    </a>
  </div>

</div>
