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
            if(false) {
                // 個別にしゃべる
                for(let topic of data.topics) {
                    const utt = new SpeechSynthesisUtterance(topic.title);
                    utt.voice = voices[57]; // google
                    window.speechSynthesis.speak(utt);
                }
            } else {
                // 生成したしゃべる用のテキストをしゃべる
                const utt = new SpeechSynthesisUtterance(data.speaktext);
                utt.voice = voices[0]; // default
                utt.volume = 0.3;
                utt.rate = 0.4;
                window.speechSynthesis.speak(utt);
            }
        });
    }

    startService() {
        this.updateTopic();
        setInterval(() => this.updateTopic(), 60 * 60 * 1000);
        // setInterval(() => this.updateTopic(), 3 * 60 * 1000);
    }

    render() {
        const ols = this.state.history.map((hist, indexol) => {
            const lis = hist.news.topics.map((topic, index) => {
                // console.log(topic.title);
                // console.log(topic.arrival)
                return (
                    <li class="topic" key={"ol" + indexol + "li" + index}>
                        {topic.arrival && <span><span class="tag is-warning">new</span>&nbsp;</span>　}
                        <a target="_blank" href={topic.link}>
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
                        <div class="card-content">
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
                    <div class="column">
                        <div class="tag is-info">
                            {this.state.history.length}ニュース
                        </div>
                    </div>
                </div>
                <div id="news" class="columns is-multiline">
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
