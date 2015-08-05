<?php

namespace BusinessLogic\Commons;

/*
 * Classe de Manipulação de Business Logic para Login de Usuário
 * @author luizsouza
 * 12/05/2014
 */
class LoginBusinessLogic
{
    public function login($usrData)
    {
        //print_r($usrData);
        //$session = new Session();
        //$session->start();

        // print_r($session);
        //return $app->redirect("/cadastro/");
        return;
         

    }

    public function isLogged($uid)
    {
        return true;
    }

    public function logOut($uid)
    {
        return true;

    }

    public function logHistory($uid)
    {
        return true;
    }
}
