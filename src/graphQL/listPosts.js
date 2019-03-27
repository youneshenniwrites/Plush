const listPosts = `
  query {
    listPosts{
      items {
        id
        visibility
        postOwnerId
        postContent
        postOwnerUsername
        file {
          bucket
          region
          key
        }
        likes {
          items {
            id
            likeOwnerId
            likeOwnerUsername
          }
        }
      }
    }
  }
`

export default listPosts

