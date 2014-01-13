<div class="control-group">
  <label class="control-label" for="<%=field.key%>"><?= t('<%=blockname%>.label.fID')?></label>
  <div class="controls">
    {{#fileselector<%=field.key%>}}
      {{{fileselector<%=field.key%>}}}
    {{/fileselector<%=field.key%>}}

    {{^fileselector<%=field.key%>}}
      <?=$al-><%=field.type%>('ccm-b-file{{index}}', '<%=field.key%>', t('Choose File'));?>
    {{/fileselector<%=field.key%>}}
  </div>
</div>
