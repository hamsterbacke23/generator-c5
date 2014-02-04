<?php
if($textEditorHeight<100)  $textEditorHeight=380;
else $textEditorHeight= $textEditorHeight-70;

if (!isset($editor_selector)) {
  $editor_selector = 'ccm-advanced-editor';
}

if (isset($editor_height)) {
  $textEditorHeight = $editor_height;
}

if (isset($editor_width)) {
  $textEditorWidth = $editor_width;
}
?>
<script language="javascript">
$(function(){
  tinyMCE.init({
    language : 'de',
    mode : "textareas",
    width: "100%",
    height: "<?php echo $textEditorHeight?>px",
    inlinepopups_skin : "concreteMCE",
    theme_concrete_buttons2_add : "spellchecker",
    relative_urls : false,
    document_base_url: '<?php echo BASE_URL . DIR_REL?>/',
    convert_urls: false,
    plugins: "table,xhtmlxtras,paste",
    editor_selector : "<?php echo $editor_selector?>",
    paste_auto_cleanup_on_paste : true,     // for paste plugin
    paste_convert_middot_lists : true,      // for paste plugin
    paste_strip_class_attributes : "all",  // for paste plugin
    paste_remove_styles : true,             // for paste plugin
    paste_remove_styles_if_webkit : true,   // for paste plugin
    paste_text_linebreaktype : "br",        // for paste plugin
    paste_text_sticky : true,               // for paste plugin
    theme_advanced_blockformats : "p,h2,h3",
    theme : "advanced",
    theme_advanced_buttons1 : "undo,redo,|,bold,bullist,numlist",
    // theme_advanced_buttons2 : "tablecontrols,|,help,attribs,removeformat",
    // theme_advanced_buttons1 : "undo,redo,|,bold,bullist,numlist,|,link,unlink,anchor,|,blockquote,cite,abbr,|,pastetext,selectall",
    // theme_advanced_buttons2 : "tablecontrols,|,help,attribs,removeformat",
    theme_advanced_buttons2 : "",
    theme_advanced_buttons3 : "",
    theme_advanced_toolbar_location : "top",
    theme_advanced_toolbar_align : "left",
    setup : function(ed) { //activate paste plugin button on init
        ed.onInit.add(function(ed) {
            ed.pasteAsPlainText = true;
        });
    }
  });
});
</script>
