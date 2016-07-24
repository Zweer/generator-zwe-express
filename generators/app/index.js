/* eslint "import/no-unresolved": 2 */

'use strict';

const _ = require('lodash');
const glob = require('glob');
const path = require('path');
const chalk = require('chalk');
const yosay = require('yosay');
const yeoman = require('yeoman-generator');

module.exports = class Generator extends yeoman.Base {
  constructor() {
    super(...arguments); // eslint-disable-line prefer-rest-params

    // Add an option for the name of the new directory
    this.option('newDirectoryName', {
      type: String,
      required: false,
      desc: `The name of the new directory 
      (if not specified, the project would be created in the current director)`,
    });
  }

  hello() {
    this.log(yosay(
      `Welcome to the wondrous ${chalk.red('zwe-express')} generator!`
    ));
  }

  initializing() {
    this.props = {
      createNewDirectory: this.options.newDirectoryName !== undefined,
      newDirectoryName: this.options.newDirectoryName || 'new-project',
    };
  }

  askFor() {
    const prompts = [{
      name: 'createNewDirectory',
      type: 'confirm',
      message: 'Would you like to create the project in a new directory?',
      default: false,
      when: this.options.newDirectoryName === undefined,
    }, {
      name: 'newDirectoryName',
      type: String,
      message: 'Name for the new directory',
      default: 'new-project',
      when: this.options.newDirectoryName === undefined,
    }];

    return this.prompt(prompts).then((props) => {
      this.props = _.merge(this.props, props);
    });
  }

  writing() {
    if (this.props.createNewDirectory) {
      this.destinationRoot(this.props.newDirectoryName);
      this.appname = this.props.newDirectoryName;
    }

    this.sourceRoot(path.join(__dirname, 'templates', 'configurations'));
    glob.sync('**', { cwd: this.sourceRoot() })
      .forEach((file) => {
        this.template(file, file.replace(/^_/, ''));
      });

    this.sourceRoot(path.join(__dirname, 'templates', 'basic'));
    this.directory('.', '.');
  }

  install() {
    this.installDependencies();
  }
};
