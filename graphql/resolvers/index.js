const bcrypt = require('bcryptjs');
const Event = require('../../Models/event');
const User = require('../../Models/user');

const toIsoDate = (mongoDate) => new Date(mongoDate).toISOString();

const user = async userId => {
  try {
    const usr = await User.findById(userId);

    return {
      ...usr._doc,
      createdEvents: events(usr._doc.createdEvents),
    }
  } catch (err) {
    throw err;
  }

};

const events = async eventIds => {
  try {
    const events = await Event.find({ _id: { $in: eventIds } })

    return events.map(evt => ({
      ...evt._doc,
      creator: user(evt.creator),
      date: toIsoDate(evt._doc.date),
    }));
  } catch (err) {
    throw err;
  }
};

module.exports = {
  events: async () => {
    try {
      const events = await Event.find();

      return events.map(evt => ({
        ...evt._doc,
        creator: user(evt._doc.creator),
        date: toIsoDate(evt._doc.date),
      }));
    } catch (err) {
      throw err;
    }
  },
  createEvent: async (args) => {
    try {
      const { title, description, price, date } = args.eventInput;

      const event = new Event({
        title: title,
        description: description,
        price: +price,
        date: new Date(date),
        creator: '5e1d5e9f8292193d8cadaa94',
      });

      let createdEvent;
      const result = await event.save();

      createdEvent = {
        ...result._doc,
        creator: user(result._doc.creator),
        date: toIsoDate(event._doc.date)
      };

      const creator = await User.findById('5e1d5e9f8292193d8cadaa94');

      if (!creator) {
        throw new Error('No user found');
      }

      creator.createdEvents.push(event);
      const updatedUser = await creator.save();

      return createdEvent;
    } catch (err) {
      console.log(err);
      throw err;
    }
  },
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
  }
};
