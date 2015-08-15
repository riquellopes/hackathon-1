<?php

namespace Controllers;

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
        return $this->app->json(
            array("show"=>"AAA")
        );
    }

    public function total_dicas($id){
        return $this->app->json(
            array("show"=>"AAA")
        );
    }

    public function pontos_proxima($id){
        return $this->app->json(
            array("show"=>"AAA")
        );
    }
    public function medalhas(){
        return $this->app->json(
            array("show"=>"AAA")
        );
    }

    public function missoes(){
        return $this->app->json(
            array("show"=>"AAA")
        );
    }
}
