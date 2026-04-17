<?php
require_once __DIR__ . "/../../config/headers.php";
require_once __DIR__ . "/../../config/db.php";
require_once __DIR__ . "/../../src/helpers.php";

$data = getJsonData();

if (
    !isset($data["listing_id"]) || !is_numeric($data["listing_id"]) ||
    !isset($data["buyer_id"]) || !is_numeric($data["buyer_id"]) ||
    !isset($data["amount"]) || !is_numeric($data["amount"])
) {
    echo json_encode([
        "success" => false,
        "message" => "listing_id, buyer_id, and amount are required"
    ]);
    exit();
}

$listingId = (int) $data["listing_id"];
$buyerId = (int) $data["buyer_id"];
$amount = (float) $data["amount"];
$message = isset($data["message"]) ? trim($data["message"]) : "";

try {
    $listingStmt = $pdo->prepare("SELECT id FROM listings WHERE id = ?");
    $listingStmt->execute([$listingId]);

    if (!$listingStmt->fetch()) {
        echo json_encode([
            "success" => false,
            "message" => "Listing not found"
        ]);
        exit();
    }

    $buyerStmt = $pdo->prepare("SELECT id FROM users WHERE id = ?");
    $buyerStmt->execute([$buyerId]);

    if (!$buyerStmt->fetch()) {
        echo json_encode([
            "success" => false,
            "message" => "Buyer not found"
        ]);
        exit();
    }

    $stmt = $pdo->prepare("
        INSERT INTO offers (listing_id, buyer_id, amount, message)
        VALUES (?, ?, ?, ?)
    ");

    $stmt->execute([$listingId, $buyerId, $amount, $message]);

    echo json_encode([
        "success" => true,
        "message" => "Offer submitted successfully"
    ]);
} catch (PDOException $e) {
    echo json_encode([
        "success" => false,
        "message" => "Failed to submit offer",
        "error" => $e->getMessage()
    ]);
}