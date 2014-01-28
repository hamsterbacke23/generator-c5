<div class="control-group">
  <label class="control-label" for="<%=field.key%>"><?= t('<%=blockhandle%>.label.<%=field.key%>')?></label>
  <div class="controls">
    {{#datetime<%=field.key%>}}
      {{{datetime<%=field.key%>}}}
    {{/datetime<%=field.key%>}}

    {{^datetime<%=field.key%>}}
    <?php echo Loader::helper('form/date_time')->datetime('<%=field.key%>', $<%=field.key%>); ?>
    {{/datetime<%=field.key%>}}
  </div>
</div>
