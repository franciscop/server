module.exports = async (cb, err = false) => {
  try {
    const res = await cb();
  } catch(err) {
    if (!(err instanceof Error)) {
      throw new Error('A non-error was thrown: ' + err);
    }
    return err;
  }
  throw new Error('No error was thrown');
};
