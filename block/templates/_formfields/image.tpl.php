<div class="control-group radio-group">
  <?php echo $form->label('<%=field.key%>', t('<%=blockhandle%>.label.<%=field.key%>')) ?>
  <div class="controls">
    <?php
    $fileObject<%=field.key%> =  File::getByID($<%=field.key%>);
    echo $al->image('<%=field.key%>', '<%=field.key%>', t('<%=blockhandle%>.openfilemanager'), $fileObject<%=field.key%>);
    ?>
  </div>
</div>
