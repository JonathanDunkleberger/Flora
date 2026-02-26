export function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center py-12">
      <div className="w-8 h-8 border-3 border-bloom-200 border-t-bloom-500 rounded-full animate-spin" />
    </div>
  );
}
