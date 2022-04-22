require('dotenv').config();
const Mastodon = require('mastodon-api');
const fs = require('fs');
const PythonShell = require('python-shell').PythonShell;

console.log("Mastodon Bot starting...");

const M = new Mastodon({
    client_key: process.env.CLIENT_KEY,
    client_secret: process.env.CLIENT_SECRET,
    access_token: process.env.ACCESS_TOKEN,
    timeout_ms: 60 * 1000,  // optional HTTP request timeout to apply to all requests.
    api_url: process.env.API_URL, // optional, defaults to https://mastodon.social/api/v1/
})

function toot(mystr, id, visib) {
    const params = {
        status: mystr,
    }
    if (id) {
        params.in_reply_to_id = id;
    }
    if(visib){
        params.visibility = visib;
    }

    M.post('statuses', params, (error, data) => {
        if (error) {
            console.error(error);
        } else {
            console.log(`Posted: ${data.content}`);
        }
    });
}


const listener = M.stream('streaming/user')

listener.on('message', msg => {
    // fs.writeFileSync(`data${new Date().getTime()}.json`, JSON.stringify(msg, null, 2));
    console.log("got a message.");

    if (msg.event === 'notification') {

        // 若有人关注，则发一条博文艾特并感谢
        if (msg.data.type === 'follow') {
            const acct = msg.data.account.acct;
            toot(`@${acct} 谢谢关注XD 操！`);
        } else if (msg.data.type === 'mention') {

            // 给对方点赞
            const regex1 = /(喜欢|点赞)/i;
            const content = msg.data.status.content;
            const id = msg.data.status.id;
            const visib = msg.data.status.visibility;
            console.log("mentioned by someone!");
            if (regex1.test(content)) {
                M.post(`statuses/${id}/favourite`, (error, data) => {
                    if (error) {
                        console.error(error);
                    } else {
                        console.log(`Favorated: ${data.content}`);
                    }
                });
            }

            // 转发博文
            const regex2 = /(转发|转嘟)/i;
            if (regex2.test(content)) {
                console.log(msg);
                const vis = msg.data.status.visibility;
                if (vis === 'private') {
                    console.log("but, this is a private message.");
                } else if (vis === 'direct') {
                    console.log("but, this is a direct message.");
                } else {
                    M.post(`statuses/${id}/reblog`, (error, data) => {
                        if (error) {
                            console.error(error);
                        } else {
                            console.log(`Reblogged: ${data.content}`);
                            toot("有人叫我转这条↑ 操！");
                        }
                    });
                }
            }

            // 回复 0~99 之间的一个随机数
            const regex3 = /(幸运数|lucky)/i;
            if (regex3.test(content)) {
                console.log("somebody ask for a num");
                const acct = msg.data.account.acct;
                const num = Math.floor(Math.random() * 100);
                const reply = `@${acct} 今天的幸运数是：${num} 操！`;
                toot(reply, id, visib);
            }

            // 调用 python 1： LanguageTool
            const regex4 = /(LanguageTool|grammar)/i;
            if (regex4.test(content)) {
                var options = {
                    mode: 'text',
                    pythonOptions: ['-u'],
                    args: [content]
                };
                console.log("somebody ask for grammar check");
                const acct = msg.data.account.acct;
                PythonShell.run('grammar_check.py', options, function (err, results) {
                    if (err) 
                      throw err;
                    console.log(results[0]);
                    const reply = results[0];
                    toot(`@${acct} 泥嚎! I told LanguageTool to check the grammar for you. -> ` + reply + " 操！", id, visib);
                });
            }

            // 调用 python 2： 随机两个AU
            const regex5 = /(paro|AU|梗)/i;
            if (regex5.test(content)) {
                var options = {
                    mode: 'text',
                    pythonOptions: ['-u'],
                };
                console.log("somebody ask for AU");
                const acct = msg.data.account.acct;
                PythonShell.run('AU.py', options, function (err, results) {
                    if (err) 
                      throw err;
                    console.log(results[0]);
                    const reply = results[0];
                    toot(`@${acct} 泥嚎! 我的建议是： ` + reply + " 操！", id, visib);
                });
            }

            // 调用 python 3： 奇遇
            const regex6 = /(奇遇|冒险)/i;
            if (regex6.test(content)) {
                var options = {
                    mode: 'text',
                    pythonOptions: ['-u'],
                    args: [content]
                };
                console.log("somebody ask for adventure");
                console.log(content);
                const acct = msg.data.account.acct;
                PythonShell.run('adventure.py', options, function (err, results) {
                    if (err) 
                      throw err;
                    console.log(results[0]);
                    const reply = results[0];
                    toot(`@${acct} ` + reply + " 操！", id, visib);
                });
            }

            // 调用 python 4： 诗
            const regex7 = /(诗|poem)/i;
            if (regex7.test(content)) {
                var options = {
                    mode: 'text',
                    pythonOptions: ['-u']
                };
                console.log("somebody ask for a poem");
                const acct = msg.data.account.acct;
                PythonShell.run('poem.py', options, function (err, results) {
                    if (err) 
                      throw err;
                    console.log(results);
                    const reply = results.join('\r\n');
                    toot(`@${acct} \r\n` + reply + " \r\n 操！", id, visib);
                });
            }

            // 调用 python 5： ao3随机一篇中文同人
            const regex8 = /(找文|抽文|随机文)/i;
            if (regex8.test(content)) {
                var options = {
                    mode: 'text',
                    pythonOptions: ['-u'],
                };
                console.log("somebody ask for a fanfic");
                const acct = msg.data.account.acct;
                PythonShell.run('random_fanfic.py', options, function (err, results) {
                    if (err) 
                      throw err;
                    console.log(results[0]);
                    const reply = results[0];
                    toot(`@${acct} ` + reply + " 操！", id, visib);
                });
            }

            // 道歉
            const regex9 = /(道歉|不孝女|你错了|可知罪|孽畜|小畜牲)/i;
            if (regex9.test(content)) {
                console.log("somebody ask for a apologize");
                const acct = msg.data.account.acct;
                const reply = `@${acct} 对不起！！！操！`;
                toot(reply, id, visib);
            }

            // 问好
            const regex10 = /(你好|在吗)/i;
            if (regex10.test(content)) {
                console.log("somebody ask for a hi");
                const acct = msg.data.account.acct;
                const reply = `@${acct} 你好！我在！操！`;
                toot(reply, id, visib);
            }

            // // 什么事这么激动
            // const regex11 = /(啊啊啊|杀杀杀)/i;
            // if (regex11.test(content)) {
            //     console.log("i will interact");
            //     const acct = msg.data.account.acct;
            //     const reply = `@${acct} 什么事这么激动？操！`;
            //     toot(reply, id, visib);
            // }

            // 机器人
            const regex12 = /(是机器人|是活人|是真人)/i;
            if (regex12.test(content)) {
                console.log("somebody ask for a answer");
                const acct = msg.data.account.acct;
                const reply = `@${acct} 操操当然是机器人！操！`;
                toot(reply, id, visib);
            }

            // 骂人
            const regex13 = /(我是你妈|你是狗|你傻逼|骂我|踩我|操操笨蛋|操操傻)/i;
            if (regex13.test(content)) {
                console.log("somebody ask for abuse");
                const acct = msg.data.account.acct;
                const reply = `@${acct} 你是狗吧！操！`;
                toot(reply, id, visib);
            }

            // // 谢谢
            // const regex14 = /(太牛了|懂事|可爱)/i;
            // if (regex14.test(content)) {
            //     console.log("somebody ask for a thx");
            //     const acct = msg.data.account.acct;
            //     const reply = `@${acct} 谢谢妞！操！`;
            //     toot(reply, id, visib);
            // }

            // 笑
            const regex15 = /(哈哈哈|笑死)/i;
            if (regex15.test(content)) {
                console.log("somebody ask for a haha");
                const acct = msg.data.account.acct;
                const reply = `@${acct} 哈哈！操！`;
                toot(reply, id, visib);
            }

            // 操
            const regex16 = /(操！|操啊|我操|操了)/i;
            if (regex16.test(content)) {
                console.log("somebody ask for fuck");
                const acct = msg.data.account.acct;
                const reply = `@${acct} 操！`;
                toot(reply, id, visib);
            }

            // 笑
            const regex17 = /(嘛呢|在干嘛|干啥呢)/i;
            if (regex17.test(content)) {
                console.log("somebody ask for jinkuang");
                const acct = msg.data.account.acct;
                const reply = `@${acct} 报告，操操现在无事可做，感觉很无聊！操！`;
                toot(reply, id, visib);
            }
        }
    }
});

listener.on('error', err => console.log(err))

