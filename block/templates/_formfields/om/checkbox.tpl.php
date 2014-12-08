<div class="control-group">
  <label class="control-label" for="omcontents[{{index}}][<%=field.key%>]"><?php echo  t('<%=blockhandle%>.label.<%=field.key%>')?></label>
  <div class="controls">
    {{#<%=field.key%>}}
    <input type="checkbox" name="omcontents[{{index}}][<%=field.key%>]" checked="true">
    {{/<%=field.key%>}}

    {{^<%=field.key%>}}
    <input type="checkbox" name="omcontents[{{index}}][<%=field.key%>]" >
    {{/<%=field.key%>}}
  </div>
</div>
