<div class="control-group radio-group">
  <p><strong><?php echo t('<%=blockhandle%>.label.<%=field.key%>.auswahl') ?></strong></p>
  <label class="radio">
    <?php echo $form->radio('<%=field.key%>', '', $<%=field.key%>) ?>
    <?php echo t('<%=blockhandle%>.label.keineauswahl') ?>
  </label>
  <label class="radio">
    <?php echo $form->radio('<%=field.key%>', 'option1', $<%=field.key%>)?>
    <?php echo t('<%=blockhandle%>.label.<%=field.key%>.option1') ?>
  </label>
  <label class="radio">
    <?php echo $form->radio('<%=field.key%>', 'option2', $<%=field.key%>)?>
    <?php echo t('<%=blockhandle%>.label.<%=field.key%>.option2') ?>
  </label>
  <label class="radio">
    <?php echo $form->radio('<%=field.key%>', 'option3', $<%=field.key%>)?>
    <?php echo t('<%=blockhandle%>.label.<%=field.key%>.option3') ?>
  </label>
</div>


