class Newslist extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            topics: [],
            updated_at: "",
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
            const now = new Date();
            this.setState({
                topics: data.topics,
                updated_at: now.toLocaleTimeString()
            });
    
            // // 現在の残り時間をリセット
            // self.ms_remind = self.param.ms_interval;
            // // 残り時間の表示を更新
            // self.updateRemind();
            // // 時間計測の開始
            // setInterval(function() {
            //     self.updateRemind();
            // }, self.param.ms_freq)
    
            const utt = new SpeechSynthesisUtterance(data.speaktext);

            // 現在の音声の種類を取得
            // const voices = document.querySelector(self.cssids.voices);
            // const voice = self.voices[voices.value];
    
            // 発声
            // utt.voice = voice;
            window.speechSynthesis.speak(utt);
        });
    }

    startService() {
        this.updateTopic();
        setInterval(() => this.updateTopic(), 60 * 60 * 1000);
    }

    render() {
        const lis = this.state.topics.map((n, index) => {
            return (
                <li key={index}>
                    <a href={n.link}>
                    {n.title}
                    </a>
                </li>
            );
        });
        return (
            <div id="reactcomp">
                <div>
                    <button onClick={this.startService}>start</button>
                </div>
                <h2>updated_at : {this.state.updated_at}</h2>
                <ul>
                    {lis}
                </ul>
            </div>
        );
    }
}

ReactDOM.render(
    <Newslist />,
    document.querySelector('#reacttest')
);
