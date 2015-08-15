#!/usr/bin/env bash
export DEBIAN_FRONTEND=noninteractive

echo "-- Atualizado repositório --"
apt-get update

echo "-- Instalando nginx --"
apt-get install -y nginx

echo "-- Instalando PHP --"
apt-get install -y php5 php5-dev php5-fpm php5-mysql php5-redis php5-memcached php5-curl

echo "-- Baixando Composer --"
curl -sS https://getcomposer.org/installer | php
mv composer.phar /usr/local/bin/composer

echo "-- Instalando Dependencias --"
composer install --working-dir /home/vagrant/hackathon/
cd /home/vagrant/hackathon/
/usr/local/bin/composer self-update
composer update

echo "-- Configurando Log --"
mkdir -p /home/vagrant/hackathon/var/logs/
touch /home/vagrant/hackathon/var/logs/silex_dev.log
chmod 777 /home/vagrant/hackathon/var/logs/silex_dev.log

echo "-- Configurando nginx --"
sudo rm -f /etc/nginx/sites-enabled/default
cp /home/vagrant/hackathon/server-confs/nginx.conf /etc/nginx/nginx.conf
cp /home/vagrant/hackathon/server-confs/hackathon.conf /etc/nginx/sites-available/hackathon.conf
ln -s /etc/nginx/sites-available/hackathon.conf /etc/nginx/sites-enabled/hackathon.conf
chown -R www-data:www-data /home/vagrant/hackathon/
sudo chmod 755 /home/vagrant/hackathon/ -R
/etc/init.d/nginx reload

echo "-- Instalando memcache --"
apt-get install -y memcached
cp /home/vagrant/hackathon/server-confs/memcached.conf /etc/memcached.conf
/etc/init.d/memcached restart

echo "-- Instalando Redis --"
apt-get install -y redis-server
cp /home/vagrant/hackathon/server-confs/redis.conf /etc/redis/redis.conf

echo "-- Instalando Interface gráfica para fila --"
gem install resque
resque-web -p 5678

echo "-- Instalando MySql --"
apt-get install -y mysql-server-5.6
cp /home/vagrant/hackathon/server-confs/my.conf /etc/mysql/my.cnf
/etc/init.d/mysql restart

echo "-- Configurando MySql --"
mysql -uroot -e "create database hackathon"

echo "-- Criando Usuário --"
mysql -e "create user 'hackathon'@'%' identified by 'hackathon'"
mysql -e "GRANT ALL PRIVILEGES ON *.* TO 'hackathon'@'%' WITH GRANT OPTION"

echo "-- Instalando dependencias para o db migrate --"
apt-get install -y python-pip
apt-get install -y python-mysqldb
pip install simple-db-migrate 

echo "-- Setando arquivo de configuração --"
cp /home/vagrant/hackathon/config/settings_local.php.default /home/vagrant/hackathon/config/settings_local.php

echo "-- Instalando Node.js"
curl -sL https://deb.nodesource.com/setup | sudo bash -
apt-get install -y  nodejs git

echo "-- Instalando Grunt"
cd /home/vagrant/hackathon/
npm install grunt --save-dev

echo "-- Instalando o Bower"
npm install -g bower
bower install angular -f --allow-root

echo "-- Executando os pacotes"
npm install

echo "-- Pronto! --"
