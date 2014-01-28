<div class="control-group">
  <?php echo $form->label('<%=field.key%>', t('<%=blockhandle%>.label.<%=field.key%>'))?>
  <div class="controls">
    <?php echo Loader::helper('form/date_time')->datetime('<%=field.key%>', $<%=field.key%>); ?>
  </div>
</div>
