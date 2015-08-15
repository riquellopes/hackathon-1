<?php

namespace BusinessLogic\Pontos;

use BusinessLogic\Commons\BaseBusinessLogic;
use BusinessLogic\Pontos\Models\Pontos;

class PontosLogic extends BaseBusinessLogic
{
    /*
     * Pegar todos os pontos
     */
    public function getAll()
    {
        try {
            return Pontos::find('all', array());
        } catch(\Exception $e) {
            throw $e;
        }
    }

    public function getPontosById($pontosId) {
        try{

            return (new Pontos())->find($pontosId);

        } catch(Exception $e) {
            throw $e;
        }
    }

}