<?php
defined('C5_EXECUTE') or die("Access Denied.");

// HTML START
$this->inc('inc/html_start.php');
// HEADER Bereich
$this->inc('inc/header.inc.php');
?>
  <div class="main-container">
    <div class="main wrapper clearfix">

      <?php
      // Titel
      $aTitel = new Area('Titel');
      $aTitel->display($c);
      ?>

      <main>
        <?php
          // Area Main
          $aInhaltsbereich = new Area('main');
          $aInhaltsbereich->display($c);
        ?>
      </main>

    </div> <!-- #main -->
  </div> <!-- #main-container -->

<?php
 // Footer JS
 $this->inc('inc/foot.inc.php');

 Loader::element('footer_required');
?>

  </body>
</html>
