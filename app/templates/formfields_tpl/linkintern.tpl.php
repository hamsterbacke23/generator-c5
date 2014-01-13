<div class="control-group">
  <label class="control-label" for="<%=field.key%>"><?= t('<%=blockhandle%>.label.<%=field.key%>')?></label>
  <div class="controls">
     <?=$pageSelector->selectPage('<%=field.key%>', $<%=field.key%>,'ccm_selectSitemapNode');?>
  </div>
</div>
