<?php
require_once __DIR__ . "/../../config/headers.php";

if ($_SERVER["REQUEST_METHOD"] === "OPTIONS") {
    exit();
}

if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    echo json_encode([
        "success" => false,
        "message" => "Invalid request method."
    ]);
    exit();
}

if (!isset($_FILES["image"])) {
    echo json_encode([
        "success" => false,
        "message" => "No image file uploaded."
    ]);
    exit();
}

$file = $_FILES["image"];

if ($file["error"] !== UPLOAD_ERR_OK) {
    echo json_encode([
        "success" => false,
        "message" => "Upload failed."
    ]);
    exit();
}

$allowedMimeTypes = [
    "image/jpeg" => "jpg",
    "image/png" => "png",
    "image/webp" => "webp",
    "image/gif" => "gif"
];

$finfo = finfo_open(FILEINFO_MIME_TYPE);
$mimeType = finfo_file($finfo, $file["tmp_name"]);
finfo_close($finfo);

if (!isset($allowedMimeTypes[$mimeType])) {
    echo json_encode([
        "success" => false,
        "message" => "Only JPG, PNG, WEBP, and GIF images are allowed."
    ]);
    exit();
}

$maxSize = 5 * 1024 * 1024;
if ($file["size"] > $maxSize) {
    echo json_encode([
        "success" => false,
        "message" => "Image is too large. Maximum size is 5MB."
    ]);
    exit();
}

$extension = $allowedMimeTypes[$mimeType];
$uploadDir = __DIR__ . "/../../uploads/";

if (!is_dir($uploadDir)) {
    mkdir($uploadDir, 0777, true);
}

$uniqueName = uniqid("car_", true) . "." . $extension;
$destination = $uploadDir . $uniqueName;

if (!move_uploaded_file($file["tmp_name"], $destination)) {
    echo json_encode([
        "success" => false,
        "message" => "Could not save uploaded image."
    ]);
    exit();
}

$imageUrl = "/CarsList/backend/uploads/" . $uniqueName;

echo json_encode([
    "success" => true,
    "message" => "Image uploaded successfully.",
    "image_url" => $imageUrl
]);