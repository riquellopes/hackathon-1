<?php

namespace BusinessLogic\Conteudo\Models;

use BusinessLogic\Commons\BaseModel;

class Conteudo extends BaseModel
{
    static $belongs_to = array (
        array('pontos'),
        array('dicas'),
    );
}
