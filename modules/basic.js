module.exports = client => {
  /*
  MESSAGE CLEAN FUNCTION
  "Clean" removes @everyone pings, as well as tokens, and makes code blocks
  escaped so they're shown more easily. As a bonus it resolves promises
  and stringifies objects!
  This is mostly only used by the Eval and Exec commands.
  */
  client.clean = async (client, text) => {
    if (text && text.constructor.name == 'Promise') text = await text;
    if (typeof evaled !== 'string') text = require('util').inspect(text, {depth: 1});

    text = text
      .replace(/`/g, '`' + String.fromCharCode(8203))
      .replace(/@/g, '@' + String.fromCharCode(8203))
      .replace(client.token, 'mfa.VkO_2G4Qv3T--NO--lWetW_tjND--TOKEN--QFTm6YGtzq9PH--4U--tG0');

    return text;
  };

  /* MISCELLANEOUS NON-CRITICAL FUNCTIONS */

  /* eslint-disable no-extend-native */
  // EXTENDING NATIVE TYPES IS BAD PRACTICE.
  // Why? Because if JavaScript adds this later, this conflicts with nave code.
  // Also, if some other library you use does this, a conflict also occurs.
  // KNOWTING THIS, however, the following methods are very useful in code, we feel.

  // <Array>.remove(target) removes an element that is equal to 'target' from the array,
  // and returns the length of the new array (i.e. [length of the original array] - 1).
  // Notice that this is destructive.
  // [1, 2, 3, 4, 5].remove(3) makes itself [1, 2, 4, 5] and returns 4.
  Object.defineProperty(Array.prototype, 'remove', {
    value: function(target) {
      const newArray = this.filter(elem => elem !== target);
      this.splice(0, this.length);
      return this.push(newArray).length;
    },
  });
  /* eslint-enable no-extend-native */

  // `await DGI.wait(1000);` to "pause" for 1 second.
  client.wait = require('util').promisify(setTimeout);

  client.random = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

  // These 2 process methods will catch exceptions and give *more details* about the error and stack trace.
  process.on('uncaughtException', err => {
    const errorMsg = err.stack.replace(new RegExp(`${__dirname}/`, 'g'), './');
    client.logger.error(`Uncaught Exception: ${errorMsg}`);
    // Always best practice to let the code crash on uncaught exceptions.
    // Because you should be catching them anyway.
    process.exit(1);
  });

  process.on('unhandledRejection', err => {
    client.logger.error(`Unhandled rejection: ${err}`);
  });
};