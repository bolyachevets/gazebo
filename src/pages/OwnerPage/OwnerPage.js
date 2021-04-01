import { useParams } from 'react-router-dom'

import MyContextSwitcher from 'layouts/MyContextSwitcher'
import TabNavigation from 'ui/TabNavigation'

function OwnerPage() {
  const { owner } = useParams()
  return (
    <>
      <MyContextSwitcher
        pageName="ownerInternal"
        pageNameCurrentUser="providerInternal"
        activeContext={owner}
      />
      <div className="my-4">
        <TabNavigation
          tabs={[
            { pageName: 'ownerInternal', children: 'Repos' },
            { pageName: 'accountAdmin', children: 'Settings' },
          ]}
        />
      </div>
      <p>SHOW ALL THE REPOS OF {owner}</p>
    </>
  )
}

export default OwnerPage