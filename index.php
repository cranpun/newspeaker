<!DOCTYPE html>
<html lang="ja">

<head>
    <meta charset="utf-8">

    <link rel="stylesheet" href="./style.css">
    <script type="text/javascript" src="./newspeaker.js"></script>

    <title>newspeaker</title>
    <link rel="shortcut icon" href="https://tm.cranpun-tools.ml/wp-content/themes/themeorg/favicon.ico" />

    <script
        src="https://code.jquery.com/jquery-3.3.1.min.js"
        integrity="sha256-FgpCb/KJQlLNfOu91ta32o/NMZxltwRo8QtmkMRdAu8="
        crossorigin="anonymous"></script>

    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
</head>

<body id="body">

<?php
$path = __DIR__ . "/ytopics.json";
$json = file_get_contents($path);
$data = json_decode($json);
?>
<script type="text/javascript">
    window.addEventListener("load", function() {
        newspeaker.init({
            start: "#start", 
            remind: "#remind", 
            topics: "#topics"
        });
    });
</script>

    <div id="info">
        <button id="start">start</button>
        <span id="remind"></span>
    </div>
    <ol id="topics">
    </ol>
</body>

</html>
