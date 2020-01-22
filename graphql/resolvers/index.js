const bcrypt = require('bcryptjs');
const Event = require('../../Models/event');
const User = require('../../Models/user');
const Booking = require('../../Models/booking');

const toIsoDate = (mongoDate) => new Date(mongoDate).toISOString();

const getUser = async userId => {
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
      creator: getUser(evt.creator),
      date: toIsoDate(evt._doc.date),
    }));
  } catch (err) {
    throw err;
  }
};

const singleEvent = async eventId => {
  try {
    const event = await Event.findById(eventId);
    return {
      ...event._doc,
      date: toIsoDate(event._doc.date),
      creator: getUser(event.creator),
    };
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
        creator: getUser(evt._doc.creator),
        date: toIsoDate(evt._doc.date),
      }));
    } catch (err) {
      throw err;
    }
  },
  bookings: async () => {
    try {
      const bookings = await Booking.find();
      return bookings.map(bk => ({
        ...bk._doc,
        _id: bk.id,
        createdAt: toIsoDate(bk._doc.createdAt),
        updatedAt: toIsoDate(bk._doc.updatedAt),
        user: getUser(bk._doc.user),
        event: singleEvent(bk._doc.event),
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
        creator: getUser(result._doc.creator),
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
  },
  bookEvent: async args => {
    const fetchedEvent = await Event.findOne({ _id: args.eventId });

    const booking = new Booking({
      user: '5e1d5e9f8292193d8cadaa94',
      event: fetchedEvent,
    });

    const result = await booking.save();

    const { createdAt, updatedAt, user, event } = result._doc;

    return {
      ...result._doc,
      createdAt: toIsoDate(createdAt),
      updatedAt: toIsoDate(updatedAt),
      user: getUser(user),
      event: singleEvent(event),
    }
  },
  cancelBooking: async args => {
    try {
      const { bookingId } = args;
      const booking = await Booking.findById(bookingId).populate('event');
      const event = { ...booking.event._doc, creator: getUser(booking.event._doc.creator) }
      await Booking.deleteOne({ _id: bookingId });
      return event;
    } catch (err) {
      throw err;
    }
  },
};
