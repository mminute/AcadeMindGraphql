const Event = require('../../Models/event');
const User = require('../../Models/user');
const { toIsoDate } = require('../../helpers/date');

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

    return events.map(evt => transformEvent(evt));
  } catch (err) {
    throw err;
  }
};

const singleEvent = async eventId => {
  try {
    const event = await Event.findById(eventId);
    return transformEvent(event);
  } catch (err) {
    throw err;
  }
};

const transformEvent = event => ({
    ...event._doc,
    creator: getUser(event._doc.creator),
    date: toIsoDate(event._doc.date),
  });

const transformBooking = bk => ({
  ...bk._doc,
  _id: bk.id,
  createdAt: toIsoDate(bk._doc.createdAt),
  updatedAt: toIsoDate(bk._doc.updatedAt),
  user: getUser(bk._doc.user),
  event: singleEvent(bk._doc.event),
});

exports.transformEvent = transformEvent;
exports.transformBooking = transformBooking;