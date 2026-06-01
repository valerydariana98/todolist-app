const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../models/User");

const {
  registerSchema,
  loginSchema
} = require("../validations/authValidation");

const register = async (req, res) => {
  try {
    const data = registerSchema.parse(req.body);

    const existingUser = await User.findOne({
      email: data.email
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "El correo ya está registrado"
      });
    }

    const hashedPassword = await bcrypt.hash(
      data.password,
      10
    );

    const user = await User.create({
      name: data.name,
      email: data.email,
      password: hashedPassword
    });

    res.status(201).json({
      success: true,
      message: "Usuario registrado correctamente"
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

const login = async (req, res) => {
  try {
    const data = loginSchema.parse(req.body);

    const user = await User.findOne({
      email: data.email
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Credenciales inválidas"
      });
    }

    const isValidPassword = await bcrypt.compare(
      data.password,
      user.password
    );

    if (!isValidPassword) {
      return res.status(401).json({
        success: false,
        message: "Credenciales inválidas"
      });
    }

    const token = jwt.sign(
      {
        id: user._id,
        email: user.email
      },
      process.env.JWT_SECRET,
      {
        expiresIn: process.env.JWT_EXPIRES_IN
      }
    );

    res.status(200).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

module.exports = {
  register,
  login
};