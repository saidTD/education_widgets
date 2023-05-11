#!/usr/bin/env node

const { execSync, exec } = require("child_process");
const { exit, argv, cwd } = require("process");
const path = require("path");
const fs = require('fs');
const semver = require('semver');
const commander = require("commander");

// Global variables
const rootFolder = path.resolve(__dirname, '..');
const widgetsFolder = `${rootFolder}/widgets`;

// Set up the commander
commander
  .version("1.0.0", "-v, --version")
  .description('A simple script for automating the process of pushing a widget')
  .usage("[OPTIONS]...")
  .option("-m, --message <value>", "message for git commit.")
  .requiredOption("-w, --widget <value>", "widget to be pushed")
  .action(({ widget }) => {
    // make sure that the widget deos exist
    fs.access(widgetsFolder, fs.constants.F_OK, (err) => {
      if (err) {
        console.log(`${widget} does not exist`);
        exit(1);
      }
    });
  })
  .parse(argv);

/***** Utilities *****/
const updateVersion = (filePath) => {
  // Read the contents of the file into a string
  const jsonString = fs.readFileSync(filePath, 'utf-8');

  // Parse the string into a JavaScript object
  const data = JSON.parse(jsonString);

  // Update the version number
  data.version = semver.inc(data.version, 'patch');

  // Convert the object back to a JSON-formatted string
  const updatedJsonString = JSON.stringify(data);

  // Write the string back to the file
  fs.writeFileSync(filePath, updatedJsonString);
}

const runCommand = (command) => {
  try {
    execSync(command);
  } catch (e) {
    console.error(e);
    exit(1);
  }
};

const getDate = () => {
  const currentDate = new Date();
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const day = currentDate.getDate();
  const hours = currentDate.getHours();
  const minutes = currentDate.getMinutes();
  const dateTimeString = `Date: ${day}/${
    month + 1
  }/${year} ${hours}:${minutes}`;

  return dateTimeString;
};

/***** Main *****/
(function main() {
  const options = commander.opts();
  const paramsPath = `${widgetsFolder}/${options.widget}/params.json`;
  const message = options.message;
  const programsToRun = [
    // {
    //   program: "gulp",
    //   args: "addToWidget",
    // },
    {
      program: "git",
      args: "add --all",
    },
    {
      program: "git",
      args: "commit -m " + "'" + message + "'",
    },
    {
      program: "git",
      args: "pull",
    },
    {
      program: "git",
      args: "push",
    },
  ];

  // Update the version of params.json
  updateVersion(paramsPath);

  // Run the specified commands and than push the widget to github
  programsToRun.forEach((currProgram) => {
    runCommand(currProgram.program + " " + currProgram.args);
  });
})();
