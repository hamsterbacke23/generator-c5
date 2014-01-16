<?php
chdir(__DIR__);
require dirname(dirname(__DIR__)) .'/index_cli.php';  //do not remove

$pkgHandle = '<%=pkghandle%>';

class cliInstall extends Concrete5_Controller_Dashboard_Extend_Install {
  public function install_package_cli($pkgHandle) {
    User::loginByUserID(1);
    $this->error = Loader::helper('validation/error');
    $this->install_package($pkgHandle);
  }
}

$ci = new cliInstall();
$ci->install_package_cli($pkgHandle);
if($ci->error->has()) {
  $ci->error->output();
  exit;
}
