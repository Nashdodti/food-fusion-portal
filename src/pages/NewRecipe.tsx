
import React from "react";
import { useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft } from "lucide-react";
import { Layout } from "@/components/Layout";
import { RecipeForm } from "@/components/RecipeForm";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { Tables } from "@/integrations/supabase/types";
import { Button } from "@/components/ui/button";

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

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center mb-8">
          <Button variant="ghost" onClick={handleGoBack} className="mr-4">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back
          </Button>
          <h1 className="text-3xl font-bold">Create New Recipe</h1>
        </div>
        <RecipeForm 
          onSubmit={handleSubmit}
          isSubmitting={createRecipe.isPending}
        />
      </div>
    </Layout>
  );
};

export default NewRecipe;
