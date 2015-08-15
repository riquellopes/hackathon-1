<?php

ActiveRecord\Config::initialize(function ($cfg) {

    $dbConnection = array(
        'slave'     => 'mysql://hackathon:hackathon@localhost/hackathon;charset=utf8',
        'master'    => 'mysql://hackathon:hackathon@localhost/hackathon;charset=utf8'
    );

    $file = __DIR__ . '/../config/settings_local.php';
    if (file_exists($file)) {
        include($file);
    }

    if (isset($app['dbConnectionDeploy'])) {
        $dbConnection = array(
            'slave'     => $app['dbSlaveConnectionDeploy'],
            'master'    => $app['dbConnectionDeploy']
        );
    }

    $cfg->set_default_connection('slave');
    $cfg->set_connections($dbConnection);
});