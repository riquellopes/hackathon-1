<?php

ob_start();
require_once __DIR__.'/../vendor/autoload.php';
require_once __DIR__.'/../config/database.php';
$app = require __DIR__.'/../src/app.php';
$app['session.test'] = true;
$app['debug'] = true;
$app['exception_handler']->disable();
return $app;