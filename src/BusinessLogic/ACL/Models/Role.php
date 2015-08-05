<?php

namespace BusinessLogic\ACL\Models;

class Role extends \BusinessLogic\Commons\BaseModel
{
    const ANONYMOUS = 0;
    const ROLE_ADMIN = 2;

	public static $table_name = 'acl_role';

    public static $has_many = array(
        array('role_operation'),
        array('role', 'through' => 'role_operation')
        // array('operations', 'class_name' => 'Operation'),
    );
}
