#!/usr/bin/env node
const yargs = require("yargs/yargs");
const { hideBin } = require("yargs/helpers");
const { resolve } = require("node:path");
const { access, constants, readFile } = require("node:fs/promises");

const args = yargs(hideBin(process.argv))
    .usage("Использование: loganalyzer -l <путь до файла логирования>")
    .option('logpath', {
        alias: 'l',
        string: true,
        description: 'Путь до файла логирования',
        demandOption: true
    })
    .parse();

//Не удалось найти пример где значени аргумента при использовании option не должно быть пустым поэтому пришлось руками проверять.
//Если подскажите будет замечательно)
if (!args.logpath) {
    console.error('ERR: Путь к файлу не может быть пустым.')
    return;
}

let logpath = `${args.logpath.replace('.log', '')}.log`;
logpath = resolve(__dirname, 'logs', logpath);

(async () => {
    try {
        await access(logpath, constants.R_OK);
    } catch {
        console.error('ERR: Файл не найден или доступ запрещен');
        return;
    }
    const fileTextData = await readFile(logpath, 'UTF8');

    try {
        analyze(fileTextData.replace(/\r\n$/, '').split(/\r\n/).map(f => JSON.parse(f)));
    } catch {
        console.error('ERR: Ошибка обработки файла. Возможно файл поврежден')
    }
})()

const analyze = (logs) => {
    const { total, win, loose } = logs.reduce((acc, val) => {
        acc.total += 1;
        acc[val.isWin ? 'win' : 'loose'] += 1;
        return acc;
    }, {
        total: 0,
        win: 0,
        loose: 0
    });

    console.log(`Всего сыграно партий: ${total}`);
    const winPercentage = win / (total || 1) * 100;
    console.log(`Выигранных партий: ${win} (${winPercentage}%)`);
    console.log(`Проигранных партий: ${loose} (${(total ? 100 : 0) - winPercentage}%)`);
}