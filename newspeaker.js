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
};

// 現在の残り時間
newspeaker.start = function() {
    const self = this;

    // 初回は即時
    self.speak();
    setInterval(function() { self.speak(); }, self.param.ms_interval);
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

        // 発声
        window.speechSynthesis.speak(
            new SpeechSynthesisUtterance(self.data.speaktext)
        );

        // リスト更新
        self.updateList();
    });
}
newspeaker.updateRemind = function() {
    const self = this;

    const vw_remind = document.querySelector(self.cssids.remind);
    self.ms_remind -= self.param.ms_freq;
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
        a.setAttribute("href", nowdata.url);
        a.textContent = nowdata.title;
        let li = document.createElement("li");
        li.appendChild(a);
        list.appendChild(li);
    }
}
newspeaker.init = function(cssids) {
    const self = this;

    self.cssids = cssids

    // 前回の再生が残っているかもしれないので必ずcancel
    window.speechSynthesis.cancel();
    const bt_start = document.querySelector(self.cssids.start);
    bt_start.addEventListener("click", function() { 
        self.start();
    });

    const sec_freq = 1000;
}
