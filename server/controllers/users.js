import User from '../models/User.js';
import filterObject from '../utils/filterObject.js';

/* READ */
export const getUser = async (req, res) => {
    try {
        const user = await User.findById(req.id);

        res.status(200).json(user);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
};

export const getUserFriends = async (req, res) => {
    try {
        const user = await User.findById(req.params.id).populate({
            path: 'friends',
            select: 'firstName lastName occupation location picturePath'
        });

        res.status(200).json({ data: user.friends });
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
};

/* UPDATE */

export const addRemoveFriend = async (req, res) => {
    try {
        const userA = await User.findById(req.params.id);
        const userB = await User.findById(req.params.friendId);

        const foundFriend = userA.friends.some((friendId) => {
            return friendId.toString() === userB._id.toString();
        });

        if (!foundFriend) {
            // Add new friend
            userA.friends.push(userB._id);
            userB.friends.push(userA._id);
        } else {
            // Remove friend
            userA.friends = userA.friends.filter(
                (friendId) => friendId.toString() !== userB._id.toString()
            );

            userB.friends = userB.friends.filter(
                (friendId) => friendId.toString() !== userA._id.toString()
            );
        }

        await userA.save();
        await userB.save();

        const userFriends = await User.findById(req.params.id)
            .select('friends')
            .populate({
                path: 'friends',
                select: 'firstName lastName occupation location picturePath'
            });

        return res.status(201).json({
            data: userFriends.friends
        });
    } catch (error) {
        console.log(error);
        res.status(404).json({ message: error.message });
    }
};
