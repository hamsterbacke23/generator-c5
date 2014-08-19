<?php  defined('C5_EXECUTE') or die(_('Access Denied.')); ?>
<hr class="balkenoben" />
<h2 id="navhead"><?php echo t('site.nav.head'); ?><span class="pfeil"></span></h2>
<span class="nav_balken"></span>
<ul class="navigation">
  <?php
  $navItems = $controller->getNavItems();
  foreach ($navItems as $ni)
  {
    $itemClasses = array();

    // Aktuelle Seite oder Seite innerhalb des aktuellen Menupunkt?
    if ($ni->isCurrent || $ni->inPath)
    {
      $itemClasses[] = 'aktiv';
    }
    // nicht auf Mobil-Geraete anzeigen
    if ($ni->isCurrent == 1 &&
        $ni->cObj->getCollectionAttributeValue('navitem_exclude_mobile') === '1'
    ){
      $itemClasses[] = 'desktop_only';
    }
    $classes = (count($itemClasses) > 0)
             ? ' class="' . implode(' ', $itemClasses) . '"'
             : '';

    // alternative Navigationsbeschreibung
    $navBezeichnung = ($ni->cObj->getCollectionAttributeValue('alternative_nav_description') != '')
                    ? $ni->cObj->getCollectionAttributeValue('alternative_nav_description')
                    : $ni->name;
    ?>
    <li<?=$classes;?>><a href="<?php echo $ni->url; ?>"><?php echo $navBezeichnung; ?></a><?php
    if ($ni->hasSubmenu)
    {
      echo "\n" . '<ul>' . "\n";
    }
    else
    {
      echo '</li>' . "\n";
      echo str_repeat('</ul>' . "\n" . '</li>' . "\n", $ni->subDepth);
    }
  }
  ?>
</ul>
<hr class="balkenunten">
