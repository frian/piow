<?php

/*
 *  Gallery directory
 *
 *    standard configuration
 *    should work in most cases
 *    if not commment the following line
 *    and uncomment line 13 below
 */
$imagesDir = '/images/';

// $imagesDir = '/<optionnal subdomain>/<optionnal folder>/images/';


/*
 * configuration for production environment
 *
 */

// enable http caching
use Silex\Provider\HttpCacheServiceProvider;
$app->register(new HttpCacheServiceProvider());

// configure caching

// cache
$app['cache.path'] = __DIR__ . '/../var/cache';

// http cache dir
$app['http_cache.cache_dir'] = $app['cache.path'] . '/http';


$app['twig.path'] = array(__DIR__.'/../src/views');


// get root dir and remove ending slash
$rootDir = preg_replace( "/\/$/", '', $_SERVER['DOCUMENT_ROOT']);
