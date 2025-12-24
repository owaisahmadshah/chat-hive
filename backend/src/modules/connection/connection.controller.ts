  /**
   * @desc    Create new friend
   * @route   POST /api/v1/user/create-friend
   * @access  Private
   *
   * @param {Request} req - Express request object containing userId, friendId
   *
   * @param {Response} res - Express request object containing friend details
   *                  (_id, username, imageUrl, lastSeen)
   */
  createFriend = asyncHandler(async (req: Request, res: Response) => {
    const { userId, friendId } = req.body

    const userData = {
      user: userId,
      friend: friendId,
    }

    const existedFriend = await Friend.findOne(userData).populate(
      "friend",
      "_id username imageUrl updatedAt"
    )

    if (existedFriend) {
      return res
        .status(200)
        .json(new ApiResponse(200, { existedFriend }, "User exists"))
    }

    await Friend.create(userData)

    const friend = await Friend.findOne(userData)
      .select("_id friend")
      .populate("friend", "_id username imageUrl updatedAt")

    return res.status(201).json(new ApiResponse(200, { friend }, "Success"))
  })

  /**
   * @desc    Get friends
   * @route   POST /api/v1/user/get-friends
   * @access  Private
   *
   * @param {Request} req - Express request object containing userId
   *
   * @param {Response} res - Express request object containing friends list
   *                  [(_id, username, imageUrl, lastSeen)]
   */
  getFriends = asyncHandler(async (req: Request, res: Response) => {
    const { userId } = req.body

    const friends = await Friend.find({ user: userId })
      .select("_id friend")
      .populate("friend", "_id username imageUrl updatedAt")

    return res.status(201).json(new ApiResponse(200, { friends }, "Success"))
  })

  /**
   * @desc    Detele friend
   * @route   POST /api/v1/user/delete-friend
   * @access  Private
   *
   * @param {Request} req - Express request object containing friend document id
   *
   * @param {Response} res - Express request object containing message of sucess/failure
   */
  deleteFriend = asyncHandler(async (req: Request, res: Response) => {
    const { friendDocumentId } = req.body

    await Friend.findByIdAndDelete(friendDocumentId)

    return res.status(200).json(new ApiResponse(200, {}, "Success"))
  })
