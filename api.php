<?php
declare(strict_types=1);

header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit;
}

$dataDir = __DIR__ . DIRECTORY_SEPARATOR . 'data';

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

$action = $_GET['action'] ?? 'settings';

if ($action === 'settings') {
    $settings = read_json_file($dataDir . DIRECTORY_SEPARATOR . 'settings.json', [
        'facebook' => 'https://facebook.com/',
        'instagram' => 'https://instagram.com/',
        'whatsapp' => '201000000000',
        'maps' => 'https://www.google.com/maps/search/?api=1&query=7+Okba+Ibn+Nafeh+St+Dokki+Giza+Egypt'
    ]);
    json_response(['ok' => true, 'settings' => $settings]);
}

if ($action === 'slides') {
    $slides = read_json_file($dataDir . DIRECTORY_SEPARATOR . 'slides.json', []);
    if (!is_array($slides) || empty($slides)) {
        $slides = [
            [
                'id' => 'slide-01',
                'type' => 'image',
                'src' => 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=1200&q=75',
                'badge' => '01',
                'title_ar' => 'ابدأ مستقبلك التعليمي',
                'title_en' => 'Start your educational future',
                'text_ar' => 'نساعد الطلاب في الوصول إلى الخيارات التعليمية المناسبة وترتيب خطواتهم بثقة.',
                'text_en' => 'We help students find suitable education options and organize the required steps with confidence.'
            ],
            [
                'id' => 'slide-02',
                'type' => 'image',
                'src' => 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=1200&q=75',
                'badge' => '02',
                'title_ar' => 'رحلتك تبدأ من هنا',
                'title_en' => 'Your journey starts here',
                'text_ar' => 'خدمات ومساندة لتنظيم السفر والتنقل، مع اهتمام بالتفاصيل من البداية.',
                'text_en' => 'Support for travel and mobility planning, with attention to details from day one.'
            ],
            [
                'id' => 'slide-03',
                'type' => 'image',
                'src' => 'https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=1200&q=75',
                'badge' => '03',
                'title_ar' => 'حلول للأعمال والخدمات الدولية',
                'title_en' => 'Business & international solutions',
                'text_ar' => 'دعم عملي للأفراد والشركات في الخدمات التي تحتاج تنسيقاً ومتابعة دقيقة.',
                'text_en' => 'Practical support for individuals and businesses that need coordinated international services.'
            ]
        ];
    }
    json_response(['ok' => true, 'slides' => $slides]);
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    json_response(['ok' => false, 'error' => 'Method not allowed'], 405);
}

if ($action === 'track') {
    $input = input_json();
    $type = clean_text($input['type'] ?? 'interaction', 60);
    $metricsPath = $dataDir . DIRECTORY_SEPARATOR . 'metrics.json';
    $metrics = read_json_file($metricsPath, [
        'visits' => 0,
        'interactions' => 0,
        'whatsappClicks' => 0,
        'formSubmits' => 0,
        'lastVisit' => '',
        'events' => []
    ]);

    if ($type === 'visit') {
        $metrics['visits'] = (int) ($metrics['visits'] ?? 0) + 1;
        $metrics['lastVisit'] = date('c');
    } elseif ($type === 'whatsapp') {
        $metrics['whatsappClicks'] = (int) ($metrics['whatsappClicks'] ?? 0) + 1;
        $metrics['interactions'] = (int) ($metrics['interactions'] ?? 0) + 1;
    } elseif ($type === 'form_submit') {
        $metrics['formSubmits'] = (int) ($metrics['formSubmits'] ?? 0) + 1;
        $metrics['interactions'] = (int) ($metrics['interactions'] ?? 0) + 1;
    } else {
        $metrics['interactions'] = (int) ($metrics['interactions'] ?? 0) + 1;
    }

    $events = is_array($metrics['events'] ?? null) ? $metrics['events'] : [];
    $events[] = [
        'type' => $type,
        'page' => clean_text($input['page'] ?? ($_SERVER['HTTP_REFERER'] ?? ''), 250),
        'createdAt' => date('c')
    ];
    $metrics['events'] = array_slice($events, -200);

    write_json_file($metricsPath, $metrics);
    json_response(['ok' => true]);
}

if ($action === 'order') {
    $input = input_json();
    $order = [
        'id' => date('YmdHis') . '-' . bin2hex(random_bytes(3)),
        'name' => clean_text($input['name'] ?? '', 120),
        'phone' => clean_text($input['phone'] ?? '', 80),
        'message' => clean_text($input['message'] ?? '', 1000),
        'status' => 'new',
        'createdAt' => date('c')
    ];

    if ($order['name'] === '' || $order['phone'] === '') {
        json_response(['ok' => false, 'error' => 'Name and phone are required'], 422);
    }

    $ordersPath = $dataDir . DIRECTORY_SEPARATOR . 'orders.json';
    $orders = read_json_file($ordersPath, []);
    if (!is_array($orders)) {
        $orders = [];
    }
    array_unshift($orders, $order);
    write_json_file($ordersPath, $orders);

    $metricsPath = $dataDir . DIRECTORY_SEPARATOR . 'metrics.json';
    $metrics = read_json_file($metricsPath, []);
    $metrics['formSubmits'] = (int) ($metrics['formSubmits'] ?? 0) + 1;
    $metrics['interactions'] = (int) ($metrics['interactions'] ?? 0) + 1;
    write_json_file($metricsPath, $metrics);

    json_response(['ok' => true, 'order' => $order]);
}

json_response(['ok' => false, 'error' => 'Unknown action'], 404);
