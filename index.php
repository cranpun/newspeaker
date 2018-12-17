<!DOCTYPE html>
<html lang="ja">

<head>
    <meta charset="utf-8">

    <link rel="stylesheet" href="./style.css">

    <title>newspeaker</title>
    <link rel="shortcut icon" href="https://tm.cranpun-tools.ml/wp-content/themes/themeorg/favicon.ico" />

    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">

    <script crossorigin src="https://unpkg.com/react@16/umd/react.development.js"></script>
    <script crossorigin src="https://unpkg.com/react-dom@16/umd/react-dom.development.js"></script>
    <script src="https://unpkg.com/@material-ui/core/umd/material-ui.production.min.js" crossorigin="anonymous"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/babel-core/5.8.34/browser.min.js"></script>

    <script
        src="https://code.jquery.com/jquery-3.3.1.min.js"
        integrity="sha256-FgpCb/KJQlLNfOu91ta32o/NMZxltwRo8QtmkMRdAu8="
        crossorigin="anonymous"></script>
    <script type="text/javascript" src="./newspeaker.js"></script>
    <script type="text/babel" src="./reacttest.js"></script>

    <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto:300,400,500">
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
            topics: "#topics",
            voices: "#voices",
        });
    });
</script>

    <div id="info" class="container">
        <button id="start" class="hdn btn btn-info">start</button>
        <select id="voices" class="hdn"></select>
        <span id="remind"></span>
    </div>
    <ol id="topics">
    </ol>

    <div id="reacttest"></div>
</body>

</html>
