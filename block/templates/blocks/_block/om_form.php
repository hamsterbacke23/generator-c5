<?php defined('C5_EXECUTE') or die("Access Denied.");

<% if (download || image) { %>
$al = Loader::helper('concrete/asset_library');
<% } %>

<% if (linkintern) { %>
$pageSelector = Loader::helper('form/page_selector');
<% } %>

$this->inc('formstyles.inc.css');
?>

<div class="rowtpl hidden"><?php echo $rowtpl?></div>

<section class="omcontents sortable-links">
<?php
$i = 0;
if (!empty($omcontents)) {
    // render existing rows //
    foreach ($omcontents as $row) {
        $row['index'] = $i;
        echo $this->controller->renderMustacheTemplate($row);
        $i++;
    }//endforeach
} else {
    // render single empty row //
    echo $this->controller->renderMustacheTemplate(); //leave array empty!
}//endif ?>
</section>

<button class="addrow"><?php echo t('<%=blockhandle%>.button.addrow')?><img src="<?php echo  ASSETS_URL_IMAGES ?>/icons/add.png" class="addicon" height="14" width="14"></button>

<div class="clearBoth"></div>


