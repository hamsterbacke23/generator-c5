
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

                <nav class="meta_nav">
                    <?php
                      $page = Page::getByPath(FFLINK, 'ACTIVE');
                      $nh   = Loader::helper('navigation');
                      $url  = $nh->getLinkToCollection($page).'?ml=on';
                     ?>
                    <ul>
                        <li class="link-to-home"><a href="/">Home</a></li>
                        <li class="link-to-kontakt"><a href="/kontakt/">Kontakt</a></li>
                        <li class="link-to-impressum"><a href="/impressum/">Impressum</a></li>
                        <li class="link-to-login"><a href="/login_aussteller/">Login</a></li>
                        <li class="link-to-merkliste"><a href="<?php echo $url?>">Merkliste&nbsp;<span class="items-on-merkliste"><span>(</span><?php echo '<em class="ffmlcount">'.FFMLCOUNT.'</em>'?><span>)</span></span></a></li>
                    </ul>
                </nav>

                <form class="searchbox" role="search" action="<?php echo SEARCHURI?>">
                <fieldset>
                    <legend class="invisible">Suche</legend>
                    <label class="invisible">Suchbegriff</label>
                    <input value="<?php echo htmlentities($_GET['query'], ENT_COMPAT, 'utf-8', false)?>" type="text" name="query" placeholder="Suchbegriff">
                    <button type="submit" class="btn">suchen</button>
                </fieldset>
                </form>

                <div class="clearBoth"></div>

            </div>

        </div>

        <a href="/"><h1>Neue Verwaltung</h1></a>
        <div class="clearBoth"></div>

    </header>
</div>
