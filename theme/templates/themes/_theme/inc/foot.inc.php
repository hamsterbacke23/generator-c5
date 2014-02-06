

        <div class="footer-container">
            <footer class="wrapper">
                <?php
                  $page = Page::getByPath(FFLINK, 'ACTIVE');
                  $nh   = Loader::helper('navigation');
                  $url  = $nh->getLinkToCollection($page).'?ml=on';
                 ?>
                 <nav class="footer_nav">
                    <ul>
                        <li class="link-to-home"><a href="/">Home</a></li>
                        <li class="link-to-kontakt"><a href="/kontakt/">Kontakt</a></li>
                        <li class="link-to-impressum"><a href="/impressum/">Impressum</a></li>
                        <li class="link-to-login"><a href="/login_aussteller/">Login</a></li>
                        <li class="link-to-merkliste"><a href="<?php echo $url?>">Merkliste (<span class="ffmlcount"><?php echo FFMLCOUNT?></span>)</a></li>
                    </ul>
                </nav>
            </footer>
        </div>



