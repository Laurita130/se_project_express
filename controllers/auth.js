const createUser = (req, res) => {
  res.send({ message: "User created" });
};

const login = (req, res) => {
  res.send({ message: "User logged in" });
};

module.exports = {
  login,
  createUser,
};
