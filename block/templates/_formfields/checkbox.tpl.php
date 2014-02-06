<div class="control-group radio-group">
  <?php echo $form->label('<%=field.key%>', t('<%=blockhandle%>.label.<%=field.key%>')) ?>
  <div class="controls">
    <?php $checked = $<%=field.key%> ? ' checked' : '';?>
    <input type="checkbox" name="<%=field.key%>" <?php echo $checked?>>
  </div>
</div>
