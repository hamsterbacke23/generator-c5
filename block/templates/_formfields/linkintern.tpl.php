<div class="control-group radio-group">
  <label class="control-label" for="<%=field.key%>"><?php echo  t('<%=blockhandle%>.label.<%=field.key%>')?></label>
  <div class="controls">
     <?php echo $pageSelector->selectPage('<%=field.key%>', $<%=field.key%>,'ccm_selectSitemapNode');?>
  </div>
</div>
