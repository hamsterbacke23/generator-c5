<?php
defined('C5_EXECUTE') or die("Access Denied.");
<% if(tiny ) { %>
require_once('tiny_controller.php');
<% } %>
<% if(om){ %>
require_once('om_controller.php');
class <%=blockcchandle%>BlockController extends <%=blockcchandle%>OneToManyController {
<% } else { %>
class <%=blockcchandle%>BlockController extends BlockController {
<% } %>
  protected $btTable                              = 'bt<%=blockcchandle%>';
  protected $btInterfaceWidth                     = "450";
  protected $btInterfaceHeight                    = "450";
  protected $btWrapperClass                       = 'ccm-ui';
  protected $btCacheBlockRecord                   = true;
  protected $btCacheBlockOutput                   = true;
  protected $btCacheBlockOutputOnPost             = true;
  protected $btCacheBlockOutputForRegisteredUsers = true;
  <% if(om){ %>
  //one to many stuff
  protected $omTable      = 'bt<%=blockcchandle%>Content';
  protected $omKey        = 'omcontents';
  // protected $omCheckboxes = array('displayIcon','displayCaption'); // edit and uncomment me if you use checkboxes!
  <% } %>

  public function getBlockTypeName() {
    return t('<%=blockcchandle%>');
  }

  public function getBlockTypeDescription() {
    return t('<%=blockdesc.trim()%>');
  }

  <% if(om || tiny){ %>
  public function getPkgHandle()
  {
    if(!isset($this->pkgHandle) || !$this->pkgHandle){
      $blockType = BlockType::getByHandle($this->btHandle);
      $this->pkgHandle = $blockType->getPackageHandle();
    }
    return $this->pkgHandle;
  }
  <% } %>

  <% if(om){ %>
  public function edit() {
    <% if(om){ %>
    $this->setOmForm();
    <% } %>
  }

  public function add() {
    <% if(om){ %>
    $this->setOmForm();
    <% } %>
  }
  <% } %>

  <% if(om || image){ %>
  public function view() {
    <% if(om){ %>
    $this->setOmContent();
    <% } %>

    <% if(image){ %>
    <% _.each(_.uniq(images), function(imageKey) { %>
    $this->set('<%=imageKey%>Img', $this->buildImage($this-><%=imageKey%>));
    <% }); %>
    <% } %>
  }
  <% } %>


  <% if(tiny || datetime){ %>
  public function save($args)
  {
    <% _.each(_.uniq(checkboxes), function(cbkey) { %>
    $args['<%=cbkey%>'] = isset($args['<%=cbkey%>']) && $args['<%=cbkey%>'] == 'on' ? 1 : 0;
    <% }); %>

    <% if(tiny){ %>
    $tiny = new <%=blockhandle%>Tiny();
    <% _.each(_.uniq(tinys), function(tinykeyb) { %>
    if(isset($args['<%=tinykeyb%>'])) {
      $<%=tinykeyb%> = $tiny->translateTo($args['<%=tinykeyb%>']);
      $args['<%=tinykeyb%>'] = $<%=tinykeyb%>; //normal c5 translate
    }
    <% }); %>

    <% if(om){ %>
    $i = 0;
    foreach ($args[$this->omKey] as $item) {
    <% _.each(_.uniq(tinys), function(tinykeyb) { %>
    if(isset($args[$this->omKey][$i]['<%=tinykeyb%>'])) {
      $args[$this->omKey][$i]['<%=tinykeyb%>'] = $tiny->translateTo($item['<%=tinykeyb%>']); //row tiny c5 translate
    }
    <% }); %>
     $i++;
    }
    <% } //om true %>

    <% } //tiny true %>

    <% if(datetime){ %>
    $dtt = Loader::helper('form/date_time');
    <% _.each(_.uniq(datetimes), function(datetimekey) { %>
    $args['<%=datetimekey%>'] = $dtt->translate('<%=datetimekey%>');
    <% }); %>
    <% } //datetime true %>

    parent::save($args);
  }
  <% } //tiny or datetime true %>

  <% if(requiredFields){ %>
  public function validate($args) {
    $e = Loader::helper('validation/error');

    <% _.each(fields, function(field) { %>
    <% if(field.required) { %>
    if (!trim($args['<%=field.key%>'])) {
      $e->add(t('<%=blockhandle%>.error.<%=field.key%>fehlt'));
    }
    <% } %>
    <% }); %>

    <% if(om){ %>
    foreach ($args[$this->omKey] as $item) {
      if($item['delete'] == 'yes') {
        continue;
      }
      <% _.each(omfields, function(omfield) { if(typeof omfield != 'undefined' && omfield.required) { %>
      if (!trim($item['<%=omfield.key%>'])) {
        $e->add(t('<%=blockhandle%>.error.<%=omfield.key%>fehlt'));
      }
      <% } });%>
    }
    <% } %>
    return $e;
  }
  <% } //requiredFields %>


  <% if(image){ %>
  private function buildImage($fID, $attrs = false)
  {
   $ih = Loader::helper('image_builder', 'sb_images');
   $ih->addAssets($this);
   $img = $ih->getImageFromId($fID, $attrs);

   return $img;
  }
  <% } %>



  <% if(download){ %>
  public function getFileData($fID)
  {
    $fileObject = File::getByID($fID);
    $fileObjectApproved = $fileObject->getApprovedVersion();
    $fsize = $fileObjectApproved->getFullSize();
    return array(
      'fileObject' => $fileObject,
      'size' => $this->formatBytes($fsize, 0),
      'fdate' => $fileObjectApproved->getDateAdded(),
      'ftype' =>  $fileObjectApproved->getType(),
      'linkText' =>  $fileObjectApproved->getFileName()
    );
  }

  function formatBytes($bytes, $precision = 2) {
      $units = array(
          'Bytes',
          'Kilobytes',
          'Megabytes',
          'Gigabytes',
          'Terabytes'
      );
      $unitKeys = array(
          'b',
          'kb',
          'mb',
          'gb',
          'tb'
      );
      $base = log($bytes) / log(1024);
      $resultString = round(pow(1024, $base - floor($base)), $precision) . ' <abbr title="' . $units[floor($base)] . '">' . $unitKeys[floor($base)] . '</abbr>';
      return $resultString;
  }
  <% } %>


  <% if(linkintern){ %>
  /**
   * Creates a link from the cid
   * @param $bcID the collection ID
   * @return string
   */
  public function getPageLink($bcID)
  {
    Loader::model('linkinfo', 'sb_links');
    $linkInfo = new LinkInfo($bcID);

    $link = array(
      'url'             => $linkInfo->getPageUrl(),
      'showError'       => $linkInfo->showLinkError(),
      'active'          => $linkInfo->isActive(),
      'errorMsg'        => $linkInfo->getLinkError(),
      'displayLinkText' => $linkInfo->getPageTitle(),
      'linkType'        => 'intern',
      'class'           => 'btn'
    );
    return $link;
  }
  <% } %>


}



?>
