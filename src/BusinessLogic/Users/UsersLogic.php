<?php

use BusinessLogic\Commons\BaseBusinessLogic;
use BusinessLogic\Users\Model\Users;

class UsersLogic extends BaseBusinessLogic
{
    /*
     * Pegar todos os pontos
     */
    public function getAll()
    {
        try {
            return Users::find('all', array());
        } catch(\Exception $e) {
            throw $e;
        }
    }

    public function voceTem($idUser){
        $sql = <<<SQL
            SELECT SUM(p.score) as voce_tem FROM users u
            join conteudo_users cu on u.id = cu.user_id
            join conteudo c on cu.conteudo_id = c.id
            join pontos p on c.pontos_id = p.id
            WHERE u.id = {$idUser}
        SQL;

        try{
            return Users::find_by_sql($sql);
        }catch(Exception $e){
            throw $e;
        }
    }

    public function quantida_de_dicas($idUser){
        //@TODO ver essa query depois. bug!
        $sql = <<<SQL
            SELECT COUNT(d.*) as quantida_de_dicas FROM users u
            join conteudo_users cu on u.id = cu.user_id
            join conteudo c on cu.conteudo_id = c.id
            join dicas d on c.id = d.conteudo_id and
            WHERE u.id = {$idUser}
        SQL;

        try{
            return Users::find_by_sql($sql);
        }catch(Exception $e){
            throw $e;
        }
    }

    public function medalhas(){
        $sql = <<<SQL
            SELECT SUM(p.score) as voce_tem, u.username FROM users u
            join conteudo_users cu on u.id = cu.user_id
            join conteudo c on cu.conteudo_id = c.id
            join pontos p on c.pontos_id = p.id
            GROUP BY u.username;
        SQL;

        try{
            return Users::find_by_sql($sql);
        }catch(Exception $e){
            throw $e;
        }
    }
}
