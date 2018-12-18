const newspeaker = {
    param: {
        ms_interval: 60 * 60 * 1000, // 次に喋り始める間隔
        ms_freq: 60 * 1000, // 時間を更新する間隔
    },
    ms_remind: 0,
    data: {
        speaktext: "ニュースはありません",
        topics: [],
    },
    cssids: {},
    voices: [],
};

// 現在の残り時間
newspeaker.start = function() {
    const self = this;

    // 初回は即時
    self.speak();
    setInterval(function() { self.speak(); }, self.param.ms_interval);

    // ボタンはいらないので非表示に
    const bt_start = document.querySelector(self.cssids.start);
    bt_start.classList.add("hdn");
}
newspeaker.speak = function() {
    const self = this;

    jQuery.ajax({
        url: "./ytopics.json",
    }).then(function(data) {
        self.data = data;

        // 現在の残り時間をリセット
        self.ms_remind = self.param.ms_interval;
        // 残り時間の表示を更新
        self.updateRemind();
        // 時間計測の開始
        setInterval(function() {
            self.updateRemind();
        }, self.param.ms_freq)

        // 現在の音声の種類を取得
        const voices = document.querySelector(self.cssids.voices);
        const voice = self.voices[voices.value];

        // 発声
        const utt = new SpeechSynthesisUtterance(self.data.speaktext);
        utt.voice = voice;
        window.speechSynthesis.speak(utt);

        // リスト更新
        self.updateList();
    });
}
newspeaker.updateRemind = function() {
    const self = this;

    const vw_remind = document.querySelector(self.cssids.remind);
    self.ms_remind -= self.param.ms_freq;
    if(self.ms_remind <= 0) {
        // 雑な同期なので少しのズレが生じる可能性あり。それに合わせて補正。
        self.ms_remind = 0;
    }
    vw_remind.innerText = "（次回 " + (self.ms_remind / 1000 / 60).toString() + "分 / " + (self.param.ms_interval / 1000/ 60).toString() + "分）"; 
}
newspeaker.updateList = function() {
    const list = document.querySelector(this.cssids.topics);

    // 要素を削除
    while (list.firstChild) { 
        list.removeChild(list.firstChild);
    }

    for(let i = 0; i < this.data.topics.length; i++) {
        let nowdata = this.data.topics[i];
        let a = document.createElement("a");
        a.setAttribute("href", nowdata.link);
        a.textContent = nowdata.title;
        let li = document.createElement("li");
        li.appendChild(a);
        list.appendChild(li);
    }
}
newspeaker.initVoiceList = function() {
    const self = this;
    self.voices = window.speechSynthesis.getVoices();
    const sel = document.querySelector(self.cssids.voices);

    // 要素を削除
    while (sel.firstChild) { 
        sel.removeChild(list.firstChild);
    }

    // option追加
    for(let i = 0; i < self.voices.length; i++) {
        let nowdata = self.voices[i];
        let opt = document.createElement("option");
        opt.setAttribute("value", i);
        opt.textContent = nowdata.name + "(" + nowdata.lang + ")";
        sel.appendChild(opt);
    }

    // googleの音声
    // sel.value = 57;

    sel.classList.remove("hdn");
}
newspeaker.init = function(cssids) {
    const self = this;

    self.cssids = cssids

    // 前回の再生が残っているかもしれないので必ずcancel
    window.speechSynthesis.cancel();


        // 少し時間を置かないとvoicesが取れないみたいなのでちょっと待つ
    setTimeout(function() {
        self.initVoiceList();

        // その後、開始ボタンの設定
        const bt_start = document.querySelector(self.cssids.start);
        bt_start.addEventListener("click", function() { 
            self.start();
        });
        bt_start.classList.remove("hdn");
    }, 1000);
}
