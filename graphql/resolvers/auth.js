const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../../Models/user');

module.exports = {
  createUser: async args => {
    try {
      const { email, password } = args.userInput;
      const user = await User.findOne({ email: email });

      if (user) {
        throw new Error('User already exists');
      }

      const hashedPassword = await bcrypt.hash(password, 12);

      const createdUser = new User({
        email,
        password: hashedPassword,
      });

      const result = await createdUser.save()

      return { ...result._doc, _id: result.id, password: null }

    } catch(err) {
      throw err;
    }
  },
  login: async ({ email, password }) => {
    const user = await User.findOne({ email });

    if (!user) {
      throw new Error('User does not exist');
    }

    const isEqual = await bcrypt.compare(password, user.password);

    if (!isEqual) {
      throw new Error('Password is incorrect');
    }

    const token = jwt.sign(
      { userId: user.id, email: user.email },
      // TODO: put a more secure hash string in nodemon.json
      'somesupresecretkey', // string used to hash the token and validation - private key
      { // Optional 3rd arg to configure token
        expiresIn: '1h',
      },
    );

    return {
      userId: user.id,
      token,
      tokenExpiration: 1,
    }
  },
};
