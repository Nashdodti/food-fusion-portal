import React from "react";
import { Link } from "react-router-dom";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
interface LayoutProps {
  children: React.ReactNode;
}
export const Layout = ({
  children
}: LayoutProps) => {
  return <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/" className="text-2xl font-bold text-orange-600">FoodFusion</Link>
          <div className="flex items-center gap-4">
            <div className="relative max-w-sm">
              
              
            </div>
            <Link to="/recipes/new" className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-md text-sm font-medium">
              Add Recipe
            </Link>
          </div>
        </div>
      </header>
      <main className="container mx-auto px-4 py-8">
        {children}
      </main>
      <footer className="bg-white border-t mt-auto">
        <div className="container mx-auto px-4 py-6 text-center text-gray-500">
          <p>© {new Date().getFullYear()} FoodFusion. All rights reserved.</p>
        </div>
      </footer>
    </div>;
};