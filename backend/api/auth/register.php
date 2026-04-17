<?php
require_once __DIR__ . "/../../config/headers.php";
require_once __DIR__ . "/../../config/db.php";
require_once __DIR__ . "/../../src/helpers.php";
require_once __DIR__ . "/../../src/validator.php";

$data = getJsonData();
$errors = validateRegister($data);

if (!empty($errors)) {
    echo json_encode([
        "success" => false,
        "errors" => $errors
    ]);
    exit();
}

$name = trim($data["name"]);
$email = trim($data["email"]);
$password = $data["password"];
$role = trim($data["role"]);

try {
    $checkQuery = "SELECT id FROM users WHERE email = ?";
    $checkStmt = $pdo->prepare($checkQuery);
    $checkStmt->execute([$email]);

    if ($checkStmt->fetch()) {
        echo json_encode([
            "success" => false,
            "message" => "Email already exists"
        ]);
        exit();
    }

    $passwordHash = password_hash($password, PASSWORD_DEFAULT);

    $query = "INSERT INTO users (name, email, password_hash, role) VALUES (?, ?, ?, ?)";
    $stmt = $pdo->prepare($query);
    $stmt->execute([$name, $email, $passwordHash, $role]);

    echo json_encode([
        "success" => true,
        "message" => "User registered successfully",
        "user_id" => $pdo->lastInsertId()
    ]);
} catch (PDOException $e) {
    echo json_encode([
        "success" => false,
        "message" => "Failed to register user"
    ]);
}