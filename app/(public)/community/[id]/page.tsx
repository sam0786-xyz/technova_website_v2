import { getPost } from "@/lib/actions/community";
import { CommentSection } from "@/components/community/CommentSection";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Clock } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { Separator } from "@/components/ui/separator";

import { auth } from "@/lib/auth";
import { DeletePostButton } from "@/components/community/DeleteButtons";

export default async function PostDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const post = await getPost(id);
    const session = await auth();
    const userId = session?.user?.id;

    if (!post) {
        notFound();
    }

    return (
        <div className="container py-8 max-w-4xl">
            <div className="mb-6">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                        <Avatar className="h-10 w-10">
                            <AvatarImage src={post.users?.image || ""} />
                            <AvatarFallback>{post.users?.name?.[0] || "?"}</AvatarFallback>
                        </Avatar>
                        <div>
                            <div className="font-medium text-lg">{post.users?.name || "Anonymous"}</div>
                            <div className="text-sm text-muted-foreground flex items-center">
                                <Clock className="w-3 h-3 mr-1" />
                                {formatDistanceToNow(new Date(post.created_at), { addSuffix: true })}
                            </div>
                        </div>
                    </div>
                    {userId && post.user_id === userId && (
                        <DeletePostButton postId={post.id} />
                    )}
                </div>

                <h1 className="text-3xl font-bold mb-3">{post.title}</h1>
                {post.category && (
                    <Badge variant="outline" className="mb-4">{post.category}</Badge>
                )}

                <div className="prose dark:prose-invert max-w-none text-foreground/90 whitespace-pre-wrap">
                    {post.content}
                </div>
            </div>

            <Separator className="my-8" />

            <CommentSection postId={post.id} comments={post.community_comments || []} userId={userId} />
        </div>
    );
}
