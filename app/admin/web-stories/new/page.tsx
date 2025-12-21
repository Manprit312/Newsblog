import WebStoryForm from '@/components/WebStoryForm';

export default function NewWebStoryPage() {
  return (
    <div className="w-full">
      <h1 className="text-2xl sm:text-3xl font-bold text-emerald-600 dark:text-emerald-400 mb-4 sm:mb-6">
        Create New Web Story
      </h1>
      <WebStoryForm />
    </div>
  );
}





