<?php

namespace BusinessLogic\Pontos\Models;

use BusinessLogic\Commons\BaseModel;

class Courses extends BaseModel
{
    private $label;
    private $src;
    private $score;

    /**
     * @return string
     */
    public static function getLabel()
    {
        return self::$label;
    }

    /**
     * @param string $table_label
     */
    public static function setLabel($label)
    {
        self::$label = $label;
    }

    /**
     * @return string
     */
    public static function getSrc()
    {
        return self::$src;
    }

    /**
     * @param string $src
     */
    public static function setSrc($src)
    {
        self::$src = $src;
    }

    /**
     * @return int
     */
    public static function getScore()
    {
        return self::$score;
    }

    /**
     * @param string $score
     */
    public static function setScore($score)
    {
        self::$score = $score;
    }
}
