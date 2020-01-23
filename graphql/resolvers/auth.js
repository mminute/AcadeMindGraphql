const bcrypt = require('bcryptjs');
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
};
