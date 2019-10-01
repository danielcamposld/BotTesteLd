var Twit = require("twit");
var config = require("./config");
const request = require("request");

var client = new Twit(config);
const URL = config.site_url;

// Heroku
const express = require("express");
const PORT = 5000;
var http = require("http");
var app = express();

app.use(express.static("client"));

app.listen(PORT, function() {
    console.log("Running.");
});
// Heroku

var stream = client.stream("statuses/filter", {
    track: ["maicon küster", "maicon kuster"]
});

stream.on("tweet", tweet => {
    request.get(URL + "getalldata", (err, resp, body) => {
        const arrayBlocks = JSON.parse(body).data;
        const arroba = tweet.user.screen_name;
        const exists = arrayBlocks.some(block => block == arroba);
        if (tweet.text.toLowerCase().includes("rt @")) {
            return;
        }
        if (exists) {
            console.log(`${arroba} bloqueado. (blacklist)`)
            return
        }
        printTweet(tweet);
        let id = tweet.id_str;
        retweet(id);
        return;
    });
});

function retweet(tweet_id) {
    client.post("statuses/retweet/:id", { id: tweet_id });
}

function getDate() {
    let nDate = new Date().toLocaleString("pt-BR", {
        timeZone: "America/Sao_Paulo"
    });
    return nDate;
}

function printTweet(tweet) {
    // printa na tela o tweet bonitinho
    let tweet_text = tweet.text;
    let lang = tweet.lang;
    let date = getDate();
    let quem_tweetou = tweet.user.screen_name;
    console.log(
        `TWEET FEITO\n${tweet_text}\nquem tweetou: ${quem_tweetou}\nhora: ${date}\nlang: ${lang}\n\n`
    );
}
