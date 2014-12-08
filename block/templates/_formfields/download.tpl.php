<div class="form-group">
    <?php echo $form->label('<%=field.key%>', t('<%=blockhandle%>.label.<%=field.key%>')) ?>
    <?php
    $fileObject<%=field.key%> =  File::getByID($<%=field.key%>);
    echo $al->file('<%=field.key%>', '<%=field.key%>', t('<%=blockhandle%>.openfilemanager'), $fileObject<%=field.key%>);
    ?>
</div>
