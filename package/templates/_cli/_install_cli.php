<?php
chdir(__DIR__);
require __DIR__ .'/init.php';  //do not remove

$pkgHandle = '<%=pkghandle%>';

class CliInstall extends Concrete5_Controller_Dashboard_Extend_Install
{
  public function install_package_cli($pkgHandle)
  {
    User::loginByUserID(1);
    $this->error = Loader::helper('validation/error');

    $pkg = Package::getByHandle($pkgHandle);
    if (!is_object($pkg)) {
      $this->install_package($pkgHandle);
    }
  }
}

$ci = new CliInstall();
$ci->install_package_cli($pkgHandle);
if ($ci->error->has()) {
  $ci->error->output();
  exit;
}
