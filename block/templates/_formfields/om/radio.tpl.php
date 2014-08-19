<div class="control-group radio-group">
  <p><strong><?php echo t('<%=blockhandle%>.label.<%=field.key%>.auswahl') ?></strong></p>
  <label class="radio">
    <?php echo $form->radio('omcontents[{{index}}][<%=field.key%>]', '', $data['<%=field.key%>']) ?>
    <?php echo t('<%=blockhandle%>.label.keineauswahl') ?>
  </label>
  <label class="radio">
    <?php echo $form->radio('omcontents[{{index}}][<%=field.key%>]', 'option1', $data['<%=field.key%>']) ?>
    <?php echo t('<%=blockhandle%>.label.<%=field.key%>.option1') ?>
  </label>
  <label class="radio">
    <?php echo $form->radio('omcontents[{{index}}][<%=field.key%>]', 'option2', $data['<%=field.key%>']) ?>
    <?php echo t('<%=blockhandle%>.label.<%=field.key%>.option2') ?>
  </label>
  <label class="radio">
    <?php echo $form->radio('omcontents[{{index}}][<%=field.key%>]', 'option3', $data['<%=field.key%>']) ?>
    <?php echo t('<%=blockhandle%>.label.<%=field.key%>.option3') ?>
  </label>
</div>

