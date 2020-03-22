mongoose = require('mongoose');


var Schema = mongoose.Schema;

var BookingSchema = new Schema({
    /*  ownerUserId: String,
     locationId: String, */
    bookingDate: Date,
    numberOfAttendees: Number,

});

module.exports = mongoose.model('Booking', BookingSchema);

