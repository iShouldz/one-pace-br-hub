import { AlertCircle, CheckCircle2, InfoIcon, SearchAlert } from "lucide-react"

const IconBuilderComponent = ({ type }: { type?: string }) => {
  switch (type) {
    case "success":
      return <CheckCircle2 className="size-5 shrink-0 text-foreground/80" />
    case "warning":
      return <AlertCircle className="size-5 shrink-0 text-foreground/80" />
    case "error-debug":
      return <SearchAlert className="size-5 shrink-0 text-foreground/80" />
    default:
      return <InfoIcon className="size-5 shrink-0 text-foreground/80" />
  }
}

export default IconBuilderComponent
