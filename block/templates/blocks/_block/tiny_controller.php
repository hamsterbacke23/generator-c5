<?php
defined('C5_EXECUTE') or die("Access Denied.");

/**
 * Tiny Controller
 *
 * @author Tobias Schmidt <tobias.schmidt@seitenbau.com>
 * @since  0.0.1
 */
class <%=blockcchandle%>Tiny
{
    protected $content = '';

    /**
     * Set the content for parsing
     *
     * @param string $content text content
     */
    public function __construct($content = '')
    {
        $this->content = $content;
    }

    /**
     * Get Content to display
     *
     * @return string translated content
     */
    public function getContent()
    {
        $content = $this->translateFrom($this->content);
        return $content;
    }


    /**
     * Gets Searchable content to be indexed
     *
     * @return string content
     */
    public function getSearchableContent()
    {
        return $this->content;
    }

    /**
     * <br> to newline
     *
     * @param string $str String to be converted
     *
     * @return string
     */
    private function br2nl($str)
    {
        $str = str_replace("\r\n", "\n", $str);
        $str = str_replace("<br />\n", "\n", $str);
        return $str;
    }

    /**
     * Gets Content for Edit mode
     *
     * @return string
     */
    public function getContentEditMode()
    {
        $content = $this->translateFromEditMode($this->content);
        return $content;
    }

    /**
     * Replaces Placeholders
     *
     * @param object $blockNode Block
     *
     * @return array $args
     */
    public function getImportData($blockNode)
    {
        $args = array();
        $content = $blockNode->data->record->content;

        $content = preg_replace_callback(
            '/\{ccm:export:page:(.*)\}/i',
            array('<%=blockcchandle%>Tiny', 'replacePagePlaceHolderOnImport'),
            $content
        );

        $content = preg_replace_callback(
            '/\{ccm:export:image:(.*)\}/i',
            array('<%=blockcchandle%>Tiny', 'replaceImagePlaceHolderOnImport'),
            $content
        );

        $content = preg_replace_callback(
            '/\{ccm:export:file:(.*)\}/i',
            array('<%=blockcchandle%>Tiny', 'replaceFilePlaceHolderOnImport'),
            $content
        );

        $content = preg_replace_callback(
            '/\{ccm:export:define:(.*)\}/i',
            array('<%=blockcchandle%>Tiny', 'replaceDefineOnImport'),
            $content
        );

        $args['content'] = $content;
        return $args;
    }

    /**
     * Replaces Links with Placeholder
     *
     * @param match $match replace match
     *
     * @return string placeholder with cID
     */
    public static function replacePagePlaceHolderOnImport($match)
    {
        $cPath = $match[1];
        if ($cPath) {
            $pc = Page::getByPath($cPath);
            return '{CCM:CID_' . $pc->getCollectionID() . '}';
        } else {
            return '{CCM:CID_1}';
        }
    }

    /**
     * Replaces Stuff
     *
     * @param match $match replace match
     *
     * @return array? placeholder
     */
    public static function replaceDefineOnImport($match)
    {
        $define = $match[1];
        if (defined($define)) {
            $r = get_defined_constants();
            return $r[$define];
        }
    }

    /**
     * Replaces Image Placholders
     *
     * @param match $match replace match
     *
     * @return string placeholder with fID
     */
    public static function replaceImagePlaceHolderOnImport($match)
    {
        $filename = $match[1];
        $db = Loader::db();
        $fID = $db->GetOne('select fID from FileVersions where fvFilename = ?', array($filename));
        return '{CCM:FID_' . $fID . '}';
    }

    /**
     * Replaces File Placholders
     *
     * @param match $match replace match
     *
     * @return string placeholder with fID
     */
    public static function replaceFilePlaceHolderOnImport($match)
    {
        $filename = $match[1];
        $db = Loader::db();
        $fID = $db->GetOne('select fID from FileVersions where fvFilename = ?', array($filename));
        return '{CCM:FID_DL_' . $fID . '}';
    }

    /**
     * Export Function
     * Only needed when Block is exported to XML
     *
     * @param SimpleXMLElement $blockNode Block
     *
     * @return void
     */
    public function export(SimpleXMLElement $blockNode)
    {

        $data = $blockNode->addChild('data');
        $data->addAttribute('table', $this->btTable);
        $record = $data->addChild('record');
        $content = $this->content;
        $content = preg_replace_callback(
            '/{CCM:CID_([0-9]+)}/i',
            array('ContentExporter', 'replacePageWithPlaceHolderInMatch'),
            $content
        );

        $content = preg_replace_callback(
            '/{CCM:FID_([0-9]+)}/i',
            array('ContentExporter', 'replaceImageWithPlaceHolderInMatch'),
            $content
        );

        $content = preg_replace_callback(
            '/{CCM:FID_DL_([0-9]+)}/i',
            array('ContentExporter', 'replaceFileWithPlaceHolderInMatch'),
            $content
        );

        $record->addChild('content', '<![CDATA['.Loader::helper('text')->entities($content).']]>');
    }


    /**
     * Translate from edit mode to db format
     *
     * @param string $text tiny text
     *
     * @return [type]       [description]
     */
    private function translateFromEditMode($text)
    {
        // now we add in support for the links

        $text = preg_replace(
            '/{CCM:CID_([0-9]+)}/i',
            BASE_URL . DIR_REL . '/' . DISPATCHER_FILENAME . '?cID=\\1',
            $text
        );

        // now we add in support for the files

        $text = preg_replace_callback(
            '/{CCM:FID_([0-9]+)}/i',
            array('<%=blockcchandle%>Tiny', 'replaceFileIDInEditMode'),
            $text
        );


        $text = preg_replace_callback(
            '/{CCM:FID_DL_([0-9]+)}/i',
            array('<%=blockcchandle%>Tiny', 'replaceDownloadFileIDInEditMode'),
            $text
        );

        return $text;
    }

    /**
     * Translate Placeholders to original
     *
     * @param string $text text
     *
     * @return plain html text without
     */
    private function translateFrom($text)
    {
        // old stuff. Can remove in a later version.
        $text = str_replace('href="{[CCM:BASE_URL]}', 'href="' . BASE_URL . DIR_REL, $text);
        $text = str_replace('src="{[CCM:REL_DIR_FILES_UPLOADED]}', 'src="' . BASE_URL . REL_DIR_FILES_UPLOADED, $text);

        // we have the second one below with the backslash due to a screwup in the
        // 5.1 release. Can remove in a later version.

        $text = preg_replace(
            array(
              '/{\[CCM:BASE_URL\]}/i',
              '/{CCM:BASE_URL}/i'),
            array(
              BASE_URL . DIR_REL,
              BASE_URL . DIR_REL),
            $text
        );

        // now we add in support for the links
        $text = preg_replace_callback(
            '/{CCM:CID_([0-9]+)}/i',
            array('<%=blockcchandle%>Tiny', 'replaceCollectionID'),
            $text
        );

        $text = preg_replace_callback(
            '/<img [^>]*src\s*=\s*"{CCM:FID_([0-9]+)}"[^>]*>/i',
            array('<%=blockcchandle%>Tiny', 'replaceImageID'),
            $text
        );

        // now we add in support for the files that we view inline
        $text = preg_replace_callback(
            '/{CCM:FID_([0-9]+)}/i',
            array('<%=blockcchandle%>Tiny', 'replaceFileID'),
            $text
        );

        // now files we download
        $text = preg_replace_callback(
            '/{CCM:FID_DL_([0-9]+)}/i',
            array('<%=blockcchandle%>Tiny', 'replaceDownloadFileID'),
            $text
        );

        return $text;
    }

    /**
     * Replace fID with actual Link
     *
     * @param match $match matched regex
     *
     * @return string        path
     */
    private function replaceFileID($match)
    {
        $fID = $match[1];
        if ($fID > 0) {
            $path = File::getRelativePathFromID($fID);
            return $path;
        }
    }

    /**
     * Replace image ID with image src
     *
     * @param match $match regex match
     *
     * @return string image src
     */
    private function replaceImageID($match)
    {
        $fID = $match[1];
        if ($fID > 0) {
            preg_match('/width\s*="([0-9]+)"/', $match[0], $matchWidth);
            preg_match('/height\s*="([0-9]+)"/', $match[0], $matchHeight);
            $file = File::getByID($fID);
            if (is_object($file) && (!$file->isError())) {
                $imgHelper = Loader::helper('image');
                $maxWidth = ($matchWidth[1]) ? $matchWidth[1] : $file->getAttribute('width');
                $maxHeight = ($matchHeight[1]) ? $matchHeight[1] : $file->getAttribute('height');
                if ($file->getAttribute('width') > $maxWidth || $file->getAttribute('height') > $maxHeight) {
                    $thumb = $imgHelper->getThumbnail($file, $maxWidth, $maxHeight);
                    return preg_replace('/{CCM:FID_([0-9]+)}/i', $thumb->src, $match[0]);
                }
            }
            return $match[0];
        }
    }

    /**
     * Replace fID with Download Link
     *
     * @param match $match regex match
     *
     * @return string download url
     */
    private function replaceDownloadFileID($match)
    {
        $fID = $match[1];
        if ($fID > 0) {
            $c = Page::getCurrentPage();
            if (is_object($c)) {
                return View::url('/download_file', 'view', $fID, $c->getCollectionID());
            } else {
                return View::url('/download_file', 'view', $fID);
            }
        }
    }

    /**
     * Replace fID for Edit mode
     *
     * @param match $match regex match
     *
     * @return string download url
     */
    private function replaceDownloadFileIDInEditMode($match)
    {
        $fID = $match[1];
        if ($fID > 0) {
            return View::url('/download_file', 'view', $fID);
        }
    }

    /**
     * Replace fID for Edit mode
     *
     * @param match $match regex match
     *
     * @return string download url
     */
    private function replaceFileIDInEditMode($match)
    {
        $fID = $match[1];
        return View::url('/download_file', 'view_inline', $fID);
    }

    /**
     * Replace cID
     *
     * @param match $match regex match
     *
     * @return string url
     */
    private function replaceCollectionID($match)
    {
        $cID = $match[1];
        if ($cID > 0) {
            $c = Page::getByID($cID, 'ACTIVE');
            return Loader::helper("navigation")->getLinkToCollection($c);
        }
    }

    /**
     * Translate urls
     *
     * @param string $text text
     *
     * @return string text
     */
    public function translateTo($text)
    {
        // keep links valid
        $url1 = str_replace('/', '\/', BASE_URL . DIR_REL . '/' . DISPATCHER_FILENAME);
        $url2 = str_replace('/', '\/', BASE_URL . DIR_REL);
        $url3 = View::url('/download_file', 'view_inline');
        $url3 = str_replace('/', '\/', $url3);
        $url3 = str_replace('-', '\-', $url3);
        $url4 = View::url('/download_file', 'view');
        $url4 = str_replace('/', '\/', $url4);
        $url4 = str_replace('-', '\-', $url4);
        $text = preg_replace(
            array(
            '/' . $url1 . '\?cID=([0-9]+)/i',
            '/' . $url3 . '([0-9]+)\//i',
            '/' . $url4 . '([0-9]+)\//i',
            '/' . $url2 . '/i'
            ),
            array(
              '{CCM:CID_\\1}',
              '{CCM:FID_\\1}',
              '{CCM:FID_DL_\\1}',
              '{CCM:BASE_URL}'),
            $text
        );
        return $text;
    }

}
