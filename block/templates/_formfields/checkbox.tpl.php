<div class="form-group">
    <?php echo $form->label('<%=field.key%>', t('<%=blockhandle%>.label.<%=field.key%>')) ?>
    <?php $checked = $<%=field.key%> ? ' checked' : '';?>
    <input type="checkbox" name="<%=field.key%>" <?php echo $checked?>>
</div>
