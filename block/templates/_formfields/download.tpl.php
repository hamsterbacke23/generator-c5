<div class="control-group">
  <?=$form->label('<%=field.key%>', t('<%=blockhandle%>.label.<%=field.key%>')) ?>
  <div class="controls">
    <?php $fileObject<%=field.key%> =  File::getByID($<%=field.key%>); ?>
    <?=$al->file('<%=field.key%>', '<%=field.key%>', t('<%=blockhandle%>.openfilemanager'), $fileObject<%=field.key%>); ?>
  </div>
</div>
