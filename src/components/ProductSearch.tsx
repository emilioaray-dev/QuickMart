import { Search, X } from "lucide-react";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useLanguage } from "@/contexts/LanguageContext";
import { translateCategory } from "@/utils/translateCategory";

interface ProductSearchProps {
  onSearchChange: (query: string) => void;
  onCategoryChange: (category: string) => void;
  categories: string[];
}

export const ProductSearch = ({
  onSearchChange,
  onCategoryChange,
  categories,
}: ProductSearchProps) => {
  const { t } = useLanguage();
  const [search, setSearch] = useState("");

  const handleSearchChange = (value: string) => {
    setSearch(value);
    onSearchChange(value);
  };

  const clearSearch = () => {
    setSearch("");
    onSearchChange("");
  };

  return (
    <div className="flex gap-3 mb-6">
      <div className="flex-1 relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-primary" />
        <Input
          type="text"
          placeholder={t.searchPlaceholder}
          value={search}
          onChange={(e) => handleSearchChange(e.target.value)}
          className="pl-12 pr-12 h-12 text-base border-2 border-border focus:border-primary shadow-sm"
        />
        {search && (
          <button
            onClick={clearSearch}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-destructive transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </div>
      <Select onValueChange={onCategoryChange} defaultValue="all">
        <SelectTrigger className="w-[200px] h-12 border-2 border-border shadow-sm font-semibold">
          <SelectValue placeholder={t.categoryPlaceholder} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all" className="font-semibold">
            {t.allCategories}
          </SelectItem>
          {categories.map((category) => (
            <SelectItem key={category} value={category} className="font-medium">
              {translateCategory(category, t)}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};
