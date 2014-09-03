<?php
defined('C5_EXECUTE') or die("Access Denied.");


/**
 * One-to-many controller
 * Dont edit, extend me
 *
 * What does it do?
 * - Overwrites concrete5 standard block save, duplicate, delete functions
 * - Handles Mustache Row Templates
 *
 * @author  <@seitenbau.com>
 * @since  0.1
 */
abstract class <%=blockcchandle%>OneToManyController extends BlockController{

    protected $omTable      = '';
    protected $omKey        = '';
    protected $omCheckboxes = array();
    protected $rowTplName = 'row';

    /**
     * Set one to many content
     *
     * @return  void
     */
    public function setOmContent()
    {
        $omContents = $this->getomcontents();
        usort($omContents, array($this,'cmp'));
        $this->set($this->omKey, $omContents);
    }

    /**
     * Set one to many form
     *
     * @return  void
     */
    public function setOmForm()
    {
        $this->setOmContent();
        $template = $this->loadMustacheTemplate('row');
        $this->set('rowtpl', $template);
        $this->set('controller', $this);
    }

    /**
     * Compare Helper to compare sorting
     *
     * @param integer $a sort integer
     * @param integer $b sort integer
     *
     * @return boolean    if greater or not
     */
    private function cmp($a, $b)
    {
        return $a['sort'] > $b['sort'];
    }

    /**
     * Loads Mustache Template, optionally data can be passed
     *
     * @param string $name Template name
     * @param array  $data Data to be filled into Template
     *
     * @return string
     */
    private function loadMustacheTemplate($name, $data = array())
    {
        ob_start();
        Loader::packageElement(
            $name,
            $this->getPkgHandle(),
            array('data' => $data)
        );
        $mustacheTemplate =  ob_get_contents();
        ob_end_clean();

        return $mustacheTemplate;
    }

    /**
     * Render Mustache Template function
     *
     * @param array $data data to be filled into template
     *
     * @return string
     */
    public function renderMustacheTemplate($data = array())
    {
        //setup default data
        if (empty($data)) {
            $data = array('index'=>'0');
        }

        $template = $this->loadMustacheTemplate($this->rowTplName, $data); //existing data needs to be prefilled via php with $data

        Loader::library('Mustache', $this->getPkgHandle());
        $m = new Mustache_Engine;
        return $m->render($template, $data);
    }

    /**
     * Save Override
     *
     * @param array $args Arguments to be saved
     *
     * @return void
     */
    public function save($args)
    {
        if (isset($args[$this->omKey]) && !empty($args[$this->omKey])) {
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
     * @param integer $newBID new bID
     *
     * @return  boolean duplication result
     */
    public function duplicate($newBID)
    {
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
     *
     * @return  void
     */
    public function delete()
    {
        if ($this->bID > 0) {
            $contents = $this->getomcontents();
            if (!empty($contents)) {
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
     *
     * @param array $args Arguments
     *
     * @return  array $args
     */
    public function mapCheckboxes($args)
    {
        foreach ($this->omCheckboxes as $key) {
            if (!$args[$key]) {
                $args[$key] = 0;
            } else {
                $args[$key] = 1;
            }
        }
        return $args;
    }

    /**
     * Copy from BlockController
     *
     * @param array   $args Arguments
     * @param integer $bID  Block ID
     *
     * @return void
     */
    public function doOmRow($args, $bID = false)
    {
        if ($this->omTable) {
            Loader::model('om_record', $this->getPkgHandle());

            $db          = Loader::db();
            $columns     = $db->GetCol('show columns from `' . $this->omTable . '`');
            $record      = new <%=blockcchandle%>OmRecord($this->omTable);

            $args = $this->mapCheckboxes($args);

            //set columns
            foreach ($columns as $key) {
                if (isset($args[$key])) {
                    $record->{$key} = $args[$key];
                }
            }

            $record->bID = $bID ? $bID : $this->bID;

            //delete or update
            if ($args['delete'] == 'yes') {
                if (isset($args['id'])) {
                    $record->Delete();
                }
            } else {
                $record->Replace();
            }
        }
    }

    /**
     * Get Om Contens
     *
     * @return array db result
     */
    private function getomcontents()
    {
        $sql = sprintf(
            'SELECT * FROM %s ' .
            'WHERE  bID = %d',
            $this->omTable,
            $this->bID
        );
        $db = Loader::db();
        $dbResult = $db->GetAll($sql);

        return $dbResult;
    }
}
