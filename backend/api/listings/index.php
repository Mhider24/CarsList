<?php
header("Content-Type: application/json");

$listings = [
    [
        "id" => 1,
        "make" => "Honda",
        "model" => "Civic",
        "year" => 2018,
        "price" => 14500,
        "mileage" => 82000,
        "title_status" => "Clean"
    ],
    [
        "id" => 2,
        "make" => "Ford",
        "model" => "Fusion",
        "year" => 2016,
        "price" => 9900,
        "mileage" => 110000,
        "title_status" => "Rebuilt"
    ]
];

echo json_encode($listings);