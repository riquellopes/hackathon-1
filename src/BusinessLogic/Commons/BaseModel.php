<?php

namespace BusinessLogic\Commons;

use ActiveRecord\SQLBuilder;

function eh_um_hash(&$array)
{
    if (!is_array($array))
            return false;

    $keys = array_keys($array);

    return is_string($keys[0]);
}

abstract class BaseModel extends \ActiveRecord\Model
{

    // Specify the default connection for this model
    static $connection = 'slave';
    protected $master_db = 'master';

    /**
     * Changes the model's active database connection.
     * 
     * An instance of the ActiveRecord ConnectionManager class
     * singleton is used to ensure we don't open wasteful new
     * connections all over the place.
     * 
     * The function returns the name of the connection being
     * replaced.
     *
     * @param string $name New connection name
     * @return string Old connection name
     * @throws ActiveRecord\DatabaseException on invalid connection name
     */
    public function switch_connection($name)
    {

        $cfg = \ActiveRecord\Config::instance();
        $valid = $cfg->get_connections();
        if (!isset($valid[$name])) {
            throw new \ActiveRecord\DatabaseException('Conexão especificada inválida');
        }

        // Get the name of the current connection
        $old = self::$connection;

        $cm = \ActiveRecord\ConnectionManager::instance();
        $conn = $cm::get_connection($name);
        static::table()->conn = $conn;

        return $old;
    }

    /**
     * Routes save operations to "master" connection then
     * switches back to the "slave" db connection.
     *
     * We add the $validate parameter because the parent
     * save method specifies its inclusion.
     */
    public function save($validate = TRUE)
    {
        $slave_db = $this->switch_connection($this->master_db);
        parent::save($validate);
        $this->switch_connection($slave_db);
    }
   

    /**
     * Routes delete operations to "master" connection then
     * switches back to the "slave" db connection.
     */
    public function delete()
    {
        $slave_db = $this->switch_connection($this->master_db);
        parent::delete();
        $this->switch_connection($slave_db);
    }

    public static function delete_all($options=array())
    {
        $cm = \ActiveRecord\ConnectionManager::instance();
        $conn = $cm::get_connection('master');


        $table = static::table();
        $sql = new SQLBuilder($conn, $table->get_fully_qualified_table_name());

        
        
        $conditions = is_array($options) ? $options['conditions'] : $options;
        
        if (is_array($conditions) && !eh_um_hash($conditions))
            call_user_func_array(array($sql, 'delete'), $conditions);  
        else
            $sql->delete($conditions);

        if (isset($options['limit']))
            $sql->limit($options['limit']);

        if (isset($options['order']))
            $sql->order($options['order']);
        
        $values = $sql->bind_values();
        

        $ret = $conn->query(($table->last_sql = $sql->to_s()), $values);

        return $ret->rowCount();
    }
    
    /**
	 *	Converte uma data do formato brasileiro para o formato universal
	 *
	 *	@param $datetime String contendo a data e hora no formato brasileiro (d/m/Y H:n:s)
	 *	@param $flgtime Interruptor de concatenação da hora após a data
	 *
	 *	@return Retorna a data no formato universal (Y-m-d) concatenada da hora no formato universal (H:n:s), se o $flgtime for TRUE.
	 */
	public static function castDateBR($datetime, $flgtime=false) {
		if (preg_match('/^([0-9]{2})\/([0-9]{2})\/([0-9]{4})/', $datetime, $res)) {
			$date = array($res[1], $res[2], $res[3]);
		} else {
			return '';
		}

		if ($flgtime) {
			if (preg_match('/([0-1][0-9]|[2][0-3]|[0-9]):([0-5][0-9]|[0-9]):([0-5][0-9]|[0-9])$/', $datetime, $res)) {
				$time = array($res[1], $res[2], $res[3]);
			} else {
				return '';
			}
		}

		$date = $date[2] . '-' . $date[1] . '-' . $date[0];
		unset($res);

		if (!$flgtime) {
			return $date;
		}

		return $date . ' ' .
			str_pad($time[0], 2, '0', STR_PAD_LEFT) . ':' .
			str_pad($time[1], 2, '0', STR_PAD_LEFT) . ':' .
			str_pad($time[2], 2, '0', STR_PAD_LEFT);
	}
}
