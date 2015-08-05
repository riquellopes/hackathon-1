<?php

namespace BusinessLogic\ACL;

use Silex\Application;
use Silex\ServiceProviderInterface;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpKernel\Exception\AccessDeniedHttpException;

class AccessServiceProvider implements ServiceProviderInterface
{
    /**
	 * Define o serviço que irá tomar conta do ACL
	 * @param  Silex\Application $app
	 * @return void
	 */
    public function register(Application $app)
    {
        $app['cerberus'] = $app->share(function ($app) {
            return new Cerberus($app);
        });

        $app->before(function (Request $request) use ($app) {
            if (!$app['cerberus']->checkAccess($request)) {
                throw new AccessDeniedHttpException("Você não tem acesso a esta operação.");
            }
        });
    }

    /**
	 * Executa em todos os requests, tomar cuidado!
	 * Aqui vemos se existe o usuário na sessão e se não tem regras de acesso,
	 * se não houver carrega as regras de acesso do usuário para a sessão
	 * @param  Silex\Application $app
	 * @return void
	 */
    public function boot(Application $app)
    {
        if ($app['session']->has('usrRoleId') && !$app['session']->has('roles')) {
            // $app['cerberus']->setUser($app['session']->get('usrId'), $app['session']->get('usrRoleId'));
            $app['cerberus']->setUser($app['session']->get('usrId'), $app['session']->get('usrRoleId'));
            $app['session']->set('roles', $app['cerberus']->loadAssignments());
            // die(print_r($app['cerberus']->getTrace()));
        }
    }

}
