const User = require('../models/user.model');
const bcrypt = require('bcrypt');

exports.register = async ({ name, email, password }) => {
  email = email.toLowerCase().trim();

  const existed = await User.findOne({ email });
  if (existed) throw new Error("Email đã tồn tại");

  const hash = await bcrypt.hash(password, 10);

  return User.create({ name, email, password: hash });
};

exports.login = async ({ email, password }) => {
  email = email.toLowerCase().trim();

  const user = await User.findOne({ email });
  if (!user) throw new Error("Email không tồn tại");

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) throw new Error("Sai mật khẩu");

  return {
    id: user._id,
    name: user.name,
    email: user.email
  };
};