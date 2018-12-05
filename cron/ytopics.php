<?php

require_once(__DIR__ . "/vendor/autoload.php");

$url = "https://news.yahoo.co.jp/pickup/rss.xml";

$opt = [
    "ssl" => [
        'verify_peer' => false,
        'verify_peer_name' => false,
    ],
];

//$cnt = $file_get_contents($url, false, $opt);

$feed = new SimplePie();

$feed->set_feed_url($url);
$feed->enable_cache(false);
$feed->init();

$items = $feed->get_items();

// 補正用のデータ
$space = "。　。　";
$adjs = [
    [
        "search" => " ",
        "replace" => $space,
    ],
    [
        "search" => "?",
        "replace" => "?" . $space,
    ],
];

$topics = [];
$speaktext = count($items) . "件のニュースです";
foreach($items as $pos => $item) {
    $title = $item->get_title();
    // 表示用のデータ
    $topics[] = [
        "title" => $item->get_title(),
        "link" => $item->get_link(),
    ];

    // しゃべる用のデータ
    // // 空白を広げる処置
    foreach($adjs as $adj) {
        $title = str_replace($adj["search"], $adj["replace"], $title);
    }

    // // 結合
    $speaktext .= "{$space}{$space}" . ($pos + 1) . "件目{$space}{$title}";
}

$speaktext .= "{$space}{$space}以上、" . count($items) . "件のニュースでした。";

$path = __DIR__ . "/../ytopics.json";
$json = json_encode([
    "topics" => $topics,
    "speaktext" => $speaktext,
]);
file_put_contents($path, $json);

