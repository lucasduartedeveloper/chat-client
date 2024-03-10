FROM mysql/mysql-server:8.0.24

COPY config/user.cnf /etc/mysql/my.cnf

FROM php:8.0-apache
# FROM nginx-php-fpm:1.9.1

RUN docker-php-ext-install pdo pdo_mysql

COPY . .
RUN ls

ENV WEBROOT /var/www/html
WORKDIR /var/www/html

ENV APACHE_DOCUMENT_ROOT=/var/www/html
RUN sed -ri -e 's!/var/www/html!${APACHE_DOCUMENT_ROOT}!g' /etc/apache2/sites-available/*.conf
RUN sed -ri -e 's!/var/www/html!${APACHE_DOCUMENT_ROOT}!g' /etc/apache2/conf-available/*.conf

RUN docker-php-ext-install mysqli && docker-php-ext-enable mysqli
RUN apt-get update && apt-get upgrade -y