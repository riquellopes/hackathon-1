<?php

namespace Controllers;

class SiteController extends BaseController
{

    public function __construct($app)
    {
        parent::__construct($app);
    }

    public function index()
    {

            $this->app['twig']->addGlobal('layout_site', $this->app['twig']->loadTemplate('layout-site.html'));
            return $this->app['twig']->render('/site/index.html', array('title' => 'Spoiler'));
    }
}
