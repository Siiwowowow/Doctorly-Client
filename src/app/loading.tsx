export default function GlobalLoading() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/80 backdrop-blur-sm">
      <div className="flex flex-col items-center gap-4">
        <div className="relative">
          {/* Outer ring */}
          <div className="w-12 h-12 rounded-full border-4 border-gray-200"></div>
          {/* Spinning inner ring */}
          <div className="absolute top-0 left-0 w-12 h-12 rounded-full border-4 border-t-blue-500 border-r-transparent border-b-transparent border-l-transparent animate-spin"></div>
        </div>
        <p className="text-gray-600 font-medium animate-pulse">Loading...</p>
      </div>
    </div>
  );
}