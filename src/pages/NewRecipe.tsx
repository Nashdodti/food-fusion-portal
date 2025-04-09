
import React from "react";
import { useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Layout } from "@/components/Layout";
import { RecipeForm } from "@/components/RecipeForm";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { Tables } from "@/integrations/supabase/types";

// Define Recipe and RecipeInsert types directly based on Tables
type Recipe = Tables<"recipes">;
type RecipeInsert = Omit<Recipe, "id" | "created_at" | "updated_at">;

const NewRecipe = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const createRecipe = useMutation({
    mutationFn: async (recipe: RecipeInsert) => {
      const { data, error } = await supabase
        .from("recipes")
        .insert([recipe])
        .select()
        .single();
      
      if (error) {
        throw new Error(error.message);
      }
      
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["recipes"] });
      toast({
        title: "Success",
        description: "Recipe created successfully",
      });
      navigate(`/recipes/${data.id}`);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to create recipe: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  const handleSubmit = async (data: RecipeInsert) => {
    await createRecipe.mutateAsync(data);
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Create New Recipe</h1>
        <RecipeForm 
          onSubmit={handleSubmit}
          isSubmitting={createRecipe.isPending}
        />
      </div>
    </Layout>
  );
};

export default NewRecipe;
