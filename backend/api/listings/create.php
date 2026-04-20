<?php
require_once __DIR__ . "/../../config/headers.php";
require_once __DIR__ . "/../../config/db.php";

$data = json_decode(file_get_contents("php://input"), true);

if (!$data) {
    echo json_encode([
        "success" => false,
        "message" => "Invalid JSON input."
    ]);
    exit();
}

$query = "
    INSERT INTO listings 
    (
        seller_id,
        make,
        model,
        year,
        price,
        mileage,
        color,
        title_status,
        transmission,
        fuel_type,
        description,
        image_url,
        status
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
";

$stmt = $pdo->prepare($query);

$success = $stmt->execute([
    $data["seller_id"] ?? null,
    $data["make"] ?? "",
    $data["model"] ?? "",
    $data["year"] ?? null,
    $data["price"] ?? null,
    $data["mileage"] ?? null,
    $data["color"] ?? null,
    $data["title_status"] ?? "",
    $data["transmission"] ?? "",
    $data["fuel_type"] ?? "",
    $data["description"] ?? null,
    $data["image_url"] ?? null,
    "available"
]);

echo json_encode([
    "success" => $success,
    "message" => $success ? "Listing created successfully." : "Could not create listing."
]);