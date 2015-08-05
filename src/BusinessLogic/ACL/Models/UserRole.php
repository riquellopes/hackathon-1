<?php

namespace BusinessLogic\ACL\Models;

class UserRole extends \BusinessLogic\Commons\BaseModel
{
    static $table_name = 'acl_user_role_assignment';

    static $belongs_to = array(
    	array('role')
    );
}