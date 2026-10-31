import { Badge } from "@/components/dashboard/ui";

export function PostStatus({ status, publishedAt }: { status: string; publishedAt: Date | null }) {
    if (status === "draft") return <Badge>Brouillon</Badge>;
    if (publishedAt && publishedAt > new Date()) return <Badge tone="warn">Programmé</Badge>;
    return <Badge tone="lime">Publié</Badge>;
}
