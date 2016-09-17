import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import Router from '../components/Router'
import * as ItemsActions from '../actions/items'



function mapStateToProps(state) {
  return {
    onlineItems: state.items.onlineList,
    offlineItems: state.items.offlineList,
    connectionChecked: state.items.connectionChecked,
    connected: state.items.connected
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(ItemsActions, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(Router)
