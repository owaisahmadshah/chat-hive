router.route("/create-friend").post(auth, createFriend)
router.route("/update-user-fields").post(auth, updateUserShowStatus)
router.route("/get-friends").post(auth, getFriends)
router.route("/delete-friend").delete(auth, userController.deleteFriend)