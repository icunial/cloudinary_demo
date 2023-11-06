const { Router } = require("express");
const router = Router();

const publicationsRouter = require("./publications");

router.use("/publications", publicationsRouter);

module.exports = router;
