const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js");
const {isLoggedIn, isOwner, validateListing, isAdmin} = require("../middleware.js");
const listingController = require("../controllers/listings.js");
const multer = require('multer');
const {storage} =require("../cloudconfig.js");
const upload = multer({storage});

//Index route
router.get("/",wrapAsync(listingController.index));

//new route
router.get("/new", isLoggedIn, isAdmin, listingController.renderNewForm);

//show route
router.get("/:id",wrapAsync( listingController.showListing));

//create route
router.post("/",isLoggedIn, isAdmin,validateListing ,upload.single("listing[image]"),wrapAsync( listingController.createListing));

//edit route
router.get("/:id/edit",isLoggedIn , isOwner, isAdmin, wrapAsync( listingController.renderEditForm));

//update route
router.put("/:id", validateListing ,isLoggedIn, isOwner, isAdmin,upload.single("listing[image]"),wrapAsync(listingController.updateListing ));

//delete route
router.delete("/:id",isLoggedIn,isOwner ,isAdmin,wrapAsync(listingController.destroyListing ));

module.exports = router;
 