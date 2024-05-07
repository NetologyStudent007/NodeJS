#!/usr/bin/env node
const yargs = require("yargs/yargs");
const { hideBin } = require("yargs/helpers");
require('dotenv').config();
const config = require('./config');
const http = require('node:http');

const args = yargs(hideBin(process.argv))
  .usage("Usage: wf -c <city name>")
  .option('city', {
    alias: 'c',
    string: true,
    description: 'City name',
    demandOption: true
  })
  .parse();

if (!args.city) {
  console.log('City name can not be empty')
  return;
}

http.get(`http://api.weatherapi.com/v1/current.json?key=${config.APIKey}&q=${args.city}&aqi=no`, (res) => {

  res.setEncoding('utf8');
  let rawData = '';
  res.on('data', (chunk) => { rawData += chunk; });
  res.on('end', () => {
    try {
      const parsedData = JSON.parse(rawData);
      const { statusCode } = res;
      if (statusCode !== 200) {
        console.error(`Error: ${parsedData.error.message}`);
        return;
      }
      console.log(parsedData);
    } catch (e) {
      console.error(`Error: ${e.message}`);
    }
  });
}).on('error', (e) => {
  console.error(`Error: ${e.message}`);
});






