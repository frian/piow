<?php

use Silex\Provider;


$app = new Silex\Application();

$app->register(new Provider\SessionServiceProvider());

/*
 *  -- register service controller --------------------------------------------
*/
$app->register(new Provider\ServiceControllerServiceProvider());


/*
 *  -- register twig templating -----------------------------------------------
*/
$app->register(new Provider\TwigServiceProvider());


/*
 *  -- register HTTPFragment -----------------------------------------------
 */
$app->register(new Provider\HttpFragmentServiceProvider());


/*
 *  -- register form generator ------------------------------------------------
*/
$app->register(new Provider\FormServiceProvider());

/*
 *  -- register swiftmailer ---------------------------------------------------
*/
$app->register(new Provider\SwiftmailerServiceProvider());

// configure smtp
$app['swiftmailer.options'] =
array(
		'host'       => 'mail.at-info.ch',
		'port'       => 587,
		'username'   => 'andre@at-info.ch',
		'password'   => 'br@ind3ad',
		'encryption' => null,
		'auth_mode'  => null
);

/*
 *  -- register validator -----------------------------------------------------
*/
$app->register(new Provider\ValidatorServiceProvider());

/*
 *  -- register translator ----------------------------------------------------
*/
$app->register(new Provider\TranslationServiceProvider(), array(
		'locale' => 'fr',
));


/*
 *  -- load french validator message ------------------------------------------
*/
$app->before(function () use ($app) {
	$app['translator']->addLoader('xlf', new Symfony\Component\Translation\Loader\XliffFileLoader());
    $app['translator']->addResource(
	  'xlf',
	  __DIR__ . '/../vendor/symfony/validator/Resources/translations/validators.fr.xlf',
	  'fr',
	  'validators');
    
	  $app['translator']->setLocale('fr');
});



$app['twig'] = $app->extend('twig', function($twig, $app) {

    // add custom globals, filters, tags, ...

    return $twig;
});


return $app;
