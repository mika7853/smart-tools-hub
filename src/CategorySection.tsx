import React from 'react';
import { CATEGORIES, TOOLS } from '../data/toolsData';
import { Bot, FileText, Image as ImageIcon, AlignLeft, Calculator, Code2, ArrowRight, Sparkles } from 'lucide-react';

interface CategorySectionProps {
  selectedCategory: string | null;
  onSelectCategory: (categoryId: string | null) => void;
}

export const CategorySection: React.FC<CategorySectionProps> = ({
  selectedCategory,
  onSelectCategory,
}) => {
  const getCategoryIcon = (iconName: string) => {
    switch (iconName) {
      case 'Sparkles':
      case 'Bot':
        return <Bot className="w-6 h-6" />;
      case 'FileText':
        return <FileText className="w-6 h-6" />;
      case 'Image':
      case 'ImageIcon':
        return <ImageIcon className="w-6 h-6" />;
      case 'Type':
      case 'AlignLeft':
        return <AlignLeft className="w-6 h-6" />;
      case 'Calculator':
        return <Calculator className="w-6 h-6" />;
      case 'Code':
      case 'Code2':
        return <Code2 className="w-6 h-6" />;
      default:
        return <Sparkles className="w-6 h-6" />;
    }
  };

  return (
    <section id="categories-section" className="py-12 bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-widest block mb-1">
              Organized Catalog
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-white">
              Featured Categories
            </h2>
          </div>

          {selectedCategory && (
            <button
              onClick={() => onSelectCategory(null)}
              className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer flex items-center gap-1"
            >
              Show All Categories
            </button>
          )}
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            const toolCount = TOOLS.filter((t) => t.category === cat.id).length;

            return (
              <div
                key={cat.id}
                onClick={() => onSelectCategory(isSelected ? null : cat.id)}
                className={`p-5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between space-y-4 group ${
                  isSelected
                    ? 'bg-indigo-600 text-white border-indigo-600 shadow-lg shadow-indigo-500/20 scale-105'
                    : 'bg-gray-50/80 dark:bg-gray-800/80 border-gray-200/80 dark:border-gray-700 hover:border-indigo-400 dark:hover:border-indigo-500 hover:shadow-md'
                }`}
              >
                <div className="space-y-3">
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110 ${
                      isSelected
                        ? 'bg-white/20 text-white'
                        : 'bg-white dark:bg-gray-700 text-indigo-600 dark:text-indigo-400 shadow-xs'
                    }`}
                  >
                    {getCategoryIcon(cat.iconName)}
                  </div>
                  <div>
                    <h3
                      className={`font-bold text-sm ${
                        isSelected ? 'text-white' : 'text-gray-900 dark:text-white'
                      }`}
                    >
                      {cat.name}
                    </h3>
                    <p
                      className={`text-xs line-clamp-2 mt-1 leading-snug ${
                        isSelected ? 'text-indigo-100' : 'text-gray-500 dark:text-gray-400'
                      }`}
                    >
                      {cat.description}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2">
                  <span
                    className={`px-2 py-0.5 text-[10px] font-bold rounded-md uppercase tracking-wider ${
                      isSelected
                        ? 'bg-white/20 text-white'
                        : 'bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-300'
                    }`}
                  >
                    {toolCount} Tools
                  </span>
                  <ArrowRight
                    className={`w-3.5 h-3.5 transition-transform group-hover:translate-x-1 ${
                      isSelected ? 'text-white' : 'text-gray-400'
                    }`}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
