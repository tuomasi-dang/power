const audio = document.getElementById('background-music');
const lyricsDiv = document.getElementById('lyrics');
const lrcContent = document.getElementById('lrc-content').textContent;
let lyricsData = [];

// 解析LRC歌词文件的函数
function parseLRC(lrc) {
    const lines = lrc.split('\n');
    const lyrics = [];
    const timeRegex = /^\[(\d{2}):(\d{2})\.(\d{2,3})\]/;

    for (const line of lines) {
        const match = timeRegex.exec(line);
        if (match) {
            const minutes = parseInt(match[1], 10);
            const seconds = parseInt(match[2], 10);
            const milliseconds = parseInt(match[3], 10);
            const time = minutes * 60 + seconds + milliseconds / 1000;
            const text = line.substring(line.indexOf(']') + 1).trim();
            if (text) {
                lyrics.push({ time, text });
            }
        }
    }
    return lyrics;
}

// 初始化歌词数据
lyricsData = parseLRC(lrcContent);

// 更新歌词显示
audio.addEventListener('timeupdate', function() {
    const currentTime = audio.currentTime;
    let currentLyric = "";

    // 增加0.2秒的延迟，让歌词提前一点点显示，体验更好
    const displayTime = currentTime + 0.2;

    if (lyricsData.length > 0) {
        // 找到当前应该显示的歌词
        for (let i = 0; i < lyricsData.length; i++) {
            if (lyricsData[i].time <= displayTime) {
                currentLyric = lyricsData[i].text;
            } else {
                break;
            }
        }
    }

    if (lyricsDiv.textContent !== currentLyric) {
        lyricsDiv.textContent = currentLyric;
    }
});

// 尝试自动播放
audio.play().catch(error => {
    console.log("自动播放被浏览器阻止，请手动点击播放按钮。");
});
