<?php
require_once __DIR__ . "/../../config/headers.php";
require_once __DIR__ . "/../../config/db.php";
require_once __DIR__ . "/../../src/helpers.php";

$data = getJsonData();

if (!isset($data["id"]) || !is_numeric($data["id"])) {
    echo json_encode([
        "success" => false,
        "message" => "Valid listing id is required"
    ]);
    exit();
}

$id = (int) $data["id"];

try {
    $checkStmt = $pdo->prepare("SELECT id FROM listings WHERE id = ?");
    $checkStmt->execute([$id]);

    if (!$checkStmt->fetch()) {
        echo json_encode([
            "success" => false,
            "message" => "Listing not found"
        ]);
        exit();
    }

    $stmt = $pdo->prepare("UPDATE listings SET status = 'sold' WHERE id = ?");
    $stmt->execute([$id]);

    echo json_encode([
        "success" => true,
        "message" => "Listing marked as sold"
    ]);
} catch (PDOException $e) {
    echo json_encode([
        "success" => false,
        "message" => "Failed to mark listing as sold",
        "error" => $e->getMessage()
    ]);
}