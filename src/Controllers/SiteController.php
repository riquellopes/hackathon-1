<?php

namespace Controllers;

use \BusinessLogic\Conteudos\ConteudosLogic;
use BusinessLogic\Pontos\PontosLogic;
use BusinessLogic\Users\UsersLogic;
use Symfony\Component\HttpFoundation\Request;

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

    public function step(Request $request){

        $post = $request->request->all();

        $exercicio = new ConteudosLogic();
        $return['exercicios'] = $exercicio->getConteudoById($post['idExercicio']);

        $pontos = new PontosLogic();
        $return['pontos'] = $pontos->getPontosById($exercicio->pontos_id);

        $usuario = new UsersLogic();
        $return['usuario'] = $usuario->getUserByEmail($post['user']);

        $this->app['twig']->addGlobal('layout_site', $this->app['twig']->loadTemplate('layout-site.html'));
        return $this->app['twig']->render('/site/exercicio.html', array('title' => 'Spoiler'));

    }

}
