<?php

function validateListing($data) {
    $errors = [];

    if (!isset($data["seller_id"]) || $data["seller_id"] === "") {
        $errors[] = "seller_id is required";
    }

    if (!isset($data["make"]) || trim($data["make"]) === "") {
        $errors[] = "make is required";
    }

    if (!isset($data["model"]) || trim($data["model"]) === "") {
        $errors[] = "model is required";
    }

    if (!isset($data["year"]) || !is_numeric($data["year"])) {
        $errors[] = "valid year is required";
    }

    if (!isset($data["price"]) || !is_numeric($data["price"])) {
        $errors[] = "valid price is required";
    }

    if (!isset($data["mileage"]) || !is_numeric($data["mileage"])) {
        $errors[] = "valid mileage is required";
    }

    if (!isset($data["title_status"]) || trim($data["title_status"]) === "") {
        $errors[] = "title_status is required";
    }

    if (!isset($data["transmission"]) || trim($data["transmission"]) === "") {
        $errors[] = "transmission is required";
    }

    if (!isset($data["fuel_type"]) || trim($data["fuel_type"]) === "") {
        $errors[] = "fuel_type is required";
    }

    return $errors;
}