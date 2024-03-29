class Newslist extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            history: [],
            voices: [],
            topicUrls: [],
        };
        // This binding is necessary to make `this` work in the callback
        this.startService = this.startService.bind(this);
        this.updateTopic = this.updateTopic.bind(this);
    }

    updateTopic() {
        jQuery.ajax({
            url: "./ytopics.json",
        }).then((data) => {
            // topic_urlsを更新
            const topicUrls = this.state.topicUrls;
            for(let i = 0; i < data.topics.length; i++) {
                const topic = data.topics[i];
                if(topicUrls.indexOf(topic.link) < 0) {
                    // 新しいURLなのでpushしてnewタグを付与
                    topicUrls.push(topic.link);
                    data.topics[i].arrival = true;
                } else {
                    data.topics[i].arrival = false;
                }
            }
            this.setState({
                topicUrls: topicUrls
            });

            // データをpush。表示を更新
            const now = new Date();
            const history = this.state.history;
            const news = {
                news: data,
                updated_at: now.toLocaleTimeString()
            };
            history.unshift(news);
            this.setState({history: history});

            // // 発声
            const voices = window.speechSynthesis.getVoices();
            window.speechSynthesis.cancel(); // 一旦クリア
            this.doSpeak(`${data.topics.length}件のニュースです。`);

            if(true) {
                // 個別にしゃべる
                for(const [idx, topic] of Object.entries(data.topics)) {
                    this.doSpeak(`${parseInt(idx) + 1}件目、${topic.speak}。`);
                }
                this.doSpeak(`以上、${data.topics.length}件のニュースでした。`);
            } else {
                // 生成したしゃべる用のテキストをしゃべる
                const utt = new SpeechSynthesisUtterance(data.speaktext);
                utt.voice = voices[0]; // default
                utt.volume = 1;
                utt.rate = 1;
                window.speechSynthesis.cancel();
                window.speechSynthesis.speak(utt);
            }
        }.bind(this));
    }

    doSpeak(text) {
        const utt = new SpeechSynthesisUtterance(text);
        const voices = window.speechSynthesis.getVoices();
        utt.voice = voices[0]; // default
        utt.volume = 0.75;
        utt.rate = 1;
        window.speechSynthesis.speak(utt);
    }

    startService() {
        this.updateTopic();
        setInterval(() => this.updateTopic(), 60 * 60 * 1000);
        // for test
        // // setInterval(() => this.updateTopic(), 10 * 1000);
    }

    render() {
        const ols = this.state.history.map((hist, indexol) => {
            const lis = hist.news.topics.map((topic, index) => {
                // console.log(topic.title);
                // console.log(topic.arrival)
                return (
                    <li class="topic" key={"ol" + indexol + "li" + index}>
                        <a target="_blank" href={topic.link} class={topic.arrival && "has-text-danger has-text-weight-semibold"}>
                        {topic.title}
                        </a>
                    </li>
                );
            });

            return (
                <div key={"ol" + indexol} class="column is-one-third">
                    <div class="card">
                        <div class="card-header">
                            <div class="card-header-title">
                                updated_at : {hist.updated_at}
                            </div>
                        </div>
                        <div class="card-content card-hour">
                            <div class="content">
                                <ol class="topics">
                                    {lis}
                                </ol>
                            </div>
                        </div>
                    </div>
                </div>
            );
        });
        return (
            <div id="reactcomp" class="container">
                <div class="columns">
                    <div class="column">
                        <button class="button is-primary is-outlined" onClick={this.startService}>start</button>
                    </div>
                    <div class="column has-text-right">
                        <div class="tag is-info">
                            {this.state.history.length}ニュース
                        </div>
                    </div>
                </div>
                <div id="news" class="columns is-multiline is-gapless">
                    {ols}
                </div>
            </div>
        );
    }
}

ReactDOM.render(
    <Newslist />,
    document.querySelector('#newspeaker')
);
