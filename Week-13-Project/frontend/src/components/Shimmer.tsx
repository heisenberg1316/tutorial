export default function Shimmer() {
  return (
    <div className="animate-pulse px-4 py-6 max-w-6xl mx-auto">
      {/* Header Buttons */}
      <div className="mb-6 -mx-4 sm:mx-0 px-4 sm:px-0">
        <div className="flex gap-4 overflow-x-auto lg:overflow-visible justify-start lg:justify-between items-center">
          <div className="flex gap-3 lg:gap-4">
            <div className="flex-shrink-0 h-10 min-w-[72px] sm:min-w-[88px] lg:w-36 bg-gray-300 rounded-md" aria-hidden />
            <div className="flex-shrink-0 h-10 min-w-[72px] sm:min-w-[88px] lg:w-36 bg-gray-300 rounded-md" aria-hidden />
            <div className="flex-shrink-0 h-10 min-w-[72px] sm:min-w-[88px] lg:w-36 bg-gray-300 rounded-md" aria-hidden />
          </div>
          {/* optional extra controls aligned to right on large screens */}
          <div className="hidden lg:flex gap-3 items-center">
            <div className="h-10 w-10 bg-gray-300 rounded-md" aria-hidden />
            <div className="h-10 w-10 bg-gray-300 rounded-md" aria-hidden />
          </div>
        </div>
      </div>

      {/* Blog cards - single column on mobile, two columns on large screens */}
      <div className="grid grid-cols-1 gap-6">
        {[0, 1, 2].map((_, idx) => (
          <div key={idx} className="border border-gray-200 bg-white rounded-xl p-5 sm:p-6 shadow-sm">
            {/* Title */}
            <div className={idx === 0 ? "h-6 bg-gray-300 rounded w-3/4 lg:w-4/5 mb-4" : "h-6 bg-gray-300 rounded w-1/2 lg:w-3/4 mb-4"} />

            {/* Tags */}
            <div className="flex flex-wrap gap-2 mb-4">
              <div className="h-6 min-w-[56px] sm:min-w-[72px] lg:w-20 bg-gray-300 rounded-full" aria-hidden />
              <div className="h-6 min-w-[72px] sm:min-w-[88px] lg:w-24 bg-gray-300 rounded-full" aria-hidden />
              <div className="h-6 min-w-[48px] sm:min-w-[64px] lg:w-16 bg-gray-300 rounded-full" aria-hidden />
            </div>

            {/* Meta + Actions - stack on mobile, row on desktop */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
              {/* Info */}
              <div className="flex gap-3 text-sm text-gray-400 flex-wrap">
                <div className="h-4 w-20 sm:w-24 lg:w-28 bg-gray-300 rounded" aria-hidden />
                <div className="h-4 w-14 sm:w-16 bg-gray-300 rounded" aria-hidden />
                <div className="h-4 w-14 sm:w-16 bg-gray-300 rounded" aria-hidden />
              </div>

              {/* Buttons */}
              <div className="flex gap-3 mt-2 sm:mt-0">
                <div className="h-8 w-10 sm:w-14 lg:w-16 bg-gray-300 rounded-md" aria-hidden />
                <div className="h-8 w-12 sm:w-16 lg:w-20 bg-red-300 rounded-md" aria-hidden />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Extra large-screen note: add more spacing if needed */}
      <div className="hidden xl:block mt-6">
        <div className="h-2 w-full bg-transparent" />
      </div>
    </div>
  );
}
