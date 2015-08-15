<?php

namespace BusinessLogic\Dicas\Models;

use BusinessLogic\Commons\BaseModel;

class Dicas extends BaseModel
{
    static $belongs_to = array (
        array('conteudo'),
        array('type'),
    );
}
