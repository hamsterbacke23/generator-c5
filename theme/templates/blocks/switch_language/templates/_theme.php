<?php   defined('C5_EXECUTE') or die(_('Access Denied.')); ?>
<div class="sprachwahl">
  <h2 id="navlang" class="hidden"><?php echo t('block.switch_language.language')?></h2>
  <ul>
    <?php
    $page = Page::getByID($cID);
    // somit legen wir die Sortierung fest
    $langSort = array('de'=>'','fr'=>'','it'=>'','en'=>'');
    foreach($languageSections as $ml)
    {
      $langShort = $ml->getLanguage();
      $translatedPageId = $ml->getTranslatedPageID($page);
      $translatedPage = Page::getByID($translatedPageId);
      $linkUrl = Loader::helper('navigation')->getLinkToCollection($translatedPage, false);

      $cssClass = ($activeLanguage == $ml->getCollectionID()) ? 'class="aktiv"' : '';

      $langSort[strtolower($langShort)] =
        '<li ' . $cssClass . '>' .
           '<a href="'.$linkUrl.'" hreflang="'.$langShort.'" title="'.$langShort.'">' .
           $ml->getLanguageText($ml->getLocale()) .
        '</a></li>';
    }

    // ausgabe des sortierten Arrays
    echo implode($langSort);
    ?>
  </ul>
</div>
