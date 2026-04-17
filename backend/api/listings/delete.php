<?php
require_once __DIR__ . "/../../config/db.php";

header("Content-Type: application/json");

$data = json_decode(file_get_contents("php://input"), true);

$query = "DELETE FROM listings WHERE id=?";

$stmt = $pdo->prepare($query);
$stmt->execute([$data["id"]]);

echo json_encode([
    "message" => "Listing deleted"
]);