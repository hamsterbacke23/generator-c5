<div class="form-group">
  <textarea class="advancedEditor ccm-advanced-editor" name="<%=field.key%>" id="<%=field.key%>" style="width: 580px; height: 250px">
    <?php $tiny<%=field.key%> = new <%=blockcchandle%>Tiny($<%=field.key%>); ?>
    <?php echo htmlspecialchars($tiny<%=field.key%>->getContentEditMode())?>
  </textarea>
</div>
