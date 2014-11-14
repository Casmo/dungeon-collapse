<?php
namespace DungeonCollapse;

define('DS', DIRECTORY_SEPARATOR);
define('ROOT', dirname(__FILE__) . DS);

include ROOT . 'classes' . DS . 'Main.php';
include ROOT . 'classes' . DS . 'User.php';

/**
 * Dispatcher for requesting api calls. The following parameters should be provided while
 * requesting information. Parameters could be posted or through get parameters.
 * @param string t the topic to be requested. e.g. 'game', 'tile', '....'
 *
 * @return void. Outputs a json decode message or array with the requested information.
 * The following error_code are provided in case something went wrong
 * 1: Topic or other viral information not provided.
 * 2: Specific information (topic or other requested information) not found.
 */
$defaults = array(
    't' => ''
);
$params = array_merge($defaults, $_POST, $_GET);
header("content-type: application/json");

if (empty($params['t'])) {
    echo json_encode(
        array(
            'error_code' => 1,
            'message' => 'Invalid parameters provided. Topic not provided.'
        )
    );
    exit;
}

switch ($params['t']) {

    case 'user':
        $User = new User();
        $User->me();
    break;

    default:
        echo json_encode(
            array(
                'error_code' => 2,
                'message' => 'Invalid topic. Topic not found.'
            )
        );
        exit;

}