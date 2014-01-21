<?php
chdir(__DIR__);
require dirname(__DIR__) .'/index_cli.php';  //do not remove

$pkgHandle = '<%=pkghandle%>';

class cliUpdate extends Concrete5_Controller_Dashboard_Extend_Update {
  public function update_package_cli($pkgHandle) {
    User::loginByUserID(1);
    $this->error = Loader::helper('validation/error');
    $this->do_update($pkgHandle);
  }
}

$ci = new cliUpdate();
$ci->update_package_cli($pkgHandle);
if($ci->error->has()) {
  $ci->error->output();
  exit;
}

