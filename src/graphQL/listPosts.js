const listPosts = `
  query {
    listPosts{
      items {
        id
        postOwnerId
        postContent
        postOwnerUsername
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

