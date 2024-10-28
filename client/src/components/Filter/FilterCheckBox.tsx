import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface FilterItem {
  id: string;
  value: string;
}

interface FilterProps {
  items?: FilterItem[];
  title?: string;
  initialVisibleItems?: number;
  onFilterChange: (selectedItems: FilterItem[]) => void;
  checkboxColor?: string;
}

const Filter = ({
  items = [],
  title = "Filter",
  initialVisibleItems = 5,
  onFilterChange,
  checkboxColor = "blue" // Màu mặc định là xanh dương
}: FilterProps) => {
  const [selectedItems, setSelectedItems] = useState<FilterItem[]>([]);
  const [showAll, setShowAll] = useState(false);
  
  const itemsToDisplay = items || [];
  const displayedItems = showAll 
    ? itemsToDisplay 
    : itemsToDisplay.slice(0, initialVisibleItems);
  const hasMoreItems = itemsToDisplay.length > initialVisibleItems;

  // Map các màu thành Tailwind classes
  const colorClasses = {
    main: "data-[state=checked]:bg-main data-[state=checked]:border-main",
    blue: "data-[state=checked]:bg-blue-500 data-[state=checked]:border-blue-500",
    red: "data-[state=checked]:bg-red-500 data-[state=checked]:border-red-500",
    green: "data-[state=checked]:bg-green-500 data-[state=checked]:border-green-500",
    yellow: "data-[state=checked]:bg-yellow-500 data-[state=checked]:border-yellow-500",
    purple: "data-[state=checked]:bg-purple-500 data-[state=checked]:border-purple-500",
    pink: "data-[state=checked]:bg-pink-500 data-[state=checked]:border-pink-500",
  };

  const handleCheckboxChange = (checked: boolean | string, item: FilterItem) => {
    let newSelectedItems: FilterItem[];
    
    if (checked) {
      newSelectedItems = [...selectedItems, item];
    } else {
      newSelectedItems = selectedItems.filter(
        (selectedItem) => selectedItem.id !== item.id
      );
    }
    
    setSelectedItems(newSelectedItems);
    onFilterChange(newSelectedItems);
  };

  if (!items || items.length === 0) {
    return (
      <Card className="w-[300px]">
        <CardContent className="p-4">
          <div className="font-medium mb-4">{title}</div>
          <div className="text-sm text-muted-foreground">Không có dữ liệu</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-[300px]">
      <CardContent className="p-4">
        <div className="font-medium mb-4">{title}</div>
        <ScrollArea className="h-full max-h-[300px] pr-4">
          <div className="space-y-4">
            {displayedItems.map((item) => (
              <div key={item.id} className="flex items-center space-x-2">
                <Checkbox
                  id={item.id}
                  checked={selectedItems.some(
                    (selectedItem) => selectedItem.id === item.id
                  )}
                  onCheckedChange={(checked) =>
                    handleCheckboxChange(checked, item)
                  }
                  className={cn(
                    "border-2",
                    colorClasses[checkboxColor as keyof typeof colorClasses] || colorClasses.main,
                    "focus-visible:ring-offset-2",
                    "hover:border-gray-400"
                  )}
                />
                <label
                  htmlFor={item.id}
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  {item.value}
                </label>
              </div>
            ))}
          </div>
        </ScrollArea>
        
        {hasMoreItems && (
          <Button
            variant="link"
            className="mt-2 p-0 h-auto text-xs"
            onClick={() => setShowAll(!showAll)}
          >
            {showAll ? "Thu gọn" : "Xem thêm"}
          </Button>
        )}
        
        {selectedItems.length > 0 && (
          <div className="mt-4 text-sm text-muted-foreground">
            Đã chọn: {selectedItems.length} mục
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default Filter;