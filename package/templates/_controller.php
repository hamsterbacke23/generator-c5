<?php
namespace Concrete\Package\<%=pkgcchandle%>;
use Package;
use BlockType;
use SinglePage;
use Loader;

/**
 * <%=pkgcchandle+' Package'%>
 *
 * @author <%=pkgauthor%>
 * @since  <%=pkgversion%>
 */
class Controller extends Package
{
    protected $pkgHandle = '<%=pkghandle%>';
    protected $dependencies = array(<%=dependencies%>);
    protected $appVersionRequired = '5.7.2';
    protected $pkgVersion = '<%=pkgversion%>';
    protected $blockHandles = array('<%=blockhandle%>');

    /**
     * Get Package Name
     *
     * @return String Package Name
     */
    public function getPackageName()
    {
        return t('<%=pkghandle%>.packagename');
    }

    /**
     * Get Package Description
     *
     * @return String Package Description
     */
    public function getPackageDescription()
    {
        return t('<%=pkghandle%>.packagedescription');
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
        if (empty($deps)) {
            return;
        }

        foreach ($this->dependencies as $dp) {
            $pre_pkg = Package::getByHandle($dp);
            if (!is_object($pre_pkg)) {
                throw new Exception(t('Prerequisite package ' . implode(', ', $this->dependencies) . ' required'));
            }
        }
    }
    <% } %>

}
