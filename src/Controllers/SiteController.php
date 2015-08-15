<?php

namespace Controllers;

use \BusinessLogic\Conteudos\ConteudosLogic;
use \BusinessLogic\Pontos\PontosLogic;

class SiteController extends BaseController
{

    public function __construct($app)
    {
        parent::__construct($app);
    }

    public function index() {

        $this->app['twig']->addGlobal('layout_site', $this->app['twig']->loadTemplate('layout-site.html'));
        return $this->app['twig']->render('/site/index.html', array('title' => 'Spoiler'));
    }

    public function step($id){
        $exercicio = new ConteudosLogic();

        $return = $exercicio->getConteudoById($id);

        var_dump($return);

        $this->app['twig']->addGlobal('layout_site', $this->app['twig']->loadTemplate('layout-site.html'));
        return $this->app['twig']->render('/site/exercicio.html', array('title' => 'Spoiler'));

    }

}
