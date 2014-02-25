<?php
//bootstrap concrete5 from packages folder
defined('STDIN') or die(_("Access Denied. CLI Only")); //Only allow CLI access.
chdir(dirname(dirname(dirname(__DIR__))));

define('DIR_BASE', '.');
define('C5_ENVIRONMENT_ONLY', true);
require_once('config/site.php');

if (!defined('REDIRECT_TO_BASE_URL')) {
  define('REDIRECT_TO_BASE_URL', false);
}

if (defined('DIRNAME_APP_UPDATED')) {
  $GLOBALS['APP_UPDATED_PASSTHRU'] = true;
  require('updates/' . DIRNAME_APP_UPDATED . '/concrete/dispatcher.php');
} else {
  require('index.php');
}

