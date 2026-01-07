import mongoose, { type Document } from "mongoose"
import { User } from "./user.model.js"

export class UserRepository {
  findByEmailOrUser(email: string, username: string) {
    return User.findOne({
      $or: [{ email }, { username }],
    })
  }

  create(data: {
    email: string
    username: string
    password: string
    otp: string
    otpExpiry: Date
    dummy?: boolean
  }) {
    return User.create(data)
  }

  findById(userId: string) {
    return User.findById(userId)
  }

  updateRefreshToken(userId: string, refreshToken: string) {
    return User.updateOne({ _id: userId }, { refreshToken })
  }

  updateIsVerified(userId: string, isVerified: boolean) {
    return User.updateOne({ _id: userId }, { isVerified })
  }

  save(doc: Document) {
    return doc.save()
  }

  saveWithoutValidation(doc: Document) {
    return doc.save({ validateBeforeSave: false })
  }

  findOneAndDelete(userId: string) {
    return User.findOneAndDelete({ _id: userId })
  }

  findByIdAndSelect(userId: string) {
    return User.findById(userId).select(
      "_id email username imageUrl lastSignInAt about isReadReceipts showAbout showLastSeen showProfileImage"
    )
  }

  findByUsername(username: string) {
    return User.find({ username })
  }

  findByIdAndUpdateImageUrl(userId: string, imageUrl: string) {
    return User.findByIdAndUpdate(userId, { imageUrl }, { new: true })
  }

  recommendedUsers({
    userId,
    limit,
    cursor,
  }: {
    userId: string
    limit: number
    cursor: string | null
  }) {
    const userObjectId = new mongoose.Types.ObjectId(userId)

    let filter: any = {
      _id: {
        $ne: userObjectId,
      },
    }

    if (cursor) {
      filter.createdAt = { $lt: new Date(cursor) }
    }

    return User.aggregate([
      {
        $match: filter,
      },
      {
        $sort: {
          createdAt: -1,
        },
      },
      {
        $limit: limit,
      },
      {
        $lookup: {
          from: "connections",
          let: {
            userId: "$_id",
          },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ["$sender", userObjectId] },
                    { $eq: ["$receiver", "$$userId"] },
                  ],
                },
              },
            },
          ],
          as: "connection",
        },
      },
      {
        $match: {
          connection: { $size: 0 },
        },
      },
      {
        $project: {
          _id: 1,
          email: 1,
          username: 1,
          imageUrl: 1,
          about: 1,
          isReadReceipts: 1,
          showAbout: 1,
          showLastSeen: 1,
          showProfileImage: 1,
          createdAt: 1,
        },
      },
    ])
  }

  fetchChatUserById({
    // userId,
    chatUserId,
  }: {
    userId: string
    chatUserId: string
  }) {
    // const userObjId = new mongoose.Types.ObjectId(userId)
    const chatUserObjId = new mongoose.Types.ObjectId(chatUserId)

    return User.aggregate([
      {
        $match: {
          _id: chatUserObjId,
        },
      },
      {
        $project: {
          _id: 1,
          username: 1,
          imageUrl: 1,
          about: 1,
          showAbout: 1,
          showLastSeen: 1,
          showProfileImage: 1,
        },
      },
    ])
  }
}
