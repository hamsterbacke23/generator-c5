<div class="control-group">
  <label for="omcontents[{{index}}][<%=field.key%>]" class="control-label"><?=t('<%=blockhandle%>.label.<%=field.key%>')?></label>
  <div class="controls">
    <input type="text" name="omcontents[{{index}}][<%=field.key%>]" value="{{<%=field.key%>}}" class="<%=_.slugify(field.key)%>">
  </div>
</div>
