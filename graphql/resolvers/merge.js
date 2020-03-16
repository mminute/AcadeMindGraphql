const DataLoader = require('dataloader');
const Event = require('../../Models/event');
const User = require('../../Models/user');
const { toIsoDate } = require('../../helpers/date');

const eventLoader = new DataLoader((eventIds) => {
  return events(eventIds);
});

const userLoader = new DataLoader((userIds) => {
  return User.find({ _id: {$in: userIds} });
});

const getUser = async userId => {
  try {
    // userId is actually an object -> so JS recognizes it as unique.  Convert to a string to deduplicate entries within the userLoader
    const usr = await userLoader.load(userId.toString());

    return {
      ...usr._doc,
      createdEvents: () => eventLoader.loadMany(usr._doc.createdEvents),
    }
  } catch (err) {
    throw err;
  }
};

const events = async eventIds => {
  try {
    const events = await Event.find({ _id: { $in: eventIds } });

    events.sort((a, b) => {
      return eventIds.indexOf(a._id.toString()) - eventIds.indexOf(b._id.toString());
    });

    return events.map(evt => transformEvent(evt));
  } catch (err) {
    throw err;
  }
};

const singleEvent = async eventId => {
  try {
    const event = await eventLoader.load(eventId.toString());
    return event;
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