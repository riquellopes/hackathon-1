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
            array("pontos_proxima"=>20)
        );
    }
    public function medalhas(){
        $user = new UsersLogic();
        return $this->app->json($user->medalhas());
    }

    public function missoes(){
        $misssoes = array(
            array("nome"=>"", "icone"=>""),
            array("nome"=>"", "icone"=>""),
            array("nome"=>"", "icone"=>""),
            array("nome"=>"", "icone"=>""),
            array("nome"=>"", "icone"=>"")
        );

        return $this->app->json($misssoes);
    }

    public function carreiras(){
        $carreiras = array(
            array("nome"=>"Matemático", "icone"=>""),
            array("nome"=>"Programador", "icone"=>""),
            array("nome"=>"Diplomata", "icone"=>""),
            array("nome"=>"Dentista", "icone"=>""),
            array("nome"=>"Médico", "icone"=>"")
        );

        return $this->app->json($carreiras);
    }
}
