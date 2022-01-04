import { usePulls } from 'services/pulls'
import PullsTable from './PullsTable'
import { useParams } from 'react-router'

function PullsPage() {
  const { provider, owner, repo } = useParams()
  const { data: pulls } = usePulls({ provider, owner, repo })

  return (
    <div className="flex-1 overflow-y-auto">
      <PullsTable pulls={pulls} />
    </div>
  )
}

export default PullsPage