<div class="nav_bar"></div>

<div class="header-container">

    <header class="wrapper clearfix">

        <div class="nav_bar_inner">

            <div class="menu-to-hide" id="menu">

                <nav class="main_nav">
                    <?php
                    // Navigation
                    $a = new GlobalArea('Navigation');
                    $a->display($c);
                    ?>
                </nav>


                <form class="searchbox" role="search" action="<?php echo SEARCHURI?>">
                <fieldset>
                    <legend class="invisible">Suche</legend>
                    <label class="invisible">Suchbegriff</label>
                    <input value="<?php echo htmlspecialchars($_GET['query'], ENT_COMPAT, 'utf-8', false)?>" type="text" name="query" placeholder="Suchbegriff">
                    <button type="submit" class="btn"><?php echo t('suchen')?></button>
                </fieldset>
                </form>

                <div class="clearBoth"></div>

            </div>

        </div>

        <a href="/"><h1>Neues Template</h1></a>
        <div class="clearBoth"></div>

    </header>
</div>
