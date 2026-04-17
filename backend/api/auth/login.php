<?php
require_once __DIR__ . "/../../config/headers.php";
require_once __DIR__ . "/../../config/db.php";
require_once __DIR__ . "/../../src/helpers.php";
require_once __DIR__ . "/../../src/validator.php";

$data = getJsonData();
$errors = validateLogin($data);

if (!empty($errors)) {
    echo json_encode([
        "success" => false,
        "errors" => $errors
    ]);
    exit();
}

$email = trim($data["email"]);
$password = $data["password"];

try {
    $query = "SELECT id, name, email, password_hash, role FROM users WHERE email = ? LIMIT 1";
    $stmt = $pdo->prepare($query);
    $stmt->execute([$email]);

    $user = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$user) {
        echo json_encode([
            "success" => false,
            "message" => "Invalid email or password"
        ]);
        exit();
    }

    if (!password_verify($password, $user["password_hash"])) {
        echo json_encode([
            "success" => false,
            "message" => "Invalid email or password"
        ]);
        exit();
    }

    echo json_encode([
        "success" => true,
        "message" => "Login successful",
        "user" => [
            "id" => $user["id"],
            "name" => $user["name"],
            "email" => $user["email"],
            "role" => $user["role"]
        ]
    ]);
} catch (PDOException $e) {
    echo json_encode([
        "success" => false,
        "message" => "Failed to login"
    ]);
}