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

function validateRegister($data) {
    $errors = [];

    if (!isset($data["name"]) || trim($data["name"]) === "") {
        $errors[] = "name is required";
    }

    if (!isset($data["email"]) || trim($data["email"]) === "") {
        $errors[] = "email is required";
    } elseif (!filter_var($data["email"], FILTER_VALIDATE_EMAIL)) {
        $errors[] = "valid email is required";
    }

    if (!isset($data["password"]) || trim($data["password"]) === "") {
        $errors[] = "password is required";
    } elseif (strlen($data["password"]) < 6) {
        $errors[] = "password must be at least 6 characters";
    }

    if (!isset($data["role"]) || trim($data["role"]) === "") {
        $errors[] = "role is required";
    }

    return $errors;
}

function validateLogin($data) {
    $errors = [];

    if (!isset($data["email"]) || trim($data["email"]) === "") {
        $errors[] = "email is required";
    }

    if (!isset($data["password"]) || trim($data["password"]) === "") {
        $errors[] = "password is required";
    }

    return $errors;
}