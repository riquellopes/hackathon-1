<?php

require __DIR__ . "/controllers.php";

    $app->get('/login', "LoginController:index");
    $app->post('/login/', "LoginController:login")->bind('login');
    $app->get('/sair/', "LoginController:logout")->bind('sair');
