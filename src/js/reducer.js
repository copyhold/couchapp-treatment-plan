import {Map,List,fromJS} from 'immutable'
import moment from 'moment'
const INIT = fromJS({
  day: moment().startOf('day'),
  start: 16,
  end: 22,
  revs: {},
  beds: [
    {
      id: 1
    },
    {
      id: 2
    },
    {
      id: 4
    },
    {
      id: 8
    }
  ],
  location: location.hash.substr(1),
  person: {},
  visit: {},
  clients: [],
  user: {},
  threat_length: moment.duration(40, 'minutes')
})
export default function(state=INIT, action) {
  switch (action.type) {
    case 'logout ok':
      return state.set('user', Map())
    case 'login ok':
      return state.set('user', fromJS(action.payload))
    case 'person loaded':
      return state.set('person', fromJS(action.payload))
    case 'update person':
      return state.merge('person', action.payload)
    case 'route':
      return state.set('location',action.payload.substr(1))
    case 'visit saved':
      return state.set('visit',Map())
    case 'saving visit':
      return state.setIn(['visit','saving'],true)
    case 'deselect visit':
      return state.set('visit',Map())
    case 'select visit':
      return state.set('visit', action.payload)
    case 'initiate visit':
      return state.set('visit', fromJS({
        visit: fromJS(action.payload),
        client: {},
        new: true
      }))
    case 'visits loaded':
      const bed = state.get('beds').findEntry( bed => bed.get('id')===action.payload.bed )
      return state.setIn(['beds', bed[0], 'visits'], fromJS(action.payload.visits))
    case 'set day':
      return state.set('day', moment(action.payload))
    case 'clients loaded':
      return state.set('clients', fromJS(action.payload))
    case 'beds loaded':
      const grouped = fromJS(action.payload).groupBy((v,k) => v.getIn(['visit','bed']))
      return state.withMutations(map => {
        grouped.forEach((bedvisits,bedid) => {
          const bed = state.get('beds').findEntry( bed => bed.get('id')===bedid )
          map.setIn(['beds', bed[0], 'visits'], bedvisits)
        })
      })
  }
  return state
}

Array.prototype.unique = function() {
  var o = {}, i, l = this.length, r = [];
  for(i=0; i<l;i+=1) o[this[i]] = this[i];
  for(i in o) r.push(o[i]);
  return r;
}
