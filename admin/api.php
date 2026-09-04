<?php
declare(strict_types=1);

session_start();
header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit;
}

if (!function_exists('str_starts_with')) {
    function str_starts_with(string $haystack, string $needle): bool {
        return strncmp($haystack, $needle, strlen($needle)) === 0;
    }
}

$rootDir = dirname(__DIR__);
$dataDir = $rootDir . DIRECTORY_SEPARATOR . 'data';
$uploadsDir = $rootDir . DIRECTORY_SEPARATOR . 'uploads';

function json_response(array $payload, int $status = 200): void {
    http_response_code($status);
    echo json_encode($payload, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    exit;
}

function read_json_file(string $path, mixed $fallback): mixed {
    if (!is_file($path)) {
        return $fallback;
    }
    $raw = file_get_contents($path);
    $decoded = json_decode($raw ?: '', true);
    return json_last_error() === JSON_ERROR_NONE ? $decoded : $fallback;
}

function write_json_file(string $path, mixed $data): bool {
    $json = json_encode($data, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    return file_put_contents($path, $json, LOCK_EX) !== false;
}

function input_json(): array {
    $raw = file_get_contents('php://input');
    $decoded = json_decode($raw ?: '{}', true);
    return is_array($decoded) ? $decoded : [];
}

function clean_text(mixed $value, int $max = 500): string {
    $text = trim(strip_tags((string) $value));
    if (function_exists('mb_substr')) {
        return mb_substr($text, 0, $max, 'UTF-8');
    }
    return substr($text, 0, $max);
}

function require_login(): void {
    if (empty($_SESSION['big_admin_logged_in'])) {
        json_response(['ok' => false, 'error' => 'غير مصرح للوصول'], 401);
    }
}

function password_hash_value(string $salt, string $password): string {
    return hash('sha256', $salt . $password);
}

$action = $_GET['action'] ?? 'state';
$adminPath = $dataDir . DIRECTORY_SEPARATOR . 'admin.json';
$slidesPath = $dataDir . DIRECTORY_SEPARATOR . 'slides.json';

if ($action === 'login') {
    $input = input_json();
    $password = (string) ($input['password'] ?? '');
    
    $defaultSalt = 'big-admin-v1';
    $defaultHash = 'fc504ffee9de2aac38f03685a217e80781fef123223e80ac97fb745b3dce3541';

    $admin = read_json_file($adminPath, [
        'salt' => $defaultSalt,
        'passwordHash' => $defaultHash
    ]);

    $salt = (string) ($admin['salt'] ?? $defaultSalt);
    $storedHash = (string) ($admin['passwordHash'] ?? $defaultHash);

    if ($storedHash !== '' && hash_equals($storedHash, password_hash_value($salt, $password))) {
        session_regenerate_id(true);
        $_SESSION['big_admin_logged_in'] = true;
        json_response(['ok' => true]);
    }

    json_response(['ok' => false, 'error' => 'كلمة السر غير صحيحة'], 403);
}

if ($action === 'logout') {
    $_SESSION = [];
    if (ini_get("session.use_cookies")) {
        $params = session_get_cookie_params();
        setcookie(session_name(), '', time() - 42000,
            $params["path"], $params["domain"],
            $params["secure"], $params["httponly"]
        );
    }
    session_destroy();
    json_response(['ok' => true]);
}

require_login();

if ($action === 'state') {
    $adminData = read_json_file($adminPath, []);
    json_response([
        'ok' => true,
        'currentPassword' => $adminData['currentPassword'] ?? '241000',
        'settings' => read_json_file($dataDir . DIRECTORY_SEPARATOR . 'settings.json', []),
        'metrics' => read_json_file($dataDir . DIRECTORY_SEPARATOR . 'metrics.json', [
            'visits' => 0, 'interactions' => 0, 'whatsappClicks' => 0, 'formSubmits' => 0, 'lastVisit' => '', 'events' => []
        ]),
        'orders' => read_json_file($dataDir . DIRECTORY_SEPARATOR . 'orders.json', []),
        'slides' => read_json_file($slidesPath, []),
        'services' => read_json_file($dataDir . DIRECTORY_SEPARATOR . 'services.json', []),
        'destinations' => read_json_file($dataDir . DIRECTORY_SEPARATOR . 'destinations.json', []),
        'subsidiaries' => read_json_file($dataDir . DIRECTORY_SEPARATOR . 'subsidiaries.json', [])
    ]);
}

if ($action === 'reset-metrics') {
    $emptyMetrics = [
        'visits' => 0,
        'interactions' => 0,
        'whatsappClicks' => 0,
        'formSubmits' => 0,
        'lastVisit' => date('c'),
        'events' => []
    ];
    write_json_file($dataDir . DIRECTORY_SEPARATOR . 'metrics.json', $emptyMetrics);
    json_response(['ok' => true, 'metrics' => $emptyMetrics]);
}

if ($action === 'settings') {
    $input = input_json();
    $settings = [
        'facebook' => clean_text($input['facebook'] ?? '', 300),
        'instagram' => clean_text($input['instagram'] ?? '', 300),
        'whatsapp' => preg_replace('/\D+/', '', (string) ($input['whatsapp'] ?? '')),
        'maps' => clean_text($input['maps'] ?? '', 400),
        'phone_egypt' => clean_text($input['phone_egypt'] ?? '+201505502339', 50),
        'phone_iraq' => clean_text($input['phone_iraq'] ?? '+9647742881766', 50),
        'phone_turkey' => clean_text($input['phone_turkey'] ?? '+905011263577', 50)
    ];

    write_json_file($dataDir . DIRECTORY_SEPARATOR . 'settings.json', $settings);
    json_response(['ok' => true, 'settings' => $settings]);
}

// --- Manage Destinations ---
if ($action === 'add-destination') {
    $input = input_json();
    $destinationsPath = $dataDir . DIRECTORY_SEPARATOR . 'destinations.json';
    $destinations = read_json_file($destinationsPath, []);
    $name_ar = clean_text($input['name_ar'] ?? '', 150);
    $name_en = clean_text($input['name_en'] ?? $name_ar, 150);
    $badge_ar = clean_text($input['badge_ar'] ?? 'خدمات منسقة', 100);
    $flag = clean_text($input['flag'] ?? 'https://flagcdn.com/w40/un.png', 500);
    $desc_ar = clean_text($input['desc_ar'] ?? '', 500);
    $tags_raw = clean_text($input['tags'] ?? '', 300);

    if ($name_ar === '') {
        json_response(['ok' => false, 'error' => 'اسم الدولة بالعربية مطلوب'], 422);
    }

    $tagsArr = array_filter(array_map('trim', preg_split('/[,،\n]+/', $tags_raw)));
    $tags = array_map(fn($t) => ['val_ar' => $t, 'val_en' => $t], $tagsArr);

    $newDest = [
        'id' => 'dest-' . time(),
        'name_ar' => $name_ar,
        'name_en' => $name_en,
        'code' => $name_en . ' • Services',
        'badge_ar' => $badge_ar,
        'badge_en' => $badge_ar,
        'flag' => $flag,
        'desc_ar' => $desc_ar,
        'desc_en' => $desc_ar,
        'tags' => !empty($tags) ? $tags : [['val_ar' => 'خدمات منسقة', 'val_en' => 'Coordinated Services']]
    ];

    array_unshift($destinations, $newDest);
    write_json_file($destinationsPath, $destinations);
    json_response(['ok' => true, 'destination' => $newDest, 'destinations' => $destinations]);
}

if ($action === 'edit-destination') {
    $input = input_json();
    $destinationsPath = $dataDir . DIRECTORY_SEPARATOR . 'destinations.json';
    $destinations = read_json_file($destinationsPath, []);
    $id = clean_text($input['id'] ?? '', 80);

    foreach ($destinations as &$dest) {
        if (($dest['id'] ?? '') === $id) {
            if (!empty($input['name_ar'])) $dest['name_ar'] = clean_text($input['name_ar'], 150);
            if (!empty($input['name_en'])) $dest['name_en'] = clean_text($input['name_en'], 150);
            if (!empty($input['badge_ar'])) $dest['badge_ar'] = clean_text($input['badge_ar'], 100);
            if (!empty($input['flag'])) $dest['flag'] = clean_text($input['flag'], 500);
            if (!empty($input['desc_ar'])) $dest['desc_ar'] = clean_text($input['desc_ar'], 500);
            if (!empty($input['tags'])) {
                $tagsArr = array_filter(array_map('trim', preg_split('/[,،\n]+/', (string)$input['tags'])));
                $dest['tags'] = array_map(fn($t) => ['val_ar' => $t, 'val_en' => $t], $tagsArr);
            }
            write_json_file($destinationsPath, $destinations);
            json_response(['ok' => true, 'destination' => $dest, 'destinations' => $destinations]);
        }
    }
    json_response(['ok' => false, 'error' => 'الدولة غير موجودة'], 404);
}

if ($action === 'delete-destination') {
    $input = input_json();
    $destinationsPath = $dataDir . DIRECTORY_SEPARATOR . 'destinations.json';
    $destinations = read_json_file($destinationsPath, []);
    $id = clean_text($input['id'] ?? '', 80);
    $destinations = array_values(array_filter($destinations, fn($d) => ($d['id'] ?? '') !== $id));
    write_json_file($destinationsPath, $destinations);
    json_response(['ok' => true, 'destinations' => $destinations]);
}

// --- Manage Subsidiaries ---
if ($action === 'add-subsidiary') {
    $input = input_json();
    $subsPath = $dataDir . DIRECTORY_SEPARATOR . 'subsidiaries.json';
    $subsidiaries = read_json_file($subsPath, []);
    $title_ar = clean_text($input['title_ar'] ?? '', 150);
    $title_en = clean_text($input['title_en'] ?? $title_ar, 150);
    $tag_ar = clean_text($input['tag_ar'] ?? '', 150);
    $logo = clean_text($input['logo'] ?? '', 500);
    $desc_ar = clean_text($input['desc_ar'] ?? '', 500);
    $fb = clean_text($input['fb'] ?? '', 300);

    if ($title_ar === '') {
        json_response(['ok' => false, 'error' => 'اسم المؤسسة بالعربية مطلوب'], 422);
    }

    $newSub = [
        'id' => 'sub-' . time(),
        'title_ar' => $title_ar,
        'title_en' => $title_en,
        'tag_ar' => $tag_ar ?: $title_ar,
        'tag_en' => $title_en,
        'logo' => $logo,
        'desc_ar' => $desc_ar,
        'desc_en' => $desc_ar,
        'fb' => $fb
    ];

    array_unshift($subsidiaries, $newSub);
    write_json_file($subsPath, $subsidiaries);
    json_response(['ok' => true, 'subsidiary' => $newSub, 'subsidiaries' => $subsidiaries]);
}

if ($action === 'edit-subsidiary') {
    $input = input_json();
    $subsPath = $dataDir . DIRECTORY_SEPARATOR . 'subsidiaries.json';
    $subsidiaries = read_json_file($subsPath, []);
    $id = clean_text($input['id'] ?? '', 80);

    foreach ($subsidiaries as &$sub) {
        if (($sub['id'] ?? '') === $id) {
            if (!empty($input['title_ar'])) $sub['title_ar'] = clean_text($input['title_ar'], 150);
            if (!empty($input['title_en'])) $sub['title_en'] = clean_text($input['title_en'], 150);
            if (isset($input['tag_ar'])) $sub['tag_ar'] = clean_text($input['tag_ar'], 150);
            if (isset($input['logo'])) $sub['logo'] = clean_text($input['logo'], 500);
            if (isset($input['desc_ar'])) $sub['desc_ar'] = clean_text($input['desc_ar'], 500);
            if (isset($input['fb'])) $sub['fb'] = clean_text($input['fb'], 300);
            write_json_file($subsPath, $subsidiaries);
            json_response(['ok' => true, 'subsidiary' => $sub, 'subsidiaries' => $subsidiaries]);
        }
    }
    json_response(['ok' => false, 'error' => 'المؤسسة غير موجودة'], 404);
}

if ($action === 'delete-subsidiary') {
    $input = input_json();
    $subsPath = $dataDir . DIRECTORY_SEPARATOR . 'subsidiaries.json';
    $subsidiaries = read_json_file($subsPath, []);
    $id = clean_text($input['id'] ?? '', 80);
    $subsidiaries = array_values(array_filter($subsidiaries, fn($s) => ($s['id'] ?? '') !== $id));
    write_json_file($subsPath, $subsidiaries);
    json_response(['ok' => true, 'subsidiaries' => $subsidiaries]);
}

// --- Manage Services ---
if ($action === 'add-service') {
    $input = input_json();
    $servicesPath = $dataDir . DIRECTORY_SEPARATOR . 'services.json';
    $services = read_json_file($servicesPath, []);
    $title_ar = clean_text($input['title_ar'] ?? '', 150);
    $title_en = clean_text($input['title_en'] ?? $title_ar, 150);
    $text_ar = clean_text($input['text_ar'] ?? '', 400);
    $text_en = clean_text($input['text_en'] ?? $text_ar, 400);
    $icon = clean_text($input['icon'] ?? '✦', 20);

    if ($title_ar === '') {
        json_response(['ok' => false, 'error' => 'عنوان الخدمة بالعربية مطلوب'], 422);
    }

    $newService = [
        'id' => 'service-' . time(),
        'icon' => $icon,
        'title_ar' => $title_ar,
        'title_en' => $title_en,
        'text_ar' => $text_ar,
        'text_en' => $text_en
    ];

    $services[] = $newService;
    write_json_file($servicesPath, $services);
    json_response(['ok' => true, 'service' => $newService, 'services' => $services]);
}

if ($action === 'edit-service') {
    $input = input_json();
    $servicesPath = $dataDir . DIRECTORY_SEPARATOR . 'services.json';
    $services = read_json_file($servicesPath, []);
    $id = clean_text($input['id'] ?? '', 80);

    foreach ($services as &$srv) {
        if (($srv['id'] ?? '') === $id) {
            if (!empty($input['title_ar'])) $srv['title_ar'] = clean_text($input['title_ar'], 150);
            if (!empty($input['title_en'])) $srv['title_en'] = clean_text($input['title_en'], 150);
            if (isset($input['text_ar'])) $srv['text_ar'] = clean_text($input['text_ar'], 400);
            if (isset($input['icon'])) $srv['icon'] = clean_text($input['icon'], 20);
            write_json_file($servicesPath, $services);
            json_response(['ok' => true, 'service' => $srv, 'services' => $services]);
        }
    }
    json_response(['ok' => false, 'error' => 'الخدمة غير موجودة'], 404);
}

if ($action === 'delete-service') {
    $input = input_json();
    $servicesPath = $dataDir . DIRECTORY_SEPARATOR . 'services.json';
    $services = read_json_file($servicesPath, []);
    $id = clean_text($input['id'] ?? '', 80);
    $services = array_values(array_filter($services, fn($s) => ($s['id'] ?? '') !== $id));
    write_json_file($servicesPath, $services);
    json_response(['ok' => true, 'services' => $services]);
}

if ($action === 'add-slide') {
    $title_ar = clean_text($_POST['title_ar'] ?? '', 150);
    $title_en = clean_text($_POST['title_en'] ?? '', 150);
    $text_ar = clean_text($_POST['text_ar'] ?? '', 400);
    $text_en = clean_text($_POST['text_en'] ?? '', 400);
    $type = clean_text($_POST['type'] ?? 'image', 20);
    $media_url = clean_text($_POST['media_url'] ?? '', 500);

    if ($title_ar === '') {
        json_response(['ok' => false, 'error' => 'عنوان الموضوع بالعربية مطلوب'], 422);
    }

    $src = $media_url;

    // Handle File Upload if provided
    if (isset($_FILES['media_file']) && $_FILES['media_file']['error'] === UPLOAD_ERR_OK) {
        $file = $_FILES['media_file'];
        $maxSize = 25 * 1024 * 1024; // 25 MB max size
        if ($file['size'] > $maxSize) {
            json_response(['ok' => false, 'error' => 'حجم الملف كبير جداً (الأقصى 25 ميجابايت)'], 422);
        }

        $allowedMimes = [
            'image/jpeg' => 'jpg',
            'image/png' => 'png',
            'image/webp' => 'webp',
            'video/mp4' => 'mp4',
            'video/webm' => 'webm'
        ];

        $mime = '';
        if (function_exists('finfo_open')) {
            $finfo = finfo_open(FILEINFO_MIME_TYPE);
            $mime = finfo_file($finfo, $file['tmp_name']);
            finfo_close($finfo);
        } elseif (function_exists('mime_content_type')) {
            $mime = mime_content_type($file['tmp_name']);
        } else {
            $mime = (string) ($file['type'] ?? '');
        }

        if (!isset($allowedMimes[$mime])) {
            json_response(['ok' => false, 'error' => 'نوع الملف غير مدعوم. المسموح: JPG, PNG, WEBP, MP4, WEBM'], 422);
        }

        if (!is_dir($uploadsDir)) {
            mkdir($uploadsDir, 0755, true);
        }

        $ext = $allowedMimes[$mime];
        $fileName = 'slide_' . time() . '_' . bin2hex(random_bytes(4)) . '.' . $ext;
        $targetFile = $uploadsDir . DIRECTORY_SEPARATOR . $fileName;

        if (!move_uploaded_file($file['tmp_name'], $targetFile)) {
            json_response(['ok' => false, 'error' => 'فشل حفظ الملف على السيرفر'], 500);
        }

        $src = 'uploads/' . $fileName;
        if (strpos($mime, 'video') !== false) {
            $type = 'video';
        }
    }

    if ($src === '') {
        json_response(['ok' => false, 'error' => 'يرجى رفع ملف صورة/فيديو أو وضع رابط'], 422);
    }

    $slides = read_json_file($slidesPath, []);
    if (!is_array($slides)) {
        $slides = [];
    }

    $count = count($slides) + 1;
    $newSlide = [
        'id' => 'slide-' . time() . '-' . bin2hex(random_bytes(2)),
        'type' => $type === 'video' ? 'video' : 'image',
        'src' => $src,
        'badge' => str_pad((string) $count, 2, '0', STR_PAD_LEFT),
        'title_ar' => $title_ar,
        'title_en' => $title_en !== '' ? $title_en : $title_ar,
        'text_ar' => $text_ar,
        'text_en' => $text_en !== '' ? $text_en : $text_ar,
        'createdAt' => date('c')
    ];

    array_unshift($slides, $newSlide);
    write_json_file($slidesPath, $slides);

    json_response(['ok' => true, 'slide' => $newSlide, 'slides' => $slides]);
}

if ($action === 'delete-slide') {
    $input = input_json();
    $id = clean_text($input['id'] ?? '', 80);

    $slides = read_json_file($slidesPath, []);
    $newSlides = [];
    $deletedFile = null;

    foreach ($slides as $slide) {
        if (($slide['id'] ?? '') === $id) {
            $src = $slide['src'] ?? '';
            if (str_starts_with($src, 'uploads/')) {
                $deletedFile = $rootDir . DIRECTORY_SEPARATOR . str_replace('/', DIRECTORY_SEPARATOR, $src);
            }
        } else {
            $newSlides[] = $slide;
        }
    }

    write_json_file($slidesPath, $newSlides);

    if ($deletedFile && is_file($deletedFile)) {
        @unlink($deletedFile);
    }

    json_response(['ok' => true, 'slides' => $newSlides]);
}

if ($action === 'password') {
    $input = input_json();
    $newPassword = (string) ($input['password'] ?? '');
    if (strlen($newPassword) < 4) {
        json_response(['ok' => false, 'error' => 'كلمة السر يجب أن تكون 4 أحرف على الأقل'], 422);
    }
    $salt = bin2hex(random_bytes(8));
    $adminData = [
        'currentPassword' => $newPassword,
        'salt' => $salt,
        'passwordHash' => password_hash_value($salt, $newPassword)
    ];
    write_json_file($adminPath, $adminData);
    json_response(['ok' => true, 'currentPassword' => $newPassword]);
}

if ($action === 'order-status') {
    $input = input_json();
    $id = clean_text($input['id'] ?? '', 80);
    $status = clean_text($input['status'] ?? 'new', 40);
    $allowed = ['new', 'reviewed', 'done'];
    if (!in_array($status, $allowed, true)) {
        json_response(['ok' => false, 'error' => 'حالة غير صالحة'], 422);
    }

    $ordersPath = $dataDir . DIRECTORY_SEPARATOR . 'orders.json';
    $orders = read_json_file($ordersPath, []);
    foreach ($orders as &$order) {
        if (($order['id'] ?? '') === $id) {
            $order['status'] = $status;
            $order['updatedAt'] = date('c');
            write_json_file($ordersPath, $orders);
            json_response(['ok' => true, 'order' => $order]);
        }
    }
    json_response(['ok' => false, 'error' => 'الطلب غير موجود'], 404);
}

json_response(['ok' => false, 'error' => 'Unknown action'], 404);
