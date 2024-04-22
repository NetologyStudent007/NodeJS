#!/usr/bin/env node

const readline = require('node:readline');
const { stdin: input, stdout: output } = require('node:process');

const rl = readline.createInterface({ input, output });

const qustion = (secret, prompt) => {
  rl.question(prompt, (answer) => {

    const userVariant = +answer;

    if (isNaN(userVariant)) {
      qustion(secret, `Wrong format. Try again: `)
    } else if (userVariant === secret) {
      console.log('Bingo!')
      playAgain();
    } else {
      qustion(secret, userVariant < secret ? 'Try grater: ' : 'Try less: ');
    }
  });
}

const playAgain = () => {
  rl.question('Want play again? (Y/N): ', (answer) => {
    if (answer.toLowerCase() == 'y') {
      startGame();
      return;
    }

    rl.close()
  });
}

const startGame = () => {
  qustion(Math.floor(Math.random() * 100) + 1, 'Try to guess the number from 0 to 100?: ')
}

startGame();




