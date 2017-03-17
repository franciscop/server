module.exports = errors => (name, opts) => {
  const err = errors && errors[name] ?
    (errors[name] instanceof Function ?
      errors[name](opts) :
      errors[name]
    ) : new Error(name);

  err.path = name;
  throw err;
};
