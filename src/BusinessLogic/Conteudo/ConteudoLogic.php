<?php

use BusinessLogic\Commons\BaseBusinessLogic;
use BusinessLogic\Conteudo\Models\Pontos;

class ConteudoLogic extends BaseBusinessLogic
{
    /*
     * Pegar todos os pontos
     */
    public function getAll()
    {
        try {
            return Conteudo::find('all', array());
        } catch(\Exception $e) {
            throw $e;
        }
    }
}
