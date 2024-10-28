const User = require("../models/User");
const Shop = require("../models/Shop");
const Follower = require("../models/Follower");
const { getIo } = require("../services/socket");
const asyncHandler = require("express-async-handler");

const updateRole = asyncHandler(async (req, res) => {
  const { id } = req.user;
  const { shopName } = req.body;
  const shopExisted = await Shop.findOne({ userId: id });

  if (shopExisted) {
    return res.status(409).json({ message: "Shop already existed" });
  }
  const newShop = new Shop({
    userId: id,
    shopName,
  });

  await User.findByIdAndUpdate(id, { role: "seller" });
  await newShop.save();

  return res
    .status(201)
    .json({ message: "Shop created and user role updated to seller" });
});

const updateShopActiveStatus = asyncHandler(async (req, res) => {
  const { id, role } = req.user;
  if (role != 'admin') {
    return res.status(403).json({
      message: 'Insufficient rights'
    })
  }
  const shop = await Shop.findOne({ userId: id });

  if (!shop) {
    return res.status(404).json({ message: "Seller not found" });
  }

  if (shop.active === false) {
    shop.active = true;
    await shop.save();
    return res.status(200).json({ message: "Updated" });
  }

  shop.active = false;
  await shop.save();

  return res.status(200).json({ message: "Updated" });
});

const followShop = asyncHandler(async (req, res) => {
  const { shopId } = req.params;
  const userId = req.user.id;

  const shop = await Shop.findById(shopId);
  if (!shop) {
    return res.status(404).json({ message: "Shop not found" });
  }

  const alreadyFollowing = await Follower.findOne({ shopId, followerId: userId });
  if (alreadyFollowing) {
    return res.status(409).json({ message: "You are already following this shop" });
  }

  const newFollower = new Follower({ shopId, followerId: userId });
  await newFollower.save();

  await Shop.findByIdAndUpdate(shopId, { $inc: { like: 1 } });

  const io = getIo();
  io.emit("follow", { shopId, userId });

  res.status(201).json({ message: "You are now following this shop" });
});


const unfollowShop = asyncHandler(async (req, res) => {
  const { shopId } = req.params;
  const userId = req.user.id;

  const shop = await Shop.findById(shopId);
  if (!shop) {
    return res.status(404).json({ message: "Shop not found" });
  }

  const following = await Follower.findOne({ shopId, followerId: userId });
  if (!following) {
    return res.status(404).json({ message: "You are not following this shop" });
  }

  await Follower.findOneAndDelete({ shopId, followerId: userId });
  await Shop.findByIdAndUpdate(shopId, { $inc: { like: -1 } });

  const io = getIo();
  io.emit("unfollow", { shopId, userId });

  res.status(200).json({ message: "You have unfollowed this shop" });
});



module.exports = { updateRole, updateShopActiveStatus, followShop };
