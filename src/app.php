<?php

use Silex\Application;
use Silex\Provider\DoctrineServiceProvider;
use Silex\Provider\SecurityServiceProvider;
use Silex\Provider\ServiceControllerServiceProvider;
use Silex\Provider\SessionServiceProvider;
use Silex\Provider\SwiftmailerServiceProvider;
use Silex\Provider\TranslationServiceProvider;
use Silex\Provider\TwigServiceProvider;
use Silex\Provider\UrlGeneratorServiceProvider;
use Silex\Provider\ValidatorServiceProvider;
use SilexMemcache\MemcacheExtension;
use Symfony\Component\HttpFoundation\Session\Storage\Handler\MemcachedSessionHandler;
use Binfo\Silex\MobileDetectServiceProvider;

$app = new Application();

// Registers
$app->register(new UrlGeneratorServiceProvider());
$app->register(new SessionServiceProvider());
$app->register(new ServiceControllerServiceProvider());
$app->register(new TwigServiceProvider());
$app->register(new ValidatorServiceProvider());
$app->register(new DoctrineServiceProvider());
$app->register(new SecurityServiceProvider());
$app->register(new MobileDetectServiceProvider());

if (file_exists(__DIR__ . '/../config/settings_local.php')) {
    require __DIR__ . '/../config/settings_local.php';
}


$app['twig'] = $app->share($app->extend('twig', function ($twig, $app) {
            return $twig;
        }));

$app->register(new MemcacheExtension(), array(
    'memcache.library' => 'memcached',
    'memcache.server' => array(
        array($app['cacheConnectionDeploy'], $app['cachePortConnectionDeploy'])
    )
));

$app['memcached'] = new Memcached("Sessao");

if (!count($app['memcached']->getServerList())) {
    $app['memcached']->addServer($app['sessionConnectionDeploy'], $app['sessionPortConnectionDeploy']);
}

$app['session.storage.handler'] = $app->share(function () use ($app) {
    return new MemcachedSessionHandler(
        $app['memcached'], $app['session.storage.options']
    );
});

// firewall -> restrição de rotas
$app['security.firewalls'] = array(
    'site' => array(
        'pattern' => '^/',
    ),
    'secured' => array(
        'pattern' => '^.*$',
        'form' => array('login_path' => '/login', 'check_path' => '/login_check'),
        'logout' => array('logout_path' => '/logout'),
        'anonymous' => true,
        'users' => array(
            'admin@teste.com' => array('ROLE_ADMIN', 'Zgwa5KIjIkKchb0J16OIoUipsHuTitJOn5v/If/Mkd796sghFusRMdBLAZCN5yBDL6ad3piNHwxPh7artWMtBg=='), //admin@teste.com :: absinto
        ),
    ),
);

$lang = 'pt-BR';

$app->register(new TranslationServiceProvider(), array(
    'locale_fallback' => $lang,
));

require __DIR__ . '/../config/routes.php';

$app['twig.path'] = array(__DIR__ . '/../templates');

$app['title_page'] = 'Hackathon-Descomplica';

$app['name'] = 'admin';

$app['percent'] = '0';

$app['request'] = '';

$app['usrData'] = array();

/*Chave para serviços rest*/
$app['permission_rest'] = 'dac825842c5f84237dd4e530c71f38c7';

$app->register(new SwiftmailerServiceProvider());

$app->error(function (Exception $e, $code) use ($app) {

    $contentMail = "<div id='sf-resetcontent' class='sf-reset'>";
    $contentMail .= "<h1> Código de erro: " . ($e->getCode() ? $e->getCode() : $code) . " </h1>";
    $contentMail .= " <div>";
    $contentMail .= "<img src='http://i693.photobucket.com/albums/vv292/celsius46/Googleerrorrobotdisessmbled3.jpg' width='100px'>";
    $contentMail .= " </div>";
    $contentMail .= "<br>";
    $contentMail .= "<b> Descrição do erro: </b> <pre>" . $e->getMessage() . "</pre>";
    $contentMail .= "<br>";
    $contentMail .= "<b>Pagina: </b>" . $e->getFile();
    $contentMail .= "<br>";
    $contentMail .= "<b>Linha: </b>" . $e->getLine();
    $contentMail .= " </div>";

    echo $contentMail;
    exit;
});

return $app;
