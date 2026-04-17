<?php
require_once __DIR__ . "/../../config/headers.php";
require_once __DIR__ . "/../../config/db.php";

if (!isset($_GET["seller_id"]) || !is_numeric($_GET["seller_id"])) {
    echo json_encode([
        "success" => false,
        "message" => "Valid seller_id is required"
    ]);
    exit();
}

$sellerId = (int) $_GET["seller_id"];

try {
    $query = "
        SELECT
            offers.id AS offer_id,
            offers.amount,
            offers.message,
            offers.status,
            offers.created_at,
            listings.id AS listing_id,
            listings.make,
            listings.model,
            listings.year,
            listings.price AS listing_price,
            users.id AS buyer_id,
            users.name AS buyer_name,
            users.email AS buyer_email
        FROM offers
        JOIN listings ON offers.listing_id = listings.id
        JOIN users ON offers.buyer_id = users.id
        WHERE listings.seller_id = ?
        ORDER BY offers.created_at DESC
    ";

    $stmt = $pdo->prepare($query);
    $stmt->execute([$sellerId]);
    $offers = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode([
        "success" => true,
        "offers" => $offers
    ]);
} catch (PDOException $e) {
    echo json_encode([
        "success" => false,
        "message" => "Failed to fetch offers",
        "error" => $e->getMessage()
    ]);
}