<?php

namespace BusinessLogic\ACL;

use BusinessLogic\ACL\Models\Role;
use BusinessLogic\ACL\Models\RoleOperation;
use BusinessLogic\Commons\BaseBusinessLogic;
use Symfony\Component\HttpFoundation\Response;

class RoleLogic extends BaseBusinessLogic
{
    public function getAll()
    {
        try {
            return Role::all();
        } catch (\Exception $e) {
            throw new \Exception($e->getMessage());
        }
    }

    public function getAllByFilter($filters = array(), $limit = 0, $offset = 0, $pool = true)
    {

        try {

            $wherePart = array();
            if (key_exists('itxRoleName', $filters)) {
                $wherePart[] = "name LIKE '%" . $filters['itxRoleName'] . "%' ";
            }
            
            $role = new Role();

            if (!$pool) {
                $role->switch_connection('master');
            }

            $conditions = '';
            
            if(count($wherePart) > 0) {
                $conditions = implode(' AND ', $wherePart);
            }

            $return = $role->all(array('conditions' => $conditions, 'limit' => $limit, 'offset' => $offset));

            if (!$pool) {
                $role->switch_connection('slave');
            }
            return $return;
        } catch (\Exception $e) {
            throw new \Exception($e->getMessage());
        }
    }

    public function insertRole($roleData)
    {
        try {
            $role = new Role();
            // die(print_r($roleData));
            return $this->persistRoleData($role, $roleData);
        } catch (\Exception $e) {
            throw new \Exception($e->getMessage());
        }
    }

    public function persistRoleData($objRole, $roleData)
    {
        try {

            $operations = array();

            foreach ($roleData as $key => $value) {
                if(!is_array($value)){
                    $key = strtolower($key);
                    $objRole->$key = $value;
                } else{
                   $operations = $value; 
                }
            }

            $objRole->save();

            $role_operation = new RoleOperation();
            $role_operation->delete_all(array('role_id' => $roleData['Id']));
            if(!empty($operations)){
                foreach($operations as $operation){
                    $role_operation = new RoleOperation();

                    $role_operation->role_id = $objRole->id;
                    $role_operation->operation_id = $operation;

                    $role_operation->save();
                }
            }

            return $objRole->id;
        } catch (\Exception $e) {
            throw new \Exception($e->getMessage());
        }
    }

    public function updateRole($roleData)
    {
        try {
            $role = Role::find($roleData['Id']);
            return $this->persistRoleData($role, $roleData);
        } catch (\Exception $e) {
            throw new \Exception($e->getMessage());
        }
    }
}
