<?php
defined('C5_EXECUTE') or die("Access Denied.");

////////////////////////////
// one to many controller //
// dont edit, extend me   //
////////////////////////////

abstract class <%=blockcchandle%>OneToManyController extends BlockController{

  protected $omTable      = '';
  protected $pkgHandle    = '';
  protected $omKey        = '';
  protected $omCheckboxes = array();

  public function setOmContent()
  {
    $omContents = $this->getomcontents();
    usort($omContents, array($this,'cmp'));
    $this->set($this->omKey, $omContents );
  }

  public function setOmForm()
  {
    $this->setOmContent();
    $template = $this->loadMustacheTemplate('row');
    $this->set('rowtpl', $template);
  }

  private function cmp($a,$b)
  {
    return $a['sort'] > $b['sort'];
  }

  /**
   * @param  string $name
   * @return string
   */
  private function loadMustacheTemplate($name)
  {
    ob_start();
    Loader::packageElement(
      $name,
      $this->pkgHandle
    );
    $mustacheTemplate =  ob_get_contents();
    ob_end_clean();
    return $mustacheTemplate;
  }

  /**
   * @param  string $template
   * @param  array  $data
   * @return string
   */
  public function renderMustacheTemplate($template, $data)
  {
    Loader::library('Mustache', $this->pkgHandle);
    $m = new Mustache;
    return $m->render($template, $data);
  }


  public function save($args)
  {
    if(isset($args[$this->omKey]) && !empty($args[$this->omKey])) {
      $i = 0;
      foreach ($args[$this->omKey] as $item) {
        $item['sort'] = $i;
        $this->doOmRow($item);
        $i++;
      }
    }
    parent::save($args);
  }

  /**
   * Important: On Duplicate make sure omcontent is transferred as well
   *
   * @param  int $newBID new bID
   */
  public function duplicate($newBID) {
    if ($this->omTable) {
      $contents = $this->getomcontents();
      $i = 0;
      foreach ($contents as $key => $value) {
        //set vars
        unset($contents[$key]['id']);
        $contents[$key]['bID']  = $newBID;
        $contents[$key]['sort'] = $i;
        //map
        $contents[$key] = $this->mapCheckboxes($contents[$key]);
        //save
        $this->doOmRow($contents[$key]);
        $i++;
      }
    }
    return parent::duplicate($newBID);
  }

  /**
   * Delete Old stuff
   */
  public function delete() {
    if ($this->bID > 0) {
      $contents = $this->getomcontents();
      if(!empty($contents)) {
        foreach ($contents as $key => $item) {
          $contents[$key]['delete'] = 'yes';
          $this->doOmRow($contents[$key]);
        }
      }
      $this->doOmRow($contents[0]);
    }
    parent::delete();
  }

  /**
   * Map checkboxes to correct DB Value
   */
  public function mapCheckboxes($args)
  {
    foreach ($this->omCheckboxes as $key) {
      if(!$args[$key]) {
        $args[$key] = 0;
      } else {
        $args[$key] = 1;
      }
    }
    return $args;
  }

  /**
   * Copy from BlockController
   * @param array $args
   * @return void
   */
  public function doOmRow($args, $bID = false)
  {
    if ($this->omTable) {
      Loader::model('om_record', $this->pkgHandle);

      $db          = Loader::db();
      $columns     = $db->GetCol('show columns from `' . $this->omTable . '`');
      $record      = new omRecord($this->omTable);

      $args = $this->mapCheckboxes($args);

      //set columns
      foreach($columns as $key) {
        if (isset($args[$key])) {
          $record->{$key} = $args[$key];
        }
      }

      $record->bID = $bID ? $bID : $this->bID;

      //delete or update
      if($args['delete'] == 'yes') {

        if(isset($args['id'])) {
          $record->Delete();
        }
      } else {
        $record->Replace();
      }
    }
  }

  private function getomcontents()
  {
    $sql = sprintf(
            'SELECT * FROM %s ' .
            'WHERE  bID = %d'
             , $this->omTable, $this->bID);
    $db = Loader::db();
    $dbResult = $db->GetAll($sql);

    return $dbResult;
  }
}
