<?php

$app['SiteController'] = $app->share(function () use ($app) {
    return new Controllers\SiteController($app);
});

$app['ApiController'] = $app->share(function () use ($app) {
    return new Controllers\ApiController($app);
});

