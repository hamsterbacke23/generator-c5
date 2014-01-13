<div class="control-group">
  <textarea class="advancedEditor ccm-advanced-editor" name="<%=field.key%>" style="width: 580px; height: 250px">
    <?=htmlspecialchars($controller-><%=blockhandle%><%=field.key%>Tiny->getContentEditMode())?>
  </textarea>
</div>
