<?php
defined('C5_EXECUTE') or die(_("Access Denied."));

/**
 * ADOdb Record
 *
 * @author
 *
 * @since  0.0.1
 */
class <%=blockcchandle%>OmRecord extends ADOdb_Active_Record {

    /**
     * Constructr
     *
     * @param string $tbl table handle
     */
    public function __construct($tbl = null)
    {
        if ($tbl) {
            $db = Loader::db();
            $this->_table = $tbl;
            parent::__construct($tbl);
        }
    }

}
