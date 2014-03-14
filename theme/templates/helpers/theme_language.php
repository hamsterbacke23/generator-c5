<?php
defined('C5_EXECUTE') or die(_('Access Denied.'));

class ThemeLanguageHelper
{
  function __construct()
  {
    if(!Package::getByHandle('multilingual') ) {
      Log::addEntry(__METHOD__ . " > Package 'multilingual' not found");
      return;
    }
  }

  public function getCurrentLocaleString()
  {
    $section = MultilingualSection::getCurrentSection();
    if(is_object($section)) {
      $locale = $section->getLocale();
    }
    $locale || ($locale = 'de_DE');
    return $locale;
  }

  public function getCurrentLocalePath()
  {
    $section = MultilingualSection::getCurrentSection();
    if(is_object($section))
    {
      $path = DIR_REL . $section->cPath;
    }
    $path || ($path = DIR_REL);

    return $path;
  }

  public function getShortLocaleString($localeString = '')
  {
    $locale = $localeString != '' ? $localeString : $this->getCurrentLocaleString();
    $locale_parts = explode('_', $locale);
    return $locale_parts[0];
  }
}
