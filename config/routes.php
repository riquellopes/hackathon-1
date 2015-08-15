<?php

require __DIR__ . "/controllers.php";

    $app->get('/', "SiteController:index")->bind('home');
    $app->get('/api', "Apiontroller:home")->bind('api');
