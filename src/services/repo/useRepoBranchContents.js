import { useQuery } from '@tanstack/react-query'

import Api from 'shared/api'

// Repo contents hook
function fetchRepoContents({
  provider,
  owner,
  repo,
  branch,
  path,
  filters,
  signal,
}) {
  const query = `
    query BranchContents($name: String!, $repo: String!, $branch: String!, $path: String!, $filters: PathContentsFilters!) {
        owner(username:$name){
        username
        repository(name:$repo){
          branch(name:$branch){
          head {
           pathContents(path: $path, filters: $filters) {
            ... on PathContents {
              results {
                  __typename
                  hits
                  misses
                  partials
                  lines
                  name
                  path
                  percentCovered
              ... on PathContentFile {
                isCriticalFile
              }
              }
            }
            __typename
           }
          }
        }
      }
     }
    }
   `

  return Api.graphql({
    provider,
    query,
    signal,
    variables: {
      name: owner,
      repo,
      branch,
      path,
      filters,
    },
  }).then((res) => {
    return res?.data?.owner?.repository?.branch?.head?.pathContents
  })
}

export function useRepoBranchContents({
  provider,
  owner,
  repo,
  branch,
  path,
  filters,
  ...options
}) {
  return useQuery(
    ['BranchContents', provider, owner, repo, branch, path, filters],
    ({ signal }) =>
      fetchRepoContents({
        provider,
        owner,
        repo,
        branch,
        path,
        filters,
        signal,
      }),
    {
      ...options,
    }
  )
}