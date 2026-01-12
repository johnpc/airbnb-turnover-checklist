import { Github, Mail } from 'lucide-react'

export function Footer() {
  return (
    <footer className="bg-gray-100 border-t mt-8">
      <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-6">
        <div className="flex flex-col items-center gap-3 text-sm text-muted-foreground">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4">
            <a
              href="https://github.com/johnpc/airbnb-turnover-checklist"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 hover:text-purple-600 transition-colors"
            >
              <Github className="h-4 w-4" />
              <span>View on GitHub</span>
            </a>
            <span className="hidden sm:inline">•</span>
            <a
              href="mailto:john@johncorser.com"
              className="flex items-center gap-2 hover:text-purple-600 transition-colors"
            >
              <Mail className="h-4 w-4" />
              <span>john@johncorser.com</span>
            </a>
          </div>
          <p className="text-xs">Made with ❤️ in Ann Arbor, MI</p>
        </div>
      </div>
    </footer>
  )
}
