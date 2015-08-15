<?php

namespace BusinessLogic\Commons;

use Silex\Application;

class BaseBusinessLogic
{
    private $_app;
    public $logger = NULL;

    public function __construct()
    {
        $this->_app = require __DIR__.'/../../app.php';
    }

    public function getApp(){
        return $this->_app;
    }

    function from_camel_case($input)
    {
        preg_match_all('!([A-Z][A-Z0-9]*(?=$|[A-Z][a-z0-9])|[A-Za-z][a-z0-9]+)!', $input, $matches);
        $ret = $matches[0];
        foreach ($ret as &$match) {
            $match = $match == strtoupper($match) ? strtolower($match) : lcfirst($match);
        }
        return implode('_', $ret);
    }

    function persist(\BusinessLogic\Commons\BaseModel $model, $data)
    {
        try {
            foreach ($data as $key => $value) {
                $key = $this->from_camel_case($key);
                $model->$key = $value;
            }
            $model->save();
            return $model->id;
        } catch (\Exception $e) {
            throw $e;
        }
    }
    
    public static function array_sort($array, $on, $order = SORT_ASC)
    {
        $new_array = array();
        $sortable_array = array();

        if (count($array) > 0) {
            foreach ($array as $k => $v) {
                if (is_array($v)) {
                    foreach ($v as $k2 => $v2) {
                        if ($k2 == $on) {
                            $sortable_array[$k] = $v2;
                        }
                    }
                } else {
                    $sortable_array[$k] = $v;
                }
            }

            switch ($order) {
                case SORT_ASC:
                    asort($sortable_array);
                    break;
                case SORT_DESC:
                    arsort($sortable_array);
                    break;
            }

            foreach ($sortable_array as $k => $v) {
                $new_array[$k] = $array[$k];
            }
        }

        return $new_array;
    }
}
