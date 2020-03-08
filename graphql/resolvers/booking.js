const Booking = require('../../Models/booking');
const Event = require('../../Models/event');
const { transformBooking } = require('./merge');

module.exports = {
  bookings: async (_, req) => {
    if (!req.isAuth) {
      throw new Error('Unauthenticated');
    }

    try {
      const bookings = await Booking.find();
      return bookings.map(bk => transformBooking(bk));
    } catch (err) {
      throw err;
    }
  },
  bookEvent: async (args, req) => {
    if (!req.isAuth) {
      throw new Error('Unauthenticated');
    }

    const fetchedEvent = await Event.findOne({ _id: args.eventId });

    const booking = new Booking({
      user: req.userId,
      event: fetchedEvent,
    });

    const result = await booking.save();

    return transformBooking(result);
  },
  cancelBooking: async (args, req) => {
    if (!req.isAuth) {
      throw new Error('Unauthenticated');
    }

    try {
      const { bookingId } = args;
      const booking = await Booking.findById(bookingId).populate('event');
      const event = transformEvent(booking.event)
      await Booking.deleteOne({ _id: bookingId });
      return event;
    } catch (err) {
      throw err;
    }
  },
};
