const express = require("express");
const router = express.Router();
const Booking = require("../models/booking");
const Listing = require("../models/listing");
const { isLoggedIn } = require("../middleware");

router.get("/mybookings", isLoggedIn, async (req, res) => {
    const bookings = await Booking.find({ user: req.user._id })
        .populate("listing")
        .sort({ createdAt: -1 });

    res.render("bookings/mybookings.ejs", { bookings });
});


router.post("/:id", isLoggedIn, async (req, res) => {
    const { id } = req.params;
    const { checkIn, checkOut } = req.body;
    const listing = await Listing.findById(id);

    if (!listing) {
        req.flash("error", "Listing not found");
        return res.redirect("/listings");
    }
    const newCheckIn = new Date(checkIn);
    const newCheckOut = new Date(checkOut);
    if (newCheckIn >= newCheckOut) {
        req.flash("error", "Check-out date must be after check-in date.");
        return res.redirect(`/listings/${id}`);
    }

    const overlapping = await Booking.findOne({
        listing: listing._id,
        $or: [
            {
                checkIn: { $lt: newCheckOut },
                checkOut: { $gt: newCheckIn }
            }
        ]
    });
    if (overlapping) {
        req.flash("error", "This listing is already booked for the selected dates.");
        return res.redirect(`/listings/${id}`);
    }
    const booking = new Booking({
        listing: listing._id,
        user: req.user._id,
        checkIn: newCheckIn,
        checkOut: newCheckOut
    });
    await booking.save();
    req.flash("success", "Booking confirmed!");
    res.redirect("/bookings/mybookings");
    console.log("Booking ID:", req.params.id);
    console.log("Booking Dates:", req.body);
});


module.exports = router;
