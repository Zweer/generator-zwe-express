'use strict';

const _ = require('lodash');
const yeoman = require('yeoman-generator');
const chalk = require('chalk');
const yosay = require('yosay');

module.exports = class Generator extends yeoman.Base {
  constructor() {
    super(...arguments); // eslint-disable-line prefer-rest-params

    // Add an option the allow the creation of the project in a new directory
    this.option('createNewDirectory', {
      type: Boolean,
      required: false,
      desc: 'Create the project in a new directory',
    });

    // Add an option for the name of the new directory
    this.option('newDirectory', {
      type: String,
      required: false,
      desc: 'The name of the new directory',
    });
  }

  hello() {
    this.log(yosay(
      `Welcome to the wondrous ${chalk.red('generator-zwe-express')} generator!`
    ));
  }

  askFor() {
    const prompts = [{
      name: 'createNewDirectory',
      type: 'confirm',
      message: 'Would you like to create the project in a new directory?',
      default: false,
      when: this.options.createNewDirectory === undefined,
    }, {
      name: 'newDirectory',
      type: String,
      message: 'Name for the new directory',
      default: 'new-project',
      when: this.options.newDirectory === undefined && this.options.createNewDirectory,
    }];

    return this.prompt(prompts).then((props) => {
      this.props = _.merge(this.props, props);
    });
  }

  writing() {
    if (this.props.createNewDirectory) {
      this.destinationRoot(this.props.newDirectory);
      this.appname = this.props.newDirectory;
    }

    this.fs.copy(
      this.templatePath('dummyfile.txt'),
      this.destinationPath('dummyfile.txt')
    );
  }

  install() {
    this.installDependencies();
  }
};
