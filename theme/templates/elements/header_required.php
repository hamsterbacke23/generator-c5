<?php
defined('C5_EXECUTE') or die("Access Denied.");
global $c;
global $cp;
global $cvID;

if (is_object($c)) {
  $pageTitle       = (!$pageTitle) ? $c->getCollectionName() : $pageTitle;
  $pageDescription = (!$pageDescription) ? $c->getCollectionDescription() : $pageDescription;
  $cID             = $c->getCollectionID();
  $isEditMode      = ($c->isEditMode()) ? "true" : "false";
  $isArrangeMode   = ($c->isArrangeMode()) ? "true" : "false";
} else {
  $cID = 1;
}
?>
<?php
$akt = $c->getCollectionAttributeValue('meta_title');
$akd = $c->getCollectionAttributeValue('meta_description');
$akk = $c->getCollectionAttributeValue('meta_keywords');



/* Title */
$pageTitle = htmlspecialchars($pageTitle, ENT_COMPAT, APP_CHARSET);
if ($akt) {
  $pageTitle = $akt;
}?>
<title><?= sprintf(PAGE_TITLE_FORMAT, t('header.titelderseite'), $pageTitle)?></title>
<?php
  $u = new User();

  $sDes =  htmlspecialchars($pageDescription, ENT_COMPAT, APP_CHARSET);
  if ($akd) {
    $sDes =  htmlspecialchars($akd, ENT_COMPAT, APP_CHARSET);
  }
  echo '<meta name="description" content="'. $sDes .'" />'."\n";

  if ($akk) {
    echo '<meta name="keywords" content="'. htmlspecialchars($akk, ENT_COMPAT, APP_CHARSET) .'" />'."\n";
  }

  if($c->getCollectionAttributeValue('exclude_search_index')) {
    echo '<meta name="robots" content="noindex" />';
  }

  if($u->isLoggedIn() && defined('APP_VERSION_DISPLAY_IN_HEADER') && APP_VERSION_DISPLAY_IN_HEADER) {
    echo '<meta name="generator" content="concrete5 - '.  APP_VERSION . '" />'."\n";
  }

  if ($u->isLoggedIn()) {
    echo '<script type="text/javascript">';
      echo "var CCM_DISPATCHER_FILENAME = '" . DIR_REL . '/' . DISPATCHER_FILENAME . "';\n";
      echo "var CCM_CID = ".($cID?$cID:0).";\n";
    if (isset($isEditMode)) {
      echo "var CCM_EDIT_MODE = ". $isEditMode .";\n";
      echo "var CCM_ARRANGE_MODE = ". $isArrangeMode .";\n";
    }
    echo "var CCM_IMAGE_PATH = '".ASSETS_URL_IMAGES."';\n";
    echo "var CCM_TOOLS_PATH = '".REL_DIR_FILES_TOOLS_REQUIRED."';\n";
    echo "var CCM_BASE_URL = '".BASE_URL."';\n";
    echo "var CCM_REL = '".DIR_REL."';\n";
    echo '</script>';
  }

$html = Loader::helper('html');
$u->isLoggedIn() ? $this->addHeaderItem($html->css('ccm.base.css'), 'CORE') : '';
$this->addHeaderItem($html->javascript('jquery.js'), 'CORE');
$u->isLoggedIn() ? $this->addHeaderItem($html->javascript('ccm.base.js', false, true), 'CORE') : '';

$favIconFID=intval(Config::get('FAVICON_FID'));
$appleIconFID =intval(Config::get('IPHONE_HOME_SCREEN_THUMBNAIL_FID'));
$modernIconFID = intval(Config::get('MODERN_TILE_THUMBNAIL_FID'));
$modernIconBGColor = strval(Config::get('MODERN_TILE_THUMBNAIL_BGCOLOR'));

if($favIconFID) {
  $f = File::getByID($favIconFID); ?>
  <link rel="shortcut icon" href="<?php  echo $f->getRelativePath()?>" type="image/x-icon" />
  <link rel="icon" href="<?php  echo $f->getRelativePath()?>" type="image/x-icon" />
<?php  }

if($appleIconFID) {
  $f = File::getByID($appleIconFID); ?>
  <link rel="apple-touch-icon" href="<?php  echo $f->getRelativePath()?>"  />
<?php  }

if($modernIconFID) {
	$f = File::getByID($modernIconFID);
	?><meta name="msapplication-TileImage" content="<?php  echo $f->getRelativePath(); ?>" /><?php
	echo "\n";
	if(strlen($modernIconBGColor)) {
		?><meta name="msapplication-TileColor" content="<?php  echo $modernIconBGColor; ?>" /><?php
		echo "\n";
	}
}

if (is_object($cp)) {

  if ($this->editingEnabled()) {
    Loader::element('page_controls_header', array('cp' => $cp, 'c' => $c));
  }

  if ($this->areLinksDisabled()) {
    $this->addHeaderItem('<script type="text/javascript">window.onload = function() {ccm_disableLinks()}</script>', 'CORE');
  }
  $cih = Loader::helper('concrete/interface');
  if ($cih->showNewsflowOverlay()) {
    $this->addFooterItem('<script type="text/javascript">$(function() { ccm_showDashboardNewsflowWelcome(); });</script>');
  }

}

print $this->controller->outputHeaderItems();
$_trackingCodePosition = Config::get('SITE_TRACKING_CODE_POSITION');
if (empty($disableTrackingCode) && $_trackingCodePosition === 'top') {
  echo Config::get('SITE_TRACKING_CODE');
}
echo $c->getCollectionAttributeValue('header_extra_content');




