const listPictures = `
  query {
    listPictures{
      items {
        id
        visibility
        pictureOwnerId
        pictureOwnerUsername
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

