"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectPopup, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ItemTemplate, defaultItemTemplate } from "@/lib/types/item-template";
import { Copy, Download, Save, Upload } from "lucide-react";
import { ModeToggle } from "@/components/mode-toggle";

const inventoryTypes = [
  { value: "0", label: "Non-equippable" },
  { value: "1", label: "Head" },
  { value: "2", label: "Neck" },
  { value: "3", label: "Shoulder" },
  { value: "4", label: "Body" },
  { value: "5", label: "Chest" },
  { value: "6", label: "Waist" },
  { value: "7", label: "Legs" },
  { value: "8", label: "Feet" },
  { value: "9", label: "Wrists" },
  { value: "10", label: "Hands" },
  { value: "11", label: "Finger" },
  { value: "12", label: "Trinket" },
  { value: "13", label: "Weapon (One-Handed)" },
  { value: "14", label: "Shield" },
  { value: "15", label: "Ranged" },
  { value: "16", label: "Cloak" },
  { value: "17", label: "Two-Handed Weapon" },
  { value: "18", label: "Bag" },
  { value: "19", label: "Tabard" },
  { value: "20", label: "Robe" },
  { value: "21", label: "Main Hand Weapon" },
  { value: "22", label: "Off Hand Weapon" },
  { value: "23", label: "Holdable (Tome)" },
  { value: "24", label: "Ammo" },
  { value: "25", label: "Thrown" },
  { value: "26", label: "Ranged Right" },
  { value: "27", label: "Quiver" },
  { value: "28", label: "Relic" },
];

const qualityTypes = [
  { value: "0", label: "Poor" },
  { value: "1", label: "Common" },
  { value: "2", label: "Uncommon" },
  { value: "3", label: "Rare" },
  { value: "4", label: "Epic" },
  { value: "5", label: "Legendary" },
  { value: "6", label: "Artifact" },
  { value: "7", label: "Heirloom" },
];

const reputationRanks = [
  { value: "0", label: "Hated" },
  { value: "1", label: "Hostile" },
  { value: "2", label: "Unfriendly" },
  { value: "3", label: "Neutral" },
  { value: "4", label: "Friendly" },
  { value: "5", label: "Honored" },
  { value: "6", label: "Revered" },
  { value: "7", label: "Exalted" },
];

const statTypes = [
  { value: "0", label: "ITEM_MOD_MANA" },
  { value: "1", label: "ITEM_MOD_HEALTH" },
  { value: "3", label: "ITEM_MOD_AGILITY" },
  { value: "4", label: "ITEM_MOD_STRENGTH" },
  { value: "5", label: "ITEM_MOD_INTELLECT" },
  { value: "6", label: "ITEM_MOD_SPIRIT" },
  { value: "7", label: "ITEM_MOD_STAMINA" },
  { value: "12", label: "ITEM_MOD_DEFENSE_SKILL_RATING" },
  { value: "13", label: "ITEM_MOD_DODGE_RATING" },
  { value: "14", label: "ITEM_MOD_PARRY_RATING" },
  { value: "15", label: "ITEM_MOD_BLOCK_RATING" },
  { value: "16", label: "ITEM_MOD_HIT_MELEE_RATING" },
  { value: "17", label: "ITEM_MOD_HIT_RANGED_RATING" },
  { value: "18", label: "ITEM_MOD_HIT_SPELL_RATING" },
  { value: "19", label: "ITEM_MOD_CRIT_MELEE_RATING" },
  { value: "20", label: "ITEM_MOD_CRIT_RANGED_RATING" },
  { value: "21", label: "ITEM_MOD_CRIT_SPELL_RATING" },
  { value: "22", label: "ITEM_MOD_HIT_TAKEN_MELEE_RATING" },
  { value: "23", label: "ITEM_MOD_HIT_TAKEN_RANGED_RATING" },
  { value: "24", label: "ITEM_MOD_HIT_TAKEN_SPELL_RATING" },
  { value: "25", label: "ITEM_MOD_CRIT_TAKEN_MELEE_RATING" },
  { value: "26", label: "ITEM_MOD_CRIT_TAKEN_RANGED_RATING" },
  { value: "27", label: "ITEM_MOD_CRIT_TAKEN_SPELL_RATING" },
  { value: "28", label: "ITEM_MOD_HASTE_MELEE_RATING" },
  { value: "29", label: "ITEM_MOD_HASTE_RANGED_RATING" },
  { value: "30", label: "ITEM_MOD_HASTE_SPELL_RATING" },
  { value: "31", label: "ITEM_MOD_HIT_RATING" },
  { value: "32", label: "ITEM_MOD_CRIT_RATING" },
  { value: "33", label: "ITEM_MOD_HIT_TAKEN_RATING" },
  { value: "34", label: "ITEM_MOD_CRIT_TAKEN_RATING" },
  { value: "35", label: "ITEM_MOD_RESILIENCE_RATING" },
  { value: "36", label: "ITEM_MOD_HASTE_RATING" },
  { value: "37", label: "ITEM_MOD_EXPERTISE_RATING" },
  { value: "38", label: "ITEM_MOD_ATTACK_POWER" },
  { value: "39", label: "ITEM_MOD_RANGED_ATTACK_POWER" },
  { value: "40", label: "ITEM_MOD_FERAL_ATTACK_POWER" },
  { value: "41", label: "ITEM_MOD_SPELL_HEALING_DONE" },
  { value: "42", label: "ITEM_MOD_SPELL_DAMAGE_DONE" },
  { value: "43", label: "ITEM_MOD_MANA_REGENERATION" },
  { value: "44", label: "ITEM_MOD_ARMOR_PENETRATION_RATING" },
  { value: "45", label: "ITEM_MOD_SPELL_POWER" },
  { value: "46", label: "ITEM_MOD_HEALTH_REGEN" },
  { value: "47", label: "ITEM_MOD_SPELL_PENETRATION" },
  { value: "48", label: "ITEM_MOD_BLOCK_VALUE" },
];

const damageTypes = [
  { value: "0", label: "Normal" },
  { value: "1", label: "Holy" },
  { value: "2", label: "Fire" },
  { value: "3", label: "Nature" },
  { value: "4", label: "Frost" },
  { value: "5", label: "Shadow" },
  { value: "6", label: "Arcane" },
];

const itemClasses = [
  { value: "0", label: "Consumable" },
  { value: "1", label: "Container" },
  { value: "2", label: "Weapon" },
  { value: "3", label: "Gem" },
  { value: "4", label: "Armor" },
  { value: "5", label: "Reagent" },
  { value: "6", label: "Projectile" },
  { value: "7", label: "Trade Goods" },
  { value: "8", label: "Generic" },
  { value: "9", label: "Recipe" },
  { value: "10", label: "Money" },
  { value: "11", label: "Quiver" },
  { value: "12", label: "Quest" },
  { value: "13", label: "Key" },
  { value: "14", label: "Permanent" },
  { value: "15", label: "Miscellaneous" },
];

const itemSubclasses: Record<string, Array<{ value: string; label: string }>> = {
  "0": [ // Consumable
    { value: "0", label: "Consumable" },
    { value: "1", label: "Potion" },
    { value: "2", label: "Elixir" },
    { value: "3", label: "Flask" },
    { value: "4", label: "Scroll" },
    { value: "5", label: "Food & Drink" },
    { value: "6", label: "Item Enhancement" },
    { value: "7", label: "Bandage" },
    { value: "8", label: "Other" },
  ],
  "1": [ // Container
    { value: "0", label: "Bag" },
    { value: "1", label: "Soul Bag" },
    { value: "2", label: "Herb Bag" },
    { value: "3", label: "Enchanting Bag" },
    { value: "4", label: "Engineering Bag" },
    { value: "5", label: "Gem Bag" },
    { value: "6", label: "Mining Bag" },
    { value: "7", label: "Leatherworking Bag" },
    { value: "8", label: "Inscription Bag" },
  ],
  "2": [ // Weapon
    { value: "0", label: "Axe (One-Handed)" },
    { value: "1", label: "Axe (Two-Handed)" },
    { value: "2", label: "Bow" },
    { value: "3", label: "Gun" },
    { value: "4", label: "Mace (One-Handed)" },
    { value: "5", label: "Mace (Two-Handed)" },
    { value: "6", label: "Polearm" },
    { value: "7", label: "Sword (One-Handed)" },
    { value: "8", label: "Sword (Two-Handed)" },
    { value: "10", label: "Staff" },
    { value: "13", label: "Fist Weapon" },
    { value: "14", label: "Miscellaneous" },
    { value: "15", label: "Dagger" },
    { value: "16", label: "Thrown" },
    { value: "17", label: "Spear" },
    { value: "18", label: "Crossbow" },
    { value: "19", label: "Wand" },
    { value: "20", label: "Fishing Pole" },
  ],
  "3": [ // Gem
    { value: "0", label: "Red" },
    { value: "1", label: "Blue" },
    { value: "2", label: "Yellow" },
    { value: "3", label: "Purple" },
    { value: "4", label: "Green" },
    { value: "5", label: "Orange" },
    { value: "6", label: "Meta" },
    { value: "7", label: "Simple" },
    { value: "8", label: "Prismatic" },
  ],
  "4": [ // Armor
    { value: "0", label: "Miscellaneous" },
    { value: "1", label: "Cloth" },
    { value: "2", label: "Leather" },
    { value: "3", label: "Mail" },
    { value: "4", label: "Plate" },
    { value: "5", label: "Buckler" },
    { value: "6", label: "Shield" },
    { value: "7", label: "Libram" },
    { value: "8", label: "Idol" },
    { value: "9", label: "Totem" },
    { value: "10", label: "Sigil" },
  ],
  "5": [ // Reagent
    { value: "0", label: "Reagent" },
  ],
  "6": [ // Projectile
    { value: "0", label: "Wand" },
    { value: "1", label: "Bolt" },
    { value: "2", label: "Arrow" },
    { value: "3", label: "Bullet" },
    { value: "4", label: "Thrown" },
  ],
  "7": [ // Trade Goods
    { value: "0", label: "Trade Goods" },
    { value: "1", label: "Parts" },
    { value: "2", label: "Explosives" },
    { value: "3", label: "Devices" },
    { value: "4", label: "Jewelcrafting" },
    { value: "5", label: "Cloth" },
    { value: "6", label: "Leather" },
    { value: "7", label: "Metal & Stone" },
    { value: "8", label: "Meat" },
    { value: "9", label: "Herb" },
    { value: "10", label: "Elemental" },
    { value: "11", label: "Other" },
    { value: "12", label: "Enchanting" },
    { value: "13", label: "Materials" },
    { value: "14", label: "Item Enchantment" },
    { value: "15", label: "Weapon Enchantment" },
  ],
  "8": [ // Generic
    { value: "0", label: "Generic" },
  ],
  "9": [ // Recipe
    { value: "0", label: "Book" },
    { value: "1", label: "Leatherworking" },
    { value: "2", label: "Tailoring" },
    { value: "3", label: "Engineering" },
    { value: "4", label: "Blacksmithing" },
    { value: "5", label: "Cooking" },
    { value: "6", label: "Alchemy" },
    { value: "7", label: "First Aid" },
    { value: "8", label: "Enchanting" },
    { value: "9", label: "Fishing" },
    { value: "10", label: "Jewelcrafting" },
  ],
  "10": [ // Money
    { value: "0", label: "Money" },
  ],
  "11": [ // Quiver
    { value: "0", label: "Quiver" },
    { value: "1", label: "Ammo Pouch" },
  ],
  "12": [ // Quest
    { value: "0", label: "Quest" },
  ],
  "13": [ // Key
    { value: "0", label: "Key" },
    { value: "1", label: "Lockpick" },
  ],
  "14": [ // Permanent
    { value: "0", label: "Permanent" },
  ],
  "15": [ // Miscellaneous
    { value: "0", label: "Junk" },
    { value: "1", label: "Reagent" },
    { value: "2", label: "Pet" },
    { value: "3", label: "Holiday" },
    { value: "4", label: "Other" },
    { value: "5", label: "Mount" },
  ],
};

const itemFlags = [
  { value: 0x00000001, label: "ITEM_FLAG_SOULBOUND" },
  { value: 0x00000002, label: "ITEM_FLAG_CONJURED" },
  { value: 0x00000004, label: "ITEM_FLAG_LOOTABLE" },
  { value: 0x00000008, label: "ITEM_FLAG_HEROIC" },
  { value: 0x00000010, label: "ITEM_FLAG_DEPRECATED" },
  { value: 0x00000020, label: "ITEM_FLAG_INDESTRUCTIBLE" },
  { value: 0x00000040, label: "ITEM_FLAG_NO_EQUIP_COOLDOWN" },
  { value: 0x00000080, label: "ITEM_FLAG_NO_USE" },
  { value: 0x00000100, label: "ITEM_FLAG_NO_STACK" },
  { value: 0x00000200, label: "ITEM_FLAG_UNIQUE_EQUIPPED" },
  { value: 0x00000400, label: "ITEM_FLAG_THROWABLE" },
  { value: 0x00000800, label: "ITEM_FLAG_SPECIAL_USE" },
  { value: 0x00001000, label: "ITEM_FLAG_BIND_ON_PICKUP" },
  { value: 0x00002000, label: "ITEM_FLAG_BIND_ON_EQUIP" },
  { value: 0x00004000, label: "ITEM_FLAG_BIND_ON_USE" },
  { value: 0x00008000, label: "ITEM_FLAG_BIND_ON_ACCOUNT" },
  { value: 0x00010000, label: "ITEM_FLAG_NO_SELL" },
  { value: 0x00020000, label: "ITEM_FLAG_NO_REPAIR" },
  { value: 0x00040000, label: "ITEM_FLAG_NO_DISENCHANT" },
  { value: 0x00080000, label: "ITEM_FLAG_NO_AUCTION" },
  { value: 0x00100000, label: "ITEM_FLAG_NO_TRADE" },
  { value: 0x00200000, label: "ITEM_FLAG_NO_VENDOR" },
  { value: 0x00400000, label: "ITEM_FLAG_NO_DESTROY" },
  { value: 0x00800000, label: "ITEM_FLAG_NO_PICKUP" },
  { value: 0x01000000, label: "ITEM_FLAG_NO_DROP" },
  { value: 0x02000000, label: "ITEM_FLAG_NO_USE_IN_ARENA" },
  { value: 0x04000000, label: "ITEM_FLAG_NO_USE_IN_BATTLEGROUND" },
  { value: 0x08000000, label: "ITEM_FLAG_NO_USE_IN_RAID" },
  { value: 0x10000000, label: "ITEM_FLAG_NO_USE_IN_DUNGEON" },
  { value: 0x20000000, label: "ITEM_FLAG_NO_USE_IN_WORLD" },
  { value: 0x40000000, label: "ITEM_FLAG_NO_USE_IN_PVP" },
  { value: 0x80000000, label: "ITEM_FLAG_NO_USE_IN_PVE" },
];

const allowableClasses = [
  { value: 0x00000001, label: "Warrior" },
  { value: 0x00000002, label: "Paladin" },
  { value: 0x00000004, label: "Hunter" },
  { value: 0x00000008, label: "Rogue" },
  { value: 0x00000010, label: "Priest" },
  { value: 0x00000040, label: "Shaman" },
  { value: 0x00000080, label: "Mage" },
  { value: 0x00000100, label: "Warlock" },
  { value: 0x00000400, label: "Druid" },
];

const allowableRaces = [
  { value: 0x00000001, label: "Human", raceId: 1 },
  { value: 0x00000002, label: "Orc", raceId: 2 },
  { value: 0x00000004, label: "Dwarf", raceId: 3 },
  { value: 0x00000008, label: "Night Elf", raceId: 4 },
  { value: 0x00000010, label: "Undead", raceId: 5 },
  { value: 0x00000020, label: "Tauren", raceId: 6 },
  { value: 0x00000040, label: "Gnome", raceId: 7 },
  { value: 0x00000080, label: "Troll", raceId: 8 },
  { value: 0x00000100, label: "Goblin", raceId: 9 },
  { value: 0x00000200, label: "Blood Elf", raceId: 10 },
  { value: 0x00000400, label: "Draenei", raceId: 11 },
  { value: 0x00000800, label: "Fel Orc", raceId: 12 },
  { value: 0x00001000, label: "Naga", raceId: 13 },
  { value: 0x00002000, label: "Broken", raceId: 14 },
  { value: 0x00004000, label: "Skeleton", raceId: 15 },
  { value: 0x00008000, label: "Vrykul", raceId: 16 },
  { value: 0x00010000, label: "Tuskarr", raceId: 17 },
  { value: 0x00020000, label: "Forest Troll", raceId: 18 },
];

export default function CreateItemTemplatePage() {
  const [formData, setFormData] = useState<ItemTemplate>(defaultItemTemplate);
  const [sqlOutput, setSqlOutput] = useState<string>("");
  const [useReplace, setUseReplace] = useState<boolean>(true);
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);
  const [dialogMessage, setDialogMessage] = useState<string>("");

  const updateField = (field: keyof ItemTemplate, value: string | number) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Convert flags bitmask to array of flag values (as strings for Select component)
  const getSelectedFlags = (): string[] => {
    return itemFlags
      .filter((flag) => (formData.Flags & flag.value) !== 0)
      .map((flag) => flag.value.toString());
  };

  // Convert array of flag values (strings) to bitmask
  const setSelectedFlags = (selectedValues: string[] | number[]) => {
    const numericValues = selectedValues.map((v) => (typeof v === "string" ? parseInt(v, 10) : v));
    const newFlags = numericValues.reduce((acc, flagValue) => acc | flagValue, 0);
    updateField("Flags", newFlags);
  };

  // Render function for SelectValue
  const renderFlagValue = (value: string[] | number[]) => {
    if (!value || value.length === 0) {
      return "Select flags…";
    }
    const firstValue = typeof value[0] === "string" ? parseInt(value[0], 10) : value[0];
    const firstFlag = itemFlags.find((flag) => flag.value === firstValue);
    const firstLabel = firstFlag ? firstFlag.label : "";
    const additionalFlags = value.length > 1 ? ` (+${value.length - 1} more)` : "";
    return firstLabel + additionalFlags;
  };

  // Convert AllowableClass bitmask to array of class values (as strings for Select component)
  const getSelectedClasses = (): string[] => {
    if (formData.AllowableClass === -1) return [];
    return allowableClasses
      .filter((cls) => (formData.AllowableClass & cls.value) !== 0)
      .map((cls) => cls.value.toString());
  };

  // Convert array of class values (strings) to bitmask
  const setSelectedClasses = (selectedValues: string[] | number[]) => {
    if (selectedValues.length === 0) {
      updateField("AllowableClass", -1);
      return;
    }
    const numericValues = selectedValues.map((v) => (typeof v === "string" ? parseInt(v, 10) : v));
    const newClasses = numericValues.reduce((acc, classValue) => acc | classValue, 0);
    updateField("AllowableClass", newClasses);
  };

  // Render function for AllowableClass SelectValue
  const renderClassValue = (value: string[] | number[]) => {
    if (!value || value.length === 0) {
      return "Select classes…";
    }
    const firstValue = typeof value[0] === "string" ? parseInt(value[0], 10) : value[0];
    const firstClass = allowableClasses.find((cls) => cls.value === firstValue);
    const firstLabel = firstClass ? firstClass.label : "";
    const additionalClasses = value.length > 1 ? ` (+${value.length - 1} more)` : "";
    return firstLabel + additionalClasses;
  };

  // Convert AllowableRace bitmask to array of race values (as strings for Select component)
  const getSelectedRaces = (): string[] => {
    if (formData.AllowableRace === -1) return [];
    return allowableRaces
      .filter((race) => (formData.AllowableRace & race.value) !== 0)
      .map((race) => race.value.toString());
  };

  // Convert array of race values (strings) to bitmask
  const setSelectedRaces = (selectedValues: string[] | number[]) => {
    if (selectedValues.length === 0) {
      updateField("AllowableRace", -1);
      return;
    }
    const numericValues = selectedValues.map((v) => (typeof v === "string" ? parseInt(v, 10) : v));
    const newRaces = numericValues.reduce((acc, raceValue) => acc | raceValue, 0);
    updateField("AllowableRace", newRaces);
  };

  // Render function for AllowableRace SelectValue
  const renderRaceValue = (value: string[] | number[]) => {
    if (!value || value.length === 0) {
      return "Select races…";
    }
    const firstValue = typeof value[0] === "string" ? parseInt(value[0], 10) : value[0];
    const firstRace = allowableRaces.find((race) => race.value === firstValue);
    const firstLabel = firstRace ? firstRace.label : "";
    const additionalRaces = value.length > 1 ? ` (+${value.length - 1} more)` : "";
    return firstLabel + additionalRaces;
  };

  const escapeSqlString = (str: string): string => {
    if (str === "") return "''";
    return "'" + str.replace(/'/g, "''").replace(/\\/g, "\\\\") + "'";
  };

  const formatSqlValue = (value: number | string): string => {
    if (typeof value === "string") {
      return escapeSqlString(value);
    }
    return value.toString();
  };

  const generateSQL = () => {
    const fields = Object.keys(formData) as Array<keyof ItemTemplate>;
    const values = fields.map((field) => formatSqlValue(formData[field]));

    const sqlType = useReplace ? "REPLACE" : "INSERT";
    const sql = `${sqlType} INTO \`item_template\` (\`${fields.join("`, `")}\`) VALUES (${values.join(", ")});`;

    setSqlOutput(sql);
  };

  const showDialog = (message: string) => {
    setDialogMessage(message);
    setDialogOpen(true);
  };

  const copyToClipboard = async () => {
    if (!sqlOutput) return;

    try {
      // Try modern clipboard API first
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(sqlOutput);
        showDialog("SQL copied to clipboard!");
      } else {
        // Fallback for older browsers or when clipboard API is not available
        const textarea = document.createElement("textarea");
        textarea.value = sqlOutput;
        textarea.style.position = "fixed";
        textarea.style.opacity = "0";
        textarea.style.pointerEvents = "none";
        document.body.appendChild(textarea);
        textarea.select();
        textarea.setSelectionRange(0, sqlOutput.length);
        
        try {
          document.execCommand("copy");
          showDialog("SQL copied to clipboard!");
        } catch (err) {
          console.error("Failed to copy:", err);
          showDialog("Failed to copy to clipboard. Please select and copy manually.");
        } finally {
          document.body.removeChild(textarea);
        }
      }
    } catch (err) {
      console.error("Clipboard error:", err);
      // Fallback method
      const textarea = document.createElement("textarea");
      textarea.value = sqlOutput;
      textarea.style.position = "fixed";
      textarea.style.opacity = "0";
      textarea.style.pointerEvents = "none";
      document.body.appendChild(textarea);
      textarea.select();
      textarea.setSelectionRange(0, sqlOutput.length);
      
      try {
        document.execCommand("copy");
        showDialog("SQL copied to clipboard!");
      } catch (fallbackErr) {
        console.error("Fallback copy failed:", fallbackErr);
        showDialog("Failed to copy to clipboard. Please select and copy manually.");
      } finally {
        document.body.removeChild(textarea);
      }
    }
  };

  const downloadSQL = () => {
    if (sqlOutput) {
      const blob = new Blob([sqlOutput], { type: "text/plain" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `item_template_${formData.entry || "new"}.sql`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  };

  const saveTemplate = () => {
    try {
      const templateJson = JSON.stringify(formData, null, 2);
      const blob = new Blob([templateJson], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `item_template_${formData.entry || "new"}_${formData.name || "template"}.json`.replace(/[^a-z0-9_\-\.]/gi, "_");
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      showDialog("Template saved successfully!");
    } catch (err) {
      console.error("Failed to save template:", err);
      showDialog("Failed to save template. Please try again.");
    }
  };

  const loadTemplate = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".json";
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const content = event.target?.result as string;
          const loadedData = JSON.parse(content) as ItemTemplate;
          
          // Validate that it's a valid ItemTemplate
          if (typeof loadedData === "object" && loadedData !== null) {
            // Merge with default template to ensure all fields are present
            const mergedData = { ...defaultItemTemplate, ...loadedData };
            setFormData(mergedData);
            showDialog("Template loaded successfully!");
          } else {
            throw new Error("Invalid template format");
          }
        } catch (err) {
          console.error("Failed to load template:", err);
          showDialog("Failed to load template. Please ensure the file is a valid template JSON file.");
        }
      };
      reader.readAsText(file);
    };
    input.click();
  };

  return (
    <div className="container mx-auto py-8 px-4 max-w-7xl">
      <div className="mb-6 flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold mb-2">Create Item Template</h1>
          <p className="text-muted-foreground">Create CMANGOS TBC item templates and export as SQL</p>
        </div>
        <ModeToggle />
      </div>

      <div className="mb-4 flex gap-4 items-center flex-wrap">
        <div className="flex gap-2">
          <Button onClick={generateSQL} size="lg">
            Generate SQL
          </Button>
          <Button onClick={saveTemplate} size="lg" variant="outline">
            <Save className="w-4 h-4 mr-2" />
            Save Template
          </Button>
          <Button onClick={loadTemplate} size="lg" variant="outline">
            <Upload className="w-4 h-4 mr-2" />
            Load Template
          </Button>
        </div>
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="useReplace"
            checked={useReplace}
            onChange={(e) => setUseReplace(e.target.checked)}
            className="w-4 h-4"
          />
          <Label htmlFor="useReplace">Use REPLACE instead of INSERT</Label>
        </div>
      </div>

      {sqlOutput && (
        <Card className="mb-6">
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>Generated SQL</CardTitle>
                <CardDescription>Copy or download the SQL statement</CardDescription>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={copyToClipboard}>
                  <Copy className="w-4 h-4 mr-2" />
                  Copy
                </Button>
                <Button variant="outline" size="sm" onClick={downloadSQL}>
                  <Download className="w-4 h-4 mr-2" />
                  Download
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <pre className="bg-muted p-4 rounded-md overflow-x-auto text-sm">
              <code>{sqlOutput}</code>
            </pre>
          </CardContent>
        </Card>
      )}

      <Tabs defaultValue="basic" className="w-full">
        <TabsList className="grid w-full grid-cols-7">
          <TabsTrigger value="basic">Basic Info</TabsTrigger>
          <TabsTrigger value="pricing">Pricing & Requirements</TabsTrigger>
          <TabsTrigger value="stats">Stats</TabsTrigger>
          <TabsTrigger value="damage">Damage</TabsTrigger>
          <TabsTrigger value="resistances">Resistances</TabsTrigger>
          <TabsTrigger value="spells">Spells</TabsTrigger>
          <TabsTrigger value="advanced">Advanced</TabsTrigger>
        </TabsList>

        <TabsContent value="basic" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
              <CardDescription>Core item properties</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="entry">Entry *</Label>
                  <Input
                    id="entry"
                    type="number"
                    value={formData.entry}
                    onChange={(e) => updateField("entry", parseInt(e.target.value) || 0)}
                    min="0"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="name">Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => updateField("name", e.target.value)}
                    placeholder="Item Name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="class">Class</Label>
                  <Select
                    value={formData.class.toString()}
                    onValueChange={(value) => {
                      updateField("class", parseInt(value ?? "") || 0);
                      // Reset subclass when class changes
                      updateField("subclass", 0);
                    }}
                  >
                    <SelectTrigger id="class">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {itemClasses.map((itemClass) => (
                        <SelectItem key={itemClass.value} value={itemClass.value}>
                          {itemClass.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="subclass">Subclass</Label>
                  <Select
                    value={formData.subclass.toString()}
                    onValueChange={(value) => updateField("subclass", parseInt(value ?? "") || 0)}
                    disabled={!itemSubclasses[formData.class.toString()]}
                  >
                    <SelectTrigger id="subclass">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {itemSubclasses[formData.class.toString()]?.map((subclass) => (
                        <SelectItem key={subclass.value} value={subclass.value}>
                          {subclass.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="displayid">Display ID</Label>
                  <Input
                    id="displayid"
                    type="number"
                    value={formData.displayid}
                    onChange={(e) => updateField("displayid", parseInt(e.target.value) || 0)}
                    min="0"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="Quality">Quality</Label>
                  <Select
                    value={formData.Quality.toString()}
                    onValueChange={(value) => updateField("Quality", parseInt(value ?? "") || 0)}
                  >
                    <SelectTrigger id="Quality">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {qualityTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="Flags">Flags</Label>
                  <Select
                    aria-label="Select flags"
                    value={getSelectedFlags()}
                    onValueChange={(value) => {
                      if (Array.isArray(value)) {
                        setSelectedFlags(value);
                      }
                    }}
                    multiple
                  >
                    <SelectTrigger id="Flags">
                      <SelectValue>{renderFlagValue}</SelectValue>
                    </SelectTrigger>
                    <SelectPopup alignItemWithTrigger={false}>
                      {itemFlags.map((flag) => (
                        <SelectItem key={flag.value} value={flag.value.toString()}>
                          {flag.label}
                        </SelectItem>
                      ))}
                    </SelectPopup>
                  </Select>
                  <div className="mt-2">
                    <Label htmlFor="Flags-value" className="text-xs text-muted-foreground">
                      Flags Value: {formData.Flags} (0x{formData.Flags.toString(16).toUpperCase()})
                    </Label>
                    <Input
                      id="Flags-value"
                      type="number"
                      value={formData.Flags}
                      onChange={(e) => updateField("Flags", parseInt(e.target.value) || 0)}
                      min="0"
                      className="mt-1"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="BuyCount">Buy Count</Label>
                  <Input
                    id="BuyCount"
                    type="number"
                    value={formData.BuyCount}
                    onChange={(e) => updateField("BuyCount", parseInt(e.target.value) || 1)}
                    min="1"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="InventoryType">Inventory Type</Label>
                  <Select
                    value={formData.InventoryType.toString()}
                    onValueChange={(value) => updateField("InventoryType", parseInt(value ?? "") || 0)}
                  >
                    <SelectTrigger id="InventoryType">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {inventoryTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="ItemLevel">Item Level</Label>
                  <Input
                    id="ItemLevel"
                    type="number"
                    value={formData.ItemLevel}
                    onChange={(e) => updateField("ItemLevel", parseInt(e.target.value) || 0)}
                    min="0"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="stackable">Stackable</Label>
                  <Input
                    id="stackable"
                    type="number"
                    value={formData.stackable}
                    onChange={(e) => updateField("stackable", parseInt(e.target.value) || 1)}
                    min="1"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="ContainerSlots">Container Slots</Label>
                  <Input
                    id="ContainerSlots"
                    type="number"
                    value={formData.ContainerSlots}
                    onChange={(e) => updateField("ContainerSlots", parseInt(e.target.value) || 0)}
                    min="0"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="unk0">Unk0</Label>
                  <Input
                    id="unk0"
                    type="number"
                    value={formData.unk0}
                    onChange={(e) => updateField("unk0", parseInt(e.target.value) || -1)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="pricing" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Pricing & Requirements</CardTitle>
              <CardDescription>Buy/sell prices and item requirements</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="BuyPrice">Buy Price</Label>
                  <Input
                    id="BuyPrice"
                    type="number"
                    value={formData.BuyPrice}
                    onChange={(e) => updateField("BuyPrice", parseInt(e.target.value) || 0)}
                    min="0"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="SellPrice">Sell Price</Label>
                  <Input
                    id="SellPrice"
                    type="number"
                    value={formData.SellPrice}
                    onChange={(e) => updateField("SellPrice", parseInt(e.target.value) || 0)}
                    min="0"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="RequiredLevel">Required Level</Label>
                  <Input
                    id="RequiredLevel"
                    type="number"
                    value={formData.RequiredLevel}
                    onChange={(e) => updateField("RequiredLevel", parseInt(e.target.value) || 0)}
                    min="0"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="RequiredSkill">Required Skill</Label>
                  <Input
                    id="RequiredSkill"
                    type="number"
                    value={formData.RequiredSkill}
                    onChange={(e) => updateField("RequiredSkill", parseInt(e.target.value) || 0)}
                    min="0"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="RequiredSkillRank">Required Skill Rank</Label>
                  <Input
                    id="RequiredSkillRank"
                    type="number"
                    value={formData.RequiredSkillRank}
                    onChange={(e) => updateField("RequiredSkillRank", parseInt(e.target.value) || 0)}
                    min="0"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="requiredspell">Required Spell</Label>
                  <Input
                    id="requiredspell"
                    type="number"
                    value={formData.requiredspell}
                    onChange={(e) => updateField("requiredspell", parseInt(e.target.value) || 0)}
                    min="0"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="requiredhonorrank">Required Honor Rank</Label>
                  <Input
                    id="requiredhonorrank"
                    type="number"
                    value={formData.requiredhonorrank}
                    onChange={(e) => updateField("requiredhonorrank", parseInt(e.target.value) || 0)}
                    min="0"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="RequiredCityRank">Required City Rank</Label>
                  <Input
                    id="RequiredCityRank"
                    type="number"
                    value={formData.RequiredCityRank}
                    onChange={(e) => updateField("RequiredCityRank", parseInt(e.target.value) || 0)}
                    min="0"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="RequiredReputationFaction">Required Reputation Faction</Label>
                  <Input
                    id="RequiredReputationFaction"
                    type="number"
                    value={formData.RequiredReputationFaction}
                    onChange={(e) => updateField("RequiredReputationFaction", parseInt(e.target.value) || 0)}
                    min="0"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="RequiredReputationRank">Required Reputation Rank</Label>
                  <Select
                    value={formData.RequiredReputationRank.toString()}
                    onValueChange={(value) => updateField("RequiredReputationRank", parseInt(value ?? "") || 0)}
                  >
                    <SelectTrigger id="RequiredReputationRank">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {reputationRanks.map((rank) => (
                        <SelectItem key={rank.value} value={rank.value}>
                          {rank.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="AllowableClass">Allowable Class</Label>
                  <Select
                    aria-label="Select allowable classes"
                    value={getSelectedClasses()}
                    onValueChange={(value) => {
                      if (Array.isArray(value)) {
                        setSelectedClasses(value);
                      }
                    }}
                    multiple
                  >
                    <SelectTrigger id="AllowableClass">
                      <SelectValue>{renderClassValue}</SelectValue>
                    </SelectTrigger>
                    <SelectPopup alignItemWithTrigger={false}>
                      {allowableClasses.map((cls) => (
                        <SelectItem key={cls.value} value={cls.value.toString()}>
                          {cls.label}
                        </SelectItem>
                      ))}
                    </SelectPopup>
                  </Select>
                  <div className="mt-2">
                    <Label htmlFor="AllowableClass-value" className="text-xs text-muted-foreground">
                      AllowableClass Value: {formData.AllowableClass === -1 ? "-1 (All Classes)" : `${formData.AllowableClass} (0x${formData.AllowableClass.toString(16).toUpperCase()})`}
                    </Label>
                    <Input
                      id="AllowableClass-value"
                      type="number"
                      value={formData.AllowableClass}
                      onChange={(e) => updateField("AllowableClass", parseInt(e.target.value) || -1)}
                      className="mt-1"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="AllowableRace">Allowable Race</Label>
                  <Select
                    aria-label="Select allowable races"
                    value={getSelectedRaces()}
                    onValueChange={(value) => {
                      if (Array.isArray(value)) {
                        setSelectedRaces(value);
                      }
                    }}
                    multiple
                  >
                    <SelectTrigger id="AllowableRace">
                      <SelectValue>{renderRaceValue}</SelectValue>
                    </SelectTrigger>
                    <SelectPopup alignItemWithTrigger={false}>
                      {allowableRaces.map((race) => (
                        <SelectItem key={race.value} value={race.value.toString()}>
                          {race.label}
                        </SelectItem>
                      ))}
                    </SelectPopup>
                  </Select>
                  <div className="mt-2">
                    <Label htmlFor="AllowableRace-value" className="text-xs text-muted-foreground">
                      AllowableRace Value: {formData.AllowableRace === -1 ? "-1 (All Races)" : `${formData.AllowableRace} (0x${formData.AllowableRace.toString(16).toUpperCase()})`}
                    </Label>
                    <Input
                      id="AllowableRace-value"
                      type="number"
                      value={formData.AllowableRace}
                      onChange={(e) => updateField("AllowableRace", parseInt(e.target.value) || -1)}
                      className="mt-1"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="maxcount">Max Count</Label>
                  <Input
                    id="maxcount"
                    type="number"
                    value={formData.maxcount}
                    onChange={(e) => updateField("maxcount", parseInt(e.target.value) || 0)}
                    min="0"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="stats" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Item Stats</CardTitle>
              <CardDescription>Stat bonuses (1-10)</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                  <div key={num} className="space-y-2 border p-4 rounded-md">
                    <h4 className="font-semibold">Stat {num}</h4>
                    <div className="space-y-2">
                      <Label htmlFor={`stat_type${num}`}>Stat Type</Label>
                      <Select
                        value={formData[`stat_type${num}` as keyof ItemTemplate].toString()}
                        onValueChange={(value) => updateField(`stat_type${num}` as keyof ItemTemplate, parseInt(value ?? "") || 0)}
                      >
                        <SelectTrigger id={`stat_type${num}`}>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {statTypes.map((statType) => (
                            <SelectItem key={statType.value} value={statType.value}>
                              {statType.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor={`stat_value${num}`}>Stat Value</Label>
                      <Input
                        id={`stat_value${num}`}
                        type="number"
                        value={formData[`stat_value${num}` as keyof ItemTemplate] as number}
                        onChange={(e) => updateField(`stat_value${num}` as keyof ItemTemplate, parseInt(e.target.value) || 0)}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="damage" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Damage</CardTitle>
              <CardDescription>Weapon damage values (1-5)</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="delay">Delay</Label>
                  <Input
                    id="delay"
                    type="number"
                    value={formData.delay}
                    onChange={(e) => updateField("delay", parseInt(e.target.value) || 1000)}
                    min="0"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="ammo_type">Ammo Type</Label>
                  <Input
                    id="ammo_type"
                    type="number"
                    value={formData.ammo_type}
                    onChange={(e) => updateField("ammo_type", parseInt(e.target.value) || 0)}
                    min="0"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="RangedModRange">Ranged Mod Range</Label>
                  <Input
                    id="RangedModRange"
                    type="number"
                    step="0.01"
                    value={formData.RangedModRange}
                    onChange={(e) => updateField("RangedModRange", parseFloat(e.target.value) || 0)}
                    min="0"
                  />
                </div>
              </div>
              <Separator className="my-6" />
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[1, 2, 3, 4, 5].map((num) => (
                  <div key={num} className="space-y-2 border p-4 rounded-md">
                    <h4 className="font-semibold">Damage {num}</h4>
                    <div className="space-y-2">
                      <Label htmlFor={`dmg_min${num}`}>Min Damage</Label>
                      <Input
                        id={`dmg_min${num}`}
                        type="number"
                        step="0.01"
                        value={formData[`dmg_min${num}` as keyof ItemTemplate] as number}
                        onChange={(e) => updateField(`dmg_min${num}` as keyof ItemTemplate, parseFloat(e.target.value) || 0)}
                        min="0"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor={`dmg_max${num}`}>Max Damage</Label>
                      <Input
                        id={`dmg_max${num}`}
                        type="number"
                        step="0.01"
                        value={formData[`dmg_max${num}` as keyof ItemTemplate] as number}
                        onChange={(e) => updateField(`dmg_max${num}` as keyof ItemTemplate, parseFloat(e.target.value) || 0)}
                        min="0"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor={`dmg_type${num}`}>Damage Type</Label>
                      <Select
                        value={formData[`dmg_type${num}` as keyof ItemTemplate].toString()}
                        onValueChange={(value) => updateField(`dmg_type${num}` as keyof ItemTemplate, parseInt(value ?? "") || 0)}
                      >
                        <SelectTrigger id={`dmg_type${num}`}>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {damageTypes.map((damageType) => (
                            <SelectItem key={damageType.value} value={damageType.value}>
                              {damageType.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="resistances" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Resistances & Armor</CardTitle>
              <CardDescription>Resistance values and armor</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="armor">Armor</Label>
                  <Input
                    id="armor"
                    type="number"
                    value={formData.armor}
                    onChange={(e) => updateField("armor", parseInt(e.target.value) || 0)}
                    min="0"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="holy_res">Holy Resistance</Label>
                  <Input
                    id="holy_res"
                    type="number"
                    value={formData.holy_res}
                    onChange={(e) => updateField("holy_res", parseInt(e.target.value) || 0)}
                    min="0"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="fire_res">Fire Resistance</Label>
                  <Input
                    id="fire_res"
                    type="number"
                    value={formData.fire_res}
                    onChange={(e) => updateField("fire_res", parseInt(e.target.value) || 0)}
                    min="0"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="nature_res">Nature Resistance</Label>
                  <Input
                    id="nature_res"
                    type="number"
                    value={formData.nature_res}
                    onChange={(e) => updateField("nature_res", parseInt(e.target.value) || 0)}
                    min="0"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="frost_res">Frost Resistance</Label>
                  <Input
                    id="frost_res"
                    type="number"
                    value={formData.frost_res}
                    onChange={(e) => updateField("frost_res", parseInt(e.target.value) || 0)}
                    min="0"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="shadow_res">Shadow Resistance</Label>
                  <Input
                    id="shadow_res"
                    type="number"
                    value={formData.shadow_res}
                    onChange={(e) => updateField("shadow_res", parseInt(e.target.value) || 0)}
                    min="0"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="arcane_res">Arcane Resistance</Label>
                  <Input
                    id="arcane_res"
                    type="number"
                    value={formData.arcane_res}
                    onChange={(e) => updateField("arcane_res", parseInt(e.target.value) || 0)}
                    min="0"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="spells" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Spells</CardTitle>
              <CardDescription>Item spell effects (1-5)</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[1, 2, 3, 4, 5].map((num) => (
                  <div key={num} className="space-y-4 border p-4 rounded-md">
                    <h4 className="font-semibold text-lg">Spell {num}</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor={`spellid_${num}`}>Spell ID</Label>
                        <Input
                          id={`spellid_${num}`}
                          type="number"
                          value={formData[`spellid_${num}` as keyof ItemTemplate] as number}
                          onChange={(e) => updateField(`spellid_${num}` as keyof ItemTemplate, parseInt(e.target.value) || 0)}
                          min="0"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor={`spelltrigger_${num}`}>Spell Trigger</Label>
                        <Input
                          id={`spelltrigger_${num}`}
                          type="number"
                          value={formData[`spelltrigger_${num}` as keyof ItemTemplate] as number}
                          onChange={(e) => updateField(`spelltrigger_${num}` as keyof ItemTemplate, parseInt(e.target.value) || 0)}
                          min="0"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor={`spellcharges_${num}`}>Spell Charges</Label>
                        <Input
                          id={`spellcharges_${num}`}
                          type="number"
                          value={formData[`spellcharges_${num}` as keyof ItemTemplate] as number}
                          onChange={(e) => updateField(`spellcharges_${num}` as keyof ItemTemplate, parseInt(e.target.value) || 0)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor={`spellppmRate_${num}`}>PPM Rate</Label>
                        <Input
                          id={`spellppmRate_${num}`}
                          type="number"
                          step="0.01"
                          value={formData[`spellppmRate_${num}` as keyof ItemTemplate] as number}
                          onChange={(e) => updateField(`spellppmRate_${num}` as keyof ItemTemplate, parseFloat(e.target.value) || 0)}
                          min="0"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor={`spellcooldown_${num}`}>Spell Cooldown</Label>
                        <Input
                          id={`spellcooldown_${num}`}
                          type="number"
                          value={formData[`spellcooldown_${num}` as keyof ItemTemplate] as number}
                          onChange={(e) => updateField(`spellcooldown_${num}` as keyof ItemTemplate, parseInt(e.target.value) || -1)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor={`spellcategory_${num}`}>Spell Category</Label>
                        <Input
                          id={`spellcategory_${num}`}
                          type="number"
                          value={formData[`spellcategory_${num}` as keyof ItemTemplate] as number}
                          onChange={(e) => updateField(`spellcategory_${num}` as keyof ItemTemplate, parseInt(e.target.value) || 0)}
                          min="0"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor={`spellcategorycooldown_${num}`}>Category Cooldown</Label>
                        <Input
                          id={`spellcategorycooldown_${num}`}
                          type="number"
                          value={formData[`spellcategorycooldown_${num}` as keyof ItemTemplate] as number}
                          onChange={(e) => updateField(`spellcategorycooldown_${num}` as keyof ItemTemplate, parseInt(e.target.value) || -1)}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="advanced" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Advanced Properties</CardTitle>
              <CardDescription>Additional item properties</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="bonding">Bonding</Label>
                    <Input
                      id="bonding"
                      type="number"
                      value={formData.bonding}
                      onChange={(e) => updateField("bonding", parseInt(e.target.value) || 0)}
                      min="0"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="PageText">Page Text</Label>
                    <Input
                      id="PageText"
                      type="number"
                      value={formData.PageText}
                      onChange={(e) => updateField("PageText", parseInt(e.target.value) || 0)}
                      min="0"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="LanguageID">Language ID</Label>
                    <Input
                      id="LanguageID"
                      type="number"
                      value={formData.LanguageID}
                      onChange={(e) => updateField("LanguageID", parseInt(e.target.value) || 0)}
                      min="0"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="PageMaterial">Page Material</Label>
                    <Input
                      id="PageMaterial"
                      type="number"
                      value={formData.PageMaterial}
                      onChange={(e) => updateField("PageMaterial", parseInt(e.target.value) || 0)}
                      min="0"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="startquest">Start Quest</Label>
                    <Input
                      id="startquest"
                      type="number"
                      value={formData.startquest}
                      onChange={(e) => updateField("startquest", parseInt(e.target.value) || 0)}
                      min="0"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lockid">Lock ID</Label>
                    <Input
                      id="lockid"
                      type="number"
                      value={formData.lockid}
                      onChange={(e) => updateField("lockid", parseInt(e.target.value) || 0)}
                      min="0"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="Material">Material</Label>
                    <Input
                      id="Material"
                      type="number"
                      value={formData.Material}
                      onChange={(e) => updateField("Material", parseInt(e.target.value) || 0)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="sheath">Sheath</Label>
                    <Input
                      id="sheath"
                      type="number"
                      value={formData.sheath}
                      onChange={(e) => updateField("sheath", parseInt(e.target.value) || 0)}
                      min="0"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="RandomProperty">Random Property</Label>
                    <Input
                      id="RandomProperty"
                      type="number"
                      value={formData.RandomProperty}
                      onChange={(e) => updateField("RandomProperty", parseInt(e.target.value) || 0)}
                      min="0"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="RandomSuffix">Random Suffix</Label>
                    <Input
                      id="RandomSuffix"
                      type="number"
                      value={formData.RandomSuffix}
                      onChange={(e) => updateField("RandomSuffix", parseInt(e.target.value) || 0)}
                      min="0"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="block">Block</Label>
                    <Input
                      id="block"
                      type="number"
                      value={formData.block}
                      onChange={(e) => updateField("block", parseInt(e.target.value) || 0)}
                      min="0"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="itemset">Item Set</Label>
                    <Input
                      id="itemset"
                      type="number"
                      value={formData.itemset}
                      onChange={(e) => updateField("itemset", parseInt(e.target.value) || 0)}
                      min="0"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="MaxDurability">Max Durability</Label>
                    <Input
                      id="MaxDurability"
                      type="number"
                      value={formData.MaxDurability}
                      onChange={(e) => updateField("MaxDurability", parseInt(e.target.value) || 0)}
                      min="0"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="area">Area</Label>
                    <Input
                      id="area"
                      type="number"
                      value={formData.area}
                      onChange={(e) => updateField("area", parseInt(e.target.value) || 0)}
                      min="0"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="Map">Map</Label>
                    <Input
                      id="Map"
                      type="number"
                      value={formData.Map}
                      onChange={(e) => updateField("Map", parseInt(e.target.value) || 0)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="BagFamily">Bag Family</Label>
                    <Input
                      id="BagFamily"
                      type="number"
                      value={formData.BagFamily}
                      onChange={(e) => updateField("BagFamily", parseInt(e.target.value) || 0)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="TotemCategory">Totem Category</Label>
                    <Input
                      id="TotemCategory"
                      type="number"
                      value={formData.TotemCategory}
                      onChange={(e) => updateField("TotemCategory", parseInt(e.target.value) || 0)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="socketBonus">Socket Bonus</Label>
                    <Input
                      id="socketBonus"
                      type="number"
                      value={formData.socketBonus}
                      onChange={(e) => updateField("socketBonus", parseInt(e.target.value) || 0)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="GemProperties">Gem Properties</Label>
                    <Input
                      id="GemProperties"
                      type="number"
                      value={formData.GemProperties}
                      onChange={(e) => updateField("GemProperties", parseInt(e.target.value) || 0)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="RequiredDisenchantSkill">Required Disenchant Skill</Label>
                    <Input
                      id="RequiredDisenchantSkill"
                      type="number"
                      value={formData.RequiredDisenchantSkill}
                      onChange={(e) => updateField("RequiredDisenchantSkill", parseInt(e.target.value) || -1)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="ArmorDamageModifier">Armor Damage Modifier</Label>
                    <Input
                      id="ArmorDamageModifier"
                      type="number"
                      step="0.01"
                      value={formData.ArmorDamageModifier}
                      onChange={(e) => updateField("ArmorDamageModifier", parseFloat(e.target.value) || 0)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="DisenchantID">Disenchant ID</Label>
                    <Input
                      id="DisenchantID"
                      type="number"
                      value={formData.DisenchantID}
                      onChange={(e) => updateField("DisenchantID", parseInt(e.target.value) || 0)}
                      min="0"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="FoodType">Food Type</Label>
                    <Input
                      id="FoodType"
                      type="number"
                      value={formData.FoodType}
                      onChange={(e) => updateField("FoodType", parseInt(e.target.value) || 0)}
                      min="0"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="minMoneyLoot">Min Money Loot</Label>
                    <Input
                      id="minMoneyLoot"
                      type="number"
                      value={formData.minMoneyLoot}
                      onChange={(e) => updateField("minMoneyLoot", parseInt(e.target.value) || 0)}
                      min="0"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="maxMoneyLoot">Max Money Loot</Label>
                    <Input
                      id="maxMoneyLoot"
                      type="number"
                      value={formData.maxMoneyLoot}
                      onChange={(e) => updateField("maxMoneyLoot", parseInt(e.target.value) || 0)}
                      min="0"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="Duration">Duration</Label>
                    <Input
                      id="Duration"
                      type="number"
                      value={formData.Duration}
                      onChange={(e) => updateField("Duration", parseInt(e.target.value) || 0)}
                      min="0"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="ExtraFlags">Extra Flags</Label>
                    <Input
                      id="ExtraFlags"
                      type="number"
                      value={formData.ExtraFlags}
                      onChange={(e) => updateField("ExtraFlags", parseInt(e.target.value) || 0)}
                      min="0"
                    />
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <h3 className="font-semibold text-lg">Sockets</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {[1, 2, 3].map((num) => (
                      <div key={num} className="space-y-2 border p-4 rounded-md">
                        <h4 className="font-semibold">Socket {num}</h4>
                        <div className="space-y-2">
                          <Label htmlFor={`socketColor_${num}`}>Socket Color</Label>
                          <Input
                            id={`socketColor_${num}`}
                            type="number"
                            value={formData[`socketColor_${num}` as keyof ItemTemplate] as number}
                            onChange={(e) => updateField(`socketColor_${num}` as keyof ItemTemplate, parseInt(e.target.value) || 0)}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor={`socketContent_${num}`}>Socket Content</Label>
                          <Input
                            id={`socketContent_${num}`}
                            type="number"
                            value={formData[`socketContent_${num}` as keyof ItemTemplate] as number}
                            onChange={(e) => updateField(`socketContent_${num}` as keyof ItemTemplate, parseInt(e.target.value) || 0)}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <Separator />

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => updateField("description", e.target.value)}
                    placeholder="Item description"
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="ScriptName">Script Name</Label>
                  <Input
                    id="ScriptName"
                    value={formData.ScriptName}
                    onChange={(e) => updateField("ScriptName", e.target.value)}
                    placeholder="Script name"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Notification</DialogTitle>
            <DialogDescription>{dialogMessage}</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button onClick={() => setDialogOpen(false)}>OK</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

