<?php

namespace BusinessLogic\Conteudos;

use BusinessLogic\Commons\BaseBusinessLogic;
use BusinessLogic\Conteudos\Models\Conteudos;


class ConteudosLogic extends BaseBusinessLogic
{

    public function getAll()
    {
        try {
            return Conteudos::find('all');
        } catch(\Exception $e) {
            throw $e;
        }
    }

    public function getConteudoById($conteudoId) {
        try{

        return (new Conteudos())->find($conteudoId);

        } catch(Exception $e) {
            throw $e;
        }
    }
}
