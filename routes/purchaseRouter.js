const router = require("express").Router();
const purchaseController = require("../controllers/purchaseController");

router
  .route("/")
  .get(purchaseController.getAllPurchase)
  .post(purchaseController.createPurchase);

router
  .route("/:id")
  .get(purchaseController.findPurchaseById)
  .patch(purchaseController.updatePurchase)
  .delete(purchaseController.deletePurchase);

module.exports = router;
