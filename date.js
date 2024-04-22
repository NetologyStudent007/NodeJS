#!/usr/bin/env node

const yargs = require("yargs/yargs");
const { hideBin } = require("yargs/helpers");

const getAddOrSubDateCommandOptionsByType = (type) => {
    return [
        type,
        `Modify current date by ${type}`,
        (yargs) => {
            return yargs
                .option('year', {
                    describe: `Mofify current date by ${type} year`,
                    alias: 'y',
                    number: true
                })
                .option('month', {
                    describe: `Mofify current date by ${type} month`,
                    number: true,
                    alias: 'm'
                })
                .option('date', {
                    describe: `Mofify current date by ${type} date`,
                    number: true,
                    alias: 'd'
                })
        },
        (argv) => {
            const { year, month, date } = argv;
            const currentTime = new Date().getTime();
            let resultDate = new Date(currentTime);
            const addSubModifier = type == 'add' ? 1 : -1;
            if (year) {
                resultDate = new Date(resultDate.setFullYear(resultDate.getFullYear() + year * addSubModifier));
            }
            if (month) {
                resultDate = new Date(resultDate.setMonth(resultDate.getMonth() + month * addSubModifier));
            }
            if (date) {
                resultDate = new Date(resultDate.setDate(resultDate.getDate() + date * addSubModifier));
            }
            console.log(`${currentTime == resultDate.getTime() ? 'Current' : 'Resulted'} date: ${resultDate.toISOString()}`);
        }
    ]
}

yargs(hideBin(process.argv))
    .usage("Usage: date-demo <command> [options]")
    .scriptName("")
    .command('current', 'Show current date', (yargs) => {
        return yargs
            .option('year', {
                describe: 'Show year',
                boolean: true,
                alias: 'y'
            })
            .option('month', {
                describe: 'Show month',
                boolean: true,
                alias: 'm'
            })
            .option('date', {
                describe: 'Show date',
                boolean: true,
                alias: 'd'
            })
    }, (argv) => {
        const { year, month, date } = argv;
        const currentDate = new Date();
        if (Object.keys(argv).length > 2) {
            if (year) {
                console.log(`Year: ${currentDate.getFullYear()}`)
            }
            if (month) {
                console.log(`Month: ${currentDate.toLocaleString('en-us', { month: 'long' })}`)
            }
            if (date) {
                console.log(`Day: ${currentDate.getDate()}`)
            }
        } else {
            console.log(`Current date: ${currentDate.toISOString()}`)
        }
    })
    .command(...getAddOrSubDateCommandOptionsByType('add'))
    .command(...getAddOrSubDateCommandOptionsByType('sub'))
    .demandCommand()
    .recommendCommands()
    .strict()
    .parse()