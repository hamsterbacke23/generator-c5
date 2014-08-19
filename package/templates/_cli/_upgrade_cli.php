<?php
chdir(__DIR__);
require __DIR__ .'/init.php';  //do not remove

$pkgHandle = '<%=pkghandle%>';

class CliUpdate extends Concrete5_Controller_Dashboard_Extend_Update
{
  public function update_package_cli($pkgHandle)
  {
    User::loginByUserID(1);
    $this->error = Loader::helper('validation/error');
    $this->do_update($pkgHandle);
  }
}

$ci = new CliUpdate();
$ci->update_package_cli($pkgHandle);
if ($ci->error->has()) {
  $ci->error->output();
  exit;
}

