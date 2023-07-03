import { useEffect, useState, useRef, ReactElement } from "react";
import { useContracts } from "../../hooks/useContracts";
import { Button } from "../buttons/Button";
import useAdventurerStore from "../../hooks/useAdventurerStore";
import useTransactionCartStore from "../../hooks/useTransactionCartStore";
import { useMediaQuery } from "react-responsive";
import { Item, Menu } from "@/app/types";
import { GameData } from "../GameData";
import { getKeyFromValue } from "@/app/lib/utils";

interface InventoryRowProps {
  title: string;
  items: Item[];
  menuIndex: number;
  isActive: boolean;
  setActiveMenu: (value: number | undefined) => void;
  isSelected: boolean;
  setSelected: (value: number) => void;
  equippedItem: string | undefined;
  icon?: ReactElement;
}

export const InventoryRow = ({
  title,
  items,
  menuIndex,
  isActive,
  setActiveMenu,
  isSelected,
  setSelected,
  equippedItem,
  icon,
}: InventoryRowProps) => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const { gameContract } = useContracts();
  const adventurer = useAdventurerStore((state) => state.adventurer);
  const addToCalls = useTransactionCartStore((state) => state.addToCalls);

  const handleAddEquipItem = (item: string) => {
    if (gameContract) {
      const gameData = new GameData();
      const equipItem = {
        contractAddress: gameContract?.address,
        entrypoint: "equip_item",
        calldata: [adventurer?.id, getKeyFromValue(gameData.ITEMS, item)],
        metadata: `Equipping ${item}!`,
      };
      addToCalls(equipItem);
    }
  };

  const unequippedItems = items?.filter((item) => item.item != equippedItem);

  const handleKeyDown = (event: KeyboardEvent) => {
    switch (event.key) {
      case "ArrowDown":
        setSelectedIndex((prev) => {
          const newIndex = Math.min(prev + 1, unequippedItems?.length - 1);
          return newIndex;
        });
        break;
      case "ArrowUp":
        setSelectedIndex((prev) => {
          const newIndex = Math.max(prev - 1, 0);
          return newIndex;
        });
        break;
      case "Enter":
        handleAddEquipItem(unequippedItems[selectedIndex]?.item ?? "");
        break;
      case "Escape":
        setActiveMenu(undefined);
        break;
    }
  };

  useEffect(() => {
    if (isActive) {
      window.addEventListener("keydown", handleKeyDown);
    } else {
      window.removeEventListener("keydown", handleKeyDown);
    }
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isActive, selectedIndex]);

  const isMobileDevice = useMediaQuery({
    query: "(max-device-width: 480px)",
  });

  return (
    <>
      <div className="flex flex-row w-full gap-3 sm:gap-1 align-center">
        <Button
          className={isSelected && !isActive ? "animate-pulse" : ""}
          variant={isSelected ? "default" : "ghost"}
          size={isMobileDevice ? "sm" : "lg"}
          onClick={() => {
            setSelected(menuIndex);
            setActiveMenu(menuIndex);
          }}
        >
          {isMobileDevice ? (
            <div className="flex items-center justify-center w-10 h-10 sm:hidden">
              {icon}
            </div>
          ) : (
            <>
              <div className="flex items-center justify-center w-10 h-10">
                {icon}
              </div>
              <p className="w-40 text-xl whitespace-nowrap hidden sm:block">
                {title}
              </p>
            </>
          )}
        </Button>
      </div>
    </>
  );
};
