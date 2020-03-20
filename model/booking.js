mongoose = require('mongoose');


var Schema = mongoose.Schema;

var BookingSchema = new Schema({
    /*  ownerUserId: String,
     locationId: String, */
    dateTimeFrom: Date,
    dateTimeTo: Date,
    numberOfAttendees: Number,

});

module.exports = mongoose.model('Booking', BookingSchema);

