const listPictures = `
  query {
    listPosts{
      items {
        id
        visibility
        postOwnerId
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

export default listPictures

