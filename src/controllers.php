<?php

use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\RedirectResponse;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;


$app->get('/', function() use ($app, $rootDir, $imagesDir) {

    return $app['twig']->render('index.twig', array());
})
->bind('home');


$app->get('/{page}/{numpics}', function($page, $numpics) use ($app, $rootDir, $imagesDir) {

	$imagesBasePath = $rootDir.$imagesDir;

	if (!is_dir($imagesBasePath)) {
		return $app['twig']->render('errors/config.twig');
	}

	$offset = ($page - 1) * $numpics;
	
	$previews = preg_grep('/^prev-/', scandir($imagesBasePath));
	
	$previews = array_slice($previews, $offset, $numpics);

// 	return $app['twig']->render('pics.twig', array( 'previews' => $previews, 'imagesdir' => $imagesDir ));

	return new JsonResponse($previews);
});



$app->error(function (\Exception $e, $code) use ($app) {

    if ($app['debug']) {
        return;
    }

    // 404.html, 40x.html, 4xx.html, 500.html 5xx.html, default.html
    $templates = array(
        'errors/'.$code.'.twig',
        'errors/'.substr($code, 0, 2).'x.twig',
        'errors/'.substr($code, 0, 1).'xx.twig',
        'errors/default.twig',
    );

    return new Response($app['twig']->resolveTemplate($templates)->render(array('code' => $code)), $code);
});
