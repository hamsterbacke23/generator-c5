<?php  defined('C5_EXECUTE') or die(_("Access Denied."));
// Sprache finden
define('PAGE_LANG','de');

// CSS Body Classes
$bodyClasses  = $c->getCollectionTypeHandle();
$bodyClasses .= ($c->isEditMode())?' editMode':'';

// User Logged in?
$u = new User();
$bodyClasses .= ($u->isLoggedIn())?' isLoggedIn':'';

?><!doctype html>
<!--[if lt IE 7]> <html class="no-js lt-ie9 lt-ie8 lt-ie7" lang="<?php echo PAGE_LANG?>"> <![endif]-->
<!--[if IE 7]>    <html class="no-js lt-ie9 lt-ie8" lang="<?php echo PAGE_LANG?>"> <![endif]-->
<!--[if IE 8]>    <html class="no-js lt-ie9" lang="<?php echo PAGE_LANG?>"> <![endif]-->
<!--[if gt IE 8]><!--> <html class="no-js" lang="<?php echo PAGE_LANG?>"> <!--<![endif]-->
<head>
<meta charset="<?php  echo APP_CHARSET?>">
<meta name="viewport" content="width=device-width, initial-scale=1">

 <link href='http://fonts.googleapis.com/css?family=Open+Sans:400italic,400,600,700' rel='stylesheet' type='text/css'>
 <link rel="stylesheet" href="<?php echo $this->getThemePath(); ?>/css/style.css">
 <script src="<?php  echo $this->getThemePath(); ?>/js/modernizr-2.6.2-respond-1.1.0.min.js"></script>

<!-- === Header Required === -->
<?php  Loader::element('header_required'); ?>
<!-- === Header Required === -->

<?php // here come dependencies from bower.json "dependencies" ?>
<?php // <!-- bower:js --> ?>
<?php // <!-- endbower --> ?>

<%if(responsiveImages){%>
<?php
///////////////////////////
// responsive images //
///////////////////////////
$bpHelper    = Loader::helper('required_assets','sb_images');
$breakpoints = $bpHelper->getBreakpoints();
$bpPrint = str_replace('|',',',$breakpoints);
echo "<script> var SCREEN_RESOLUTIONS = [".$bpPrint."]; </script>";
//end responsive images//
?>
<%}//endif%>

<?php
/* bei Bedarf einblenden
<link rel="shortcut icon" href="/favicon.ico" type="image/x-icon">
<link rel="icon" href="/favicon.ico" type="image/x-icon">

<link rel="apple-touch-icon" href="<?php  echo $this->getThemePath(); ?>/img/logo_57.png" />
<link rel="apple-touch-icon" sizes="72x72" href="<?php  echo $this->getThemePath(); ?>/img/logo_72.png" />
<link rel="apple-touch-icon" sizes="114x114" href="<?php  echo $this->getThemePath(); ?>/img/logo_114.png" />
<link rel="apple-touch-icon" sizes="144x144" href="<?php  echo $this->getThemePath(); ?>/img/logo_144.png" />
*/?>

</head>
<body class="<?php echo $bodyClasses?>">
