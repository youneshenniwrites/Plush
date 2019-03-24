import gql from 'graphql-tag';

const listPosts = gql`
  query listPosts {
    listPosts {
      items {
        id
        name
      }
    }
  }
`

export default listPosts;

