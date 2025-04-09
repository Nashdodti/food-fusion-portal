import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft } from "lucide-react";
import { Layout } from "@/components/Layout";
import { RecipeForm } from "@/components/RecipeForm";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { Tables } from "@/integrations/supabase/types";
import { Button } from "@/components/ui/button";

// Define Recipe and RecipeUpdate types directly based on Tables
type Recipe = Tables<"recipes">;
type RecipeUpdate = Partial<Omit<Recipe, "id" | "created_at" | "updated_at">>;

const EditRecipe = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: recipe, isLoading, error } = useQuery({
    queryKey: ["recipe", id],
    queryFn: async () => {
      if (!id) throw new Error("Recipe ID is required");
      
      const { data, error } = await supabase
        .from("recipes")
        .select("*")
        .eq("id", id)
        .single();
      
      if (error) {
        throw new Error(error.message);
      }
      
      return data as Recipe;
    },
    enabled: !!id,
  });

  const updateRecipe = useMutation({
    mutationFn: async (recipe: RecipeUpdate) => {
      if (!id) throw new Error("Recipe ID is required");
      
      const { data, error } = await supabase
        .from("recipes")
        .update(recipe)
        .eq("id", id)
        .select()
        .single();
      
      if (error) {
        throw new Error(error.message);
      }
      
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["recipe", id] });
      queryClient.invalidateQueries({ queryKey: ["recipes"] });
      toast({
        title: "Success",
        description: "Recipe updated successfully",
      });
      navigate(`/recipes/${data.id}`);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to update recipe: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  const handleSubmit = async (data: RecipeUpdate) => {
    await updateRecipe.mutateAsync(data);
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center mb-8">
            <Button variant="ghost" onClick={handleGoBack} className="mr-4">
              <ArrowLeft className="mr-2 h-4 w-4" /> Back
            </Button>
            <h1 className="text-3xl font-bold mb-8">Edit Recipe</h1>
          </div>
          <div className="animate-pulse space-y-6">
            <div className="h-10 bg-gray-200 rounded w-1/2" />
            <div className="h-10 bg-gray-200 rounded" />
            <div className="h-10 bg-gray-200 rounded" />
          </div>
        </div>
      </Layout>
    );
  }

  if (error || !recipe) {
    return (
      <Layout>
        <div className="max-w-4xl mx-auto text-center py-12">
          <Button variant="ghost" onClick={handleGoBack} className="mb-4">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back
          </Button>
          <p className="text-red-500">Failed to load recipe</p>
          <p className="text-gray-500 text-sm mt-2">{String(error)}</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center mb-8">
          <Button variant="ghost" onClick={handleGoBack} className="mr-4">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back
          </Button>
          <h1 className="text-3xl font-bold">Edit Recipe</h1>
        </div>
        <RecipeForm 
          initialData={recipe}
          onSubmit={handleSubmit}
          isSubmitting={updateRecipe.isPending}
        />
      </div>
    </Layout>
  );
};

export default EditRecipe;
