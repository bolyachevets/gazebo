import PropTypes from 'prop-types'
import find from 'lodash/find'
import { Controller } from 'react-hook-form'

import Select from 'ui/Select'
import TextInput from 'ui/TextInput'
import ControlGroup from 'ui/ControlGroup'

import { ApiFilterEnum } from 'services/navigation'

import Card from 'ui/Card'
import Icon from 'ui/Icon'

const OrderingItems = [
  { label: 'Name A-Z', value: 'name' },
  { label: 'Name Z-A', value: '-name' },
  { label: 'Username A-Z', value: 'username' },
  { label: 'Username Z-A', value: '-username' },
  { label: 'Email A-Z', value: 'email' },
  { label: 'Email Z-A', value: '-email' },
]

const AdminItems = [
  { label: 'Everyone', value: ApiFilterEnum.none },
  { label: 'Admins', value: ApiFilterEnum.true },
  { label: 'Collaborators', value: ApiFilterEnum.false },
]

const ActivatedItems = [
  { label: 'All users', value: ApiFilterEnum.none },
  { label: 'Active users', value: ApiFilterEnum.true },
  { label: 'In-active users', value: ApiFilterEnum.false },
]

const FormClasses = {
  search: 'flex-auto px-2 py-4 w-full rounded-tr-md rounded-br-md md:w-auto',
  submit: 'hidden sr:block bg-gray-100 flex-2 px-2 py-3',
  firstFilter: 'rounded-tl-md rounded-bl-md pl-2',
  item: 'flex-1 flex justify-between text-base py-2 truncate',
  itemContent: 'flex justify-between flex-1 text-base truncate',
  icon: 'w-6 h-6 bg-gray-100 rounded-full list-item-type ml-3',
}

export function FormControls({ control, register, onChange, current }) {
  function _renderItem(label, value, target) {
    return (
      <span className={FormClasses.item}>
        <span className={FormClasses.itemContent}>{label}</span>
        {value === current[target] ? (
          <Icon
            className={FormClasses.icon}
            name="check"
            color="text-pink-500"
          />
        ) : (
          <span className={FormClasses.icon}></span>
        )}
      </span>
    )
  }
  return (
    <Card>
      <ControlGroup>
        <Controller
          name="activated"
          control={control}
          render={() => (
            <Select
              className={FormClasses.firstFilter}
              control={control}
              name="activated"
              items={ActivatedItems}
              renderItem={({ label, value }) =>
                _renderItem(label, value, 'activated')
              }
              value={find(
                ActivatedItems,
                ({ value }) => value === current?.activated
              )}
              onChange={({ value }) => {
                onChange({ activated: value })
              }}
            />
          )}
        />
        <Controller
          name="isAdmin"
          control={control}
          render={() => (
            <Select
              control={control}
              items={AdminItems}
              renderItem={({ label, value }) =>
                _renderItem(label, value, 'isAdmin')
              }
              value={find(
                AdminItems,
                ({ value }) => value === current?.isAdmin
              )}
              onChange={({ value }) => {
                onChange({ isAdmin: value })
              }}
            />
          )}
        />
        <Controller
          name="ordering"
          control={control}
          render={() => (
            <Select
              control={control}
              items={OrderingItems}
              renderItem={({ label, value }) =>
                _renderItem(label, value, 'ordering')
              }
              value={find(
                OrderingItems,
                ({ value }) => value === current?.ordering
              )}
              onChange={({ value }, name) => {
                onChange({ ordering: value })
              }}
            />
          )}
        />
        <TextInput
          aria-label="search users"
          className={FormClasses.search}
          name="search"
          ref={register}
          placeholder="Search"
          onChange={(event) => onChange({ search: event.target.value })}
        />
      </ControlGroup>
      {/* Hidden input for screen readers */}
      <input className={FormClasses.submit} type="submit" value="Submit" />
    </Card>
  )
}

FormControls.propTypes = {
  onChange: PropTypes.func.isRequired,
  register: PropTypes.func.isRequired,
  control: PropTypes.object.isRequired,
  current: PropTypes.object.isRequired,
  fetching: PropTypes.bool,
}
