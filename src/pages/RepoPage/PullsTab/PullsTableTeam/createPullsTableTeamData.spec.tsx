import TotalsNumber from 'ui/TotalsNumber'

import { createPullsTableTeamData } from './createPullsTableTeamData'

import Title from '../shared/Title'

describe('createPullsTableTeamData', () => {
  describe('pages is undefined', () => {
    it('returns an empty array', () => {
      const result = createPullsTableTeamData({})

      expect(result).toStrictEqual([])
    })
  })

  describe('pages is an empty array', () => {
    it('returns an empty array', () => {
      const result = createPullsTableTeamData({ pages: [] })

      expect(result).toStrictEqual([])
    })
  })

  describe('pulls in pages is empty', () => {
    it('returns an empty array', () => {
      const result = createPullsTableTeamData({
        pages: [{ pulls: [] }, { pulls: [] }],
      })

      expect(result).toStrictEqual([])
    })
  })

  describe('pages has valid pulls', () => {
    describe('compareWithBase __typename is not Comparison', () => {
      it('returns dash', () => {
        const pullData = {
          author: null,
          pullId: 123,
          state: 'OPEN',
          updatestamp: null,
          title: null,
          compareWithBase: {
            __typename: 'MissingBaseCommit',
            message: 'Missing base commit',
          },
          head: {
            bundleAnalysisReport: {
              __typename: 'MissingHeadReport',
            },
          },
        } as const

        const result = createPullsTableTeamData({
          pages: [{ pulls: [pullData] }],
        })

        expect(result[0]?.patch).toStrictEqual(<p className="text-right">-</p>)
      })
    })

    describe('compareWithBase __typename is Comparison', () => {
      it('returns with patch value', () => {
        const pullData = {
          author: null,
          pullId: 123,
          state: 'OPEN',
          updatestamp: null,
          title: null,
          compareWithBase: {
            __typename: 'Comparison',
            patchTotals: {
              percentCovered: 100,
            },
          },
          head: {
            bundleAnalysisReport: {
              __typename: 'MissingHeadReport',
            },
          },
        } as const

        const result = createPullsTableTeamData({
          pages: [{ pulls: [pullData] }],
        })

        expect(result[0]?.patch).toStrictEqual(
          <TotalsNumber
            large={false}
            light={false}
            plain={true}
            showChange={false}
            value={100}
          />
        )
      })

      describe('percent covered is null', () => {
        it('returns patch total of 0', () => {
          const pullData = {
            author: null,
            pullId: 123,
            state: 'OPEN',
            updatestamp: null,
            title: null,
            compareWithBase: {
              __typename: 'Comparison',
              patchTotals: {
                percentCovered: null,
              },
            },
            head: {
              bundleAnalysisReport: {
                __typename: 'MissingHeadReport',
              },
            },
          } as const

          const result = createPullsTableTeamData({
            pages: [{ pulls: [pullData] }],
          })

          expect(result[0]?.patch).toStrictEqual(
            <TotalsNumber
              large={false}
              light={false}
              plain={true}
              showChange={false}
              value={0}
            />
          )
        })
      })
    })

    describe('bundleAnalysisReport __typename is not BundleAnalysisReport', () => {
      it('returns x emoji', () => {
        const pullData = {
          author: null,
          pullId: 123,
          state: 'OPEN',
          updatestamp: null,
          title: null,
          compareWithBase: {
            __typename: 'Comparison',
            patchTotals: {
              percentCovered: 100,
            },
          },
          head: {
            bundleAnalysisReport: {
              __typename: 'MissingHeadReport',
            },
          },
        } as const

        const result = createPullsTableTeamData({
          pages: [{ pulls: [pullData] }],
        })

        expect(result[0]?.bundleAnalysis).toStrictEqual(<>Upload: ❌</>)
      })
    })

    describe('bundleAnalysisReport __typename is BundleAnalysisReport', () => {
      it('returns checkmark emoji', () => {
        const pullData = {
          author: null,
          pullId: 123,
          state: 'OPEN',
          updatestamp: null,
          title: null,
          compareWithBase: {
            __typename: 'Comparison',
            patchTotals: {
              percentCovered: 100,
            },
          },
          head: {
            bundleAnalysisReport: {
              __typename: 'BundleAnalysisReport',
            },
          },
        } as const

        const result = createPullsTableTeamData({
          pages: [{ pulls: [pullData] }],
        })

        expect(result[0]?.bundleAnalysis).toStrictEqual(<>Upload: ✅</>)
      })
    })

    describe('pull details are all non-null values', () => {
      it('returns the title component', () => {
        const pullData = {
          author: {
            username: 'cool-user',
            avatarUrl: 'http://127.0.0.1/avatar-url',
          },
          pullId: 123,
          state: 'OPEN',
          updatestamp: '2023-04-25T15:38:48.046832',
          title: 'super cool pull request',
          compareWithBase: {
            __typename: 'MissingBaseCommit',
            message: 'Missing base commit',
          },
          head: {
            bundleAnalysisReport: {
              __typename: 'MissingHeadReport',
            },
          },
        } as const

        const result = createPullsTableTeamData({
          pages: [{ pulls: [pullData] }],
        })

        expect(result[0]?.title).toStrictEqual(
          <Title
            author={{
              avatarUrl: 'http://127.0.0.1/avatar-url',
              username: 'cool-user',
            }}
            compareWithBaseType="MissingBaseCommit"
            pullId={123}
            title="super cool pull request"
            updatestamp="2023-04-25T15:38:48.046832"
          />
        )
      })
    })
  })
})
