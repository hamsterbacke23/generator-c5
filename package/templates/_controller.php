<?php
defined('C5_EXECUTE') or die(_("Access Denied."));

class <%=pkgcchandle+'Package'%> extends Package
{
  protected $pkgHandle = '<%=pkghandle%>';
  protected $dependencies = array(<%=dependencies%>);
  protected $appVersionRequired = '5.6.1';
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
    <% if(dependencies) {%>$this->checkDependencies();<% } %>
    $pkg = parent::install();
    if(!empty($this->blockHandles)) {
      foreach ($this->blockHandles as $blockHandle) {
        BlockType::installBlockTypeFromPackage($blockHandle, $pkg);
      };
    }
    <% if(themehandle) { %>
    PageTheme::add('<%=themehandle%>', $pkg);
    <% } %>
  }

  public function upgrade()
  {
    <% if(dependencies) {%>$this->checkDependencies();<% } %>
    parent::upgrade();

    Loader::model('block_types');
    $pkg = parent::getByHandle($this->pkgHandle);

    if(!empty($this->blockHandles)) {
      foreach ($this->blockHandles as $blockHandle) {
        if(!is_object(BlockType::getByHandle($blockHandle)))
        {
          BlockType::installBlockTypeFromPackage($blockHandle, $pkg);
        }
      }
    }
  }

  <% if(dependencies) {%>
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
  <% } %>

}
