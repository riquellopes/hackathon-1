<?php

ActiveRecord\Config::initialize(function ($cfg) {

    //Default Connection String [DEVELOPER]
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

//DON'T REMOVE DOCTRINE EXAMPLE YET
// Teste Conexão com o Doctrine
// Doctrine (db)
/*
$app['db.options'] = array(
    'driver'   => 'mysql',
    'host'     => 'localhost',
    'port'     => '3306',
    'dbname'   => 'hackathon',
    'user'     => 'hackathon',
    'password' => 'hackathon',
    'charset'  => 'utf-8'
);*/
