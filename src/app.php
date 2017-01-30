<?php

use Silex\Provider;


$app = new Silex\Application();


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


return $app;
