const express = require("express");
const router = new express.Router();
var ResHelper = require(_pathconst.FilesPath.ResHelper);


router.use("/user", require("./user"));
router.use("/question", require("./questions"));


module.exports = router;
