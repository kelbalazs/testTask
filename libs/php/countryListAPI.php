<?php
// Comprehensive error reporting
ini_set('display_errors', 'On');
error_reporting(E_ALL);

// API source URL with predefined parameters and the dynamic country code
$url = "http://api.geonames.org/countryInfoJSON?formatted=true&lang=en&username=kelbal";

// Initialize Curl 
$ch = curl_init();

// Set options for Curl
curl_setopt_array($ch, array(
    CURLOPT_SSL_VERIFYPEER => false, // FALSE to stop cURL from verifying the peer's certificate
    CURLOPT_RETURNTRANSFER => true, // TRUE to return the transfer as a string instead of outputting it directly
    CURLOPT_URL => $url // The URL to fetch
));

// Execute the cURL request and store the result
$result = curl_exec($ch);

// Check for errors
if(curl_errno($ch)){
    echo 'Curl error: ' . curl_error($ch);
}

// Close Curl session
curl_close($ch);

$decode = json_decode($result, true);

foreach($decode["geonames"] as $data){
    $output[] = array("countryCode" => $data['countryCode'],"countryName"=> $data['countryName']);
    
}
// echo "<pre>";
// print_r($output);
// Output the result
header('Content-Type: application/json; charset=UTF-8');
// Output JSON response
echo json_encode($output);
?>
