<?php

namespace BusinessLogic\ACL;

use BusinessLogic\ACL\Models\Operation;
use BusinessLogic\Commons\BaseBusinessLogic;

class OperationLogic extends BaseBusinessLogic
{
    public function getAll()
    {
		return Operation::all();
    }

    public function getAllThatNeedsControl()
    {
		return Operation::all(array('conditions' => 'is_controlled = 1', 'order' => 'alias'));
    }

    static public function getOperationsByUserId($user_id)
    {
		$connection_manager = \ActiveRecord\ConnectionManager::instance();
        $connection = $connection_manager::get_connection();

    	$sql_query = 
	    	"SELECT op.*, uoa.revoke FROM acl_operation AS op 
				INNER JOIN acl_user_operation_assignment uoa ON op.id = uoa.operation_id
				INNER JOIN system_users AS su ON su.id = uoa.user_id
			WHERE su.id = ?;";
        
                $param = array($user_id);
		$statement = $connection->query($sql_query, $param);

		$roles = array();
		while ($row = $statement->fetch(\PDO::FETCH_ASSOC)) {
			$roles[$row['id']] = array('name' => $row['name'], 'revoke' => $row['revoke'], 'action' => $row['action_maped']) ;
		}

		return $roles;
    }

    static public function getOperationsByRoleId($role_id)
    {
		$connection_manager = \ActiveRecord\ConnectionManager::instance();
        $connection = $connection_manager::get_connection();

		$sql_query = 
			"SELECT op.* FROM acl_operation AS op 
				INNER JOIN acl_role_operation AS ro ON  op.id = operation_id
				INNER JOIN acl_role AS role ON role.id = ro.role_id
			WHERE role.id = ?;";
                
                $param = array($role_id);
		$statement = $connection->query($sql_query, $param);

		$roles = array();
		while ($row = $statement->fetch(\PDO::FETCH_ASSOC)) {
			$roles[$row['id']] = array('name' => $row['name'], 'revoke' => 0, 'action' => $row['action_maped']);
		}

		return $roles;
    }

    static public function getNotControlledOperations()
    {
		$connection_manager = \ActiveRecord\ConnectionManager::instance();
        $connection = $connection_manager::get_connection();

		$sql_query = 
			"SELECT op.* FROM acl_operation AS op 
			WHERE op.is_controlled = 0;";

		$statement = $connection->query($sql_query);

		$roles = array();
		while ($row = $statement->fetch(\PDO::FETCH_ASSOC)) {
			$roles[$row['id']] = array('name' => $row['name'], 'revoke' => 0, 'action' => $row['action_maped']);
		}

		return $roles;
    }

    static function getAllowedOperations($user_id, $role_id)
    {
    	$operations = self::getOperationsByUserId($user_id) + self::getOperationsByRoleId($role_id) + self::getNotControlledOperations();

    	foreach ($operations as $key => $value) {
    		if ($value['revoke'] == 1) {
    			unset($operations[$key]);
    		}
    	}

    	ksort($operations);
        // die(print_r($operations));
        // die(print_r(self::getOperationsByUserId($user_id)));
        // die(print_r(self::getOperationsByRoleId($role_id)));
        // die(print_r(self::getNotControlledOperations()));

		return $operations;
    }
}
