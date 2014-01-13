<?php
defined('C5_EXECUTE') or die(_("Access Denied."));

class <%=pkgcchandle+'Package'%> extends Package
{
  protected $pkgHandle = '<%=pkghandle%>';
  protected $dependencies = array(<%=dependencies%>);
  protected $appVersionRequired = '5.3.2';
  protected $pkgVersion = '<%=pkgversion%>';
  protected $blockHandles = array('<%=blockhandle%>');

  public function getPackageName()
  {
    return t('<%=pkgcchandle%>');
  }

  public function getPackageDescription()
  {
    return t('<%=pkgdesc.trim()%>');
  }

  public function install()
  {
    $this->checkDependencies();
    $pkg = parent::install();
    foreach ($this->blockHandles as $blockHandle) {
      BlockType::installBlockTypeFromPackage($blockHandle, $pkg);
    };
  }

  public function upgrade()
  {
    $this->checkDependencies();
    parent::upgrade();

    Loader::model('block_types');
    $pkg = parent::getByHandle($this->pkgHandle);

    foreach ($this->blockHandles as $blockHandle) {
      if(!is_object(BlockType::getByHandle($blockHandle)))
      {
        BlockType::installBlockTypeFromPackage($blockHandle, $pkg);
      }
    }
  }

  public function checkDependencies()
  {
    $deps = array_filter($this->dependencies);
    if(empty($deps)){
      return;
    }

    foreach ($this->dependencies as $dp) {
      $pre_pkg = Package::getByHandle($dp);
      if (!is_object($pre_pkg)){
        throw new Exception (t('Prerequisite package ' . implode(', ', $this->dependencies) . ' required'));
      }
    }

  }
}
