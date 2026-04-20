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
    UPDATE listings
    SET
        make = ?,
        model = ?,
        year = ?,
        price = ?,
        mileage = ?,
        color = ?,
        title_status = ?,
        transmission = ?,
        fuel_type = ?,
        description = ?,
        image_url = ?
    WHERE id = ? AND seller_id = ?
";

$stmt = $pdo->prepare($query);

$success = $stmt->execute([
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
    $data["id"] ?? null,
    $data["seller_id"] ?? null
]);

echo json_encode([
    "success" => $success,
    "message" => $success ? "Listing updated successfully." : "Could not update listing."
]);