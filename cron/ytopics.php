<?php

require_once(__DIR__ . "/vendor/autoload.php");

$url = "https://news.yahoo.co.jp/rss";

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
$space = "、";
$adjs = [
    [
        "search" => " ",
        "replace" => $space,
    ],
    [
        "search" => "\s",
        "replace" => $space,
    ],
    [
        "search" => "\?",
        "replace" => "?" . $space,
    ],
];
$viewrep = [
    [
        "search" => "\&amp;",
        "replace" =>  "＆",
    ],
];

$topics = [];
$speaktext = count($items) . "件のニュースです";
foreach($items as $pos => $item) {

    // 見栄えの調整
    $title = $item->get_title();
    foreach($viewrep as $r) {
        $title = mb_ereg_replace($r["search"], $r["replace"], $title);
    }

    // しゃべる用のデータ
    // // 空白を広げる処置
    $speak = $item->get_title();
    foreach($adjs as $adj) {
        $speak = mb_ereg_replace($adj["search"], $adj["replace"], $speak);
    }

    // 表示用のデータ
    $topics[] = [
        "title" => $title,
        "speak" => $speak,
        "link" => $item->get_link(),
    ];

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

