<?php
defined('C5_EXECUTE') or die(_("Access Denied."));

class omRecord extends ADOdb_Active_Record {

  public function __construct($tbl = null) {
    if ($tbl) {
      $db = Loader::db();
      $this->_table = $tbl;
      parent::__construct($tbl);
    }
  }

}
