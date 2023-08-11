const express = require("express");
const router = express.Router();
const genresControllers = require("../../controllers/genres.controller")

router
  .route("/")
  /**
   * @api {get} /books All books
   * @apiDescription Get all the books
   * @apiPermission admin
   *
   * @apiHeader {String} Authorization   User's access token
   *
   * @apiParam  {Number{1-}}         [page=1]     List page
   * @apiParam  {Number{1-100}}      [limit=10]  Users per page
   *
   * @apiSuccess {Object[]} all the books.
   *
   * @apiError (Unauthorized 401)  Unauthorized  Only authenticated users can access the data
   * @apiError (Forbidden 403)     Forbidden     Only admins can access the data
   */
  .get(genresControllers.getAllGenres)
  
module.exports = router;