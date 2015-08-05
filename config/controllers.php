<?php

$app['LoginController'] = $app->share(function () use ($app) {
    return new Controllers\LoginController($app);
});

