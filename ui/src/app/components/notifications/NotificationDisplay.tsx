import useAdventurerStore from "../../hooks/useAdventurerStore";
import { soundSelector, useUiSounds } from "../../hooks/useUiSound";
import { useCallback, useEffect, useState } from "react";
import { useQueriesStore } from "../../hooks/useQueryStore";
import { NullAdventurer } from "@/app/types";
import NotificationComponent from "./NotificationComponent";
import { Notification } from "@/app/types";
import { processNotifications } from "./NotificationHandler";

interface NotificationDisplayProps {
  type: string;
  notificationData: any;
  hasBeast: boolean;
}

export const NotificationDisplay = ({
  type,
  notificationData,
  hasBeast,
}: NotificationDisplayProps) => {
  const { adventurer } = useAdventurerStore();
  const { data } = useQueriesStore();
  const battles = data.lastBeastBattleQuery
    ? data.lastBeastBattleQuery.battles
    : [];
  const notifications: Notification[] = processNotifications(
    type,
    notificationData,
    battles,
    hasBeast,
    adventurer ?? NullAdventurer
  );

  const [setSound, setSoundState] = useState(soundSelector.click);

  const { play } = useUiSounds(setSound);

  const playSound = useCallback(() => {
    play();
  }, [play]);

  // useEffect(() => {
  //   if (animation) {
  //     const animationKey = Object.keys(gameData.ADVENTURER_ANIMATIONS).find(
  //       (key) => gameData.ADVENTURER_ANIMATIONS[key] === animation
  //     );
  //     if (animationKey && gameData.ADVENTURER_SOUNDS[animationKey]) {
  //       setSoundState(gameData.ADVENTURER_SOUNDS[animationKey]);
  //     }
  //     playSound();
  //   }
  // }, [
  //   animation,
  //   gameData.ADVENTURER_ANIMATIONS,
  //   gameData.ADVENTURER_SOUNDS,
  //   playSound,
  // ]);

  // const notifications = [{ message: <p>Hello</p>, animation: "die" }];

  return <NotificationComponent notifications={notifications} />;
};
