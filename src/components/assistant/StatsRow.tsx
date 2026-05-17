"use client";

import React from "react";
import StatsCard from "./StatsCard";

const StatsRow = ({
  stats,
  titleArray,
  showExpiredCard = true,
}: {
  stats: {
    totalUsers: number;
    premiumUsers: number;
    proUsers: number;
    ultimateUsers: number;
    expiredPremiums: number;
  };
  titleArray: string[];
  showExpiredCard?: boolean;
}) => {
  const cards: { title: string; value: number; color?: string }[] = [
    { title: titleArray[0], value: stats.totalUsers },
    { title: titleArray[1], value: stats.premiumUsers },
    { title: titleArray[2], value: stats.proUsers },
    { title: titleArray[3], value: stats.ultimateUsers },
  ];

  if (showExpiredCard) {
    cards.push({
      title: "Expired Premiums",
      value: stats.expiredPremiums,
      color: "red",
    });
  }

  return (
    <div
      className={`grid w-full gap-4 ${
        showExpiredCard
          ? "grid-cols-1 sm:grid-cols-2 xl:grid-cols-5"
          : "grid-cols-1 sm:grid-cols-2 xl:grid-cols-4"
      }`}
    >
      {cards.map((card, index) => (
        <StatsCard
          key={card.title}
          title={card.title}
          value={card.value}
          color={card.color}
          index={index}
        />
      ))}
    </div>
  );
};

export default StatsRow;