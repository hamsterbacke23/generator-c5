<?php
defined('C5_EXECUTE') or die(_('Access Denied.'));

/**
 * Helps to install pagetypes programmatically,
 * otherwise not needed
 */
class PagetypesHelper
{
  protected $pageTypes = array(
    <% _.each(pageTypes, function(pageType) { %>
    '<%=pageType.key%>' => '<%=pageType.value%>',
    <% }); %>
  );

  public function installPageTypes()
  {
    foreach ($this->pageTypes as $key => $value) {
      Loader::model('collection_types');
      // install  page types
      $pt = CollectionType::getByHandle('your_page_type');
      if(!$pt || !intval($pt->getCollectionTypeID())){
        $pt = CollectionType::add(array('ctHandle'=> $key, 'ctName'=> t($value)),$pkg);
      }
    }
  }

}
