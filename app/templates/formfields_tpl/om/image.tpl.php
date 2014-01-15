<div class="control-group">
  <label class="control-label" for="<%=field.key%>"><?= t('<%=blockhandle%>.label.<%=field.key%>')?></label>
  <div class="controls">
    {{#fileselector<%=field.key%>}}
      {{{fileselector<%=field.key%>}}}
    {{/fileselector<%=field.key%>}}

    {{^fileselector<%=field.key%>}}
      <?=$al->image('ccm-b-image{{index}}', 'omcontents[{{index}}][<%=field.key%>]', t('Choose File'));?>
    {{/fileselector<%=field.key%>}}
  </div>
</div>
