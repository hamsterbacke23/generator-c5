<div class="control-group">
  <?=$form->label('<%=field.key%>', t('<%=blockhandle%>.label.<%=field.key%>'))?>
  <div class="controls">
    <?php
    echo $form->select('<%=field.key%>', array(
      'yes'   => t('yes'),
      'no'    => t('no'),
      'maybe' => t('maybe')
    ), $<%=field.key%>);?>
  </div>
</div>
