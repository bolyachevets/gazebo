import PropTypes from 'prop-types'

import { usePlanPageData } from 'pages/PlanPage/hooks'
import { accountDetailsPropType } from 'services/account'
import A from 'ui/A'
import Icon from 'ui/Icon'
import Progress from 'ui/Progress'

// No Need for the new component here
const ActiveUsers = ({ accountDetails }) => (
  <p className="my-4">
    {accountDetails.activatedUserCount ?? 0} of{' '}
    {accountDetails.plan.quantity ?? 0} users
  </p>
)

ActiveUsers.propTypes = {
  accountDetails: accountDetailsPropType.isRequired,
}

function Usage({ accountDetails, isBasicPlan }) {
  const { data: ownerData } = usePlanPageData()
  const uploadsNumber = ownerData?.numberOfUploads
  const maxUploadNumber = 250 //Could possibly move this to a more "global" constant, that way if it ever changes we don't have to scour the frontend to change all occurances.

  const progressAmount = (uploadsNumber * 100) / maxUploadNumber || 0 //sometimes we get null
  const isUsageExceeded = uploadsNumber >= maxUploadNumber

  const color = isUsageExceeded ? 'danger' : 'neutral'

  return (
    <div className="flex flex-col">
      <h2 className="font-semibold">Usage</h2>
      <ActiveUsers accountDetails={accountDetails} />
      {isBasicPlan && (
        <div className="flex flex-col gap-4">
          <p>{uploadsNumber} of 250 uploads - trailing 30 days</p>
          <Progress amount={progressAmount} color={color} />
          {isUsageExceeded && (
            <>
              <div className="flex flex-row gap-1">
                <span className="text-ds-primary-red">
                  <Icon name="exclamation" variant="solid" />{' '}
                </span>
                <p className="font-semibold">usage exceeded upload limit</p>
              </div>
              <p>
                <span className="font-semibold">Tip:</span> upgrade to 6 users
                for unlimited uploads{' '}
                <A to={{ pageName: 'upgradeOrgPlan' }}> upgrade today </A>
              </p>
            </>
          )}
        </div>
      )}
    </div>
  )
}

Usage.propTypes = {
  accountDetails: accountDetailsPropType.isRequired,
  isBasicPlan: PropTypes.bool.isRequired,
}

export default Usage