const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const FollowerSchema = new Schema({
  shopId: {
    type: Schema.Types.ObjectId,
    ref: 'Shop',
    required: true,
  },
  followerId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  followedAt: {
    type: Date,
    default: Date.now,
  }
});

// Đảm bảo rằng một user chỉ có thể theo dõi một shop một lần
FollowerSchema.index({ shopId: 1, followerId: 1 }, { unique: true });
const Follower = mongoose.model('Follower', FollowerSchema);

module.exports = Follower
