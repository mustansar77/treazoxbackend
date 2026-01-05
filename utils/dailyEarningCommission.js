import User from "../models/User.js";

/**
 * Distribute daily earning commission to upline
 * LEVEL 1 – 4%
 * LEVEL 2 – 2%
 * LEVEL 3 – 1%
 */
export const distributeDailyEarningCommission = async (user, amount) => {
  // LEVEL 1 – 4%
  if (!user.referredBy) return;
  const level1 = await User.findOne({ referralCode: user.referredBy });
  if (!level1) return;

  const lvl1Amount = amount * 0.04; // 4%
  level1.balance += lvl1Amount;        
  level1.dailyCommissionBalance =
    (level1.dailyCommissionBalance || 0) + lvl1Amount; 
  await level1.save();

  // LEVEL 2 – 2%
  if (!level1.referredBy) return;
  const level2 = await User.findOne({ referralCode: level1.referredBy });
  if (!level2) return;

  const lvl2Amount = amount * 0.02; // 2%
  level2.balance += lvl2Amount;
  level2.dailyCommissionBalance =
    (level2.dailyCommissionBalance || 0) + lvl2Amount;
  await level2.save();

  // LEVEL 3 – 1%
  if (!level2.referredBy) return;
  const level3 = await User.findOne({ referralCode: level2.referredBy });
  if (!level3) return;

  const lvl3Amount = amount * 0.01; // 1%
  level3.balance += lvl3Amount;
  level3.dailyCommissionBalance =
    (level3.dailyCommissionBalance || 0) + lvl3Amount;
  await level3.save();
};
