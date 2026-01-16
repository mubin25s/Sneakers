<?php
include_once 'db.php';

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'POST') {
    $data = json_decode(file_get_contents("php://input"));
    $action = isset($_GET['action']) ? $_GET['action'] : '';

    if ($action === 'register') {
        registerUser($conn, $data);
    } elseif ($action === 'login') {
        loginUser($conn, $data);
    } else {
        echo json_encode(["message" => "Invalid action"]);
    }
} else {
    echo json_encode(["message" => "Invalid request method"]);
}

function registerUser($conn, $data) {
    if (!$conn) { echo json_encode(["success" => false, "message" => "DB Connection Error"]); return; }
    
    // Basic validation
    if (empty($data->email) || empty($data->password)) {
        echo json_encode(["success" => false, "message" => "Incomplete data"]);
        return;
    }

    // Hash password
    $password_hash = password_hash($data->password, PASSWORD_BCRYPT);
    
    // Check if email exists
    $checkQuery = "SELECT id FROM users WHERE email = :email";
    $stmt = $conn->prepare($checkQuery);
    $stmt->bindParam(':email', $data->email);
    $stmt->execute();
    
    if($stmt->rowCount() > 0){
        echo json_encode(["success" => false, "message" => "Email already exists"]);
        return;
    }

    // Insert user
    $query = "INSERT INTO users (first_name, last_name, email, password) VALUES (:first_name, :last_name, :email, :password)";
    $stmt = $conn->prepare($query);
    
    $stmt->bindParam(':first_name', $data->first_name);
    $stmt->bindParam(':last_name', $data->last_name);
    $stmt->bindParam(':email', $data->email);
    $stmt->bindParam(':password', $password_hash);
    
    if($stmt->execute()){
         echo json_encode(["success" => true, "message" => "User registered successfully"]);
    } else {
         echo json_encode(["success" => false, "message" => "Unable to register user"]);
    }
}

function loginUser($conn, $data) {
    if (!$conn) { echo json_encode(["success" => false, "message" => "DB Connection Error"]); return; }

    $email = $data->email;
    $password = $data->password;
    
    $query = "SELECT id, first_name, last_name, password FROM users WHERE email = :email LIMIT 0,1";
    $stmt = $conn->prepare($query);
    $stmt->bindParam(':email', $email);
    $stmt->execute();
    
    if($stmt->rowCount() > 0){
        $row = $stmt->fetch(PDO::FETCH_ASSOC);
        if(password_verify($password, $row['password'])){
            // Don't return password
            unset($row['password']);
            echo json_encode([
                "success" => true,
                "message" => "Login successful",
                "user" => $row
            ]);
        } else {
            echo json_encode(["success" => false, "message" => "Invalid credentials"]);
        }
    } else {
        echo json_encode(["success" => false, "message" => "User not found"]);
    }
}
?>
