// src/controllers/auth.controller.js

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/user.model");

// ================= REGISTER PAGE =================
exports.showRegister = (req, res) => {
  res.render("pages/register", {
    error: null,
    success: null
  });
};

// ================= REGISTER =================
exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.render("pages/register", {
        error: "Vui lòng nhập đầy đủ thông tin",
        success: null
      });
    }


    const exist = await User.findOne({ email });

    if (exist) {
      return res.render("pages/register", {
        error: "Email đã tồn tại",
        success: null
      });
    }

    const hashPassword = await bcrypt.hash(password, 10);

    await User.create({
      name,
      email,
      password: hashPassword
    });

    return res.render("pages/login", {
      error: null,
      success: "Đăng ký thành công"
    });

  } catch (error) {
    console.log(error);

    return res.render("pages/register", {
      error: "Đăng ký thất bại",
      success: null
    });
  }
};

// ================= LOGIN PAGE =================
exports.showLogin = (req, res) => {
  res.render("pages/login", {
    error: null,
    success: null
  });
};

// ================= LOGIN =================
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // kiểm tra rỗng
    if (!email || !password) {
      return res.render("pages/login", {
        error: "Vui lòng nhập email và mật khẩu",
        success: null
      });
}
    const user = await User.findOne({ email });

    if (!user) {
      return res.render("pages/login", {
        error: "Sai email hoặc mật khẩu",
        success: null
      });
    }

    const checkPassword = await bcrypt.compare(
      password,
      user.password
    );

    if (!checkPassword) {
      return res.render("pages/login", {
        error: "Sai email hoặc mật khẩu",
        success: null
      });
    }


    const token = jwt.sign(
  {
    id: user._id,
    name: user.name,
    email: user.email,
    role: user.role
  },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d"
      }
    );

   
   res.cookie("token", token, {
  httpOnly: true,
  secure: false,
  sameSite: "lax",
  maxAge: 24 * 60 * 60 * 1000
});
  
  res.cookie("userId", user._id);

  
    return res.redirect("/home");

  } catch (error) {
    console.log(error);

    return res.render("pages/login", {
      error: "Đăng nhập thất bại",
      success: null
    });
  }
};

// ================= LOGOUT =================
exports.logout = (req, res) => {
  res.clearCookie("token");

  return res.redirect("/auth/login");
};