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
            history.unshift({
                news: data,
                updated_at: now.toLocaleTimeString()
            });
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
        //setInterval(() => this.updateTopic(), 60 * 60 * 1000);
        setInterval(() => this.updateTopic(), 5 * 60 * 1000);
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
                <div key={"ol" + indexol}>
                    <h2>updated_at : {hist.updated_at}</h2>
                    <ol >
                        {lis}
                    </ol>
                </div>
            );
        });
        return (
            <div id="reactcomp">
                <div>
                    <button onClick={this.startService}>start</button>
                </div>
                {ols}
            </div>
        );
    }
}

ReactDOM.render(
    <Newslist />,
    document.querySelector('#newspeaker')
);
