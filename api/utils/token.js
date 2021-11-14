const moment = require("moment");
const Token = require("./tokenModel");

const getTokenById = async (tokenId) => {
  return await Token.findById(tokenId);
};

const increaseTokenUsageCount = async (tokenId) => {
  return await Token.findOneAndUpdate(
    { _id: tokenId },
    { $inc: { usageCount: 1 } },
    {
      new: true,
    }
  );
};

const isTokenValid = async (tokenId) => {
  try {
    const token = await getTokenById(tokenId);
    if (!token) {
      return {
        error: "invalid",
      };
    }
    if (token.isRejected || moment(token.expiresAt).isBefore(moment())) {
      return {
        error: "expired",
      };
    }
    return {
      documents: token.documents,
    };
  } catch (err) {
    return {
      error: "invalid",
    };
  }
};

module.exports = { getTokenById, isTokenValid, increaseTokenUsageCount };
