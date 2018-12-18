class Newslist extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            history: [],
            voices: [],
        };
        // This binding is necessary to make `this` work in the callback
        this.startService = this.startService.bind(this);
        this.updateTopic = this.updateTopic.bind(this);
    }

    updateTopic() {
        jQuery.ajax({
            url: "./ytopics.json",
        }).then((data) => {
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
                window.speechSynthesis.speak(utt);
            }
        });
    }

    startService() {
        this.updateTopic();
        setInterval(() => this.updateTopic(), 60 * 60 * 1000);
    }

    render() {
        const ols = this.state.history.map((hist, indexol) => {
            const lis = hist.news.topics.map((topic, index) => {
                return (
                    <li key={"ol" + indexol + "li" + index}>
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
                                <ol >
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
                <div class="columns is-multiline">
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
