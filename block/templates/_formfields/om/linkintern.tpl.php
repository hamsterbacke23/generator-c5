<div class="control-group radio-group">
  <label class="control-label" for="omcontents[{{index}}][<%=field.key%>]"><?php echo  t('<%=blockhandle%>.label.<%=field.key%>')?></label>
  <div class="controls">
    <?php
    echo $pageSelector->selectPage('omcontents[{{index}}][<%=field.key%>]', $data['<%=field.key%>'],'ccm_selectSitemapNode');
    ?>
  </div>
</div>
