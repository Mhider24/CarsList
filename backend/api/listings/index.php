<?php
require_once __DIR__ . "/../../config/db.php";

header("Content-Type: application/json");

$query = "
    SELECT 
        listings.id,
        listings.make,
        listings.model,
        listings.year,
        listings.price,
        listings.mileage,
        listings.title_status,
        listings.transmission,
        listings.fuel_type,
        listings.image_url,
        users.name AS seller_name
    FROM listings
    JOIN users ON listings.seller_id = users.id
    ORDER BY listings.created_at DESC
";

try {
    $stmt = $pdo->query($query);
    $data = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode($data);

} catch (PDOException $e) {
    echo json_encode([
        "error" => "Failed to fetch listings"
    ]);
}