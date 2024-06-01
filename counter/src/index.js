import express from "express";
import config from "./config.js";
import redis from "redis";

const app = express();

const redisClient = redis.createClient({ url: process.env.REDIS_URL });

(async () => {
    await redisClient.connect();
})();

app.post("/:bookId/incr", async ({ params: { bookId } }, res) => {
    try {
        const counter = await redisClient.incr(bookId);
        console.log(`Кол-вл просмотров книги c id '${bookId}' : ${counter} `);
        res.json({
            bookId,
            counter,
        });
    } catch (ex) {
        res.json({
            errorcode: 500,
            message: `Redis error ${ex}`,
        });
    }
});

app.get("/:bookId", async ({ params: { bookId } }, res) => {
    try {
        const counter = await redisClient.get(bookId);
        console.log(counter);
        res.json({
            bookId,
            counter: counter ? +counter : 0,
        });
    } catch (ex) {
        res.json({
            errorcode: 500,
            message: `Redis error ${ex}`,
        });
    }
});

app.listen(config.PORT, () => {
    console.log(`Counter started at port: ${config.PORT}`);
});
