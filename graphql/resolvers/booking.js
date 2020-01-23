const Booking = require('../../Models/booking');
const { transformBooking } = require('./merge');

module.exports = {
  bookings: async () => {
    try {
      const bookings = await Booking.find();
      return bookings.map(bk => transformBooking(bk));
    } catch (err) {
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

    return transformBooking(result);
  },
  cancelBooking: async args => {
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
