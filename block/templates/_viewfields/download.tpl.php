<?php
//// <%=field.type%> <%=field.key%> ////

if($<%=field.key%>) {
$fileData = $this->controller->getFileData($<%=field.key%>);
extract($fileData);

//check permissions
$fp = new Permissions($fileObject);

if ($fp->canViewFile()) {

  $c = Page::getCurrentPage();
  if($c instanceof Page) {
    $cID = $c->getCollectionID();
  }

if(!($fileObject->error > 0)) { ?>
<dl class="download clearfix">
  <dt>
    <a href="<?php echo View::url('/download_file/force', $<%=field.key%>, $cID) ?>" target="_blank"><?php echo stripslashes($linkText) ?></a>
  </dt>
  <dd>
    <dl>
      <dt>
        <?php echo t('Format')?>&#058;
      </dt>
      <dd>
        <?php echo isset($ftype) ? $ftype : '';?>
      </dd>
      <dt>
        <?php echo t('Größe')?>&#058;
      </dt>
      <dd>
        <?php echo isset($size) ? $size : '';?>
      </dd>
      <dt>
        <?php echo t('Aktualisiert')?>&#058;
      </dt>
      <dd>
        <?php if(isset($fdate)) { ?>
          <time datetime="<?php echo date('Y-m-d', strtotime($fdate));?>"><?php echo date('d.m.Y', strtotime($fdate));?></time>
        <?php } ?>
      </dd>
    </dl>
  </dd>
</dl>
<?php
    } else{
      $fp = FilePermissions::getGlobal();
      if ($fp->canAddFiles()) {
        echo '<span class="error fileError">' . t('Ein Dateifehler ist aufgetreten. Eventuell ist eine Datei nicht mehr vorhanden.') . '</span>';
      }
    } //endif error
  } //endif canView
} //endif file
?>
