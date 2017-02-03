<?php

/*
 * configuration for development environment
 */
use Silex\Provider;

// include the prod configuration
require __DIR__.'/prod.php';

// enable the debug mode
$app['debug'] = true;


// register WebProfiler
$app->register(new Provider\WebProfilerServiceProvider(), array(
    'profiler.cache_dir' => __DIR__.'/../var/cache/profiler',
    'profiler.mount_prefix' => '/_profiler', // this is the default
));
