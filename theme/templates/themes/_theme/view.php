<?php
include('inc/head.php');

// Template mit Inhaltsbereich ueber 3 Spalten
// und zusaetzlich rechter Spalte
?>
  <div class="wrapper clearfix">

    <?php include('inc/header.php');?>

    <article class="content3">
      <?php
      // Seitenueberschrift
      $a = new Area('Titel');
      $a->display($c);
      ?>
      <div class="inhaltszeile">
        <div class="col three">
          <h1><?php echo isset($title) ? $title : ''; ?></h1>
          <?php echo isset($innerContent) ? $innerContent : ''?>
        </div>
      </div>
    </article>

  </div>

  <?php include('inc/footer.php');?>
  <?php include('inc/footer_scripts.php');?>
  <?php Loader::element('footer_required'); ?>
  </body>
</html>
