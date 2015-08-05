<?php

date_default_timezone_set('America/Sao_Paulo'); //TO DO: Pegar Timezone via Google API e persistir

ini_set('display_errors', 1); // TO DO: Resolver Debug pelo HHVM
error_reporting(E_ALL ^ E_NOTICE);
require_once __DIR__.'/../vendor/autoload.php';

$app =  require __DIR__ . '/../config/database.php';
        require __DIR__.'/../src/app.php';

$app->before(function ($request) {
    $request->getSession()->start();
});

$app->run();
