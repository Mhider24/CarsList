<?php
require_once __DIR__ . "/../../config/headers.php";
require_once __DIR__ . "/../../config/db.php";
require_once __DIR__ . "/../../src/helpers.php";

$data = getJsonData();

if (
    !isset($data["user_id"]) || !is_numeric($data["user_id"]) ||
    !isset($data["listing_id"]) || !is_numeric($data["listing_id"])
) {
    echo json_encode([
        "success" => false,
        "message" => "user_id and listing_id are required"
    ]);
    exit();
}

$userId = (int) $data["user_id"];
$listingId = (int) $data["listing_id"];

try {
    $query = "DELETE FROM favorites WHERE user_id = ? AND listing_id = ?";
    $stmt = $pdo->prepare($query);
    $stmt->execute([$userId, $listingId]);

    echo json_encode([
        "success" => true,
        "message" => "Listing removed from favorites"
    ]);
} catch (PDOException $e) {
    echo json_encode([
        "success" => false,
        "message" => "Failed to remove favorite"
    ]);
}