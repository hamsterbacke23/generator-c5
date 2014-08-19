<div class="control-group radio-group">
  <label for="omcontents[{{index}}][<%=field.key%>]" class="control-label"><?php echo t('<%=blockhandle%>.label.<%=field.key%>')?></label>
  <div class="controls">
    <input type="text" name="omcontents[{{index}}][<%=field.key%>]" value="{{<%=field.key%>}}" class="<%=_.slugify(field.key)%>">
  </div>
</div>
