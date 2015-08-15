<?php
namespace BusinessLogic\Dicas

use BusinessLogic\Commons\BaseBusinessLogic;
use BusinessLogic\Pontos\Models\Dicas;

class DicasLogic extends BaseBusinessLogic
{
    /*
     * Pegar todos os pontos
     */
    public function getAll()
    {
        try {
            return Dicas::find('all', array());
        } catch(\Exception $e) {
            throw $e;
        }
    }
}
