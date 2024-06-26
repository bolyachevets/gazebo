import isArray from 'lodash/isArray'
import isEmpty from 'lodash/isEmpty'

import { Commit } from 'services/commits/useCommits'
import TotalsNumber from 'ui/TotalsNumber'

import CIStatus from '../shared/CIStatus'
import Title from '../shared/Title'

export const createCommitsTableData = ({
  pages,
}: {
  pages?: Array<{ commits: Array<Commit | null> }>
}) => {
  if (!isArray(pages)) {
    return []
  }

  const commits = pages?.map((page) => page?.commits).flat()

  if (isEmpty(commits)) {
    return []
  }

  return commits.filter(Boolean).map((commit) => {
    let patchPercentage = NaN
    let patch = <p className="text-right">-</p>
    if (commit?.compareWithParent?.__typename === 'Comparison') {
      patchPercentage =
        commit?.compareWithParent?.patchTotals?.percentCovered ?? 0
      patch = (
        <TotalsNumber
          plain={true}
          large={false}
          light={false}
          value={patchPercentage}
          showChange={false}
        />
      )
    }

    const totals = commit?.totals
    let coverage = <p className="text-right">-</p>
    if (typeof totals?.coverage === 'number') {
      coverage = <TotalsNumber value={totals?.coverage} plain />
    }

    let change = null
    if (commit?.parent?.totals?.coverage != null && totals?.coverage != null) {
      change = totals?.coverage - commit?.parent?.totals?.coverage
    }

    let bundleAnalysis = undefined
    if (commit?.bundleAnalysisReport?.__typename === 'BundleAnalysisReport') {
      // this hex code is for ✅
      bundleAnalysis = <>Upload: &#x2705;</>
    } else {
      // this hex code is for ❌
      bundleAnalysis = <>Upload: &#x274C;</>
    }

    return {
      name: (
        <Title
          message={commit?.message}
          author={commit?.author}
          commitid={commit?.commitid}
          createdAt={commit?.createdAt}
        />
      ),
      coverage,
      ciStatus: (
        <CIStatus
          ciPassed={commit?.ciPassed}
          commitid={commit?.commitid}
          coverage={patchPercentage}
        />
      ),
      patch,
      change: (
        <TotalsNumber
          value={change}
          showChange
          plain={false}
          light={false}
          large={false}
        />
      ),
      bundleAnalysis,
    }
  })
}
