<?php

require __DIR__ . "/controllers.php";

    $app->get('/', "SiteController:index")->bind('home');

    $app->post('/step/', "SiteController:step")->bind('step');

    $app->get('/api', "ApiController:home")->bind('api');

    $app->get('/api/medalhas', "ApiController:medalhas")->bind('api_medalhas');
    $app->get('/api/carreiras', "ApiController:carreiras")->bind('api_carreiras');
    $app->get('/api/missoes/{id}', "ApiController:missoes")->bind('api_missoes');
    $app->get('/api/total-pontos/{id}', "ApiController:total_pontos")->bind('api_total_pontos');
    $app->get('/api/total-dicas/{id}', "ApiController:total_dicas")->bind('api_total_dicas');
    $app->get('/api/pontos-proxima/{id}', "ApiController:pontos_proxima")->bind('api_pontos_proxima');
