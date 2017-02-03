<?php

// include the piow configuration
require __DIR__.'/piow.php';


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
