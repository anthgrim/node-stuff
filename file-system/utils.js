const fs = require('node:fs/promises');
const path = require('node:path');

/**
 * Some File System local utilities
 */
class FSLocalUtils {
  /**
   * Get read result options from given filehandle
   * @param {import("fs/promises").FileHandle} fileHandle
   */
  static async getReadOptions(fileHandle) {
    try {
      const stats = await fileHandle.stat();
      const buffer = Buffer.alloc(stats.size);

      return {
        buffer,
        offset: 0,
        length: buffer.byteLength,
        position: 0,
      };
    } catch (error) {
      throw error;
    }
  }
}

/**
 * Command Runner utilities
 */
class CommandRunner {
  static Commands = {
    create: 'create', // create <path> <data?>
    rename: 'rename', // rename <path> <new-name>
    update: 'update', // update <path> <data?>
    delete: 'delete', // delete <path>
  };

  static CommandsWithData = [
    CommandRunner.Commands.create,
    CommandRunner.Commands.update,
  ];

  /**
   * Identifies command and call it
   * @param {string} command
   */
  static async run(command) {
    const { targetCommand, directive } = this.#sanitizeInput(command);

    switch (targetCommand) {
      case CommandRunner.Commands.create:
        return this.#create(directive, targetCommand);

      case CommandRunner.Commands.update:
        return this.#update(directive, targetCommand);

      case CommandRunner.Commands.rename:
        return this.#rename(directive, targetCommand);

      case CommandRunner.Commands.delete:
        return this.#delete(directive, targetCommand);

      default:
        console.log('Invalid command:', targetCommand);
        break;
    }
  }

  /**
   * Creates or update a files with given data
   * @param {string} directive
   * @param {string} command
   */
  static async #create(directive, command) {
    try {
      const { fileLocation, data } = this.#getDirectiveInstructions(
        directive,
        command,
      );

      const fileExist = await this.#doesFileExist(fileLocation);

      if (fileExist) {
        return console.log(`The file at ${fileLocation} already exist.`);
      }

      const newFileHandle = await fs.open(fileLocation, 'w');

      if (data) {
        newFileHandle.write(data);
      }

      newFileHandle.close();
      return console.log(`File created successfully`);
    } catch (error) {
      const action = this.#getAction(command, true);

      return console.log(`Unable to ${action}. Error: ${error}`);
    }
  }

  /**
   * Update file with given data
   * @param {string} directive
   * @param {string} command
   */
  static async #update(directive, command) {
    try {
      const { fileLocation, data } = this.#getDirectiveInstructions(
        directive,
        command,
      );

      if (!data || !data.length) {
        console.log('Please add some data');
        return;
      }

      const fileHandleRead = await fs.open(fileLocation, 'r');

      fileHandleRead.write(data);
      console.log('File updated successfully');
    } catch (error) {
      console.log(`Unable to update file at:`, fileLocation);
    }
  }

  /**
   * Renames a file
   * @param {string} directive
   * @param {string} command
   */
  static async #rename(directive, command) {
    try {
      const { fileLocation, fileDestination } = this.#getDirectiveInstructions(
        directive,
        command,
      );

      await fs.rename(fileLocation, fileDestination);

      console.log(
        `\nFile changed from:\n${fileLocation}\nto:\n${fileDestination}\n`,
      );
    } catch (error) {
      console.log('Unable to rename file. Error:', error);
    }
  }

  /**
   * Deletes a file
   * @param {string} directive
   * @param {string} command
   */
  static async #delete(directive, command) {
    try {
      const { fileLocation } = this.#getDirectiveInstructions(
        directive,
        command,
      );

      await fs.unlink(fileLocation);

      console.log(`\nFile at ${fileLocation} was successfully deleted.\n`);
    } catch (error) {
      console.log('Unable to delete file. Error:', error);
    }
  }

  /**
   * Sanitized input command
   * @param {string} command
   */
  static #sanitizeInput(command) {
    const sanitizedCommand = command.trim().toLocaleLowerCase();
    const commandArray = sanitizedCommand.split(' ');
    const targetCommand = commandArray[0];
    const directive = commandArray.slice(1).join(' ').trim();

    if (commandArray.length === 1 || !commandArray.length || !commandArray) {
      throw new Error('Invalid command directive');
    }

    return {
      targetCommand,
      directive,
    };
  }

  /**
   * Gets file instructions from directive
   * @param {string} directive
   * @param {string} command
   */
  static #getDirectiveInstructions(directive, command) {
    const directiveArray = directive.split(' ');
    const fileLocation = path.resolve(directiveArray[0]);

    if (this.CommandsWithData.includes(command)) {
      const data =
        directiveArray.length > 1
          ? directiveArray.slice(1).join(' ').trim()
          : '';

      return {
        fileLocation,
        data,
        fileDestination: undefined,
      };
    } else {
      const fileDestination =
        directiveArray.length > 1 ? path.resolve(directiveArray[1]) : undefined;

      return {
        fileLocation,
        data: undefined,
        fileDestination,
      };
    }
  }

  /**
   * Determine if file exist
   * @param {string} fileLocation
   */
  static async #doesFileExist(fileLocation) {
    try {
      const fileHandle = await fs.open(fileLocation, 'r');

      fileHandle.close();
      return true;
    } catch (error) {
      return false;
    }
  }

  /**
   * Get action string
   * @param {string} command
   * @param {boolean | undefined} isError
   */
  static #getAction(command, isError) {
    if (command === CommandRunner.Commands.create) {
      return !!isError ? 'create' : 'created';
    } else if (command === CommandRunner.Commands.update) {
      return !!isError ? 'update' : 'updated';
    }
  }
}

module.exports = {
  FSLocalUtils,
  CommandRunner,
};
