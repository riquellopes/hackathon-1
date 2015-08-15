<?php

namespace Controllers;

use \BusinessLogic\Users\UsersLogic;

class ApiController extends BaseController
{

    public function __construct($app)
    {
        parent::__construct($app);
    }

    public function home()
    {
        return $this->app->json(
            array("show"=>"AAA")
        );
    }

    public function total_pontos($id){
        $user = new UsersLogic();
        return $this->app->json($user->voceTem($id));
    }

    public function total_dicas($id){
        $user = new UsersLogic();
        return $this->app->json($user->voceTem($id));
    }

    public function pontos_proxima($id){
        return $this->app->json(
            array("show"=>"AAA")
        );
    }
    public function medalhas(){
        $user = new UsersLogic();
        return $this->app->json($user->medalhas());
    }

    public function missoes(){
        return $this->app->json(
            array("show"=>"AAA")
        );
    }
}
