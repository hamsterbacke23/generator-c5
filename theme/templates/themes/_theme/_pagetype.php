<?php
defined('C5_EXECUTE') or die(_('Access Denied.'));

$this->inc('inc/html_start.php');

// Template mit Inhaltsbereich ueber 3 Spalten
// und zusaetzlich rechter Spalte
?>

  <div class="wrapper clearfix">

    <?php $this->inc('inc/header.php');?>

    <nav>
      <?php
      // Navigation
      $a = new GlobalArea('Navigation');
      $a->display($c);
      ?>
    </nav>

    <article class="content3">
      <?php
      // Seitenueberschrift
      $a = new Area('Titel');
      $a->display($c);
      ?>
      <div class="inhaltszeile">
        <div class="col three">
          <?php
          // Spalte 1 (3 Spalten breit)
          $a = new Area('Spalte1');
          $a->display($c);
          ?>
        </div>
      </div>
    </article>

    <aside>
      <?php
      // Rechte Spalte
      $a = new Area('Kontext');
      $a->display($c);
      ?>
    </aside>

  </div>

  <?php
  $this->inc('inc/footer.php');

  Loader::element('footer_required');

  ?>
  </body>
</html>
