
import React from "react";
import { Link } from "react-router-dom";
import { Clock } from "lucide-react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Tables } from "@/integrations/supabase/types";

type Recipe = Tables<"recipes">;

interface RecipeCardProps {
  recipe: Recipe;
}

export const RecipeCard = ({ recipe }: RecipeCardProps) => {
  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow">
      <Link to={`/recipes/${recipe.id}`}>
        <div className="aspect-video relative overflow-hidden bg-gray-100">
          {recipe.image_url ? (
            <img 
              src={recipe.image_url} 
              alt={recipe.title} 
              className="object-cover w-full h-full"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">
              No image
            </div>
          )}
          {recipe.category && (
            <span className="absolute top-2 right-2 bg-orange-100 text-orange-800 text-xs px-2 py-1 rounded-full">
              {recipe.category}
            </span>
          )}
        </div>
        <CardContent className="p-4">
          <h3 className="font-semibold text-lg line-clamp-2">{recipe.title}</h3>
          {recipe.description && (
            <p className="text-gray-600 mt-2 text-sm line-clamp-2">{recipe.description}</p>
          )}
        </CardContent>
        <CardFooter className="pt-0 px-4 pb-4 text-sm text-gray-500 flex items-center">
          <Clock className="h-4 w-4 mr-1" />
          <span>{recipe.prep_time + recipe.cook_time} min</span>
          <span className="mx-2">•</span>
          <span>{recipe.servings} servings</span>
        </CardFooter>
      </Link>
    </Card>
  );
};
