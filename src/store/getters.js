const getters = {
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  token: state => state.user.token,
  avatar: state => state.user.avatar,
  name: state => state.user.userinfo.username,
  userId: state => state.user.userinfo.userId,
  staffPhoto: state => state.user.userinfo.staffPhoto,
  hrsassTime: state => state.user.hrsassTime
}
export default getters
