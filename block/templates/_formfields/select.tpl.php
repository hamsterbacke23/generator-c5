<div class="control-group radio-group">
  <?php echo $form->label('<%=field.key%>', t('<%=blockhandle%>.label.<%=field.key%>'))?>
  <div class="controls">
    <?php
    echo $form->select('<%=field.key%>', array(
      ''      => t('<%=blockhandle%>.select.<%=field.key%>'),
      'yes'   => t('yes'),
      'no'    => t('no'),
      'maybe' => t('maybe')
    ), $<%=field.key%>);?>
  </div>
</div>
