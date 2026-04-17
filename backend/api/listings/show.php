<?php
require_once __DIR__ . "/../../config/db.php";

header("Content-Type: application/json");

if (!isset($_GET["id"])) {
    echo json_encode(["error" => "Missing id"]);
    exit();
}

$id = $_GET["id"];

$query = "SELECT * FROM listings WHERE id = ?";

$stmt = $pdo->prepare($query);
$stmt->execute([$id]);

$result = $stmt->fetch(PDO::FETCH_ASSOC);

if ($result) {
    echo json_encode($result);
} else {
    echo json_encode(["error" => "Listing not found"]);
}