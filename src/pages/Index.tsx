import React, { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { RecipeCard } from "@/components/RecipeCard";
import { Layout } from "@/components/Layout";
import { supabase } from "@/integrations/supabase/client";
import { Tables } from "@/integrations/supabase/types";
type Recipe = Tables<"recipes">;
const Index = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [category, setCategory] = useState<string | null>(null);
  const [categories, setCategories] = useState<string[]>([]);
  const {
    data: recipes,
    isLoading,
    error
  } = useQuery({
    queryKey: ["recipes"],
    queryFn: async () => {
      const {
        data,
        error
      } = await supabase.from("recipes").select("*").order("created_at", {
        ascending: false
      });
      if (error) {
        throw new Error(error.message);
      }
      return data as Recipe[];
    }
  });
  useEffect(() => {
    if (recipes) {
      const uniqueCategories = Array.from(new Set(recipes.map(recipe => recipe.category).filter((category): category is string => category !== null)));
      setCategories(uniqueCategories);
    }
  }, [recipes]);
  const filteredRecipes = recipes?.filter(recipe => {
    const matchesSearch = recipe.title.toLowerCase().includes(searchTerm.toLowerCase()) || recipe.description && recipe.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !category || recipe.category === category;
    return matchesSearch && matchesCategory;
  });
  return <Layout>
      <div className="mb-8">
        
        
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
            <Input type="search" placeholder="Search recipes..." className="pl-10" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
          </div>
          
          <div className="flex flex-wrap gap-2">
            <Button variant={category === null ? "default" : "outline"} onClick={() => setCategory(null)} className="text-sm">
              All
            </Button>
            {categories.map(cat => <Button key={cat} variant={category === cat ? "default" : "outline"} onClick={() => setCategory(cat)} className="text-sm">
                {cat}
              </Button>)}
          </div>
        </div>
      </div>

      {isLoading ? <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => <div key={i} className="h-64 bg-gray-100 rounded-lg animate-pulse" />)}
        </div> : error ? <div className="text-center py-12">
          <p className="text-red-500">Failed to load recipes</p>
          <p className="text-gray-500 text-sm mt-2">{String(error)}</p>
        </div> : filteredRecipes?.length === 0 ? <div className="text-center py-12">
          <p className="text-gray-500">No recipes found</p>
        </div> : <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredRecipes?.map(recipe => <RecipeCard key={recipe.id} recipe={recipe} />)}
        </div>}
    </Layout>;
};
export default Index;