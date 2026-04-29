export default function SkeletonLoader() {
  return (
    <div className="flex gap-3 px-4 py-5 animate-pulse">
      <div className="w-8 h-8 rounded-full bg-gray-700 flex-shrink-0 mt-0.5" />
      <div className="flex-1 space-y-2 pt-1">
        <div className="h-3 bg-gray-700 rounded-full w-3/4" />
        <div className="h-3 bg-gray-700 rounded-full w-full" />
        <div className="h-3 bg-gray-700 rounded-full w-5/6" />
        <div className="h-3 bg-gray-700 rounded-full w-2/3" />
      </div>
    </div>
  )
}
