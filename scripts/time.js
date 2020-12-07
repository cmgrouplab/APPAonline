function MillisecondToTime(msd) {
    var time = parseFloat(msd) / 1000;
    if (null != time && "" != time) {
        if (time > 60 && time < 60 * 60) {
            var a = parseInt(time / 60.0) < 10 ? ('0' + parseInt(time / 60.0)) : parseInt(time / 60.0);
            var ms = parseInt((parseFloat(time / 60.0) - parseInt(time / 60.0)) * 60);
            var b = (ms < 10) ? ('0' + ms) : ms;
            time = '00:' + a + ':' + b;
        }
        else if (time >= 60 * 60 && time < 60 * 60 * 24) {
            var H = parseInt(time / 3600.0) < 10 ? ('0' + parseInt(time / 3600.0)) : parseInt(time / 3600.0);
            var ms = parseInt((parseFloat(time / 3600.0) - parseInt(time / 3600.0)) * 60);
            var M = (ms < 10) ? ('0' + ms) : ms;
            var ss = parseInt((parseFloat((parseFloat(time / 3600.0) - parseInt(time / 3600.0)) * 60) -
                parseInt((parseFloat(time / 3600.0) - parseInt(time / 3600.0)) * 60)) * 60);
            var S = (ss < 10) ? ('0' + ss) : ss;
            time = H + ':' + M + ':' + S;
        }
        else {
            var d = parseInt(time) < 10 ? ('0' + parseInt(time)) : parseInt(time);
            time = '00:00:' + d;
        }
    }
    return time;
}
