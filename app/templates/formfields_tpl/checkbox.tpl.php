<div class="control-group">
  <?=$form->label('<%=field.key%>', t('<%=blockhandle%>.label.<%=field.key%>')) ?>
  <div class="controls">
    <?php $checked = $<%=field.key%> ? ' checked' : '';?>
    <input type="checkbox" name="<%=field.key%>" <?=$checked?>>
  </div>
</div>
