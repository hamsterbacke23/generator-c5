<?php
chdir(__DIR__);
require dirname(__DIR__) .'/index_cli.php';  //do not remove

$pkgHandle = '<%=pkghandle%>';

class cliUninstall extends Concrete5_Controller_Dashboard_Extend_Install {
  public function uninstall_package_cli($pkgHandle) {
    User::loginByUserID(1);
    $this->error = Loader::helper('validation/error');

    $pkg = Package::getByHandle($pkgHandle);
    if (!is_object($pkg)) {
      $this->error->add(t('Invalid package.'));
      return false;
    }
    $pkg->uninstall($pkgId);
  }
}

$ci = new cliUninstall();
$ci->uninstall_package_cli($pkgHandle);
if($ci->error->has()) {
  $ci->error->output();
  exit;
} else {
  echo t('The package type has been uninstalled.');
}