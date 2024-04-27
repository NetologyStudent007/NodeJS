#!/usr/bin/env node
const yargs = require("yargs/yargs");
const { hideBin } = require("yargs/helpers");
const readline = require('node:readline');
const { stdin: input, stdout: output } = require('node:process');
const { join } = require("node:path");
const { mkdir, appendFile, access } = require("node:fs/promises");


const args = yargs(hideBin(process.argv))
  .usage("Использование: game -l <имя файла логирования>")
  .option('logfile', {
    alias: 'l',
    string: true,
    description: 'Записать результат в файл',
    demandOption: true
  })
  .parse();

//Не удалось найти пример где значени аргумента при использовании option не должно быть пустым поэтому пришлось руками проверять.
//Если подскажите будет замечательно)
//Можно было бы сделать дефолтный logfile и писать туда. но в задании не было указано
if (!args.logfile) {
  console.log('Имя файла не может быть пустым.')
  return;
}

const logpath = join(__dirname, 'logs');
const filename = `${args.logfile.replace('.log', '')}.log`;

const headText = 'Орел';
const tailText = 'Решка';

const rl = readline.createInterface({ input, output });

const qustion = (secret, prompt) => {
  rl.question(prompt, async (answer) => {

    const userVariant = +answer;

    if (!answer || isNaN(userVariant) || userVariant > 2 || userVariant < 1) {
      qustion(secret, `Неверный формат. Поробуйте снова: `)
    } else {
      const isWin = userVariant == secret;
      console.log(`${secret == 1 ? headText : tailText}${isWin ? '! :)' : ':('}`);
      try {
        await appendFile(join(logpath, filename), `${JSON.stringify({ date: new Date(), isWin })}\r\n`);
      } catch {
        console.error('ERR: Ошибка записи результата в файл');
      }
      playAgain();
    }
  });
}

const playAgain = () => {
  rl.question('Играть еще? (Y/N): ', (answer) => {
    if (answer.toLowerCase() == 'y') {
      startGame();
      return;
    }

    rl.close()
  });
}

const startGame = () => {
  qustion((Math.random() > 0.5) ? 1 : 2, `${headText}(1)/${tailText}(2) ?: `);
}

(async () => {
  try {
    await access(logpath)
  } catch {
    try {
      await mkdir(logpath);
    } catch {
      console.error(`ERR: Ошибка создания директории: ${logpath}`);
      return;
    }
  }
  startGame();
})()

