import { Post, User } from "@prisma/client";

const PostCard = ({postData, creator}: {postData : Post, creator: User}) => {
    return(
        <div>
            <h1>Post</h1>
        </div>
    )
}

export default PostCard;