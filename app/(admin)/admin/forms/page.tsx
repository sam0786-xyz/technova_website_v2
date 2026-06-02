import { getForms } from "@/lib/actions/forms"
import { FormsPageClient } from "./forms-page-client"

export default async function FormsAdminPage() {
    const forms = await getForms()
    return <FormsPageClient forms={forms} />
}
