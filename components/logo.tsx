interface LogoProps {
  size?: "sm" | "md" | "lg"
  showText?: boolean
}

export function Logo({ size = "md", showText = true }: LogoProps) {
  const sizeClasses = {
    sm: "w-12 h-12",
    md: "w-20 h-20",
    lg: "w-32 h-32",
  }

  const textSizeClasses = {
    sm: "text-lg",
    md: "text-2xl",
    lg: "text-4xl",
  }

  return (
    <div className="flex items-center gap-4">
      <div className="relative">
        {/* Decorative background elements */}
        <div className="absolute -top-2 -left-2 w-8 h-8 bg-green-200 rounded-full opacity-70"></div>
        <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-orange-200 rounded-full opacity-70"></div>
        <div className="absolute top-1 -right-3 w-4 h-8 bg-orange-300 opacity-50 transform rotate-45"></div>

        {/* Logo container */}
        <div
          className={`${sizeClasses[size]} bg-black rounded-lg flex items-center justify-center relative overflow-hidden`}
        >
          {/* Books illustration */}
          <div className="flex items-end gap-1">
            <div className="w-2 h-6 bg-red-500 rounded-t-sm"></div>
            <div className="w-2 h-8 bg-blue-500 rounded-t-sm"></div>
            <div className="w-2 h-5 bg-green-500 rounded-t-sm"></div>
            <div className="w-2 h-7 bg-yellow-500 rounded-t-sm"></div>
            <div className="w-2 h-6 bg-purple-500 rounded-t-sm"></div>
          </div>
        </div>
      </div>

      {showText && <div className={`font-bold text-orange-600 ${textSizeClasses[size]}`}>Tulisify</div>}
    </div>
  )
}
