<?php
namespace BusinessLogic\Commons;

class DateLogic {
    
    public static function dateToTime($dateTime) {
        $res = null;
		if (preg_match('/^([0-9]{4})-([0-9]{2})-([0-9]{2})/', $dateTime, $res)) {
			$data = array($res[1],$res[2],$res[3],);
		} else if (preg_match('/^([0-9]{2})\/([0-9]{2})\/([0-9]{4})/', $dateTime, $res)) {
			$data = array($res[3],$res[2],$res[1],);
		}
		unset($res);

		preg_match('/([0-9]{2}):([0-9]{2}):([0-9]{2})$/', $dateTime, $res);
		if (isset($res[1])) {
			$hora = array($res[1],$res[2],$res[3],);
		} else {
			$hora = array(0,0,0,);
		}
		unset($res);
		return mktime($hora[0], $hora[1], $hora[2], $data[1], $data[2], $data[0]);
    }
}
