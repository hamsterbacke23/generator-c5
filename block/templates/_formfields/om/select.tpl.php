<div class="control-group radio-group">
  <?=$form->label('omcontents[{{index}}][<%=field.key%>]', t('<%=blockhandle%>.label.<%=field.key%>'))?>
  <div class="controls">
    <?php
    echo $form->select('omcontents[{{index}}][<%=field.key%>]', array(
      ''      => t('<%=blockhandle%>.select.<%=field.key%>'),
      'yes'   => t('yes'),
      'no'    => t('no'),
      'maybe' => t('maybe')
    ), $data['<%=field.key%>']);?>
  </div>
</div>
