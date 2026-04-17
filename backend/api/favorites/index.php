<?php
require_once __DIR__ . "/../../config/headers.php";
require_once __DIR__ . "/../../config/db.php";

if (!isset($_GET["user_id"]) || !is_numeric($_GET["user_id"])) {
    echo json_encode([
        "success" => false,
        "message" => "Valid user_id is required"
    ]);
    exit();
}

$userId = (int) $_GET["user_id"];

try {
    $query = "
        SELECT 
            favorites.id AS favorite_id,
            listings.id,
            listings.seller_id,
            listings.make,
            listings.model,
            listings.year,
            listings.price,
            listings.mileage,
            listings.color,
            listings.title_status,
            listings.transmission,
            listings.fuel_type,
            listings.description,
            listings.image_url,
            listings.status,
            listings.created_at
        FROM favorites
        JOIN listings ON favorites.listing_id = listings.id
        WHERE favorites.user_id = ?
        ORDER BY favorites.created_at DESC
    ";

    $stmt = $pdo->prepare($query);
    $stmt->execute([$userId]);
    $favorites = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode([
        "success" => true,
        "favorites" => $favorites
    ]);
} catch (PDOException $e) {
    echo json_encode([
        "success" => false,
        "message" => "Failed to fetch favorites"
    ]);
}