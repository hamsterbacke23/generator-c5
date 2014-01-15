<?php
defined('C5_EXECUTE') or die("Access Denied.");
<% if(tiny == true ) { %>
require_once('tiny_controller.php');
<% } %>
<% if(om == true){ %>
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
  <% if(om == true){ %>
  //one to many stuff
  protected $pkgHandle    = '<%=pkghandle%>';
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

  <% if(om == true || tiny == true){ %>

  public function edit() {
    <% if(om == true){ %>
    $this->setOmForm();
    <% } %>
    <% if(tiny == true){ %>
    $this->setupTinys();
    <% } %>
  }

  public function add() {
    <% if(om == true){ %>
    $this->setOmForm();
    <% } %>
    <% if(tiny == true){ %>
    $this->setupTinys();
    <% } %>
  }
  <% } %>

  <% if(om == true || image == true){ %>
  public function view() {
    <% if(om == true){ %>
    $this->setOmContent();
    <% } %>

    <% if(image == true){ %>
    <% _.each(_.uniq(images), function(imageKey) { %>
    $this->set('<%=imageKey%>Img', $this->buildImage($this-><%=imageKey%>));
    <% }); %>
    <% } %>
  }
  <% } %>


  <% if(tiny == true){ %>
  private function setupTinys()
  {
    <% _.each(_.uniq(tinys), function(tinykey) { %>
    $this-><%=blockhandle%><%=tinykey%>Tiny = new <%=blockhandle%>Tiny($this-><%=tinykey%>);
    <% }); %>
  }

  public function save($args)
  {
    $tiny = new <%=blockhandle%>Tiny();
    <% _.each(_.uniq(tinys), function(tinykeyb) { %>
    $<%=tinykeyb%> = $tiny->translateTo($args['<%=tinykeyb%>']);
    $args['<%=tinykeyb%>'] = $<%=tinykeyb%>;
    <% }); %>
    <% _.each(_.uniq(checkboxes), function(cbkey) { %>
    $args['<%=cbkey%>'] = isset($args['<%=cbkey%>']) && $args['<%=cbkey%>'] == 'on' ? 1 : 0;
    <% }); %>


    parent::save($args);
  }
  <% } //tiny true %>

  public function validate($args) {
    $e = Loader::helper('validation/error');

    <% _.each(fields, function(field) { %>
    <% if(field.required) { %>
    if (trim($args['<%=field.key%>']) == '') {
      $e->add(t('<%=blockhandle%>.error.<%=field.key%>fehlt'));
    }
    <% } %>
    <% }); %>

    <% if(om == true){ %>
    foreach ($args[$this->omKey] as $item) {
      <% _.each(omfields, function(omfield) { %>
        <% if(omfield.required) { %>
        if (trim($item['<%=field.key%>']) == '') {
          $e->add(t('<%=blockhandle%>.error.<%=field.key%>fehlt'));
          break;
        }
        <% } %>
      <% });%>
    }
    <% } %>
    return $e;
  }

  <% if(image == true){ %>
  private function buildImage($fID, $attrs = false)
  {
   $ih = Loader::helper('image_builder', 'sb_images');
   $ih->addAssets($this);
   $img = $ih->getImageFromId($fID, $attrs);

   return $img;
  }
  <% } %>



  <% if(download == true){ %>
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


  <% if(linkintern == true){ %>
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
      // 'fensterHinweis'  => $this->target,
      // 'displayTitleTag' => $this->title,
      // 'position'        => $this->position,
      // 'style'           => $this->style,
      'linkType'        => 'intern',
      'class'           => 'btn'
    );
    return $link;
  }
  <% } %>


}



?>
