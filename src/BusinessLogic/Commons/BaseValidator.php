<?php

namespace BusinessLogic\Commons;

class BaseValidator {

    public function __call($name, $arguments) {
        $sufix = lcfirst(substr($name, 3));

        if (substr($name, 0, 3) === 'get') {
            return $this->$sufix;
        } else if (substr($name, 0, 3) === 'set') {
            $this->$sufix = $arguments[0];
        }
    }

    public function validate() {
        return true;
    }
}
