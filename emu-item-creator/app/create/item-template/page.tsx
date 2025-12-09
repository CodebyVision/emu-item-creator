"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ItemTemplate, defaultItemTemplate } from "@/lib/types/item-template";
import { Copy, Download } from "lucide-react";

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

  return (
    <div className="container mx-auto py-8 px-4 max-w-7xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Create Item Template</h1>
        <p className="text-muted-foreground">Create CMANGOS TBC item templates and export as SQL</p>
      </div>

      <div className="mb-4 flex gap-4 items-center">
        <Button onClick={generateSQL} size="lg">
          Generate SQL
        </Button>
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
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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
                  <Input
                    id="class"
                    type="number"
                    value={formData.class}
                    onChange={(e) => updateField("class", parseInt(e.target.value) || 0)}
                    min="0"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="subclass">Subclass</Label>
                  <Input
                    id="subclass"
                    type="number"
                    value={formData.subclass}
                    onChange={(e) => updateField("subclass", parseInt(e.target.value) || 0)}
                    min="0"
                  />
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
                    onValueChange={(value) => updateField("Quality", parseInt(value) || 0)}
                  >
                    <SelectTrigger id="Quality">
                      <SelectValue placeholder="Select quality" />
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
                  <Input
                    id="Flags"
                    type="number"
                    value={formData.Flags}
                    onChange={(e) => updateField("Flags", parseInt(e.target.value) || 0)}
                    min="0"
                  />
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
                    onValueChange={(value) => updateField("InventoryType", parseInt(value) || 0)}
                  >
                    <SelectTrigger id="InventoryType">
                      <SelectValue placeholder="Select inventory type" />
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
                  <Input
                    id="RequiredReputationRank"
                    type="number"
                    value={formData.RequiredReputationRank}
                    onChange={(e) => updateField("RequiredReputationRank", parseInt(e.target.value) || 0)}
                    min="0"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="AllowableClass">Allowable Class</Label>
                  <Input
                    id="AllowableClass"
                    type="number"
                    value={formData.AllowableClass}
                    onChange={(e) => updateField("AllowableClass", parseInt(e.target.value) || -1)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="AllowableRace">Allowable Race</Label>
                  <Input
                    id="AllowableRace"
                    type="number"
                    value={formData.AllowableRace}
                    onChange={(e) => updateField("AllowableRace", parseInt(e.target.value) || -1)}
                  />
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
                      <Input
                        id={`stat_type${num}`}
                        type="number"
                        value={formData[`stat_type${num}` as keyof ItemTemplate] as number}
                        onChange={(e) => updateField(`stat_type${num}` as keyof ItemTemplate, parseInt(e.target.value) || 0)}
                        min="0"
                      />
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
                      <Input
                        id={`dmg_type${num}`}
                        type="number"
                        value={formData[`dmg_type${num}` as keyof ItemTemplate] as number}
                        onChange={(e) => updateField(`dmg_type${num}` as keyof ItemTemplate, parseInt(e.target.value) || 0)}
                        min="0"
                      />
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

