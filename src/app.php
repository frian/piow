<?php

use Silex\Application;
use Silex\Provider\TwigServiceProvider;
use Silex\Provider\UrlGeneratorServiceProvider;
use Silex\Provider\FormServiceProvider;
use Silex\Provider\SwiftmailerServiceProvider;
use Silex\Provider\ValidatorServiceProvider;
use Silex\Provider\TranslationServiceProvider;
use Silex\Provider\ServiceControllerServiceProvider;

$app = new Application();

/*
 *  -- register service controller --------------------------------------------
*/
$app->register(new ServiceControllerServiceProvider());

/*
 *  -- register twig templating -----------------------------------------------
*/
$app->register(new TwigServiceProvider());

/*
 *  -- register url generator -------------------------------------------------
*/
$app->register(new UrlGeneratorServiceProvider());

/*
 *  -- register form generator ------------------------------------------------
*/
$app->register(new FormServiceProvider());

/*
 *  -- register swiftmailer ---------------------------------------------------
*/
$app->register(new SwiftmailerServiceProvider());

// configure smtp
$app['swiftmailer.options'] =
array(
		'host'       => 'your-mail-server',
		'port'       => 'your-mail-port',
		'username'   => 'your-username',
		'password'   => 'your-password',
		'encryption' => null,
		'auth_mode'  => null
);

/*
 *  -- register validator -----------------------------------------------------
*/
$app->register(new ValidatorServiceProvider());

/*
 *  -- register translator ----------------------------------------------------
*/
$app->register(new Silex\Provider\TranslationServiceProvider(), array(
		'locale' => 'fr',
));

/*
 *  -- EXAMPLE : load french validator message --------------------------------
*/
$app->before(function () use ($app) {
	$app['translator']->addLoader('xlf', new Symfony\Component\Translation\Loader\XliffFileLoader());
  $app['translator']->addResource(
	  'xlf',
	  __DIR__ . '/../vendor/symfony/validator/Symfony/Component/Validator/Resources/translations/validators.fr.xlf',
	  'fr',
	  'validators');
});



$app['twig'] = $app->share($app->extend('twig', function($twig, $app) {

    // add custom globals, filters, tags, ...

    return $twig;
}));

return $app;
