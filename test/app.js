'use strict';

const fs = require('fs');
const path = require('path');
const assert = require('yeoman-assert');
const helpers = require('yeoman-test');

const appDirectory = path.join(__dirname, '../generators/app');
const newDirectoryName = 'temp';

const commonExpectedFiles = [
  '.editorconfig',
  '.eslintrc',
  '.gitignore',
  'package.json',
  'README.md',
  'app/index.js',
  'app/controllers/index.js',
  'app/jobs/index.js',
  'app/libraries/log.js',
  'app/middlewares/index.js',
  'app/models/index.js',
  'app/routes/index.js',
  'bin/www',
];

function testFactory(name, prompts, expectedFiles) {
  let tmpDir;

  describe(name, () => {
    before(() => helpers.run(appDirectory)
      .inTmpDir((dir) => {
        tmpDir = dir;

        return true;
      })
      .withPrompts(prompts)
      .toPromise());

    it('creates the files', () => {
      if (prompts.createNewDirectory) {
        const files = fs.readdirSync(tmpDir);

        assert.equal(files.length, 1);
        assert.equal(files[0], prompts.newDirectoryName);
      }

      assert.file(expectedFiles);
    });
  });
}

describe('Zwe Express generator', () => {
  testFactory('without creating a new directory', {}, commonExpectedFiles);

  testFactory('creating a new directory', {
    createNewDirectory: true,
    newDirectoryName,
  }, commonExpectedFiles);

  describe('creating a new directory from command line', () => {
    let tmpDir;

    before(() => helpers.run(appDirectory)
      .inTmpDir((dir) => {
        tmpDir = dir;

        return true;
      })
      .withOptions({
        newDirectoryName,
      })
      .toPromise());

    it('creates the files', () => {
      const files = fs.readdirSync(tmpDir);

      assert.equal(files.length, 1);
      assert.equal(files[0], newDirectoryName);

      assert.file(commonExpectedFiles);
    });
  });
});
