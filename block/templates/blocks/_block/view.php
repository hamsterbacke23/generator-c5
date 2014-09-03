<?php defined('C5_EXECUTE') or die("Access Denied."); ?>
<% if(plainimage) { %>
<?php
$im = Loader::helper('image');
$attrh = Loader::helper('lang_attributes','sb_images');
?>
<%} // endif%>

<% _.each(fields, function(field) { %>
<% if(field.viewhtml != '') { %>
<%=field.viewhtml%>
<% }else if(field.type == 'tiny') { %>

<?php
//// <%=field.type%> <%=field.key%> ////
if ($<%=field.key%>) {
    echo $<%=field.key%>;
}//endif
?>

<%} else {%>

<?php
//// <%=field.type%> <%=field.key%> ////
if($<%=field.key%>) {
  echo htmlspecialchars($<%=field.key%>, ENT_QUOTES, 'utf-8', false);
}//endif
?>

<% } //fieldtype endif%>
<%});%>

<% if(om) { %>
<?php if (isset($omcontents) && !empty($omcontents)) { ?>
<ul>
  <?php
    foreach ($omcontents as $row) {
      extract($row); //generator-c5 note: this needs check if something is overwritten ?>
    <li>

    <% _.each(omfields, function(field) { %>
    <% if(field.viewhtml != '') { %>
    <%=field.viewhtml%>
    <% } else if(field.type == 'tiny') { %>

    <?php
    //// <%=field.type%> <%=field.key%> ////
    if($<%=field.key%>) {
      echo $<%=field.key%>;
    }//endif
    ?>

    <%} else {%>

    <?php
    //// <%=field.type%> <%=field.key%> ////
    if($<%=field.key%>) {
      echo htmlspecialchars($<%=field.key%>, ENT_QUOTES, 'utf-8', false);
    }//endif
    ?>

    <% } //fieldtype endif%>
    <%});%>

    </li>
  <?php }//endforeach ?>
</ul>
<?php }//endif ?>
<% } // endif%>

<% if(responsiveimage) { %>
<?php
//////////////////////////////////////////////
// MOVE THIS TO THEME HEADER and uncomment: //
//////////////////////////////////////////////
// $bpHelper    = Loader::helper('required_assets', 'sb_images');
// $breakpoints = $bpHelper->getBreakpoints();
// $bpPrint = str_replace('|', ',', $breakpoints);
// echo 'var SB_GLOBAL_VARS = SB_GLOBAL_VARS || {};';
// echo "SB_GLOBAL_VARS.screenResolutions = [".$bpPrint."]; ";
/////////
// END //
/////////
?>
<% } // endif%>
