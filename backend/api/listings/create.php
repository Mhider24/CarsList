<?php
require_once __DIR__ . "/../../config/db.php";

header("Content-Type: application/json");

$data = json_decode(file_get_contents("php://input"), true);

$query = "
    INSERT INTO listings 
    (seller_id, make, model, year, price, mileage, title_status, transmission, fuel_type)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
";

$stmt = $pdo->prepare($query);

$stmt->execute([
    $data["seller_id"],
    $data["make"],
    $data["model"],
    $data["year"],
    $data["price"],
    $data["mileage"],
    $data["title_status"],
    $data["transmission"],
    $data["fuel_type"]
]);

echo json_encode([
    "message" => "Listing created"
]);