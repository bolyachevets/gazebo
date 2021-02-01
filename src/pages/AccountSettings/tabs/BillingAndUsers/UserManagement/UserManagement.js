import PropTypes from 'prop-types'
import { useForm } from 'react-hook-form'
import find from 'lodash/find'
import formatDistance from 'date-fns/formatDistance'
import parseISO from 'date-fns/parseISO'

import { FormSelect } from './UserFormSelect'
import { useLocationParams, ApiFilterEnum } from 'services/navigation'

import Card from 'ui/Card'
import User from 'ui/User'
import Button from 'ui/Button'
import Pagination from 'ui/Pagination'
import Select from 'ui/Select'

import { useUsers, useUpdateUser } from 'services/users'
import { getOwnerImg } from 'shared/utils'

const OrderingItems = [
  { label: 'Sort by Name ⬆', value: 'name' },
  { label: 'Sort by Name ⬇', value: '-name' },
  { label: 'Sort by Username ⬆', value: 'username' },
  { label: 'Sort by Username ⬇', value: '-username' },
  { label: 'Sort by Email ⬆', value: 'email' },
  { label: 'Sort by Email ⬇', value: '-email' },
]

const AdminItems = [
  { label: 'Filter By Admin', value: ApiFilterEnum.none },
  { label: 'Is Admin', value: ApiFilterEnum.true },
  { label: 'Not Admin', value: ApiFilterEnum.false },
]

const ActivatedItems = [
  { label: 'Filter By Activated Users', value: ApiFilterEnum.none },
  { label: 'activated', value: ApiFilterEnum.true },
  { label: 'deactivated', value: ApiFilterEnum.false },
]

function useActivateUser({ provider, owner, query }) {
  const { mutate, ...rest } = useUpdateUser({
    provider,
    owner,
    params: query,
  })

  function activate(user, activated) {
    return mutate({ targetUser: user, activated })
  }

  return { activate, ...rest }
}

function DateItem({ date, label, testId }) {
  const compare = parseISO(date)
  const today = new Date()
  return (
    <div className="flex flex-col text-sm">
      <span className="font-bold">{label}</span>
      <span data-testid={testId}>
        {date ? formatDistance(compare, today, 'MM/dd/yyyy') : 'never'}
      </span>
    </div>
  )
}

DateItem.propTypes = {
  date: PropTypes.string,
  label: PropTypes.string.isRequired,
  testId: PropTypes.string.isRequired,
}

function createPills({ isAdmin, email, student }) {
  return [
    isAdmin && { label: 'Admin', highlight: true },
    email,
    student && 'Student',
  ]
}

function UserManagement({ provider, owner }) {
  const { params, updateParams } = useLocationParams({
    activated: '',
    isAdmin: '',
    ordering: 'name',
    search: '',
  })
  const { register, handleSubmit, control } = useForm({
    defaultValues: {
      search: params.search,
      activated: ActivatedItems[0],
      isAdmin: AdminItems[0],
      ordering: OrderingItems[0],
      page: 1,
      pageSize: 1,
    },
  })

  // Take location params and query the api
  const { data, isSuccess, isFetching } = useUsers({
    provider,
    owner,
    query: params,
  })
  const { activate } = useActivateUser({ owner, provider, query: params })

  function updateQuery(data) {
    updateParams(data)
  }

  return (
    <form className="space-y-4 col-span-2" onSubmit={handleSubmit(updateQuery)}>
      <Card className="shadow flex flex-wrap divide-x divide-gray-200 divide-solid">
        <FormSelect
          control={control}
          name="activated"
          items={ActivatedItems}
          selected={find(
            ActivatedItems,
            ({ value }) => value === params?.activated
          )}
          handleOnChange={({ value }, name) => {
            updateQuery({ [name]: value })
          }}
        />
        <FormSelect
          control={control}
          name="isAdmin"
          items={AdminItems}
          selected={find(AdminItems, ({ value }) => value === params?.isAdmin)}
          handleOnChange={({ value }, name) => {
            updateQuery({ [name]: value })
          }}
        />
        <FormSelect
          control={control}
          name="ordering"
          items={OrderingItems}
          selected={find(
            OrderingItems,
            ({ value }) => value === params?.ordering
          )}
          handleOnChange={({ value }, name) => {
            updateQuery({ [name]: value })
          }}
        />
        <input
          aria-label="search users"
          className="flex-2 px-2 py-3 rounded w-full md:w-auto"
          name="search"
          ref={register}
          placeholder="Search"
          onChange={(event) => updateQuery({ search: event.target.value })}
        />
        {isFetching && <p>Fetching</p>}
        <input
          className="block md:hidden sr:block bg-gray-100 flex-2 px-2 py-3 rounded w-full"
          type="submit"
          value="Submit"
        />
      </Card>
      <Card className="shadow divide-y divide-gray-200 divide-solid p-4">
        <div className="pb-4">
          <h2>User List</h2>
          {isSuccess &&
            data?.results?.map((user) => (
              <div key={user.username} className="p-2 grid grid-cols-5 gap-4">
                <User
                  className="col-span-2"
                  username={user.username}
                  name={user.name}
                  avatarUrl={getOwnerImg(provider, user.username)}
                  pills={createPills(user)}
                />
                <DateItem
                  testId="last-seen"
                  label="Last seen:"
                  date={user.lastseen}
                />
                <DateItem
                  testId="last-pr"
                  label="Last pr:"
                  date={user.latestPrivatePrDate}
                />
                <div>
                  <Button
                    className="w-full"
                    color={user.activated ? 'red' : 'blue'}
                    variant={user.activated ? 'outline' : 'normal'}
                    onClick={() => activate(user.username, !user.activated)}
                  >
                    {user.activated ? 'Deactivate' : 'Activate'}
                  </Button>
                </div>
              </div>
            ))}
        </div>
        <div className="flex">
          <Pagination
            ref={register}
            onPageChange={(page) => updateQuery({ page })}
            pointer={params.page}
            totalPages={data.totalPages}
            next={data.next}
            previous={data.previous}
          />
          <Select
            ref={register}
            onChange={(data) => updateQuery({ pageSize: data })}
            items={['Page Size:', 1, 5, 10, 25, 50]}
          />
        </div>
      </Card>
    </form>
  )
}

UserManagement.propTypes = {
  provider: PropTypes.string.isRequired,
  owner: PropTypes.string.isRequired,
}

export default UserManagement
