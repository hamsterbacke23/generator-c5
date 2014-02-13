<div class="control-group radio-group">
  <textarea class="advancedEditor ccm-advanced-editor" name="<%=field.key%>" style="width: 580px; height: 250px">
    <?php $tiny<%=field.key%> = new <%=blockhandle%>Tiny($<%=field.key%>); ?>
    <?php echo htmlspecialchars($tiny<%=field.key%>->getContentEditMode())?>
  </textarea>
</div>
