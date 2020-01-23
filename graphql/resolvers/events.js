const Event = require('../../Models/event');
const User = require('../../Models/user');
const { transformEvent } = require('./merge');

module.exports = {
  events: async () => {
    try {
      const events = await Event.find();

      return events.map(evt => transformEvent(evt));
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

      createdEvent = transformEvent(result);

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
};

