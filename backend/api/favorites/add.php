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
    $userStmt = $pdo->prepare("SELECT id FROM users WHERE id = ?");
    $userStmt->execute([$userId]);

    if (!$userStmt->fetch()) {
        echo json_encode([
            "success" => false,
            "message" => "User not found"
        ]);
        exit();
    }

    $listingStmt = $pdo->prepare("SELECT id FROM listings WHERE id = ?");
    $listingStmt->execute([$listingId]);

    if (!$listingStmt->fetch()) {
        echo json_encode([
            "success" => false,
            "message" => "Listing not found"
        ]);
        exit();
    }

    $checkStmt = $pdo->prepare("SELECT id FROM favorites WHERE user_id = ? AND listing_id = ?");
    $checkStmt->execute([$userId, $listingId]);

    if ($checkStmt->fetch()) {
        echo json_encode([
            "success" => false,
            "message" => "Listing is already in favorites"
        ]);
        exit();
    }

    $stmt = $pdo->prepare("INSERT INTO favorites (user_id, listing_id) VALUES (?, ?)");
    $stmt->execute([$userId, $listingId]);

    echo json_encode([
        "success" => true,
        "message" => "Listing added to favorites"
    ]);
} catch (PDOException $e) {
    echo json_encode([
        "success" => false,
        "message" => "Failed to add favorite",
        "error" => $e->getMessage()
    ]);
}