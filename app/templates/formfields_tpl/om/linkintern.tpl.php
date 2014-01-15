<div class="control-group">
  <label class="control-label" for="omcontents[{{index}}][<%=field.key%>]"><?= t('<%=blockhandle%>.label.<%=field.key%>')?></label>
  <div class="controls">
   {{#pageselector<%=field.key%>}}
     {{{pageselector<%=field.key%>}}}
   {{/pageselector<%=field.key%>}}

   {{^pageselector<%=field.key%>}}
     <?=$pageSelector->selectPage('omcontents[{{index}}][<%=field.key%>]', 0,'ccm_selectSitemapNode');?>
   {{/pageselector<%=field.key%>}}
  </div>
</div>
