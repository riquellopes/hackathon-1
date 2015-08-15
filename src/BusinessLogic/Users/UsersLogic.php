<?php
namespace BusinessLogic\Users;

use BusinessLogic\Commons\BaseBusinessLogic;
use BusinessLogic\Users\Models\Users;

class UsersLogic extends BaseBusinessLogic {

    public function getAll()
    {
        try {
            return Users::find('all', array());
        } catch(\Exception $e) {
            throw $e;
        }
    }

    public function getUserByEmail($email) {
        try{
            return (new Users())->find('all', array('conditions' => array('user_email'=>$email)));
        } catch(\Exception $e) {
            throw $e;
        }
    }

    public function voceTem($idUser)
    {
        $sql = <<<SQL
            SELECT SUM(p.score) as voce_tem FROM users u
            join conteudo_users cu on u.id = cu.user_id
            join conteudo c on cu.conteudo_id = c.id
            join pontos p on c.pontos_id = p.id
            WHERE u.id = ?
SQL;

        try{
            $user = new Users();
            $param[] = $idUser;

            $return = $user::connection()->query($sql, $param)->fetchAll();
            $return = $return[0];

            if( $return['voce_tem'] == null ){
                $return['voce_tem'] = 0;
            }

            return $return;
        }catch(Exception $e){
            throw $e;
        }
    }

    public function quantida_de_dicas($idUser)
    {
        //@TODO ver essa query depois. bug!
        $sql = <<<SQL
            SELECT COUNT(d.*) as quantida_de_dicas FROM users u
            join conteudo_users cu on u.id = cu.user_id
            join conteudo c on cu.conteudo_id = c.id
            join dicas d on c.id = d.conteudo_id and
            WHERE u.id = {$idUser}
SQL;

        try{
            $user = new Users();
            $param[] = $idUser;

            $return = $user::connection()->query($sql, $param)->fetchAll();
            $return = $return[0];

            if( $return['quantida_de_dicas'] == null ){
                $return['quantida_de_dicas'] = 0;
            }

            return $return;
        }catch(Exception $e){
            throw $e;
        }
    }

    public function medalhas()
    {
        $sql = <<<SQL
            SELECT SUM(p.score) as voce_tem, u.username FROM users u
            join conteudo_users cu on u.id = cu.user_id
            join conteudo c on cu.conteudo_id = c.id
            join pontos p on c.pontos_id = p.id
            GROUP BY u.username;
SQL;

        try{
            $user = new Users();
            $return = $user::connection()->query($sql)->fetchAll();

            return $return;
        }catch(Exception $e){
            throw $e;
        }
    }

}
