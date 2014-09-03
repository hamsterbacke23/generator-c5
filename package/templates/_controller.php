<?php
defined('C5_EXECUTE') or die(_("Access Denied."));

/**
 * <%=pkgcchandle+'Package'%>
 *
 * @author <@seitenbau.com>
 * @since  <%=pkgversion%>
 */
class <%=pkgcchandle+'Package'%> extends Package
{
    protected $pkgHandle = '<%=pkghandle%>';
    protected $dependencies = array(<%=dependencies%>);
    protected $appVersionRequired = '5.6.1';
    protected $pkgVersion = '<%=pkgversion%>';
    protected $blockHandles = array('<%=blockhandle%>');

    /**
     * Get Package Name
     *
     * @return String Package Name
     */
    public function getPackageName()
    {
        return t('<%=pkgcchandle%>');
    }

    /**
     * Get Package Description
     *
     * @return String Package Description
     */
    public function getPackageDescription()
    {
        return t('<%=pkgdesc.trim()%>');
    }

    /**
     * Install
     * Is run when installing package
     *
     * @return null
     */
    public function install()
    {
        <% if(dependencies) {%>$this->checkDependencies();<% } %>
        $pkg = parent::install();
        if (!empty($this->blockHandles)) {
            foreach ($this->blockHandles as $blockHandle) {
                BlockType::installBlockTypeFromPackage($blockHandle, $pkg);
            };
        }

        <% if(themehandle) { %>

        // add theme
        PageTheme::add('<%=themehandle%>', $pkg);

        //install page types
        $ptHelper = Loader::helper('pagetypes', '<%=pkghandle%>');
        $ptHelper->installPageTypes();
        <% } %>
    }

    /**
     * Package Uprade
     * Is run when upgrading package
     *
     * @return null
     */
    public function upgrade()
    {
        <% if(dependencies) {%>$this->checkDependencies();<% } %>
        parent::upgrade();

        Loader::model('block_types');
        $pkg = parent::getByHandle($this->pkgHandle);

        if (!empty($this->blockHandles)) {
            foreach ($this->blockHandles as $blockHandle) {
                if (!is_object(BlockType::getByHandle($blockHandle))) {
                    BlockType::installBlockTypeFromPackage($blockHandle, $pkg);
                }
            }
        }
    }

    <% if(dependencies) {%>
    /**
     * Checks if dependencies are available
     *
     * @return null
     */
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
