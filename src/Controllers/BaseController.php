<?php

namespace Controllers;

use Symfony\Component\HttpFoundation\Request;
use BusinessLogic\Property\CustomerLogic;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\Cookie;
use BusinessLogic\Helper\CampaignHelper;

use BusinessLogic\Property\PropertyLogic;
use BusinessLogic\Property\PropertyFeatureLogic;
use BusinessLogic\Contact\ContactLogic;


class BaseController
{
    public $logger = NULL;
    public $response = NULL;

    private $cmpsDeduplicationCriteoRule = array(1231,1232,1225,1224,1167,1165,1166,1168,489,941);

    public function __construct($app)
    {
        $this->app = $app;
        $this->response = new Response();

        if($app != null && !$this->app['session']->get('user') && (!empty($this->app['request']) && !$this->app['request']->query->get("husso"))) {
            $this->verifySSO($this->app['request']);
        }
    }

    public function handlePostRequest($valuesToHandle)
    {
        $values = array();
        $prefix = array('sel', 'itx', 'txa', 'ifl', 'ich', 'ihd', 'ird');

        foreach ($valuesToHandle as $key => $value) {
            $index = str_replace($prefix, array('', '', '', ''), $key);
            $values[$index] = $value;
        }
        return $values;
    }


    public function removeAccent($str)
    {
        $a = array('À', 'Á', 'Â', 'Ã', 'Ä', 'Å', 'Æ', 'Ç', 'È', 'É', 'Ê', 'Ë', 'Ì', 'Í', 'Î', 'Ï', 'Ð', 'Ñ', 'Ò', 'Ó', 'Ô', 'Õ', 'Ö', 'Ø', 'Ù', 'Ú', 'Û', 'Ü', 'Ý', 'ß', 'à', 'á', 'â', 'ã', 'ä', 'å', 'æ', 'ç', 'è', 'é', 'ê', 'ë', 'ì', 'í', 'î', 'ï', 'ñ', 'ò', 'ó', 'ô', 'õ', 'ö', 'ø', 'ù', 'ú', 'û', 'ü', 'ý', 'ÿ', 'Ā', 'ā', 'Ă', 'ă', 'Ą', 'ą', 'Ć', 'ć', 'Ĉ', 'ĉ', 'Ċ', 'ċ', 'Č', 'č', 'Ď', 'ď', 'Đ', 'đ', 'Ē', 'ē', 'Ĕ', 'ĕ', 'Ė', 'ė', 'Ę', 'ę', 'Ě', 'ě', 'Ĝ', 'ĝ', 'Ğ', 'ğ', 'Ġ', 'ġ', 'Ģ', 'ģ', 'Ĥ', 'ĥ', 'Ħ', 'ħ', 'Ĩ', 'ĩ', 'Ī', 'ī', 'Ĭ', 'ĭ', 'Į', 'į', 'İ', 'ı', 'Ĳ', 'ĳ', 'Ĵ', 'ĵ', 'Ķ', 'ķ', 'Ĺ', 'ĺ', 'Ļ', 'ļ', 'Ľ', 'ľ', 'Ŀ', 'ŀ', 'Ł', 'ł', 'Ń', 'ń', 'Ņ', 'ņ', 'Ň', 'ň', 'ŉ', 'Ō', 'ō', 'Ŏ', 'ŏ', 'Ő', 'ő', 'Œ', 'œ', 'Ŕ', 'ŕ', 'Ŗ', 'ŗ', 'Ř', 'ř', 'Ś', 'ś', 'Ŝ', 'ŝ', 'Ş', 'ş', 'Š', 'š', 'Ţ', 'ţ', 'Ť', 'ť', 'Ŧ', 'ŧ', 'Ũ', 'ũ', 'Ū', 'ū', 'Ŭ', 'ŭ', 'Ů', 'ů', 'Ű', 'ű', 'Ų', 'ų', 'Ŵ', 'ŵ', 'Ŷ', 'ŷ', 'Ÿ', 'Ź', 'ź', 'Ż', 'ż', 'Ž', 'ž', 'ſ', 'ƒ', 'Ơ', 'ơ', 'Ư', 'ư', 'Ǎ', 'ǎ', 'Ǐ', 'ǐ', 'Ǒ', 'ǒ', 'Ǔ', 'ǔ', 'Ǖ', 'ǖ', 'Ǘ', 'ǘ', 'Ǚ', 'ǚ', 'Ǜ', 'ǜ', 'Ǻ', 'ǻ', 'Ǽ', 'ǽ', 'Ǿ', 'ǿ');
        $b = array('A', 'A', 'A', 'A', 'A', 'A', 'AE', 'C', 'E', 'E', 'E', 'E', 'I', 'I', 'I', 'I', 'D', 'N', 'O', 'O', 'O', 'O', 'O', 'O', 'U', 'U', 'U', 'U', 'Y', 's', 'a', 'a', 'a', 'a', 'a', 'a', 'ae', 'c', 'e', 'e', 'e', 'e', 'i', 'i', 'i', 'i', 'n', 'o', 'o', 'o', 'o', 'o', 'o', 'u', 'u', 'u', 'u', 'y', 'y', 'A', 'a', 'A', 'a', 'A', 'a', 'C', 'c', 'C', 'c', 'C', 'c', 'C', 'c', 'D', 'd', 'D', 'd', 'E', 'e', 'E', 'e', 'E', 'e', 'E', 'e', 'E', 'e', 'G', 'g', 'G', 'g', 'G', 'g', 'G', 'g', 'H', 'h', 'H', 'h', 'I', 'i', 'I', 'i', 'I', 'i', 'I', 'i', 'I', 'i', 'IJ', 'ij', 'J', 'j', 'K', 'k', 'L', 'l', 'L', 'l', 'L', 'l', 'L', 'l', 'l', 'l', 'N', 'n', 'N', 'n', 'N', 'n', 'n', 'O', 'o', 'O', 'o', 'O', 'o', 'OE', 'oe', 'R', 'r', 'R', 'r', 'R', 'r', 'S', 's', 'S', 's', 'S', 's', 'S', 's', 'T', 't', 'T', 't', 'T', 't', 'U', 'u', 'U', 'u', 'U', 'u', 'U', 'u', 'U', 'u', 'U', 'u', 'W', 'w', 'Y', 'y', 'Y', 'Z', 'z', 'Z', 'z', 'Z', 'z', 's', 'f', 'O', 'o', 'U', 'u', 'A', 'a', 'I', 'i', 'O', 'o', 'U', 'u', 'U', 'u', 'U', 'u', 'U', 'u', 'U', 'u', 'A', 'a', 'AE', 'ae', 'O', 'o');
        return str_replace($a, $b, $str);
    }

    function generate_slug($str)
    {
        $str = trim($str);
        $clean = iconv('UTF-8', 'ASCII//TRANSLIT', $str);
        $clean = preg_replace("/[^a-zA-Z0-9\/_|+ -]/", '', $clean);
        $clean = strtolower(trim($clean, '-'));
        $clean = preg_replace("/[\/_|+ -]+/", '-', $clean);

        return $clean;
    }

    public function getIp()
    {
        if (!empty($_SERVER['HTTP_CLIENT_IP'])) {
            $ip = $_SERVER['HTTP_CLIENT_IP'];
        } elseif (!empty($_SERVER['HTTP_X_FORWARDED_FOR'])) {
            $ip = $_SERVER['HTTP_X_FORWARDED_FOR'];
        } elseif (!empty($_SERVER['HTTP_X_FORWARDED'])) {
            $ip = $_SERVER['HTTP_X_FORWARDED'];
        } elseif (!empty($_SERVER['HTTP_FORWARDED'])) {
            $ip = $_SERVER['HTTP_FORWARDED'];
        } elseif (!empty($_SERVER['REMOTE_ADDR'])) {
            $ip = $_SERVER['REMOTE_ADDR'];
        } elseif (!empty($_SERVER['HTTP_X_COMING_FROM'])) {
            $ip = $_SERVER['HTTP_X_COMING_FROM'];
        } elseif (!empty($_SERVER['HTTP_COMING_FROM'])) {
            $ip = $_SERVER['HTTP_COMING_FROM'];
        } else {
            $ip = NULL;
        }
       return $ip;
    }

    public function verifySSO(Request $request)
    {
        // Conf de proxy, NAO MEXER
        $proxyDeploy = isset($this->app['proxyDeploy']) && !$this->app['proxyDeploy'] ? $this->app['proxyDeploy'] : true;

        // verifica se cookie existe
        $cookies = $request->cookies;
        if($cookies->has("HUSSO")){

            // chama url sso hotelurbano
            $options = array(
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_FOLLOWLOCATION => true,
            CURLOPT_AUTOREFERER => true,
            CURLOPT_CONNECTTIMEOUT => 20,
            CURLOPT_TIMEOUT => 20,
            CURLOPT_MAXREDIRS => 10,
            );

            $ch = curl_init($this->app['getSSO']. $cookies->get("HUSSO"));

            curl_setopt_array($ch, $options);

            if ($proxyDeploy) {
                $proxy = $this->app['proxyAdress'];
                $proxyauth = $this->app['ProxyCredentials'];
                curl_setopt($ch, CURLOPT_PROXY, $proxy);
                curl_setopt($ch, CURLOPT_PROXYUSERPWD, $proxyauth);
            }

            $result = curl_exec($ch);
            $response = curl_getinfo($ch, CURLINFO_HTTP_CODE);

            curl_close($ch);

            if($response == '200'){
                $dataMemcache = json_decode($result, true);

                if(!empty($dataMemcache['email']) && !empty($dataMemcache['id_usuario'])){

                    //Create the user in baseApplication if it only appear in LegacyApplication
                    $customer = new CustomerLogic();

                    $retorno = $customer->getCustomerByEmail($dataMemcache['email'], false);

                    $user_login = array(
                        'complete_name' => $dataMemcache['name'],
                        'email' => $dataMemcache['email'],
                        'token' => $dataMemcache['token'],
                        'id_usr_legacy' => $dataMemcache['id_usuario'],
                        'ip' => $this->getIp()
                    );

                    if (is_null($retorno)) {
                        $user_login['customer_id'] = $customer->persistCustomer($user_login);
                        $user_login['name'] = $retorno->name;
                    } else {
                        $user_login['customer_id'] = $retorno->id;
                        $user_login['name'] = $retorno->name;
                    }


                    // Seta o UUID no Memcached
                    $this->app['memcache']->set($cookies->get("HUSSO"), $result);
                    //Start Session -----------------------------------------------------
                    $this->app['session']->set('user', $user_login);
                    //-------------------------------------------------------------------

                    return $this->app->redirect($this->app['request']->getRequestUri());
                }
            }
        }
    }

    public function createPassword()
    {
        $alpha = "abcdefghijklmnopqrstuvwxyz";
        $alpha_upper = strtoupper($alpha);
        $numeric = "0123456789";
        $chars = "";

        $chars = $alpha . $alpha_upper . $numeric;
        $length = 8;

        $len = strlen($chars);
        $pw = '';

        for ($i=0;$i<$length;$i++){
                $pw .= substr($chars, rand(0, $len-1), 1);
        }

        return str_shuffle($pw);
    }

    public function validateAccess()
    {
        //Protegendo de acesso fora de session()
        if (is_null($this->app['session']->get('usrEmail'))) {
            header('Location: /login/');exit;
        }
    }

    public function array_sort($array, $on, $order = SORT_ASC)
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

    public function setSiteUri() {
        if (!empty($this->app['request'])) {
            $siteUri = (($_SERVER['HTTPS']) ? 'https://' : 'http://') . $_SERVER['HTTP_HOST'] . $_SERVER['REQUEST_URI'];
            $this->response->headers->clearCookie('site_url', '/', $this->app['cookieSiteDomain']);
            $this->response->headers->setCookie(new Cookie('site_url', $siteUri, \time() + (86400 * 30), '/', $this->app['cookieSiteDomain'], false, false));
        }
    }

    public function setCampain($dataEnvio=NULL, $utmContent=NULL, $utmCampaign=NULL) {
        $campaignId = NULL;
        $cmp = NULL;

        //Valores do request
        if (($dataEnvio == NULL) && ((!empty($this->app['request'])) && ($this->app['request']->query->get('data_envio')))) {
            $dataEnvio = $this->app['request']->query->get('data_envio');
        }

        if (($utmContent == NULL) && ((!empty($this->app['request'])) && ($this->app['request']->query->get('utm_content')))) {
            $utmContent = $this->app['request']->query->get('utm_content');
        }

        if (($utmCampaign == NULL) &&  ((!empty($this->app['request'])) && ($this->app['request']->query->get('utm_campaign')))) {
            $utmCampaign = $this->app['request']->query->get('utm_campaign');
        }

        if ((!empty($this->app['request'])) && ($this->app['request']->query->get('cmp'))) {
            $cmp = $this->app['request']->query->get('cmp');
        }

        //Valores do cookie
        if ((!empty($this->app['request'])) && ($this->app['request']->cookies->get('campanha_id'))) {
            $campaignId = $this->app['request']->cookies->get('campanha_id');
        }

        $campaignHelper = new CampaignHelper($this->response);
        $campaignHelper->setCampaignData($dataEnvio, $utmContent, $utmCampaign, $cmp, $campaignId);
    }

    protected function dataLayerValuesToPush(array $dataLayerCustom = [])  {
        $customerId = isset($this->app['user']['id_usr_legacy']) ? $this->app['user']['id_usr_legacy'] : '';
        $customerEmail = isset($this->app['user']['email']) ? $this->app['user']['email'] : '';

        $deduplication_criteo = ( !empty($this->app['session']->get('cmp')) && \in_array($this->app['session']->get('cmp'), $this->cmpsDeduplicationCriteoRule)) ? 1 : 0;

        $siteType = SiteController::SITE_TYPE_DESKTOP;
        if ($this->app["mobile_detect"]->isMobile() && !$this->app["mobile_detect"]->isTablet()) {
            $siteType = SiteController::SITE_TYPE_MOBILE;
        } else if ($this->app["mobile_detect"]->isMobile() && $this->app["mobile_detect"]->isTablet()) {
            $siteType = SiteController::SITE_TYPE_TABLET;
        }

        $dataLayerDefault = [
            "account" => SiteController::CRITEO_ACOUNT,
            "CustomerID" => $customerId,
            "deduplication_criteo" => $deduplication_criteo,
            "SiteType" => $siteType,
            "customerEmail"=>$customerEmail,
            "event"=>"dyn_rmkt"
            ];

        return json_encode( count($dataLayerCustom) ? array_merge($dataLayerCustom, $dataLayerDefault) : $dataLayerDefault );
    }

    public function useLogger() {
        $this->logger = new \BusinessLogic\Helper\LoggerHelper();
    }

    public function setUsrDataExtranet() {

        if ((is_array($this->app['request']) || (!preg_match('/phpunit/', $_SERVER['PHP_SELF'])))) {

            $this->app['name'] = $this->app['session']->get('usrEmail');
            $this->app['usrPropertyId'] = $this->app['session']->get('usrPropertyId');

            // if ($this->app['session']->get('usrType') == 1) {
            //     $this->app['permission'] = 'hotel';
            // } elseif ($this->app['session']->get('usrType') == 2) {
            //     $this->app['permission'] = 'admin';
            // } elseif ($this->app['session']->get('usrType') == 3) {
            //     $this->app['permission'] = 'rede';
            // }

            if ($this->app['session']->get('usrPropertyId') != '') {
                $hotel = new PropertyLogic($this->app);
                $propertyData = $hotel->findPropertyById($this->app['session']->get('usrPropertyId'))->attributes();

                $this->app['usrData'] = array(
                    'propertyName' => $propertyData['name'],
                    'propertyId' => $propertyData['id'],
                    'propertyAvatar' => $propertyData['avatar'],
                    'usrType' => $this->app['session']->get('usrType')
                );

                $property = new PropertyLogic();
                $propertyValues = $property->findPropertyById($this->app['usrPropertyId']);

                $value = count($propertyValues->attributes());

                $accommodationsValues = $property->searchAccommodationByIdProperty($this->app['usrPropertyId']);
                $accommodationsValues = 0;
                if (count($accommodationsValues->attributes) > 1) {
                    $accommodationsValues = count($accommodationsValues->attributes());
                }
                $value = $value + $accommodationsValues;

                $feature = new PropertyFeatureLogic();
                $propertyValues = $feature->searchFeatureByIdProperty($this->app['usrPropertyId']);
                $propertyValues = 0;
                if (count($propertyValues->attributes) > 1) {
                    $propertyValues = count($propertyValues->attributes());
                }
                $value = $value + $propertyValues;

                $contact = new ContactLogic();
                $contactValues = $contact->searchContactByPropertyId($this->app['usrPropertyId'], false);
                $value = $value + count($contactValues);

                $porcentagem = ($value * 100) / 47;

                $this->app['percent'] = round($porcentagem, 0);

                $property = new PropertyLogic($this->app);
                $requests = $property->searchRequestById($this->app['usrPropertyId']);
                $this->app['request'] = $requests;
            } elseif($this->app['session']->get('usrType') == 2) {
                $this->app['usrData'] = array(
                    'propertyName' => 'ADMIN',
                    'propertyId' => 0,
                    'propertyAvatar' => 'hu_admin.png',
                    'usrType' => $this->app['session']->get('usrType')
                );
            } elseif($this->app['session']->get('usrType') == 3) {
                $this->app['usrData'] = array(
                    'propertyName' => $this->app['session']->get('usrChainName'),
                    'propertyId' => 0,
                    'propertyAvatar' => 'hu_admin.png',
                    'usrType' => $this->app['session']->get('usrType')
                );
            }
        }

    }
}
