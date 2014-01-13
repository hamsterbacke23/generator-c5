<div class="control-group">
  <label class="control-label" for="<%=field.key%>"><?= t('<%=blockname%>.label.<%=field.key%>')?></label>
  <div class="controls">
   {{#pageselector<%=field.key%>}}
     {{{pageselector<%=field.key%>}}}
   {{/pageselector<%=field.key%>}}

   {{^pageselector<%=field.key%>}}
     <?=$pageSelector->selectPage('<%=field.key%>', 0,'ccm_selectSitemapNode');?>
   {{/pageselector<%=field.key%>}}
  </div>
</div>
