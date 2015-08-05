<?php

namespace Controllers;

use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\Session\Session;
//use BusinessLogic\Helper\ValidateHelper;
//use BusinessLogic\Log\ActionLogLogic;
//use BusinessLogic\User\Models\SystemUser;
//use BusinessLogic\Helper\MailHelper;
//use BusinessLogic\SystemUser\SystemUserLogic;
//use BusinessLogic\Chain\Models\Chain;
use BusinessLogic\ACL\Models\UserRole;

class LoginController extends BaseController
{

    public function __construct($app)
    {
        parent::__construct($app);
    }

    public function index()
    {
        if (!empty($this->app['session']->get('usrId'))) {
            return $this->app->redirect('/index/');
        } else {
            $data = date("H");
            $flag = 0;

            if (($data >= 00) && ($data <= 11)) {
                $hora = 'dia';
            }

            if (($data >= 12) && ($data <= 17)) {
                $hora = 'tarde';
            }

            if (($data >= 18) && ($data <= 23)) {
                $hora = 'noite';
            }

            $this->app['twig']->addGlobal('layout_login', $this->app['twig']->loadTemplate('layout-login.html'));
            return $this->app['twig']->render('/admin/login.html', array('result' => $hora, 'title' => 'Login', 'flag' => $flag, 'hora' => date("H:m"), 'ip' => $_SERVER['REMOTE_ADDR']));
        }

        return true;
    }

    public function logout()
    {
        $log = new ActionLogLogic();
        $log->persistLog(0, '0', 0, __METHOD__, '{"Gestor de Extranet Saiu":"ok"}');
        $this->app['session']->clear();
        return $this->app->redirect('/index/');
    }

    public function login(Request $request)
    {

        $app = require __DIR__ . '/../app.php';

        $validate = new ValidateHelper();

        if (!$validate->validateFormRules(array('login'), $_POST)) {

            if (count($validate->getErrors()) > 0) {

                return new Response(json_encode($validate->getErrors()), 503, array('Content-Type' => 'application/json'));
            }
        }

        try {
            $sysUser = new SystemUser();
            $chain = new Chain();

            $sysUser->switch_connection('master');

            $sys = $sysUser->all(array('conditions' => array('user_email = ? AND status = ?', $request->request->get('itxEmail'), SystemUserLogic::USUARIO_ATIVO), 'include' => array('chain_system_user')));
            if(empty($sys)){
                return new Response(json_encode(array('message' => 'Usuario nao encontrado')), 503, array('Content-Type' => 'application/json'));
            }

            $usrDbData = $sys[0]->attributes();
            $usrDbData['chain_system_user'] = $sys[0]->chain_system_user;

            $chain_info = null;
            if(isset($usrDbData['chain_system_user']->chain_id)){
                $chain_info = $chain->all(array('conditions' => array('id = ?', $usrDbData['chain_system_user']->chain_id)));
            }
            // $this->debug($chain_info[0]->attributes()['name']);

            $user_role = UserRole::all('first', array('conditions' => array('user_id = ?', $usrDbData['id'])));
            if ($user_role != null) {
                $role_id = $user_role[0]->role_id;
            } else {
                $role_id = 0;
            }

            $sysUser->switch_connection('slave');
        } catch (Exception $e) {
            #write log
            $this->logger->setSourceFile($e->getFile());
            $this->logger->setLineFile($e->getLine());
            $this->logger->write(
                \BusinessLogic\Helper\LoggerHelper::GRAYLOG2,
                \BusinessLogic\Helper\LoggerHelper::ERROR,
                "Usuario nao encontrado",
                sprintf(' with message "%s"', $e->getMessage())
            );
            return new Response(json_encode(array('message' => 'Usuario nao encontrado')), 503, array('Content-Type' => 'application/json'));
        }

        $usrData = array(
            "usrEmail" => $request->request->get('itxEmail'),
            "usrPassword" => $request->request->get('itxPassword'),
        );

        if (md5($request->request->get('itxPassword')) === base64_decode($usrDbData['password'])) {
            //if($usrDbData['password'] == $request->request->get('itxPassword'))
            //$session->start();
            $this->app['session']->set('usrId', $usrDbData['id']);
            $this->app['session']->set('usrName', $usrDbData['username']);
            $this->app['session']->set('usrType', $usrDbData['user_type']);
            $this->app['session']->set('usrEmail', $usrDbData['user_email']);
            $this->app['session']->set('usrPropertyId', $usrDbData['property_id']);
            $this->app['session']->set('usrRoleId', $role_id);
            if(isset($usrDbData['property_name'])){
                $this->app['session']->set('usrPropertyName', $usrDbData['property_name']);
            }
            if(isset($usrDbData['chain_system_user']->chain_id)){
                $this->app['session']->set('usrChainId', $usrDbData['chain_system_user']->chain_id);
                $this->app['session']->set('usrChainName', $chain_info[0]->attributes()['name']);
            } else{
                $this->app['session']->set('usrChainId', null);
                $this->app['session']->set('usrChainName', null);
            }
            // die(print_r($this->app['session'], true));

            // $this->app['usrData'] = array('propertyID' => 1);
            $this->app['name'] = $usrDbData['user_email'];
            $this->app['usrPropertyId'] = $usrDbData['property_id'];

            if (!$usrDbData['property_id']) {
                $propriedade = 0;
            } else {
                $propriedade = $usrDbData['property_id'];
            }

            $log = new ActionLogLogic();
            $log->persistLog($usrDbData['id'], '0', $propriedade, __METHOD__, '{"Gestor de Extranet Autenticado":"' . $usrDbData['id'] . '"}');
        } else {
            return new Response(json_encode(array('itxEmail' => 'Usuario ou senha inválidos')), 503, array('Content-Type' => 'application/json'));
        }

        return new Response(json_encode(array('url' => $app['url_generator']->generate('index'))), Response::HTTP_OK, array('Content-Type' => 'application/json'));
    }

    public function loginAsPropertyId($id)
    {
        $adminId = 0;

        if (!is_numeric($id) || ($this->app['session']->get('usrType')) != '2') {
            return new Response(json_encode(array('url' => $this->app['url_generator']->generate('login'), 'message' => 'Nao Autorizado :: Usuario o Senha invalidos')), 503, array('Content-Type' => 'application/json'));
        }

        $sysUser = new SystemUser();

        $sysUser->switch_connection('master');

        $sys = $sysUser->find(array('conditions' => array('property_id = ? AND status = ?', $id, SystemUserLogic::USUARIO_ATIVO)));

        $sysUser->switch_connection('slave');

        $usrDbData = $sys->attributes();

        if (empty($usrDbData)) {
            return new Response(json_encode("Sem retorno de dados de usuário ou você não é admin"), 503, array('Content-Type' => 'application/json'));
        }

        $adminId = $this->app['session']->get('usrId'); //original UserID

        $usrData = array(
            "usrEmail" => $usrDbData['username'],
            "usrPassword" => '',
        );

        if (!empty($usrDbData)) {
            $this->app['session']->set('usrId', $usrDbData['id']);
            $this->app['session']->set('usrName', $usrDbData['username']);
            $this->app['session']->set('usrType', $usrDbData['user_type']);
            $this->app['session']->set('usrEmail', $usrDbData['user_email']);
            $this->app['session']->set('usrPropertyId', $usrDbData['property_id']);
            $this->app['session']->set('usrPropertyName', $usrDbData['property_name']);
            $this->app['session']->set('isAdmin', "TRUE");
            $this->app['session']->set('adminId', $adminId);

            $this->app['isAdmin'] = "TRUE";
            $this->app['adminId'] = $adminId;

            // $this->app['usrData'] = array('propertyID' => 1);
            $this->app['name'] = $usrDbData['user_email'];
            $this->app['usrPropertyId'] = $usrDbData['property_id'];
            $this->app['session']->remove('roles');
        } else {
            //return new Response(json_encode(array('error'=>'Senha inválida')), 503, array('Content-Type' => 'application/json'));
            return new Response(json_encode(array('url' => $this->app['url_generator']->generate('login'), 'message' => 'Usuario ou Senha invalidos ou voce nao é admin')), 503, array('Content-Type' => 'application/json'));
        }

        $log = new ActionLogLogic();
        $log->persistLog($adminId, '0', $this->app['usrPropertyId'], 'login', '{"Admin Logou como Propriedade":"' . $usrDbData['property_id'] . '"}');

        return $this->app->redirect('/index/');
    }

    public function forgotPassword(Request $request)
    {

        $request = $request->request->all();

        try {
            $sysUser = new SystemUser();

            $sysUser->switch_connection('master');

            $sys = $sysUser->all(array('conditions' => array('user_email = ? AND status = ?', $request['email'], SystemUserLogic::USUARIO_ATIVO)));

            $sysUser->switch_connection('slave');

            if (count($sys) > 0) {


                $link = $this->app['serverName'] . '/resetPassword/' . base64_encode($sys[0]->id);

                $emailTpl = $this->formForgotPassword($link);
                $email = new MailHelper($this->app);
                $email->sendMail(array($request['email']), array('notifica@hotelurbano.com' => 'Hotel Urbano'), 'Hotel Urbano - Solicitação para alterar senha ', $emailTpl);

                $sysUser = new SystemUser();

                $sysUser->switch_connection('master');

                $sys = $sysUser->all(array('conditions' => array('user_email = ?', $request['email'])));

                $sysUser->switch_connection('slave');

                $user = new SystemUserLogic();

                $user->changeStatusEmail($sys[0]->id, '1');

                return new Response(json_encode(array('message' => 'sucesso')), 200, array('Content-Type' => 'application/json'));
            } else {
                return new Response(json_encode(array('message' => 'Usuario nao encontrado')), 200, array('Content-Type' => 'application/json'));
            }
        } catch (Exception $e) {
            #write log
            $this->logger->setSourceFile($e->getFile());
            $this->logger->setLineFile($e->getLine());
            $this->logger->write(
                \BusinessLogic\Helper\LoggerHelper::GRAYLOG2,
                \BusinessLogic\Helper\LoggerHelper::ERROR,
                "Usuario nao encontrado",
                sprintf(' with message "%s"', $e->getMessage())
            );
            return new Response(json_encode(array('message' => 'Usuario nao encontrado')), 503, array('Content-Type' => 'application/json'));
        }
    }

    public function resetPassword($id)
    {

        $sysUser = new SystemUser();

        $sysUser->switch_connection('master');

        $sys = $sysUser->all(array('conditions' => array('id = ? AND status_email = 1', base64_decode($id))));

        $sysUser->switch_connection('slave');

        if (count($sys) > 0) {
            $user = new SystemUserLogic();


            $senha = $this->rand_string(7);

            $user->changePassword($sys[0]->id, $newPassword = base64_encode(md5($senha)));

            $user->changeStatusEmail($sys[0]->id, '0');

            $emailTpl = $this->newtPassword($senha);
            $email = new MailHelper($this->app);
            $email->sendMail(array($sys[0]->user_email), array('notifica@hotelurbano.com' => 'Hotel Urbano'), 'Hotel Urbano - Senha alterada ', $emailTpl);

            return $this->app->redirect('/admin/');
        }
    }

    public function formForgotPassword($link)
    {

        $return = '';
        $return .= '<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN"><html><head><META http-equiv="Content-Type" content="text/html; charset=utf-8"></head><body>';

        $return .= '<div style="font-family:Arial">';
        $return .= '<table style="width:600px;border-collapse:collapse" cellspacing="0" cellpadding="0">';
        $return .= '  <tr>';
        $return .= '     <td><img src="' . $this->app['pathAssetsDeploy'] . '/images/email-nhu/logo.png" alt="Hotel Urbano"></td>';
        $return .= '  </tr>';
        $return .= '<tr>';
        $return .= '     <td style="text-align:center">';
        $return .= '         <h1 style="margin:10px 0 0 0;font-size:21px;font-weight:normal">Prezado usuário</h1>';
        $return .= '          <p style="margin:0;font-size:14px;padding:0 0 20px 0">';
        $return .= '             Recebemos sua solicitação de mudança de senha';
        $return .= '        </p>';
        $return .= '     </td>';
        $return .= ' </tr>';
        $return .= ' <tr>';
        $return .= '     <td style="padding:20px;background:#fef2c3">';
        $return .= '          <p style="font-size:14px;color:#c56016;margin:0;text-align:center"> <a href=' . $link . '>Clicando aqui</a> você receberá um novo email com sua nova senha.  </p>';
        $return .= '     </td>';
        $return .= ' </tr>';
        $return .= '  <tr>';
        $return .= '    <td style="padding:20px 0">';
        $return .= '       <p style="font-size:14px;color:#003965;margin:0;text-align:left">';
        $return .= '       </p>';
        $return .= '    </td>';
        $return .= ' </tr>';

        $return .= '  <tr>';
        $return .= '     <td><img src="' . $this->app['pathAssetsDeploy'] . '/images/email-nhu/rodape.png"></td>';
        $return .= '  </tr>';

        $return .= '</table>';




        $return .= '</div>';

        $return .= '</body></html>';



        return $return;
    }

    public function newtPassword($senha)
    {

        $return = '';
        $return .= '<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN"><html><head><META http-equiv="Content-Type" content="text/html; charset=utf-8"></head><body>';

        $return .= '<div style="font-family:Arial">';
        $return .= '<table style="width:600px;border-collapse:collapse" cellspacing="0" cellpadding="0">';
        $return .= '  <tr>';
        $return .= '     <td><img src="' . $this->app['pathAssetsDeploy'] . '/images/email-nhu/logo.png" alt="Hotel Urbano"></td>';
        $return .= '  </tr>';
        $return .= '<tr>';
        $return .= '     <td style="text-align:center">';
        $return .= '         <h1 style="margin:10px 0 0 0;font-size:21px;font-weight:normal">Prezado usuário</h1>';
        $return .= '          <p style="margin:0;font-size:14px;padding:0 0 20px 0">';
        $return .= '             Resetamos a sua senha conforme solicitado';
        $return .= '        </p>';
        $return .= '     </td>';
        $return .= ' </tr>';
        $return .= ' <tr>';
        $return .= '     <td style="padding:20px;background:#fef2c3">';
        $return .= '          <p style="font-size:14px;color:#c56016;margin:0;text-align:center"> Sua nova senha é: <b>' . $senha . '</b> </p>';
        $return .= '     </td>';
        $return .= ' </tr>';
        $return .= '  <tr>';
        $return .= '    <td style="padding:20px 0">';
        $return .= '       <p style="font-size:14px;color:#003965;margin:0;text-align:left">';
        $return .= '       </p>';
        $return .= '    </td>';
        $return .= ' </tr>';

        $return .= '  <tr>';
        $return .= '     <td><img src="' . $this->app['pathAssetsDeploy'] . '/images/email-nhu/rodape.png"></td>';
        $return .= '  </tr>';

        $return .= '</table>';




        $return .= '</div>';

        $return .= '</body></html>';



        return $return;
    }

    function rand_string($length)
    {

        $chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
        return substr(str_shuffle($chars), 0, $length);
    }

}
