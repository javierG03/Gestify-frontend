import PropTypes from "prop-types"

const NotificationBadge = ({ count }) => {
  if (count <= 0) return null

  return (
    <div className="absolute -right-0.5 -top-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-gradient-to-r from-red-500 to-red-600 px-1.5 text-xs font-bold text-white shadow-sm animate-pulse">
      {count > 99 ? "99+" : count}
    </div>
  )
}

NotificationBadge.propTypes = {
  count: PropTypes.number.isRequired,
}

export default NotificationBadge
