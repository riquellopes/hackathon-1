<?php

namespace BusinessLogic\ACL;

use BusinessLogic\ACL\Models\Role;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

class Cerberus
{
    protected $user_role = Role::ANONYMOUS;
    protected $user_id = null;
    protected $trace = array();

    /**
     * Carrega parâmetros do usuário para carregar posteriormente suas regras
     * @param int $id   id do usuário
     * @param int $role id do papel
     */
    public function setUser($id, $role)
    {
        $this->user_id = $id;
        $this->role_id = $role;
    }

    /**
     * Exclusivo para debug
     * @return array informações sobre o estado do serviço
     */
    public function getTrace()
    {
        return array(
            'user_id' => $this->user_id,
            'role_id' => $this->role_id,
            'trace'   => $this->trace
        );
    }

    /**
     * Carrega as operações atribuídas ao usuário carregado
     * @return array lista de operações
     */
    public function loadAssignments()
    {
        return OperationLogic::getAllowedOperations($this->user_id, $this->role_id);
    }

    public function getLoggedOutRoutes()
    {
        $granted[] = array('name' => '/login', 'action' => 'LoginController:index');
        $granted[] = array('name' => '/login/', 'action' => 'LoginController:index');
        $granted[] = array('name' => 'extranet', 'action' => 'closure');
        $granted[] = array('name' => 'hotel_login', 'action' => 'closure');
        $granted[] = array('name' => '', 'action' => 'closure');

		return $granted;
    }

    /**
     * Checa se o usuário tem permissão para acessar a operação que ele está
     * tentando acessar
     * @param  Request $request objeto request
     * @return bool    se o acesso foi permitido ou não
     */
    public function checkAccess($request)
    {
        if ($request->getSession()->get("usrType") == Role::ROLE_ADMIN) {
            return true;
        }

        $route = $request->attributes->get("_route");
        if(empty($route)){
            throw new NotFoundHttpException();
        }

        try{
            $controller = $request->attributes->get("_controller");
            if(is_string($controller)){
                $actualActionExploded = explode(':', $controller);
                $actualClassController = $actualActionExploded[0];
                if ($actualClassController == 'SiteController') {
                    return true;
                }
            }
        } catch (\Exception $e) {
            throw new \Exception($e->getMessage());
        }

        /**
	     * Rotas permitidas ao usuário
	     * Quando uma rota não tiver controller, sendo uma closure, a
	     * verificação será feita pela rota em si.
	     * Ex.: '/extranet/'
         * @TODO: Refatorar / Colocar rotas permitidas num arquivo de configuração
         * ou em  lugar melhor
	     */
        if ($request->getSession()->has("roles")) {
            $granted = $request->getSession()->get("roles");
        } else {
            $granted = $this->getLoggedOutRoutes();
        }



        /**
         * Informações da rota acessada no momento da requisição
         */
        $actual = array(
            'name'    => $route,
            'action' => $request->attributes->get("_controller"),
            'parameters' => $request->attributes->get("_route_params")
        );
        // die(print_r($actual));
        $actual['action'] = ($actual['action'] instanceof \Closure) ? 'closure' : $actual['action'];
        $actual['name']      = $this->clearRouteToCompare($actual['name']);

        /**
         * Para cada rota permitida compara com a rota atual, se admin ous fae
         * os controllers forem iguais e diferentes de closures ou seo nome das
         * rotas forem iguais e o controller for igual a 'closure' o acesso é
         * permitido
         */
        foreach ($granted as $key => $value) {
            if (
                ($value['action'] == $actual['action'] && $actual['action'] != 'closure') ||
                ($value['name'] == $actual['name']  && $actual['action'] == 'closure')
            ) {
                return true;
            }
        }

        return false;
    }

    public function checkAccessToGivenRoute($session, $route)
    {
        // die(print_r($_SERVER));
        if ($session->get("usrType") == Role::ROLE_ADMIN) {
            return true;
        }
        /**
	     * Rotas permitidas ao usuário
	     * Quando uma rota não tiver controller, sendo uma closure, a
	     * verificação será feita pela rota em si.
	     * Ex.: '/extranet/'
	     */
        if ($session->has("roles")) {
            $granted = $session->get("roles");
        } else {
            $granted = $this->getLoggedOutRoutes();
        }
        // die(print_r($granted));

        /**
         * Para cada rota permitida compara com a rota atual, se admin ous fae
         * os controllers forem iguais e diferentes de closures ou seo nome das
         * rotas forem iguais e o controller for igual a 'closure' o acesso é
         * permitido
         * OBS: Caso a url tenha um ID de request no final da rota, ele é retirado da string.
         */
        $routeExploded = explode('/', $route);
        if(is_numeric($routeExploded[count($routeExploded)-1])){
            unset($routeExploded[count($routeExploded)-1]);
        }
        $route = implode('/', $routeExploded);

        foreach ($granted as $key => $value) {
            if ($value['name'] == $route) {
                return true;
            }
        }

        return false;
    }

    /**
     * Limpa a rota no caso de ela não ter um bind (alias), transformando-a no
     * padrão
     * @param  string $route rota a ser transformada ex.: "GET_rota_"
     * @return string rota transformada ex.: "/rota/"
     */
    private function clearRouteToCompare($route)
    {
        if(is_string($route)){
            return preg_replace('/^([A-Z]+_)|(_$)/', '', $route);
        } 
        return $route;
    }
}
