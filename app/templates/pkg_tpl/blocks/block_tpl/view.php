<? defined('C5_EXECUTE') or die("Access Denied."); ?>

<% _.each(fields, function(field) { %>
<% if(field.viewhtml != '') { %>
<%=field.viewhtml%>
<% }else if(field.type == 'tiny') { %>

<?php if($<%=field.key%>) {?>
<?=$<%=field.key%>?>
<?php }//endif?>

<%} else {%>

<?php if($<%=field.key%>) {?>
<?=htmlspecialchars($<%=field.key%>, ENT_QUOTES, 'utf-8', false)?>
<?php }//endif?>

<% } //fieldtype endif%>
<%});%>


<% if(image == true) { %>
<?php
//////////////////////////////////////////////
// MOVE THIS TO THEME HEADER and uncomment: //
//////////////////////////////////////////////
// $bpHelper    = Loader::helper('required_assets','sb_images');
// $breakpoints = $bpHelper->getBreakpoints();
// $bpPrint = str_replace('|',',',$breakpoints);
// echo "<script> var SCREEN_RESOLUTIONS = [".$bpPrint."]; </script>";
/////////
// END //
/////////
?>
<% } // endif%>
